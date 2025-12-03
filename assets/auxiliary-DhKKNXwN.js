const n=`'use strict';\r
\r
\r
import wNumb from 'wnumb/wNumb';\r
import noUiSlider from 'nouislider';\r
\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import adjustBoxNameIfPeripheralWithModeID from './../js/peripherals';\r
import i18n from './../js/localization';\r
import interval from './../js/intervals';\r
import bridge from './../js/bridge';\r
\r
\r
var ORIG_AUX_CONFIG_IDS = [];\r
\r
const auxiliaryTab = {};\r
\r
auxiliaryTab.initialize = function (callback) {\r
    \r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    };\r
\r
    let LOCAL_AUX_CONFIG = [];\r
    let LOCAL_AUX_CONFIG_IDS = [];\r
    let prevChannelsValues = null;\r
\r
    MSP.send_message(MSPCodes.MSP_MODE_RANGES, false, false, get_box_ids);\r
\r
    function get_box_ids() {\r
        MSP.send_message(MSPCodes.MSP_BOXIDS, false, false, function () {\r
            FC.generateAuxConfig();\r
\r
            //Copy global settings into local ones\r
            LOCAL_AUX_CONFIG = Array.from(FC.AUX_CONFIG);\r
            LOCAL_AUX_CONFIG_IDS = Array.from(FC.AUX_CONFIG_IDS);\r
\r
            get_rc_data();\r
        });\r
    }\r
\r
    function get_rc_data() {\r
        MSP.send_message(MSPCodes.MSP_RC, false, false, load_html);\r
    }\r
\r
    function load_html() {\r
        sort_modes_for_display();\r
        import('./auxiliary.html?raw').then(({default: html}) => GUI.load(html, process_html));\r
    }\r
\r
    // This object separates out the dividers. This is also used to order the modes\r
    const modeSections = {};\r
        modeSections["Arming"] = ["ARM", "PREARM"];\r
        modeSections["Flight Modes"] = ["ANGLE", "HORIZON", "MANUAL", "ANGLE HOLD"];\r
        modeSections["Navigation Modes"] = ["NAV COURSE HOLD", "NAV CRUISE", "NAV POSHOLD", "NAV RTH", "NAV WP", "GCS NAV"];\r
        modeSections["Flight Mode Modifiers"] = ["NAV ALTHOLD", "HEADING HOLD", "AIR MODE", "SOARING", "SURFACE", "TURN ASSIST"];\r
        modeSections["Fixed Wing"] = ["AUTO TUNE", "SERVO AUTOTRIM", "AUTO LEVEL TRIM", "NAV LAUNCH", "LOITER CHANGE", "FLAPERON"];\r
        modeSections["Multi-rotor"] = ["FPV ANGLE MIX", "TURTLE", "MC BRAKING", "HEADFREE", "HEADADJ"];\r
        modeSections["OSD Modes"] = ["OSD OFF", "OSD ALT 1", "OSD ALT 2", "OSD ALT 3"];\r
        modeSections["FPV Camera Modes"] = ["CAMSTAB", "CAMERA CONTROL 1", "CAMERA CONTROL 2", "CAMERA CONTROL 3"];\r
        modeSections["VTOL"] = ["MIXER PROFILE 2", "MIXER TRANSITION"];\r
        modeSections["Beeper"] = ["BEEPER", "BEEPER MUTE"];\r
        modeSections["Gimbal"] = ["GIMBAL LEVEL TILT", "GIMBAL LEVEL ROLL", "GIMBAL LEVEL PAN", "GIMBAL HEADTRACKER", "GIMBAL CENTER"];\r
        modeSections["Misc Modes"] = ["LEDS OFF", "LIGHTS", "HOME RESET", "WP PLANNER", "MISSION CHANGE", "BLACKBOX", "FAILSAFE", "KILLSWITCH", "TELEMETRY", "MSP RC OVERRIDE", "USER1", "USER2", "USER3", "USER4"];\r
\r
    function sort_modes_for_display() {\r
        // Sort the modes\r
        var tmpAUX_CONFIG = [];\r
        var tmpAUX_CONFIG_IDS =[];\r
        var found = false;\r
        var sortedID = 0;\r
\r
        for (let i=0; i<LOCAL_AUX_CONFIG.length; i++) {\r
            tmpAUX_CONFIG[i] = LOCAL_AUX_CONFIG[i];\r
            tmpAUX_CONFIG_IDS[i] = LOCAL_AUX_CONFIG_IDS[i];\r
        }\r
\r
        LOCAL_AUX_CONFIG = [];\r
        LOCAL_AUX_CONFIG_IDS = [];\r
\r
        for (let categoryModesIndex in modeSections) {\r
            let categoryModes = modeSections[categoryModesIndex];\r
            for (let cM=0; cM<categoryModes.length; cM++){\r
                for(let j=0; j<tmpAUX_CONFIG.length; j++) {\r
                    if (categoryModes[cM] === tmpAUX_CONFIG[j]) {\r
                        LOCAL_AUX_CONFIG[sortedID] = tmpAUX_CONFIG[j];\r
                        LOCAL_AUX_CONFIG_IDS[sortedID] = tmpAUX_CONFIG_IDS[j];\r
                        ORIG_AUX_CONFIG_IDS[sortedID++] = j;\r
\r
                        break;\r
                    }\r
                }\r
            }\r
        }\r
\r
        // There are modes that are missing from the modeSections object. Add them to the end until they are ordered correctly.\r
        if (tmpAUX_CONFIG.length > LOCAL_AUX_CONFIG.length) {\r
            for (let i=0; i<tmpAUX_CONFIG.length; i++) {\r
                found = false;\r
                for (let j=0; j<LOCAL_AUX_CONFIG.length; j++) {\r
                    if (tmpAUX_CONFIG[i] === LOCAL_AUX_CONFIG[j]) {\r
                        found = true;\r
                        break;\r
                    }\r
                }\r
\r
                if (!found) {\r
                    LOCAL_AUX_CONFIG[sortedID] = tmpAUX_CONFIG[i];\r
                    LOCAL_AUX_CONFIG_IDS[sortedID] = tmpAUX_CONFIG_IDS[i];\r
                    ORIG_AUX_CONFIG_IDS[sortedID++] = i;\r
                }\r
            }\r
        }\r
    }\r
\r
    function createModeSection(sectionName) {\r
        var modeSectionTemplate = $('#tab-auxiliary-templates .modeSection');\r
        var newModeSection = modeSectionTemplate.clone();\r
        $(newModeSection).attr('id', 'section-' + sectionName);\r
        $(newModeSection).find('.modeSectionName').text(sectionName);\r
\r
        return newModeSection;\r
    }\r
\r
    function createMode(modeIndex, modeId) {\r
        var modeTemplate = $('#tab-auxiliary-templates .mode');\r
        var newMode = modeTemplate.clone();\r
        var modeName = LOCAL_AUX_CONFIG[modeIndex];\r
\r
        // If the runcam split peripheral is used, then adjust the boxname(BOXCAMERA1, BOXCAMERA2, BOXCAMERA3)\r
        // If platform is fixed wing, rename POS HOLD to LOITER\r
        modeName = adjustBoxNameIfPeripheralWithModeID(modeId, modeName);\r
\r
        $(newMode).attr('id', 'mode-' + modeIndex);\r
        $(newMode).find('.name').text(modeName);\r
\r
        $(newMode).data('index', modeIndex);\r
        $(newMode).data('id', modeId);\r
        $(newMode).data('origId', ORIG_AUX_CONFIG_IDS[modeIndex]);\r
        $(newMode).data('modeName', LOCAL_AUX_CONFIG[modeIndex]);\r
\r
        $(newMode).find('.name').data('modeElement', newMode);\r
        $(newMode).find('a.addRange').data('modeElement', newMode);\r
\r
        return newMode;\r
    }\r
\r
    function configureRangeTemplate(auxChannelCount) {\r
\r
        var rangeTemplate = $('#tab-auxiliary-templates .range');\r
\r
        var channelList = $(rangeTemplate).find('.channel');\r
        var channelOptionTemplate = $(channelList).find('option');\r
        channelOptionTemplate.remove();\r
\r
        //add value to autodetect channel\r
        let channelOption = channelOptionTemplate.clone();\r
        channelOption.text(i18n.getMessage('auxiliaryAutoChannelSelect'));\r
        channelOption.val(-1);\r
        channelList.append(channelOption);\r
\r
        for (var channelIndex = 0; channelIndex < auxChannelCount; channelIndex++) {\r
            channelOption = channelOptionTemplate.clone();\r
            channelOption.text('CH ' + (channelIndex + 5));\r
            channelOption.val(channelIndex);\r
            channelList.append(channelOption);\r
        }\r
        channelList.val(0);\r
    }\r
\r
    function addRangeToMode(modeElement, auxChannelIndex, range) {\r
        var modeIndex = $(modeElement).data('index');\r
\r
        var channel_range = {\r
                'min': [  900 ],\r
                'max': [ 2100 ]\r
            };\r
\r
        var rangeValues = [1300, 1700]; // matches MultiWii default values for the old checkbox MID range.\r
        if (range != undefined) {\r
            rangeValues = [range.start, range.end];\r
        }\r
\r
        var rangeIndex = $(modeElement).find('.range').length;\r
\r
        var rangeElement = $('#tab-auxiliary-templates .range').clone();\r
        rangeElement.attr('id', 'mode-' + modeIndex + '-range-' + rangeIndex);\r
        modeElement.find('.ranges').append(rangeElement);\r
\r
        var channelSlider = $(rangeElement).find('.channel-slider')[0];\r
        noUiSlider.create(channelSlider,{\r
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
        channelSlider.noUiSlider.on('update', values =>  {\r
            var elementName =  '#mode-' + modeIndex + '-range-' + rangeIndex;\r
            $(elementName + ' .lowerLimitValue').text(values[0]);\r
            $(elementName + ' .upperLimitValue').text(values[1]);\r
        });\r
\r
        $(rangeElement).find('.deleteRange').data('rangeElement', rangeElement);\r
\r
        $(rangeElement).find('a.deleteRange').on('click', function () {\r
            var rangeElement = $(this).data('rangeElement');\r
            modeElement.removeClass('inRange');\r
            rangeElement.remove();\r
        });\r
\r
        $(rangeElement).find('.channel').val(auxChannelIndex);\r
\r
    }\r
\r
    function process_html() {\r
\r
        var auxChannelCount = FC.RC.active_channels - 4;\r
\r
        configureRangeTemplate(auxChannelCount);\r
\r
        var modeTableBodyElement = $('.tab-auxiliary .modes tbody');\r
        let modeSelectionID = "";\r
        let modeSelectionRange = "";\r
\r
        for (var modeIndex = 0; modeIndex < LOCAL_AUX_CONFIG.length; modeIndex++) {\r
            // Get current mode category\r
            for (modeSelectionRange in modeSections) {\r
                if (modeSections[modeSelectionRange].indexOf(LOCAL_AUX_CONFIG[modeIndex]) != -1) {\r
                    break;\r
                }\r
            }\r
\r
            // Create divider if needed\r
            if (modeSelectionRange != modeSelectionID) {\r
                modeSelectionID = modeSelectionRange;\r
                var newSection = createModeSection(modeSelectionRange);\r
                modeTableBodyElement.append(newSection);\r
            }\r
\r
            var modeId = LOCAL_AUX_CONFIG_IDS[modeIndex];\r
            var newMode = createMode(modeIndex, modeId);\r
            modeTableBodyElement.append(newMode);\r
\r
            // generate ranges from the supplied AUX names and MODE_RANGE data\r
            for (var modeRangeIndex = 0; modeRangeIndex < FC.MODE_RANGES.length; modeRangeIndex++) {\r
                var modeRange = FC.MODE_RANGES[modeRangeIndex];\r
\r
                if (modeRange.id != modeId) {\r
                    continue;\r
                }\r
\r
                var range = modeRange.range;\r
                if (!(range.start < range.end)) {\r
                    continue; // invalid!\r
                }\r
\r
                addRangeToMode(newMode, modeRange.auxChannelIndex, range)\r
            }\r
\r
        }\r
\r
        function findFirstUnusedChannel(modeElement) {\r
            var auxChannelIndexCandidates = [];\r
            for (var auxChannelIndex = 0; auxChannelIndex < auxChannelCount; auxChannelIndex++) {\r
                auxChannelIndexCandidates.push(auxChannelIndex);\r
            }\r
\r
            $(modeElement).find('.channel').each( function() {\r
                var valueToRemove = $(this).val();\r
                auxChannelIndexCandidates = auxChannelIndexCandidates.filter(function(item) {\r
                    return item != valueToRemove;\r
                });\r
            });\r
\r
            return auxChannelIndexCandidates[0];\r
        }\r
\r
        $('a.addRange').on('click', function () {\r
            var modeElement = $(this).data('modeElement');\r
            addRangeToMode(modeElement, -1);\r
        });\r
\r
        // translate to user-selected language\r
       i18n.localize();\r
\r
        // UI Hooks\r
        $('a.save').on('click', function () {\r
\r
            // update internal data structures based on current UI elements\r
\r
            // we must send this many back to the FC - overwrite all of the old ones to be sure.\r
            var requiredModesRangeCount = FC.MODE_RANGES.length;\r
\r
            FC.MODE_RANGES = [];\r
\r
            var uniqueModes = [];\r
\r
            $('.tab-auxiliary .modes .mode').each(function () {\r
                var modeElement = $(this);\r
                var modeId = modeElement.data('id');\r
                $(modeElement).find('.range').each(function() {\r
\r
                    var rangeValues = $(this).find('.channel-slider')[0].noUiSlider.get(true);\r
                    var modeRange = {\r
                        id: modeId,\r
                        auxChannelIndex: parseInt($(this).find('.channel').val()),\r
                        range: {\r
                            start: rangeValues[0],\r
                            end: rangeValues[1]\r
                        }\r
                    };\r
\r
                    uniqueModes.push(modeElement.find('.name').text());\r
\r
                    FC.MODE_RANGES.push(modeRange);\r
                });\r
            });\r
\r
            for (var modeRangeIndex = FC.MODE_RANGES.length; modeRangeIndex < requiredModesRangeCount; modeRangeIndex++) {\r
                var defaultModeRange = {\r
                    id: 0,\r
                    auxChannelIndex: 0,\r
                    range: {\r
                        start: 900,\r
                        end: 900\r
                    }\r
                };\r
                FC.MODE_RANGES.push(defaultModeRange);\r
            }\r
            //\r
            // send data to FC\r
            //\r
            mspHelper.sendModeRanges(save_to_eeprom);\r
\r
            function save_to_eeprom() {\r
                MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {\r
                    GUI.log(i18n.getMessage('auxiliaryEepromSaved'));\r
                });\r
            }\r
        });\r
\r
\r
        function update_marker(auxChannelIndex, channelPosition) {\r
\r
            if (channelPosition < 900) {\r
                channelPosition = 900;\r
            } else if (channelPosition > 2100) {\r
                channelPosition = 2100;\r
            }\r
\r
            var percentage = (channelPosition - 900) / (2100-900) * 100;\r
\r
            $('.modes .ranges .range').each( function () {\r
                var auxChannelCandidateIndex = $(this).find('.channel').val();\r
                if (auxChannelCandidateIndex != auxChannelIndex) {\r
                    return;\r
                }\r
\r
                $(this).find('.marker').css('left', percentage + '%');\r
            });\r
        }\r
\r
        // data pulling functions used inside interval timer\r
        function get_rc_data() {\r
            MSP.send_message(MSPCodes.MSP_RC, false, false, update_ui);\r
        }\r
\r
        function update_ui() {\r
            let hasUsedMode = false;\r
            let acroEnabled = true;\r
            let acroFail = ["ANGLE", "HORIZON", "MANUAL", "ANGLE HOLD", "NAV RTH", "NAV POSHOLD", "NAV CRUISE", "NAV COURSE HOLD", "NAV WP", "GCS NAV"];\r
\r
            var auxChannelCount = FC.RC.active_channels - 4;\r
\r
            for (var i = 0; i < (auxChannelCount); i++) {\r
                update_marker(i, FC.RC.channels[i + 4]);\r
            }\r
\r
            for (var i = 0; i < LOCAL_AUX_CONFIG.length; i++) {\r
                var modeElement = $('#mode-' + i);\r
                let inRange = false;\r
\r
                if (modeElement.find(' .range').length == 0) {\r
                    // if the mode is unused, skip it\r
                    modeElement.removeClass('off').removeClass('on');\r
                    continue;\r
                }\r
\r
                if (FC.isModeBitSet(modeElement.data('origId'))) {\r
                    // The flight controller can activate the mode\r
                    $('.mode .name').eq(modeElement.data('index')).data('modeElement').addClass('on').removeClass('inRange').removeClass('off');\r
\r
                    if (jQuery.inArray(modeElement.data('modeName'), acroFail) !== -1) {\r
                        acroEnabled = false;\r
                    }\r
                } else {\r
                    // Check to see if the mode is in range\r
                    var modeRanges = modeElement.find(' .range');\r
                    for (let r = 0; r < modeRanges.length; r++) {\r
                        var rangeLow = $(modeRanges[r]).find('.lowerLimitValue').html();\r
                        var rangeHigh = $(modeRanges[r]).find('.upperLimitValue').html();\r
                        var markerPosition = $(modeRanges[r]).find('.marker')[0].style.left;\r
                        markerPosition = markerPosition.substring(0, markerPosition.length-1);\r
\r
                        rangeLow = (rangeLow - 900) / (2100-900) * 100;\r
                        rangeHigh = (rangeHigh - 900) / (2100-900) * 100;\r
\r
                        if ((markerPosition >= rangeLow) && (markerPosition <= rangeHigh)) {\r
                            inRange = true;\r
                        }\r
                    }\r
\r
                    if (inRange) {\r
                        $('.mode .name').eq(modeElement.data('index')).data('modeElement').removeClass('on').addClass('inRange').removeClass('off');\r
\r
                        if (jQuery.inArray(modeElement.data('modeName'), acroFail) !== -1) {\r
                            acroEnabled = false;\r
                        }\r
                    } else {\r
                        // If not, it is shown as disabled.\r
                        $('.mode .name').eq(modeElement.data('index')).data('modeElement').removeClass('on').removeClass('inRange').addClass('off');\r
                    }\r
                }\r
                hasUsedMode = true;\r
            }\r
\r
            if (acroEnabled) {\r
                $('.acroEnabled').addClass('on').removeClass('off');\r
            } else {\r
                $('.acroEnabled').removeClass('on').addClass('off');\r
            }\r
\r
            let hideUnused = hideUnusedModes && hasUsedMode;\r
            for (let i = 0; i < LOCAL_AUX_CONFIG.length; i++) {\r
                let modeElement = $('#mode-' + i);\r
                if (modeElement.find(' .range').length == 0) {\r
                    modeElement.toggle(!hideUnused);\r
                }\r
            }\r
\r
           auto_select_channel(FC.RC.channels, FC.RC.active_channels, FC.MISC.rssi_channel);\r
\r
            $(".modeSection").each(function() {\r
                $(this).toggle(!hideUnused);\r
            });\r
        }\r
\r
        /**\r
         * Autodetect channel based on maximum deference with previous value\r
         * minimum value to autodetect is 100\r
         */\r
        function auto_select_channel(RC_channels, activeChannels, RSSI_channel) {\r
            const auto_option = $('.tab-auxiliary select.channel option[value="-1"]:selected');\r
            if (auto_option.length === 0) {\r
                prevChannelsValues = null;\r
                return;\r
            }\r
\r
            const fillPrevChannelsValues = function () {\r
                prevChannelsValues = RC_channels.slice(0); //clone array\r
            };\r
\r
            if (!prevChannelsValues || RC_channels.length === 0) return fillPrevChannelsValues();\r
\r
            let diff_array = RC_channels.map(function(currentValue, index) {\r
                return Math.abs(prevChannelsValues[index] - currentValue);\r
            });\r
\r
            diff_array = diff_array.slice(0, activeChannels);\r
\r
            const largest = diff_array.reduce(function(x,y){\r
                return (x > y) ? x : y;\r
            }, 0);\r
\r
            //minimum change to autoselect is 100\r
            if (largest < 100) return fillPrevChannelsValues();\r
\r
            const indexOfMaxValue = diff_array.indexOf(largest);\r
            if (indexOfMaxValue >= 4 && indexOfMaxValue != RSSI_channel - 1){ //set channel\r
                auto_option.parent().val(indexOfMaxValue - 4);\r
            }\r
\r
            return fillPrevChannelsValues();\r
        }\r
\r
        let hideUnusedModes = false;\r
        let hideUnusedModesStore = bridge.storeGet('hideUnusedModes', false);\r
        $("input#switch-toggle-unused")\r
            .on('change', function () {\r
                hideUnusedModes = $(this).prop("checked");\r
                bridge.storeSet('hideUnusedModes', hideUnusedModes);\r
                update_ui();\r
            })\r
            .prop("checked", !!hideUnusedModesStore)\r
            .trigger('change');\r
\r
        // update ui instantly on first load\r
        update_ui();\r
\r
        // enable data pulling\r
        interval.add('aux_data_pull', get_rc_data, 50);\r
\r
        $(".tab-auxiliary .acroEnabled").width($("#mode-0 .info").width());\r
\r
        GUI.content_ready(callback);\r
    }\r
};\r
\r
auxiliaryTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
$(window).on('resize', function(){\r
    $(".tab-auxiliary .acroEnabled").width($("#mode-0 .info").width());\r
});\r
\r
export default auxiliaryTab;\r
`;export{n as default};
