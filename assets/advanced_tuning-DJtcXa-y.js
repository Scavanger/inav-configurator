const n=`'use strict';\r
\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import Settings from './../js/settings';\r
import i18n from './../js/localization';\r
\r
const advancedTuningTab = {};\r
\r
advancedTuningTab.initialize = function (callback) {\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    import('./advanced_tuning.html?raw').then(({default: html}) => GUI.load(html, Settings.processHtml(processHtml)));\r
\r
    function save_to_eeprom() {\r
        console.log('save_to_eeprom');\r
        MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {\r
            GUI.log(i18n.getMessage('eepromSaved'));\r
\r
            GUI.tab_switch_cleanup(function () {\r
                MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, function () {\r
                    GUI.log(i18n.getMessage('deviceRebooting'));\r
                    GUI.handleReconnect($('.tab_advanced_tuning a'));\r
                });\r
            });\r
        });\r
    }\r
\r
    function processHtml() {\r
        if (FC.isAirplane()) {\r
            $('.airplaneTuning').show();\r
            $('.airplaneTuningTitle').show();\r
            $('.multirotorTuning').hide();\r
            $('.multirotorTuningTitle').hide();\r
            $('.notFixedWingTuning').hide();\r
        } else if (FC.isMultirotor()) {\r
            $('.airplaneTuning').hide();\r
            $('.airplaneTuningTitle').hide();\r
            $('.multirotorTuning').show();\r
            $('.multirotorTuningTitle').show();\r
            $('.notFixedWingTuning').show();\r
        } else {\r
            $('.airplaneTuning').show();\r
            $('.airplaneTuningTitle').hide();\r
            $('.multirotorTuning').show();\r
            $('.multirotorTuningTitle').hide();\r
            $('.notFixedWingTuning').show();\r
        }\r
\r
        if (!FC.isFeatureEnabled('GEOZONE')) {\r
            $('#geozoneSettings').hide();\r
        }\r
\r
        GUI.simpleBind();\r
\r
        i18n.localize();;\r
        \r
        // Set up required field warnings\r
        $('#launchIdleThr').on('keyup', () => {\r
            advancedTuningTab.checkRequirements_IdleThrottle();\r
        });\r
\r
        $('#launchIdleDelay').on('keyup', () => {\r
            advancedTuningTab.checkRequirements_IdleThrottle();\r
        });\r
\r
        $('#wiggleWakeIdle').on('change', function () {\r
            advancedTuningTab.checkRequirements_IdleThrottle();\r
        });\r
\r
        $('#rthHomeAltitude').on('keyup', () => {\r
            advancedTuningTab.checkRequirements_LinearDescent();\r
        });\r
\r
        $('#rthUseLinearDescent').on('change', function () {\r
            advancedTuningTab.checkRequirements_LinearDescent();\r
        });\r
\r
        // Preload required field warnings\r
        advancedTuningTab.checkRequirements_IdleThrottle();\r
        advancedTuningTab.checkRequirements_LinearDescent();\r
\r
        $('a.save').on('click', function () {\r
            Settings.saveInputs(save_to_eeprom);\r
        });\r
        GUI.content_ready(callback);\r
    }\r
};\r
\r
\r
advancedTuningTab.checkRequirements_IdleThrottle = function() {\r
    let idleThrottle = $('#launchIdleThr');\r
    if (($('#launchIdleDelay').val() > 0 || $('#wiggleWakeIdle').find(":selected").val() > 0) && (idleThrottle.val() == "" || idleThrottle.val() < "1150")) {\r
        idleThrottle.addClass('inputRequiredWarning');\r
    } else {\r
        idleThrottle.removeClass('inputRequiredWarning');\r
    }\r
};\r
\r
advancedTuningTab.checkRequirements_LinearDescent = function() {\r
    let rthHomeAlt = $('#rthHomeAltitude');\r
    let minRthHomeAlt = 1000.0 / rthHomeAlt.data('setting-multiplier'); // 10 metres minimum recommended for safety.\r
    \r
    if ($('#rthUseLinearDescent').is(":checked") && (rthHomeAlt.val() == "" || parseFloat(rthHomeAlt.val()) < minRthHomeAlt)) {\r
        rthHomeAlt.addClass('inputRequiredWarning');\r
    } else {\r
        rthHomeAlt.removeClass('inputRequiredWarning');\r
    }\r
};\r
\r
advancedTuningTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default advancedTuningTab;\r
`;export{n as default};
