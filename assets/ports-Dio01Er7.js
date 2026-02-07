const n=`'use strict';\r
\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import i18n from './../js/localization';\r
import serialPortHelper from './../js/serialPortHelper';\r
import jBox from 'jbox';\r
import {bridge, Platform} from '../js/bridge';\r
\r
const portsTab = {};\r
\r
portsTab.initialize = function (callback) {\r
\r
    var columns = ['data', 'logging', 'sensors', 'telemetry', 'rx', 'peripherals'];\r
    var mspWarningModal;\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    mspHelper.loadSerialPorts(function () {\r
        import('./ports.html?raw').then(({default: html}) => GUI.load(html, on_tab_loaded_handler));\r
    });\r
\r
    function checkMSPPortCount(excludeCheckbox) {\r
        let mspCount = 0;\r
\r
        $('.tab-ports .portConfiguration').each(function () {\r
            const $portConfig = $(this);\r
\r
            // Check each MSP checkbox in this port configuration\r
            $portConfig.find('input:checkbox[value="MSP"]').each(function() {\r
                const $checkbox = $(this);\r
                // Skip the checkbox we're currently changing (to get "before" count)\r
                if (excludeCheckbox && $checkbox.is(excludeCheckbox)) {\r
                    return;\r
                }\r
                if ($checkbox.is(':checked')) {\r
                    mspCount++;\r
                }\r
            });\r
        });\r
\r
        return mspCount;\r
    }\r
\r
    function showMSPWarning() {\r
        if (mspWarningModal && typeof mspWarningModal.open === 'function') {\r
            mspWarningModal.open();\r
        }\r
    }\r
\r
    function update_ui() {\r
\r
        $(".tab-ports").addClass("supported");\r
\r
        var i,\r
            $elements;\r
\r
        $elements = $('select.sensors_baudrate');\r
        for (i = 0; i < serialPortHelper.getBauds('SENSOR').length; i++) {\r
            $elements.append('<option value="' + serialPortHelper.getBauds('SENSOR')[i] + '">' + serialPortHelper.getBauds('SENSOR')[i] + '</option>');\r
        }\r
\r
        $elements = $('select.msp_baudrate');\r
        for (i = 0; i < serialPortHelper.getBauds('MSP').length; i++) {\r
            $elements.append('<option value="' + serialPortHelper.getBauds('MSP')[i] + '">' + serialPortHelper.getBauds('MSP')[i] + '</option>');\r
        }\r
\r
        $elements = $('select.telemetry_baudrate');\r
        for (i = 0; i < serialPortHelper.getBauds('TELEMETRY').length; i++) {\r
            $elements.append('<option value="' + serialPortHelper.getBauds('TELEMETRY')[i] + '">' + serialPortHelper.getBauds('TELEMETRY')[i] + '</option>');\r
        }\r
\r
        $elements = $('select.peripherals_baudrate');\r
        for (i = 0; i < serialPortHelper.getBauds('PERIPHERAL').length; i++) {\r
            $elements.append('<option value="' + serialPortHelper.getBauds('PERIPHERAL')[i] + '">' + serialPortHelper.getBauds('PERIPHERAL')[i] + '</option>');\r
        }\r
\r
        var ports_e = $('.tab-ports .ports');\r
        var port_configuration_template_e = $('#tab-ports-templates .portConfiguration');\r
\r
        for (var portIndex = 0; portIndex < FC.SERIAL_CONFIG.ports.length; portIndex++) {\r
            var port_configuration_e = port_configuration_template_e.clone();\r
            var serialPort = FC.SERIAL_CONFIG.ports[portIndex];\r
\r
            port_configuration_e.data('serialPort', serialPort);\r
            \r
            //Append only port different than USB VCP or UART 1 on Webassembly (serialEx port)\r
            if (serialPort.identifier == 20 || (bridge.getPlatform() === Platform.Web && serialPort.identifier == 0)) {\r
                continue;\r
            }          \r
  \r
            port_configuration_e.find('select.msp_baudrate').val(serialPort.msp_baudrate);\r
            port_configuration_e.find('select.telemetry_baudrate').val(serialPort.telemetry_baudrate);\r
            port_configuration_e.find('select.sensors_baudrate').val(serialPort.sensors_baudrate);\r
            port_configuration_e.find('select.peripherals_baudrate').val(serialPort.peripherals_baudrate);\r
\r
            port_configuration_e.find('.identifier').text(serialPortHelper.getPortName(serialPort.identifier));\r
            if (serialPort.identifier >= 30) {\r
                port_configuration_e.find('.softSerialWarning').css("display", "inline")\r
            } else {\r
                port_configuration_e.find('.softSerialWarning').css("display", "none")\r
            }\r
\r
            port_configuration_e.data('index', portIndex);\r
            port_configuration_e.data('port', serialPort);\r
\r
            for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {\r
                var column = columns[columnIndex];\r
\r
                var functions_e = $(port_configuration_e).find('.functionsCell-' + column);\r
                let functions_e_id = "portFunc-" + column + "-" + portIndex;\r
                functions_e.attr("id", functions_e_id);\r
\r
                for (i = 0; i < serialPortHelper.getRules().length; i++) {\r
                    var functionRule = serialPortHelper.getRules()[i];\r
                    var functionName = functionRule.name;\r
\r
                    if (functionRule.groups.indexOf(column) == -1) {\r
                        continue;\r
                    }\r
\r
                    var select_e;\r
                    if (column !== 'telemetry' && column !== 'peripherals' && column !== 'sensors') {\r
                        var checkboxId = 'functionCheckbox-' + portIndex + '-' + columnIndex + '-' + i;\r
                        functions_e.prepend('<span class="function"><input type="checkbox" class="togglemedium" id="' + checkboxId + '" value="' + functionName + '" /><label for="' + checkboxId + '"> ' + functionRule.displayName + '</label></span>');\r
\r
                        if (serialPort.functions.indexOf(functionName) >= 0) {\r
                            var checkbox_e = functions_e.find('#' + checkboxId);\r
                            checkbox_e.prop("checked", true);\r
                        }\r
\r
                    } else {\r
\r
                        var selectElementName = 'function-' + column;\r
                        var selectElementSelector = 'select[name=' + selectElementName + ']';\r
                        select_e = functions_e.find(selectElementSelector);\r
                        \r
                        if (select_e.length == 0) {\r
                            functions_e.prepend('<span class="function"><select id="' + selectElementName + '" name="' + selectElementName + '" class="function-select ' + selectElementName + '" /></span>');\r
                            \r
                            functions_e.find('#' + selectElementName).on('change', () => {\r
                                updateDefaultBaud(functions_e_id, column);\r
                            });\r
                            \r
                            select_e = functions_e.find(selectElementSelector);\r
                            var disabledText = i18n.getMessage('portsTelemetryDisabled');\r
                            select_e.append('<option value="">' + disabledText + '</option>');\r
                        }\r
                        select_e.append('<option value="' + functionName + '">' + functionRule.displayName + '</option>');\r
\r
                        if (serialPort.functions.indexOf(functionName) >= 0) {\r
                            select_e.val(functionName);\r
                        }\r
                    }\r
                }\r
            }\r
            ports_e.find('tbody').append(port_configuration_e);\r
\r
                       \r
        }\r
\r
        $('table.ports tbody').on('change', 'select', onSwitchChange);\r
        $('table.ports tbody').on('change', 'input', onSwitchChange);\r
    }\r
\r
    function onSwitchChange(e) {\r
        let $cT  = $(e.currentTarget);\r
\r
        let functionName = $cT.val();\r
        let rule = serialPortHelper.getRuleByName($cT.val());\r
\r
        //if type is checkbox then process only if selected\r
        if ($cT.is('input[type="checkbox"]') && !$cT.is(':checked')) {\r
            return;\r
        }\r
        //if type select then process only if selected\r
        if ($cT.is('select') && !functionName) {\r
            return;\r
        }\r
\r
        // Check if MSP checkbox was just checked\r
        if ($cT.is('input[type="checkbox"]') && $cT.val() === 'MSP' && $cT.is(':checked')) {\r
            // Count MSP ports excluding the one being changed to get "before" count\r
            const mspCountBefore = checkMSPPortCount($cT);\r
            // If we already had 2+ and are adding another, show warning\r
            if (mspCountBefore >= 2) {\r
                showMSPWarning();\r
            }\r
        }\r
\r
        if (rule && rule.isUnique) {\r
            let $selects = $cT.closest('tr').find('.function-select');\r
            $selects.each(function (index, element) {\r
\r
                let $element = $(element);\r
\r
                if ($element.val() != functionName) {\r
                    $element.val('');\r
                }\r
            });\r
\r
            let $checkboxes = $cT.closest('tr').find('input[type="checkbox"]');\r
            $checkboxes.each(function (index, element) {\r
                let $element = $(element);\r
\r
                if ($element.val() != functionName) {\r
                    $element.prop('checked', false);\r
                    $element.trigger('change');\r
                }\r
            });\r
        }\r
\r
    }\r
\r
    function on_tab_loaded_handler() {\r
\r
       i18n.localize();;\r
\r
        update_ui();\r
\r
        // Initialize the MSP warning modal\r
        mspWarningModal = new jBox('Modal', {\r
            width: 480,\r
            height: 200,\r
            closeButton: 'title',\r
            animation: false,\r
            title: i18n.getMessage('portsMspWarningTitle') || 'MSP Port Warning',\r
            content: $('#mspWarningContent')\r
        });\r
\r
        // Check if more than 2 MSP ports are already configured on load\r
        const initialMspCount = checkMSPPortCount();\r
        if (initialMspCount > 2) {\r
            showMSPWarning();\r
        }\r
\r
        $('a.save').on('click', on_save_handler);\r
\r
        GUI.content_ready(callback);\r
    }\r
\r
   function on_save_handler() {\r
\r
        //Clear ports of any previous for serials different than USB VCP\r
        FC.SERIAL_CONFIG.ports = FC.SERIAL_CONFIG.ports.filter(item => item.identifier == 20)\r
\r
        $('.tab-ports .portConfiguration').each(function () {\r
\r
            var portConfiguration_e = this;\r
\r
            var oldSerialPort = $(this).data('serialPort');\r
\r
            if (oldSerialPort.identifier == 20) {\r
                return;\r
            }\r
\r
            var functions = $(portConfiguration_e).find('input:checkbox:checked').map(function() {\r
                return this.value;\r
            }).get();\r
\r
            var telemetryFunction = $(portConfiguration_e).find('select[name=function-telemetry]').val();\r
            if (telemetryFunction) {\r
                functions.push(telemetryFunction);\r
            }\r
\r
            var peripheralFunction = $(portConfiguration_e).find('select[name=function-peripherals]').val();\r
            if (peripheralFunction) {\r
                functions.push(peripheralFunction);\r
            }\r
\r
            var sensorsFunction = $(portConfiguration_e).find('select[name=function-sensors]').val();\r
            if (sensorsFunction) {\r
                functions.push(sensorsFunction);\r
            }\r
\r
            var serialPort = {\r
                functions: functions,\r
                msp_baudrate: $(portConfiguration_e).find('.msp_baudrate').val(),\r
                telemetry_baudrate: $(portConfiguration_e).find('.telemetry_baudrate').val(),\r
                sensors_baudrate: $(portConfiguration_e).find('.sensors_baudrate').val(),\r
                peripherals_baudrate: $(portConfiguration_e).find('.peripherals_baudrate').val(),\r
                identifier: oldSerialPort.identifier\r
            };\r
            FC.SERIAL_CONFIG.ports.push(serialPort);\r
        });\r
\r
        mspHelper.saveSerialPorts(save_to_eeprom);\r
\r
        function save_to_eeprom() {\r
            MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, on_saved_handler);\r
        }\r
\r
        function on_saved_handler() {\r
            GUI.log(i18n.getMessage('configurationEepromSaved'));\r
\r
            GUI.tab_switch_cleanup(function() {\r
                MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, on_reboot_success_handler);\r
            });\r
        }\r
\r
        function on_reboot_success_handler() {\r
            GUI.log(i18n.getMessage('deviceRebooting'));\r
            GUI.handleReconnect($('.tab_ports a'));\r
        }\r
    }\r
};\r
\r
function updateDefaultBaud(baudSelect, column) {\r
    let section = $("#" + baudSelect);\r
    let portName = section.find('.function-' + column).val();\r
    let baudRate = (column === 'telemetry') ? "AUTO" : 115200;;\r
\r
    let rule = serialPortHelper.getRuleByName(portName);\r
\r
    if (rule && typeof rule.defaultBaud !== 'undefined') {\r
        baudRate = rule.defaultBaud;\r
    }\r
\r
    section.find("." + column + "_baudrate").children('[value=' + baudRate + ']').prop('selected', true);\r
}\r
\r
portsTab.cleanup = function (callback) {\r
    $('.jBox-wrapper').remove();\r
    if (callback) callback();\r
};\r
\r
export default portsTab;\r
`;export{n as default};
