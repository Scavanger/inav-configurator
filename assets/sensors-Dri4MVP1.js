const e=`'use strict';\r
\r
import * as d3 from 'd3'\r
\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import CONFIGURATOR from './../js/data_storage';\r
import interval from './../js/intervals';\r
import i18n from './../js/localization';\r
import BitHelper from './../js/bitHelper';\r
import bridge from './../js/bridge';\r
\r
const sensorsTab = {};\r
sensorsTab.initialize = function (callback) {\r
    var self = this;\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    function initSensorData(){\r
        for (var i = 0; i < 3; i++) {\r
            FC.SENSOR_DATA.accelerometer[i] = 0;\r
            FC.SENSOR_DATA.gyroscope[i] = 0;\r
            FC.SENSOR_DATA.magnetometer[i] = 0;\r
            FC.SENSOR_DATA.sonar = 0;\r
            FC.SENSOR_DATA.air_speed = 0;\r
            FC.SENSOR_DATA.altitude = 0;\r
            FC.SENSOR_DATA.temperature[i] = 0;\r
            FC.SENSOR_DATA.debug[i] = 0;\r
        }\r
    }\r
\r
    function initDataArray(length) {\r
        var data = new Array(length);\r
        for (var i = 0; i < length; i++) {\r
            data[i] = new Array();\r
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
        while (data[0].length > 300) {\r
            for (let i = 0; i < data.length; i++) {\r
                data[i].shift();\r
            }\r
        }\r
        return sampleNumber + 1;\r
    }\r
\r
    var margin = {top: 20, right: 10, bottom: 10, left: 40};\r
    function updateGraphHelperSize(helpers) {\r
        helpers.width = helpers.targetElement.width() - margin.left - margin.right;\r
        helpers.height = helpers.targetElement.height() - margin.top - margin.bottom;\r
\r
        helpers.widthScale.range([0, helpers.width]);\r
        helpers.heightScale.range([helpers.height, 0]);\r
\r
        helpers.xGrid.tickSize(-helpers.height, 0, 0);\r
        helpers.yGrid.tickSize(-helpers.width, 0, 0);\r
    }\r
\r
    function initGraphHelpers(selector, sampleNumber, heightDomain) {\r
        var helpers = {selector: selector, targetElement: $(selector), dynamicHeightDomain: !heightDomain};\r
\r
        helpers.widthScale = d3.scaleLinear()\r
            .clamp(true)\r
            .domain([(sampleNumber - 299), sampleNumber]);\r
\r
        helpers.heightScale = d3.scaleLinear()\r
            .clamp(true)\r
            .domain(heightDomain || [1, -1]);\r
\r
        helpers.xGrid = d3.axisBottom();\r
        helpers.yGrid = d3.axisLeft();\r
\r
        updateGraphHelperSize(helpers);\r
\r
        helpers.xGrid\r
            .scale(helpers.widthScale)\r
            .ticks(5)\r
            .tickFormat("");\r
\r
        helpers.yGrid\r
            .scale(helpers.heightScale)\r
            .ticks(5)\r
            .tickFormat("");\r
\r
        helpers.xAxis = d3.axisBottom()\r
            .scale(helpers.widthScale)\r
            .ticks(5)\r
            .tickFormat(function (d) {return d;});\r
\r
        helpers.yAxis = d3.axisLeft()\r
            .scale(helpers.heightScale)\r
            .ticks(5)\r
            .tickFormat(function (d) {return d;});\r
\r
        helpers.line = d3.line()\r
            .x(function (d) {return helpers.widthScale(d[0]);})\r
            .y(function (d) {return helpers.heightScale(d[1]);});\r
\r
        return helpers;\r
    }\r
\r
    function drawGraph(graphHelpers, data, sampleNumber) {\r
        var svg = d3.select(graphHelpers.selector);\r
\r
        if (graphHelpers.dynamicHeightDomain) {\r
            var limits = [];\r
            $.each(data, function (idx, datum) {\r
                limits.push(datum.min);\r
                limits.push(datum.max);\r
            });\r
            graphHelpers.heightScale.domain(d3.extent(limits));\r
        }\r
        graphHelpers.widthScale.domain([(sampleNumber - 299), sampleNumber]);\r
\r
        svg.select(".x.grid").call(graphHelpers.xGrid);\r
        svg.select(".y.grid").call(graphHelpers.yGrid);\r
        svg.select(".x.axis").call(graphHelpers.xAxis);\r
        svg.select(".y.axis").call(graphHelpers.yAxis);\r
\r
        var group = svg.select("g.data");\r
        var lines = group.selectAll("path").data(data, function (d, i) {return i;});\r
        var newLines = lines.enter().append("path").attr("class", "line");\r
        lines.attr('d', graphHelpers.line);\r
    }\r
\r
    function plot_gyro(enable) {\r
        if (enable) {\r
            $('.wrapper.gyro').show();\r
        } else {\r
            $('.wrapper.gyro').hide();\r
        }\r
    }\r
\r
    function plot_accel(enable) {\r
        if (enable) {\r
            $('.wrapper.accel').show();\r
        } else {\r
            $('.wrapper.accel').hide();\r
        }\r
    }\r
\r
    function plot_mag(enable) {\r
        if (enable) {\r
            $('.wrapper.mag').show();\r
        } else {\r
            $('.wrapper.mag').hide();\r
        }\r
    }\r
\r
    function plot_altitude(enable) {\r
        if (enable) {\r
            $('.wrapper.altitude').show();\r
        } else {\r
            $('.wrapper.altitude').hide();\r
        }\r
    }\r
\r
    function plot_sonar(enable) {\r
        if (enable) {\r
            $('.wrapper.sonar').show();\r
        } else {\r
            $('.wrapper.sonar').hide();\r
        }\r
    }\r
\r
    function plot_airspeed(enable) {\r
        if (enable) {\r
            $('.wrapper.airspeed').show();\r
        } else {\r
            $('.wrapper.airspeed').hide();\r
        }\r
    }\r
\r
    function plot_temperature(enable) {\r
        if (enable) {\r
            $('.wrapper.temperature').show();\r
        } else {\r
            $('.wrapper.temperature').hide();\r
        }\r
    }\r
\r
    function plot_debug(enable) {\r
        if (enable) {\r
            $('.wrapper.debug').show();\r
        } else {\r
            $('.wrapper.debug').hide();\r
        }\r
    }\r
    import('./sensors.html?raw').then(({default: html}) => GUI.load(html, function load_html() {\r
        // translate to user-selected language\r
       i18n.localize();;\r
\r
        // disable graphs for sensors that are missing\r
        var checkboxes = $('.tab-sensors .info .checkboxes input');\r
        if (!BitHelper.bit_check(FC.CONFIG.activeSensors, 2)) { // mag\r
            checkboxes.eq(2).prop('disabled', true);\r
        }\r
        if (!BitHelper.bit_check(FC.CONFIG.activeSensors, 4)) { // sonar\r
            checkboxes.eq(4).prop('disabled', true);\r
        }\r
\r
        if (!BitHelper.bit_check(FC.CONFIG.activeSensors, 6)) { // airspeed\r
            checkboxes.eq(5).prop('disabled', true);\r
        }\r
\r
        if (!BitHelper.bit_check(FC.CONFIG.activeSensors, 7)) {\r
            checkboxes.eq(6).prop('disabled', true);\r
        }\r
\r
        $('.tab-sensors .info .checkboxes input').on('change', function () {\r
            var enable = $(this).prop('checked');\r
            var index = $(this).parent().index();\r
\r
            switch (index) {\r
                case 0:\r
                    plot_gyro(enable);\r
                    break;\r
                case 1:\r
                    plot_accel(enable);\r
                    break;\r
                case 2:\r
                    plot_mag(enable);\r
                    break;\r
                case 3:\r
                    plot_altitude(enable);\r
                    break;\r
                case 4:\r
                    plot_sonar(enable);\r
                    break;\r
                case 5:\r
                    plot_airspeed(enable);\r
                    break;\r
                case 6:\r
                    plot_temperature(enable);\r
                    break;\r
                case 7:\r
                    plot_debug(enable);\r
                    break;\r
            }\r
\r
            var checkboxes = [];\r
            $('.tab-sensors .info .checkboxes input').each(function () {\r
                checkboxes.push($(this).prop('checked'));\r
            });\r
\r
            startPolling();\r
\r
            bridge.storeSet('graphs_enabled', checkboxes);\r
        });\r
\r
        const graphs_enabled = bridge.storeGet('graphs_enabled', false);\r
        if (graphs_enabled) {\r
            var checkboxes = $('.tab-sensors .info .checkboxes input');\r
            for (var i = 0; i < graphs_enabled.length; i++) {\r
                checkboxes.eq(i).not(':disabled').prop('checked', graphs_enabled[i]).trigger('change');\r
            }\r
        } else {\r
            $('.tab-sensors .info input:lt(4):not(:disabled)').prop('checked', true).trigger('change');\r
        }\r
        \r
        \r
\r
        // Always start with default/empty sensor data array, clean slate all\r
        initSensorData();\r
\r
        // Setup variables\r
        var samples_gyro_i = 0,\r
            samples_accel_i = 0,\r
            samples_mag_i = 0,\r
            samples_altitude_i = 0,\r
            samples_sonar_i = 0,\r
            samples_airspeed_i = 0,\r
            samples_temperature_i = 0,\r
            samples_debug_i = 0,\r
            gyro_data = initDataArray(3),\r
            accel_data = initDataArray(3),\r
            mag_data = initDataArray(3),\r
            altitude_data = initDataArray(2),\r
            sonar_data = initDataArray(1),\r
            airspeed_data = initDataArray(1),\r
            temperature_data = [\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1)\r
        ];\r
        var debug_data = [\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1),\r
            initDataArray(1)\r
        ];\r
\r
        var gyroHelpers = initGraphHelpers('#gyro', samples_gyro_i, [-2000, 2000]);\r
        var accelHelpers = initGraphHelpers('#accel', samples_accel_i, [-2, 2]);\r
        var magHelpers = initGraphHelpers('#mag', samples_mag_i, [-1, 1]);\r
        var altitudeHelpers = initGraphHelpers('#altitude', samples_altitude_i);\r
        var sonarHelpers = initGraphHelpers('#sonar', samples_sonar_i);\r
        var airspeedHelpers = initGraphHelpers('#airspeed', samples_airspeed_i);\r
        var temperatureHelpers = [\r
            initGraphHelpers('#temperature1', samples_temperature_i),\r
            initGraphHelpers('#temperature2', samples_temperature_i),\r
            initGraphHelpers('#temperature3', samples_temperature_i),\r
            initGraphHelpers('#temperature4', samples_temperature_i),\r
            initGraphHelpers('#temperature5', samples_temperature_i),\r
            initGraphHelpers('#temperature6', samples_temperature_i),\r
            initGraphHelpers('#temperature7', samples_temperature_i),\r
            initGraphHelpers('#temperature8', samples_temperature_i)\r
        ];\r
        var debugHelpers = [\r
            initGraphHelpers('#debug1', samples_debug_i),\r
            initGraphHelpers('#debug2', samples_debug_i),\r
            initGraphHelpers('#debug3', samples_debug_i),\r
            initGraphHelpers('#debug4', samples_debug_i),\r
            initGraphHelpers('#debug5', samples_debug_i),\r
            initGraphHelpers('#debug6', samples_debug_i),\r
            initGraphHelpers('#debug7', samples_debug_i),\r
            initGraphHelpers('#debug8', samples_debug_i)\r
        ];\r
\r
        var raw_data_text_ements = {\r
            x: [],\r
            y: [],\r
            z: []\r
        };\r
        $('.plot_control .x, .plot_control .y, .plot_control .z').each(function () {\r
            var el = $(this);\r
            if (el.hasClass('x')) {\r
                raw_data_text_ements.x.push(el);\r
            } else if (el.hasClass('y')) {\r
                raw_data_text_ements.y.push(el);\r
            } else {\r
                raw_data_text_ements.z.push(el);\r
            }\r
        });\r
\r
        // set refresh speeds according to configuration saved in storage\r
        const sensor_settings = bridge.storeGet('sensor_settings', false);\r
        if (sensor_settings) {\r
            $('.tab-sensors select[name="gyro_refresh_rate"]').val(sensor_settings.rates.gyro);\r
            $('.tab-sensors select[name="gyro_scale"]').val(sensor_settings.scales.gyro);\r
\r
            $('.tab-sensors select[name="accel_refresh_rate"]').val(sensor_settings.rates.accel);\r
            $('.tab-sensors select[name="accel_scale"]').val(sensor_settings.scales.accel);\r
\r
            $('.tab-sensors select[name="mag_refresh_rate"]').val(sensor_settings.rates.mag);\r
            $('.tab-sensors select[name="mag_scale"]').val(sensor_settings.scales.mag);\r
\r
            $('.tab-sensors select[name="baro_refresh_rate"]').val(sensor_settings.rates.baro);\r
            $('.tab-sensors select[name="sonar_refresh_rate"]').val(sensor_settings.rates.sonar);\r
\r
            $('.tab-sensors select[name="airspeed_refresh_rate"]').val(sensor_settings.rates.airspeed);\r
\r
            $('.tab-sensors select[name="debug_refresh_rate"]').val(sensor_settings.rates.debug);\r
\r
            // start polling data by triggering refresh rate change event\r
            startPolling();\r
        } else {\r
            // start polling immediatly (as there is no configuration saved in the storage)\r
            startPolling();\r
        }\r
        \r
\r
        $('.tab-sensors .rate select, .tab-sensors .scale select').on('change', function () {\r
            startPolling();\r
        });\r
        \r
        function startPolling() {\r
            // if any of the select fields change value, all of the select values are grabbed\r
            // and timers are re-initialized with the new settings\r
            var rates = {\r
                'gyro':      parseInt($('.tab-sensors select[name="gyro_refresh_rate"]').val(), 10),\r
                'accel':     parseInt($('.tab-sensors select[name="accel_refresh_rate"]').val(), 10),\r
                'mag':       parseInt($('.tab-sensors select[name="mag_refresh_rate"]').val(), 10),\r
                'baro':      parseInt($('.tab-sensors select[name="baro_refresh_rate"]').val(), 10),\r
                'sonar':     parseInt($('.tab-sensors select[name="sonar_refresh_rate"]').val(), 10),\r
                'airspeed':  parseInt($('.tab-sensors select[name="airspeed_refresh_rate"]').val(), 10),\r
                'debug':     parseInt($('.tab-sensors select[name="debug_refresh_rate"]').val(), 10)\r
            };\r
\r
            var scales = {\r
                'gyro':  parseFloat($('.tab-sensors select[name="gyro_scale"]').val()),\r
                'accel': parseFloat($('.tab-sensors select[name="accel_scale"]').val()),\r
                'mag':   parseFloat($('.tab-sensors select[name="mag_scale"]').val())\r
            };\r
\r
            // handling of "data pulling" is a little bit funky here, as MSP_RAW_IMU contains values for gyro/accel/mag but not baro\r
            // this means that setting a slower refresh rate on any of the attributes would have no effect\r
            // what we will do instead is = determinate the fastest refresh rate for those 3 attributes, use that as a "polling rate"\r
            // and use the "slower" refresh rates only for re-drawing the graphs (to save resources/computing power)\r
            var fastest = d3.min([rates.gyro, rates.accel, rates.mag]);\r
\r
            // store current/latest refresh rates in the storage\r
            bridge.storeSet('sensor_settings', {'rates': rates, 'scales': scales});\r
\r
            // re-initialize domains with new scales\r
            gyroHelpers = initGraphHelpers('#gyro', samples_gyro_i, [-scales.gyro, scales.gyro]);\r
            accelHelpers = initGraphHelpers('#accel', samples_accel_i, [-scales.accel, scales.accel]);\r
            magHelpers = initGraphHelpers('#mag', samples_mag_i, [-scales.mag, scales.mag]);\r
\r
            // fetch currently enabled plots\r
            var checkboxes = [];\r
            $('.tab-sensors .info .checkboxes input').each(function () {\r
                checkboxes.push($(this).prop('checked'));\r
            });\r
\r
            // timer initialization\r
            interval.killAll(['status_pull', 'global_data_refresh', 'msp-load-update', 'ltm-connection-check']);\r
\r
            // data pulling timers\r
            if (checkboxes[0] || checkboxes[1] || checkboxes[2]) {\r
                interval.add('IMU_pull', function () {\r
                    MSP.send_message(MSPCodes.MSP_RAW_IMU, false, false, update_imu_graphs);\r
                }, fastest, true);\r
            }\r
\r
            if (checkboxes[3]) {\r
                interval.add('altitude_pull', function altitude_data_pull() {\r
                    MSP.send_message(MSPCodes.MSP_ALTITUDE, false, false, update_altitude_graph);\r
                }, rates.baro, true);\r
            }\r
\r
            if (checkboxes[4]) {\r
                interval.add('sonar_pull', function sonar_data_pull() {\r
                    MSP.send_message(MSPCodes.MSP_SONAR, false, false, update_sonar_graphs);\r
                }, rates.sonar, true);\r
            }\r
\r
            if (checkboxes[5]) {\r
                interval.add('airspeed_pull', function airspeed_data_pull() {\r
                    MSP.send_message(MSPCodes.MSPV2_INAV_AIR_SPEED, false, false, update_airspeed_graphs);\r
                }, rates.airspeed, true);\r
            }\r
\r
            if (checkboxes[6]) {\r
                interval.add('temperature_pull', function temperature_data_pull() {\r
                    MSP.send_message(MSPCodes.MSP2_INAV_TEMPERATURES, false, false, update_temperature_graphs);\r
                }, 1000, true);\r
            }\r
\r
            if (checkboxes[7]) {\r
                interval.add('debug_pull', function debug_data_pull() {\r
                    MSP.send_message(MSPCodes.MSP2_INAV_DEBUG, false, false, update_debug_graphs);\r
                }, rates.debug, true);\r
            }\r
\r
            function update_imu_graphs() {\r
                if (checkboxes[0]) {\r
                    updateGraphHelperSize(gyroHelpers);\r
\r
                    samples_gyro_i = addSampleToData(gyro_data, samples_gyro_i, FC.SENSOR_DATA.gyroscope);\r
                    drawGraph(gyroHelpers, gyro_data, samples_gyro_i);\r
                    raw_data_text_ements.x[0].text(FC.SENSOR_DATA.gyroscope[0].toFixed(2));\r
                    raw_data_text_ements.y[0].text(FC.SENSOR_DATA.gyroscope[1].toFixed(2));\r
                    raw_data_text_ements.z[0].text(FC.SENSOR_DATA.gyroscope[2].toFixed(2));\r
                }\r
\r
                if (checkboxes[1]) {\r
                    updateGraphHelperSize(accelHelpers);\r
\r
                    samples_accel_i = addSampleToData(accel_data, samples_accel_i, FC.SENSOR_DATA.accelerometer);\r
                    drawGraph(accelHelpers, accel_data, samples_accel_i);\r
                    raw_data_text_ements.x[1].text(FC.SENSOR_DATA.accelerometer[0].toFixed(2));\r
                    raw_data_text_ements.y[1].text(FC.SENSOR_DATA.accelerometer[1].toFixed(2));\r
                    raw_data_text_ements.z[1].text(FC.SENSOR_DATA.accelerometer[2].toFixed(2));\r
                }\r
\r
                if (checkboxes[2]) {\r
                    updateGraphHelperSize(magHelpers);\r
\r
                    samples_mag_i = addSampleToData(mag_data, samples_mag_i, FC.SENSOR_DATA.magnetometer);\r
                    drawGraph(magHelpers, mag_data, samples_mag_i);\r
                    raw_data_text_ements.x[2].text(FC.SENSOR_DATA.magnetometer[0].toFixed(2));\r
                    raw_data_text_ements.y[2].text(FC.SENSOR_DATA.magnetometer[1].toFixed(2));\r
                    raw_data_text_ements.z[2].text(FC.SENSOR_DATA.magnetometer[2].toFixed(2));\r
                }\r
            }\r
\r
            function update_altitude_graph() {\r
                updateGraphHelperSize(altitudeHelpers);\r
                samples_altitude_i = addSampleToData(altitude_data, samples_altitude_i, [FC.SENSOR_DATA.altitude, FC.SENSOR_DATA.barometer]);\r
                drawGraph(altitudeHelpers, altitude_data, samples_altitude_i);\r
                raw_data_text_ements.x[3].text(FC.SENSOR_DATA.altitude.toFixed(2));\r
                raw_data_text_ements.y[3].text(FC.SENSOR_DATA.barometer.toFixed(2));\r
            }\r
\r
            function update_sonar_graphs() {\r
                updateGraphHelperSize(sonarHelpers);\r
\r
                samples_sonar_i = addSampleToData(sonar_data, samples_sonar_i, [FC.SENSOR_DATA.sonar]);\r
                drawGraph(sonarHelpers, sonar_data, samples_sonar_i);\r
                raw_data_text_ements.x[4].text(FC.SENSOR_DATA.sonar.toFixed(2));\r
            }\r
\r
            function update_airspeed_graphs() {\r
                updateGraphHelperSize(airspeedHelpers);\r
\r
                samples_airspeed_i = addSampleToData(airspeed_data, samples_airspeed_i, [FC.SENSOR_DATA.air_speed]);\r
                drawGraph(airspeedHelpers, airspeed_data, samples_airspeed_i);\r
                raw_data_text_ements.x[5].text(FC.SENSOR_DATA.air_speed);\r
            }\r
\r
            function update_temperature_graphs() {\r
                for (var i = 0; i < 8; i++) {\r
                    updateGraphHelperSize(temperatureHelpers[i]);\r
\r
                    addSampleToData(temperature_data[i], samples_temperature_i, [FC.SENSOR_DATA.temperature[i]]);\r
                    drawGraph(temperatureHelpers[i], temperature_data[i], samples_temperature_i);\r
                    raw_data_text_ements.x[6 + i].text(FC.SENSOR_DATA.temperature[i]);\r
                }\r
                samples_temperature_i++;\r
            }\r
\r
            function update_debug_graphs() {\r
                for (var i = 0; i < 8; i++) {\r
                    updateGraphHelperSize(debugHelpers[i]);\r
\r
                    addSampleToData(debug_data[i], samples_debug_i, [FC.SENSOR_DATA.debug[i]]);\r
                    drawGraph(debugHelpers[i], debug_data[i], samples_debug_i);\r
                    raw_data_text_ements.x[6 + 8 + i].text(FC.SENSOR_DATA.debug[i]);\r
                }\r
                samples_debug_i++;\r
            }\r
        }\r
\r
        $("a.debug-trace").on('click', function () {\r
           var debugWin = window.open("tabs/debug_trace.html", "receiver_msp", "width=500,height=510,menubar=no,contextIsolation=no,nodeIntegration=yes");\r
           debugWin.window.getDebugTrace = function () { return FC.DEBUG_TRACE || ''; };\r
        });\r
\r
        GUI.content_ready(callback);\r
    }));\r
};\r
\r
sensorsTab.cleanup = function (callback) {\r
    CONFIGURATOR.connection.emptyOutputBuffer();\r
\r
    if (callback) callback();\r
};\r
\r
export default sensorsTab;\r
`;export{e as default};
