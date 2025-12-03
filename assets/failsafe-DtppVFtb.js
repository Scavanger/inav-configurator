const e=`'use strict';\r
\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import Settings from './../js/settings';\r
import i18n from './../js/localization';\r
\r
const failsafeTab = {};\r
\r
failsafeTab.initialize = function (callback, scrollPosition) {\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    // Can get rid of this when MSPHelper supports strings (fixed in #7734, awaiting merge)\r
    function load_failssafe_config() {\r
        MSP.send_message(MSPCodes.MSP_FAILSAFE_CONFIG, false, false, load_html);\r
    }\r
\r
    function load_html() {\r
        import('./failsafe.html?raw').then(({default: html}) => GUI.load(html, Settings.processHtml(function () {\r
            GUI.simpleBind();\r
\r
            // translate to user-selected language\r
           i18n.localize();;\r
\r
            // for some odd reason chrome 38+ changes scroll according to the touched select element\r
            // i am guessing this is a bug, since this wasn't happening on 37\r
            // code below is a temporary fix, which we will be able to remove in the future (hopefully)\r
            $('#content').scrollTop((scrollPosition) ? scrollPosition : 0);\r
\r
            // set stage 2 failsafe procedure\r
            $('input[type="radio"].procedure').on('change', function () {\r
                var element = $(this),\r
                    checked = element.is(':checked'),\r
                    id = element.attr('id');\r
                switch (id) {\r
                    case 'drop':\r
                        if (checked) {\r
                            $('input[name="failsafe_throttle"]').prop("disabled", true);\r
                            $('input[name="failsafe_off_delay"]').prop("disabled", true);\r
                        }\r
                        break;\r
\r
                    case 'land':\r
                        if (checked) {\r
                            $('input[name="failsafe_throttle"]').prop("disabled", false);\r
                            $('input[name="failsafe_off_delay"]').prop("disabled", false);\r
                        }\r
                        break;\r
                }\r
            });\r
\r
            // switch (MSPHelper.getSetting('failsafe_procedure')) {  // Use once #7734 is merged\r
            switch (FC.FAILSAFE_CONFIG.failsafe_procedure) {\r
                default:\r
                case 0:\r
                    var element = $('input[id="land"]');\r
                    element.prop('checked', true);\r
                    element.trigger('change');\r
                    break;\r
                case 1:\r
                    var element = $('input[id="drop"]');\r
                    element.prop('checked', true);\r
                    element.trigger('change');\r
                    break;\r
                case 2:\r
                    var element = $('input[id="rth"]');\r
                    element.prop('checked', true);\r
                    element.trigger('change');\r
                    break;\r
                case 3:\r
                    var element = $('input[id="nothing"]');\r
                    element.prop('checked', true);\r
                    element.trigger('change');\r
                    break;\r
            }\r
\r
            // Adjust Minimum Distance values when checkbox is checked/unchecked\r
            $('#failsafe_use_minimum_distance').on('change', function () {\r
                if ($(this).is(':checked')) {\r
                    // No default distance added due to conversions\r
                    $('#failsafe_min_distance_elements').show();\r
                    $('#failsafe_min_distance_procedure_elements').show();\r
                } else {\r
                    // If they uncheck it, clear the distance to 0, which disables this feature\r
                    $('#failsafe_min_distance').val(0);\r
                    $('#failsafe_min_distance_elements').hide();\r
                    $('#failsafe_min_distance_procedure_elements').hide();\r
                }\r
            });\r
\r
            // Set initial state of controls according to data\r
            if ( $('#failsafe_min_distance').val() > 0) {\r
                $('#failsafe_use_minimum_distance').prop('checked', true);\r
                $('#failsafe_min_distance_elements').show();\r
                $('#failsafe_min_distance_procedure_elements').show();\r
            } else {\r
                $('#failsafe_use_minimum_distance').prop('checked', false);\r
                $('#failsafe_min_distance_elements').hide();\r
                $('#failsafe_min_distance_procedure_elements').hide();\r
            }\r
\r
            $('a.save').on('click', function () {\r
                if ($('input[id="land"]').is(':checked')) {\r
                    FC.FAILSAFE_CONFIG.failsafe_procedure = 0;\r
                } else if ($('input[id="drop"]').is(':checked')) {\r
                    FC.FAILSAFE_CONFIG.failsafe_procedure = 1;\r
                } else if ($('input[id="rth"]').is(':checked')) {\r
                    FC.FAILSAFE_CONFIG.failsafe_procedure = 2;\r
                } else if ($('input[id="nothing"]').is(':checked')) {\r
                    FC.FAILSAFE_CONFIG.failsafe_procedure = 3;\r
                }\r
        \r
                MSP.send_message(MSPCodes.MSP_SET_FAILSAFE_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_FAILSAFE_CONFIG), false, savePhaseTwo);\r
            });\r
\r
            GUI.content_ready(callback);\r
        })));\r
    }\r
\r
    load_failssafe_config();\r
\r
    function save_to_eeprom() {\r
        console.log('save_to_eeprom');\r
        MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {\r
            GUI.log(i18n.getMessage('eepromSaved'));\r
\r
            GUI.tab_switch_cleanup(function () {\r
                MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, function () {\r
                    GUI.log(i18n.getMessage('deviceRebooting'));\r
                    GUI.handleReconnect($('.tab_failsafe a'));\r
                });\r
            });\r
        });\r
    }\r
\r
    function savePhaseTwo() {\r
        Settings.saveInputs(save_to_eeprom);\r
    }\r
};\r
\r
failsafeTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default failsafeTab;`;export{e as default};
