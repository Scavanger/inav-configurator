const n=`'use strict';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import tabs from './../js/tabs';\r
import FC from './../js/fc';\r
import Settings from './../js/settings';\r
import i18n from './../js/localization';\r
import { scaleRangeInt } from './../js/helpers';\r
import interval from './../js/intervals';\r
import dialog from '../js/dialog';\r
\r
const pidTuningTab = { };\r
\r
pidTuningTab.rateChartHeight = 117\r
\r
\r
pidTuningTab.initialize = function (callback) {\r
\r
    var loadChainer = new MSPChainerClass();\r
\r
    let EZ_TUNE_PID_RP_DEFAULT = [40, 75, 23, 100];\r
    let EZ_TUNE_PID_YAW_DEFAULT = [45, 80, 0, 100];\r
\r
    var loadChain = [\r
        mspHelper.loadPidData,\r
        mspHelper.loadRateDynamics,\r
        mspHelper.loadRateProfileData,\r
        mspHelper.loadEzTune,\r
        mspHelper.loadMixerConfig,\r
    ];\r
\r
    loadChainer.setChain(loadChain);\r
    loadChainer.setExitPoint(load_html);\r
    loadChainer.execute();\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    function load_html() {\r
        import('./pid_tuning.html?raw').then(({default: html}) => GUI.load(html, Settings.processHtml(process_html)));\r
    }\r
\r
    function drawExpoCanvas(value, $element, color, width, height, clear) {\r
        let context = $element.getContext("2d");\r
\r
        if (value < 0 || value > 1) {\r
            return;\r
        }\r
\r
        if (clear === true) {\r
            context.clearRect(0, 0, width, height);\r
        }\r
\r
        context.beginPath();\r
        context.moveTo(0, height);\r
        context.quadraticCurveTo(width / 2, height - ((height / 2) * (1 - value)), width, 0);\r
        context.lineWidth = 2;\r
        context.strokeStyle = color;\r
        context.stroke();\r
\r
    };\r
\r
    function drawRollPitchYawExpo() {\r
        let pitch_roll_curve = $('.pitch_roll_curve canvas').get(0);\r
        let manual_expo_curve = $('.manual_expo_curve canvas').get(0);\r
\r
        drawExpoCanvas(\r
            parseFloat($('#rate_rollpitch_expo').val()) / 100,\r
            pitch_roll_curve,\r
            '#a00000',\r
            200,\r
            pidTuningTab.rateChartHeight,\r
            true\r
        );\r
        drawExpoCanvas(\r
            parseFloat($('#rate_yaw_expo').val()) / 100,\r
            pitch_roll_curve,\r
            '#00a000',\r
            200,\r
            pidTuningTab.rateChartHeight,\r
            false\r
        );\r
\r
        drawExpoCanvas(\r
            parseFloat($('#manual_rollpitch_expo').val()) / 100,\r
            manual_expo_curve,\r
            '#a00000',\r
            200,\r
            pidTuningTab.rateChartHeight,\r
            true\r
        );\r
\r
        drawExpoCanvas(\r
            parseFloat($('#manual_yaw_expo').val()) / 100,\r
            manual_expo_curve,\r
            '#00a000',\r
            200,\r
            pidTuningTab.rateChartHeight,\r
            false\r
        );\r
\r
        drawExpoCanvas(\r
            Math.floor(scaleRange($('#ez_tune_expo').val(), 0, 200, 40, 100)) / 100,\r
            $('#ez_tune_expo_curve canvas').get(0),\r
            '#a00000',\r
            250,\r
            200,\r
            true\r
        );\r
    }\r
\r
    function pid_and_rc_to_form() {\r
\r
        // Fill in the data from FC.PIDs array\r
        var pidNames = FC.getPidNames();\r
\r
        $('[data-pid-bank-position]').each(function () {\r
            var $this = $(this),\r
                bankPosition = $this.data('pid-bank-position');\r
\r
            if (pidNames[bankPosition]) {\r
                $this.find('td:first').text(pidNames[bankPosition]);\r
\r
                $this.find('input').each(function (index) {\r
                $(this).val(FC.PIDs[bankPosition][index]);\r
                });\r
            }\r
        });\r
\r
        $('#tpa').val(FC.RC_tuning.dynamic_THR_PID);\r
        $('#tpa-breakpoint').val(FC.RC_tuning.dynamic_THR_breakpoint);\r
    }\r
\r
    function form_to_pid_and_rc() {\r
\r
        $('[data-pid-bank-position]').each(function () {\r
            \r
            var $this = $(this),\r
                bankPosition = $this.data('pid-bank-position');\r
\r
            if ($this.hasClass('is-hidden')) {\r
                return;\r
            }\r
\r
            if (FC.PIDs[bankPosition]) {\r
                $this.find('input').each(function (index) {\r
                    FC.PIDs[bankPosition][index] = parseFloat($(this).val());\r
                });\r
            }\r
        });\r
\r
        // catch RC_tuning changes\r
        FC.RC_tuning.roll_rate = parseFloat($('#rate_roll_rate').val());\r
        FC.RC_tuning.pitch_rate = parseFloat($('#rate_pitch_rate').val());\r
        FC.RC_tuning.yaw_rate = parseFloat($('#rate_yaw_rate').val());\r
\r
        FC.RC_tuning.RC_EXPO = parseFloat($('#rate_rollpitch_expo').val()) / 100;\r
        FC.RC_tuning.RC_YAW_EXPO = parseFloat($('#rate_yaw_expo').val()) / 100;\r
\r
        FC.RC_tuning.dynamic_THR_PID = parseInt($('#tpaRate').val());\r
        FC.RC_tuning.dynamic_THR_breakpoint = parseInt($('#tpaBreakpoint').val());\r
\r
        FC.RC_tuning.manual_roll_rate = $('#rate_manual_roll').val();\r
        FC.RC_tuning.manual_pitch_rate = $('#rate_manual_pitch').val();\r
        FC.RC_tuning.manual_yaw_rate = $('#rate_manual_yaw').val();\r
\r
        FC.RC_tuning.manual_RC_EXPO = $('#manual_rollpitch_expo').val() / 100;\r
        FC.RC_tuning.manual_RC_YAW_EXPO = $('#manual_yaw_expo').val() / 100;\r
\r
        // Rate Dynamics\r
        FC.RATE_DYNAMICS.sensitivityCenter = parseInt($('#rate_dynamics_center_sensitivity').val());\r
        FC.RATE_DYNAMICS.sensitivityEnd = parseInt($('#rate_dynamics_end_sensitivity').val());\r
        FC.RATE_DYNAMICS.correctionCenter = parseInt($('#rate_dynamics_center_correction').val());\r
        FC.RATE_DYNAMICS.correctionEnd = parseInt($('#rate_dynamics_end_correction').val());\r
        FC.RATE_DYNAMICS.weightCenter = parseInt($('#rate_dynamics_center_weight').val());\r
        FC.RATE_DYNAMICS.weightEnd = parseInt($('#rate_dynamics_end_weight').val());\r
\r
    }\r
    \r
    function getYawPidScale(input) {\r
        const normalized = (input - 100) * 0.01;\r
    \r
        return 1.0 + (normalized * 0.5); \r
    }\r
\r
    function scaleRange(x, srcMin, srcMax, destMin, destMax) {\r
        let a = (destMax - destMin) * (x - srcMin);\r
        let b = srcMax - srcMin;\r
        return ((a / b) + destMin);\r
    }\r
\r
    function updatePreview() {\r
\r
        let axisRatio = $('#ez_tune_axis_ratio').val() / 100;\r
        let response = $('#ez_tune_response').val();\r
        let damping = $('#ez_tune_damping').val();\r
        let stability = $('#ez_tune_stability').val();\r
        let aggressiveness = $('#ez_tune_aggressiveness').val();\r
        let rate = $('#ez_tune_rate').val();\r
        let expo = $('#ez_tune_expo').val();\r
\r
        $('#preview-roll-p').html(Math.floor(EZ_TUNE_PID_RP_DEFAULT[0] * response / 100));\r
        $('#preview-roll-i').html(Math.floor(EZ_TUNE_PID_RP_DEFAULT[1] * stability / 100));\r
        $('#preview-roll-d').html(Math.floor(EZ_TUNE_PID_RP_DEFAULT[2] * damping / 100));\r
        $('#preview-roll-ff').html(Math.floor(EZ_TUNE_PID_RP_DEFAULT[3] * aggressiveness / 100));\r
\r
        $('#preview-pitch-p').html(Math.floor(axisRatio * EZ_TUNE_PID_RP_DEFAULT[0] * response / 100));\r
        $('#preview-pitch-i').html(Math.floor(axisRatio * EZ_TUNE_PID_RP_DEFAULT[1] * stability / 100));\r
        $('#preview-pitch-d').html(Math.floor(axisRatio * EZ_TUNE_PID_RP_DEFAULT[2] * damping / 100));\r
        $('#preview-pitch-ff').html(Math.floor(axisRatio * EZ_TUNE_PID_RP_DEFAULT[3] * aggressiveness / 100));\r
\r
        $('#preview-yaw-p').html(Math.floor(EZ_TUNE_PID_YAW_DEFAULT[0] * getYawPidScale(response)));\r
        $('#preview-yaw-i').html(Math.floor(EZ_TUNE_PID_YAW_DEFAULT[1] * getYawPidScale(stability)));\r
        $('#preview-yaw-d').html(Math.floor(EZ_TUNE_PID_YAW_DEFAULT[2] * getYawPidScale(damping)));\r
        $('#preview-yaw-ff').html(Math.floor(EZ_TUNE_PID_YAW_DEFAULT[3] * getYawPidScale(aggressiveness)));\r
\r
        $('#preview-roll-rate').html(Math.floor(scaleRange(rate, 0, 200, 30, 90)) * 10 + " dps");\r
        $('#preview-pitch-rate').html(Math.floor(scaleRange(rate, 0, 200, 30, 90)) * 10 + " dps");\r
        $('#preview-yaw-rate').html((Math.floor(scaleRange(rate, 0, 200, 30, 90)) - 10) * 10 + " dps");\r
\r
        $('#preview-roll-expo').html(Math.floor(scaleRange(expo, 0, 200, 40, 100)) + "%");\r
        $('#preview-pitch-expo').html(Math.floor(scaleRange(expo, 0, 200, 40, 100)) + "%");\r
        $('#preview-yaw-expo').html(Math.floor(scaleRange(expo, 0, 200, 40, 100)) + "%");\r
\r
    }\r
\r
    function process_html() {\r
        // translate to user-selected language\r
        i18n.localize();\r
\r
        $('#ez_tune_enabled').on('change', function () {\r
            if ($(this).is(":checked")) {\r
                FC.EZ_TUNE.enabled = 1;\r
            } else {\r
                FC.EZ_TUNE.enabled = 0;\r
            }\r
\r
            if (FC.EZ_TUNE.enabled) {\r
                $('.for-ez-tune').show();\r
                $('.not-for-ez-tune').hide();\r
            } else {\r
                $('.for-ez-tune').hide();\r
                $('.not-for-ez-tune').show();\r
            }\r
        });\r
\r
        if (!FC.isMultirotor()) {\r
            $('#ez-tune-switch').hide();\r
            $('.only-for-multirotor').hide();\r
        }\r
\r
        if (FC.isMultirotor()) {\r
            $('.not-for-multirotor').hide();\r
        }\r
\r
        $("#ez_tune_enabled").prop('checked', FC.EZ_TUNE.enabled).trigger('change');\r
\r
        GUI.sliderize($('#ez_tune_filter_hz'), FC.EZ_TUNE.filterHz, 20, 300);\r
        GUI.sliderize($('#ez_tune_axis_ratio'), FC.EZ_TUNE.axisRatio, 25, 175);\r
        GUI.sliderize($('#ez_tune_response'), FC.EZ_TUNE.response, 0, 200);\r
        GUI.sliderize($('#ez_tune_damping'), FC.EZ_TUNE.damping, 0, 200);\r
        GUI.sliderize($('#ez_tune_stability'), FC.EZ_TUNE.stability, 0, 200);\r
        GUI.sliderize($('#ez_tune_aggressiveness'), FC.EZ_TUNE.aggressiveness, 0, 200);\r
\r
        GUI.sliderize($('#ez_tune_rate'), FC.EZ_TUNE.rate, 0, 200);\r
        GUI.sliderize($('#ez_tune_expo'), FC.EZ_TUNE.expo, 0, 200);\r
\r
        GUI.sliderize($('#ez_tune_snappiness'), FC.EZ_TUNE.snappiness, 0, 100);\r
\r
        $('.ez-element').on('updated', function () {\r
            updatePreview();\r
        });\r
\r
        //Slider rates\r
        GUI.sliderize($('#rate_roll_rate'), FC.RC_tuning.roll_rate, 40, 1000);\r
        GUI.sliderize($('#rate_pitch_rate'), FC.RC_tuning.pitch_rate, 40, 1000);\r
        GUI.sliderize($('#rate_yaw_rate'), FC.RC_tuning.yaw_rate, 40, 1000);\r
\r
        GUI.sliderize($('#rate_rollpitch_expo'), FC.RC_tuning.RC_EXPO * 100, 0, 100);\r
        GUI.sliderize($('#rate_yaw_expo'), FC.RC_tuning.RC_YAW_EXPO * 100, 0, 100);\r
\r
        GUI.sliderize($('#rate_manual_roll'), FC.RC_tuning.manual_roll_rate, 0, 100);\r
        GUI.sliderize($('#rate_manual_pitch'), FC.RC_tuning.manual_pitch_rate, 0, 100);\r
        GUI.sliderize($('#rate_manual_yaw'), FC.RC_tuning.manual_yaw_rate, 0, 100);\r
\r
        GUI.sliderize($('#manual_rollpitch_expo'), FC.RC_tuning.manual_RC_EXPO * 100, 0, 100);\r
        GUI.sliderize($('#manual_yaw_expo'), FC.RC_tuning.manual_RC_YAW_EXPO * 100, 0, 100);\r
\r
        updatePreview();\r
\r
        tabs.init($('.tab-pid_tuning'));\r
\r
        $('.action-resetPIDs').on('click', function() {\r
\r
            if (dialog.confirm(i18n.getMessage('confirm_reset_pid'))) {\r
                MSP.send_message(MSPCodes.MSP_SET_RESET_CURR_PID, false, false, false);\r
                GUI.updateActivatedTab();\r
            }\r
        });\r
\r
        $('.action-resetDefaults').on('click', function() {\r
\r
            if (dialog.confirm(i18n.getMessage('confirm_select_defaults'))) {\r
                mspHelper.setSetting("applied_defaults", 0, function() { \r
                    mspHelper.saveToEeprom( function () {\r
                        GUI.log(i18n.getMessage('configurationEepromSaved'));\r
    \r
                        GUI.tab_switch_cleanup(function () {\r
                            MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, function () {\r
                                GUI.log(i18n.getMessage('deviceRebooting'));\r
                                GUI.handleReconnect();\r
                            });\r
                        });\r
                    });\r
                });\r
            }\r
        });\r
\r
        pid_and_rc_to_form();\r
\r
        $(".pid-slider-row [name='value-slider']").on('input', function () {\r
            let val = $(this).val();\r
            let normalMax = parseInt($(this).data('normal-max'));\r
\r
            if (val <= 800) {\r
                val = scaleRangeInt(val, 0, 800, 0, normalMax);\r
            } else {\r
                val = scaleRangeInt(val, 801, 1000, normalMax + 1, 255);\r
            }\r
\r
            $(this).parent().find('input[name="value-input"]').val(val);\r
            FC.PIDs[$(this).parent().data('axis')][$(this).parent().data('bank')] = val;\r
        });\r
\r
        $(".pid-slider-row [name='value-input']").on('change', function () {\r
            let val = $(this).val();\r
            let newVal;\r
            let normalMax = parseInt($(this).parent().find('input[name="value-slider"]').data('normal-max'));\r
\r
            if (val <= 110) {\r
                newVal = scaleRangeInt(val, 0, normalMax, 0, 800);\r
            } else {\r
                newVal = scaleRangeInt(val, normalMax + 1, 255, 801, 1000);\r
            }\r
\r
            $(this).parent().find('input[name="value-slider"]').val(newVal);\r
            FC.PIDs[$(this).parent().data('axis')][$(this).parent().data('bank')] = $(this).val();\r
        });\r
\r
        let axis = 0;\r
        $('#pid-sliders').find('.pid-sliders-axis').each(function () {\r
        \r
            let $this = $(this);\r
            let bank = 0;\r
\r
            $this.find('.pid-slider-row').each(function () {\r
                let $this = $(this);\r
                $this.data('axis', axis);\r
                $this.data('bank', bank);\r
                $this.find('input[name="value-input"]').val(FC.PIDs[axis][bank]).trigger('change');\r
                bank++;\r
            });\r
        \r
            axis++;\r
        });\r
\r
        GUI.sliderize($('#rate_dynamics_center_sensitivity'), FC.RATE_DYNAMICS.sensitivityCenter, 25, 175);\r
        GUI.sliderize($('#rate_dynamics_end_sensitivity'), FC.RATE_DYNAMICS.sensitivityEnd, 25, 175);\r
\r
        GUI.sliderize($('#rate_dynamics_center_correction'), FC.RATE_DYNAMICS.correctionCenter, 10, 95);\r
        GUI.sliderize($('#rate_dynamics_end_correction'), FC.RATE_DYNAMICS.correctionEnd, 10, 95);\r
\r
        GUI.sliderize($('#rate_dynamics_center_weight'), FC.RATE_DYNAMICS.weightCenter, 0, 95);\r
        GUI.sliderize($('#rate_dynamics_end_weight'), FC.RATE_DYNAMICS.weightEnd, 0, 95);\r
\r
        if (!FC.isRpyFfComponentUsed()) {\r
            $('.rpy_ff').prop('disabled', 'disabled');\r
        }\r
        if (!FC.isRpyDComponentUsed()) {\r
            $('.rpy_d').prop('disabled', 'disabled');\r
        }\r
\r
        interval.add("drawRollPitchYawExpo", function () {\r
            drawRollPitchYawExpo();\r
        }, 100);\r
\r
        GUI.simpleBind();\r
\r
        // UI Hooks\r
\r
        $('a.refresh').on('click', function () {\r
            $("#content-watermark").remove();\r
            $(".tab-pid_tuning").remove();\r
\r
            GUI.tab_switch_cleanup(function () {\r
                GUI.log(i18n.getMessage('pidTuningDataRefreshed'));\r
                pidTuningTab.initialize();\r
            });\r
        });\r
\r
        // update == save.\r
        $('a.update').on('click', function () {\r
            form_to_pid_and_rc();\r
\r
            if ($("#ez_tune_enabled").is(":checked")) {\r
                FC.EZ_TUNE.enabled = 1;\r
            } else {\r
                FC.EZ_TUNE.enabled = 0;\r
            }\r
\r
            FC.EZ_TUNE.filterHz = $('#ez_tune_filter_hz').val();\r
            FC.EZ_TUNE.axisRatio = $('#ez_tune_axis_ratio').val();\r
            FC.EZ_TUNE.response = $('#ez_tune_response').val();\r
            FC.EZ_TUNE.damping = $('#ez_tune_damping').val();\r
            FC.EZ_TUNE.stability = $('#ez_tune_stability').val();\r
            FC.EZ_TUNE.aggressiveness = $('#ez_tune_aggressiveness').val();\r
            FC.EZ_TUNE.rate = $('#ez_tune_rate').val();\r
            FC.EZ_TUNE.expo = $('#ez_tune_expo').val();\r
            FC.EZ_TUNE.snappiness = $('#ez_tune_snappiness').val();\r
\r
            function send_rc_tuning_changes() {\r
                MSP.send_message(MSPCodes.MSPV2_INAV_SET_RATE_PROFILE, mspHelper.crunch(MSPCodes.MSPV2_INAV_SET_RATE_PROFILE), false, saveRateDynamics);\r
            }\r
\r
            function saveRateDynamics() {\r
                mspHelper.saveRateDynamics(saveEzTune);\r
            }\r
\r
            function saveEzTune() {\r
                mspHelper.saveEzTune(saveSettings)\r
            }\r
\r
            function saveSettings() {\r
                Settings.saveInputs(save_to_eeprom);\r
            }\r
\r
            function save_to_eeprom() {\r
                MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {\r
                    GUI.log(i18n.getMessage('pidTuningEepromSaved'));\r
                });\r
            }\r
\r
            mspHelper.savePidData(send_rc_tuning_changes); \r
        });\r
\r
        GUI.content_ready(callback);\r
    }\r
};\r
\r
pidTuningTab.cleanup = function (callback) {\r
    if (callback) {\r
        callback();\r
    }\r
};\r
\r
export default pidTuningTab;\r
`;export{n as default};
