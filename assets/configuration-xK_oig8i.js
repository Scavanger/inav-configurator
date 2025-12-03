const n=`'use strict';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import interval from './../js/intervals';\r
import VTX from './../js/vtx';\r
import i18n from './../js/localization';\r
import Settings from './../js/settings';\r
import features from './../js/feature_framework';\r
\r
const configurationTab = {};\r
\r
configurationTab.initialize = function (callback, scrollPosition) {\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    var loadChainer = new MSPChainerClass();\r
\r
    var loadChain = [\r
        mspHelper.loadFeatures,\r
        mspHelper.loadSensorAlignment,\r
        mspHelper.loadAdvancedConfig,\r
        mspHelper.loadVTXConfig,\r
        mspHelper.loadBoardAlignment,\r
        mspHelper.loadCurrentMeterConfig,\r
        mspHelper.loadMiscV2\r
    ];\r
\r
    loadChainer.setChain(loadChain);\r
    loadChainer.setExitPoint(load_html);\r
    loadChainer.execute();\r
\r
    var saveChainer = new MSPChainerClass();\r
\r
    var saveChain = [\r
        mspHelper.saveAccTrim,\r
        mspHelper.saveAdvancedConfig,\r
        mspHelper.saveVTXConfig,\r
        mspHelper.saveCurrentMeterConfig,\r
        mspHelper.saveMiscV2,\r
        saveSettings,\r
        mspHelper.saveToEeprom\r
    ];\r
\r
    function saveSettings(onComplete) {\r
        Settings.saveInputs(onComplete);\r
    }\r
\r
    saveChainer.setChain(saveChain);\r
    saveChainer.setExitPoint(reboot);\r
\r
    function reboot() {\r
        //noinspection JSUnresolvedVariable\r
        GUI.log(i18n.getMessage('configurationEepromSaved'));\r
\r
        GUI.tab_switch_cleanup(function () {\r
            MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitialize);\r
        });\r
    }\r
\r
    function reinitialize() {\r
        //noinspection JSUnresolvedVariable\r
        GUI.log(i18n.getMessage('deviceRebooting'));\r
        GUI.handleReconnect($('.tab_configuration a'));\r
    }\r
\r
    function load_html() {\r
        import('./configuration.html?raw').then(({default: html}) => GUI.load(html, Settings.processHtml(process_html)));\r
    }\r
\r
    function process_html() {\r
\r
        let i;\r
\r
        // generate features\r
        var fcFeatures = FC.getFeatures();\r
\r
        var features_e = $('.features');\r
        for (let i = 0; i < fcFeatures.length; i++) {\r
            var row_e,\r
                tips = [],\r
                feature_tip_html = '';\r
\r
            if (fcFeatures[i].showNameInTip) {\r
                tips.push(i18n.getMessage("manualEnablingTemplate").replace("{name}", fcFeatures[i].name));\r
            }\r
\r
            if (fcFeatures[i].haveTip) {\r
                tips.push(i18n.getMessage("feature" + fcFeatures[i].name + "Tip"));\r
            }\r
\r
            if (tips.length > 0) {\r
                feature_tip_html = '<div class="helpicon cf_tip" title="' + tips.join("<br><br>") + '"></div>';\r
            }\r
\r
            row_e = $('<div class="checkbox">' +\r
                '<input type="checkbox" data-bit="' + fcFeatures[i].bit + '" class="feature toggle" name="' + fcFeatures[i].name + '" title="' + fcFeatures[i].name + '"' +\r
                ' id="feature-' + fcFeatures[i].bit + '" ' +\r
                '>' +\r
                '<label for="feature-' + fcFeatures[i].bit + '">' +\r
                '<span data-i18n="feature' + fcFeatures[i].name + '"></span>' +\r
                '</label>' +\r
                feature_tip_html +\r
                '</div>');\r
\r
            features_e.each(function () {\r
                if ($(this).hasClass(fcFeatures[i].group)) {\r
                    $(this).after(row_e);\r
                }\r
            });\r
        }\r
\r
        features.updateUI($('.tab-configuration'), FC.FEATURES);\r
\r
        // translate to user-selected language\r
       i18n.localize();;\r
\r
        // VTX\r
        var config_vtx = $('.config-vtx');\r
        if (FC.VTX_CONFIG.device_type != VTX.DEV_UNKNOWN) {\r
\r
            var vtx_band = $('#vtx_band');\r
            vtx_band.empty();\r
            var vtx_no_band_note = $('#vtx_no_band');\r
            if (FC.VTX_CONFIG.band < VTX.BAND_MIN || FC.VTX_CONFIG.band > VTX.BAND_MAX) {\r
                var noBandName = i18n.getMessage("configurationNoBand");\r
                $('<option value="0">' + noBandName + '</option>').appendTo(vtx_band);\r
                vtx_no_band_note.show();\r
            } else {\r
                vtx_no_band_note.hide();\r
            }\r
            for (var ii = 0; ii < VTX.BANDS.length; ii++) {\r
                var band_name = VTX.BANDS[ii].name;\r
                var option = $('<option value="' + VTX.BANDS[ii].code + '">' + band_name + '</option>');\r
                if (VTX.BANDS[ii].code == FC.VTX_CONFIG.band) {\r
                    option.prop('selected', true);\r
                }\r
                option.appendTo(vtx_band);\r
            }\r
            vtx_band.on('change', function () {\r
                FC.VTX_CONFIG.band = parseInt($(this).val());\r
            });\r
\r
            var vtx_channel = $('#vtx_channel');\r
            vtx_channel.empty();\r
            for (var ii = VTX.CHANNEL_MIN; ii <= VTX.CHANNEL_MAX; ii++) {\r
                var option = $('<option value="' + ii + '">' + ii + '</option>');\r
                if (ii == FC.VTX_CONFIG.channel) {\r
                    option.prop('selected', true);\r
                }\r
                option.appendTo(vtx_channel);\r
            }\r
            vtx_channel.on('change', function () {\r
                FC.VTX_CONFIG.channel = parseInt($(this).val());\r
            });\r
\r
            var vtx_power = $('#vtx_power');\r
            vtx_power.empty();\r
            var minPower = VTX.getMinPower(FC.VTX_CONFIG.device_type);\r
            var maxPower = VTX.getMaxPower(FC.VTX_CONFIG.device_type);\r
            for (var ii = minPower; ii <= maxPower; ii++) {\r
                var option = $('<option value="' + ii + '">' + ii + '</option>');\r
                if (ii == FC.VTX_CONFIG.power) {\r
                    option.prop('selected', true);\r
                }\r
                option.appendTo(vtx_power);\r
            }\r
            vtx_power.on('change', function () {\r
                FC.VTX_CONFIG.power = parseInt($(this).val());\r
            });\r
\r
            var vtx_low_power_disarm = $('#vtx_low_power_disarm');\r
            vtx_low_power_disarm.empty();\r
            for (var ii = VTX.LOW_POWER_DISARM_MIN; ii <= VTX.LOW_POWER_DISARM_MAX; ii++) {\r
                var name = i18n.getMessage("configurationVTXLowPowerDisarmValue_" + ii);\r
                if (!name) {\r
                    name = ii;\r
                }\r
                var option = $('<option value="' + ii + '">' + name + '</option>');\r
                if (ii == FC.VTX_CONFIG.low_power_disarm) {\r
                    option.prop('selected', true);\r
                }\r
                option.appendTo(vtx_low_power_disarm);\r
            }\r
            vtx_low_power_disarm.on('change', function () {\r
                FC.VTX_CONFIG.low_power_disarm = parseInt($(this).val());\r
            });\r
\r
            config_vtx.show();\r
        } else {\r
            config_vtx.hide();\r
        }\r
\r
        // for some odd reason chrome 38+ changes scroll according to the touched select element\r
        // i am guessing this is a bug, since this wasn't happening on 37\r
        // code below is a temporary fix, which we will be able to remove in the future (hopefully)\r
        //noinspection JSValidateTypes\r
        $('#content').scrollTop((scrollPosition) ? scrollPosition : 0);\r
\r
        // fill board alignment\r
        $('input[name="board_align_yaw"]').val((FC.BOARD_ALIGNMENT.yaw / 10.0).toFixed(1));\r
\r
        // fill magnetometer\r
        //UPDATE: moved to GPS tab and hidden\r
        //$('#mag_declination').val(FC.MISC.mag_declination);\r
\r
        // fill battery voltage\r
        $('#voltagesource').val(FC.MISC.voltage_source);\r
        $('#cells').val(FC.MISC.battery_cells);\r
        $('#celldetectvoltage').val(FC.MISC.vbatdetectcellvoltage);\r
        $('#mincellvoltage').val(FC.MISC.vbatmincellvoltage);\r
        $('#maxcellvoltage').val(FC.MISC.vbatmaxcellvoltage);\r
        $('#warningcellvoltage').val(FC.MISC.vbatwarningcellvoltage);\r
        $('#voltagescale').val(FC.MISC.vbatscale);\r
\r
        // fill current\r
        $('#currentscale').val(FC.CURRENT_METER_CONFIG.scale);\r
        $('#currentoffset').val(FC.CURRENT_METER_CONFIG.offset / 10);\r
\r
        // fill battery capacity\r
        $('#battery_capacity').val(FC.MISC.battery_capacity);\r
        let batCapWarn = Math.round(FC.MISC.battery_capacity_warning * 100 / FC.MISC.battery_capacity);\r
        $('#battery_capacity_warning').val(isNaN(batCapWarn) ? "" : batCapWarn);\r
        let batCapWarnCrit = Math.round(FC.MISC.battery_capacity_critical * 100 / FC.MISC.battery_capacity);\r
        $('#battery_capacity_critical').val(isNaN(batCapWarnCrit) ? "" : batCapWarnCrit);\r
        $('#battery_capacity_unit').val(FC.MISC.battery_capacity_unit);\r
\r
        let $i2cSpeed = $('#i2c_speed'),\r
            $i2cSpeedInfo = $('#i2c_speed-info');\r
\r
        $i2cSpeed.on('change', function () {\r
            let $this = $(this),\r
                value = $this.children("option:selected").text();\r
\r
            if (value == "400KHZ") {\r
\r
                $i2cSpeedInfo.removeClass('ok-box');\r
                $i2cSpeedInfo.addClass('info-box');\r
                $i2cSpeedInfo.removeClass('warning-box');\r
\r
                $i2cSpeedInfo.html(i18n.getMessage('i2cSpeedSuggested800khz'));\r
                $i2cSpeedInfo.show();\r
\r
            } else if (value == "800KHZ") {\r
                $i2cSpeedInfo.removeClass('ok-box');\r
                $i2cSpeedInfo.removeClass('info-box');\r
                $i2cSpeedInfo.removeClass('warning-box');\r
                $i2cSpeedInfo.hide();\r
            } else {\r
                $i2cSpeedInfo.removeClass('ok-box');\r
                $i2cSpeedInfo.removeClass('info-box');\r
                $i2cSpeedInfo.addClass('warning-box');\r
                $i2cSpeedInfo.html(i18n.getMessage('i2cSpeedTooLow'));\r
                $i2cSpeedInfo.show();\r
            }\r
\r
        });\r
\r
        $i2cSpeed.trigger('change');\r
\r
        $('a.save').on('click', function () {\r
            //UPDATE: moved to GPS tab and hidden\r
            //FC.MISC.mag_declination = parseFloat($('#mag_declination').val());\r
\r
            FC.MISC.battery_cells = parseInt($('#cells').val());\r
            FC.MISC.voltage_source = parseInt($('#voltagesource').val());\r
            FC.MISC.vbatdetectcellvoltage = parseFloat($('#celldetectvoltage').val());\r
            FC.MISC.vbatmincellvoltage = parseFloat($('#mincellvoltage').val());\r
            FC.MISC.vbatmaxcellvoltage = parseFloat($('#maxcellvoltage').val());\r
            FC.MISC.vbatwarningcellvoltage = parseFloat($('#warningcellvoltage').val());\r
            FC.MISC.vbatscale = parseInt($('#voltagescale').val());\r
\r
            FC.MISC.battery_capacity = parseInt($('#battery_capacity').val());\r
            FC.MISC.battery_capacity_warning = parseInt($('#battery_capacity_warning').val() * FC.MISC.battery_capacity / 100);\r
            FC.MISC.battery_capacity_critical = parseInt($('#battery_capacity_critical').val() * FC.MISC.battery_capacity / 100);\r
            FC.MISC.battery_capacity_unit = $('#battery_capacity_unit').val();\r
\r
            features.reset();\r
            features.fromUI($('.tab-configuration'));\r
            features.execute(function () {\r
                FC.CURRENT_METER_CONFIG.scale = parseInt($('#currentscale').val());\r
                FC.CURRENT_METER_CONFIG.offset = Math.round(parseFloat($('#currentoffset').val()) * 10);\r
                saveChainer.execute();\r
            });\r
        });\r
        interval.add('config_load_analog', function () {\r
            $('#batteryvoltage').val([FC.ANALOG.voltage.toFixed(2)]);\r
            $('#batterycurrent').val([FC.ANALOG.amperage.toFixed(2)]);\r
        }, 100, true); // 10 fps\r
\r
        GUI.content_ready(callback);\r
    }\r
};\r
\r
configurationTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default configurationTab;`;export{n as default};
