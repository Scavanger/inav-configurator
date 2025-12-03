const n=`'use strict';\r
\r
import wNumb from 'wnumb/wNumb';\r
import noUiSlider from 'nouislider';\r
\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import i18n from './../js/localization';\r
import interval from './../js/intervals';\r
\r
const adjustmentsTab = {};\r
\r
adjustmentsTab.initialize = function (callback) {\r
    \r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    MSP.send_message(MSPCodes.MSP_ADJUSTMENT_RANGES, false, false, get_rc_data);\r
\r
    function get_rc_data() {\r
        MSP.send_message(MSPCodes.MSP_RC, false, false, load_html);\r
    }\r
\r
    function load_html() {\r
        import('./adjustments.html?raw').then(({default: html}) => GUI.load(html, process_html));\r
    }\r
\r
    function addAdjustment(adjustmentIndex, adjustmentRange, auxChannelCount) {\r
\r
        var template = $('#tab-adjustments-templates').find('.adjustments .adjustment');\r
        var newAdjustment = template.clone();\r
\r
        $(newAdjustment).attr('id', 'adjustment-' + adjustmentIndex);\r
        $(newAdjustment).data('index', adjustmentIndex);\r
\r
        //\r
        // update selected slot\r
        //\r
\r
        var channelList = $(newAdjustment).find('.adjustmentSlot .slot');\r
        channelList.val(adjustmentRange.slotIndex);\r
\r
        //\r
        // populate source channel select box\r
        //\r
\r
        var channelList = $(newAdjustment).find('.channelInfo .channel');\r
        var channelOptionTemplate = $(channelList).find('option');\r
        channelOptionTemplate.remove();\r
        for (var channelIndex = 0; channelIndex < auxChannelCount; channelIndex++) {\r
            var channelOption = channelOptionTemplate.clone();\r
            channelOption.text('CH ' + (channelIndex + 5));\r
            channelOption.val(channelIndex);\r
            channelList.append(channelOption);\r
        }\r
        channelList.val(adjustmentRange.auxChannelIndex);\r
\r
        //\r
        // update selected function\r
        //\r
\r
        var functionList = $(newAdjustment).find('.functionSelection .function');\r
\r
        // update list of selected functions\r
        var functionListOptions = $(functionList).find('option');\r
        var availableFunctionCount = 59; // Set this to highest adjustment value + 1\r
\r
        var functionListOptions = $(functionListOptions).slice(0,availableFunctionCount);\r
        //functionList.empty().append(functionListOptions);\r
\r
        functionList.val(adjustmentRange.adjustmentFunction);\r
\r
\r
\r
        //\r
        // populate function channel select box\r
        //\r
\r
        var channelList = $(newAdjustment).find('.functionSwitchChannel .channel');\r
        var channelOptionTemplate = $(channelList).find('option');\r
        channelOptionTemplate.remove();\r
        for (var channelIndex = 0; channelIndex < auxChannelCount; channelIndex++) {\r
            var channelOption = channelOptionTemplate.clone();\r
            channelOption.text('CH ' + (channelIndex + 5));\r
            channelOption.val(channelIndex);\r
            channelList.append(channelOption);\r
        }\r
        channelList.val(adjustmentRange.auxSwitchChannelIndex);\r
\r
        //\r
        // configure range\r
        //\r
\r
        var channel_range = {\r
                'min': [  900 ],\r
                'max': [ 2100 ]\r
            };\r
\r
        var defaultRangeValues = [1300, 1700];\r
        var rangeValues = defaultRangeValues;\r
        if (adjustmentRange.range != undefined) {\r
            rangeValues = [adjustmentRange.range.start, adjustmentRange.range.end];\r
        }\r
\r
        var slider = $(newAdjustment).find('.channel-slider')[0];\r
\r
        noUiSlider.create(slider, {\r
            start: rangeValues,\r
            behaviour: 'snap-drag',\r
            margin: 50,\r
            step: 25,\r
            connect: true,\r
            range: channel_range,\r
            format: wNumb({\r
                decimals: 0\r
            }),\r
            pips: {\r
                mode: 'values',\r
                values: [900, 1000, 1200, 1400, 1500, 1600, 1800, 2000, 2100],\r
                density: 4,\r
                stepped: true\r
            }\r
        });\r
\r
        slider.noUiSlider.on('update', values => {\r
            $(newAdjustment).find('.lowerLimitValue').text(values[0]);\r
            $(newAdjustment).find('.upperLimitValue').text(values[1]);\r
        });\r
\r
        //\r
        // add the enable/disable behavior\r
        //\r
\r
        var enableElement = $(newAdjustment).find('.enable');\r
        $(enableElement).data('adjustmentElement', newAdjustment);\r
        $(enableElement).on('change', function () {\r
            var adjustmentElement = $(this).data('adjustmentElement');\r
            if ($(this).prop("checked")) {\r
                $(adjustmentElement).find(':input').prop("disabled", false);\r
                $(adjustmentElement).find('.channel-slider').removeAttr("disabled");\r
                var rangeElement = $(adjustmentElement).find('.range .channel-slider');\r
                var range = $(rangeElement).val();\r
                if (range[0] == range[1]) {\r
                    var defaultRangeValues = [1300, 1700];\r
                    $(rangeElement).val(defaultRangeValues);\r
                }\r
            } else {\r
                $(adjustmentElement).find(':input').prop("disabled", true);\r
                $(adjustmentElement).find('.channel-slider').attr("disabled", "disabled");\r
            }\r
\r
            // keep this element enabled\r
            $(this).prop("disabled", false);\r
        });\r
\r
        var isEnabled = (adjustmentRange.range.start != adjustmentRange.range.end);\r
        $(enableElement).prop("checked", isEnabled).trigger('change');\r
\r
        return newAdjustment;\r
    }\r
\r
    function process_html() {\r
\r
        var auxChannelCount = FC.RC.active_channels - 4;\r
\r
        var modeTableBodyElement = $('.tab-adjustments .adjustments tbody')\r
        for (var adjustmentIndex = 0; adjustmentIndex < FC.ADJUSTMENT_RANGES.length; adjustmentIndex++) {\r
            var newAdjustment = addAdjustment(adjustmentIndex, FC.ADJUSTMENT_RANGES[adjustmentIndex], auxChannelCount);\r
            modeTableBodyElement.append(newAdjustment);\r
        }\r
\r
        // translate to user-selected language\r
       i18n.localize();;\r
\r
        // UI Hooks\r
        $('a.save').on('click', function () {\r
\r
            // update internal data structures based on current UI elements\r
            var requiredAdjustmentRangeCount = FC.ADJUSTMENT_RANGES.length;\r
\r
            FC.ADJUSTMENT_RANGES = [];\r
\r
            var defaultAdjustmentRange = {\r
                slotIndex: 0,\r
                auxChannelIndex: 0,\r
                range: {\r
                    start: 900,\r
                    end: 900\r
                },\r
                adjustmentFunction: 0,\r
                auxSwitchChannelIndex: 0\r
            };\r
\r
            $('.tab-adjustments .adjustments .adjustment').each(function () {\r
                var adjustmentElement = $(this);\r
\r
                if ($(adjustmentElement).find('.enable').prop("checked")) {\r
                    var rangeValues = $(this).find('.range .channel-slider')[0].noUiSlider.get(true);\r
                    var adjustmentRange = {\r
                        slotIndex: parseInt($(this).find('.adjustmentSlot .slot').val()),\r
                        auxChannelIndex: parseInt($(this).find('.channelInfo .channel').val()),\r
                        range: {\r
                            start: rangeValues[0],\r
                            end: rangeValues[1]\r
                        },\r
                        adjustmentFunction: parseInt($(this).find('.functionSelection .function').val()),\r
                        auxSwitchChannelIndex: parseInt($(this).find('.functionSwitchChannel .channel').val())\r
                    };\r
                    FC.ADJUSTMENT_RANGES.push(adjustmentRange);\r
                } else {\r
                    FC.ADJUSTMENT_RANGES.push(defaultAdjustmentRange);\r
                }\r
            });\r
\r
            for (var adjustmentRangeIndex = FC.ADJUSTMENT_RANGES.length; adjustmentRangeIndex < requiredAdjustmentRangeCount; adjustmentRangeIndex++) {\r
                FC.ADJUSTMENT_RANGES.push(defaultAdjustmentRange);\r
            }\r
\r
            //\r
            // send data to FC\r
            //\r
            mspHelper.sendAdjustmentRanges(save_to_eeprom);\r
\r
            function save_to_eeprom() {\r
                MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {\r
                    GUI.log(i18n.getMessage('adjustmentsEepromSaved'));\r
                });\r
            }\r
\r
        });\r
\r
        function update_marker(auxChannelIndex, channelPosition) {\r
            if (channelPosition < 900) {\r
                channelPosition = 900;\r
            } else if (channelPosition > 2100) {\r
                channelPosition = 2100;\r
            }\r
            var percentage = (channelPosition - 900) / (2100-900) * 100;\r
\r
            $('.adjustments .adjustment').each( function () {\r
                var auxChannelCandidateIndex = $(this).find('.channel').val();\r
                if (auxChannelCandidateIndex != auxChannelIndex) {\r
                    return;\r
                }\r
\r
                $(this).find('.range .marker').css('left', percentage + '%');\r
            });\r
        }\r
\r
        // data pulling functions used inside interval timer\r
        function get_rc_data() {\r
            MSP.send_message(MSPCodes.MSP_RC, false, false, update_ui);\r
        }\r
\r
        function update_ui() {\r
            var auxChannelCount = FC.RC.active_channels - 4;\r
\r
            for (var auxChannelIndex = 0; auxChannelIndex < auxChannelCount; auxChannelIndex++) {\r
                update_marker(auxChannelIndex, FC.RC.channels[auxChannelIndex + 4]);\r
            }\r
        }\r
\r
        // update ui instantly on first load\r
        update_ui();\r
\r
        // enable data pulling\r
        interval.add('aux_data_pull', get_rc_data, 50);\r
\r
        GUI.content_ready(callback);\r
    }\r
};\r
\r
adjustmentsTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default adjustmentsTab;\r
`;export{n as default};
