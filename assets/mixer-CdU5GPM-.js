const r=`'use strict';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import i18n from './../js/localization';\r
import { mixer, platform, PLATFORM, INPUT, STABILIZED } from './../js/model';\r
import Settings from './../js/settings';\r
import jBox from 'jbox';\r
import interval from './../js/intervals';\r
import ServoMixRule from './../js/servoMixRule';\r
import MotorMixRule from './../js/motorMixRule';\r
\r
const mixerTab = {};\r
\r
mixerTab.initialize = function (callback, scrollPosition) {\r
\r
    let loadChainer = new MSPChainerClass(),\r
        saveChainer = new MSPChainerClass(),\r
        currentPlatform,\r
        currentMixerPreset,\r
        loadedMixerPresetID,\r
        $servoMixTable,\r
        $servoMixTableBody,\r
        $motorMixTable,\r
        $motorMixTableBody,\r
        modal,\r
        motorWizardModal;\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    loadChainer.setChain([\r
        mspHelper.loadMixerConfig,\r
        mspHelper.loadMotors,\r
        mspHelper.loadServoMixRules,\r
        mspHelper.loadMotorMixRules,\r
        mspHelper.loadOutputMappingExt,\r
        mspHelper.loadTimerOutputModes,\r
        mspHelper.loadLogicConditions,\r
        mspHelper.loadEzTune,\r
    ]);\r
    loadChainer.setExitPoint(loadHtml);\r
    loadChainer.execute();\r
\r
    saveChainer.setChain([\r
        mspHelper.saveMixerConfig,\r
        mspHelper.sendServoMixer,\r
        mspHelper.sendMotorMixer,\r
        mspHelper.sendTimerOutputModes,\r
        saveSettings,\r
        mspHelper.saveToEeprom\r
    ]);\r
    saveChainer.setExitPoint(reboot);\r
\r
    function saveSettings(onComplete) {\r
        Settings.saveInputs(onComplete);\r
    }\r
\r
    function reboot() {\r
        //noinspection JSUnresolvedVariable\r
        GUI.log(i18n.getMessage('configurationEepromSaved'));\r
\r
        GUI.tab_switch_cleanup(function() {\r
            MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitialize);\r
        });\r
    }\r
\r
    function reinitialize() {\r
        //noinspection JSUnresolvedVariable\r
        GUI.log(i18n.getMessage('deviceRebooting'));\r
        GUI.handleReconnect($('.tab_mixer a'));\r
    }\r
\r
    function loadHtml() {\r
        import('./mixer.html?raw').then(({default: html}) => GUI.load(html, Settings.processHtml(processHtml)));\r
    }\r
\r
    function renderOutputTable() {\r
        let outputCount = FC.OUTPUT_MAPPING.getOutputCount(),\r
            $outputRow = $('#output-row'),\r
            $functionRow = $('#function-row');\r
\r
        $outputRow.append('<th data-i18n="mappingTableOutput"></th>');\r
        $functionRow.append('<th data-i18n="mappingTableFunction"></th>');\r
        \r
        for (let i = 1; i <= outputCount; i++) {\r
\r
            let timerId = FC.OUTPUT_MAPPING.getTimerId(i - 1);\r
            let color = FC.OUTPUT_MAPPING.getOutputTimerColor(i - 1);\r
            let isLed = FC.OUTPUT_MAPPING.isLedPin(i - 1);\r
\r
            $outputRow.append('<td style="background-color: ' + color + '">S' + i + (isLed ? '/LED' : '') + ' (Timer&nbsp;' + (timerId + 1) + ')</td>');\r
            $functionRow.append('<td id="function-' + i +'">-</td>');\r
        }\r
\r
        $outputRow.find('td').css('width', 100 / (outputCount + 1) + '%');\r
\r
    }\r
\r
    function updateTimerOverride() {\r
        let timers = FC.OUTPUT_MAPPING.getUsedTimerIds();\r
\r
        for(let i =0; i < timers.length;++i) {\r
            let timerId = timers[i];\r
            let $select = $('#timer-output-' + timerId);\r
            if(!$select) {\r
                continue;\r
            }\r
            FC.OUTPUT_MAPPING.setTimerOverride(timerId, $select.val());\r
        }\r
    }\r
\r
    function renderTimerOverride() {\r
        let outputCount = FC.OUTPUT_MAPPING.getOutputCount(),\r
            $container = $('#timerOutputsList'), timers = {};\r
\r
\r
        let usedTimers = FC.OUTPUT_MAPPING.getUsedTimerIds();\r
\r
        for (let t of usedTimers) {\r
            var usageMode = FC.OUTPUT_MAPPING.getTimerOverride(t);\r
            $container.append(\r
                        '<div class="select" style="padding: 5px; margin: 1px; background-color: ' + FC.OUTPUT_MAPPING.getTimerColor(t) + '">' +\r
                            '<select id="timer-output-' + t + '">' +\r
                                '<option value=' + FC.OUTPUT_MAPPING.TIMER_OUTPUT_MODE_AUTO + '' + (usageMode == FC.OUTPUT_MAPPING.TIMER_OUTPUT_MODE_AUTO ? ' selected' : '')+ '>AUTO</option>'+\r
                                '<option value=' + FC.OUTPUT_MAPPING.TIMER_OUTPUT_MODE_MOTORS + '' + (usageMode == FC.OUTPUT_MAPPING.TIMER_OUTPUT_MODE_MOTORS ? ' selected' : '')+ '>MOTORS</option>'+\r
                                '<option value=' + FC.OUTPUT_MAPPING.TIMER_OUTPUT_MODE_SERVOS + '' + (usageMode == FC.OUTPUT_MAPPING.TIMER_OUTPUT_MODE_SERVOS ? ' selected' : '')+ '>SERVOS</option>'+\r
                                '<option value=' + FC.OUTPUT_MAPPING.TIMER_OUTPUT_MODE_LED + '' + (usageMode == FC.OUTPUT_MAPPING.TIMER_OUTPUT_MODE_LED ? ' selected' : '')+ '>LED</option>'+\r
                            '</select>' +\r
                            '<label for="timer-output-' + t + '">' +\r
                                '<span> Timer ' + (parseInt(t) + 1) + '</span>' +\r
                            '</label>' +\r
                        '</div>'\r
            );\r
        }\r
\r
    }\r
\r
    function renderOutputMapping() {\r
        let outputMap = FC.OUTPUT_MAPPING.getOutputTable(\r
            FC.MIXER_CONFIG.platformType == PLATFORM.MULTIROTOR || FC.MIXER_CONFIG.platformType == PLATFORM.TRICOPTER,\r
            FC.MOTOR_RULES.getNumberOfConfiguredMotors(),\r
            FC.SERVO_RULES.getUsedServoIndexes()\r
        );\r
\r
        for (let i = 1; i <= FC.OUTPUT_MAPPING.getOutputCount(); i++) {\r
            $('#function-' + i).html(outputMap[i - 1]);\r
        }\r
\r
        renderServoOutputImage(outputMap);\r
    }\r
\r
    function renderServoOutputImage(outputMap) {\r
        let mixerPreview = $('.mixerPreview');\r
        mixerPreview.find('.outputImageNumber').remove();\r
\r
        $(".mix-rule-servo").each(function() {\r
            $(this).css("background-color", "");\r
            $(this).css("font-weight", "");\r
            $(this).css("color", "");\r
        });\r
\r
        if (FC.MIXER_CONFIG.platformType == PLATFORM.AIRPLANE) {\r
            if (outputMap != null && currentMixerPreset.hasOwnProperty('imageOutputsNumbers')) {\r
                let outputPad = 1;\r
                let outputArea = null;\r
                let inputBoxes = null;\r
                let surfaces = {\r
                    aileronSet: mixer.countSurfaceType(currentMixerPreset, INPUT.STABILIZED_ROLL),\r
                    elevatorSet: mixer.countSurfaceType(currentMixerPreset, INPUT.STABILIZED_PITCH),\r
                    rudderSet: mixer.countSurfaceType(currentMixerPreset, INPUT.STABILIZED_YAW),\r
                };\r
                let motors = [];\r
                let servoRules = FC.SERVO_RULES;\r
\r
                for (let omIndex of outputMap) {\r
                    if (omIndex != '-') {\r
                        omIndex = omIndex.split(' ');\r
                        if (omIndex[0] == "Motor") {\r
                            motors.push(outputPad);\r
                        } else {\r
                            let servo = servoRules.getServoMixRuleFromTarget(omIndex[1]);\r
                            if (servo == null) {continue;}\r
                            let divID = "servoPreview" + omIndex[1];\r
                            \r
                            switch (parseInt(servo.getInput())) {\r
                                case INPUT.STABILIZED_PITCH:\r
                                case STABILIZED.PITCH_POSITIVE:\r
                                case STABILIZED.PITCH_NEGATIVE:\r
                                case INPUT.RC_PITCH:\r
                                    outputArea = getOutputImageArea(currentMixerPreset.imageOutputsNumbers, INPUT.STABILIZED_PITCH, surfaces.elevatorSet);\r
                                    if (outputArea != null) {\r
                                        mixerPreview.append('<div id="' + divID + '" class="outputImageNumber">S' + outputPad + '</div>');\r
\r
                                        $("#"+divID).css("top", outputArea.top + "px");\r
                                        $("#"+divID).css("left", outputArea.left + "px");\r
                                        $("#"+divID).css("border-color", outputArea.colour);\r
\r
                                        inputBoxes = getServoNumberInput(servo.getTarget());\r
                                        if (inputBoxes.length > 0) {\r
                                            $.each(inputBoxes, function() {\r
                                                $(this).css("background-color", outputArea.colour);\r
                                                $(this).css("font-weight", "bold");\r
                                                $(this).css("color", "#FFFFFF");\r
                                            });\r
                                        }\r
\r
                                        surfaces.elevatorSet--;\r
                                    }\r
                                    break;\r
                                case INPUT.STABILIZED_ROLL:\r
                                case STABILIZED.ROLL_POSITIVE:\r
                                case STABILIZED.ROLL_NEGATIVE:\r
                                case INPUT.RC_ROLL:\r
                                    outputArea = getOutputImageArea(currentMixerPreset.imageOutputsNumbers, INPUT.STABILIZED_ROLL, surfaces.aileronSet);\r
                                    if (outputArea != null) {\r
                                        mixerPreview.append('<div id="' + divID + '" class="outputImageNumber">S' + outputPad + '</div>');\r
\r
                                        $("#"+divID).css("top", outputArea.top + "px");\r
                                        $("#"+divID).css("left", outputArea.left + "px");\r
                                        $("#"+divID).css("border-color", outputArea.colour);\r
\r
                                        inputBoxes = getServoNumberInput(servo.getTarget());\r
                                        if (inputBoxes.length > 0) {\r
                                            $.each(inputBoxes, function() {\r
                                                $(this).css("background-color", outputArea.colour);\r
                                                $(this).css("font-weight", "bold");\r
                                                $(this).css("color", "#FFFFFF");\r
                                            });\r
                                        }\r
\r
                                        surfaces.aileronSet--;\r
                                    }\r
                                    break;\r
                                case INPUT.STABILIZED_YAW:\r
                                case STABILIZED.YAW_POSITIVE:\r
                                case STABILIZED.YAW_NEGATIVE:\r
                                case INPUT.RC_YAW:\r
                                    outputArea = getOutputImageArea(currentMixerPreset.imageOutputsNumbers, INPUT.STABILIZED_YAW, surfaces.rudderSet);\r
                                    if (outputArea != null) {\r
                                        mixerPreview.append('<div id="' + divID + '" class="outputImageNumber">S' + outputPad + '</div>');\r
\r
                                        $("#"+divID).css("top", outputArea.top + "px");\r
                                        $("#"+divID).css("left", outputArea.left + "px");\r
                                        $("#"+divID).css("border-color", outputArea.colour);\r
\r
                                        inputBoxes = getServoNumberInput(servo.getTarget());\r
                                        if (inputBoxes.length > 0) {\r
                                            $.each(inputBoxes, function() {\r
                                                $(this).css("background-color", outputArea.colour);\r
                                                $(this).css("font-weight", "bold");\r
                                                $(this).css("color", "#FFFFFF");\r
                                            });\r
                                        }\r
\r
                                        surfaces.rudderSet--;\r
                                    }\r
                                    break;\r
                            }\r
                        }\r
                    }\r
\r
                    outputPad++;\r
                }\r
\r
                if (motors.length > 0) {\r
                    mixerPreview.append('<div id="motorsPreview" class="outputImageNumber isMotor">S' + motors.join('/') + '</div>');\r
\r
                    outputArea = getOutputImageArea(currentMixerPreset.imageOutputsNumbers, INPUT.STABILIZED_THROTTLE, 0);\r
                    if (outputArea != null) {\r
                        $("#motorsPreview").css("top", outputArea.top + "px");\r
                        $("#motorsPreview").css("left", outputArea.left + "px");\r
                        $("#motorsPreview").css("border-color", outputArea.colour);\r
                    }\r
                }\r
            }\r
        }\r
    }\r
\r
    var lastRoll = -1;\r
    var lastPitch = -1;\r
    var lastYaw = -1;\r
\r
    function getOutputImageArea(outputImageAreas, input, surfacesSet) {\r
        let returnArea = null;\r
        \r
        for (let area of outputImageAreas) {\r
            if (area.input == input) {\r
                if ( input === INPUT.STABILIZED_THROTTLE\r
                    || (surfacesSet > 0 && \r
                            ((input === INPUT.STABILIZED_YAW && surfacesSet !== lastYaw) \r
                            || (input === INPUT.STABILIZED_ROLL && surfacesSet !== lastRoll) \r
                            || (input === INPUT.STABILIZED_PITCH && surfacesSet !== lastPitch))\r
                        )\r
                ) {\r
                    returnArea = area;\r
                }\r
\r
                if (input === INPUT.STABILIZED_ROLL) {\r
                    lastRoll = surfacesSet-1;\r
                } else if (input === INPUT.STABILIZED_PITCH) {\r
                    lastPitch = surfacesSet-1;\r
                } else if (input === INPUT.STABILIZED_YAW) {\r
                    lastYaw = surfacesSet-1;\r
                }\r
\r
                if (returnArea !== null) {\r
                    break;\r
                }\r
            }\r
        }\r
\r
        return returnArea;\r
    }\r
\r
    function getServoNumberInput(target) {\r
        let servoInputs = [];\r
\r
        $(".mix-rule-servo").each(function() {\r
            if ($(this).val() == target) {\r
                servoInputs.push($(this));\r
            }\r
        });\r
\r
        return servoInputs;\r
    }\r
\r
    function renderServoMixRules() {\r
        /*\r
         * Process servo mix table UI\r
         */\r
        let rules = FC.SERVO_RULES.get();\r
        $servoMixTableBody.find("*").remove();\r
        for (let servoRuleIndex in rules) {\r
            if (rules.hasOwnProperty(servoRuleIndex)) {\r
                const servoRule = rules[servoRuleIndex];\r
\r
                $servoMixTableBody.append('\\\r
                    <tr>\\\r
                    <td><input type="number" class="mix-rule-servo" step="1" min="0" max="15" /></td>\\\r
                    <td><select class="mix-rule-input"></select></td>\\\r
                    <td class="mixer-fixed-value-col"><input type="number" class="mix-rule-fixed-value" min="875" max="2125" disabled /></td> \\\r
                    <td><input type="number" class="mix-rule-rate" step="1" min="-125" max="125" /></td>\\\r
                    <td><input type="number" class="mix-rule-speed" step="1" min="0" max="255" /></td>\\\r
                    <td class="mixer-table__condition"></td>\\\r
                    <td><span class="btn default_btn narrow red"><a href="#" data-role="role-servo-delete" data-i18n="servoMixerDelete"></a></span></td>\\\r
                    </tr>\\\r
                ');\r
\r
                const $row = $servoMixTableBody.find('tr:last');\r
\r
                GUI.renderLogicConditionSelect(\r
                    $row.find('.mixer-table__condition'), \r
                    FC.LOGIC_CONDITIONS, \r
                    servoRule.getConditionId(), \r
                    function () {\r
                        servoRule.setConditionId($(this).val());\r
                    },\r
                    true,\r
                    true\r
                );\r
\r
                GUI.fillSelect($row.find(".mix-rule-input"), FC.getServoMixInputNames(), servoRule.getInput());\r
\r
                if (!FC.MIXER_CONFIG.hasFlaps) {\r
                    $row.find(".mix-rule-input").children('option[value="14"]').remove();\r
                }\r
\r
                $row.find(".mix-rule-input").val(servoRule.getInput()).on('change', function () {\r
                    servoRule.setInput($(this).val());\r
                    updateFixedValueVisibility($row, $(this));\r
\r
                    renderOutputMapping();\r
                });\r
\r
                $row.find(".mix-rule-servo").val(servoRule.getTarget()).on('change', function () {\r
                    servoRule.setTarget(Number($(this).val()));\r
                });\r
\r
                $row.find(".mix-rule-rate").val(servoRule.getRate()).on('change', function () {\r
                    servoRule.setRate($(this).val());\r
                    $row.find(".mix-rule-fixed-value").val(mapServoWeightToFixedValue($(this).val()));\r
                });\r
\r
                $row.find(".mix-rule-fixed-value").val(mapServoWeightToFixedValue($row.find(".mix-rule-rate").val()));\r
\r
                $row.find(".mix-rule-speed").val(servoRule.getSpeed()).on('change', function () {\r
                    servoRule.setSpeed($(this).val());\r
                });\r
\r
                $row.find("[data-role='role-servo-delete']").attr("data-index", servoRuleIndex);\r
\r
                updateFixedValueVisibility($row, $row.find(".mix-rule-input"));\r
            }\r
        }\r
\r
        let rate_inputs = $('.mix-rule-rate');\r
        rate_inputs.attr("min", -1000);\r
        rate_inputs.attr("max", 1000);\r
\r
       i18n.localize();;\r
    }\r
\r
    function updateFixedValueVisibility(row, $mixRuleInput) {\r
\r
        // Show the fixed value input box if "MAX" input was selected for this servo\r
        const $fixedValueCalcInput = row.find(".mix-rule-fixed-value");\r
        if (FC.getServoMixInputNames()[$mixRuleInput.val()] === 'MAX') {\r
            $fixedValueCalcInput.show();\r
        } else {\r
            $fixedValueCalcInput.hide();\r
            row.find(".mix-rule-speed").prop('disabled', false);\r
        }\r
\r
        // Show the Fixed Value column if at least one servo has the "MAX" input assigned\r
        const $fixedValueCol = $("#servo-mix-table").find(".mixer-fixed-value-col");\r
        const rules = FC.SERVO_RULES.get();\r
        for (let servoRuleIndex in rules) {\r
            if (rules.hasOwnProperty(servoRuleIndex)) {\r
                if (FC.getServoMixInputNames()[rules[servoRuleIndex].getInput()] === 'MAX') {\r
                    $fixedValueCol.show();\r
                    return;\r
                }\r
            }\r
        }\r
        $fixedValueCol.hide();\r
    }\r
\r
    function mapServoWeightToFixedValue(weight) {\r
        return (parseInt(weight) + 100) * 1000 / 200 + 1000;\r
    }\r
\r
\r
    function labelMotorNumbers() {\r
\r
        let index = 0;\r
        var rules;\r
\r
        if (currentMixerPreset.id == loadedMixerPresetID) {\r
            rules = FC.MOTOR_RULES.get();\r
        } else {\r
            rules = currentMixerPreset.motorMixer;\r
        }\r
\r
        if (currentMixerPreset.image != 'quad_x') {\r
            for (let i = 1; i < 5; i++) {\r
                $("#motorNumber"+i).css("visibility", "hidden");\r
            }\r
        }\r
\r
        const $img = $("#motor-mixer-preview-img");\r
        const imgHeight = $img.height();\r
\r
        // Skip positioning if image hasn't loaded yet (height would be 0)\r
        if (imgHeight === 0) {\r
            return;\r
        }\r
\r
        for (const i in rules) {\r
            if (rules.hasOwnProperty(i)) {\r
                const rule = rules[i];\r
                index++;\r
\r
                if (currentMixerPreset.image != 'quad_x') {\r
                    continue;\r
                }\r
\r
                let top_px = 28;\r
                let left_px = 28;\r
                if (rule.getRoll() < -0.5) {\r
                  left_px = $img.width() - 42;\r
                }\r
\r
                if (rule.getPitch() > 0.5) {\r
                  top_px = imgHeight - 44;\r
                }\r
                $("#motorNumber"+index).css("left", left_px + "px");\r
                $("#motorNumber"+index).css("top", top_px + "px");\r
                $("#motorNumber"+index).removeClass("is-hidden");\r
                $("#motorNumber"+index).css("visibility", "visible");\r
            }\r
        }\r
    }\r
\r
\r
    function renderMotorMixRules() {\r
\r
        /*\r
         * Process motor mix table UI\r
         */\r
        var rules = FC.MOTOR_RULES.get();\r
        $motorMixTableBody.find("*").remove();\r
        let index = 0;\r
        for (const i in rules) {\r
            if (rules.hasOwnProperty(i)) {\r
                const rule = rules[i];\r
                index++;\r
\r
                $motorMixTableBody.append('\\\r
                    <tr>\\\r
                    <td><span class="mix-rule-motor"></span></td>\\\r
                    <td>\\\r
                        <input type="number" class="mix-rule-throttle" step="0.001" min="-2" max="2" />\\\r
                        <div class="throttle-warning-text" data-i18n="mixerThrottleWarning" ></div>\\\r
                    </td>\\\r
                    <td><input type="number" class="mix-rule-roll" step="0.001" min="-2" max="2" /></td>\\\r
                    <td><input type="number" class="mix-rule-pitch" step="0.001" min="-2" max="2" /></td>\\\r
                    <td><input type="number" class="mix-rule-yaw" step="0.001" min="-2" max="2" /></td>\\\r
                    <td><span class="btn default_btn narrow red"><a href="#" data-role="role-motor-delete" data-i18n="servoMixerDelete"></a></span></td>\\\r
                    </tr>\\\r
                ');\r
\r
                const $row = $motorMixTableBody.find('tr:last');\r
\r
                $row.find('.mix-rule-motor').html(index);\r
                const $throttleInput = $row.find('.mix-rule-throttle').val(rule.getThrottle());\r
                const $warningBox = $row.find('.throttle-warning-text');\r
    \r
                // Function to update throttle and show/hide warning box\r
                function updateThrottle() {\r
                    rule.setThrottle($throttleInput.val());\r
                    // Change color if value exceeds 1\r
                    if (parseFloat($throttleInput.val()) > 1 || parseFloat($throttleInput.val()) < 0) {\r
                        $throttleInput.css('background-color', 'orange');\r
                        // Show warning box\r
                        $warningBox.show();\r
                    } else {\r
                        $throttleInput.css('background-color', ''); // Reset to default\r
                        // Hide warning box\r
                        $warningBox.hide();\r
                    }\r
                }\r
                updateThrottle();\r
                $throttleInput.on('change', updateThrottle);\r
\r
                $row.find('.mix-rule-roll').val(rule.getRoll()).on('change', function () {\r
                    rule.setRoll($(this).val());\r
                });\r
                $row.find('.mix-rule-pitch').val(rule.getPitch()).on('change', function () {\r
                    rule.setPitch($(this).val());\r
                });\r
                $row.find('.mix-rule-yaw').val(rule.getYaw()).on('change', function () {\r
                    rule.setYaw($(this).val());\r
                });\r
                $row.find("[data-role='role-motor-delete']").attr("data-index", i);\r
            }\r
\r
        }\r
       labelMotorNumbers();\r
       i18n.localize();;\r
    }\r
\r
    function saveAndReboot() {\r
        /*\r
         * Send mixer rules\r
         */\r
        FC.SERVO_RULES.cleanup();\r
        FC.SERVO_RULES.inflate();\r
        FC.MOTOR_RULES.cleanup();\r
        FC.MOTOR_RULES.inflate();\r
\r
        updateTimerOverride();\r
\r
        saveChainer.execute();\r
    }\r
\r
    function processHtml() {\r
\r
        $servoMixTable = $('#servo-mix-table');\r
        $servoMixTableBody = $servoMixTable.find('tbody');\r
        $motorMixTable = $('#motor-mix-table');\r
        $motorMixTableBody = $motorMixTable.find('tbody');\r
\r
        function fillMixerPreset() {\r
            let mixers = mixer.getByPlatform(FC.MIXER_CONFIG.platformType);\r
\r
            $mixerPreset.find("*").remove();\r
            for (let i in mixers) {\r
                if (mixers.hasOwnProperty(i)) {\r
                    let m = mixers[i];\r
                    $mixerPreset.append('<option value="' + m.id + '">' + m.name + '</option>');\r
                }\r
            }\r
        }\r
\r
        let $platformSelect = $('#platform-type'),\r
            platforms = platform.getList(),\r
            $mixerPreset = $('#mixer-preset'),\r
            $wizardButton = $("#mixer-wizard");\r
\r
        motorWizardModal = new jBox('Modal', {\r
            width: 480,\r
            height: 410,\r
            closeButton: 'title',\r
            animation: false,\r
            attach: $wizardButton,\r
            title: i18n.getMessage("mixerWizardModalTitle"),\r
            content: $('#mixerWizardContent')\r
        });\r
\r
        function validateMixerWizard() {\r
            let errorCount = 0;\r
            for (let i = 0; i < 4; i++) {\r
                const $elements = $('[data-motor] option:selected[id=' + i + ']'),\r
                    assignedRulesCount = $elements.length;\r
\r
                if (assignedRulesCount != 1) {\r
                    errorCount++;\r
                    $elements.closest('tr').addClass("red-background");\r
                } else {\r
                    $elements.closest('tr').removeClass("red-background");\r
                }\r
\r
            }\r
            return (errorCount == 0);\r
        }\r
\r
        $(".wizard-motor-select").on('change', validateMixerWizard);\r
\r
        $("#wizard-execute-button").on('click', function () {\r
\r
            // Validate mixer settings\r
            if (!validateMixerWizard()) {\r
                return;\r
            }\r
\r
            FC.MOTOR_RULES.flush();\r
\r
            for (let i = 0; i < 4; i++) {\r
                const $selects = $(".wizard-motor-select");\r
                let rule = -1;\r
\r
                $selects.each(function () {\r
                    if (parseInt($(this).find(":selected").attr("id"), 10) == i) {\r
                        rule = parseInt($(this).attr("data-motor"), 10);\r
                    }\r
                });\r
\r
                const r = currentMixerPreset.motorMixer[rule];\r
\r
                FC.MOTOR_RULES.put(\r
                    new MotorMixRule(\r
                        r.getThrottle(),\r
                        r.getRoll(),\r
                        r.getPitch(),\r
                        r.getYaw()\r
                    )\r
                );\r
\r
            }\r
\r
            renderMotorMixRules();\r
            renderOutputMapping();\r
\r
            motorWizardModal.close();\r
        });\r
\r
        const updateMotorDirection = function () {\r
            let motorDirectionCheckbox = $('input[name=motor_direction_inverted]:checked');\r
            const isReversed = motorDirectionCheckbox.val() == 1 && (FC.MIXER_CONFIG.platformType == PLATFORM.MULTIROTOR || FC.MIXER_CONFIG.platformType == PLATFORM.TRICOPTER);\r
\r
            import(\`./../resources/motor_order/\${currentMixerPreset.image}\${isReversed ? "_reverse" : ""}.svg\`).then(({default: path}) => {\r
                const $img = $('.mixerPreview img');\r
                $img.attr('src', path);\r
                // Wait for image to load before positioning motor numbers\r
                $img.off('load.motorNumbers').on('load.motorNumbers', function() {\r
                    labelMotorNumbers();\r
                });\r
                // If image is already cached, load event won't fire, so check complete\r
                if ($img[0].complete) {\r
                    labelMotorNumbers();\r
                }\r
            });\r
\r
            renderServoOutputImage();\r
        };\r
\r
        $("#motor_direction_inverted").on('change', updateMotorDirection);\r
        $("#motor_direction_normal").on('change', updateMotorDirection);\r
\r
        $platformSelect.find("*").remove();\r
\r
        for (let i in platforms) {\r
            if (platforms.hasOwnProperty(i)) {\r
                let p = platforms[i];\r
                $platformSelect.append('<option value="' + p.id + '">' + p.name + '</option>');\r
            }\r
        }\r
\r
        $platformSelect.on('change', function () {\r
            FC.MIXER_CONFIG.platformType = parseInt($platformSelect.val(), 10);\r
            currentPlatform = platform.getById(FC.MIXER_CONFIG.platformType);\r
\r
            var $platformSelectParent = $platformSelect.parent('.select');\r
\r
            fillMixerPreset();\r
            $mixerPreset.trigger('change');\r
        });\r
\r
        currentPlatform = platform.getById(FC.MIXER_CONFIG.platformType);\r
        $platformSelect.val(FC.MIXER_CONFIG.platformType).trigger('change');\r
\r
        $mixerPreset.on('change', function () {\r
            const presetId = parseInt($mixerPreset.val(), 10);\r
            currentMixerPreset = mixer.getById(presetId);\r
\r
            FC.MIXER_CONFIG.appliedMixerPreset = presetId;\r
\r
            if (currentMixerPreset.id == 3) {\r
                $("#mixer-wizard-gui_box").removeClass("is-hidden");\r
            } else {\r
                $("#mixer-wizard-gui_box").addClass("is-hidden");\r
            }\r
\r
            if (FC.MIXER_CONFIG.platformType == PLATFORM.AIRPLANE && currentMixerPreset.id != loadedMixerPresetID) {\r
                $("#needToUpdateMixerMessage").removeClass("is-hidden");\r
            } else {\r
                $("#needToUpdateMixerMessage").addClass("is-hidden");\r
            }\r
\r
            if (FC.MIXER_CONFIG.platformType == PLATFORM.MULTIROTOR || FC.MIXER_CONFIG.platformType == PLATFORM.TRICOPTER) {\r
                $('#motor_direction_inverted').parent().removeClass("is-hidden");\r
                $('#platform-type').parent('.select').removeClass('no-bottom-border');\r
            } else {\r
                $('#motor_direction_inverted').parent().addClass("is-hidden");\r
                $('#platform-type').parent('.select').addClass('no-bottom-border');\r
            }\r
\r
            if (!(FC.MIXER_CONFIG.platformType == PLATFORM.MULTIROTOR || FC.MIXER_CONFIG.platformType == PLATFORM.TRICOPTER)) {\r
                FC.EZ_TUNE.enabled = 0;\r
                mspHelper.saveEzTune();\r
            }\r
\r
            updateRefreshButtonStatus();\r
            updateMotorDirection();\r
        });\r
\r
        if (FC.MIXER_CONFIG.appliedMixerPreset > -1) {\r
            loadedMixerPresetID = FC.MIXER_CONFIG.appliedMixerPreset;\r
            $("#needToUpdateMixerMessage").addClass("is-hidden");\r
            $mixerPreset.val(FC.MIXER_CONFIG.appliedMixerPreset).trigger('change');\r
        } else {\r
            $mixerPreset.trigger('change');\r
        }\r
\r
        modal = new jBox('Modal', {\r
            width: 480,\r
            height: 240,\r
            closeButton: 'title',\r
            animation: false,\r
            attach: $('#load-and-apply-mixer-button'),\r
            title: i18n.getMessage("mixerApplyModalTitle"),\r
            content: $('#mixerApplyContent')\r
        });\r
\r
        $('#execute-button').on('click', function () {\r
            loadedMixerPresetID = currentMixerPreset.id;\r
            mixer.loadServoRules(FC, currentMixerPreset);\r
            mixer.loadMotorRules(FC, currentMixerPreset);\r
            FC.MIXER_CONFIG.hasFlaps = (currentMixerPreset.hasFlaps === true) ? true : false;\r
            renderServoMixRules();\r
            renderMotorMixRules();\r
            renderOutputMapping();\r
            modal.close();\r
            saveAndReboot();\r
        });\r
\r
        $('#load-mixer-button').on('click', function () {\r
            if (FC.MIXER_CONFIG.platformType == PLATFORM.AIRPLANE) {\r
                $("#needToUpdateMixerMessage").addClass("is-hidden");\r
            }\r
            loadedMixerPresetID = currentMixerPreset.id;\r
            mixer.loadServoRules(FC, currentMixerPreset);\r
            mixer.loadMotorRules(FC, currentMixerPreset);\r
            FC.MIXER_CONFIG.hasFlaps = (currentMixerPreset.hasFlaps === true) ? true : false;\r
            renderServoMixRules();\r
            renderMotorMixRules();\r
            renderOutputMapping();\r
            updateRefreshButtonStatus();\r
        });\r
\r
        $('#refresh-mixer-button').on('click', function () {\r
            currentMixerPreset = mixer.getById(loadedMixerPresetID);\r
            FC.MIXER_CONFIG.platformType = currentMixerPreset.platform;\r
            currentPlatform = platform.getById(FC.MIXER_CONFIG.platformType);\r
            $platformSelect.val(FC.MIXER_CONFIG.platformType).trigger('change');\r
            $mixerPreset.val(loadedMixerPresetID).trigger('change');\r
            renderServoMixRules();\r
            renderMotorMixRules();\r
            renderOutputMapping();\r
        });\r
\r
        $servoMixTableBody.on('click', "[data-role='role-servo-delete']", function (event) {\r
            FC.SERVO_RULES.drop($(event.currentTarget).attr("data-index"));\r
            renderServoMixRules();\r
            renderOutputMapping();\r
        });\r
\r
        $motorMixTableBody.on('click', "[data-role='role-motor-delete']", function (event) {\r
            FC.MOTOR_RULES.drop($(event.currentTarget).attr("data-index"));\r
            renderMotorMixRules();\r
            renderOutputMapping();\r
        });\r
\r
        $servoMixTableBody.on('change', "input", function (event) {\r
            renderOutputMapping();\r
        });\r
\r
        $("[data-role='role-servo-add']").on('click', function () {\r
            if (FC.SERVO_RULES.hasFreeSlots()) {\r
                FC.SERVO_RULES.put(new ServoMixRule(FC.SERVO_RULES.getNextUnusedIndex(), 0, 100, 0));\r
                renderServoMixRules();\r
                renderOutputMapping();\r
            }\r
        });\r
\r
        $("[data-role='role-motor-add']").on('click', function () {\r
            if (FC.MOTOR_RULES.hasFreeSlots()) {\r
                FC.MOTOR_RULES.put(new MotorMixRule(1, 0, 0, 0));\r
                renderMotorMixRules();\r
                renderOutputMapping();\r
            }\r
        });\r
\r
        $("[data-role='role-logic-conditions-open']").on('click', function () {\r
            FC.LOGIC_CONDITIONS.open();\r
        });\r
\r
        $('#save-button').on('click', saveAndReboot);\r
\r
        renderServoMixRules();\r
        renderMotorMixRules();\r
\r
        renderOutputTable();\r
        renderOutputMapping();\r
        renderTimerOverride();\r
\r
        FC.LOGIC_CONDITIONS.init($('#logic-wrapper'));\r
\r
        i18n.localize();;\r
\r
        interval.add('logic_conditions_pull', getLogicConditionsStatus, 350);\r
\r
        GUI.content_ready(callback);\r
    }\r
\r
    function updateRefreshButtonStatus() {\r
        if (\r
            (currentMixerPreset.id != loadedMixerPresetID && mixer.getById(loadedMixerPresetID).platform == PLATFORM.AIRPLANE) ||\r
            (currentMixerPreset.id == loadedMixerPresetID && currentMixerPreset.platform == PLATFORM.AIRPLANE)\r
           ) {\r
            $("#refresh-mixer-button").parent().removeClass("is-hidden");\r
        } else {\r
            $("#refresh-mixer-button").parent().addClass("is-hidden");\r
        }\r
    }\r
\r
    function getLogicConditionsStatus() {\r
        mspHelper.loadLogicConditionsStatus(onStatusPullDone);\r
    }\r
\r
    function onStatusPullDone() {\r
        FC.LOGIC_CONDITIONS.update(FC.LOGIC_CONDITIONS_STATUS);\r
    }\r
\r
};\r
\r
mixerTab.cleanup = function (callback) {\r
    //delete modal;\r
    //delete motorWizardModal;\r
    $('.jBox-wrapper').remove();\r
    if (callback) callback();\r
};\r
\r
export default mixerTab;\r
`;export{r as default};
