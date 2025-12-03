const r=`'use strict';\r
\r
import semver from 'semver';\r
import Map from 'ol/Map.js';\r
import XYZ from 'ol/source/XYZ.js';\r
import OSM from 'ol/source/OSM.js';\r
import TileWMS from 'ol/source/TileWMS'\r
import TileLayer from 'ol/layer/Tile.js';\r
import View from 'ol/View.js'\r
import { fromLonLat } from 'ol/proj';\r
import Style from 'ol/style/Style'\r
import Icon from 'ol/style/Icon';\r
import Text from 'ol/style/Text';\r
import Fill from 'ol/style/Fill';\r
import Point from 'ol/geom/Point.js';\r
import Feature from 'ol/Feature';\r
import VectorSource from 'ol/source/Vector.js';\r
import VectorLayer from 'ol/layer/Vector.js';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import interval from './../js/intervals';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import i18n from './../js/localization';\r
import Settings from './../js/settings';\r
import serialPortHelper from './../js/serialPortHelper';\r
import features from './../js/feature_framework';\r
import { globalSettings } from './../js/globalSettings';\r
import jBox from 'jbox';\r
import SerialBackend from '../js/serial_backend';\r
import ublox from '../js/ublox/UBLOX';\r
import dialog from '../js/dialog';\r
\r
\r
const gpsTab = { };\r
\r
gpsTab.initialize = function (callback) {\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    // mavlink ADSB_EMITTER_TYPE\r
    const ADSB_VEHICLE_TYPE = {\r
        0: {iconNum: 14, name: 'No info'}, // ADSB_EMITTER_TYPE_NO_INFO\r
        1: {iconNum: 1,  name: 'Light'}, // ADSB_EMITTER_TYPE_LIGHT\r
        2: {iconNum: 1,  name: 'Small'}, // ADSB_EMITTER_TYPE_SMALL\r
        3: {iconNum: 2,  name: 'Large'}, // ADSB_EMITTER_TYPE_LARGE\r
        4: {iconNum: 14, name: 'High vortex large'}, // ADSB_EMITTER_TYPE_HIGH_VORTEX_LARGE\r
        5: {iconNum: 5,  name: 'Heavy'}, // ADSB_EMITTER_TYPE_HEAVY\r
        6: {iconNum: 14, name: 'Manuv'}, // ADSB_EMITTER_TYPE_HIGHLY_MANUV\r
        7: {iconNum: 13, name: 'Rotorcraft'}, // ADSB_EMITTER_TYPE_ROTOCRAFT\r
        8: {iconNum: 14, name: 'Unassigned'}, // ADSB_EMITTER_TYPE_UNASSIGNED\r
        9: {iconNum: 6,  name: 'Glider'}, // ADSB_EMITTER_TYPE_GLIDER\r
        10:{iconNum: 7,  name: 'Lighter air'}, // ADSB_EMITTER_TYPE_LIGHTER_AIR\r
        11:{iconNum: 15, name: 'Parachute'}, // ADSB_EMITTER_TYPE_PARACHUTE\r
        12:{iconNum: 1,  name: 'Ultra light'}, // ADSB_EMITTER_TYPE_ULTRA_LIGHT\r
        13:{iconNum: 14, name: 'Unassigned 2'}, // ADSB_EMITTER_TYPE_UNASSIGNED2\r
        14:{iconNum: 8,  name: 'UAV'}, // ADSB_EMITTER_TYPE_UAV\r
        15:{iconNum: 14, name: 'Space'}, // ADSB_EMITTER_TYPE_SPACE\r
        16:{iconNum: 14, name: 'Unassigned 3'}, // ADSB_EMITTER_TYPE_UNASSGINED3\r
        17:{iconNum: 9,  name: 'Surface'}, // ADSB_EMITTER_TYPE_EMERGENCY_SURFACE\r
        18:{iconNum: 10, name: 'Service surface'}, // ADSB_EMITTER_TYPE_SERVICE_SURFACE\r
        19:{iconNum: 12, name: 'Pint obstacle'}, // ADSB_EMITTER_TYPE_POINT_OBSTACLE\r
    };\r
\r
    var loadChainer = new MSPChainerClass();\r
\r
    var loadChain = [\r
        mspHelper.loadFeatures,\r
        mspHelper.loadSerialPorts,\r
        mspHelper.loadMiscV2\r
    ];\r
\r
    loadChainer.setChain(loadChain);\r
    loadChainer.setExitPoint(load_html);\r
    loadChainer.execute();\r
\r
    var saveChainer = new MSPChainerClass();\r
\r
    var saveChain = [\r
        mspHelper.saveMiscV2,\r
        mspHelper.saveSerialPorts,\r
        saveSettings,\r
        mspHelper.saveToEeprom\r
    ];\r
\r
    function saveSettings(onComplete) {\r
        Settings.saveInputs(onComplete);\r
    }\r
\r
    saveChainer.setChain(saveChain);\r
    saveChainer.setExitPoint(reboot);\r
\r
    function reboot() {\r
        //noinspection JSUnresolvedVariable\r
        GUI.log(i18n.getMessage('configurationEepromSaved'));\r
\r
        GUI.tab_switch_cleanup(function () {\r
            MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, function () {\r
                //noinspection JSUnresolvedVariable\r
                GUI.log(i18n.getMessage('deviceRebooting'));\r
                GUI.handleReconnect($('.tab_gps a'));\r
            });\r
        });\r
    }\r
    \r
    async function loadIcons() {\r
        for (let i = 0; i <= 19; i++) {\r
            ADSB_VEHICLE_TYPE[i].icon = (await import(\`./../resources/adsb/adsb_\${ADSB_VEHICLE_TYPE[i].iconNum}.png?inline\`)).default;\r
        }\r
        arrowIcon = (await import('./../images/icons/map/cf_icon_position.png?inline')).default;\r
    }\r
\r
    async function load_html() {\r
        const { default: html } = await import('./gps.html?raw');\r
        await loadIcons();\r
        GUI.load(html, Settings.processHtml(process_html));\r
    }\r
\r
    let cursorInitialized = false;\r
    let iconStyle;\r
    let mapHandler;\r
    let iconGeometry;\r
    let iconFeature;\r
\r
    let vehicleVectorSource;\r
    let vehiclesCursorInitialized = false;\r
    let arrowIcon;\r
\r
    function process_html() {\r
        i18n.localize();\r
\r
        var fcFeatures = FC.getFeatures();\r
\r
        features.updateUI($('.tab-gps'), FC.FEATURES);\r
\r
        //Generate serial port options\r
        let $port = $('#gps_port');\r
        let $baud = $('#gps_baud');\r
\r
        let ports = serialPortHelper.getPortIdentifiersForFunction('GPS');\r
\r
        let currentPort = null;\r
\r
        if (ports.length == 1) {\r
            currentPort = ports[0];\r
        }\r
\r
        let availablePorts = serialPortHelper.getPortList();\r
\r
        //Generate port select\r
        $port.append('<option value="-1">NONE</option>');\r
        for (let i = 0; i < availablePorts.length; i++) {\r
            let port = availablePorts[i];\r
            $port.append('<option value="' + port.identifier + '">' + port.displayName + '</option>');\r
        }\r
\r
        //Generate baud select\r
        serialPortHelper.getBauds('SENSOR').forEach(function (baud) {\r
            $baud.append('<option value="' + baud + '">' + baud + '</option>');\r
        });\r
\r
        //Select defaults\r
        if (currentPort !== null) {\r
            $port.val(currentPort);\r
            let portConfig = serialPortHelper.getPortByIdentifier(currentPort);\r
            $baud.val(portConfig.sensors_baudrate);\r
        } else {\r
            $port.val(-1);\r
            $baud.val(serialPortHelper.getRuleByName('GPS').defaultBaud);\r
        }\r
\r
        // generate GPS\r
        var gpsProtocols = FC.getGpsProtocols();\r
        var gpsSbas = FC.getGpsSbasProviders();\r
\r
        var gps_protocol_e = $('#gps_protocol');\r
        for (let i = 0; i < gpsProtocols.length; i++) {\r
            gps_protocol_e.append('<option value="' + i + '">' + gpsProtocols[i] + '</option>');\r
        }\r
\r
        gps_protocol_e.on('change', function () {\r
            FC.MISC.gps_type = parseInt($(this).val());\r
        });\r
\r
        gps_protocol_e.val(FC.MISC.gps_type);\r
        gps_protocol_e.trigger('change');\r
\r
        var gps_ubx_sbas_e = $('#gps_ubx_sbas');\r
        for (let i = 0; i < gpsSbas.length; i++) {\r
            gps_ubx_sbas_e.append('<option value="' + i + '">' + gpsSbas[i] + '</option>');\r
        }\r
\r
        gps_ubx_sbas_e.on('change', function () {\r
            FC.MISC.gps_ubx_sbas = parseInt($(this).val());\r
        });\r
\r
        gps_ubx_sbas_e.val(FC.MISC.gps_ubx_sbas);\r
\r
        let mapView = new View({\r
            center: [0, 0],\r
            zoom: 15\r
        });\r
\r
        let mapLayers = [];\r
\r
        if (globalSettings.mapProviderType == 'esri') {\r
            mapLayers.push(new TileLayer({\r
                    source: new XYZ({\r
                        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',\r
                        attributions: 'Source: <a href="https://www.esri.com/" target="_blank">Esri</a>, Maxar, Earthstar Geographics, and the GIS User Community',\r
                        maxZoom: 19\r
                    })\r
            }));\r
            mapLayers.push(new TileLayer({\r
                    source: new XYZ({\r
                        url: 'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',\r
                        maxZoom: 19\r
                    })\r
            }));\r
            mapLayers.push(new TileLayer({\r
                    source: new XYZ({\r
                        url: 'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',\r
                        maxZoom: 19\r
                    })\r
            }));\r
        } else if (globalSettings.mapProviderType == 'mapproxy' ) {\r
            mapLayers.push(new TileLayer({\r
                source: new TileWMS({\r
                            url: globalSettings.proxyURL,\r
                            params: {'LAYERS':globalSettings.proxyLayer}\r
                        })\r
            }));\r
        } else {\r
            mapLayers.push(new TileLayer({\r
                source: new OSM()\r
            }));\r
        }\r
\r
        $("#center_button").on('click', function () {\r
            let lat = FC.GPS_DATA.lat / 10000000;\r
            let lon = FC.GPS_DATA.lon / 10000000;\r
            let center = fromLonLat([lon, lat]);\r
            mapView.setCenter(center);\r
        });\r
\r
        mapHandler = new Map({\r
            target: 'gps-map',\r
            layers: mapLayers,\r
            view: mapView\r
        });\r
\r
        gpsTab.toolboxAdsbVehicle = new jBox('Mouse', {\r
            position: {\r
                x: "right",\r
                y: "bottom"\r
            },\r
            offset: {\r
                x: -5,\r
                y: 20,\r
            },\r
        });\r
\r
        mapHandler.on('pointermove', function(evt) {\r
            var feature = mapHandler.forEachFeatureAtPixel(mapHandler.getEventPixel(evt.originalEvent), function(feature, layer) {\r
                return feature;\r
            });\r
\r
            if (feature && feature.get('data') && feature.get('name')) {\r
                gpsTab.toolboxAdsbVehicle.setContent(\r
                    \`callsign: <strong>\` + feature.get('name') + \`</strong><br />\`\r
                    + \`lat: <strong>\`+ (feature.get('data').lat / 10000000) + \`</strong><br />\`\r
                    + \`lon: <strong>\`+ (feature.get('data').lon / 10000000) + \`</strong><br />\`\r
                    + \`ASL: <strong>\`+ (feature.get('data').altCM ) / 100 + \`m</strong><br />\`\r
                    + \`heading: <strong>\`+ feature.get('data').headingDegrees + \`°</strong><br />\`\r
                    + \`type: <strong>\`+ ADSB_VEHICLE_TYPE[feature.get('data').emitterType].name + \`</strong>\`\r
                ).open();\r
            }else{\r
                gpsTab.toolboxAdsbVehicle.close();\r
            }\r
        });\r
\r
        let center = fromLonLat([0, 0]);\r
        mapView.setCenter(center);\r
        mapView.setZoom(2);\r
\r
        function get_raw_gps_data() {\r
            MSP.send_message(MSPCodes.MSP_RAW_GPS, false, false, get_comp_gps_data);\r
        }\r
\r
        function get_comp_gps_data() {\r
            MSP.send_message(MSPCodes.MSP_COMP_GPS, false, false, get_gpsstatistics_data);\r
        }\r
\r
        function get_gpsstatistics_data() {\r
            MSP.send_message(MSPCodes.MSP_GPSSTATISTICS, false, false, update_gps_ui);\r
        }\r
\r
        function get_raw_adsb_data() {\r
            MSP.send_message(MSPCodes.MSP2_ADSB_VEHICLE_LIST, false, false, update_adsb_ui);\r
        }\r
\r
        function update_gps_ui() {\r
            let lat = FC.GPS_DATA.lat / 10000000;\r
            let lon = FC.GPS_DATA.lon / 10000000;\r
\r
            let gpsFixType = i18n.getMessage('gpsFixNone');\r
            if (FC.GPS_DATA.fix >= 2) {\r
                gpsFixType = i18n.getMessage('gpsFix3D');\r
            } else if (FC.GPS_DATA.fix >= 1) {\r
                gpsFixType = i18n.getMessage('gpsFix2D');\r
            }\r
\r
            $('.GPS_info td.fix').html(gpsFixType);\r
            $('.GPS_info td.alt').text(FC.GPS_DATA.alt + ' m');\r
            $('.GPS_info td.lat').text(lat.toFixed(4) + ' deg');\r
            $('.GPS_info td.lon').text(lon.toFixed(4) + ' deg');\r
            $('.GPS_info td.speed').text(FC.GPS_DATA.speed + ' cm/s');\r
            $('.GPS_info td.sats').text(FC.GPS_DATA.numSat);\r
            $('.GPS_info td.distToHome').text(FC.GPS_DATA.distanceToHome + ' m');\r
\r
            let gpsRate = 0;\r
            if (FC.GPS_DATA.messageDt > 0) {\r
                gpsRate = 1000 / FC.GPS_DATA.messageDt;\r
            }\r
\r
            $('.GPS_stat td.messages').text(FC.GPS_DATA.packetCount);\r
            $('.GPS_stat td.rate').text(gpsRate.toFixed(1) + ' Hz');\r
            $('.GPS_stat td.errors').text(FC.GPS_DATA.errors);\r
            $('.GPS_stat td.timeouts').text(FC.GPS_DATA.timeouts);\r
            $('.GPS_stat td.eph').text((FC.GPS_DATA.eph / 100).toFixed(2) + ' m');\r
            $('.GPS_stat td.epv').text((FC.GPS_DATA.epv / 100).toFixed(2) + ' m');\r
            $('.GPS_stat td.hdop').text((FC.GPS_DATA.hdop / 100).toFixed(2));\r
\r
            //Update map\r
            if (FC.GPS_DATA.fix >= 2) {\r
\r
                let center = fromLonLat([lon, lat]);\r
\r
                if (!cursorInitialized) {\r
                    cursorInitialized = true;\r
\r
                    iconStyle = new Style({\r
                        image: new Icon(({\r
                            anchor: [0.5, 1],\r
                            opacity: 1,\r
                            scale: 0.5,\r
                            src: arrowIcon\r
                        }))\r
                    });\r
\r
                    let currentPositionLayer;\r
                    iconGeometry = new Point(fromLonLat([0, 0]));\r
                    iconFeature = new Feature({\r
                        geometry: iconGeometry\r
                    });\r
\r
                    iconFeature.setStyle(iconStyle);\r
\r
                    let vectorSource = new VectorSource({\r
                        features: [iconFeature]\r
                    });\r
                    currentPositionLayer = new VectorLayer ({\r
                        source: vectorSource\r
                    });\r
\r
                    mapHandler.addLayer(currentPositionLayer);\r
\r
                    mapView.setCenter(center);\r
                    mapView.setZoom(14);\r
                }\r
\r
                iconGeometry.setCoordinates(center);\r
\r
            }\r
        }\r
\r
        function update_adsb_ui() {\r
\r
            if (vehiclesCursorInitialized) {\r
                vehicleVectorSource.clear();\r
            }\r
\r
            $('.adsbVehicleTotalMessages').html(FC.ADSB_VEHICLES.vehiclePacketCount);\r
            $('.adsbHeartbeatTotalMessages').html(FC.ADSB_VEHICLES.heartbeatPacketCount);\r
\r
            for (let key in FC.ADSB_VEHICLES.vehicles) {\r
                let vehicle = FC.ADSB_VEHICLES.vehicles[key];\r
\r
                if (!vehiclesCursorInitialized) {\r
                    vehiclesCursorInitialized = true;\r
\r
                    vehicleVectorSource = new VectorSource({});\r
\r
                    let vehicleLayer = new VectorLayer({\r
                        source: vehicleVectorSource\r
                    });\r
\r
                    mapHandler.addLayer(vehicleLayer);\r
                }\r
\r
                if (vehicle.lat != 0 && vehicle.lon != 0 && vehicle.ttl > 0) {\r
                    let vehicleIconStyle = new Style({\r
                        image: new Icon(({\r
                            opacity: 1,\r
                            rotation: vehicle.headingDegrees * (Math.PI / 180),\r
                            scale: 0.8,\r
                            anchor: [0.5, 0.5],\r
                            src: ADSB_VEHICLE_TYPE[vehicle.emitterType].icon,\r
                        })),\r
                        text: new Text(({\r
                            text: vehicle.callsign,\r
                            textAlign: 'center',\r
                            textBaseline: "bottom",\r
                            offsetY: +40,\r
                            padding: [2, 2, 2, 2],\r
                            backgroundFill: '#444444',\r
                            fill: new Fill({color: '#ffffff'}),\r
                        })),\r
                    });\r
\r
\r
                    let iconGeometry = new Point(fromLonLat([vehicle.lon / 10000000, vehicle.lat / 10000000]));\r
                    let iconFeature = new Feature({\r
                        geometry: iconGeometry,\r
                        name: vehicle.callsign,\r
                        type: 'adsb',\r
                        data: vehicle,\r
                    });\r
\r
                    iconFeature.setStyle(vehicleIconStyle);\r
                    vehicleVectorSource.addFeature(iconFeature);\r
                }\r
            }\r
        }\r
\r
        /*\r
         * enable data pulling\r
         * GPS is usually refreshed at 5Hz, there is no reason to pull it much more often, really...\r
         */\r
        interval.add('gps_pull', function gps_update() {\r
            // avoid usage of the GPS commands until a GPS sensor is detected for targets that are compiled without GPS support.\r
            if (!SerialBackend.have_sensor(FC.CONFIG.activeSensors, 'gps')) {\r
                update_gps_ui();\r
                return;\r
            }\r
\r
            get_raw_gps_data();\r
\r
        }, 200);\r
\r
\r
        if (semver.gte(FC.CONFIG.flightControllerVersion, "8.0.0")) {\r
            $('.adsb_info_block').hide();\r
            mspHelper.loadSerialPorts(function () {\r
                for(var i  in FC.SERIAL_CONFIG.ports){\r
                   if(FC.SERIAL_CONFIG.ports[i].functions && FC.SERIAL_CONFIG.ports[i].functions.includes("TELEMETRY_MAVLINK")){\r
                       $('.adsb_info_block').show();\r
                       interval.add('adsb_pull', get_raw_adsb_data, 200);\r
                       break;\r
                   }\r
                }\r
            });\r
        }\r
\r
        $('a.save').on('click', function () {\r
            serialPortHelper.set($port.val(), 'GPS', $baud.val());\r
            features.reset();\r
            features.fromUI($('.tab-gps'));\r
            features.execute(function () {\r
                saveChainer.execute();\r
            });\r
        });\r
\r
        function processUbloxData(data) {\r
            if(data != null) {\r
                //console.log("processing data type: " + typeof(data));\r
                let totalSent = 0;\r
                let total = data.length;\r
\r
                var ubloxChainer = MSPChainerClass();\r
                var chain = [];\r
                let d = new Date();\r
\r
                GUI.log(i18n.getMessage('gpsAssistnowStart'));\r
                data.forEach((item) => {\r
                    chain.push(function (callback) {\r
                        //console.log("UBX command: " + item.length);\r
                        let callCallback = false;\r
                        if (ublox.isAssistnowDataRelevant(item, d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate()+1)) {\r
                            mspHelper.sendUbloxCommand(item, callback);\r
                        } else {\r
                            // Ignore msp command, but keep counter going.\r
                            callCallback = true;\r
                        }\r
                        totalSent++;\r
                        if((totalSent % 100) == 0) {\r
                            GUI.log(totalSent + '/' + total + ' ' + i18n.getMessage('gpsAssistnowUpdate'));\r
                        }\r
                        if(callCallback) {\r
                            callback();\r
                        }\r
                    });\r
                });\r
                ubloxChainer.setChain(chain);\r
                ubloxChainer.setExitPoint(function () {\r
                    if ((totalSent % 100) != 0) {\r
                        GUI.log(totalSent + '/' + total + ' ' + i18n.getMessage('gpsAssistnowUpdate'));\r
                    }\r
                    GUI.log(i18n.getMessage('gpsAssistnowDone'));\r
                });\r
\r
                ubloxChainer.execute();\r
            }\r
        }\r
\r
        $('a.loadAssistnowOnline').on('click', function () {\r
            if(globalSettings.assistnowApiKey != null && globalSettings.assistnowApiKey != '') {\r
                ublox.loadAssistnowOnline(processUbloxData);\r
           } else {\r
                dialog.alert("Assistnow Token not set!");\r
            }\r
        });\r
\r
        $('a.loadAssistnowOffline').on('click', function () {\r
            if(globalSettings.assistnowApiKey != null && globalSettings.assistnowApiKey != '') {\r
                ublox.loadAssistnowOffline(processUbloxData);\r
            } else {\r
                dialog.alert("Assistnow Token not set!");\r
            }\r
        });\r
\r
        GUI.content_ready(callback);\r
    }\r
\r
};\r
\r
gpsTab.cleanup = function (callback) {\r
    if (callback) callback();\r
    if (gpsTab.toolboxAdsbVehicle){\r
        gpsTab.toolboxAdsbVehicle.close();\r
    }\r
};\r
\r
export default gpsTab;\r
`;export{r as default};
