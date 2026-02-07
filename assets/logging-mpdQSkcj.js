const r=`'use strict';\r
\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import CONFIGURATOR from './../js/data_storage';\r
import interval from './../js/intervals';\r
import i18n from './../js/localization';\r
import { zeroPad } from './../js/helpers';\r
import dialog from '../js/dialog';\r
import {bridge, Platform} from '../js/bridge'\r
\r
\r
const loggingTab = {};\r
loggingTab.initialize = function (callback) {\r
    var self = this;\r
\r
    let loggingFileName = null;\r
    let readyToWrite = false;\r
\r
    \r
    const maxWebLogFileSize = 1024 * 1024; // 1 MB\r
    let webFileBuffer = [];\r
    let webFileCount = 1;\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    var requested_properties = [],\r
        samples = 0,\r
        requests = 0,\r
        totalSize = 0,\r
        log_buffer = [];\r
\r
    if (CONFIGURATOR.connectionValid) {\r
        var get_motor_data = function () {\r
            MSP.send_message(MSPCodes.MSP_MOTOR, false, false, load_html);\r
        }\r
\r
        var load_html = function () {\r
            import('./logging.html?raw').then(({default: html}) => GUI.load(html, process_html));\r
        }\r
\r
        MSP.send_message(MSPCodes.MSP_RC, false, false, get_motor_data);\r
    }\r
\r
    function process_html() {\r
        // translate to user-selected language\r
        i18n.localize();;\r
\r
        // UI hooks\r
        if (bridge.getPlatform() === Platform.Web) {\r
             $('a.log_file').hide();\r
             prepare_file();\r
        }\r
\r
        $('a.log_file').on('click', prepare_file);\r
\r
        $('a.logging').on('click', function () {\r
            if (GUI.connected_to) {\r
                if (readyToWrite) {\r
                    var clicks = $(this).data('clicks');\r
\r
                    if (!clicks) {\r
                        // reset some variables before start\r
                        samples = 0;\r
                        requests = 0;\r
                        totalSize = 0;\r
                        webFileCount = 1;\r
                        log_buffer = [];\r
                        requested_properties = [];\r
\r
                        $('.properties input:checked').each(function () {\r
                            requested_properties.push($(this).prop('name'));\r
                        });\r
\r
                        if (requested_properties.length) {\r
                            // print header for the csv file\r
                            log_buffer.push(getHeader());\r
\r
                            var log_data_poll = function () {\r
                                if (requests) {\r
                                    // save current data (only after everything is initialized)\r
                                    crunch_data();\r
                                }\r
\r
                                // request new\r
                                for (var i = 0; i < requested_properties.length; i++, requests++) {\r
                                    MSP.send_message(MSPCodes[requested_properties[i]]);\r
                                }\r
                            }\r
\r
                            interval.add('log_data_poll', log_data_poll, parseInt($('select.speed').val()), true); // refresh rate goes here\r
                            interval.add('write_data', function write_data() {\r
                                if (log_buffer.length && readyToWrite) { // only execute when there is actual data to write\r
                                    \r
                                    if (bridge.getPlatform() === Platform.Electron) {\r
                                        window.electronAPI.appendFile(loggingFileName, log_buffer.join('\\n') + '\\n');\r
                                    } else {\r
                                        // On PWA we can't acces local files nor append to a file.\r
                                        // Instead collect logs and download 1 MB chunks\r
                                        webFileBuffer.push(...log_buffer);\r
                                        if (totalSize > maxWebLogFileSize) {\r
                                            bridge.writeFile(\`\${loggingFileName}-\${webFileCount++}\`, webFileBuffer.join('\\n') + '\\n');\r
                                            totalSize = 0;\r
                                            webFileBuffer = [];\r
                                            webFileBuffer.push(getHeader());\r
                                        }\r
                                    }\r
                                    \r
                                    $('.samples').text(samples += log_buffer.length);                \r
                                    \r
                                    $('.size').text(\`\${formatFileSize(totalSize)} \${bridge.getPlatform() === Platform.Web ? \`(Chunk \${webFileCount})\` : ''}\`);\r
                                    log_buffer = [];\r
                                }\r
                            }, 1000);\r
\r
                            $('.speed').prop('disabled', true);\r
                            $(this).text(i18n.getMessage('loggingStop'));\r
                            $(this).data("clicks", !clicks);\r
                        } else {\r
                            GUI.log(i18n.getMessage('loggingErrorOneProperty'));\r
                        }\r
                    } else {\r
                        interval.killAll(['global_data_refresh', 'msp-load-update', 'ltm-connection-check']);\r
\r
                        if (bridge.getPlatform() === Platform.Web) { \r
                            bridge.writeFile(\`\${loggingFileName}-\${webFileCount++}\`, webFileBuffer.join('\\n') + '\\n');\r
                            webFileBuffer = [];\r
                        }\r
\r
                        $('.speed').prop('disabled', false);\r
                        $(this).text(i18n.getMessage('loggingStart'));\r
                        $(this).data("clicks", !clicks);\r
                    }\r
                } else {\r
                    GUI.log(i18n.getMessage('loggingErrorLogFile'));\r
                }\r
            } else {\r
                GUI.log(i18n.getMessage('loggingErrorNotConnected'));\r
            }\r
        });\r
\r
        GUI.content_ready(callback);\r
    }\r
    \r
    function formatFileSize(bytes) {\r
        if (bytes === 0) {\r
            return '0 Bytes';\r
        }\r
\r
        const k = 1024;\r
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];\r
\r
        const i = Math.floor(Math.log(bytes) / Math.log(k));\r
\r
        return \`\${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} \${sizes[i]}\`;    \r
    }\r
\r
    function getHeader() {\r
        var head = "timestamp";\r
\r
        for (var i = 0; i < requested_properties.length; i++) {\r
            switch (requested_properties[i]) {\r
                case 'MSP_RAW_IMU':\r
                    head += ',' + 'gyroscopeX';\r
                    head += ',' + 'gyroscopeY';\r
                    head += ',' + 'gyroscopeZ';\r
\r
                    head += ',' + 'accelerometerX';\r
                    head += ',' + 'accelerometerY';\r
                    head += ',' + 'accelerometerZ';\r
\r
                    head += ',' + 'magnetometerX';\r
                    head += ',' + 'magnetometerY';\r
                    head += ',' + 'magnetometerZ';\r
                    break;\r
                case 'MSP_ATTITUDE':\r
                    head += ',' + 'kinematicsX';\r
                    head += ',' + 'kinematicsY';\r
                    head += ',' + 'kinematicsZ';\r
                    break;\r
                case 'MSP_ALTITUDE':\r
                    head += ',' + 'altitude';\r
                    break;\r
                case 'MSP_RAW_GPS':\r
                    head += ',' + 'gpsFix';\r
                    head += ',' + 'gpsNumSat';\r
                    head += ',' + 'gpsLat';\r
                    head += ',' + 'gpsLon';\r
                    head += ',' + 'gpsAlt';\r
                    head += ',' + 'gpsSpeed';\r
                    head += ',' + 'gpsGroundCourse';\r
                    break;\r
                case 'MSP_ANALOG':\r
                    head += ',' + 'voltage';\r
                    head += ',' + 'amperage';\r
                    head += ',' + 'mAhdrawn';\r
                    head += ',' + 'rssi';\r
                    break;\r
                case 'MSP_RC':\r
                    for (var chan = 0; chan < FC.RC.active_channels; chan++) {\r
                        head += ',' + 'RC' + chan;\r
                    }\r
                    break;\r
                case 'MSP_MOTOR':\r
                    for (var motor = 0; motor < FC.MOTOR_DATA.length; motor++) {\r
                        head += ',' + 'Motor' + motor;\r
                    }\r
                    break;\r
                case 'MSP_DEBUG':\r
                    for (var debug = 0; debug < FC.SENSOR_DATA.debug.length; debug++) {\r
                        head += ',' + 'Debug' + debug;\r
                    }\r
                    break;\r
            }\r
        }\r
        return head;\r
    }\r
\r
    function crunch_data() {\r
        var sample = millitime();\r
\r
        for (var i = 0; i < requested_properties.length; i++) {\r
            switch (requested_properties[i]) {\r
                case 'MSP_RAW_IMU':\r
                    sample += ',' + FC.SENSOR_DATA.gyroscope;\r
                    sample += ',' + FC.SENSOR_DATA.accelerometer;\r
                    sample += ',' + FC.SENSOR_DATA.magnetometer;\r
                    break;\r
                case 'MSP_ATTITUDE':\r
                    sample += ',' + FC.SENSOR_DATA.kinematics[0];\r
                    sample += ',' + FC.SENSOR_DATA.kinematics[1];\r
                    sample += ',' + FC.SENSOR_DATA.kinematics[2];\r
                    break;\r
                case 'MSP_ALTITUDE':\r
                    sample += ',' + FC.SENSOR_DATA.altitude;\r
                    break;\r
                case 'MSP_RAW_GPS':\r
                    sample += ',' + FC.GPS_DATA.fix;\r
                    sample += ',' + FC.GPS_DATA.numSat;\r
                    sample += ',' + (FC.GPS_DATA.lat / 10000000);\r
                    sample += ',' + (FC.GPS_DATA.lon / 10000000);\r
                    sample += ',' + FC.GPS_DATA.alt;\r
                    sample += ',' + FC.GPS_DATA.speed;\r
                    sample += ',' + FC.GPS_DATA.ground_course;\r
                    break;\r
                case 'MSP_ANALOG':\r
                    sample += ',' + FC.ANALOG.voltage;\r
                    sample += ',' + FC.ANALOG.amperage;\r
                    sample += ',' + FC.ANALOG.mAhdrawn;\r
                    sample += ',' + FC.ANALOG.rssi;\r
                    break;\r
                case 'MSP_RC':\r
                    for (var chan = 0; chan < FC.RC.active_channels; chan++) {\r
                        sample += ',' + FC.RC.channels[chan];\r
                    }\r
                    break;\r
                case 'MSP_MOTOR':\r
                    sample += ',' + FC.MOTOR_DATA;\r
                    break;\r
                case 'MSP_DEBUG':\r
                    sample += ',' + FC.SENSOR_DATA.debug;\r
                    break;\r
            }\r
        }\r
        totalSize += sample.length + 1;\r
        log_buffer.push(sample);\r
    }\r
\r
    function prepare_file() {\r
        // create or load the file\r
\r
        const date = new Date();\r
        const filename = 'inav_data_log_' + date.getFullYear() + '-'  + zeroPad(date.getMonth() + 1, 2) + '-'\r
                + zeroPad(date.getDate(), 2) + '_' + zeroPad(date.getHours(), 2) + zeroPad(date.getMinutes(), 2)\r
                + zeroPad(date.getSeconds(), 2);\r
\r
        var options = {\r
            defaultPath: filename,\r
            filters: [ { name: "TXT file", extensions: ['txt'] } ]\r
        };\r
        dialog.showSaveDialog(options).then(result => {\r
            if (result.canceled) {\r
                return;\r
            }\r
            \r
            loggingFileName = result.filePath;\r
            readyToWrite = true;\r
            bridge.storeSet('logging_file_name', loggingFileName);\r
            bridge.storeSet('logging_file_ready', readyToWrite);\r
                          \r
        });\r
    }\r
\r
    function millitime() {\r
        return new Date().getTime();\r
    }\r
};\r
\r
loggingTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default loggingTab;`;export{r as default};
