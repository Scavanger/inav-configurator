const r=`'use strict';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import i18n from './../js/localization';\r
import BitHelper from '../js/bitHelper';\r
import Settings from './../js/settings';\r
import features from './../js/feature_framework';\r
import { mixer, PLATFORM } from './../js/model';\r
import timeout from './../js/timeouts';\r
import interval from './../js/intervals';\r
\r
const outputsTab = {};\r
\r
outputsTab.allowTestMode = false;\r
outputsTab.feature3DEnabled = false;\r
outputsTab.feature3DSupported = false;\r
\r
outputsTab.initialize = function (callback) {\r
    var self = this;\r
\r
    self.armed = false;\r
    self.feature3DSupported = false;\r
    self.allowTestMode = true;\r
\r
    var $motorsEnableTestMode;\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    var loadChainer = new MSPChainerClass();\r
\r
    loadChainer.setChain([\r
        mspHelper.loadMiscV2,\r
        mspHelper.loadFeatures,\r
        mspHelper.load3dConfig,\r
        mspHelper.loadMotors,\r
        mspHelper.loadMotorMixRules,\r
        mspHelper.loadServoMixRules,\r
        mspHelper.loadMixerConfig,\r
        mspHelper.loadServoConfiguration,\r
        mspHelper.loadOutputMappingExt,\r
        mspHelper.loadRcData,\r
        mspHelper.loadAdvancedConfig,\r
        function(callback) {\r
            mspHelper.getSetting("motor_direction_inverted").then((data)=>{\r
                self.motorDirectionInverted=data.value;\r
            }).then(callback)\r
        }\r
    ]);\r
    loadChainer.setExitPoint(load_html);\r
    loadChainer.execute();\r
    update_arm_status();\r
\r
    var saveChainer = new MSPChainerClass();\r
\r
    saveChainer.setChain([\r
        saveSettings,\r
        mspHelper.sendServoConfigurations,\r
        mspHelper.saveAdvancedConfig,\r
        mspHelper.saveMiscV2,\r
        mspHelper.save3dConfig,\r
        mspHelper.saveToEeprom\r
    ]);\r
    saveChainer.setExitPoint(function () {\r
        GUI.log(i18n.getMessage('eeprom_saved_ok'));\r
        FC.MOTOR_RULES.cleanup();\r
    });\r
\r
    function load_html() {\r
        import('./outputs.html?raw').then(({default: html}) => GUI.load(html, Settings.processHtml(onLoad)));\r
    }\r
\r
    function saveSettings(onComplete) {\r
        Settings.saveInputs(onComplete);\r
    }\r
\r
    function onLoad() {\r
\r
        self.feature3DEnabled = BitHelper.bit_check(FC.FEATURES, 12);\r
\r
        process_motors();\r
        process_servos();\r
        processConfiguration();\r
\r
        finalize();\r
    }\r
\r
    function getMotorOutputValue(value) {\r
\r
        if (!self.feature3DEnabled) {\r
            let valueNormalized = value - FC.MISC.mincommand;\r
            let maxThrottleNormalized = FC.MISC.maxthrottle - FC.MISC.mincommand;\r
\r
            return Math.round(100 * valueNormalized / maxThrottleNormalized) + "%";\r
        } else {\r
            return value;\r
        }\r
    }\r
\r
    function processConfiguration() {\r
        let escProtocols = FC.getEscProtocols(),\r
            servoRates = FC.getServoRates(),\r
            $idlePercent = $('#throttle_idle'),\r
            $idleInfoBox = $("#throttle_idle-info"),\r
            $motorStopWarningBox = $("#motor-stop-warning"),\r
            $reversibleMotorBox = $(".for-reversible-motors");\r
\r
        function handleIdleMessageBox() {\r
            $idleInfoBox.hide();\r
            if (FC.ADVANCED_CONFIG.motorPwmProtocol >= 5) {\r
                $('.hide-for-shot').hide();\r
                if ($idlePercent.val() > 7.0) {\r
                    $idleInfoBox.html(i18n.getMessage('throttleIdleDigitalInfo'));\r
                    $idleInfoBox.addClass('ok-box');\r
                    $idleInfoBox.show();\r
                }\r
            } else {\r
                $('.hide-for-shot').show();\r
                if ($idlePercent.val() > 10.0) {\r
                    $idleInfoBox.html(i18n.getMessage('throttleIdleAnalogInfo'));\r
                    $idleInfoBox.addClass('ok-box');\r
                    $idleInfoBox.show();\r
                }\r
            }\r
        }\r
\r
        let $escProtocol = $('#esc-protocol');\r
        \r
        for (let i in escProtocols) {\r
            if (escProtocols.hasOwnProperty(i)) {\r
                var protocolData = escProtocols[i];\r
                $escProtocol.append('<option value="' + i + '">' + protocolData.name + '</option>');\r
            }\r
        }\r
\r
        $escProtocol.val(FC.ADVANCED_CONFIG.motorPwmProtocol);\r
\r
        $escProtocol.on('change', function () {\r
            FC.ADVANCED_CONFIG.motorPwmProtocol = $(this).val();\r
        });\r
\r
        $idlePercent.on('change', handleIdleMessageBox);\r
        handleIdleMessageBox();\r
\r
        $("#esc-protocols").show();\r
\r
        let $servoRate = $('#servo-rate');\r
\r
        for (let i in servoRates) {\r
            if (servoRates.hasOwnProperty(i)) {\r
                $servoRate.append('<option value="' + i + '">' + servoRates[i] + '</option>');\r
            }\r
        }\r
        /*\r
         *  If rate from FC is not on the list, add a new entry\r
         */\r
        if ($servoRate.find('[value="' + FC.ADVANCED_CONFIG.servoPwmRate + '"]').length == 0) {\r
            $servoRate.append('<option value="' + FC.ADVANCED_CONFIG.servoPwmRate + '">' + FC.ADVANCED_CONFIG.servoPwmRate + 'Hz</option>');\r
        }\r
\r
        $servoRate.val(FC.ADVANCED_CONFIG.servoPwmRate);\r
        $servoRate.on('change', function () {\r
            FC.ADVANCED_CONFIG.servoPwmRate = $(this).val();\r
        });\r
\r
        $('#servo-rate-container').show();\r
\r
        features.updateUI($('.tab-motors'), FC.FEATURES);\r
        GUI.simpleBind();\r
\r
        let $reversibleMotorCheckbox = $('#feature-12');\r
        function showHideReversibleMotorInfo() {\r
            const reversibleMotorEnabled = $reversibleMotorCheckbox.is(':checked');\r
\r
            console.log(reversibleMotorEnabled);\r
\r
            if (reversibleMotorEnabled) {\r
                $reversibleMotorBox.show();\r
            } else {\r
                $reversibleMotorBox.hide();\r
            }\r
        }\r
        $reversibleMotorCheckbox.on('change', showHideReversibleMotorInfo);\r
        showHideReversibleMotorInfo();\r
\r
        let $motorStopCheckbox = $('#feature-4');\r
        function showHideMotorStopWarning() {\r
            const platformNeedsMotorStop = [PLATFORM.AIRPLANE, PLATFORM.ROVER, PLATFORM.BOAT].includes(FC.MIXER_CONFIG.platformType);\r
            const motorStopEnabled = $motorStopCheckbox.is(':checked');\r
            if (platformNeedsMotorStop && motorStopEnabled || !platformNeedsMotorStop && !motorStopEnabled) {\r
                $motorStopWarningBox.hide();\r
            } else {\r
                $motorStopWarningBox.show();\r
            }\r
        }\r
        $motorStopCheckbox.on('change', showHideMotorStopWarning);\r
        showHideMotorStopWarning();\r
\r
        $('#3ddeadbandlow').val(FC.REVERSIBLE_MOTORS.deadband_low);\r
        $('#3ddeadbandhigh').val(FC.REVERSIBLE_MOTORS.deadband_high);\r
        $('#3dneutral').val(FC.REVERSIBLE_MOTORS.neutral);\r
    }\r
\r
    function update_arm_status() {\r
        self.armed = FC.isModeEnabled('ARM');\r
    }\r
\r
    function initSensorData() {\r
        for (var i = 0; i < 3; i++) {\r
            FC.SENSOR_DATA.accelerometer[i] = 0;\r
        }\r
    }\r
\r
    function initDataArray(length) {\r
        var data = new Array(length);\r
        for (var i = 0; i < length; i++) {\r
            data[i] = [];\r
            data[i].min = -1;\r
            data[i].max = 1;\r
        }\r
        return data;\r
    }\r
\r
    function addSampleToData(data, sampleNumber, sensorData) {\r
        for (var i = 0; i < data.length; i++) {\r
            var dataPoint = sensorData[i];\r
            data[i].push([sampleNumber, dataPoint]);\r
            if (dataPoint < data[i].min) {\r
                data[i].min = dataPoint;\r
            }\r
            if (dataPoint > data[i].max) {\r
                data[i].max = dataPoint;\r
            }\r
        }\r
        while (data[0].length > 40) {\r
            for (let i = 0; i < data.length; i++) {\r
                data[i].shift();\r
            }\r
        }\r
        return sampleNumber + 1;\r
    }\r
\r
    function update_model(val) {\r
        if (FC.MIXER_CONFIG.appliedMixerPreset == -1) return;\r
\r
        const isMotorInverted = self.motorDirectionInverted;\r
        const isReversed = isMotorInverted && (FC.MIXER_CONFIG.platformType == PLATFORM.MULTIROTOR || FC.MIXER_CONFIG.platformType == PLATFORM.TRICOPTER);\r
\r
        import(\`./../resources/motor_order/\${mixer.getById(val).image}\${isReversed ? "_reverse" : ""}.svg\`).then(({default: path}) => {\r
            $('.mixerPreview img').attr('src', path);\r
        });\r
        labelMotorNumbers();\r
    }\r
\r
    function process_servos() {\r
\r
        let $tabServos = $(".tab-servos"),\r
            $servoEmptyTableInfo = $('#servoEmptyTableInfo'),\r
            $servoConfigTableContainer = $('#servo-config-table-container'),\r
            $servoConfigTable = $('#servo-config-table');\r
\r
        if (FC.SERVO_CONFIG.length == 0) {\r
            $tabServos.addClass("is-hidden");\r
            return;\r
        }\r
\r
        function renderServos(name, alternate, obj) {\r
\r
            $servoConfigTable.append('\\\r
                <tr> \\\r
                    <td class="text-center">' + name + '</td>\\\r
                    <td class="middle"><input type="number" min="500" max="2500" value="' + FC.SERVO_CONFIG[obj].middle + '" /></td>\\\r
                    <td class="min"><input type="number" min="500" max="2500" value="' + FC.SERVO_CONFIG[obj].min + '" /></td>\\\r
                    <td class="max"><input type="number" min="500" max="2500" value="' + FC.SERVO_CONFIG[obj].max + '" /></td>\\\r
                    <td class="text-center rate">\\\r
                    <td class="text-center reverse">\\\r
                    </td>\\\r
                </tr> \\\r
            ');\r
\r
            let $currentRow = $servoConfigTable.find('tr:last');\r
\r
            // adding select box and generating options\r
            $currentRow.find('td.rate').append(\r
                '<input class="rate-input" type="number" min="' + FC.MIN_SERVO_RATE + '" max="' + FC.MAX_SERVO_RATE + '" value="' + Math.abs(FC.SERVO_CONFIG[obj].rate) + '" />'\r
            );\r
\r
            $currentRow.find('td.reverse').append(\r
                '<input type="checkbox" class="reverse-input togglemedium" ' + (FC.SERVO_CONFIG[obj].rate < 0 ? ' checked ' : '') + '/>'\r
            );\r
\r
            $currentRow.data('info', { 'obj': obj });\r
\r
            $currentRow.append('<td class="text-center output"></td>');\r
\r
            let output,\r
                outputString;\r
\r
            if (FC.MIXER_CONFIG.platformType == PLATFORM.MULTIROTOR || FC.MIXER_CONFIG.platformType == PLATFORM.TRICOPTER) {\r
                output = FC.OUTPUT_MAPPING.getMrServoOutput(usedServoIndex);\r
            } else {\r
                output = FC.OUTPUT_MAPPING.getFwServoOutput(usedServoIndex);\r
            }\r
\r
            if (output === null) {\r
                outputString = "-";\r
            } else {\r
                outputString = "S" + output;\r
            }\r
\r
            $currentRow.find('.output').html(outputString);\r
            //For 2.0 and above hide a row when servo is not configured\r
            if (!FC.SERVO_RULES.isServoConfigured(obj)) {\r
                $currentRow.hide();\r
            } else {\r
                usedServoIndex++;\r
            }\r
        }\r
\r
        function servos_update() {\r
            $servoConfigTable.find('tr:not(".main")').each(function () {\r
                var info = $(this).data('info');\r
\r
                var selection = $('.channel input', this);\r
                var channelIndex = parseInt(selection.index(selection.filter(':checked')));\r
                if (channelIndex == -1) {\r
                    channelIndex = undefined;\r
                }\r
\r
                FC.SERVO_CONFIG[info.obj].middle = parseInt($('.middle input', this).val());\r
                FC.SERVO_CONFIG[info.obj].min = parseInt($('.min input', this).val());\r
                FC.SERVO_CONFIG[info.obj].max = parseInt($('.max input', this).val());\r
                var rate = parseInt($('.rate-input', this).val());\r
                if ($('.reverse-input', this).is(':checked')) {\r
                    rate = -rate;\r
                }\r
                FC.SERVO_CONFIG[info.obj].rate = rate;\r
            });\r
\r
            FC.REVERSIBLE_MOTORS.deadband_low = parseInt($('#3ddeadbandlow').val());\r
            FC.REVERSIBLE_MOTORS.deadband_high = parseInt($('#3ddeadbandhigh').val());\r
            FC.REVERSIBLE_MOTORS.neutral = parseInt($('#3dneutral').val());\r
\r
            //Save configuration to FC\r
            saveChainer.execute();\r
        }\r
\r
        // drop previous table\r
        $servoConfigTable.find('tr:not(:first)').remove();\r
\r
        let usedServoIndex = 0;\r
\r
        for (let servoIndex = 0; servoIndex < FC.SERVO_RULES.getServoCount(); servoIndex++) {\r
            renderServos('Servo ' + servoIndex, '', servoIndex);\r
        }\r
        if (usedServoIndex == 0) {\r
            // No servos configured\r
            $servoEmptyTableInfo.show();\r
            $servoConfigTableContainer.hide();\r
        } else {\r
            $servoEmptyTableInfo.hide();\r
            $servoConfigTableContainer.show();\r
        }\r
\r
        // UI hooks for dynamically generated elements\r
        $('table.directions select, table.directions input, #servo-config-table select, #servo-config-table input').on('change', function () {\r
            if ($('div.live input').is(':checked')) {\r
                // apply small delay as there seems to be some funky update business going wrong\r
                timeout.add('servos_update', servos_update, 10);\r
            }\r
        });\r
\r
        $('a.update').on('click', function () {\r
            features.reset();\r
            features.fromUI($('.tab-motors'));\r
            features.execute(servos_update);\r
        });\r
        $('a.save').on('click', function () {\r
            saveChainer.setExitPoint(function () {\r
                //noinspection JSUnresolvedVariable\r
                GUI.log(i18n.getMessage('configurationEepromSaved'));\r
\r
                GUI.tab_switch_cleanup(function () {\r
                    MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, function () {\r
                        GUI.log(i18n.getMessage('deviceRebooting'));\r
                        GUI.handleReconnect($('.tab_outputs a'));\r
                    });\r
                });\r
            });\r
            features.reset();\r
            features.fromUI($('.tab-motors'));\r
            features.execute(servos_update);\r
        });\r
\r
    }\r
\r
    function process_motors() {\r
        $motorsEnableTestMode = $('#motorsEnableTestMode');\r
\r
        if (self.feature3DEnabled && !self.feature3DSupported) {\r
            self.allowTestMode = false;\r
        }\r
\r
        $motorsEnableTestMode.prop('checked', false);\r
        $motorsEnableTestMode.prop('disabled', true);\r
\r
        update_model(FC.MIXER_CONFIG.appliedMixerPreset);\r
\r
        // Always start with default/empty sensor data array, clean slate all\r
        initSensorData();\r
\r
        // Setup variables\r
        var samples_accel_i = 0,\r
            accel_data = initDataArray(3),\r
            accel_max_read = [0, 0, 0],\r
            accel_offset = [0, 0, 0],\r
            accel_offset_established = false;\r
\r
        let $rmsHelper = $(".acc-rms"),\r
            $currentHelper = $(".current-current"),\r
            $voltageHelper = $(".current-voltage");\r
\r
        // timer initialization\r
        interval.killAll(['motor_and_status_pull', 'global_data_refresh', 'msp-load-update', 'ltm-connection-check']);\r
\r
        interval.add('IMU_pull', function () {\r
            MSP.send_message(MSPCodes.MSP_RAW_IMU, false, false, update_accel_graph);\r
        }, 25, true);\r
\r
        interval.add('ANALOG_pull', function () {\r
            $currentHelper.html(FC.ANALOG.amperage.toFixed(2));\r
            $voltageHelper.html(FC.ANALOG.voltage.toFixed(2));\r
        }, 100, true);\r
\r
        function update_accel_graph() {\r
\r
            if (!accel_offset_established) {\r
                for (var i = 0; i < 3; i++) {\r
                    accel_offset[i] = FC.SENSOR_DATA.accelerometer[i] * -1;\r
                }\r
\r
                accel_offset_established = true;\r
            }\r
\r
            var accel_with_offset = [\r
                accel_offset[0] + FC.SENSOR_DATA.accelerometer[0],\r
                accel_offset[1] + FC.SENSOR_DATA.accelerometer[1],\r
                accel_offset[2] + FC.SENSOR_DATA.accelerometer[2]\r
            ];\r
\r
            samples_accel_i = addSampleToData(accel_data, samples_accel_i, accel_with_offset);\r
\r
            // Compute RMS of acceleration in displayed period of time\r
            // This is particularly useful for motor balancing as it\r
            // eliminates the need for external tools\r
            var sum = 0.0;\r
            for (var j = 0; j < accel_data.length; j++)\r
                for (var k = 0; k < accel_data[j].length; k++)\r
                    sum += accel_data[j][k][1] * accel_data[j][k][1];\r
\r
            let rms = Math.sqrt(sum / (accel_data[0].length + accel_data[1].length + accel_data[2].length));\r
            $rmsHelper.text(rms.toFixed(4));\r
\r
            for (var i = 0; i < 3; i++) {\r
                if (Math.abs(accel_with_offset[i]) > Math.abs(accel_max_read[i])) accel_max_read[i] = accel_with_offset[i];\r
            }\r
        }\r
\r
        let motors_wrapper = $('.motors .bar-wrapper'),\r
            servos_wrapper = $('.servos .bar-wrapper'),\r
            $motorTitles = $('.motor-titles'),\r
            $motorSliders = $('.motor-sliders'),\r
            $motorValues = $('.motor-values');\r
\r
        for (let i = 0; i < FC.MOTOR_RULES.getNumberOfConfiguredMotors(); i++) {\r
            const motorNumber = i + 1;\r
            motors_wrapper.append('\\\r
                <div class="m-block motor-' + i + '">\\\r
                    <div class="meter-bar">\\\r
                        <div class="label"></div>\\\r
                        <div class="indicator">\\\r
                            <div class="label">\\\r
                                <div class="label"></div>\\\r
                            </div>\\\r
                        </div>\\\r
                    </div>\\\r
                </div>\\\r
            ');\r
            $motorTitles.append('<li title="Motor - ' + motorNumber + '">' + motorNumber + '</li>');\r
            $motorSliders.append('<div class="motor-slider-container"><input type="range" min="1000" max="2000" value="1000" disabled="disabled"/></div>');\r
            $motorValues.append('<li>0%</li>');\r
        }\r
\r
        $motorSliders.append('<div class="motor-slider-container"><input type="range" min="1000" max="2000" value="1000" disabled="disabled" class="master"/></div>');\r
        $motorValues.append('<li style="font-weight: bold" data-i18n="motorsMaster"></li>');\r
\r
        for (let i = 0; i < FC.SERVO_RULES.getServoCount(); i++) {\r
\r
            let opacity = "";\r
            if (!FC.SERVO_RULES.isServoConfigured(15 - i)) {\r
                opacity = ' style="opacity: 0.2"';\r
            }\r
\r
            servos_wrapper.append('\\\r
                <div class="m-block servo-' + (15 - i) + '" ' + opacity + '>\\\r
                    <div class="meter-bar">\\\r
                        <div class="label"></div>\\\r
                        <div class="indicator">\\\r
                            <div class="label">\\\r
                                <div class="label"></div>\\\r
                            </div>\\\r
                        </div>\\\r
                    </div>\\\r
                </div>\\\r
            ');\r
        }\r
\r
        var $slidersInput = $('div.sliders input');\r
\r
        $slidersInput.prop('min', FC.MISC.mincommand);\r
        $slidersInput.prop('max', FC.MISC.maxthrottle);\r
        $('div.values li:not(:last)').text(FC.MISC.mincommand);\r
\r
        if (self.feature3DEnabled && self.feature3DSupported) {\r
            //Arbitrary sanity checks\r
            //Note: values may need to be revisited\r
            if (FC.REVERSIBLE_MOTORS.neutral > 1575 || FC.EVERSIBLE_MOTORS.neutral < 1425)\r
                FC.REVERSIBLE_MOTORS.neutral = 1500;\r
\r
            $slidersInput.val(FC.REVERSIBLE_MOTORS.neutral);\r
        } else {\r
            $slidersInput.val(FC.MISC.mincommand);\r
        }\r
\r
        if (self.allowTestMode) {\r
            // UI hooks\r
            var buffering_set_motor = [],\r
                buffer_delay = false;\r
\r
            $('div.sliders input:not(.master)').on('input', function () {\r
\r
                var index = $('div.sliders input:not(.master)').index(this),\r
                    buffer = [],\r
                    i;\r
\r
                $('div.values li').eq(index).text(getMotorOutputValue($(this).val()));\r
\r
                for (let i = 0; i < 8; i++) {\r
                    var val = parseInt($('div.sliders input').eq(i).val());\r
\r
                    buffer.push(BitHelper.lowByte(val));\r
                    buffer.push(BitHelper.highByte(val));\r
                }\r
\r
                buffering_set_motor.push(buffer);\r
\r
                if (!buffer_delay) {\r
                    buffer_delay = setTimeout(function () {\r
                        buffer = buffering_set_motor.pop();\r
\r
                        MSP.send_message(MSPCodes.MSP_SET_MOTOR, buffer);\r
\r
                        buffering_set_motor = [];\r
                        buffer_delay = false;\r
                    }, 100);\r
                }\r
            });\r
        }\r
\r
        $('div.sliders input.master').on('input', function () {\r
            var val = $(this).val();\r
            $('div.sliders input:not(:disabled, :last)').val(val);\r
            $('div.values li:not(:last)').slice(0, FC.MOTOR_RULES.getNumberOfConfiguredMotors()).text(getMotorOutputValue(val));\r
            $('div.sliders input:not(:last):first').trigger('input');\r
        });\r
\r
        $motorsEnableTestMode.on('change', function () {\r
            if ($(this).is(':checked')) {\r
                $slidersInput.slice(0, FC.MOTOR_RULES.getNumberOfConfiguredMotors()).prop('disabled', false);\r
\r
                // unlock master slider\r
                $('div.sliders input:last').prop('disabled', false);\r
            } else {\r
                // disable sliders / min max\r
                $slidersInput.prop('disabled', true);\r
\r
                // change all values to default\r
                if (self.feature3DEnabled && self.feature3DSupported) {\r
                    $slidersInput.val(FC.REVERSIBLE_MOTORS.neutral);\r
                } else {\r
                    $slidersInput.val(FC.MISC.mincommand);\r
                }\r
\r
                $slidersInput.trigger('input');\r
            }\r
        });\r
\r
        // check if motors are already spinning\r
        var motors_running = false;\r
\r
        for (var i = 0; i < FC.MOTOR_RULES.getNumberOfConfiguredMotors(); i++) {\r
            if (!self.feature3DEnabled) {\r
                if (FC.MOTOR_DATA[i] > FC.MISC.mincommand) {\r
                    motors_running = true;\r
                    break;\r
                }\r
            } else {\r
                if ((FC.MOTOR_DATA[i] < FC.REVERSIBLE_MOTORS.deadband_low) || (FC.MOTOR_DATA[i] > FC.REVERSIBLE_MOTORS.deadband_high)) {\r
                    motors_running = true;\r
                    break;\r
                }\r
            }\r
        }\r
\r
        if (motors_running) {\r
            if (!self.armed && self.allowTestMode) {\r
                $motorsEnableTestMode.prop('checked', true);\r
            }\r
            // motors are running adjust sliders to current values\r
\r
            var sliders = $('div.sliders input:not(.master)');\r
\r
            var master_value = FC.MOTOR_DATA[0];\r
            for (var i = 0; i < FC.MOTOR_DATA.length; i++) {\r
                if (FC.MOTOR_DATA[i] > 0) {\r
                    sliders.eq(i).val(FC.MOTOR_DATA[i]);\r
\r
                    if (master_value != FC.MOTOR_DATA[i]) {\r
                        master_value = false;\r
                    }\r
                }\r
            }\r
\r
            // only fire events when all values are set\r
            sliders.trigger('input');\r
\r
            // slide master slider if condition is valid\r
            if (master_value) {\r
                $('div.sliders input.master').val(master_value);\r
                $('div.sliders input.master').trigger('input');\r
            }\r
        }\r
\r
        $motorsEnableTestMode.trigger('change');\r
\r
        function getPeriodicMotorOutput() {\r
            MSP.send_message(MSPCodes.MSP_MOTOR, false, false, getPeriodicServoOutput);\r
        }\r
\r
        function getPeriodicServoOutput() {\r
            MSP.send_message(MSPCodes.MSP_SERVO, false, false, update_ui);\r
        }\r
\r
        var full_block_scale = FC.MISC.maxthrottle - FC.MISC.mincommand;\r
\r
        function update_ui() {\r
            var previousArmState = self.armed,\r
                block_height = $('div.m-block:first').height(),\r
                data,\r
                margin_top,\r
                height,\r
                color,\r
                i;\r
\r
            for (let i= 0; i < FC.MOTOR_DATA.length; i++) {\r
                data = FC.MOTOR_DATA[i] - FC.MISC.mincommand;\r
                margin_top = block_height - (data * (block_height / full_block_scale)).clamp(0, block_height);\r
                height = (data * (block_height / full_block_scale)).clamp(0, block_height);\r
                color = parseInt(data * 0.009);\r
\r
                $('.motor-' + i + ' .label', motors_wrapper).text(getMotorOutputValue(FC.MOTOR_DATA[i]));\r
                $('.motor-' + i + ' .indicator', motors_wrapper).css({ 'margin-top': margin_top + 'px', 'height': height + 'px', 'background-color': '#37a8db' + color + ')' });\r
            }\r
\r
            // servo indicators are still using old (not flexible block scale), it will be changed in the future accordingly\r
            for (let i= 0; i < FC.SERVO_DATA.length; i++) {\r
                data = FC.SERVO_DATA[i] - 1000;\r
                margin_top = block_height - (data * (block_height / 1000)).clamp(0, block_height);\r
                height = (data * (block_height / 1000)).clamp(0, block_height);\r
                color = parseInt(data * 0.009);\r
\r
                $('.servo-' + i + ' .label', servos_wrapper).text(FC.SERVO_DATA[i]);\r
                $('.servo-' + i + ' .indicator', servos_wrapper).css({ 'margin-top': margin_top + 'px', 'height': height + 'px', 'background-color': '#37a8db' + color + ')' });\r
            }\r
            //keep the following here so at least we get a visual cue of our motor setup\r
            update_arm_status();\r
            if (!self.allowTestMode) return;\r
\r
            if (self.armed) {\r
                $motorsEnableTestMode.prop('disabled', true);\r
                $motorsEnableTestMode.prop('checked', false);\r
            } else {\r
                if (self.allowTestMode) {\r
                    $motorsEnableTestMode.prop('disabled', false);\r
                }\r
            }\r
\r
            if (previousArmState != self.armed) {\r
                console.log('arm state change detected');\r
                $motorsEnableTestMode.trigger('change');\r
            }\r
        }\r
\r
        // enable Status and Motor data pulling\r
        interval.add('motor_and_status_pull', getPeriodicMotorOutput, 100, true);\r
    }\r
\r
    function finalize() {\r
       i18n.localize();;\r
        GUI.content_ready(callback);\r
    }\r
\r
   function labelMotorNumbers() {\r
\r
       if (mixer.getById(FC.MIXER_CONFIG.appliedMixerPreset).image != 'quad_x') {\r
           return;\r
       }\r
\r
\r
        let index = 0;\r
        var rules = FC.MOTOR_RULES.get();\r
\r
        for (const i in rules) {\r
            if (rules.hasOwnProperty(i)) {\r
                const rule = rules[i];\r
                index++;\r
\r
                let top_px = 30;\r
                let left_px = 28;\r
                if (rule.getRoll() < -0.5) {\r
                  left_px = $("#motor-mixer-preview-img").width() - 20;\r
                }\r
\r
                if (rule.getPitch() > 0.5) {\r
                  top_px = $("#motor-mixer-preview-img").height() - 20;\r
                }\r
                $("#motorNumber"+index).css("left", left_px + "px");\r
                $("#motorNumber"+index).css("top", top_px + "px");\r
                $("#motorNumber"+index).css("visibility", "visible");\r
            }\r
        }\r
    }\r
\r
\r
};\r
\r
outputsTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default outputsTab;\r
`;export{r as default};
