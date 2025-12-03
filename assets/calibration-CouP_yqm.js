const n=`'use strict';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import timeout from './../js/timeouts';\r
import interval from './../js/intervals';\r
import i18n from './../js/localization';\r
import jBox from 'jbox';\r
\r
const calibrationTab = {};\r
\r
calibrationTab.model = (function () {\r
    var publicScope = {},\r
        privateScope = {};\r
\r
    privateScope.step = null;\r
\r
    publicScope.next = function () {\r
\r
        if (privateScope.step === null) {\r
            privateScope.step = 1;\r
        } else {\r
            var count = 0;\r
            for (var i = 0; i < 6; i++) {\r
                if (FC.CALIBRATION_DATA.acc['Pos' + i] === 1) {\r
                    count++;\r
                }\r
            }\r
\r
            privateScope.step = count;\r
        }\r
\r
        console.log(privateScope.step);\r
\r
        if (privateScope.step > 5) {\r
            privateScope.step = null;\r
        }\r
\r
        return privateScope.step;\r
    };\r
\r
    publicScope.getStep = function () {\r
        return privateScope.step;\r
    };\r
\r
    return publicScope;\r
})();\r
\r
calibrationTab.initialize = function (callback) {\r
\r
    var loadChainer = new MSPChainerClass(),\r
        saveChainer = new MSPChainerClass(),\r
        modalStart,\r
        modalStop,\r
        modalProcessing;\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
    \r
    loadChainer.setChain([\r
        mspHelper.queryFcStatus,\r
        mspHelper.loadSensorConfig,\r
        mspHelper.loadCalibrationData\r
    ]);\r
    loadChainer.setExitPoint(loadHtml);\r
    loadChainer.execute();\r
\r
    saveChainer.setChain([\r
        mspHelper.saveCalibrationData,\r
        mspHelper.saveToEeprom\r
    ]);\r
    saveChainer.setExitPoint(reboot);\r
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
        GUI.handleReconnect($('.tab_calibration a'));\r
    }\r
\r
    function loadHtml() {\r
        import('./calibration.html?raw').then(({default: html}) => GUI.load(html, processHtml));\r
    }\r
\r
    function updateCalibrationSteps() {\r
        for (var i = 0; i < 6; i++) {\r
            var $element = $('[data-step="' + (i + 1) + '"]');\r
\r
            if (FC.CALIBRATION_DATA.acc['Pos' + i] === 0) {\r
                $element.removeClass('finished').removeClass('active');\r
            } else {\r
                $element.addClass("finished").removeClass('active');\r
            }\r
        }\r
    }\r
\r
    function updateSensorData() {\r
        var pos = ['X', 'Y', 'Z'];\r
        pos.forEach(function (item) {\r
            $('[name=accGain' + item + ']').val(FC.CALIBRATION_DATA.accGain[item]);\r
            $('[name=accZero' + item + ']').val(FC.CALIBRATION_DATA.accZero[item]);\r
            $('[name=Mag' + item + ']').val(FC.CALIBRATION_DATA.magZero[item]);\r
            $('[name=MagGain' + item + ']').val(FC.CALIBRATION_DATA.magGain[item]);\r
        });\r
        $('[name=OpflowScale]').val(FC.CALIBRATION_DATA.opflow.Scale);\r
        updateCalibrationSteps();\r
    }\r
\r
    function checkFinishAccCalibrate() {\r
        if (calibrationTab.model.next() === null) {\r
            modalStop = new jBox('Modal', {\r
                width: 400,\r
                height: 200,\r
                animation: false,\r
                closeOnClick: false,\r
                closeOnEsc: false,\r
                content: $('#modal-acc-calibration-stop')\r
            }).open();\r
        }\r
        updateSensorData();\r
    }\r
\r
    function calibrateNew() {\r
        var newStep = null,\r
            $button = $(this);\r
\r
        if (calibrationTab.model.getStep() === null) {\r
            for (var i = 0; i < 6; i++) {\r
                if (FC.CALIBRATION_DATA.acc['Pos' + i] === 1) {\r
                    FC.CALIBRATION_DATA.acc['Pos' + i] = 0;\r
                }\r
            }\r
            updateCalibrationSteps();\r
            modalStart = new jBox('Modal', {\r
                width: 400,\r
                height: 200,\r
                animation: false,\r
                closeOnClick: false,\r
                closeOnEsc: false,\r
                content: $('#modal-acc-calibration-start')\r
            }).open();\r
        } else {\r
            newStep = calibrationTab.model.next();\r
        }\r
\r
        /*\r
         * Communication\r
         */\r
        if (newStep !== null) {\r
            $button.addClass('disabled');\r
\r
            modalProcessing = new jBox('Modal', {\r
                width: 400,\r
                height: 120,\r
                animation: false,\r
                closeOnClick: false,\r
                closeOnEsc: false,\r
                content: $('#modal-acc-processing')\r
            }).open();\r
\r
            MSP.send_message(MSPCodes.MSP_ACC_CALIBRATION, false, false, function () {\r
                GUI.log(i18n.getMessage('initialSetupAccelCalibStarted'));\r
            });\r
\r
            timeout.add('acc_calibration_timeout', function () {\r
                $button.removeClass('disabled');\r
\r
                modalProcessing.close();\r
                MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, checkFinishAccCalibrate);\r
                GUI.log(i18n.getMessage('initialSetupAccelCalibEnded'));\r
            }, 2000);\r
        }\r
    }\r
\r
    function setupCalibrationButton(callback) {\r
        if (FC.getAccelerometerCalibrated()) {\r
            $('#calibrate-start-button').html(i18n.getMessage("AccResetBtn"));\r
            $('#calibrate-start-button').prop("title", i18n.getMessage("AccResetBtn"));\r
            $('#calibrate-start-button').removeClass("calibrate");\r
            $('#calibrate-start-button').addClass("resetCalibration");\r
        } else {\r
            $('#calibrate-start-button').html(i18n.getMessage("AccBtn"));\r
            $('#calibrate-start-button').prop("title", i18n.getMessage("AccBtn"));\r
            $('#calibrate-start-button').addClass("calibrate");\r
            $('#calibrate-start-button').removeClass("resetCalibration");\r
        }\r
    \r
        if (callback) callback();\r
    }\r
    \r
    function actionCalibrateButton(callback) {\r
        if ($('#calibrate-start-button').hasClass("resetCalibration")) {\r
            resetAccCalibration();\r
        } else {\r
            calibrateNew();\r
        }\r
    \r
        \r
    }\r
\r
    function resetAccCalibration() {\r
        var pos = ['X', 'Y', 'Z'];\r
        pos.forEach(function (item) {\r
            FC.CALIBRATION_DATA.accGain[item] = 4096;\r
            FC.CALIBRATION_DATA.accZero[item] = 0;\r
        });\r
\r
        saveChainer.execute();\r
    }\r
\r
    function processHtml() {\r
        $('#calibrateButtonSave').on('click', function () {\r
            FC.CALIBRATION_DATA.opflow.Scale = parseFloat($('[name=OpflowScale]').val());\r
            saveChainer.execute();\r
        });\r
\r
        if (FC.SENSOR_CONFIG.magnetometer === 0) {\r
            //Comment for test\r
            $('#mag_btn, #mag-calibrated-data').css('pointer-events', 'none').css('opacity', '0.4');\r
        }\r
\r
        if (FC.SENSOR_CONFIG.opflow === 0) {\r
            //Comment for test\r
            $('#opflow_btn, #opflow-calibrated-data').css('pointer-events', 'none').css('opacity', '0.4');\r
        }\r
\r
        $('#mag_btn').on('click', function () {\r
            MSP.send_message(MSPCodes.MSP_MAG_CALIBRATION, false, false, function () {\r
                GUI.log(i18n.getMessage('initialSetupMagCalibStarted'));\r
            });\r
\r
            var button = $(this);\r
\r
            $(button).addClass('disabled');\r
\r
            let modalProcessing = new jBox('Modal', {\r
                width: 400,\r
                height: 120,\r
                animation: false,\r
                closeOnClick: false,\r
                closeOnEsc: false,\r
                content: $('#modal-compass-processing').clone()\r
            }).open();\r
\r
            var countdown = 30;\r
            interval.add('compass_calibration_interval', function () {\r
                countdown--;\r
                if (countdown === 0) {\r
                    setTimeout(function () {\r
                        $(button).removeClass('disabled');\r
\r
                        modalProcessing.close();\r
                        GUI.log(i18n.getMessage('initialSetupMagCalibEnded'));\r
                        \r
                        MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, updateSensorData);\r
                        interval.remove('compass_calibration_interval');\r
\r
                        //Cleanup\r
                       //delete modalProcessing;\r
                        $('.jBox-wrapper').remove();\r
                    }, 1000);\r
                } else {\r
                    modalProcessing.content.find('.modal-compass-countdown').text(countdown);\r
                }\r
\r
            }, 1000);\r
        });\r
\r
        $('#opflow_btn').on('click', function () {\r
            MSP.send_message(MSPCodes.MSP2_INAV_OPFLOW_CALIBRATION, false, false, function () {\r
                GUI.log(i18n.getMessage('initialSetupOpflowCalibStarted'));\r
            });\r
\r
            var button = $(this);\r
\r
            $(button).addClass('disabled');\r
\r
            modalProcessing = new jBox('Modal', {\r
                width: 400,\r
                height: 120,\r
                animation: false,\r
                closeOnClick: false,\r
                closeOnEsc: false,\r
                content: $('#modal-opflow-processing')\r
            }).open();\r
\r
            var countdown = 30;\r
            interval.add('opflow_calibration_interval', function () {\r
                countdown--;\r
                $('#modal-opflow-countdown').text(countdown);\r
                if (countdown === 0) {\r
                    $(button).removeClass('disabled');\r
\r
                    modalProcessing.close();\r
                    GUI.log(i18n.getMessage('initialSetupOpflowCalibEnded'));\r
                    MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, updateSensorData);\r
                    interval.remove('opflow_calibration_interval');\r
                }\r
            }, 1000);\r
        });\r
\r
        $('#modal-start-button').on('click', function () {\r
            modalStart.close();\r
            calibrationTab.model.next();\r
        });\r
\r
        $('#modal-stop-button').on('click', function () {\r
            modalStop.close();\r
        });\r
\r
        // translate to user-selected language\r
       i18n.localize();\r
\r
        setupCalibrationButton();\r
        $('#calibrate-start-button').on('click', actionCalibrateButton);\r
       \r
        MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, updateSensorData);\r
\r
        GUI.content_ready(callback);\r
    }\r
};\r
\r
calibrationTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default calibrationTab;`;export{n as default};
