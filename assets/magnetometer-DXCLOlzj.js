const e=`'use strict';\r
\r
import * as THREE from 'three';\r
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';\r
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';\r
import noUiSlider from 'nouislider';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import MSP from './../js/msp';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import mspHelper from './../js/msp/MSPHelper';\r
import FC from './../js/fc';\r
import GUI from './../js/gui';\r
import i18n from './../js/localization';\r
import { mixer } from './../js/model';\r
import interval from './../js/intervals';\r
\r
const magnetometerTab = {};\r
\r
magnetometerTab.initialize = function (callback) {\r
    var self = this;\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    self.alignmentConfig = {\r
        pitch: 0,\r
        roll: 0,\r
        yaw: 0\r
    };\r
\r
    self.boardAlignmentConfig = {\r
        pitch: 0,\r
        roll: 0,\r
        yaw: 0\r
    };\r
\r
    self.pageElements = {};\r
    self.isSavePreset = true;\r
    self.elementToShow = 0;\r
    //========================\r
    // Load chain\r
    // =======================\r
    var loadChainer = new MSPChainerClass();\r
\r
    var loadChain = [\r
        mspHelper.loadMixerConfig,\r
        mspHelper.loadBoardAlignment,\r
        function (callback) {\r
            self.boardAlignmentConfig.pitch = Math.round(FC.BOARD_ALIGNMENT.pitch / 10);\r
            self.boardAlignmentConfig.roll = Math.round(FC.BOARD_ALIGNMENT.roll / 10);\r
            self.boardAlignmentConfig.yaw = Math.round(FC.BOARD_ALIGNMENT.yaw / 10);\r
            callback();\r
        },\r
        mspHelper.loadSensorAlignment,\r
        // Pitch and roll must be inverted\r
        function (callback) {\r
            mspHelper.getSetting("align_mag_roll").then(function (data) {\r
                if (data == null) {\r
                    console.log("while settting align_mag_roll, data is null or undefined");\r
                    return;\r
                }\r
                self.alignmentConfig.roll = parseInt(data.value, 10) / 10;\r
            }).then(callback)\r
        },\r
        function (callback) {\r
            mspHelper.getSetting("align_mag_pitch").then(function (data) {\r
                if (data == null) {\r
                    console.log("while settting align_mag_pitch, data is null or undefined");\r
                    return;\r
                }\r
                self.alignmentConfig.pitch = parseInt(data.value, 10) / 10;\r
            }).then(callback)\r
        },\r
        function (callback) {\r
            mspHelper.getSetting("align_mag_yaw").then(function (data) {\r
                if (data == null) {\r
                    console.log("while settting align_mag_yaw, data is null or undefined");\r
                    return;\r
                }\r
                self.alignmentConfig.yaw = parseInt(data.value, 10) / 10;\r
            }).then(callback)\r
        }\r
    ];\r
\r
    loadChainer.setChain(loadChain);\r
    loadChainer.setExitPoint(load_html);\r
    loadChainer.execute();\r
\r
    function areAnglesZero() {\r
        return self.alignmentConfig.pitch === 0 && self.alignmentConfig.roll === 0 && self.alignmentConfig.yaw === 0\r
    }\r
\r
    function isBoardAlignmentZero() {\r
        return (self.boardAlignmentConfig.pitch == 0 ) && (self.boardAlignmentConfig.roll == 0 ) && (self.boardAlignmentConfig.yaw == 0);\r
    }\r
\r
    //========================\r
    // Save chain\r
    // =======================\r
    var saveChainer = new MSPChainerClass();\r
\r
    var saveChain = [\r
        function (callback) {\r
            FC.BOARD_ALIGNMENT.pitch = self.boardAlignmentConfig.pitch * 10;\r
            FC.BOARD_ALIGNMENT.roll = self.boardAlignmentConfig.roll * 10;\r
            FC.BOARD_ALIGNMENT.yaw = self.boardAlignmentConfig.yaw * 10;\r
            callback();\r
        },\r
        mspHelper.saveBoardAlignment,\r
        // Magnetometer alignment\r
        function (callback) {\r
            let orientation_mag_e = $('select.magalign');\r
            FC.SENSOR_ALIGNMENT.align_mag = parseInt(orientation_mag_e.val());\r
            callback();\r
        },\r
        mspHelper.saveSensorAlignment,\r
        // Pitch/Roll/Yaw\r
        // Pitch and roll must be inverted - ???\r
        function (callback) {\r
            if (self.isSavePreset)\r
                mspHelper.setSetting("align_mag_roll", 0, callback);\r
            else\r
                mspHelper.setSetting("align_mag_roll", self.alignmentConfig.roll * 10, callback);\r
        },\r
        function (callback) {\r
            if (self.isSavePreset)\r
                mspHelper.setSetting("align_mag_pitch", 0, callback);\r
            else\r
                mspHelper.setSetting("align_mag_pitch", self.alignmentConfig.pitch * 10, callback);\r
\r
        },\r
        function (callback) {\r
            if (self.isSavePreset)\r
                mspHelper.setSetting("align_mag_yaw", 0, callback);\r
            else {\r
                var fix = 0;\r
                if ( areAnglesZero() )  {\r
                    fix = 1;  //if all angles are 0, then we have to save yaw = 1 (0.1 deg) to enforce usage of angles, not a usage of preset\r
                }\r
                mspHelper.setSetting("align_mag_yaw", self.alignmentConfig.yaw * 10 + fix, callback);\r
            }\r
        },\r
        mspHelper.saveToEeprom\r
    ];\r
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
        GUI.log(i18n.getMessage('deviceRebooting'));\r
        GUI.handleReconnect($('.tab_magnetometer a'));\r
    }\r
\r
    function load_html() {\r
        import('./magnetometer.html?raw').then(({default: html}) => GUI.load(html, process_html));\r
    }\r
\r
    function generateRange(min, max, step) {\r
        const arr = [];\r
        for (var i = min; i <= max; i += step) {\r
            arr.push(i)\r
        }\r
        return arr;\r
    }\r
\r
    function toUpperRange(input, max) {\r
        if (!Number.isFinite(input)) return 0;\r
        while (input > max) input -= 360;\r
        while (input + 360 <= max) input += 360;\r
        return input;\r
    }\r
\r
    /*\r
    Returns pitch, roll and yaw in degree by the id of a preset.\r
    Degree are the ones used in the slider\r
     */\r
    function getAxisDegreeWithPreset(selectedPreset) {\r
        //pitch, roll, yaw\r
        switch (selectedPreset) {\r
            case 1: //CW0_DEG = 1\r
                return [0, 0, 0];\r
            case 2: //CW90_DEG = 2\r
                return [0, 0, 90];\r
            case 3: //CW180_DEG = 3\r
                return [0, 0, 180];\r
            case 4: //CW270_DEG = 4\r
                return [0, 0, 270];\r
            case 5: //CW0_DEG_FLIP = 5\r
                return [180, 0, 0];\r
            case 6: //CW90_DEG_FLIP = 5\r
                return [180, 0, 90];\r
            case 7: //CW180_DEG_FLIP = 5\r
                return [180, 0, 180];\r
            case 0: //ALIGN_DEFAULT = 0\r
            case 8: //CW270_DEG_FLIP = 5\r
            default://If not recognized, returns default\r
                return [180, 0, 270];\r
        }\r
    }\r
\r
    function getAxisDegreeWithPresetAndBoardOrientation(selectedPreset) {\r
        var degree = getAxisDegreeWithPreset(selectedPreset);\r
\r
        if (isBoardAlignmentZero()) {\r
           return degree;\r
        } \r
\r
        //degree[0] - pitch\r
        //degree[1] - roll\r
        //degree[2] - yaw\r
        //-(pitch-180), -180 - yaw, roll\r
        var magRotation = new THREE.Euler(-THREE.MathUtils.degToRad(degree[0]-180), THREE.MathUtils.degToRad(-180 - degree[2]), THREE.MathUtils.degToRad(degree[1]), 'YXZ'); \r
        var matrix = (new THREE.Matrix4()).makeRotationFromEuler(magRotation);\r
\r
        var boardRotation = new THREE.Euler( THREE.MathUtils.degToRad( self.boardAlignmentConfig.pitch ), THREE.MathUtils.degToRad( -self.boardAlignmentConfig.yaw ), THREE.MathUtils.degToRad( self.boardAlignmentConfig.roll ), 'YXZ');\r
        var matrix1 = (new THREE.Matrix4()).makeRotationFromEuler(boardRotation);\r
\r
        matrix.premultiply(matrix1);  \r
\r
        var euler = new THREE.Euler();\r
        euler.setFromRotationMatrix(matrix, 'YXZ');\r
\r
        var pitch = toUpperRange( Math.round( THREE.MathUtils.radToDeg(-euler.x)) + 180, 180 );\r
        var yaw = toUpperRange( Math.round( -180 - THREE.MathUtils.radToDeg(euler.y)), 359 );\r
        var roll = toUpperRange( Math.round( THREE.MathUtils.radToDeg(euler.z)), 180 );\r
\r
        return [pitch, roll, yaw];\r
    }\r
\r
    function updateMagOrientationWithPreset() {\r
        if (self.isSavePreset) {\r
            const degrees = getAxisDegreeWithPresetAndBoardOrientation(FC.SENSOR_ALIGNMENT.align_mag);\r
            presetUpdated(degrees);\r
        }\r
    }\r
\r
    function updateFCCliString() {\r
        var s = " align_board_roll=" + (self.boardAlignmentConfig.roll * 10) +  \r
                " align_board_pitch=" + (self.boardAlignmentConfig.pitch * 10) + \r
                " align_board_yaw=" + (self.boardAlignmentConfig.yaw * 10);\r
        self.pageElements.cli_settings_fc.text(s);\r
    }\r
\r
    function updateBoardRollAxis(value) {\r
        if (value == null) {\r
            console.log("in updateBoardRollAxis, value is null or undefined");\r
            return;\r
        }\r
\r
        self.boardAlignmentConfig.roll = Number(value);\r
        self.pageElements.board_roll_slider.val(self.boardAlignmentConfig.roll);\r
        self.pageElements.orientation_board_roll.val(self.boardAlignmentConfig.roll);\r
        updateMagOrientationWithPreset();\r
        updateFCCliString();\r
        self.render3D();\r
    }\r
\r
    function updateBoardPitchAxis(value) {\r
        self.boardAlignmentConfig.pitch = Number(value);\r
        self.pageElements.board_pitch_slider.val(self.boardAlignmentConfig.pitch);\r
        self.pageElements.orientation_board_pitch.val(self.boardAlignmentConfig.pitch);\r
        updateMagOrientationWithPreset();\r
        updateFCCliString();\r
        self.render3D();\r
    }\r
\r
    function updateBoardYawAxis(value) {\r
        self.boardAlignmentConfig.yaw = Number(value);\r
        self.pageElements.board_yaw_slider.val(self.boardAlignmentConfig.yaw);\r
        self.pageElements.orientation_board_yaw.val(self.boardAlignmentConfig.yaw);\r
        updateMagOrientationWithPreset();\r
        updateFCCliString();\r
        self.render3D();\r
    }\r
    \r
    function updateMagCliString() {\r
        var fix = 0;\r
        if ( areAnglesZero() )  {\r
            fix = 1;  //if all angles are 0, then we have to save yaw = 1 (0.1 deg) to enforce usage of angles, not a usage of preset\r
        }\r
		var names = ['DEFAULT', 'CW0', 'CW90', 'CW180', 'CW270', 'CW0FLIP', 'CW90FLIP', 'CW180FLIP', 'CW270FLIP'];\r
        var s = "align_mag=" + names[FC.SENSOR_ALIGNMENT.align_mag] +  \r
                " align_mag_roll=" + (self.isSavePreset ? 0 : self.alignmentConfig.roll * 10) +  \r
                " align_mag_pitch=" + (self.isSavePreset ? 0 : self.alignmentConfig.pitch * 10) + \r
                " align_mag_yaw=" + (self.isSavePreset ? 0 : self.alignmentConfig.yaw * 10 + fix);\r
        self.pageElements.cli_settings_mag.text(s);\r
        self.pageElements.comment_sensor_mag_preset.css("display", !self.isSavePreset ? "none" : "");\r
        self.pageElements.comment_sensor_mag_angles.css("display", self.isSavePreset ? "none" : "");\r
    }\r
\r
    //Called when roll values change\r
    function updateRollAxis(value) {\r
        self.alignmentConfig.roll = Number(value);\r
        self.pageElements.roll_slider.val(self.alignmentConfig.roll);\r
        self.pageElements.orientation_mag_roll.val(self.alignmentConfig.roll);\r
        updateMagCliString();\r
        self.render3D();\r
    }\r
\r
    //Called when pitch values change\r
    function updatePitchAxis(value) {\r
        self.alignmentConfig.pitch = Number(value);\r
        self.pageElements.pitch_slider.val(self.alignmentConfig.pitch);\r
        self.pageElements.orientation_mag_pitch.val(self.alignmentConfig.pitch);\r
        updateMagCliString();\r
        self.render3D();\r
    }\r
\r
    //Called when yaw values change\r
    function updateYawAxis(value) {\r
        self.alignmentConfig.yaw = Number(value);\r
        self.pageElements.yaw_slider.val(self.alignmentConfig.yaw);\r
        self.pageElements.orientation_mag_yaw.val(self.alignmentConfig.yaw);\r
        updateMagCliString();\r
        self.render3D();\r
    }\r
\r
    function enableSavePreset() {\r
        self.isSavePreset = true;\r
        self.pageElements.orientation_mag_e.css("opacity", 1);\r
        self.pageElements.orientation_mag_e.css("text-decoration", "");\r
        self.pageElements.align_mag_xxx_e.css("opacity", "0.65");\r
        self.pageElements.align_mag_xxx_e.css("text-decoration", "line-through");\r
    }\r
\r
    function disableSavePreset() {\r
        self.isSavePreset = false;\r
        self.pageElements.orientation_mag_e.css("opacity", 0.5);\r
        self.pageElements.orientation_mag_e.css("text-decoration", "line-through");\r
        self.pageElements.align_mag_xxx_e.css("opacity", "1");\r
        self.pageElements.align_mag_xxx_e.css("text-decoration", "");\r
    }\r
\r
\r
    //Called when a preset is selected\r
    function presetUpdated(degrees) {\r
        enableSavePreset();\r
        updatePitchAxis(degrees[0]);\r
        updateRollAxis(degrees[1]);\r
        updateYawAxis(degrees[2]);\r
        updateMagCliString();\r
    }\r
\r
\r
    function process_html() {\r
\r
       i18n.localize();;\r
\r
        // initialize 3D\r
        self.initialize3D();\r
\r
        let alignments = FC.getSensorAlignments();\r
\r
        self.pageElements.orientation_board_roll = $('#boardAlignRoll');\r
        self.pageElements.orientation_board_pitch = $('#boardAlignPitch');\r
        self.pageElements.orientation_board_yaw = $('#boardAlignYaw');\r
        self.pageElements.board_roll_slider = $('#board_roll_slider');\r
        self.pageElements.board_pitch_slider = $('#board_pitch_slider');\r
        self.pageElements.board_yaw_slider = $('#board_yaw_slider');\r
\r
        self.pageElements.orientation_mag_e = $('select.magalign');\r
        self.pageElements.orientation_mag_roll = $('#alignRoll');\r
        self.pageElements.orientation_mag_pitch = $('#alignPitch');\r
        self.pageElements.orientation_mag_yaw = $('#alignYaw');\r
        self.pageElements.roll_slider = $('#roll_slider');\r
        self.pageElements.pitch_slider = $('#pitch_slider');\r
        self.pageElements.yaw_slider = $('#yaw_slider');\r
\r
        self.pageElements.align_mag_xxx_e = $('#align_mag_xxx');\r
\r
        self.pageElements.cli_settings_fc = $('#cli_settings_fc');\r
        self.pageElements.cli_settings_mag = $('#cli_settings_mag');\r
\r
        self.pageElements.comment_sensor_mag_preset = $('#comment_sensor_mag_preset');\r
        self.pageElements.comment_sensor_mag_angles = $('#comment_sensor_mag_angles');\r
\r
        self.roll_e = $('dd.roll'),\r
        self.pitch_e = $('dd.pitch'),\r
        self.heading_e = $('dd.heading');\r
\r
        for (let i = 0; i < alignments.length; i++) {\r
            self.pageElements.orientation_mag_e.append('<option value="' + (i + 1) + '">' + alignments[i] + '</option>');\r
        }\r
        self.pageElements.orientation_mag_e.val(FC.SENSOR_ALIGNMENT.align_mag);\r
\r
        if (areAnglesZero()) {\r
            //If using a preset, checking if custom values are equal to 0\r
            //Update the slider, but don't save the value until they will be not modified.\r
            const degrees = getAxisDegreeWithPresetAndBoardOrientation(FC.SENSOR_ALIGNMENT.align_mag);\r
            presetUpdated(degrees);\r
        }\r
        else {\r
            updateRollAxis(self.alignmentConfig.roll);\r
            updatePitchAxis(self.alignmentConfig.pitch);\r
            updateYawAxis(self.alignmentConfig.yaw);\r
            disableSavePreset();\r
        }\r
\r
\r
        self.pageElements.orientation_board_roll.on('change', function () {\r
            updateBoardRollAxis(clamp(this, -180, 360));\r
        });\r
\r
        self.pageElements.orientation_board_pitch.on('change', function () {\r
            updateBoardPitchAxis(clamp(this, -180, 360));\r
        });\r
\r
        self.pageElements.orientation_board_yaw.on('change', function () {\r
            updateBoardYawAxis(clamp(this, -180, 360));\r
        });\r
\r
        noUiSlider.create(self.pageElements.board_roll_slider[0], {\r
            start: [self.boardAlignmentConfig.roll],\r
            range: {\r
                'min': [-180],\r
                'max': [360]\r
            },\r
            step: 1,\r
            pips: {\r
                mode: 'values',\r
                values: generateRange(-180, 360, 45),\r
                density: 4,\r
                stepped: true\r
            }\r
        });\r
\r
        noUiSlider.create(self.pageElements.board_pitch_slider[0], {\r
            start: [self.boardAlignmentConfig.pitch],\r
            range: {\r
                'min': [-180],\r
                'max': [360]\r
            },\r
            step: 1,\r
            pips: {\r
                mode: 'values',\r
                values: generateRange(-180, 360, 45),\r
                density: 4,\r
                stepped: true\r
            }\r
        });\r
\r
        noUiSlider.create(self.pageElements.board_yaw_slider[0], {\r
            start: [self.boardAlignmentConfig.yaw],\r
            range: {\r
                'min': [-180],\r
                'max': [360]\r
            },\r
            step: 1,\r
            pips: {\r
                 mode: 'values',\r
                values: generateRange(-180, 360, 45),\r
                density: 4,\r
                stepped: true\r
            }\r
        });\r
\r
        \r
        self.pageElements.board_pitch_slider[0].noUiSlider.on('update', (values, handle) =>  {\r
            updateBoardPitchAxis(values[handle]);\r
        });\r
        self.pageElements.board_roll_slider[0].noUiSlider.on('update', (values, handle) =>  {\r
            updateBoardRollAxis(values[handle]);\r
        });\r
        self.pageElements.board_yaw_slider[0].noUiSlider.on('update', (values, handle) =>  {\r
            updateBoardYawAxis(values[handle]);\r
        });\r
        \r
\r
        const elementToShow = $("#element_to_show");\r
        elementToShow.on('change', function () {\r
            const value = parseInt($(this).val());\r
            self.elementToShow = value;\r
            self.render3D();\r
        });\r
\r
        function clamp(input, min, max) {\r
            return Math.min(Math.max(parseInt($(input).val()), min), max);\r
        }\r
\r
        self.pageElements.orientation_mag_e.on('change', function () {\r
            FC.SENSOR_ALIGNMENT.align_mag = parseInt($(this).val());\r
            const degrees = getAxisDegreeWithPresetAndBoardOrientation(FC.SENSOR_ALIGNMENT.align_mag);\r
            presetUpdated(degrees);\r
        });\r
\r
        self.pageElements.orientation_mag_e.on('mousedown', function () {\r
            const degrees = getAxisDegreeWithPresetAndBoardOrientation(FC.SENSOR_ALIGNMENT.align_mag);\r
            presetUpdated(degrees);\r
        });\r
\r
        self.pageElements.orientation_mag_roll.on('change', function () {\r
            disableSavePreset();\r
            updateRollAxis(clamp(this, -180, 360));\r
        });\r
\r
        self.pageElements.orientation_mag_pitch.on('change', function () {\r
            disableSavePreset();\r
            updatePitchAxis(clamp(this, -180, 360));\r
        });\r
\r
        self.pageElements.orientation_mag_yaw.on('change', function () {\r
            disableSavePreset();\r
            updateYawAxis(clamp(this, -180, 360));\r
        });\r
\r
        $('a.save').on('click', function () {\r
            saveChainer.execute()\r
        });\r
\r
        noUiSlider.create(self.pageElements.roll_slider[0], {\r
            start: [self.alignmentConfig.roll],\r
            range: {\r
                'min': [-180],\r
                'max': [360]\r
            },\r
            step: 1,\r
            pips: {\r
                mode: 'values',\r
                values: generateRange(-180, 360, 45),\r
                density: 4,\r
                stepped: true\r
                }\r
        });\r
\r
        noUiSlider.create(self.pageElements.pitch_slider[0], {\r
            start: [self.alignmentConfig.pitch],\r
            range: {\r
                'min': [-180],\r
                'max': [360]\r
            },\r
            step: 1,\r
            pips: {\r
                mode: 'values',\r
                values: generateRange(-180, 360, 45),\r
                density: 4,\r
                stepped: true\r
            }\r
        });\r
\r
        noUiSlider.create(self.pageElements.yaw_slider[0], {\r
            start: [self.alignmentConfig.yaw],\r
            range: {\r
                'min': [-180],\r
                'max': [360]\r
            },\r
            step: 1,\r
            pips: {\r
                mode: 'values',\r
                values: generateRange(-180, 360, 45),\r
                density: 4,\r
                stepped: true\r
            }\r
        });\r
\r
        \r
        self.pageElements.pitch_slider[0].noUiSlider.on('update', (values, handle) =>  {\r
            updatePitchAxis(values[handle]);\r
        });\r
        self.pageElements.roll_slider[0].noUiSlider.on('update', (values, handle) =>  {\r
            updateRollAxis(values[handle]);\r
        });\r
        self.pageElements.yaw_slider[0].noUiSlider.on('update', (values, handle) =>  {\r
            updateYawAxis(values[handle]);\r
        });\r
\r
        self.pageElements.pitch_slider[0].noUiSlider.on('slide', () => {\r
            disableSavePreset();\r
        });\r
        self.pageElements.roll_slider[0].noUiSlider.on('slide', () => {\r
            disableSavePreset();\r
        });\r
        self.pageElements.yaw_slider[0].noUiSlider.on('slide', () => {\r
            disableSavePreset();\r
        });\r
        \r
\r
        function get_fast_data() {\r
\r
            MSP.send_message(MSPCodes.MSP_ATTITUDE, false, false, function () {\r
	            self.roll_e.text(i18n.getMessage('initialSetupAttitude', [FC.SENSOR_DATA.kinematics[0]]));\r
	            self.pitch_e.text(i18n.getMessage('initialSetupAttitude', [FC.SENSOR_DATA.kinematics[1]]));\r
                self.heading_e.text(i18n.getMessage('initialSetupAttitude', [FC.SENSOR_DATA.kinematics[2]]));\r
                self.render3D();\r
            });\r
        }\r
\r
        interval.add('setup_data_pull_fast', get_fast_data, 40);\r
\r
        GUI.content_ready(callback);\r
    }\r
\r
};\r
\r
\r
magnetometerTab.initialize3D = function () {\r
\r
    var self = this,\r
        canvas,\r
        renderer,\r
        wrapper,\r
        modelWrapper,\r
        model_file,\r
        camera,\r
        scene,\r
        magModels,\r
        fc,\r
        useWebGlRenderer = false;\r
\r
    canvas = $('.model-and-info #canvas');\r
    wrapper = $('.model-and-info #canvas_wrapper');\r
\r
    // webgl capability detector\r
    // it would seem the webgl "enabling" through advanced settings will be ignored in the future\r
    // and webgl will be supported if gpu supports it by default (canary 40.0.2175.0), keep an eye on this one\r
    var detector_canvas = document.createElement('canvas');\r
    if (window.WebGLRenderingContext && (detector_canvas.getContext('webgl') || detector_canvas.getContext('experimental-webgl'))) {\r
        renderer = new THREE.WebGLRenderer({canvas: canvas.get(0), alpha: true, antialias: true});\r
        useWebGlRenderer = true;\r
    }\r
    \r
    // initialize render size for current canvas size\r
    renderer.setSize(wrapper.width() * 2, wrapper.height() * 2);\r
\r
\r
    // modelWrapper adds an extra axis of rotation to avoid gimbal lock with the euler angles\r
    modelWrapper = new THREE.Object3D();\r
\r
    // load the model including materials\r
    if (useWebGlRenderer) {\r
        if (FC.MIXER_CONFIG.appliedMixerPreset === -1) {\r
            model_file = 'custom';\r
            GUI_control.prototype.log("<span style='color: red; font-weight: bolder'><strong>" + i18n.getMessage("mixerNotConfigured") + "</strong></span>");\r
        }\r
        else {\r
            model_file = mixer.getById(FC.MIXER_CONFIG.appliedMixerPreset).model;\r
        }\r
    }\r
    else {\r
        model_file = 'fallback'\r
    }\r
\r
    // Temporary workaround for 'custom' model until akfreak's custom model is merged.\r
    if (model_file == 'custom') {\r
        model_file = 'fallback';\r
    }\r
\r
    this.render3D = function () {\r
\r
        if (!magModels || !fc)\r
            return;\r
\r
        magModels.forEach( (m,i) => m.visible = i == self.elementToShow );\r
        fc.visible = true;\r
\r
        var magRotation = new THREE.Euler(-THREE.MathUtils.degToRad(self.alignmentConfig.pitch-180), THREE.MathUtils.degToRad(-180 - self.alignmentConfig.yaw), THREE.MathUtils.degToRad(self.alignmentConfig.roll), 'YXZ'); \r
        var matrix = (new THREE.Matrix4()).makeRotationFromEuler(magRotation);\r
\r
        var boardRotation = new THREE.Euler( THREE.MathUtils.degToRad( self.boardAlignmentConfig.pitch), THREE.MathUtils.degToRad( -self.boardAlignmentConfig.yaw ), THREE.MathUtils.degToRad( self.boardAlignmentConfig.roll ), 'YXZ');\r
        var matrix1 = (new THREE.Matrix4()).makeRotationFromEuler(boardRotation);\r
\r
/*\r
        if ( self.isSavePreset ) {\r
          matrix.premultiply(matrix1);  //preset specifies orientation relative to FC, align_max_xxx specify absolute orientation \r
        }\r
*/\r
        magModels.forEach( (m,i) => m.rotation.setFromRotationMatrix(matrix) );\r
        fc.rotation.setFromRotationMatrix(matrix1);\r
\r
        // draw\r
        if (camera != null)\r
            renderer.render(scene, camera);\r
    };\r
\r
    // handle canvas resize\r
    this.resize3D = function () {\r
        renderer.setSize(wrapper.width() * 2, wrapper.height() * 2);\r
        camera.aspect = wrapper.width() / wrapper.height();\r
        camera.updateProjectionMatrix();\r
\r
        self.render3D();\r
    };\r
\r
    $(window).on('resize', this.resize3D);\r
\r
    let getDistanceByModelName = function (name) {\r
        switch (name) {\r
            case "quad_x":\r
                return [0, 0, 3];\r
            case "quad_vtail":\r
                return [0, 0, 4.5];\r
            case "quad_atail":\r
                return [0, 0, 5];\r
            case "y4":\r
            case "y6":\r
            case "tricopter":\r
                return [0, 1.4, 0];\r
            case "hex_x":\r
            case "hex_plus":\r
                return [0, 2, 0];\r
            case "flying_wing":\r
            case "rudderless_plane":\r
            case "twin_plane":\r
            case "vtail_plane":\r
            case "vtail_single_servo_plane":\r
                return [0, 1.6, 0];\r
            case "fallback":\r
            default:\r
                return [0, 2.5, 0];\r
\r
        }\r
    };\r
\r
    // setup scene\r
    scene = new THREE.Scene();\r
\r
    // stationary camera\r
    camera = new THREE.PerspectiveCamera(50, wrapper.width() / wrapper.height(), 1, 10000);\r
    camera.position.set(-95, 82, 50);\r
    let controls = new OrbitControls(camera, renderer.domElement);\r
    controls.update();\r
    controls.addEventListener( 'change', this.render3D );\r
\r
    // some light\r
    const light = new THREE.AmbientLight(0x808080);\r
    const light2 = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 1);\r
    const light3 = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 1);\r
    light2.position.set(0, 1, 0);\r
    light3.position.set(0, -1, 0);\r
\r
    // add camera, model, light to the foreground scene\r
    scene.add(light);\r
    scene.add(light2);\r
    scene.add(light3);\r
    scene.add(camera);\r
    scene.add(modelWrapper);\r
\r
    //Load the models\r
    const manager = new THREE.LoadingManager();\r
    const loader = new GLTFLoader(manager);\r
\r
    const magModelNames = ['xyz', 'ak8963c', 'ak8963n', 'ak8975', 'ak8975c', 'bn_880', 'diatone_mamba_m10_pro', 'flywoo_goku_m10_pro_v3', 'foxeer_m10q_120', 'foxeer_m10q_180', 'foxeer_m10q_250', \r
        'geprc_gep_m10_dq', 'gy271', 'gy273', 'hglrc_m100', 'qmc5883', 'holybro_m9n_micro', 'holybro_m9n_micro', 'ist8308', 'ist8310', 'lis3mdl', \r
        'mag3110', 'matek_m8q', 'matek_m9n', 'matek_m10q', 'mlx90393', 'mp9250', 'qmc5883', 'flywoo_goku_m10_pro_v3', 'ws_m181'];\r
    magModels = [];\r
    //Load the UAV model\r
    import(\`./../resources/models/model_\${model_file}.gltf\`).then(({default: model}) => {\r
    loader.load(model, (obj) => {\r
            const modelScene = obj.scene;\r
            const scaleFactor = 15;\r
            modelScene.scale.set(scaleFactor, scaleFactor, scaleFactor);\r
            modelWrapper.add(modelScene);\r
\r
            const gpsOffset = getDistanceByModelName(model_file);\r
\r
            magModelNames.forEach( (name, i) => \r
            {\r
                import(\`./../resources/models/model_\${name}.glb\`).then(({default: magModel}) => {\r
                    loader.load(magModel, (obj) => {\r
                        const gps = obj.scene;\r
                        const scaleFactor = i==0 ? 0.03 : 0.04;\r
                        gps.scale.set(scaleFactor, scaleFactor, scaleFactor);\r
                        gps.position.set(gpsOffset[0], gpsOffset[1] + 0.5, gpsOffset[2]);\r
                        gps.traverse(child => {\r
                        if (child.material) child.material.metalness = 0;\r
                        });\r
                        gps.rotation.y = 3 * Math.PI / 2;\r
                        modelScene.add(gps);\r
                        magModels[i]=gps;\r
                        this.resize3D();\r
                    });\r
                });\r
            });\r
\r
            //Load the FC model\r
            import('./../resources/models/model_fc.gltf').then(({default: fcModel}) => {\r
                loader.load(fcModel, (obj) => {\r
                    fc = obj.scene;\r
                    const scaleFactor = 0.04;\r
                    fc.scale.set(scaleFactor, scaleFactor, scaleFactor);\r
                    fc.position.set(gpsOffset[0], gpsOffset[1] - 0.5, gpsOffset[2]);\r
                    fc.rotation.y = 3 * Math.PI / 2;\r
                    modelScene.add(fc);\r
                    this.render3D();\r
                });\r
            });\r
\r
        });\r
        this.render3D();\r
        this.resize3D();\r
    });\r
};\r
\r
\r
magnetometerTab.cleanup = function (callback) {\r
    $(window).off('resize', this.resize3D);\r
\r
    if (callback) callback();\r
};\r
\r
export default magnetometerTab;`;export{e as default};
