const e=`'use strict';\r
\r
import xml2js from 'xml2js';\r
import { Chart, registerables } from 'chart.js';\r
\r
// Register Chart.js components\r
Chart.register(...registerables);\r
\r
// Make Chart available globally for plotElevation function\r
window.Chart = Chart;\r
\r
import Map from 'ol/Map.js';\r
import XYZ from 'ol/source/XYZ.js';\r
import OSM from 'ol/source/OSM.js';\r
import TileWMS from 'ol/source/TileWMS'\r
import TileLayer from 'ol/layer/Tile.js';\r
import View from 'ol/View.js'\r
import { fromLonLat, toLonLat, getPointResolution, METERS_PER_UNIT } from 'ol/proj';\r
import Style from 'ol/style/Style'\r
import Icon from 'ol/style/Icon';\r
import Text from 'ol/style/Text';\r
import Fill from 'ol/style/Fill';\r
import Point from 'ol/geom/Point.js';\r
import Feature from 'ol/Feature';\r
import VectorSource from 'ol/source/Vector.js';\r
import VectorLayer from 'ol/layer/Vector.js';\r
import { LineString } from 'ol/geom';\r
import Stroke from 'ol/style/Stroke';\r
import RegularShape from 'ol/style/RegularShape';\r
import Circle from 'ol/geom/Circle';\r
import PointerInteraction from 'ol/interaction/Pointer.js';\r
import {defaults as defaultInteractions} from 'ol/interaction/defaults';\r
import {Control, defaults as defaultControls} from 'ol/control.js';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import mspQueue from './../js/serial_queue';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import CONFIGURATOR from './../js/data_storage';\r
import i18n from './../js/localization';\r
import { globalSettings } from './../js/globalSettings';\r
import MWNP from './../js/mwnp';\r
import Waypoint from './../js/waypoint';\r
import WaypointCollection from './../js/waypointCollection';\r
import Safehome from './../js/safehome';\r
import SafehomeCollection from './../js/safehomeCollection';\r
import { ApproachDirection, FwApproach } from './../js/fwApproach';\r
import FwApproachCollection from './../js/fwApproachCollection';\r
import SerialBackend from './../js/serial_backend';\r
import { distanceOnLine, wrap_360, calculate_new_cooridatnes } from './../js/helpers';\r
import interval from './../js/intervals';\r
import { Geozone, GeozoneVertex, GeozoneType, GeozoneShapes, GeozoneFenceAction }  from './../js/geozone';\r
import dialog from '../js/dialog';\r
import {bridge, Platform} from './../js/bridge';\r
\r
import html from'./mission_control.html?raw';\r
import { mul } from 'three/tsl';\r
\r
var MAX_NEG_FW_LAND_ALT = -2000; // cm\r
\r
// Dictionary of Parameter 1,2,3 definition depending on type of action selected (refer to MWNP.WPTYPE)\r
var dictOfLabelParameterPoint = {\r
    1:  {parameter1: 'Speed (cm/s)', parameter2: '', parameter3: 'Sea level Ref'},\r
    2:  {parameter1: '', parameter2: '', parameter3: ''},\r
    3:  {parameter1: 'Wait time (s)', parameter2: 'Speed (cm/s)', parameter3: 'Sea level Ref'},\r
    4:  {parameter1: 'Force land (non zero)', parameter2: '', parameter3: ''},\r
    5:  {parameter1: '', parameter2: '', parameter3: ''},\r
    6:  {parameter1: 'Target WP number', parameter2: 'Number of repeat (-1: infinite)', parameter3: ''},\r
    7:  {parameter1: 'Heading (deg)', parameter2: '', parameter3: ''},\r
    8:  {parameter1: '', parameter2: '', parameter3: 'Sea level Ref'}\r
};\r
\r
var waypointOptions = ['JUMP','SET_HEAD','RTH'];\r
\r
const iconNames = [\r
    'icon_mission_airplane.png',\r
    'icon_RTH.png',\r
    'icon_safehome.png',\r
    'icon_safehome_used.png',\r
    'icon_geozone_excl.png',\r
    'icon_geozone_incl.png',\r
    'icon_home.png',\r
    'icon_position_edit.png',\r
    'icon_position_head.png',\r
    'icon_position_LDG_edit.png',\r
    'icon_position_LDG.png',\r
    'icon_position_PH_edit.png',\r
    'icon_position_PH.png',\r
    'icon_position_POI.png',\r
    'icon_position_POI_edit.png',\r
    'icon_position_WP_edit.png',\r
    'icon_position_WP.png',\r
    'icon_position_edit.png',\r
    'icon_arrow.png',\r
    'settings_white.svg',\r
    'icon_safehome_white.svg',\r
    'icon_geozone_white.svg',\r
    'icon_elevation_white.svg',\r
    'icon_multimission_white.svg'    \r
];\r
\r
const icons = Object.create(null)\r
\r
////////////////////////////////////\r
//\r
// Tab mission control block\r
//\r
////////////////////////////////////\r
\r
const missionControlTab = {};\r
missionControlTab.isYmapLoad = false;\r
missionControlTab.initialize = function (callback) {\r
\r
    let cursorInitialized = false;\r
    let curPosStyle;\r
    let curPosGeo;\r
    let rthGeo;\r
    let breadCrumbLS;\r
    let breadCrumbFeature;\r
    let breadCrumbStyle;\r
    let breadCrumbSource;\r
    let breadCrumbVector;\r
    let textStyle;\r
    let textFeature;\r
    var textGeom;\r
    let isOffline = false;\r
    let selectedSafehome;\r
    let $safehomeContentBox;\r
    let $waypointOptionsTableBody;\r
    let selectedGeozone;\r
    let $geozoneContent;\r
    let invalidGeoZones = false;\r
    let isGeozoneEnabeld = false;\r
    let settings = {speed: 0, alt: 5000, safeRadiusSH: 50, fwApproachAlt: 60, fwLandAlt: 5, maxDistSH: 0, fwApproachLength: 0, fwLoiterRadius: 0};\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    if (FC.isFeatureEnabled('GEOZONE')) {\r
        isGeozoneEnabeld = true;\r
    }\r
\r
    if (CONFIGURATOR.connectionValid) {\r
        var loadChainer = new MSPChainerClass();\r
        loadChainer.setChain([\r
            mspHelper.getMissionInfo,\r
            //mspHelper.loadWaypoints,\r
            mspHelper.loadSafehomes,\r
            mspHelper.loadFwApproach,\r
            function (callback) {\r
                if (isGeozoneEnabeld) {\r
                    mspHelper.loadGeozones(callback);\r
                } else {\r
                    callback();\r
                }\r
            },\r
            function (callback) {\r
                mspHelper.getSetting("nav_fw_land_approach_length").then((data) =>  {\r
                    settings.fwApproachLength = parseInt(data.value);\r
                }).then(callback);\r
            },\r
            function (callback) {\r
                mspHelper.getSetting("safehome_max_distance").then((data) => {\r
                    settings.maxDistSH = parseInt(data.value) / 100;\r
                }).then(callback);\r
            },\r
            function (callback) {\r
                mspHelper.getSetting(("nav_fw_loiter_radius")).then((data) => {\r
                    settings.fwLoiterRadius = parseInt(data.value);\r
                }).then(callback);\r
            }\r
        ]);\r
        loadChainer.setExitPoint(loadHtml);\r
        loadChainer.execute();\r
    } else {\r
\r
        // FC not connected, load page anyway\r
        loadHtml();\r
        if (!FC.FW_APPROACH) {\r
            FC.FW_APPROACH = new FwApproachCollection();\r
        }\r
        if (!FC.SAFEHOMES) {\r
            FC.SAFEHOMES = new SafehomeCollection();\r
        }\r
        for (let i = 0; i < FC.FW_APPROACH.getMaxFwApproachCount(); i++){\r
            FC.FW_APPROACH.put(new FwApproach(i));\r
        }\r
    }\r
    \r
function iconKey(filename) {\r
    // drop extension, keep base name (e.g., "icon_RTH")\r
    return filename.replace(/\\.(png|svg)$/i, '');\r
}\r
\r
    async function loadIcons() {\r
        for (const fname of iconNames) {\r
            // Vites packager needs a bit help\r
            const base = iconKey(fname);\r
            const ext = fname.split('.').pop();\r
            let iconUrl;\r
            if (ext === 'png') {\r
                iconUrl = (await import(\`./../images/icons/map/cf_\${base}.png?inline\`)).default;\r
            } else if (ext === 'svg') {\r
                iconUrl = (await import(\`./../images/icons/map/cf_\${base}.svg?inline\`)).default;\r
            }\r
            if (!iconUrl) {\r
               throw new Error(\`Missing icon URL for \${fname}\`);\r
            }\r
            icons[base] = iconUrl;\r
        }\r
    }\r
\r
    function loadHtml() {\r
        GUI.load(html, () => loadIcons().then(process_html));\r
    }\r
\r
    function process_html() {\r
\r
        // set GUI for offline operations\r
        if (!CONFIGURATOR.connectionValid) {\r
            $('#infoAvailablePoints').hide();\r
            $('#infoMissionValid').hide();\r
            $('#loadMissionButton').hide();\r
            $('#saveMissionButton').hide();\r
            $('#loadEepromMissionButton').hide();\r
            $('#saveEepromMissionButton').hide();\r
            isOffline = true;\r
        }\r
\r
        $('#infoGeozoneMissionWarning').hide();\r
        $('#infoGeozoneInvalid').hide();\r
        $safehomeContentBox = $('#SafehomeContentBox');\r
        $waypointOptionsTableBody = $('#waypointOptionsTableBody');\r
        $geozoneContent = $('#geozoneContent');\r
\r
       \r
            loadSettings();\r
            // let the dom load finish, avoiding the resizing of the map\r
            setTimeout(initMap, 200);\r
            if (!isOffline) {\r
                setTimeout(() => {\r
                    if (FC.SAFEHOMES.safehomeCount() >= 1) {\r
                        updateSelectedShAndFwAp(0);\r
                    } else {\r
                        selectedSafehome = null;\r
                        selectedFwApproachSh = null;\r
                    }\r
                    renderSafehomesOnMap();\r
                    updateSafehomeInfo();\r
                }, 500);\r
                if (isGeozoneEnabeld) {\r
                    setTimeout(() => {\r
                        selectedGeozone = FC.GEOZONES.last();\r
                        renderGeozonesOnMap();\r
                        updateGeozoneInfo();\r
                    }, 500);\r
                }\r
            }\r
    \r
        i18n.localize();\r
\r
        function get_raw_gps_data() {\r
            MSP.send_message(MSPCodes.MSP_RAW_GPS, false, false, get_comp_gps_data);\r
        }\r
\r
        function get_comp_gps_data() {\r
            MSP.send_message(MSPCodes.MSP_COMP_GPS, false, false, get_altitude_data);\r
        }\r
\r
        function get_altitude_data() {\r
            MSP.send_message(MSPCodes.MSP_ALTITUDE, false, false, get_attitude_data);\r
\r
        }\r
\r
        function get_attitude_data() {\r
            MSP.send_message(MSPCodes.MSP_ATTITUDE, false, false, update_gpsTrack);\r
        }\r
\r
        function update_gpsTrack() {\r
\r
          let lat = FC.GPS_DATA.lat / 10000000;\r
          let lon = FC.GPS_DATA.lon / 10000000;\r
\r
          //Update map\r
          if (FC.GPS_DATA.fix >= 2) {\r
\r
              if (!cursorInitialized) {\r
                  cursorInitialized = true;\r
\r
                  /////////////////////////////////////\r
                  //create layer for current position\r
                  curPosStyle = new Style({\r
                      image: new Icon(({\r
                          anchor: [0.5, 0.5],\r
                          opacity: 1,\r
                          scale: 0.6,\r
                          src: icons['icon_mission_airplane']\r
                      }))\r
                  });\r
\r
                  let currentPositionLayer;\r
                  curPosGeo = new Point(fromLonLat([lon, lat]));\r
\r
                  let curPosFeature = new Feature({\r
                      geometry: curPosGeo\r
                  });\r
\r
                  curPosFeature.setStyle(curPosStyle);\r
\r
                  let vectorSource = new VectorSource({\r
                      features: [curPosFeature]\r
                  });\r
                  currentPositionLayer = new VectorLayer({\r
                      source: vectorSource\r
                  });\r
\r
                  ///////////////////////////\r
                  //create layer for RTH Marker\r
                  let rthStyle = new Style({\r
                      image: new Icon(({\r
                          anchor: [0.5, 1.0],\r
                          opacity: 1,\r
                          scale: 0.5,\r
                          src: icons['icon_RTH']\r
                      }))\r
                  });\r
\r
                  rthGeo = new Point(fromLonLat([90, 0]));\r
\r
                  let rthFeature = new Feature({\r
                      geometry: rthGeo\r
                  });\r
\r
                  rthFeature.setStyle(rthStyle);\r
\r
                  let rthVector = new VectorSource({\r
                      features: [rthFeature]\r
                  });\r
                  let rthLayer = new VectorLayer({\r
                      source: rthVector\r
                  });\r
\r
                  //////////////////////////////\r
                  //create layer for bread crumbs\r
                  breadCrumbLS = new LineString([fromLonLat([lon, lat]), fromLonLat([lon, lat])]);\r
\r
                  breadCrumbStyle = new Style({\r
                    stroke: new Stroke({\r
                      color: '#ffcc33',\r
                      width: 6\r
                    })\r
                  });\r
\r
                  breadCrumbFeature = new Feature({\r
                    geometry: breadCrumbLS\r
                  });\r
\r
                  breadCrumbFeature.setStyle(breadCrumbStyle);\r
\r
                  breadCrumbSource = new VectorSource({\r
                    features: [breadCrumbFeature]\r
                  });\r
\r
                  breadCrumbVector = new VectorLayer({\r
                    source: breadCrumbSource\r
                  });\r
\r
                  /////////////////////////////\r
                  //create layer for heading, alt, groundspeed\r
                  textGeom = new Point([0,0]);\r
\r
                  textStyle = new Style({\r
                    text: new Text({\r
                      font: 'bold 35px Calibri,sans-serif',\r
                      fill: new Fill({ color: '#fff' }),\r
                      offsetX: map.getSize()[0]-260,\r
                      offsetY: 80,\r
                      textAlign: 'left',\r
                      backgroundFill: new Fill({ color: '#000' }),\r
                      stroke: new Stroke({\r
                        color: '#fff', width: 2\r
                      }),\r
                      text: 'H: XXX\\nAlt: XXXm\\nSpeed: XXXcm/s'\r
                    })\r
                  });\r
\r
                  textFeature = new Feature({\r
                    geometry: textGeom\r
                  });\r
\r
                  textFeature.setStyle(textStyle);\r
\r
                  var textSource = new VectorSource({\r
                    features: [textFeature]\r
                  });\r
\r
                  var textVector = new VectorLayer({\r
                    source: textSource\r
                  });\r
\r
                  map.addLayer(rthLayer);\r
                  map.addLayer(breadCrumbVector);\r
                  map.addLayer(currentPositionLayer);\r
                  map.addControl(textVector);\r
              }\r
\r
              let gpsPos = fromLonLat([lon, lat]);\r
              curPosGeo.setCoordinates(gpsPos);\r
\r
              breadCrumbLS.appendCoordinate(gpsPos);\r
\r
              var coords = breadCrumbLS.getCoordinates();\r
              if(coords.length > 100)\r
              {\r
                coords.shift();\r
                breadCrumbLS.setCoordinates(coords);\r
              }\r
\r
              curPosStyle.getImage().setRotation((FC.SENSOR_DATA.kinematics[2]/360.0) * 6.28318);\r
\r
              //update data text\r
              textGeom.setCoordinates(map.getCoordinateFromPixel([0,0]));\r
              let tmpText = textStyle.getText();\r
              tmpText.setText('                                \\n' +\r
                              'H: ' + FC.SENSOR_DATA.kinematics[2] +\r
                              '\\nAlt: ' + FC.SENSOR_DATA.altitude +\r
                              'm\\nSpeed: ' + FC.GPS_DATA.speed + 'cm/s\\n' +\r
                              'Dist: ' + FC.GPS_DATA.distanceToHome + 'm');\r
          }\r
        }\r
\r
        /*\r
         * enable data pulling if not offline\r
         * Refreshing data at 5Hz...  Could slow this down if we have performance issues\r
         */\r
        if(!isOffline)\r
        {\r
            interval.add('gps_pull', function gps_update() {\r
              // avoid usage of the GPS commands until a GPS sensor is detected for targets that are compiled without GPS support.\r
              if (!SerialBackend.have_sensor(FC.CONFIG.activeSensors, 'gps')) {\r
                  update_gpsTrack();\r
                  return;\r
              }\r
\r
              get_raw_gps_data();\r
          }, 200);\r
        }\r
\r
        GUI.content_ready(callback);\r
    }\r
\r
    ///////////////////////////////////////////////\r
    //\r
    // define & init parameters\r
    //\r
    ///////////////////////////////////////////////\r
\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    //      define & init parameters for Map Layer\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    var markers = [];           // Layer for Waypoints\r
    var lines = [];             // Layer for lines between waypoints\r
    var safehomeMarkers = [];   // layer for Safehome points\r
    var safehomeMarkers = [];   // layer for Safehome points\r
    var approachLayers = []     // Layers for FW approach\r
    var safehomeMarkers = [];   // layer for Safehome points\r
    var approachLayers = []     // Layers for FW approach\r
    var geozoneMarkers = [];    // Layer for Geozonemarkers\r
    var geozoneLines = [];      // Layer for Lines between geozone vertices\r
\r
    var map;\r
\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    //      define & init parameters for Selected Marker\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    var selectedMarker = null;\r
    var selectedFeature = null;\r
    var tempMarker = null;\r
    var disableMarkerEdit = false;\r
    var selectedFwApproachWp = null;\r
    var selectedFwApproachSh = null;\r
    var lockShExclHeading = false;\r
\r
\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    //      define & init parameters for default Settings\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
\r
\r
\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    //      define & init Waypoints parameters\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    var mission = new WaypointCollection();\r
\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    //      define & init Multi Mission parameters\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    var multimission = new WaypointCollection();\r
    var multimissionCount = 0;\r
    var maxMultimissionCount = 9;\r
\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    //      define & init home parameters\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    var HOME = new Waypoint(0,0,0,0);\r
    var homeMarkers =[];    // layer for home point\r
\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    //      define & init Safehome parameters\r
    //////////////////////////////////////////////////////////////////////////////////////////////\r
    //var FC.SAFEHOMES = new SafehomeCollection(); // TO COMMENT FOR RELEASE : DECOMMENT FOR DEBUG\r
    //FC.SAFEHOMES.inflate(); // TO COMMENT FOR RELEASE : DECOMMENT FOR DEBUG\r
    //var safehomeRangeRadius = 200; //meters\r
    //var safehomeSafeRadius = 50; //meters\r
\r
    /////////////////////////////////////////////\r
    //\r
    // Reinit Jquery Form\r
    //\r
    /////////////////////////////////////////////\r
    function clearEditForm() {\r
        $('#pointLat').val('');\r
        $('#pointLon').val('');\r
        $('#pointAlt').val('');\r
        $('#pointP1').val('');\r
        $('#pointP2').val('');\r
        $('#pointP3Alt').val('');\r
        $('#missionDistance').text(0);\r
        $('#MPeditPoint').fadeOut(300);\r
    }\r
\r
    function clearFilename() {\r
        $('#missionFilename').text('');\r
    }\r
\r
    /////////////////////////////////////////////\r
    //\r
    // Manage Settings\r
    //\r
    /////////////////////////////////////////////\r
    function loadSettings() {\r
        const missionPlannerSettings = bridge.storeGet('missionPlannerSettings', false);\r
        if (missionPlannerSettings) {\r
            if (!missionPlannerSettings.fwApproachLength && settings.fwApproachLength) {\r
                missionPlannerSettings.fwApproachLength = settings.fwApproachLength;\r
                missionPlannerSettings.maxDistSH = settings.maxDistSH;\r
                missionPlannerSettings.fwLoiterRadius = settings.fwLoiterRadius;\r
            }\r
            saveSettings();\r
            settings = missionPlannerSettings;\r
        }\r
        refreshSettings();\r
    }\r
\r
    function saveSettings() {\r
        bridge.storeSet('missionPlannerSettings', settings);\r
    }\r
\r
    function refreshSettings() {\r
        $('#MPdefaultPointAlt').val(String(settings.alt));\r
        $('#MPdefaultPointSpeed').val(String(settings.speed));\r
        $('#MPdefaultSafeRangeSH').val(String(settings.safeRadiusSH));\r
        $('#MPdefaultFwApproachAlt').val(String(settings.fwApproachAlt));\r
        $('#MPdefaultLandAlt').val(String(settings.fwLandAlt));\r
    }\r
\r
    function closeSettingsPanel() {\r
        $('#missionPlannerSettings').hide();\r
    }\r
\r
    /////////////////////////////////////////////\r
    //\r
    // Manage Safehome\r
    //\r
    /////////////////////////////////////////////\r
    function closeSafehomePanel() {\r
        $('#missionPlannerSafehome').hide();\r
        cleanSafehomeLayers();\r
    }\r
\r
    async function checkApproachAltitude(altitude, isSeaLevelRef, sealevel) {\r
\r
        if (altitude - (isSeaLevelRef ? sealevel * 100 : 0 ) < 0) {\r
            dialog.alert(i18n.getMessage('MissionPlannerAltitudeChangeReset'));\r
            return false;\r
        }\r
\r
        return true;\r
    }\r
\r
    function checkLandingAltitude(altitude, isSeaLevelRef, sealevel) {\r
\r
        if (altitude - (isSeaLevelRef ? sealevel * 100 : 0 ) < MAX_NEG_FW_LAND_ALT) {\r
            dialog.alert(i18n.getMessage('MissionPlannerFwLAndingAltitudeChangeReset'));\r
            return false;\r
        }\r
\r
        return true;\r
    }\r
\r
    function updateSafehomeInfo(){\r
        let freeSamehomes = FC.SAFEHOMES.getMaxSafehomeCount() - FC.SAFEHOMES.safehomeCount()\r
        $('#availableSafehomes').text(freeSamehomes + '/' + FC.SAFEHOMES.getMaxSafehomeCount());\r
    }\r
\r
\r
    function renderSafehomesOnMap() {\r
        /*\r
         * Process safehome on Map\r
         */\r
        FC.SAFEHOMES.get().forEach(safehome => {\r
            addFwApproach(safehome.getLonMap(), safehome.getLatMap(), FC.FW_APPROACH.get()[safehome.getNumber()], safehomeMarkers);\r
        });\r
        FC.SAFEHOMES.get().forEach(safehome => {\r
            addSafehomeCircles(safehome);\r
            addSafeHomeMarker(safehome);\r
        });\r
    }\r
\r
    function cleanSafehomeLayers() {\r
        for (var i in safehomeMarkers) {\r
            map.removeLayer(safehomeMarkers[i]);\r
        }\r
        safehomeMarkers = [];\r
    }\r
\r
    function getSafehomeIcon(safehome) {\r
        /*\r
         * Process Safehome Icon\r
         */\r
        return new Style({\r
            image: new Icon(({\r
                anchor: [0.5, 1],\r
                opacity: 1,\r
                scale: 0.5,\r
                src: safehome.isUsed() ? icons['icon_safehome_used'] : icons['icon_safehome']\r
            })),\r
            text: new Text(({\r
                text: String(Number(safehome.getNumber())+1),\r
                font: '12px sans-serif',\r
                offsetY: -15,\r
                offsetX: -2,\r
                fill: new Fill({\r
                    color: '#FFFFFF'\r
                }),\r
                stroke: new Stroke({\r
                    color: '#FFFFFF'\r
                }),\r
            }))\r
        });\r
    }\r
\r
    function paintApproachLine(pos1, pos2, color, layers)\r
    {\r
        var line = new LineString([fromLonLat([pos1.lon, pos1.lat]), fromLonLat([pos2.lon, pos2.lat])]);\r
\r
        var feature = new Feature({\r
            geometry: line\r
        });\r
\r
        var styles = [  new Style({\r
                stroke: new Stroke({\r
                    color: color,\r
                    width: 3,\r
                }),\r
            })\r
        ];\r
\r
        var geometry = feature.getGeometry();\r
        geometry.forEachSegment(function (start, end) {\r
            var dx = end[0] - start[0];\r
            var dy = end[1] - start[1];\r
            var rotation = Math.atan2(dy, dx);\r
\r
            styles.push(new Style({\r
              geometry: new Point(distanceOnLine(start, end, -8)),\r
              image: new RegularShape({\r
                fill: new Fill({color}),\r
                points: 3,\r
                radius: 8,\r
                rotation: -rotation,\r
                angle: Math.PI / 2 // rotate -90°\r
              })\r
            }));\r
        });\r
\r
        feature.setStyle(styles);\r
\r
        var vectorSource = new VectorSource({\r
                features: [feature]\r
        });\r
\r
\r
        var vectorLayer = new VectorLayer({\r
            source: vectorSource\r
        });\r
\r
\r
\r
        vectorLayer.kind = "approachline";\r
        vectorLayer.selection = false;\r
\r
\r
        approachLayers.push(vectorLayer);\r
\r
        approachLayers.push(vectorLayer);\r
        map.addLayer(vectorLayer);\r
        layers.push(vectorLayer);\r
\r
        return vectorLayer;\r
    }\r
\r
    function paintApproach(landCoord, approachLength, bearing, approachDirection, layers) {\r
\r
        var pos1 = calculate_new_cooridatnes(landCoord, bearing, approachLength);\r
        let direction;\r
        if (approachDirection == ApproachDirection.LEFT) {\r
            direction = wrap_360(bearing + 90);\r
        } else {\r
            direction = wrap_360(bearing - 90);\r
        }\r
\r
        var pos2 = calculate_new_cooridatnes(pos1, direction, Math.max(settings.fwLoiterRadius * 4, settings.fwApproachLength / 2));\r
\r
        paintApproachLine(landCoord, pos2, '#0025a1', layers);\r
        paintApproachLine(pos2, pos1, '#0025a1', layers);\r
        paintApproachLine(pos1, landCoord, '#f78a05', layers);\r
    }\r
\r
    function addFwApproach(lon, lat, fwApproach, layers)\r
    {\r
        if (fwApproach.getLandHeading1() != 0) {\r
            let bearing = wrap_360(Math.abs(fwApproach.getLandHeading1()) + 180);\r
            paintApproach({lat: lat, lon: lon}, settings.fwApproachLength, bearing, fwApproach.getApproachDirection(), layers);\r
        }\r
\r
        if (fwApproach.getLandHeading1() > 0) {\r
            let direction = fwApproach.getApproachDirection() == ApproachDirection.LEFT ? ApproachDirection.RIGHT : ApproachDirection.LEFT;\r
            paintApproach({lat: lat, lon: lon}, settings.fwApproachLength, fwApproach.getLandHeading1(), direction, layers);\r
        }\r
\r
        if (fwApproach.getLandHeading2() != 0) {\r
            let bearing = wrap_360(Math.abs(fwApproach.getLandHeading2()) + 180);\r
            paintApproach({lat: lat, lon: lon}, settings.fwApproachLength, bearing, fwApproach.getApproachDirection(), layers);\r
        }\r
\r
        if (fwApproach.getLandHeading2() > 0) {\r
            let direction = fwApproach.getApproachDirection() == ApproachDirection.LEFT ? ApproachDirection.RIGHT : ApproachDirection.LEFT;\r
            paintApproach({lat: lat, lon: lon}, settings.fwApproachLength, fwApproach.getLandHeading2(), direction, layers);\r
        }\r
    }\r
\r
    function addSafehomeCircles(safehome) {\r
        /*\r
         * add safehome on Map\r
         */\r
        let coord = fromLonLat([safehome.getLonMap(), safehome.getLatMap()]);\r
        var iconFeature = new Feature({\r
            geometry: new Point(coord),\r
            name: 'safehome'\r
        });\r
\r
        //iconFeature.setStyle(getSafehomeIcon(safehome, safehome.isUsed()));\r
\r
        let circleStyle = new Style({\r
            stroke: new Stroke({\r
                color: 'rgba(144, 12, 63, 0.5)',\r
                width: 3,\r
                lineDash : [10]\r
            }),\r
            // fill: new Fill({\r
                // color: 'rgba(251, 225, 155, 0.1)'\r
            // })\r
        });\r
\r
        let circleSafeStyle = new Style({\r
            stroke: new Stroke({\r
                color: 'rgba(136, 204, 62, 1)',\r
                width: 3,\r
                lineDash : [10]\r
            }),\r
            /* fill: new Fill({\r
                color: 'rgba(136, 204, 62, 0.1)'\r
            }) */\r
        });\r
\r
        var vectorLayer = new VectorLayer({\r
            source: new VectorSource({\r
                        features: [iconFeature]\r
                    }),\r
            style : function(iconFeature) {\r
                let styles = [getSafehomeIcon(safehome)];\r
                if (safehome.isUsed()) {\r
                    circleStyle.setGeometry(new Circle(iconFeature.getGeometry().getCoordinates(), getProjectedRadius(settings.maxDistSH)));\r
                    circleSafeStyle.setGeometry(new Circle(iconFeature.getGeometry().getCoordinates(), getProjectedRadius(Number(settings.safeRadiusSH))));\r
                    styles.push(circleSafeStyle);\r
                    styles.push(circleStyle);\r
                }\r
                return styles;\r
            }\r
        });\r
\r
        vectorLayer.kind = "safehome";\r
        vectorLayer.number = safehome.getNumber();\r
        vectorLayer.selection = false;\r
\r
        safehomeMarkers.push(vectorLayer);\r
        map.addLayer(vectorLayer);\r
    }\r
\r
    function addSafeHomeMarker(safehome) {\r
\r
        let coord = fromLonLat([safehome.getLonMap(), safehome.getLatMap()]);\r
        var iconFeature = new Feature({\r
            geometry: new Point(coord),\r
            name: 'safehome'\r
        });\r
\r
        var vectorLayer = new VectorLayer({\r
            source: new VectorSource({\r
                        features: [iconFeature]\r
                    }),\r
            style : function(iconFeature) {\r
                return [getSafehomeIcon(safehome)];\r
            }\r
        });\r
\r
        vectorLayer.kind = "safehome";\r
        vectorLayer.number = safehome.getNumber();\r
        vectorLayer.selection = true;\r
\r
        safehomeMarkers.push(vectorLayer);\r
        map.addLayer(vectorLayer);\r
    }\r
\r
    function getProjectedRadius(radius) {\r
        let projection = map.getView().getProjection();\r
        let resolutionAtEquator = map.getView().getResolution();\r
        let resolutionRate = resolutionAtEquator / getPointResolution(projection, resolutionAtEquator, map.getView().getCenter());\r
        let radiusProjected = (radius / METERS_PER_UNIT.m) * resolutionRate;\r
        return radiusProjected;\r
    }\r
\r
    /////////////////////////////////////////////\r
    //\r
    // Manage Geozones\r
    //\r
    /////////////////////////////////////////////\r
    function getGeozoneIcon(geozone, number) {\r
    \r
        return new Style({\r
            image: new Icon(({\r
                anchor: [0.5, 1],\r
                opacity: 1,\r
                scale: 0.5,\r
                src: geozone.getType() == GeozoneType.EXCULSIVE ? icons['icon_geozone_excl'] : icons['icon_geozone_incl']\r
            })),\r
            text: new Text(({\r
                text: String(number + 1),\r
                font: '12px sans-serif',\r
                offsetY: -15,\r
                offsetX: -2,\r
                fill: new Fill({\r
                    color: '#FFFFFF'\r
                }),\r
                stroke: new Stroke({\r
                    color: '#FFFFFF'\r
                }),\r
            }))\r
        });\r
    }\r
\r
    function addZoneVertex(zone, vertex) {\r
        \r
        let coord = fromLonLat([vertex.getLonMap(), vertex.getLatMap()]);\r
        var iconFeature = new Feature({\r
            geometry: new Point(coord),\r
            name: 'geozone'\r
        });\r
        \r
        var vectorLayer = new VectorLayer({\r
            source: new VectorSource({\r
                        features: [iconFeature]\r
                    }),\r
            style : function(iconFeature) {\r
                return [getGeozoneIcon(zone, zone.getShape() == GeozoneShapes.POLYGON ? vertex.getNumber() : zone.getNumber())];\r
\r
            }\r
        });\r
\r
        vectorLayer.kind = "geozone";\r
        vectorLayer.number = vertex.getNumber();\r
        vectorLayer.layerNumber = zone.getNumber();\r
        vectorLayer.selection = true;\r
\r
        geozoneMarkers.push(vectorLayer);\r
\r
        return vectorLayer;\r
    }\r
\r
    function paintGeozoneLine(pos1, pos2, color, number, zoneNum)\r
    {\r
        var line = new LineString([pos1, pos2]);\r
\r
        var feature = new Feature({\r
            geometry: line\r
        });\r
\r
        feature.setStyle(\r
            new Style({\r
                stroke: new Stroke({\r
                    color: color,\r
                    width: 3,\r
                }),\r
                text: new Text({\r
                    text: String(zoneNum + 1),\r
                    font: '14px sans-serif',\r
                    placement : 'line',\r
                    textBaseline: 'ideographic',\r
                    stroke: new Stroke({\r
                        color: color\r
                    }),\r
                }),\r
            }),\r
        );\r
\r
        \r
         var vectorSource = new VectorSource({\r
            features: [feature]\r
        });\r
\r
\r
        var vectorLayer = new VectorLayer({\r
            source: vectorSource\r
        });\r
\r
        vectorLayer.kind = "geozoneline";\r
        vectorLayer.selection = true;\r
        vectorLayer.number = number;\r
        vectorLayer.layerNumber = zoneNum;\r
\r
        geozoneLines.push(vectorLayer);\r
        map.addLayer(vectorLayer);\r
    }\r
\r
    function repaintGeozoneLines() {\r
        cleanGeozoneLines();\r
\r
        FC.GEOZONES.get().forEach(zone => {\r
            if (zone.getVerticesCount() != 0) {\r
                if (zone.getShape() == GeozoneShapes.CIRCULAR) {\r
                    var circleFeature = new Feature({\r
                        geometry: new Circle(fromLonLat([zone.getFirstVertex().getLonMap(), zone.getFirstVertex().getLatMap()]), getProjectedRadius(zone.getRadius() / 100)), \r
                        name: "geozoneCircle",\r
                    });\r
                    \r
                    var vectorSource = new VectorSource();\r
                    vectorSource.addFeatures([circleFeature]);\r
\r
                    var vectorLayer = new VectorLayer({\r
                        source: vectorSource,\r
                        style : [\r
                            new Style({\r
                                stroke: new Stroke({\r
                                    color: zone.getType() == GeozoneType.EXCULSIVE ? '#E62121' : '#1DBE0A',\r
                                    width: 3,\r
                                })\r
                            })\r
                        ],\r
                    });\r
\r
                    vectorLayer.kind = "geozonecircle";\r
                    vectorLayer.selection = true;\r
\r
                    geozoneLines.push(vectorLayer);\r
                    map.addLayer(vectorLayer);\r
                } else if (zone.getShape() == GeozoneShapes.POLYGON) {\r
                    var verticesCount = zone.getVerticesCount();\r
                    var prev = zone.getLastVertex();\r
                    var current;\r
                    for (let i = 0; i < verticesCount; i++) {\r
                        current = zone.getVertex(i);\r
                        let pos1 = fromLonLat([prev.getLonMap(), prev.getLatMap()]);\r
                        let pos2 = fromLonLat([current.getLonMap(), current.getLatMap()]);\r
                        paintGeozoneLine(pos1, pos2, zone.getType() == GeozoneType.EXCULSIVE ? '#E62121' : '#1DBE0A', prev.getNumber(), zone.getNumber());\r
                        prev = current;\r
                    }\r
                }\r
            }\r
        });\r
    }\r
\r
    function renderGeozonesOnMap()\r
    {\r
        cleanGeozoneLayers();\r
        if (!selectedGeozone) {\r
            cleanGeozoneLines();\r
            geozoneWarning();\r
            return;\r
        }\r
\r
        repaintGeozoneLines();\r
        FC.GEOZONES.get().forEach(zone => {\r
            if (zone.getVerticesCount() > 0) {\r
                zone.getVertices().forEach(vertex => {\r
                    map.addLayer(addZoneVertex(zone, vertex));\r
                });\r
            }\r
        });\r
        geozoneWarning();\r
    }\r
\r
    function cleanGeozoneLines() {\r
        geozoneLines.forEach(line => {\r
            map.removeLayer(line);\r
        });\r
        geozoneLines = [];\r
    }\r
\r
    function cleanGeozoneLayers() {\r
        geozoneMarkers.forEach(marker => {\r
            map.removeLayer(marker);\r
        });\r
\r
        geozoneMarkers = [];\r
    }\r
\r
    function geozoneWarning() {\r
\r
        if (!isGeozoneEnabeld) {\r
            return;\r
        }\r
\r
        if (markers.length >= 1 && geozoneMarkers.length >= 1) {\r
            $('#infoGeozoneMissionWarning').show();\r
        } else {\r
            $('#infoGeozoneMissionWarning').hide();\r
        }\r
\r
        $('#geozoneInvalidContent').empty();\r
        invalidGeoZones = false;\r
        for (var i = 0; i < FC.GEOZONES.geozoneCount(); i++) {\r
            const zone = FC.GEOZONES.at(i);\r
\r
            var reasons = []\r
            if (!zone.isCounterClockwise()) {\r
                reasons.push(i18n.getMessage("gezoneInvalidReasonNotCC"));\r
            }\r
\r
            if (zone.isComplex()) {\r
                reasons.push(i18n.getMessage("gezoneInvalidReasonComplex"));\r
            }\r
\r
            if (zone.getMaxAltitude() <= zone.getMinAltitude()) {\r
                reasons.push(i18n.getMessage("gezoneInvalidReasonMinMaxAlt"));\r
            }\r
\r
            if (reasons.length > 0) {\r
                $('#geozoneInvalidContent').append(\`<div style="display: inline-block">\${i18n.getMessage("geozone")} \${zone.getNumber() + 1}: \${reasons.join(", ")}</div><br/>\`);\r
                invalidGeoZones = true;\r
            }\r
        }\r
\r
        if (invalidGeoZones) {\r
            $('#infoGeozoneInvalid').show();\r
        } else {\r
            $('#infoGeozoneInvalid').hide();\r
        }\r
    }\r
\r
    function updateGeozoneInfo() {\r
        $('#availableGeozones').text((FC.GEOZONES.getMaxZones() - FC.GEOZONES.geozoneCount()) + '/' + FC.GEOZONES.getMaxZones());\r
        $('#availableVertices').text((FC.GEOZONES.getMaxVertices() - FC.GEOZONES.getUsedVerticesCount()) + '/' + FC.GEOZONES.getMaxVertices());\r
    }\r
\r
    function addGeozone() {\r
\r
        if (FC.GEOZONES.geozoneCount() + 1 > FC.GEOZONES.getMaxZones()) {\r
            dialog.alert(i18n.getMessage('missionGeozoneMaxZonesReached'));\r
            return;\r
        }\r
\r
        if (FC.GEOZONES.getUsedVerticesCount() + 2 > FC.GEOZONES.getMaxVertices()) {\r
            dialog.alert(i18n.getMessage('missionGeozoneMaxVerticesReached'));\r
            return;\r
        }\r
\r
        let mapCenter = map.getView().getCenter();\r
        let midLon = Math.round(toLonLat(mapCenter)[0] * 1e7);\r
        let midLat = Math.round(toLonLat(mapCenter)[1] * 1e7);        \r
        FC.GEOZONES.put(new Geozone(GeozoneType.INCLUSIVE, GeozoneShapes.CIRCULAR, 0, 10000, false, 20000, GeozoneFenceAction.NONE, [ new GeozoneVertex(0, midLat, midLon) ]));\r
\r
        selectedGeozone = FC.GEOZONES.last();\r
        renderGeozoneOptions();\r
        renderGeozonesOnMap();\r
        updateGeozoneInfo();\r
    }\r
\r
    /////////////////////////////////////////////\r
    //\r
    // Manage Take Off Home\r
    //\r
    /////////////////////////////////////////////\r
    function closeHomePanel() {\r
        $('#missionPlannerHome').hide();\r
        $('#missionPlannerElevation').hide();\r
        cleanHomeLayers();\r
    }\r
\r
    function cleanHomeLayers() {\r
        for (var i in homeMarkers) {\r
            map.removeLayer(homeMarkers[i]);\r
        }\r
        homeMarkers = [];\r
    }\r
\r
    function renderHomeTable() {\r
        /*\r
         * Process home table UI\r
         */\r
\r
        $(".home-lat").val(HOME.getLatMap()).on('change', function () {\r
            HOME.setLat(Math.round(Number($(this).val()) * 10000000));\r
            cleanHomeLayers();\r
            renderHomeOnMap();\r
        });\r
\r
        $(".home-lon").val(HOME.getLonMap()).on('change', function () {\r
            HOME.setLon(Math.round(Number($(this).val()) * 10000000));\r
            cleanHomeLayers();\r
            renderHomeOnMap();\r
        });\r
\r
        if (HOME.getLatMap() == 0 && HOME.getLonMap() == 0) {\r
            HOME.setAlt("N/A");\r
        } else {\r
            (async () => {\r
                const elevationAtHome = await HOME.getElevation(globalSettings);\r
                $('#elevationValueAtHome').text(elevationAtHome+' m');\r
                HOME.setAlt(elevationAtHome);\r
            })()\r
        }\r
    }\r
\r
\r
    function renderHomeOnMap() {\r
        /*\r
         * Process home on Map\r
         */\r
        map.addLayer(addHomeMarker(HOME));\r
    }\r
\r
    function addHomeMarker(home) {\r
        /*\r
         * add safehome on Map\r
         */\r
        let coord = fromLonLat([home.getLonMap(), home.getLatMap()]);\r
        var iconFeature = new Feature({\r
            geometry: new Point(coord),\r
            name: 'home'\r
        });\r
\r
        //iconFeature.setStyle(getSafehomeIcon(safehome, safehome.isUsed()));\r
\r
        var vectorLayer = new VectorLayer({\r
            source: new VectorSource({\r
                        features: [iconFeature]\r
                    }),\r
            style : function(iconFeature) {\r
                let styles = [getHomeIcon(home)];\r
                return styles;\r
            }\r
        });\r
\r
        vectorLayer.kind = "home";\r
        vectorLayer.number = home.getNumber();\r
        vectorLayer.selection = false;\r
\r
        homeMarkers.push(vectorLayer);\r
\r
        return vectorLayer;\r
    }\r
\r
    function getHomeIcon(home) {\r
        /*\r
         * Process Safehome Icon\r
         */\r
        return new Style({\r
            image: new Icon(({\r
                anchor: [0.5, 1],\r
                opacity: 1,\r
                scale: 0.5,\r
                src: icons['icon_home']\r
            })),\r
        });\r
    }\r
\r
    function updateHome() {\r
        renderHomeTable();\r
        cleanHomeLayers();\r
        renderHomeOnMap();\r
        plotElevation();\r
    }\r
\r
    /////////////////////////////////////////////\r
    //\r
    // Manage Multi Mission\r
    //\r
    /////////////////////////////////////////////\r
    /* Multi Mission working method:\r
     * 'multimission' waypoint collection is a repository for all multi missions.\r
     * 'mission' WP collection remains as the WP source for the map display.\r
     * All missions can be displayed on the map or only a single mission. With all missions displayed 'mission' and\r
     * 'multimission' are copies containing all missions. When a single mission is displayed 'multimission' contains all\r
     * missions except the currently displayed mission.\r
     * On update to display all missions the current dislayed mission is merged back into 'multimission' and 'mission'\r
     * updated as a copy of 'multimission'.\r
     * When all missions are displayed WP data can be viewed but mission edit is disabled.\r
     * Mission WPs can be edited only when a single mission is loaded on the map. */\r
\r
    var startWPCount = 0;\r
\r
    function renderMultimissionTable() {\r
        $('#multimissionOptionList').prop('options').length = 1;\r
        for (var i = 1; i <= multimissionCount; i++) {\r
            $('#multimissionOptionList').append($('<option>', {value: i, text: i}));\r
        }\r
        updateMultimissionState();\r
        $('#activeNissionIndex').text(1);\r
    }\r
\r
    function updateMultimissionState() {\r
        setMultimissionEditControl(false);\r
        if (!mission.isEmpty() || multimissionCount) {\r
            if ((!multimissionCount || (multimissionCount && !mission.isEmpty())) && multimissionCount < maxMultimissionCount) {\r
                $("#addMultimissionButton").removeClass('disabled');\r
            } else {\r
                $("#addMultimissionButton").addClass('disabled');\r
            }\r
            if (multimissionCount) {\r
                let totalmultimissionWPs;\r
                if (singleMissionActive()) {\r
                    totalmultimissionWPs = multimission.get().length + mission.get().length;\r
                    $("#updateMultimissionButton").removeClass('disabled');\r
                    $("#setActiveMissionButton").removeClass('disabled');\r
                    $('#missionPlannerElevation').show();\r
                } else {\r
                    $('#missionDistance').text('N/A');\r
                    totalmultimissionWPs = mission.get().length;\r
                    $("#editMission").show();\r
                    $("#updateMultimissionButton").addClass('disabled');\r
                    $("#setActiveMissionButton").addClass('disabled');\r
                    $('#missionPlannerElevation').hide();\r
                    setMultimissionEditControl(true);\r
                }\r
                $('#multimissionInfo').text(multimissionCount + ' missions (' + totalmultimissionWPs + '/' + mission.getMaxWaypoints() + ' WPs)');\r
                document.getElementById('multimissionInfo').style.color = totalmultimissionWPs > mission.getMaxWaypoints() ? "#FF0000" : "#303030";\r
            } else {\r
                $('#cancelMultimission').trigger('click');\r
                $('#multimissionInfo').text('No multi missions loaded');\r
                $("#updateMultimissionButton").addClass('disabled');\r
                $("#setActiveMissionButton").addClass('disabled');\r
            }\r
        } else {\r
            $("#addMultimissionButton").addClass('disabled');\r
            $("#setActiveMissionButton").addClass('disabled');\r
        }\r
        updateTotalInfo();\r
    }\r
\r
    // /* checks if single mission loaded on map */\r
    function singleMissionActive() {\r
        return !multimissionCount || Number($('#multimissionOptionList').val());\r
    }\r
\r
    function updateAllMultimission(missionDelete = false, newMission = false) {\r
        // flag if new MM mission empty on update\r
        let missionIsEmptyOnUpdate = mission.isEmpty() ? true : false;\r
\r
        /* copy active single mission into MM on update so MM contains all missions.\r
         * active mission may be deleted by not copying back into MM on update */\r
        var i = startWPCount;\r
        if (!missionDelete) {\r
            mission.get().forEach(function (element) {\r
                multimission.get().splice(i, 0, element);\r
                i++;\r
            });\r
        }\r
\r
        i = 0;\r
        multimission.get().forEach(function (element) {     // renumber MM WPs\r
            element.setNumber(i);\r
            i++;\r
        });\r
        multimission.update(false);\r
        // multimission.missionDisplayDebug();\r
\r
        // if new mission added no need to redraw so return\r
        if (newMission) return;\r
\r
        mission.reinit();\r
        mission.copy(multimission);\r
        mission.update(false);\r
        // mission.missionDisplayDebug();\r
\r
        /* Remove empty missions on update.\r
         * Cancel MM if only 2 MM missions loaded and one mission is empty */\r
        if (missionIsEmptyOnUpdate) {\r
            multimissionCount -= multimissionCount == 2 ? 2 : 1;\r
            if (!multimissionCount) {\r
                multimissionCount = 0;\r
                multimission.flush();\r
            }\r
            renderMultimissionTable();\r
        }\r
\r
        selectedMarker = null;\r
        clearEditForm();\r
        setView(14);\r
        refreshLayers();\r
        updateTotalInfo();\r
    }\r
\r
    /* selects single mission from MM repository */\r
    function editMultimission() {\r
        var MMCount = 0;\r
        var endWPCount = 0;\r
        var found = false;\r
        startWPCount = 0;\r
\r
        mission.get().forEach(function (element) {\r
            if (element.getEndMission() == 0xA5 && !found) {\r
                MMCount ++;\r
                endWPCount = element.getNumber();\r
                if (MMCount == Number($('#multimissionOptionList').val())) {\r
                    found = true;\r
                } else {\r
                    startWPCount = endWPCount + 1;\r
                }\r
            }\r
        });\r
\r
        mission.reinit();\r
        var tempMissionData = multimission.get().slice(startWPCount, endWPCount + 1);   // copy selected single mission from MM\r
        let i = 0;\r
        tempMissionData.forEach(function (element) {    // write mission copy to active map mission\r
            mission.put(element);\r
            mission.get()[i].setNumber(i);\r
            i++;\r
        });\r
        mission.setMaxWaypoints(multimission.getMaxWaypoints());\r
        multimission.get().splice(startWPCount, (endWPCount - startWPCount + 1))    // cut current active map mission from MM\r
\r
        mission.update();\r
        updateMultimissionState();\r
\r
        selectedMarker = null;\r
        clearEditForm();\r
        setView(14);\r
        refreshLayers();\r
        updateTotalInfo();\r
        plotElevation();\r
    }\r
\r
    /* single mission selection using WP Edit panel button */\r
    function mapSelectEditMultimission(WPNumber) {\r
        let MMCount = 1;\r
\r
        mission.get().forEach(function (element) {\r
            if (element.getEndMission() == 0xA5 && element.getNumber() < WPNumber) {\r
                MMCount ++;\r
            }\r
        });\r
        $('#multimissionOptionList').val(MMCount).trigger('change');\r
    }\r
\r
    function deleteMultimission() {\r
        updateAllMultimission(true);\r
        multimissionCount -= multimissionCount == 2 ? 2 : 1;\r
        if (!multimissionCount) {\r
            multimission.flush();\r
        }\r
        renderMultimissionTable();\r
    }\r
\r
    function addMultimission() {\r
        if (singleMissionActive() || !multimissionCount) {\r
            updateAllMultimission(false, true);\r
        }\r
        multimissionCount += !multimissionCount ? 2 : 1;\r
        renderMultimissionTable();\r
        $('#multimissionOptionList').val(multimissionCount);\r
\r
        removeAllWaypoints();\r
        startWPCount = multimission.get().length;\r
\r
        updateMultimissionState();\r
    }\r
\r
    function removeAllMultiMissionCheck() {\r
        if (!multimissionCount) {\r
            return true;\r
        } else if (singleMissionActive()) {\r
            deleteMultimission();\r
            return false;\r
        }\r
\r
        multimissionCount = 0;\r
        multimission.flush();\r
        renderMultimissionTable();\r
        return true;\r
    }\r
\r
    function fileLoadMultiMissionCheck() {\r
        if (singleMissionActive()) {\r
            return true;\r
        } else if (dialog.confirm(i18n.getMessage('confirm_overwrite_multimission_file_load_option'))) {\r
            var options = {\r
                filters: [ { name: "Mission file", extensions: ['mission'] } ]\r
            };\r
            dialog.showOpenDialog(options).then(result => {\r
                if (result.canceled) {\r
                    console.log('No file selected');\r
                    return;\r
                }\r
\r
                if (result.files.length == 1) {\r
                    loadMissionFile(result.files[0]);\r
                    multimissionCount = 0;\r
                    multimission.flush();\r
                    renderMultimissionTable();\r
                }\r
            });\r
        }\r
        return false;\r
    }\r
\r
    /* disable mission/WP edit when all missions displayed on map, true = edit disabled */\r
    function setMultimissionEditControl(enabled = true) {\r
        disableMarkerEdit = enabled;\r
        $("*", "#MPeditPoint").prop('disabled',enabled);\r
        if (enabled) {\r
            $("#addOptionsPointButton").addClass('disabled');\r
            $("#removePointButton").addClass('disabled');\r
            $("#waypointOptionsTableBody").fadeOut();\r
        } else {\r
            $("#addOptionsPointButton").removeClass('disabled');\r
            $("#removePointButton").removeClass('disabled');\r
            $("#waypointOptionsTableBody").fadeIn();\r
        }\r
    }\r
\r
    /////////////////////////////////////////////\r
    //\r
    // Manage Waypoint\r
    //\r
    /////////////////////////////////////////////\r
\r
    function removeAllWaypoints() {\r
        mission.reinit();\r
        refreshLayers();\r
        clearEditForm();\r
        updateTotalInfo();\r
        clearFilename();\r
    }\r
\r
    function addWaypointMarker(waypoint, isEdit=false) {\r
        let coord = fromLonLat([waypoint.getLonMap(), waypoint.getLatMap()]);\r
        var iconFeature = new Feature({\r
            geometry: new Point(coord),\r
            name: 'Null Island',\r
            population: 4000,\r
            rainfall: 500\r
        });\r
        iconFeature.setStyle(getWaypointIcon(waypoint, isEdit));\r
        var vectorSource = new VectorSource({\r
            features: [iconFeature]\r
        });\r
\r
        var vectorLayer = new VectorLayer({\r
            source: vectorSource\r
        });\r
\r
        vectorLayer.kind = "waypoint";\r
        vectorLayer.number = waypoint.getNumber();\r
        vectorLayer.layerNumber = waypoint.getLayerNumber();\r
\r
        markers.push(vectorLayer);\r
\r
        return vectorLayer;\r
    }\r
\r
    function getWaypointIcon(waypoint, isEdit) {\r
        var dictofPointIcon = {\r
            1:    'WP',\r
            2:    'PH',\r
            3:    'PH',\r
            5:    'POI',\r
            8:    'LDG'\r
        };\r
\r
        return new Style({\r
            image: new Icon(({\r
                anchor: [0.5, 1],\r
                opacity: 1,\r
                scale: 0.5,\r
                src: icons['icon_position' + (dictofPointIcon[waypoint.getAction()] != '' ? '_' + dictofPointIcon[waypoint.getAction()] : '') + (isEdit ? '_edit' : '')]\r
            })),\r
            text: new Text(({\r
                text: String(Number(waypoint.getLayerNumber()+1)),\r
                font: '12px sans-serif',\r
                offsetY: -15,\r
                offsetX: -2,\r
                fill: new Fill({\r
                    color: '#FFFFFF'\r
                }),\r
                stroke: new Stroke({\r
                    color: '#FFFFFF'\r
                }),\r
            }))\r
        });\r
    }\r
\r
    function repaintLine4Waypoints(mission) {\r
        let oldPos,\r
            oldAction,\r
            poiList = [],\r
            oldHeading,\r
            multiMissionWPNum = 0;\r
        let activatePoi = false;\r
        let activateHead = false;\r
        $('#missionDistance').text(0);\r
        cleanLines();\r
        mission.get().forEach(function (element) {\r
            if (!element.isAttached()) {\r
                let coord = fromLonLat([element.getLonMap(), element.getLatMap()]);\r
                if (element.getAction() == 5) {\r
                    // If action is Set_POI, increment counter of POI\r
                    poiList.push(element.getNumber());\r
                    activatePoi = true;\r
                    activateHead = false;\r
                }\r
                else {\r
                    // If classic WPs, draw standard line in-between\r
                    if (typeof oldPos !== 'undefined' && activatePoi != true && activateHead != true){\r
                        paintLine(oldPos, coord, element.getNumber());\r
                    }\r
                    // If one is POI, draw orange line in-between and modulate dashline each time a new POI is defined\r
                    else if (typeof oldPos !== 'undefined' && activatePoi == true && activateHead != true) {\r
                        if ((poiList.length % 2) == 0) {\r
                            paintLine(oldPos, coord, element.getNumber(), '#ffb725', 5);\r
                        }\r
                        else {\r
                            paintLine(oldPos, coord, element.getNumber(), '#ffb725');\r
                        }\r
                    }\r
                    // If one is SET_HEAD, draw labelled line in-between with heading value\r
                    else if (typeof oldPos !== 'undefined' && activatePoi != true && activateHead == true) {\r
                        paintLine(oldPos, coord, element.getNumber(), '#1497f1', 0, String(oldHeading)+"°");\r
                    }\r
\r
                    if (element.getEndMission() == 0xA5) {\r
                        oldPos = 'undefined';\r
                        activatePoi = false;\r
                        activateHead = false;\r
                        multiMissionWPNum = element.getNumber() + 1;\r
                    } else {\r
                        oldPos = coord;\r
                    }\r
                }\r
            }\r
            else if (element.isAttached()) {\r
                if (element.getAction() == MWNP.WPTYPE.JUMP) {\r
                    let jumpWPIndex = multiMissionWPNum + element.getP1();\r
                    let coord = fromLonLat([mission.getWaypoint(jumpWPIndex).getLonMap(), mission.getWaypoint(jumpWPIndex).getLatMap()]);\r
                    paintLine(oldPos, coord, element.getNumber(), '#e935d6', 5, "Repeat x"+(element.getP2() == -1 ? " infinite" : String(element.getP2())), false, true);\r
                }\r
                // If classic WPs is defined with a heading = -1, change Boolean for POI to false. If it is defined with a value different from -1, activate Heading boolean\r
                else if (element.getAction() == MWNP.WPTYPE.SET_HEAD) {\r
                    if (element.getP1() == -1) {\r
                        activatePoi = false;\r
                        activateHead = false;\r
                        oldHeading = 'undefined'\r
                    }\r
                    else if (typeof element.getP1() != 'undefined' && element.getP1() != -1) {\r
                        activatePoi = false;\r
                        activateHead = true;\r
                        oldHeading = String(element.getP1());\r
                    }\r
                }\r
\r
                if (element.getEndMission() == 0xA5) {\r
                    oldPos = 'undefined';\r
                    activatePoi = false;\r
                    activateHead = false;\r
                    multiMissionWPNum = element.getNumber() + 1;\r
                }\r
            }\r
            if (element.getAction() == MWNP.WPTYPE.LAND) {\r
                addFwApproach(element.getLonMap(), element.getLatMap(), FC.FW_APPROACH.get()[FC.SAFEHOMES.getMaxSafehomeCount() + element.getMultiMissionIdx()], lines);\r
            }\r
        });\r
        //reset text position\r
        if (textGeom) {\r
            textGeom.setCoordinates(map.getCoordinateFromPixel([0,0]));\r
        }\r
        let lengthMission = mission.getDistance(true);\r
\r
        if (disableMarkerEdit) {\r
            $('#missionDistance').text('N/A');\r
        } else {\r
            if (lengthMission.length >= 1) {\r
                $('#missionDistance').text(lengthMission[lengthMission.length -1].toFixed(1));\r
            } else {\r
                $('#missionDistance').text('infinite');\r
            }\r
        }\r
    }\r
\r
    function paintLine(pos1, pos2, pos2ID, color='#1497f1', lineDash=0, lineText="", selection=true, arrow=false) {\r
        var line = new LineString([pos1, pos2]);\r
\r
        var feature = new Feature({\r
            geometry: line\r
        });\r
\r
        feature.setStyle(\r
            new Style({\r
                stroke: new Stroke({\r
                    color: color,\r
                    width: 3,\r
                    lineDash: [lineDash]\r
                }),\r
                text: new Text({\r
                    text: lineText,\r
                    font: '14px sans-serif',\r
                    placement : 'line',\r
                    textBaseline: 'ideographic',\r
                    stroke: new Stroke({\r
                        color: color\r
                    }),\r
                }),\r
            }),\r
        );\r
\r
        if (arrow) {\r
            let dx = pos2[0] - pos1[0];\r
            let dy = pos2[1] - pos1[1];\r
            let rotation = Math.atan2(dx, dy);\r
            var featureArrow = new Feature({\r
                geometry: new Point([pos1[0]+dx/2, pos1[1]+dy/2])\r
            });\r
            featureArrow.setStyle(\r
                new Style({\r
                    image: new Icon({\r
                        src: icons['icon_arrow'],\r
                        scale: 0.3,\r
                        anchor: [0.5, 0.5],\r
                        rotateWithView: true,\r
                        rotation: rotation,\r
                    }),\r
                })\r
            );\r
        }\r
\r
        if (arrow) {\r
            var vectorSource = new VectorSource({\r
                features: [feature, featureArrow]\r
            });\r
        }\r
        else {\r
            var vectorSource = new VectorSource({\r
                features: [feature]\r
            });\r
        }\r
\r
        var vectorLayer = new VectorLayer({\r
            source: vectorSource\r
        });\r
\r
        vectorLayer.kind = "line";\r
        vectorLayer.selection = selection;\r
        vectorLayer.number = pos2ID;\r
\r
        lines.push(vectorLayer);\r
\r
        map.addLayer(vectorLayer);\r
    }\r
\r
    function refreshLayers() {\r
        cleanLayers();\r
        redrawLayers();\r
    }\r
\r
    function cleanLayers() {\r
        for (var i in lines) {\r
            map.removeLayer(lines[i]);\r
        }\r
        lines = [];\r
\r
        for (var i in markers) {\r
            map.removeLayer(markers[i]);\r
        }\r
        markers = [];\r
    }\r
\r
    function cleanLines() {\r
        for (var i in lines) {\r
            map.removeLayer(lines[i]);\r
        }\r
        lines = [];\r
    }\r
\r
    function redrawLayers() {\r
        if (!mission.isEmpty()) {\r
            repaintLine4Waypoints(mission);\r
            mission.get().forEach(function (element) {\r
                if (!element.isAttached()) {\r
                    map.addLayer(addWaypointMarker(element));\r
                }\r
            });\r
\r
        }\r
\r
        if (!isOffline) geozoneWarning();\r
    }\r
\r
    function redrawLayer() {\r
        repaintLine4Waypoints(mission);\r
        if (selectedFeature && selectedMarker) {\r
            selectedFeature.setStyle(getWaypointIcon(selectedMarker, true));\r
        }\r
    }\r
\r
    function renderSafeHomeOptions()  {\r
        if (selectedSafehome && selectedFwApproachSh) {\r
\r
            lockShExclHeading = true;\r
            if (!$('#missionPlannerSafehome').is(':visible')) {\r
                $('#missionPlannerSafehome').fadeIn(300);\r
            }\r
\r
            $('#SafehomeContentBox').show();\r
\r
            if (selectedFwApproachSh.getLandHeading1() == 0 && selectedFwApproachSh.getLandHeading1() == 0 && selectedFwApproachSh.getApproachAltAsl() == 0 && selectedFwApproachSh.getLandAltAsl() == 0) {\r
                selectedFwApproachSh.setApproachAltAsl(settings.fwApproachAlt * 100);\r
                selectedFwApproachSh.setLandAltAsl(settings.fwLandAlt * 100);\r
            }\r
\r
            if (selectedFwApproachSh.getElevation() == 0) {\r
                (async () => {\r
                    const elevation = await selectedFwApproachSh.getElevationFromServer(selectedSafehome.getLonMap(), selectedSafehome.getLatMap(), globalSettings) * 100;\r
                    selectedFwApproachSh.setElevation(elevation);\r
                    $('#safehomeElevation').text(selectedFwApproachSh.getElevation() / 100 + " m");\r
                })();\r
            }\r
\r
            const $safehomeBox = $safehomeContentBox.find('.missionPlannerSafehomeBox:last-child');\r
            $safehomeBox.find('.spacer_box_title').text(i18n.getMessage('safehomeEdit') + ' '  + (selectedSafehome.getNumber() + 1));\r
\r
            $('#safehomeLatitude').val(selectedSafehome.getLatMap());\r
            $('#safehomeLongitude').val(selectedSafehome.getLonMap());\r
            changeSwitch($('#safehomeSeaLevelRef'), selectedFwApproachSh.getIsSeaLevelRef());\r
            $('#safehomeApproachAlt').val(selectedFwApproachSh.getApproachAltAsl());\r
            $('#safehomeLandAlt').val(selectedFwApproachSh.getLandAltAsl());\r
            $('#geozoneApproachDirection').val(selectedFwApproachSh.getApproachDirection());\r
            $('#safehomeLandHeading1').val(Math.abs(selectedFwApproachSh.getLandHeading1()));\r
            changeSwitch($('#safehomeLandHeading1Excl'), selectedFwApproachSh.getLandHeading1() < 0);\r
            $('#safehomeLandHeading2').val(Math.abs(selectedFwApproachSh.getLandHeading2()));\r
            changeSwitch($('#safehomeLandHeading2Excl'), selectedFwApproachSh.getLandHeading2() < 0);\r
            $('#safehomeLandAltM').text(selectedFwApproachSh.getLandAltAsl() / 100 + " m");\r
            $('#safehomeApproachAltM').text(selectedFwApproachSh.getApproachAltAsl() / 100 + " m");\r
            lockShExclHeading = false;\r
        } else {\r
            $('#SafehomeContentBox').hide();\r
        }\r
    }\r
\r
    function renderGeozoneOptions() {\r
        if (selectedGeozone) {\r
            if (!$('#missionPlannerGeozones').is(':visible')) {\r
                $('#missionPlannerGeozones').fadeIn(300);\r
            }\r
\r
            $('#geozoneContentBox').show();\r
            const $geozonContent = $geozoneContent.find('.missionPlannerGeozone:last-child');\r
            $geozonContent.find('.spacer_box_title').text(i18n.getMessage('missionGeozoneEdit', selectedGeozone.getNumber() + 1));\r
\r
            $('#geozoneShape').val(selectedGeozone.getShape());\r
            $('#geozoneType').val(selectedGeozone.getType());\r
            $('#geozoneMinAlt').val(selectedGeozone.getMinAltitude());\r
            $('#geozoneMaxAlt').val(selectedGeozone.getMaxAltitude());\r
            $('#geozoneMinAltM').text(selectedGeozone.getMinAltitude() / 100 + " m");\r
            $('#geozoneMaxAltM').text(selectedGeozone.getMaxAltitude()  / 100 + " m");\r
            changeSwitch($('#geozoneSeaLevelRef'), selectedGeozone.getSealevelRef());\r
            $('#geozoneAction').val(selectedGeozone.getFenceAction());\r
            $('#geozoneRadius').val(selectedGeozone.getRadius);\r
            if (selectedGeozone.getShape() == GeozoneShapes.CIRCULAR) {\r
                $('#geozoneRadius').prop('disabled', false);\r
            } else {\r
                $('#geozoneRadius').prop('disabled', true);\r
            }\r
\r
            let $verticesTable = $('#geozoneVerticesTableBody');\r
            $verticesTable.empty();\r
            selectedGeozone.getVertices().forEach(vertex => {\r
                $verticesTable.append('\\\r
                    <tr> \\\r
                        <td> \\\r
                            <div class="btnTable btnTableIcon"> \\\r
                                <a class="ic_removeAll" id="removeVertex" href="#"  title="Remove"></a> \\\r
                            </div>\\\r
                        </td> \\\r
                        <td> \\\r
                            <span class="vertexNumber"></span> \\\r
                        </td> \\\r
                        <td> \\\r
                            <input type="number" step="0.0000001" class="vertexLat"/> \\\r
                        </td> \\\r
                        <td> \\\r
                            <input type="number" step="0.0000001" class="vertexLon"/> \\\r
                        </td> \\\r
                    </tr> \\\r
                ');\r
                const $row = $verticesTable.find('tr:last');\r
                $row.find('.vertexNumber').text(vertex.getNumber() + 1);\r
\r
                $row.find('.vertexLat')\r
                    .val((vertex.getLatMap())\r
                    .toLocaleString(['en-US'], {minimumFractionDigits: 7}))\r
                    .on('change', event => {\r
                        const lat = $(event.currentTarget).val();\r
                        if (isNaN(lat) || lat < -90 || lat > 90) {\r
                            dialog.alert(i18n.getMessage("geozoneInvalidLat"));\r
                            $(event.currentTarget).val(vertex.getLatMap());\r
                            return;\r
                        }\r
                        vertex.setLat(lat * 1e7);\r
                        renderGeozoneOptions();\r
                        renderGeozonesOnMap();\r
                        updateGeozoneInfo();\r
\r
                });\r
\r
                $row.find('.vertexLon')\r
                    .val((vertex.getLonMap())\r
                    .toLocaleString(['en-US'], {minimumFractionDigits: 7}))\r
                    .on('change', event => {\r
                        const lat = $(event.currentTarget).val();\r
                        if (isNaN(lat) || lat < -180 || lat > 180) {\r
                            dialog.alert(i18n.getMessage("geozoneInvalidLon"));\r
                            $(event.currentTarget).val(vertex.getLonMap());\r
                            return;\r
                        }\r
                        vertex.setLon(lat * 1e7);\r
                        renderGeozoneOptions();\r
                        renderGeozonesOnMap();\r
                        updateGeozoneInfo();\r
                });\r
\r
                $row.find('#removeVertex').on('click', event => {\r
                    if (selectedGeozone.getVerticesCount() > 3) {\r
                        selectedGeozone.dropVertex(vertex.getNumber());\r
                        renderGeozoneOptions();\r
                        renderGeozonesOnMap();\r
                        updateGeozoneInfo();\r
                    }\r
                });\r
            });\r
            geozoneWarning();\r
        } else  {\r
            $('#geozoneContentBox').hide();\r
        }\r
    }\r
\r
    function renderWaypointOptionsTable(waypoint) {\r
        /*\r
         * Process Waypoint Options table UI\r
         */\r
        $waypointOptionsTableBody.empty();\r
        mission.getAttachedFromWaypoint(waypoint).forEach(function (element) {\r
            $waypointOptionsTableBody.append('\\\r
                <tr>\\\r
                <td><div id="deleteOptionsPoint" class="btnTable btnTableIcon btnTable-danger"> \\\r
                        <a class="ic_cancel" data-role="waypointOptions-delete" href="#" style="float: center" title="Delete"></a> \\\r
                    </div>\\\r
                </td> \\\r
                <td><span class="waypointOptions-number"/></td>\\\r
                <td><select class="waypointOptions-action"></select></td>\\\r
                <td><input type="number" class="waypointOptions-p1" /></td>\\\r
                <td><input type="number" class="waypointOptions-p2" /></td>\\\r
                </tr>\\\r
            ');\r
\r
            const $row = $waypointOptionsTableBody.find('tr:last');\r
\r
            for (var i = 1; i <= 3; i++) {\r
                if (dictOfLabelParameterPoint[element.getAction()]['parameter'+String(i)] != '') {\r
                    $row.find(".waypointOptions-p"+String(i)).prop("disabled", false);\r
                    $row.find(".waypointOptions-p"+String(i)).prop("title", dictOfLabelParameterPoint[element.getAction()]['parameter'+String(i)]);\r
                }\r
                else {\r
                    $row.find(".waypointOptions-p"+String(i)).prop("disabled", true);\r
                    $row.find(".waypointOptions-p"+String(i)).prop("title", "");\r
                }\r
            }\r
\r
            GUI.fillSelect($row.find(".waypointOptions-action"), waypointOptions, waypointOptions.indexOf(MWNP.WPTYPE.REV[element.getAction()]));\r
\r
            $row.find(".waypointOptions-action").val(waypointOptions.indexOf(MWNP.WPTYPE.REV[element.getAction()])).on('change', function () {\r
                element.setAction(MWNP.WPTYPE[waypointOptions[$(this).val()]]);\r
                let P1Value = 0;\r
                if (waypointOptions[$(this).val()] == "JUMP") {\r
                    P1Value = 1;\r
                } else if (waypointOptions[$(this).val()] == "RTH" && !isOffline) {\r
                    if (FC.isMultirotor()) P1Value = 1;\r
                }\r
                $row.find(".waypointOptions-p1").val(P1Value);\r
                element.setP1(P1Value);\r
\r
                for (var i = 1; i <= 3; i++) {\r
                    if (dictOfLabelParameterPoint[element.getAction()]['parameter'+String(i)] != '') {\r
                        $row.find(".waypointOptions-p"+String(i)).prop("disabled", false);\r
                        $row.find(".waypointOptions-p"+String(i)).prop("title", dictOfLabelParameterPoint[element.getAction()]['parameter'+String(i)]);\r
                    }\r
                    else {\r
                        $row.find(".waypointOptions-p"+String(i)).prop("disabled", true);\r
                        $row.find(".waypointOptions-p"+String(i)).prop("title", "");\r
                    }\r
                }\r
                mission.updateWaypoint(element);\r
                cleanLines();\r
                redrawLayer();\r
            });\r
\r
            $row.find(".waypointOptions-number").text(element.getAttachedNumber()+1);\r
\r
            $row.find(".waypointOptions-p1").val((MWNP.WPTYPE.REV[element.getAction()] == "JUMP" ? mission.convertWaypointToJumpNumber(element.getP1()) + 1 : element.getP1())).on('change', function () {\r
                if (MWNP.WPTYPE.REV[element.getAction()] == "SET_HEAD") {\r
                    if ($(this).val() >= 360 || ($(this).val() < 0 && $(this).val() != -1))\r
                    {\r
                      $(this).val(-1);\r
                      dialog.alert(i18n.getMessage('MissionPlannerHeadSettingsCheck'));\r
                    }\r
                }\r
                else if (MWNP.WPTYPE.REV[element.getAction()] == "RTH") {\r
                    if ($(this).val() != 0 && $(this).val() != 1)\r
                    {\r
                      $(this).val(0);\r
                      dialog.alert(i18n.getMessage('MissionPlannerRTHSettingsCheck'));\r
                    }\r
                }\r
                else if (MWNP.WPTYPE.REV[element.getAction()] == "JUMP") {\r
                    if ($(this).val() > mission.getNonAttachedList().length || $(this).val() < 1)\r
                    {\r
                      $(this).val(1);\r
                      GUI.alert(i18n.getMessage('MissionPlannerJumpSettingsCheck'));\r
                    }\r
                    else if (mission.getPoiList().length != 0 && mission.getPoiList()) {\r
                        if (mission.getPoiList().includes(mission.convertJumpNumberToWaypoint(Number($(this).val())-1))) {\r
                            $(this).val(1);\r
                            dialog.alert(i18n.getMessage('MissionPlannerJump3SettingsCheck'));\r
                        }\r
                    }\r
                }\r
                element.setP1((MWNP.WPTYPE.REV[element.getAction()] == "JUMP" ? mission.convertJumpNumberToWaypoint(Number($(this).val())-1) : Number($(this).val())));\r
                mission.updateWaypoint(element);\r
                cleanLines();\r
                redrawLayer();\r
            });\r
\r
            $row.find(".waypointOptions-p2").val(element.getP2()).on('change', function () {\r
                if (MWNP.WPTYPE.REV[element.getAction()] == "JUMP") {\r
                    if ($(this).val() > 10 || ($(this).val() < 0 && $(this).val() != -1))\r
                    {\r
                      $(this).val(0);\r
                      dialog.alert(i18n.getMessage('MissionPlannerJump2SettingsCheck'));\r
                    }\r
                }\r
                element.setP2(Number($(this).val()));\r
                mission.updateWaypoint(element);\r
                cleanLines();\r
                redrawLayer();\r
            });\r
\r
            $row.find("[data-role='waypointOptions-delete']").attr("data-index", element.getAttachedNumber()+1);\r
\r
        });\r
        GUI.switchery();\r
        i18n.localize();;\r
        return waypoint;\r
    }\r
\r
    function setView(zoom) {\r
        var coord = fromLonLat([mission.getWaypoint(0).getLonMap(), mission.getWaypoint(0).getLatMap()]);\r
        map.getView().setCenter(coord);\r
        map.getView().setZoom(zoom);\r
    }\r
\r
    /////////////////////////////////////////////\r
    //\r
    // Manage Map construction\r
    //\r
    /////////////////////////////////////////////\r
    function initMap() {\r
        var app = {};\r
\r
        //////////////////////////////////////////////////////////////////////////////////////////////\r
        //      Drag behavior definition\r
        //////////////////////////////////////////////////////////////////////////////////////////////\r
\r
        class Drag extends PointerInteraction {\r
            constructor() {\r
                super ({\r
                    handleDownEvent: (evt) => app.handleDownEvent(evt),\r
                    handleDragEvent: (evt) => app.handleDragEvent(evt),\r
                    handleMoveEvent: (evt) => app.handleMoveEvent(evt),\r
                    handleUpEvent: (evt) => app.handleUpEvent(evt)\r
                });\r
\r
                this.coordinate_ = null;\r
                this.cursor_ = 'pointer';\r
                this.feature_ = null;\r
                this.previousCursor_ = undefined;\r
            }\r
        }\r
\r
        app.ConvertCentimetersToMeters = function (val) {\r
            return parseInt(val) / 100;\r
        };\r
\r
        class PlannerSettingsControl extends Control {\r
            \r
            constructor(opt_options) {\r
                var options = opt_options || {};\r
                var button = document.createElement('button');\r
\r
                button.innerHTML = ' ';\r
                button.style = \`background: url("\${icons['settings_white']}") no-repeat 1px -1px;background-color: rgba(0,60,136,.5);\`;\r
                \r
\r
                var handleShowSettings = function () {\r
                    $('#missionPlannerSettings').fadeIn(300);\r
                };\r
\r
                button.addEventListener('click', handleShowSettings, false);\r
                button.addEventListener('touchstart', handleShowSettings, false);\r
\r
                var element = document.createElement('div');\r
                element.className = 'mission-control-settings ol-unselectable ol-control';\r
                element.appendChild(button);\r
                element.title = 'MP Settings';\r
\r
                super({\r
                    element: element,\r
                    target: options.target\r
                })\r
            }\r
        };\r
\r
        class PlannerSafehomeControl extends Control {\r
            \r
            constructor(opt_options) {\r
                var options = opt_options || {};\r
                var button = document.createElement('button');\r
\r
                button.innerHTML = ' ';\r
                button.style = \`background: url("\${icons['icon_safehome_white']}") no-repeat 1px -1px;background-color: rgba(0,60,136,.5);\`;\r
                \r
                var handleShowSafehome = function () {\r
                    $('#missionPlannerSafehome').fadeIn(300);\r
                    cleanSafehomeLayers();\r
                    renderSafehomesOnMap();\r
                    $('#safeHomeMaxDistance').text(settings.maxDistSH);\r
                    $('#SafeHomeSafeDistance').text(settings.safeRadiusSH);\r
                };\r
\r
                button.addEventListener('click', handleShowSafehome, false);\r
                button.addEventListener('touchstart', handleShowSafehome, false);\r
\r
                var element = document.createElement('div');\r
                element.className = 'mission-control-safehome ol-unselectable ol-control';\r
                element.appendChild(button);\r
                element.title = 'MP Safehome';\r
\r
                super({\r
                    element: element,\r
                    target: options.target\r
                });\r
            }\r
        };\r
\r
        class GeozonesControl extends Control {\r
            \r
            constructor(opt_options) {\r
                var options = opt_options || {};\r
                var button = document.createElement('button');\r
\r
                button.innerHTML = ' ';\r
                button.style = \`background: url("\${icons['icon_geozone_white']}") no-repeat 1px -1px;background-color: rgba(0,60,136,.5);\`;\r
                \r
                var handleShowGeozoneSettings = function () {\r
                    $('#missionPlannerGeozones').fadeIn(300);\r
                    if (!selectedGeozone) {\r
                        selectedGeozone = FC.GEOZONES.first();\r
                    } \r
                    renderGeozoneOptions();\r
                    renderGeozonesOnMap();\r
                };\r
\r
                button.addEventListener('click', handleShowGeozoneSettings, false);\r
                button.addEventListener('touchstart', handleShowGeozoneSettings, false);\r
\r
                var element = document.createElement('div');\r
                element.className = 'geozone-settings ol-unselectable ol-control';\r
                element.appendChild(button);\r
                element.title = 'Geozone';\r
\r
                super({\r
                    element: element,\r
                    target: options.target\r
                });\r
            }\r
        };\r
\r
        class PlannerElevationControl extends Control {\r
            \r
            constructor(opt_options) {\r
                var options = opt_options || {};\r
                var button = document.createElement('button');\r
\r
                button.innerHTML = ' ';\r
                button.style = \`background: url("\${icons['icon_elevation_white']}") no-repeat 1px -1px;background-color: rgba(0,60,136,.5);\`;\r
\r
                var handleShowSettings = function () {\r
                    $('#missionPlannerHome').fadeIn(300);\r
                    cleanHomeLayers();\r
                    renderHomeTable();\r
                    renderHomeOnMap();\r
                    $('#missionPlannerElevation').fadeIn(300);\r
                    plotElevation();\r
                };\r
\r
                button.addEventListener('click', handleShowSettings, false);\r
                button.addEventListener('touchstart', handleShowSettings, false);\r
\r
                var element = document.createElement('div');\r
                element.className = 'mission-control-elevation ol-unselectable ol-control';\r
                element.appendChild(button);\r
                element.title = 'MP Elevation';\r
\r
                super({\r
                    element: element,\r
                    target: options.target\r
                });\r
            }\r
        };\r
\r
        class PlannerMultiMissionControl extends Control {\r
\r
            constructor(opt_options) {\r
                var options = opt_options || {};\r
                var button = document.createElement('button');\r
\r
                button.innerHTML = ' ';\r
                button.style = \`background: url("\${icons['icon_multimission_white']}") no-repeat 1px -1px;background-color: rgba(0,60,136,.5);\`;\r
\r
                var handleShowSettings = function () {\r
                    $('#missionPlannerMultiMission').fadeIn(300);\r
                };\r
\r
                button.addEventListener('click', handleShowSettings, false);\r
                button.addEventListener('touchstart', handleShowSettings, false);\r
\r
                var element = document.createElement('div');\r
                element.className = 'mission-control-multimission ol-unselectable ol-control';\r
                element.appendChild(button);\r
                element.title = 'MP MultiMission';\r
\r
                super({\r
                    element: element,\r
                    target: options.target\r
                });\r
            }\r
        };\r
\r
        /**\r
         * @param {ol.MapBrowserEvent} evt Map browser event.\r
         * @return {boolean} \`true\` to start the drag sequence.\r
         */\r
        app.handleDownEvent = function (evt) {\r
            if (disableMarkerEdit) return false;\r
\r
            var map = evt.map;\r
\r
            var feature = map.forEachFeatureAtPixel(evt.pixel,\r
                function (feature, layer) {\r
                    return feature;\r
                });\r
\r
            tempMarker = map.forEachFeatureAtPixel(evt.pixel,\r
                function (feature, layer) {\r
                    return layer;\r
                });\r
\r
            if (feature) {\r
                this.coordinate_ = evt.coordinate;\r
                this.feature_ = feature;\r
                this.layer_ = tempMarker;\r
            }\r
\r
            return !!feature;\r
        };\r
\r
        /**\r
         * @param {ol.MapBrowserEvent} evt Map browser event.\r
         */\r
        app.handleDragEvent = function (evt) {\r
            \r
            if (tempMarker.kind == "safehomecircle" || tempMarker.kind == "geozonecircle") {\r
                return;\r
            }\r
\r
            var map = evt.map;\r
\r
            var feature = map.forEachFeatureAtPixel(evt.pixel,\r
                function (feature, layer) {\r
                    return feature;\r
                });\r
\r
            var deltaX = evt.coordinate[0] - this.coordinate_[0];\r
            var deltaY = evt.coordinate[1] - this.coordinate_[1];\r
\r
            var geometry = /** @type {ol.geom.SimpleGeometry} */\r
                (this.feature_.getGeometry());\r
            if (tempMarker.kind == "waypoint" || tempMarker.kind == "safehome" || tempMarker.kind == "home" || tempMarker.kind == "geozone") {\r
                geometry.translate(deltaX, deltaY);\r
                this.coordinate_[0] = evt.coordinate[0];\r
                this.coordinate_[1] = evt.coordinate[1];\r
            }\r
\r
            let coord = toLonLat(geometry.getCoordinates());\r
            if (tempMarker.kind == "waypoint") {\r
                let tempWp = mission.getWaypoint(tempMarker.number);\r
                tempWp.setLon(Math.round(coord[0] * 10000000));\r
                tempWp.setLat(Math.round(coord[1] * 10000000));\r
                if (selectedMarker != null && tempMarker.number == selectedMarker.getLayerNumber()) {\r
                    $('#pointLon').val(Math.round(coord[0] * 10000000) / 10000000);\r
                    $('#pointLat').val(Math.round(coord[1] * 10000000) / 10000000);\r
                }\r
                mission.updateWaypoint(tempWp);\r
                repaintLine4Waypoints(mission);\r
            }\r
            else if (tempMarker.kind == "safehome") {\r
                let tmpSafehome = FC.SAFEHOMES.get()[tempMarker.number];\r
                tmpSafehome.setLon(Math.round(coord[0] * 1e7));\r
                tmpSafehome.setLat(Math.round(coord[1] * 1e7));\r
\r
                $('#safeHomeLongitude').val(Math.round(coord[0] * 1e7));\r
                $('#safeHomeLatitude').val(Math.round(coord[1] * 1e7));\r
                updateSelectedShAndFwAp(tempMarker.number);\r
                renderSafeHomeOptions();\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
            }\r
            else if (tempMarker.kind == "home") {\r
                HOME.setLon(Math.round(coord[0] * 10000000));\r
                HOME.setLat(Math.round(coord[1] * 10000000));\r
                $('.home-lon').val(Math.round(coord[0] * 10000000) / 10000000);\r
                $('.home-lat').val(Math.round(coord[1] * 10000000) / 10000000);\r
            } else if (tempMarker.kind == "geozone") {\r
                let tmpVertex = FC.GEOZONES.at(tempMarker.layerNumber).getVertex(tempMarker.number);\r
                tmpVertex.setLon(Math.round(coord[0] * 1e7));\r
                tmpVertex.setLat(Math.round(coord[1] * 1e7));\r
                //GEOZONES.updateGeozone(tmpVertex);\r
                let tableBody = $($geozoneContent.find('.missionPlannerGeozone').get(tempMarker.layerNumber)).find('#geozoneVerticesTableBody');\r
                tableBody.find('tr:nth-child(' + String(tempMarker.number + 1) + ') > td > .vertexLon').val(Math.round(coord[0] * 1e7) / 1e7);\r
                tableBody.find('tr:nth-child(' + String(tempMarker.number + 1) + ') > td > .vertexLat').val(Math.round(coord[1] * 1e7) / 1e7);\r
                selectedGeozone = FC.GEOZONES.at(tempMarker.layerNumber);\r
                renderGeozoneOptions();\r
                renderGeozonesOnMap();\r
                updateGeozoneInfo();\r
            }\r
        };\r
\r
        /**\r
         * @param {ol.MapBrowserEvent} evt Event.\r
         */\r
        app.handleMoveEvent = function (evt) {\r
            if (this.cursor_) {\r
                var map = evt.map;\r
                var feature = map.forEachFeatureAtPixel(evt.pixel,\r
                    function (feature, layer) {\r
                        return feature;\r
                    });\r
                var element = evt.map.getTargetElement();\r
                if (feature && feature.name != "circleFeature" && feature.name != "circleSafeFeature") {\r
                    if (element.style.cursor != this.cursor_) {\r
                        this.previousCursor_ = element.style.cursor;\r
                        element.style.cursor = this.cursor_;\r
                    }\r
                } else if (this.previousCursor_ !== undefined) {\r
                    element.style.cursor = this.previousCursor_;\r
                    this.previousCursor_ = undefined;\r
                }\r
            }\r
        };\r
\r
        /**\r
         * @param {ol.MapBrowserEvent} evt Map browser event.\r
         * @return {boolean} \`false\` to stop the drag sequence.\r
         */\r
        app.handleUpEvent = function (evt) {\r
            if (tempMarker.kind == "waypoint") {\r
                if (selectedMarker != null && tempMarker.number == selectedMarker.getLayerNumber()) {\r
                    (async () => {\r
                        const elevationAtWP = await mission.getWaypoint(tempMarker.number).getElevation(globalSettings);\r
                        $('#elevationValueAtWP').text(elevationAtWP);\r
                        const returnAltitude = checkAltElevSanity(false, mission.getWaypoint(tempMarker.number).getAlt(), elevationAtWP, mission.getWaypoint(tempMarker.number).getP3());\r
                        mission.getWaypoint(tempMarker.number).setAlt(returnAltitude);\r
\r
                        if (mission.getWaypoint(tempMarker.number).getAction() == MWNP.WPTYPE.LAND) {\r
                            let approach = FC.FW_APPROACH.get()[FC.SAFEHOMES.getMaxSafehomeCount() + mission.getWaypoint(tempMarker.number).getMultiMissionIdx()];\r
                            if (approach.getIsSeaLevelRef()) {\r
                                if (approach.getElevation() != 0) {\r
                                    approach.setApproachAltAsl(approach.getApproachAltAsl() - approach.getElevation() + elevationAtWP * 100);\r
                                    approach.setLandAltAsl(approach.getLandAltAsl() - approach.getElevation() + elevationAtWP * 100);\r
                                }\r
                                approach.setElevation(elevationAtWP * 100);\r
                                $('#wpApproachAlt').val(approach.getApproachAltAsl());\r
                                $('#wpLandAlt').val(approach.getLandAltAsl);\r
                                $('#wpLandAltM').text(approach.getLandAltAsl() / 100 + " m");\r
                                $('#wpApproachAltM').text(approach.getApproachAltAsl() / 100 + " m");\r
                            }\r
                        }\r
\r
                        plotElevation();\r
                    })()\r
                } else {\r
                    // Update elevation chart even for non-selected waypoints\r
                    plotElevation();\r
                }\r
            }\r
            else if (tempMarker.kind == "home" ) {\r
                (async () => {\r
                    const elevationAtHome = await HOME.getElevation(globalSettings);\r
                    $('#elevationValueAtHome').text(elevationAtHome+' m');\r
                    HOME.setAlt(elevationAtHome);\r
                    plotElevation();\r
                })()\r
            }\r
            else if (tempMarker.kind == "safehome") {\r
                (async () => {\r
                    let approach = FC.FW_APPROACH.get()[tempMarker.number];\r
                    let safehome = FC.SAFEHOMES.get()[tempMarker.number];\r
                    const elevation = await approach.getElevationFromServer(safehome.getLonMap(), safehome.getLatMap(), globalSettings) * 100;\r
                    $('#safehomeElevation').text(elevation / 100 + " m");\r
                    if (approach.getIsSeaLevelRef()) {\r
                        if (approach.getElevation() != 0) {\r
                            approach.setApproachAltAsl(approach.getApproachAltAsl() - approach.getElevation() + elevation);\r
                            approach.setLandAltAsl(approach.getLandAltAsl() - approach.getElevation() + elevation);\r
                        }\r
                        approach.setElevation(elevation);\r
                    }\r
                    renderSafeHomeOptions();\r
                })()\r
            }\r
            this.coordinate_ = null;\r
            this.feature_ = null;\r
            return false;\r
        };\r
\r
        var lat = (FC.GPS_DATA ? (FC.GPS_DATA.lat / 10000000) : 0);\r
        var lon = (FC.GPS_DATA ? (FC.GPS_DATA.lon / 10000000) : 0);\r
\r
        let mapLayers = [];\r
        let control_list;\r
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
        } else if ( globalSettings.mapProviderType == 'mapproxy' ) {\r
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
        if (CONFIGURATOR.connectionValid) {\r
            control_list = [\r
                new PlannerSettingsControl(),\r
                new PlannerMultiMissionControl(),\r
                new PlannerSafehomeControl(),\r
                new PlannerElevationControl(),\r
            ]\r
\r
            if (isGeozoneEnabeld) {\r
                control_list.push(new GeozonesControl());\r
            }\r
        }\r
        else {\r
            control_list = [\r
                new PlannerSettingsControl(),\r
                new PlannerMultiMissionControl(),\r
                new PlannerElevationControl(),\r
                //new app.PlannerSafehomeControl() // TO COMMENT FOR RELEASE : DECOMMENT FOR DEBUG\r
            ]\r
        }\r
\r
        //////////////////////////////////////////////////////////////////////////////////////////////\r
        // Map object definition\r
        //////////////////////////////////////////////////////////////////////////////////////////////\r
        map = new Map({\r
            controls: defaultControls({\r
                attributionOptions: {\r
                    collapsible: false\r
                }\r
            }).extend(control_list),\r
            interactions: defaultInteractions().extend([new Drag()]),\r
            layers: mapLayers,\r
            target: 'missionMap',\r
            view: new View({\r
                center: fromLonLat([lon, lat]),\r
                zoom: 2\r
            })\r
        });\r
\r
        //////////////////////////////////////////////////////////////////////////\r
        // Set the attribute link to open on an external browser window, so\r
        // it doesn't interfere with the configurator.\r
        //////////////////////////////////////////////////////////////////////////\r
        setTimeout(function() {\r
            $('.ol-attribution a').attr('target', '_blank');\r
        }, 100);\r
        //////////////////////////////////////////////////////////////////////////\r
        // save map view settings when user moves it\r
        //////////////////////////////////////////////////////////////////////////\r
        map.on('moveend', function (evt) {\r
            bridge.storeSet('missionPlannerLastValues', {\r
                center: toLonLat(map.getView().getCenter()),\r
                zoom: map.getView().getZoom()\r
            });\r
        });\r
        //////////////////////////////////////////////////////////////////////////\r
        // load map view settings on startup\r
        //////////////////////////////////////////////////////////////////////////\r
        const missionPlannerLastValues = bridge.storeGet('missionPlannerLastValues', false);\r
        if (missionPlannerLastValues && missionPlannerLastValues.zoom && missionPlannerLastValues.center) {\r
            map.getView().setCenter(fromLonLat(missionPlannerLastValues.center));\r
            map.getView().setZoom(missionPlannerLastValues.zoom);\r
        }         \r
\r
        //////////////////////////////////////////////////////////////////////////\r
        // Map on-click behavior definition\r
        //////////////////////////////////////////////////////////////////////////\r
        map.on('click', function (evt) {\r
            var tempSelectedMarkerIndex = null;\r
            if (selectedMarker != null && selectedFeature != null) {\r
                tempSelectedMarkerIndex = selectedMarker.getLayerNumber();\r
                try {\r
                    selectedFeature.setStyle(getWaypointIcon(selectedMarker, false));\r
                    selectedMarker = null;\r
                    selectedFeature = null;\r
                    tempMarker = null;\r
                    clearEditForm();\r
                } catch (e) {\r
                    console.log(e);\r
                    GUI.log(i18n.getMessage('notAWAYPOINT'));\r
                }\r
            }\r
            selectedFeature = map.forEachFeatureAtPixel(evt.pixel,\r
                function (feature, layer) {\r
                    return feature;\r
                });\r
            tempMarker = map.forEachFeatureAtPixel(evt.pixel,\r
                function (feature, layer) {\r
                    return layer;\r
                });\r
            if (selectedFeature && tempMarker.kind == "waypoint") {\r
                $("#editMission").hide();\r
                selectedMarker = mission.getWaypoint(tempMarker.number);\r
\r
                selectedFwApproachWp = FC.FW_APPROACH.get()[FC.SAFEHOMES.getMaxSafehomeCount() + selectedMarker.getMultiMissionIdx()];\r
\r
                if (selectedFwApproachWp.getLandHeading1() == 0 && selectedFwApproachWp.getLandHeading1() == 0 && selectedFwApproachWp.getApproachAltAsl() == 0 && selectedFwApproachWp.getLandAltAsl() == 0) {\r
                    selectedFwApproachWp.setApproachAltAsl(settings.fwApproachAlt * 100);\r
                    selectedFwApproachWp.setLandAltAsl(settings.fwLandAlt * 100);\r
                }\r
\r
                var geometry = selectedFeature.getGeometry();\r
                var coord = toLonLat(geometry.getCoordinates());\r
\r
                selectedFeature.setStyle(getWaypointIcon(selectedMarker, true));\r
\r
                let P3Value = selectedMarker.getP3();\r
\r
                changeSwitch($('#pointP3Alt'), missionControlTab.isBitSet(P3Value, MWNP.P3.ALT_TYPE));\r
                changeSwitch($('#pointP3UserAction1'), missionControlTab.isBitSet(P3Value, MWNP.P3.USER_ACTION_1));\r
                changeSwitch($('#pointP3UserAction2'), missionControlTab.isBitSet(P3Value, MWNP.P3.USER_ACTION_2));\r
                changeSwitch($('#pointP3UserAction3'), missionControlTab.isBitSet(P3Value, MWNP.P3.USER_ACTION_3));\r
                changeSwitch($('#pointP3UserAction4'), missionControlTab.isBitSet(P3Value, MWNP.P3.USER_ACTION_4));\r
\r
                var altitudeMeters = app.ConvertCentimetersToMeters(selectedMarker.getAlt());\r
\r
                if (selectedMarker.getAction() == MWNP.WPTYPE.LAND) {\r
                    $('#wpFwLanding').fadeIn(300);\r
                } else  {\r
                    $('#wpFwLanding').fadeOut(300);\r
                }\r
\r
                if (tempSelectedMarkerIndex == null || tempSelectedMarkerIndex != selectedMarker.getLayerNumber()) {\r
                    (async () => {\r
                        const elevationAtWP = await selectedMarker.getElevation(globalSettings);\r
                        $('#elevationValueAtWP').text(elevationAtWP);\r
                        const returnAltitude = checkAltElevSanity(false, selectedMarker.getAlt(), elevationAtWP, P3Value);\r
                        selectedMarker.setAlt(returnAltitude);\r
\r
                        /*\r
                        if (missionControlTab.isBitSet(P3Value, MWNP.P3.ALT_TYPE)) {\r
                            if (!selectedFwApproachWp.getIsSeaLevelRef()) {\r
                                selectedFwApproachWp.setApproachDirection(selectedFwApproachWp.getApproachDirection() + elevationAtWP * 100);\r
                                selectedFwApproachWp.setLandAltAsl(selectedFwApproachWp.getLandAltAsl() + elevationAtWP * 100);\r
                            }\r
\r
                        }\r
                        */\r
                        selectedFwApproachWp.setIsSeaLevelRef(missionControlTab.isBitSet(P3Value, MWNP.P3.ALT_TYPE) ? 1 : 0);\r
                        $('#wpApproachAlt').val(selectedFwApproachWp.getApproachAltAsl());\r
                        $('#wpLandAlt').val(selectedFwApproachWp.getLandAltAsl);\r
                        $('#wpLandAltM').text(selectedFwApproachWp.getLandAltAsl() / 100 + " m");\r
                        $('#wpApproachAltM').text(selectedFwApproachWp.getApproachAltAsl() / 100 + " m");\r
\r
                        plotElevation();\r
                    })()\r
                }\r
                $('#elevationAtWP').fadeIn();\r
                $('#groundClearanceAtWP').fadeIn();\r
\r
                $('#altitudeInMeters').text(\` \${altitudeMeters}m\`);\r
                $('#pointLon').val(Math.round(coord[0] * 10000000) / 10000000);\r
                $('#pointLat').val(Math.round(coord[1] * 10000000) / 10000000);\r
                $('#pointAlt').val(selectedMarker.getAlt());\r
                $('#pointType').val(selectedMarker.getAction());\r
                // Change SpeedValue to Parameter1, 2, 3\r
                $('#pointP1').val(selectedMarker.getP1());\r
                $('#pointP2').val(selectedMarker.getP2());\r
\r
\r
\r
\r
                $('#wpApproachDirection').val(selectedFwApproachWp.getApproachDirection());\r
                $('#wpLandHeading1').val(Math.abs(selectedFwApproachWp.getLandHeading1()));\r
                changeSwitch($('#wpLandHeading1Excl'), selectedFwApproachWp.getLandHeading1() < 0);\r
                $('#wpLandHeading2').val(Math.abs(selectedFwApproachWp.getLandHeading2()));\r
                changeSwitch($('#wpLandHeading2Excl'), selectedFwApproachWp.getLandHeading2() < 0);\r
\r
\r
\r
                $('#wpApproachDirection').val(selectedFwApproachWp.getApproachDirection());\r
                $('#wpLandHeading1').val(Math.abs(selectedFwApproachWp.getLandHeading1()));\r
                changeSwitch($('#wpLandHeading1Excl'), selectedFwApproachWp.getLandHeading1() < 0);\r
                $('#wpLandHeading2').val(Math.abs(selectedFwApproachWp.getLandHeading2()));\r
                changeSwitch($('#wpLandHeading2Excl'), selectedFwApproachWp.getLandHeading2() < 0);\r
\r
                // Selection box update depending on choice of type of waypoint\r
                for (var j in dictOfLabelParameterPoint[selectedMarker.getAction()]) {\r
                    if (dictOfLabelParameterPoint[selectedMarker.getAction()][j] != '') {\r
                        $('#pointP'+String(j).slice(-1)+'class').fadeIn(300);\r
                        $('label[for=pointP'+String(j).slice(-1)+']').html(dictOfLabelParameterPoint[selectedMarker.getAction()][j]);\r
                    }\r
                    else {$('#pointP'+String(j).slice(-1)+'class').fadeOut(300);}\r
                }\r
                selectedMarker = renderWaypointOptionsTable(selectedMarker);\r
                $('#EditPointNumber').text("Edit point "+String(selectedMarker.getLayerNumber()+1));\r
                $('#MPeditPoint').fadeIn(300);\r
                $('#pointP3UserActionClass').fadeIn();\r
                redrawLayer();\r
            }\r
            else if (selectedFeature && tempMarker.kind == "line" && tempMarker.selection && !disableMarkerEdit) {\r
                let tempWpCoord = toLonLat(evt.coordinate);\r
                let tempWp = new Waypoint(tempMarker.number, MWNP.WPTYPE.WAYPOINT, Math.round(tempWpCoord[1] * 10000000), Math.round(tempWpCoord[0] * 10000000), Number(settings.alt), Number(settings.speed));\r
                tempWp.setMultiMissionIdx(mission.getWaypoint(0).getMultiMissionIdx());\r
\r
                if (homeMarkers.length && HOME.getAlt() != "N/A") {\r
                    (async () => {\r
                        const elevationAtWP = await tempWp.getElevation(globalSettings);\r
                        tempWp.setAlt(checkAltElevSanity(false, settings.alt, elevationAtWP, false));\r
\r
                        mission.insertWaypoint(tempWp, tempMarker.number);\r
                        mission.update(singleMissionActive());\r
                        refreshLayers();\r
                        plotElevation();\r
                    })()\r
                } else {\r
                    mission.insertWaypoint(tempWp, tempMarker.number);\r
                    mission.update(singleMissionActive());\r
                    refreshLayers();\r
                    plotElevation();\r
                }\r
            }\r
            else if (selectedFeature && tempMarker.kind == "safehome" && tempMarker.selection) {\r
                updateSelectedShAndFwAp(tempMarker.number);\r
                //renderSafeHomeOptions();\r
            }\r
            else if (selectedFeature && tempMarker.kind == "home" && tempMarker.selection) {\r
                selectedMarker = HOME;\r
                var geometry = selectedFeature.getGeometry();\r
                var coord = toLonLat(geometry.getCoordinates());\r
                $('.home-lon').val(Math.round(coord[0] * 10000000) / 10000000);\r
                $('.home-lat').val(Math.round(coord[1] * 10000000) / 10000000);\r
            }\r
            else if (selectedFeature && tempMarker.kind == "geozone" && tempMarker.selection) {\r
                selectedGeozone = FC.GEOZONES.at(tempMarker.layerNumber);\r
                renderGeozoneOptions();\r
            }\r
            else if (selectedFeature && tempMarker.kind == "geozoneline" && tempMarker.selection) {\r
\r
                if (FC.GEOZONES.getUsedVerticesCount() + 1 > FC.GEOZONES.getMaxVertices()) {\r
                    dialog.alert(i18n.getMessage('missionGeozoneMaxVerticesReached'));\r
                    return;\r
                }\r
                \r
                let tempCoord = toLonLat(evt.coordinate);\r
                let tmpVertex = new GeozoneVertex(tempMarker.number + 1, Math.round(tempCoord[1] * 1e7), Math.round(tempCoord[0] * 1e7));\r
                FC.GEOZONES.at(tempMarker.layerNumber).insertVertex(tempMarker.number + 1, tmpVertex);\r
                selectedGeozone = FC.GEOZONES.at(tempMarker.layerNumber);\r
                renderGeozoneOptions();\r
                renderGeozonesOnMap();\r
                updateGeozoneInfo();\r
            }\r
            else if (!disableMarkerEdit) {\r
                let tempWpCoord = toLonLat(evt.coordinate);\r
                let tempWp = new Waypoint(mission.get().length, MWNP.WPTYPE.WAYPOINT, Math.round(tempWpCoord[1] * 10000000), Math.round(tempWpCoord[0] * 10000000), Number(settings.alt), Number(settings.speed));\r
\r
                if (mission.get().length == 0) {\r
                    tempWp.setMultiMissionIdx(multimissionCount == 0 ? 0 : multimissionCount - 1);\r
                    FC.FW_APPROACH.clean(FC.SAFEHOMES.getMaxSafehomeCount() + tempWp.getMultiMissionIdx());\r
                } else {\r
                    tempWp.setMultiMissionIdx(mission.getWaypoint(mission.get().length - 1).getMultiMissionIdx());\r
                }\r
\r
                if (homeMarkers.length && HOME.getAlt() != "N/A") {\r
                    (async () => {\r
                        const elevationAtWP = await tempWp.getElevation(globalSettings);\r
                        tempWp.setAlt(checkAltElevSanity(false, settings.alt, elevationAtWP, false));\r
\r
                        mission.put(tempWp);\r
                        mission.update(singleMissionActive());\r
                        refreshLayers();\r
                        plotElevation();\r
                    })()\r
                } else {\r
                    mission.put(tempWp);\r
                    mission.update(singleMissionActive());\r
                    refreshLayers();\r
                    plotElevation();\r
                }\r
            }\r
            //mission.missionDisplayDebug();\r
            updateMultimissionState();\r
        });\r
\r
        //////////////////////////////////////////////////////////////////////////\r
        // change mouse cursor when over marker\r
        //////////////////////////////////////////////////////////////////////////\r
        $(map.getViewport()).on('mousemove', function (e) {\r
            var pixel = map.getEventPixel(e.originalEvent);\r
            var name = "";\r
            var hit = map.forEachFeatureAtPixel(pixel, function (feature, layer) {\r
                if (feature) {\r
                    name = feature.getProperties().name;\r
                }\r
                return true;\r
            });\r
            if (hit && name != "safehomeDist" && name != "safehomeSafe" && name != "geozoneCircle") {\r
                map.getTargetElement().style.cursor = 'pointer';\r
            } else {\r
                map.getTargetElement().style.cursor = '';\r
            }\r
        });\r
\r
        //////////////////////////////////////////////////////////////////////////\r
        // handle map size on container resize\r
        //////////////////////////////////////////////////////////////////////////\r
        setInterval(function () {\r
            let width = $("#missionMap canvas").width(), height = $("#missionMap canvas").height();\r
            if ((map.width_ != width) || (map.height_ != height)) map.updateSize();\r
            map.width_ = width; map.height_ = height;\r
        }, 200);\r
\r
        //////////////////////////////////////////////////////////////////////////\r
        // Update Alt display in meters on ALT field keypress up\r
        //////////////////////////////////////////////////////////////////////////\r
        $('#pointAlt').on('keyup', () => {\r
            let altitudeMeters = app.ConvertCentimetersToMeters($('#pointAlt').val());\r
            $('#altitudeInMeters').text(\` \${altitudeMeters}m\`);\r
        });\r
\r
        /////////////////////////////////////////////\r
        // Callback to show/hide menu boxes\r
        /////////////////////////////////////////////\r
        $('#showHideActionButton').on('click', function () {\r
            var src = ($(this).children().attr('class') === 'ic_hide')\r
                ? 'ic_show'\r
                : 'ic_hide';\r
            $(this).children().attr('class', src);\r
            if ($(this).children().attr('class') === 'ic_hide') {\r
                $('#ActionContent').fadeIn(300);\r
            }\r
            else {\r
                $('#ActionContent').fadeOut(300);\r
            }\r
        });\r
\r
        $('#showHideInfoButton').on('click', function () {\r
            var src = ($(this).children().attr('class') === 'ic_hide')\r
                ? 'ic_show'\r
                : 'ic_hide';\r
            $(this).children().attr('class', src);\r
            if ($(this).children().attr('class') === 'ic_hide') {\r
                $('#InfoContent').fadeIn(300);\r
            }\r
            else {\r
                $('#InfoContent').fadeOut(300);\r
            }\r
        });\r
\r
        $('#showHideSafehomeButton').on('click', function () {\r
            var src = ($(this).children().attr('class') === 'ic_hide')\r
                ? 'ic_show'\r
                : 'ic_hide';\r
            $(this).children().attr('class', src);\r
            if ($(this).children().attr('class') === 'ic_hide') {\r
                $('#SafehomeContent').fadeIn(300);\r
            }\r
            else {\r
                $('#SafehomeContent').fadeOut(300);\r
            }\r
        });\r
\r
        $('#showHideHomeButton').on('click', function () {\r
            var src = ($(this).children().attr('class') === 'ic_hide')\r
                ? 'ic_show'\r
                : 'ic_hide';\r
            $(this).children().attr('class', src);\r
            if ($(this).children().attr('class') === 'ic_hide') {\r
                $('#HomeContent').fadeIn(300);\r
            }\r
            else {\r
                $('#HomeContent').fadeOut(300);\r
            }\r
        });\r
\r
        $('#showHideWPeditButton').on('click', function () {\r
            var src = ($(this).children().attr('class') === 'ic_hide')\r
                ? 'ic_show'\r
                : 'ic_hide';\r
            $(this).children().attr('class', src);\r
            if ($(this).children().attr('class') === 'ic_hide') {\r
                $('#WPeditContent').fadeIn(300);\r
            }\r
            else {\r
                $('#WPeditContent').fadeOut(300);\r
            }\r
        });\r
\r
        $('#showHideMultimissionButton').on('click', function () {\r
            var src = ($(this).children().attr('class') === 'ic_hide')\r
                ? 'ic_show'\r
                : 'ic_hide';\r
            $(this).children().attr('class', src);\r
            if ($(this).children().attr('class') === 'ic_hide') {\r
                $('#multimissionContent').fadeIn(300);\r
            }\r
            else {\r
                $('#multimissionContent').fadeOut(300);\r
            }\r
        });\r
\r
        $('#showHideGeozonesButton').on('click', function () {\r
            var src = ($(this).children().attr('class') === 'ic_hide')\r
                ? 'ic_show'\r
                : 'ic_hide';\r
            $(this).children().attr('class', src);\r
            if ($(this).children().attr('class') === 'ic_hide') {\r
                $('#geozoneContent').fadeIn(300);\r
            }\r
            else {\r
                $('#geozoneContent').fadeOut(300);\r
            }\r
        });\r
\r
        /////////////////////////////////////////////\r
        // Callback for Waypoint edition\r
        /////////////////////////////////////////////\r
        $('#pointType').on('change', async (event) => {\r
            if (selectedMarker) {\r
                if (Number($('#pointType').val()) == MWNP.WPTYPE.LAND) {\r
                    let found = false;\r
                    mission.get().forEach(wp => {\r
                        if (wp.getAction() == MWNP.WPTYPE.LAND) {\r
                            dialog.alert(i18n.getMessage('MissionPlannerOnlyOneLandWp'));\r
                            found = true;\r
                            $(event.currentTarget).val(selectedMarker.getAction());\r
                        }\r
                    });\r
\r
                    if (!found) {\r
                        $('#wpFwLanding').fadeIn(300);\r
                    }\r
\r
                } else  {\r
                    $('#wpFwLanding').fadeOut(300);\r
                }\r
\r
                selectedMarker.setAction(Number($('#pointType').val()));\r
                if ([MWNP.WPTYPE.SET_POI,MWNP.WPTYPE.POSHOLD_TIME,MWNP.WPTYPE.LAND].includes(selectedMarker.getAction())) {\r
                    selectedMarker.setP1(0.0);\r
                    selectedMarker.setP2(0.0);\r
                }\r
                for (var j in dictOfLabelParameterPoint[selectedMarker.getAction()]) {\r
                    if (dictOfLabelParameterPoint[selectedMarker.getAction()][j] != '') {\r
                        $('#pointP'+String(j).slice(-1)+'class').fadeIn(300);\r
                        $('label[for=pointP'+String(j).slice(-1)+']').html(dictOfLabelParameterPoint[selectedMarker.getAction()][j]);\r
                    }\r
                    else {$('#pointP'+String(j).slice(-1)+'class').fadeOut(300);}\r
                }\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                redrawLayer();\r
            }\r
        });\r
\r
        $('#pointLat').on('change', function (event) {\r
            if (selectedMarker) {\r
                selectedMarker.setLat(Math.round(Number($('#pointLat').val()) * 10000000));\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                refreshLayers();\r
                selectedFeature = markers[selectedMarker.getLayerNumber()].getSource().getFeatures()[0];\r
                selectedFeature.setStyle(getWaypointIcon(selectedMarker, true));\r
                plotElevation();\r
            }\r
        });\r
\r
        $('#pointLon').on('change', function (event) {\r
            if (selectedMarker) {\r
                selectedMarker.setLon(Math.round(Number($('#pointLon').val()) * 10000000));\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                refreshLayers();\r
                selectedFeature = markers[selectedMarker.getLayerNumber()].getSource().getFeatures()[0];\r
                selectedFeature.setStyle(getWaypointIcon(selectedMarker, true));\r
                plotElevation();\r
            }\r
        });\r
\r
        $('#pointAlt').on('change', function (event) {\r
            if (selectedMarker) {\r
                const elevationAtWP = Number($('#elevationValueAtWP').text());\r
                const returnAltitude = checkAltElevSanity(true, Number($('#pointAlt').val()), elevationAtWP, selectedMarker.getP3());\r
                selectedMarker.setAlt(returnAltitude);\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                redrawLayer();\r
                plotElevation();\r
            }\r
        });\r
\r
        $('#pointP1').on('change', function (event) {\r
            if (selectedMarker) {\r
                selectedMarker.setP1(Number($('#pointP1').val()));\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                redrawLayer();\r
            }\r
        });\r
\r
        $('#pointP2').on('change', function (event) {\r
            if (selectedMarker) {\r
                selectedMarker.setP2(Number($('#pointP2').val()));\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                redrawLayer();\r
            }\r
        });\r
\r
        $('#pointP3Alt').on('change', function (event) {\r
            if (selectedMarker) {\r
                var P3Value = selectedMarker.getP3();\r
\r
                if (disableMarkerEdit) {\r
                    changeSwitch($('#pointP3Alt'), missionControlTab.isBitSet(P3Value, MWNP.P3.ALT_TYPE));\r
                }\r
\r
                P3Value = missionControlTab.setBit(P3Value, MWNP.P3.ALT_TYPE, $('#pointP3Alt').prop("checked"));\r
                (async () => {\r
                    const elevationAtWP = await selectedMarker.getElevation(globalSettings);\r
                    $('#elevationValueAtWP').text(elevationAtWP);\r
                    var altitude = Number($('#pointAlt').val());\r
\r
                    if (P3Value != selectedMarker.getP3()) {\r
                        selectedMarker.setP3(P3Value);\r
\r
                        let groundClearance = 100 * Number($('#groundClearanceValueAtWP').text());\r
                        if (isNaN(groundClearance)) {\r
                            groundClearance = settings.alt; // use default altitude if no current ground clearance\r
                        }\r
\r
                        if ($('#pointP3Alt').prop("checked")) {\r
                            selectedMarker.setAlt(groundClearance + elevationAtWP * 100);\r
                        } else {\r
                            let elevationAtHome = HOME.getAlt();\r
                            if (isNaN(elevationAtHome)) {\r
                                elevationAtHome = elevationAtWP;\r
                            }\r
                            selectedMarker.setAlt(groundClearance + 100 * (elevationAtWP - elevationAtHome));\r
                        }\r
\r
                        if (selectedMarker.getAction() == MWNP.WPTYPE.LAND && selectedFwApproachWp && selectedFwApproachWp.getIsSeaLevelRef() != $('#pointP3Alt').prop("checked")) {\r
\r
                            let oldElevation = 0;\r
                            if (selectedFwApproachWp.getIsSeaLevelRef()) {\r
                                oldElevation = selectedFwApproachWp.getElevation();\r
                            }\r
\r
                            if ($('#pointP3Alt').prop("checked")) {\r
                                selectedFwApproachWp.setApproachAltAsl(selectedFwApproachWp.getApproachAltAsl() - oldElevation + elevationAtWP * 100);\r
                                selectedFwApproachWp.setLandAltAsl(selectedFwApproachWp.getLandAltAsl() - oldElevation + elevationAtWP * 100);\r
                            } else {\r
                                selectedFwApproachWp.setApproachAltAsl(selectedFwApproachWp.getApproachAltAsl() - elevationAtWP * 100);\r
                                selectedFwApproachWp.setLandAltAsl(selectedFwApproachWp.getLandAltAsl() - elevationAtWP * 100);\r
                            }\r
                            selectedFwApproachWp.setElevation(elevationAtWP * 100);\r
                            selectedFwApproachWp.setIsSeaLevelRef($('#pointP3Alt').prop("checked") ? 1 : 0);\r
                            $('#wpApproachAlt').val(selectedFwApproachWp.getApproachAltAsl());\r
                            $('#wpLandAlt').val(selectedFwApproachWp.getLandAltAsl());\r
                        }\r
\r
                    }\r
\r
                    const returnAltitude = checkAltElevSanity(false, selectedMarker.getAlt(), elevationAtWP, selectedMarker.getP3());\r
                    selectedMarker.setAlt(returnAltitude);\r
                    $('#pointAlt').val(selectedMarker.getAlt());\r
                    let altitudeMeters = app.ConvertCentimetersToMeters(selectedMarker.getAlt());\r
                    $('#altitudeInMeters').text(\` \${altitudeMeters}m\`);\r
\r
                    $('#wpLandAltM').text(selectedFwApproachWp.getLandAltAsl() / 100 + " m");\r
                    $('#wpApproachAltM').text(selectedFwApproachWp.getApproachAltAsl() / 100 + " m");\r
\r
                    if (selectedFwApproachWp && selectedFwApproachWp.getIsSeaLevelRef() != $('#pointP3Alt').prop("checked")) {\r
                        selectedFwApproachWp.setIsSeaLevelRef($('#pointP3Alt').prop("checked"));\r
                        selectedFwApproachWp.setElevation(elevationAtWP * 100);\r
                        if ($('#pointP3Alt').prop("checked")) {\r
                            selectedFwApproachWp.setApproachAltAsl(selectedFwApproachWp.getApproachAltAsl() + elevationAtWP * 100);\r
                            selectedFwApproachWp.setLandAltAsl(selectedFwApproachWp.getLandAltAsl() + elevationAtWP * 100);\r
                        } else {\r
                            selectedFwApproachWp.setApproachAltAsl(selectedFwApproachWp.getApproachAltAsl() - elevationAtWP * 100);\r
                            selectedFwApproachWp.setLandAltAsl(selectedFwApproachWp.getLandAltAsl() - elevationAtWP * 100);\r
                        }\r
\r
                        $('#wpApproachAlt').val(selectedFwApproachWp.getApproachAltAsl());\r
                        $('#wpLandAlt').val(selectedFwApproachWp.getLandAltAsl());\r
                    }\r
\r
                    $('#wpLandAltM').text(selectedFwApproachWp.getLandAltAsl() / 100 + " m");\r
                    $('#wpApproachAltM').text(selectedFwApproachWp.getApproachAltAsl() / 100 + " m");\r
\r
                    mission.updateWaypoint(selectedMarker);\r
                    mission.update(singleMissionActive());\r
                    redrawLayer();\r
                    plotElevation();\r
                })();\r
            }\r
        });\r
\r
        $('#pointP3UserAction1').on('change', function(event){\r
            if (selectedMarker) {\r
                if (disableMarkerEdit) {\r
                    changeSwitch($('#pointP3UserAction1'), missionControlTab.isBitSet(selectedMarker.getP3(), MWNP.P3.USER_ACTION_1));\r
                }\r
\r
                var P3Value = missionControlTab.setBit(selectedMarker.getP3(), MWNP.P3.USER_ACTION_1, $('#pointP3UserAction1').prop("checked"));\r
                selectedMarker.setP3(P3Value);\r
\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                redrawLayer();\r
            }\r
        });\r
\r
        $('#pointP3UserAction2').on('change', function(event){\r
            if (selectedMarker) {\r
                if (disableMarkerEdit) {\r
                    changeSwitch($('#pointP3UserAction2'), missionControlTab.isBitSet(selectedMarker.getP3(), MWNP.P3.USER_ACTION_2));\r
                }\r
\r
                var P3Value = missionControlTab.setBit(selectedMarker.getP3(), MWNP.P3.USER_ACTION_2, $('#pointP3UserAction2').prop("checked"));\r
                selectedMarker.setP3(P3Value);\r
\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                redrawLayer();\r
            }\r
        });\r
\r
        $('#pointP3UserAction3').on('change', function(event){\r
            if (selectedMarker) {\r
                if (disableMarkerEdit) {\r
                    changeSwitch($('#pointP3UserAction3'), missionControlTab.isBitSet(selectedMarker.getP3(), MWNP.P3.USER_ACTION_3));\r
                }\r
\r
                var P3Value = missionControlTab.setBit(selectedMarker.getP3(), MWNP.P3.USER_ACTION_3, $('#pointP3UserAction3').prop("checked"));\r
                selectedMarker.setP3(P3Value);\r
\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                redrawLayer();\r
            }\r
        });\r
\r
        $('#pointP3UserAction4').on('change', function(event){\r
            if (selectedMarker) {\r
                if (disableMarkerEdit) {\r
                    changeSwitch($('#pointP3UserAction4'), missionControlTab.isBitSet(selectedMarker.getP3(), MWNP.P3.USER_ACTION_4));\r
                }\r
\r
                var P3Value = missionControlTab.setBit(selectedMarker.getP3(), MWNP.P3.USER_ACTION_4, $('#pointP3UserAction4').prop("checked"));\r
                selectedMarker.setP3(P3Value);\r
\r
                mission.updateWaypoint(selectedMarker);\r
                mission.update(singleMissionActive());\r
                redrawLayer();\r
            }\r
        });\r
\r
        $('#wpApproachAlt').on('change', (event) => {\r
            if (selectedMarker && selectedFwApproachWp) {\r
                let altitude = Number($(event.currentTarget).val());\r
                if (checkApproachAltitude(altitude, $('#pointP3Alt').prop('checked'), Number($('#elevationValueAtWP').text()))) {\r
                    selectedFwApproachWp.setApproachAltAsl(Number($(event.currentTarget).val()));\r
                    $('#wpApproachAltM').text(selectedFwApproachWp.getApproachAltAsl() / 100 + " m");\r
                }\r
            }\r
        });\r
\r
        $('#wpLandAlt').on('change', (event) => {\r
            if (selectedMarker && selectedFwApproachWp) {\r
                let altitude = Number($(event.currentTarget).val());\r
                if (checkLandingAltitude(altitude, $('#pointP3Alt').prop('checked'), Number($('#elevationValueAtWP').text()))) {\r
                    selectedFwApproachWp.setLandAltAsl(Number($(event.currentTarget).val()));\r
                    $('#wpLandAltM').text(selectedFwApproachWp.getLandAltAsl() / 100 + " m");\r
                }\r
            }\r
        });\r
\r
        $('#wpApproachDirection').on('change', (event) => {\r
            if (selectedMarker && selectedFwApproachWp) {\r
                selectedFwApproachWp.setApproachDirection($(event.currentTarget).val());\r
                refreshLayers();\r
                }\r
        });\r
\r
        $('#wpLandHeading1').on('change', (event) => {\r
            if (selectedMarker && selectedFwApproachWp) {\r
                let val = Number($(event.currentTarget).val());\r
                if (val < 0) {\r
                    val = 360;\r
                    $('#wpLandHeading1').val(360);\r
                }\r
                if (val > 360) {\r
                    val = 0;\r
                    $('#wpLandHeading1').val(0);\r
                }\r
\r
                if ($('#wpLandHeading1Excl').prop('checked')) {\r
                    val *= -1;\r
                }\r
\r
                selectedFwApproachWp.setLandHeading1(val);\r
                refreshLayers();\r
            }\r
        });\r
\r
        $('#wpLandHeading1Excl').on('change', (event) => {\r
\r
            if (selectedMarker && selectedFwApproachWp) {\r
                if (disableMarkerEdit) {\r
                    changeSwitch($('#wpLandHeading1Excl'), selectedFwApproachWp.getLandHeading1() < 0);\r
                    return;\r
                }\r
\r
                if ($('#wpLandHeading1Excl').prop('checked')) {\r
                    selectedFwApproachWp.setLandHeading1(-Math.abs(selectedFwApproachWp.getLandHeading1()));\r
                } else {\r
                    selectedFwApproachWp.setLandHeading1(Math.abs(selectedFwApproachWp.getLandHeading1()));\r
                }\r
\r
                refreshLayers();\r
            }\r
        });\r
\r
        $('#wpLandHeading2').on('change', (event) => {\r
            if (selectedMarker && selectedFwApproachWp) {\r
                let val = Number($(event.currentTarget).val());\r
                if (val < 0) {\r
                    val = 360;\r
                    $('#wpLandHeading2').val(360);\r
                }\r
                if (val > 360) {\r
                    val = 0;\r
                    $('#wpLandHeading2').val(0);\r
                }\r
\r
                if ($('#wpLandHeading2Excl').prop('checked')) {\r
                    val *= -1;\r
                }\r
\r
                selectedFwApproachWp.setLandHeading2(val);\r
                refreshLayers();\r
            }\r
        });\r
\r
        $('#wpLandHeading2Excl').on('change', (event) => {\r
            if (selectedMarker && selectedFwApproachWp) {\r
                if (disableMarkerEdit) {\r
                    changeSwitch($('#wpLandHeading2Excl'), selectedFwApproachWp.getLandHeading2() < 0);\r
                    return;\r
                }\r
                if ($('#wpLandHeading2Excl').prop('checked')) {\r
                    selectedFwApproachWp.setLandHeading2(-Math.abs(selectedFwApproachWp.getLandHeading2()));\r
                } else {\r
                    selectedFwApproachWp.setLandHeading2(Math.abs(selectedFwApproachWp.getLandHeading2()));\r
                }\r
                refreshLayers();\r
            }\r
        });\r
\r
\r
        /////////////////////////////////////////////\r
        // Callback for Waypoint Options Table\r
        /////////////////////////////////////////////\r
        $waypointOptionsTableBody.on('click', "[data-role='waypointOptions-delete']", function (event) {\r
            if (selectedMarker) {\r
                mission.dropAttachedFromWaypoint(selectedMarker, $(event.currentTarget).attr("data-index")-1);\r
                renderWaypointOptionsTable(selectedMarker);\r
                //cleanLines();\r
                refreshLayers();\r
                selectedFeature = markers[selectedMarker.getLayerNumber()].getSource().getFeatures()[0];\r
                selectedFeature.setStyle(getWaypointIcon(selectedMarker, true));\r
            }\r
        });\r
\r
        $("[data-role='waypointOptions-add']").on('click', function () {\r
            if (selectedMarker) {\r
                mission.addAttachedFromWaypoint(selectedMarker);\r
                renderWaypointOptionsTable(selectedMarker);\r
                //cleanLines();\r
                refreshLayers();\r
                selectedFeature = markers[selectedMarker.getLayerNumber()].getSource().getFeatures()[0];\r
                selectedFeature.setStyle(getWaypointIcon(selectedMarker, true));\r
            }\r
        });\r
\r
        $('#editMission').on('click', function () {\r
            mapSelectEditMultimission(selectedMarker.getNumber());\r
        });\r
\r
        /////////////////////////////////////////////\r
        // Callback for SAFEHOMES\r
        /////////////////////////////////////////////\r
\r
\r
        $('#addSafehome').on('click', () => {\r
            if (FC.SAFEHOMES.safehomeCount() + 1 > FC.SAFEHOMES.getMaxSafehomeCount()){\r
                dialog.alert(i18n.getMessage('missionSafehomeMaxSafehomesReached'));\r
                return;\r
            }\r
\r
            let mapCenter = map.getView().getCenter();\r
            let midLon = Math.round(toLonLat(mapCenter)[0] * 1e7);\r
            let midLat = Math.round(toLonLat(mapCenter)[1] * 1e7);\r
            FC.SAFEHOMES.put(new Safehome(FC.SAFEHOMES.safehomeCount(), 1, midLat, midLon));\r
            updateSelectedShAndFwAp(FC.SAFEHOMES.safehomeCount() - 1);\r
            renderSafeHomeOptions();\r
            cleanSafehomeLayers();\r
            renderSafehomesOnMap();\r
            updateSafehomeInfo();\r
        });\r
\r
        $('#cancelSafehome').on('click', function () {\r
            closeSafehomePanel();\r
        });\r
\r
        $('#loadEepromSafehomeButton').on('click', function () {\r
            $(this).addClass('disabled');\r
            GUI.log('Start of getting Safehome points');\r
            var loadChainer = new MSPChainerClass();\r
            loadChainer.setChain([\r
                mspHelper.loadSafehomes,\r
                mspHelper.loadFwApproach,\r
                function() {\r
                    if (FC.SAFEHOMES.safehomeCount() >= 1) {\r
                        updateSelectedShAndFwAp(0);\r
                    } else {\r
                        selectedSafehome = null;\r
                        selectedFwApproachSh = null;\r
                    }\r
                    renderSafeHomeOptions();\r
                    cleanSafehomeLayers();\r
                    renderSafehomesOnMap();\r
                    updateSafehomeInfo();\r
                    GUI.log(i18n.getMessage('endGettingSafehomePoints'));\r
                    $('#loadEepromSafehomeButton').removeClass('disabled');\r
                }\r
            ]);\r
            loadChainer.execute();\r
        });\r
\r
        $('#saveEepromSafehomeButton').on('click', function() {\r
            $(this).addClass('disabled');\r
            GUI.log(i18n.getMessage('startSendingSafehomePoints'));\r
\r
            var saveChainer = new MSPChainerClass();\r
            saveChainer.setChain([\r
                mspHelper.saveSafehomes,\r
                mspHelper.saveFwApproach,\r
                function() {\r
                    mspHelper.saveToEeprom();\r
                    GUI.log(i18n.getMessage('endSendingSafehomePoints'));\r
                    $('#saveEepromSafehomeButton').removeClass('disabled');\r
                }\r
            ]);\r
            saveChainer.execute();\r
        });\r
\r
        $('#deleteSafehome').on('click', () => {\r
            if (selectedSafehome && selectedFwApproachSh) {\r
                var shNum = selectedSafehome.getNumber();\r
                FC.SAFEHOMES.drop(shNum);\r
                FC.FW_APPROACH.clean(shNum);\r
\r
                if (FC.SAFEHOMES.safehomeCount() > 0) {\r
                    updateSelectedShAndFwAp(FC.SAFEHOMES.safehomeCount() - 1);\r
                } else {\r
                    selectedSafehome = null;\r
                    selectedFwApproachSh = null;\r
                }\r
                renderSafeHomeOptions();\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
                updateSafehomeInfo();\r
            }\r
        });\r
\r
        $('#safehomeLatitude').on('change', event => {\r
            if (selectedSafehome && selectedFwApproachSh) {\r
                selectedSafehome.setLat(Math.round(Number($(event.currentTarget).val()) * 1e7));\r
                renderSafeHomeOptions();\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
            }\r
        });\r
\r
\r
        $('#safehomeLongitude').on('change', event => {\r
            if (selectedSafehome && selectedFwApproachSh) {\r
                selectedSafehome.setLon(Math.round(Number($(event.currentTarget).val()) * 1e7));\r
                renderSafeHomeOptions();\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
            }\r
        });\r
\r
        $('#safehomeSeaLevelRef').on('change', event => {\r
\r
            let isChecked = $(event.currentTarget).prop('checked') ? 1 : 0;\r
            if (selectedSafehome && selectedFwApproachSh && isChecked != selectedFwApproachSh.getIsSeaLevelRef()) {\r
                selectedFwApproachSh.setIsSeaLevelRef(isChecked);\r
\r
                (async () => {\r
                    const elevation = await selectedFwApproachSh.getElevationFromServer(selectedSafehome.getLonMap(), selectedSafehome.getLatMap(), globalSettings) * 100;\r
                    selectedFwApproachSh.setElevation(elevation);\r
\r
                    if (isChecked) {\r
                        selectedFwApproachSh.setApproachAltAsl(selectedFwApproachSh.getApproachAltAsl() + elevation);\r
                        selectedFwApproachSh.setLandAltAsl(selectedFwApproachSh.getLandAltAsl() + elevation);\r
                    } else {\r
                        selectedFwApproachSh.setApproachAltAsl(selectedFwApproachSh.getApproachAltAsl() - elevation);\r
                        selectedFwApproachSh.setLandAltAsl(selectedFwApproachSh.getLandAltAsl() - elevation);\r
\r
                    }\r
\r
                    $('#safehomeElevation').text(elevation / 100);\r
                    $('#safehomeApproachAlt').val(selectedFwApproachSh.getApproachAltAsl());\r
                    $('#safehomeLandAlt').val(selectedFwApproachSh.getLandAltAsl());\r
                    $('#safehomeLandAltM').text(selectedFwApproachSh.getLandAltAsl() / 100 + " m");\r
                    $('#safehomeApproachAltM').text(selectedFwApproachSh.getApproachAltAsl() / 100 + " m");\r
\r
                    renderSafeHomeOptions();\r
                })();\r
            }\r
        });\r
\r
        $('#safehomeApproachAlt').on('change', event => {\r
\r
            if (selectedFwApproachSh) {\r
                let altitude = Number($(event.currentTarget).val());\r
                if (checkApproachAltitude(altitude, $('#safehomeSeaLevelRef').prop('checked'), Number($('#safehomeElevation').text()))) {\r
                    selectedFwApproachSh.setApproachAltAsl(Number($(event.currentTarget).val()));\r
                    $('#safehomeApproachAltM').text(selectedFwApproachSh.getApproachAltAsl() / 100 + " m");\r
                    cleanSafehomeLayers();\r
                    renderSafehomesOnMap();\r
                    renderHomeTable();\r
                }\r
                $('#safehomeApproachAlt').val(selectedFwApproachSh.getApproachAltAsl());\r
            }\r
\r
        });\r
\r
        $('#safehomeLandAlt').on('change', event => {\r
\r
            if (selectedFwApproachSh) {\r
                let altitude = Number($(event.currentTarget).val());\r
                if (checkLandingAltitude(altitude, $('#safehomeSeaLevelRef').prop('checked'), Number($('#safehomeElevation').text()))) {\r
                    selectedFwApproachSh.setLandAltAsl(altitude);\r
                    $('#safehomeLandAltM').text(selectedFwApproachSh.getLandAltAsl() / 100 + " m");\r
                    cleanSafehomeLayers();\r
                    renderSafehomesOnMap();\r
                    renderHomeTable();\r
                } else {\r
                    $('#safehomeLandAlt').val(selectedFwApproachSh.getLandAltAsl());\r
                }\r
            }\r
        });\r
\r
        $('#geozoneApproachDirection').on('change', event => {\r
            if (selectedFwApproachSh) {\r
                selectedFwApproachSh.setApproachDirection($(event.currentTarget).val());\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
            }\r
        });\r
\r
        $('#safehomeLandHeading1Excl').on('change', event => {\r
            if (selectedFwApproachSh && !lockShExclHeading) {\r
                selectedFwApproachSh.setLandHeading1(selectedFwApproachSh.getLandHeading1() * -1);\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
            }\r
        });\r
\r
        $('#safehomeLandHeading1').on('change', event => {\r
            if (selectedFwApproachSh) {\r
                let val = Number($(event.currentTarget).val());\r
                if (val < 0) {\r
                    val = 360;\r
                    $('#safehomeLandHeading1').val(360);\r
                }\r
                if (val > 360) {\r
                    val = 0;\r
                    $('#safehomeLandHeading1').val(0);\r
                }\r
\r
                if ($('#safehomeLandHeading1Excl').prop('checked')) {\r
                    val *= -1;\r
                }\r
\r
                selectedFwApproachSh.setLandHeading1(val);\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
            }\r
        });\r
\r
\r
        $('#safehomeLandHeading2Excl').on('change', event => {\r
            if (selectedFwApproachSh && !lockShExclHeading) {\r
                selectedFwApproachSh.setLandHeading2(selectedFwApproachSh.getLandHeading2() * -1);\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
            }\r
        });\r
\r
\r
        $('#safehomeLandHeading2').on('change', event => {\r
            if (selectedFwApproachSh) {\r
                let val = Number($(event.currentTarget).val());\r
                if (val < 0) {\r
                    val = 360;\r
                    $('#safehomeLandHeading2').val(360);\r
                }\r
                if (val > 360) {\r
                    val = 0;\r
                    $('#safehomeLandHeading2').val(0);\r
                }\r
\r
                if ($('#safehomeLandHeading2Excl').prop('checked')) {\r
                    val *= -1;\r
                }\r
\r
                selectedFwApproachSh.setLandHeading2(val);\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
            }\r
        });\r
\r
        /////////////////////////////////////////////\r
        // Callback for Geozones\r
        /////////////////////////////////////////////\r
\r
        function reboot() {\r
            //noinspection JSUnresolvedVariable\r
            GUI.log(i18n.getMessage('configurationEepromSaved'));\r
            GUI.tab_switch_cleanup(function () {\r
                MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitialize);\r
            });\r
        }\r
\r
        function reinitialize() {\r
            //noinspection JSUnresolvedVariable\r
            GUI.log(i18n.getMessage('deviceRebooting'));\r
            GUI.handleReconnect($('.tab_mission_control a'));\r
        }\r
\r
        $('#cancelGeozone').on('click', function() {\r
            $('#missionPlannerGeozones').hide();\r
            cleanGeozoneLayers();\r
            cleanGeozoneLines();\r
            selectedGeozone = null;\r
        });\r
\r
        $('#addGeozone').on('click', function() {\r
            addGeozone();\r
        });\r
\r
        $('#deleteGeozone').on('click', event => {\r
            FC.GEOZONES.drop(selectedGeozone.getNumber());\r
            selectedGeozone = FC.GEOZONES.last();\r
            renderGeozoneOptions();\r
            renderGeozonesOnMap();\r
            updateGeozoneInfo();\r
        });\r
\r
        $('#loadEepromGeozoneButton').on('click', event => {\r
            $(event.currentTarget).addClass('disabled');\r
            GUI.log('Start of getting Geozones');\r
            mspHelper.loadGeozones(() => {\r
                 if (FC.GEOZONES.geozoneCount() >= 1) {\r
                    selectedGeozone = FC.GEOZONES.first();\r
                } else {\r
                    selectedGeozone = null;\r
                }\r
                renderGeozoneOptions();\r
                renderGeozonesOnMap();\r
                updateGeozoneInfo();\r
                GUI.log('End of getting Geozones');\r
                $(event.currentTarget).removeClass('disabled');\r
            }, 1000);\r
        });\r
\r
        $('#saveEepromGeozoneButton').on('click', event => {\r
\r
            if (invalidGeoZones) {\r
                dialog.alert(i18n.getMessage("geozoneUnableToSave"));\r
                return;\r
            }\r
            \r
            if (dialog.confirm(i18n.getMessage("missionGeozoneReboot"))) {            \r
                $(event.currentTarget).addClass('disabled');\r
                GUI.log('Start of sending Geozones');\r
                mspHelper.saveGeozones(() => {\r
                    mspHelper.saveToEeprom();\r
                    GUI.log('End of sending Geozones');\r
                    reboot();\r
                });\r
            }\r
        });\r
\r
        $('#geozoneShape').on('change', event => {\r
            if (selectedGeozone) {\r
                if ($(event.currentTarget).val() == GeozoneShapes.CIRCULAR) {\r
                    $('#geozoneRadius').prop('disabled', false);\r
                    let tmpVertex = selectedGeozone.getFirstVertex();\r
                    selectedGeozone.resetVertices();\r
                    selectedGeozone.setVertices([tmpVertex]);\r
                } else {\r
                    if (FC.GEOZONES.getUsedVerticesCount() + 2 > FC.GEOZONES.getMaxVertices()) {\r
                        dialog.alert(i18n.getMessage('missionGeozoneMaxVerticesReached'));\r
                        renderGeozoneOptions();\r
                        return;\r
                    }\r
                    $('#geozoneRadius').prop('disabled', true);\r
                    if (selectedGeozone.getVerticesCount() < 3) {\r
                        let lat = selectedGeozone.getFirstVertex().getLat();\r
                        let lon = selectedGeozone.getFirstVertex().getLon();\r
                        let vertices = [\r
                            new GeozoneVertex(0, lat - 25000, lon - 25000),\r
                            new GeozoneVertex(1, lat - 25000, lon + 25000),\r
                            new GeozoneVertex(2, lat + 25000, lon + 25000),\r
                            new GeozoneVertex(3, lat + 25000, lon - 25000)\r
                        ];\r
                        selectedGeozone.setVertices(vertices);\r
                    };\r
                }\r
                selectedGeozone.setShape($(event.currentTarget).val());\r
                renderGeozonesOnMap();\r
                updateGeozoneInfo();\r
            }\r
        });\r
\r
\r
        $('#geozoneType').on('change', event => {\r
            if (selectedGeozone) {\r
                selectedGeozone.setType($(event.currentTarget).val());\r
                renderGeozonesOnMap();\r
            }\r
        });\r
\r
        $('#geozoneMinAlt').on('change', event => {\r
            if (selectedGeozone) {\r
                selectedGeozone.setMinAltitude($(event.currentTarget).val());\r
                renderGeozoneOptions();\r
            }\r
        });\r
        $('#geozoneMaxAlt').on('change', event => {\r
            if (selectedGeozone) {\r
                selectedGeozone.setMaxAltitude($(event.currentTarget).val());\r
                renderGeozoneOptions();\r
            }\r
        });\r
\r
        $('#geozoneSeaLevelRef').on('change', event => {\r
            const isChecked = $(event.currentTarget).prop('checked') ? 1 : 0;\r
            if (selectedGeozone && isChecked != selectedGeozone.getSealevelRef()) {\r
                selectedGeozone.setSealevelRef(isChecked);\r
                (async () => {\r
                    const vertex = selectedGeozone.getVertex(0);\r
                    const elevation = await selectedGeozone.getElevationFromServer(vertex.getLonMap(), vertex.getLatMap(), globalSettings);\r
\r
                    if (isChecked) {\r
                        selectedGeozone.setMinAltitude(Number(selectedGeozone.getMinAltitude()) + elevation * 100);\r
                        selectedGeozone.setMaxAltitude(Number(selectedGeozone.getMaxAltitude()) + elevation * 100);\r
                    } else {\r
                        selectedGeozone.setMinAltitude(Number(selectedGeozone.getMinAltitude()) - elevation * 100);\r
                        selectedGeozone.setMaxAltitude(Number(selectedGeozone.getMaxAltitude()) - elevation * 100);\r
                    }\r
                    renderGeozoneOptions();\r
                })();\r
            }\r
        });\r
\r
        $('#geozoneAction').on('change', event => {\r
            if (selectedGeozone) {\r
                selectedGeozone.setFenceAction($(event.currentTarget).val());\r
            }\r
        });\r
\r
        $('#geozoneRadius').on('change', event => {\r
            if (selectedGeozone) {\r
                selectedGeozone.setRadius($(event.currentTarget).val());\r
                renderGeozonesOnMap();\r
            }\r
        });\r
\r
\r
        /////////////////////////////////////////////\r
        // Callback for HOME Table\r
        /////////////////////////////////////////////\r
        $('#homeTableBody').on('click', "[data-role='home-center']", function (event) {\r
            let mapCenter = map.getView().getCenter();\r
            HOME.setLon(Math.round(toLonLat(mapCenter)[0] * 1e7));\r
            HOME.setLat(Math.round(toLonLat(mapCenter)[1] * 1e7));\r
            updateHome();\r
        });\r
\r
        $('#cancelHome').on('click', function () {\r
            closeHomePanel();\r
        });\r
\r
        $('#cancelPlot').on('click', function () {\r
            closeHomePanel();\r
        });\r
\r
        /////////////////////////////////////////////\r
        // Callback for MULTIMISSION Table\r
        /////////////////////////////////////////////\r
        $('#multimissionOptionList').on('change', function () {\r
            if (singleMissionActive()) {\r
                // updateAllMultimission only when a single mission is loaded on map\r
                // or new mission is empty.\r
                if (mission.isEmpty()) {\r
                    updateAllMultimission();\r
                    return;\r
                }\r
                let missions = 0;\r
                mission.get().forEach(function (element) {\r
                    missions += element.getEndMission() == 0xA5 ? 1 : 0;\r
                });\r
                if (missions == 1) updateAllMultimission();\r
\r
                editMultimission();\r
            } else {\r
                updateAllMultimission();\r
                updateMultimissionState();\r
            }\r
        });\r
\r
        $('#addMultimissionButton').on('click', function () {\r
            addMultimission();\r
        });\r
\r
        $('#updateMultimissionButton').on('click', function () {\r
            $('#multimissionOptionList').val('0').trigger('change');\r
        });\r
\r
        $('#cancelMultimission').on('click', function () {\r
            $('#missionPlannerMultiMission').fadeOut(300);\r
        });\r
\r
        $('#setActiveMissionButton').on('click', function () {\r
            $('#activeNissionIndex').text(Number($('#multimissionOptionList').val()));\r
        });\r
\r
        /////////////////////////////////////////////\r
        // Callback for Remove buttons\r
        /////////////////////////////////////////////\r
        $('#removeAllPoints').on('click', function () {\r
            if (markers.length){\r
                dialog.confirm(i18n.getMessage('confirm_delete_all_points')).then(result => {\r
                    if (result) {\r
                        if (removeAllMultiMissionCheck()) {\r
                            removeAllWaypoints();\r
                            updateMultimissionState();\r
                        }\r
                        for (let i = FC.SAFEHOMES.getMaxSafehomeCount(); i < FC.FW_APPROACH.getMaxFwApproachCount(); i++) {\r
                            FC.FW_APPROACH.clean(i);\r
                        }\r
                        plotElevation();\r
                    }\r
                });\r
            }\r
        });\r
\r
        $('#removePoint').on('click', function () {\r
            if (selectedMarker) {\r
                if (mission.isJumpTargetAttached(selectedMarker)) {\r
                    dialog.alert(i18n.getMessage('MissionPlannerJumpTargetRemoval'));\r
                }\r
                else if (mission.getAttachedFromWaypoint(selectedMarker) && mission.getAttachedFromWaypoint(selectedMarker).length != 0) {\r
                    if (dialog.confirm(i18n.getMessage('confirm_delete_point_with_options'))) {\r
                        mission.getAttachedFromWaypoint(selectedMarker).forEach(function (element) {\r
\r
                            if (element.getAction() == MWNP.WPTYPE.LAND) {\r
                                FC.FW_APPROACH.clean(element.getNumber());\r
                            }\r
\r
                            mission.dropWaypoint(element);\r
                            mission.update(singleMissionActive());\r
                        });\r
                        mission.dropWaypoint(selectedMarker);\r
                        selectedMarker = null;\r
                        mission.update(singleMissionActive());\r
                        clearEditForm();\r
                        refreshLayers();\r
                        plotElevation();\r
                    }\r
                }\r
                else {\r
                    mission.dropWaypoint(selectedMarker);\r
                    if (selectedMarker.getAction() == MWNP.WPTYPE.LAND) {\r
                        FC.FW_APPROACH.clean(selectedFwApproachWp.getNumber());\r
                    }\r
                    selectedMarker = null;\r
                    mission.update(singleMissionActive());\r
                    clearEditForm();\r
                    refreshLayers();\r
                    plotElevation();\r
                }\r
                updateMultimissionState();\r
            }\r
        });\r
\r
        /////////////////////////////////////////////\r
        // Callback for Save/load buttons\r
        /////////////////////////////////////////////\r
        $('#loadFileMissionButton').on('click', function () {\r
            if (!fileLoadMultiMissionCheck()) return;\r
\r
            if (markers.length && !dialog.confirm(i18n.getMessage('confirm_delete_all_points'))) return;\r
            var options = {\r
                filters: [ { name: "Mission file", extensions: ['mission'] } ]\r
            };\r
            dialog.showOpenDialog(options).then(result => {\r
                if (result.canceled) {\r
                    console.log('No file selected');\r
                    return;\r
                }\r
                if (result.files.length == 1) {\r
                    loadMissionFile(result.files[0]);\r
                }\r
            })\r
        });\r
\r
        $('#saveFileMissionButton').on('click', function () {\r
            var options = {\r
                defaultPath: 'inav-mission.mission',\r
                filters: [ { name: "Mission file", extensions: ['mission'] } ]\r
            };\r
            dialog.showSaveDialog(options).then(result =>  {\r
                if (result.canceled) {\r
                    return;\r
                }\r
                saveMissionFile(result.filePath);\r
            });\r
        });\r
\r
        $('#loadMissionButton').on('click', function () {\r
            let message = multimissionCount ? 'confirm_overwrite_multimission_file_load_option' : 'confirm_delete_all_points';\r
            if ((markers.length || multimissionCount) && !dialog.confirm(i18n.getMessage(message))) return;\r
            removeAllWaypoints();\r
            $(this).addClass('disabled');\r
            GUI.log(i18n.getMessage('startGetPoint'));\r
            getWaypointsFromFC(false);\r
        });\r
\r
        $('#saveMissionButton').on('click', function () {\r
            if (mission.isEmpty()) {\r
                dialog.alert(i18n.getMessage('no_waypoints_to_save'));\r
                return;\r
            }\r
            $(this).addClass('disabled');\r
            GUI.log(i18n.getMessage('startSendPoint'));\r
            sendWaypointsToFC(false);\r
        });\r
\r
        $('#loadEepromMissionButton').on('click', function () {\r
            let message = multimissionCount ? 'confirm_overwrite_multimission_file_load_option' : 'confirm_delete_all_points';\r
            if ((markers.length || multimissionCount) && !dialog.confirm(i18n.getMessage(message))) return;\r
            removeAllWaypoints();\r
            $(this).addClass('disabled');\r
            GUI.log(i18n.getMessage('startGetPoint'));\r
            getWaypointsFromFC(true);\r
        });\r
\r
        $('#saveEepromMissionButton').on('click', function () {\r
            if (mission.isEmpty()) {\r
                dialog.alert(i18n.getMessage('no_waypoints_to_save'));\r
                return;\r
            }\r
            $(this).addClass('disabled');\r
            GUI.log(i18n.getMessage('startSendPoint'));\r
            sendWaypointsToFC(true);\r
        });\r
\r
        /////////////////////////////////////////////\r
        // Callback for settings\r
        /////////////////////////////////////////////\r
        $('#saveSettings').on('click', function () {\r
            let oldSafeRadiusSH = settings.safeRadiusSH;\r
\r
            // update only default settings\r
            settings.alt = Number($('#MPdefaultPointAlt').val());\r
            settings.speed = Number($('#MPdefaultPointSpeed').val());\r
            settings.safeRadiusSH = Number($('#MPdefaultSafeRangeSH').val());\r
            settings.fwApproachAlt = Number($('#MPdefaultFwApproachAlt').val());\r
            settings.fwLandAlt = Number($('#MPdefaultLandAlt').val());\r
\r
            saveSettings();\r
\r
            if (settings.safeRadiusSH != oldSafeRadiusSH  && $('#showHideSafehomeButton').is(":visible")) {\r
                cleanSafehomeLayers();\r
                renderSafehomesOnMap();\r
                $('#SafeHomeSafeDistance').text(settings.safeRadiusSH);\r
            }\r
\r
            closeSettingsPanel();\r
        });\r
\r
        $('#cancelSettings').on('click', function () {\r
            loadSettings();\r
            closeSettingsPanel();\r
        });\r
\r
        updateTotalInfo();\r
    }\r
\r
    /////////////////////////////////////////////\r
    //\r
    // Load/Save MWP File Toolbox\r
    //\r
    /////////////////////////////////////////////\r
    function loadMissionFile(filename) {\r
        for (let i = FC.SAFEHOMES.getMaxSafehomeCount(); i < FC.FW_APPROACH.getMaxFwApproachCount(); i++) {\r
            FC.FW_APPROACH.clean(i);\r
        }\r
\r
        bridge.readFile(filename).then(response => {\r
            if (response.error) {\r
                GUI.log(i18n.getMessage('errorReadingFile'));\r
                console.error(response.error);\r
                return;\r
            }\r
\r
            xml2js.Parser({ 'explicitChildren': true, 'preserveChildrenOrder': true }).parseString(response.data, (err, result) => {\r
                if (err) {\r
                    GUI.log(i18n.getMessage('errorParsingFile'));\r
                    return console.error(err);\r
                }\r
\r
                // parse mission file\r
                removeAllWaypoints();\r
                let missionEndFlagCount = 0;\r
                var node = null;\r
                var nodemission = null;\r
                for (var noderoot in result) {\r
                    if (!nodemission && noderoot.match(/mission/i)) {\r
                        nodemission = result[noderoot];\r
                        var missionIdx = -1;\r
                        if (nodemission.$$ && nodemission.$$.length) {\r
                            for (var i = 0; i < nodemission.$$.length; i++) {\r
                                node = nodemission.$$[i];\r
                                if (node['#name'].match(/version/i) && node.$) {\r
                                    for (var attr in node.$) {\r
                                        if (attr.match(/value/i)) {\r
                                            mission.setVersion(node.$[attr]);\r
                                        }\r
                                    }\r
                                } else if (node['#name'].match(/meta/i) || node['#name'].match(/mwp/i) && node.$) {\r
                                    for (var attr in node.$) {\r
                                        if (attr.match(/mission/i)) {\r
                                            missionIdx = parseInt(node.$[attr]) -1;\r
                                        } else if (attr.match(/zoom/i)) {\r
                                            mission.setCenterZoom(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/cx/i)) {\r
                                            mission.setCenterLon(parseFloat(node.$[attr]) * 10000000);\r
                                        } else if (attr.match(/cy/i)) {\r
                                            mission.setCenterLat(parseFloat(node.$[attr]) * 10000000);\r
                                        } else if (attr.match(/home\\-x/i)) {\r
                                            HOME.setLon(Math.round(parseFloat(node.$[attr]) * 10000000));\r
                                        } else if (attr.match(/home\\-y/i)) {\r
                                            HOME.setLat(Math.round(parseFloat(node.$[attr]) * 10000000));\r
                                        }\r
                                    }\r
                                } else if (node['#name'].match(/missionitem/i) && node.$) {\r
                                    //var point = {};\r
                                    var point = new Waypoint(0,0,0,0);\r
                                    for (var attr in node.$) {\r
                                        if (attr.match(/no/i)) {\r
                                            point.setNumber(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/action/i)) {\r
                                            if (node.$[attr].match(/WAYPOINT/i)) {\r
                                                point.setAction(MWNP.WPTYPE.WAYPOINT);\r
                                            } else if (node.$[attr].match(/PH_UNLIM/i) || node.$[attr].match(/POSHOLD_UNLIM/i)) {\r
                                                point.setAction(MWNP.WPTYPE.POSHOLD_UNLIM);\r
                                            } else if (node.$[attr].match(/PH_TIME/i) || node.$[attr].match(/POSHOLD_TIME/i)) {\r
                                                point.setAction(MWNP.WPTYPE.POSHOLD_TIME);\r
                                            } else if (node.$[attr].match(/RTH/i)) {\r
                                                point.setAction(MWNP.WPTYPE.RTH);\r
                                            } else if (node.$[attr].match(/SET_POI/i)) {\r
                                                point.setAction(MWNP.WPTYPE.SET_POI);\r
                                            } else if (node.$[attr].match(/JUMP/i)) {\r
                                                point.setAction(MWNP.WPTYPE.JUMP);\r
                                            } else if (node.$[attr].match(/SET_HEAD/i)) {\r
                                                point.setAction(MWNP.WPTYPE.SET_HEAD);\r
                                            } else if (node.$[attr].match(/LAND/i)) {\r
                                                point.setAction(MWNP.WPTYPE.LAND);\r
                                            } else {\r
                                                point.setAction(0);\r
                                            }\r
                                        } else if (attr.match(/lat/i)) {\r
                                            point.setLat(Math.round(parseFloat(node.$[attr]) * 10000000));\r
                                        } else if (attr.match(/lon/i)) {\r
                                            point.setLon(Math.round(parseFloat(node.$[attr]) * 10000000));\r
                                        } else if (attr.match(/alt/i)) {\r
                                            point.setAlt((parseInt(node.$[attr]) * 100));\r
                                        } else if (attr.match(/parameter1/i)) {\r
                                            point.setP1(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/parameter2/i)) {\r
                                            point.setP2(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/parameter3/i)) {\r
                                            point.setP3(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/flag/i)) {\r
                                            point.setEndMission(parseInt(node.$[attr]));\r
                                            if (parseInt(node.$[attr]) == 0xA5) {\r
                                                missionEndFlagCount ++;\r
                                            }\r
                                        }\r
                                    }\r
                                    if (missionIdx >= 0) {\r
                                        point.setMultiMissionIdx(missionIdx);\r
                                    }\r
                                    mission.put(point);\r
                                } else if (node['#name'].match(/fwapproach/i) && node.$) {\r
                                    var fwApproach = new FwApproach(0);\r
                                    var idx = -1;\r
                                    for (var attr in node.$) {\r
                                        if (attr.match(/index/i)) {\r
                                            idx = parseInt(node.$[attr]);\r
                                        } else if (attr.match(/no/i)) {\r
                                            fwApproach.setNumber(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/approach-alt/i)) {\r
                                            fwApproach.setApproachAltAsl(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/land-alt/i)) {\r
                                            fwApproach.setLandAltAsl(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/approach-direction/i)) {\r
                                            fwApproach.setApproachDirection(node.$[attr] == 'left' ? 0 : 1);\r
                                        } else if (attr.match(/landheading1/i)) {\r
                                            fwApproach.setLandHeading1(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/landheading2/i)) {\r
                                            fwApproach.setLandHeading2(parseInt(node.$[attr]));\r
                                        } else if (attr.match(/sealevel-ref/i)) {\r
                                            fwApproach.setIsSeaLevelRef(parseBooleans(node.$[attr]) ? 1 : 0);\r
                                        }\r
                                    }\r
                                    FC.FW_APPROACH.insert(fwApproach, FC.SAFEHOMES.getMaxSafehomeCount() + idx);\r
                                }\r
                            }\r
                        }\r
                    }\r
                }\r
\r
                if (missionEndFlagCount > 1) {\r
                    \r
                    let loadFile = false;\r
                    if (multimissionCount) {\r
                        dialog.confirm(i18n.getMessage('confirm_multimission_file_load').then(result => {\r
                            if (!result) {\r
                                return; \r
                            }\r
\r
                            loadFile = true;\r
                            /* update Attached Waypoints (i.e non Map Markers)\r
                            * Ensure WPs numbered sequentially across all missions */\r
                            i = 1;\r
                            mission.get().forEach(function (element) {\r
                                element.setNumber(i);\r
                                i++;\r
                            });\r
                            mission.update(false, true);\r
                            multimissionCount = missionEndFlagCount;\r
                            multimission.reinit();\r
                            multimission.copy(mission);\r
                            renderMultimissionTable();\r
                            $('#missionPlannerMultiMission').fadeIn(300);\r
                        }));\r
                    }\r
\r
                    if (!loadFile) {\r
                        mission.flush();\r
                        return;\r
                    }\r
\r
                } else {\r
                    // update Attached Waypoints (i.e non Map Markers)\r
                    mission.update(true, true);\r
                }\r
                updateMultimissionState();\r
\r
                if (Object.keys(mission.getCenter()).length !== 0) {\r
                    var coord = fromLonLat([mission.getCenter().lon / 10000000 , mission.getCenter().lat / 10000000]);\r
                    map.getView().setCenter(coord);\r
                    if (mission.getCenter().zoom) {\r
                        map.getView().setZoom(mission.getCenter().zoom);\r
                    }\r
                    else {\r
                        map.getView().setZoom(16);\r
                    }\r
                }\r
                else {\r
                    setView(16);\r
                }\r
\r
                redrawLayers();\r
                if (!(HOME.getLatMap() == 0 && HOME.getLonMap() == 0)) {\r
                    updateHome();\r
                }\r
                updateTotalInfo();\r
                \r
                let sFilename = '';\r
                if (typeof filename === 'string'){\r
                    sFilename = String(filename.split('\\\\').pop().split('/').pop());\r
                } else {\r
                    sFilename = filename.name\r
                }\r
\r
                GUI.log(sFilename + i18n.getMessage('loadedSuccessfully'));\r
                updateFilename(sFilename);\r
            });\r
        });\r
    }\r
\r
    function saveMissionFile(filename) {\r
        var center = toLonLat(map.getView().getCenter());\r
        var zoom = map.getView().getZoom();\r
        let multimission = multimissionCount && !singleMissionActive();\r
        let version = multimission ? '4.0.0' : '2.3-pre8';\r
        var data = {\r
            'version': { $: { 'value': version } },\r
            'mwp': { $: { 'cx': (Math.round(center[0] * 10000000) / 10000000),\r
                          'cy': (Math.round(center[1] * 10000000) / 10000000),\r
                          'home-x' : HOME.getLonMap(),\r
                          'home-y' : HOME.getLatMap(),\r
                          'zoom': zoom } },\r
            'missionitem': [],\r
            'fwapproach': []\r
        };\r
\r
        let missionStartWPNumber = 0;\r
        let missionNumber = 1;\r
        mission.get().forEach(function (waypoint) {\r
            if (waypoint.getNumber() - missionStartWPNumber == 0 && multimission) {\r
                let meta = {$:{\r
                        'mission': missionNumber\r
                    }};\r
                data.missionitem.push(meta);\r
            }\r
            var point = { $: {\r
                        'no': waypoint.getNumber() - missionStartWPNumber + 1,\r
                        'action': MWNP.WPTYPE.REV[waypoint.getAction()],\r
                        'lat': waypoint.getLatMap(),\r
                        'lon': waypoint.getLonMap(),\r
                        'alt': (waypoint.getAlt() / 100),\r
                        'parameter1': (MWNP.WPTYPE.REV[waypoint.getAction()] == "JUMP" ? waypoint.getP1()+1 : waypoint.getP1()),\r
                        'parameter2': waypoint.getP2(),\r
                        'parameter3': waypoint.getP3(),\r
                        'flag': waypoint.getEndMission(),\r
                    } };\r
            data.missionitem.push(point);\r
\r
            if (waypoint.getEndMission() == 0xA5) {\r
                missionStartWPNumber = waypoint.getNumber() + 1;\r
                missionNumber ++;\r
            }\r
        });\r
        let approachIdx = 0;\r
        for (let i = FC.SAFEHOMES.getMaxSafehomeCount(); i < FC.FW_APPROACH.getMaxFwApproachCount(); i++){\r
            let approach = FC.FW_APPROACH.get()[i];\r
            if (approach.getLandHeading1() != 0 || approach.getLandHeading2() != 0) {\r
                var item = { $: {\r
                    'index': approachIdx,\r
                    'no': approach.getNumber(),\r
                    'approach-alt': approach.getApproachAltAsl(),\r
                    'land-alt': approach.getLandAltAsl(),\r
                    'approach-direction': approach.getApproachDirection() == 0 ? 'left' : 'right',\r
                    'landheading1': approach.getLandHeading1(),\r
                    'landheading2': approach.getLandHeading2(),\r
                    'sealevel-ref': approach.getIsSeaLevelRef() ? 'true' : 'false'\r
                }};\r
                data.fwapproach.push(item);\r
            }\r
            approachIdx++;\r
        }\r
\r
        var builder = new xml2js.Builder({ 'rootName': 'mission', 'renderOpts': { 'pretty': true, 'indent': '\\t', 'newline': '\\n' } });\r
        var xml = builder.buildObject(data);\r
        xml = xml.replace(/missionitem mission/g, 'meta mission');\r
        bridge.writeFile(filename, xml, (err) => {\r
            if (err) {\r
                GUI.log(i18n.getMessage('ErrorWritingFile'));\r
                return console.error(err);\r
            }\r
        });\r
        let sFilename = String(filename.split('\\\\').pop().split('/').pop());\r
        GUI.log(sFilename + i18n.getMessage('savedSuccessfully'));\r
        updateFilename(sFilename);\r
    }\r
\r
    /////////////////////////////////////////////\r
    // Load/Save FC mission Toolbox\r
    // mission = configurator store, WP number indexed from 0, FC.MISSION_PLANNER = FC NVM store, WP number indexed from 1\r
    /////////////////////////////////////////////\r
    function getWaypointsFromFC(loadEeprom) {\r
\r
        var loadChainer = new MSPChainerClass();\r
        var chain = [mspHelper.loadFwApproach];\r
        if (loadEeprom) {\r
            chain.push(function(callback) {\r
                MSP.send_message(MSPCodes.MSP_WP_MISSION_LOAD, [0], callback);\r
            });\r
        }\r
        chain.push(mspHelper.loadWaypoints);\r
        chain.push(function() {\r
            GUI.log(i18n.getMessage('endGetPoint'));\r
            if (loadEeprom) {\r
                GUI.log(i18n.getMessage('eeprom_load_ok'));\r
                $('#loadEepromMissionButton').removeClass('disabled');\r
            } else {\r
                $('#loadMissionButton').removeClass('disabled');\r
            }\r
            if (!FC.MISSION_PLANNER.getCountBusyPoints()) {\r
                dialog.alert(i18n.getMessage('no_waypoints_to_load'));\r
                return;\r
            }\r
            mission.reinit();\r
            mission.copy(FC.MISSION_PLANNER);\r
            mission.update(false, true);\r
\r
            /* check multimissions */\r
            multimissionCount = 0;\r
            mission.get().forEach(function (element) {\r
                if (element.getEndMission() == 0xA5) {\r
                    element.setMultiMissionIdx(multimissionCount);\r
                    multimissionCount++;\r
                }\r
            });\r
            multimissionCount = multimissionCount > 1 ? multimissionCount : 0;\r
            multimission.reinit();\r
            if (multimissionCount > 1) {\r
                multimission.copy(mission);\r
                $('#missionPlannerMultiMission').fadeIn(300);\r
            }\r
            renderMultimissionTable();\r
            setView(16);\r
            redrawLayers();\r
            updateTotalInfo();\r
        });\r
\r
        loadChainer.setChain(chain);\r
        loadChainer.execute();\r
    }\r
\r
    function sendWaypointsToFC(saveEeprom) {\r
        FC.MISSION_PLANNER.reinit();\r
        FC.MISSION_PLANNER.copy(mission);\r
        FC.MISSION_PLANNER.update(false, true, true);\r
        let saveChainer = new MSPChainerClass();\r
        saveChainer.setChain([\r
            mspHelper.saveWaypoints,\r
            mspHelper.saveFwApproach,\r
            function () {\r
                GUI.log(i18n.getMessage('endSendPoint'));\r
                if (saveEeprom) {\r
                    $('#saveEepromMissionButton').removeClass('disabled');\r
                    GUI.log(i18n.getMessage('eeprom_saved_ok'));\r
                    MSP.send_message(MSPCodes.MSP_WP_MISSION_SAVE, [0], false, setMissionIndex);\r
                } else {\r
                    $('#saveMissionButton').removeClass('disabled');\r
                }\r
                mission.setMaxWaypoints(FC.MISSION_PLANNER.getMaxWaypoints());\r
                mission.setValidMission(FC.MISSION_PLANNER.getValidMission());\r
                mission.setCountBusyPoints(FC.MISSION_PLANNER.getCountBusyPoints());\r
                multimission.setMaxWaypoints(mission.getMaxWaypoints());\r
                updateTotalInfo();\r
                mission.reinit();\r
                mission.copy(FC.MISSION_PLANNER);\r
                mission.update(false, true);\r
                refreshLayers();\r
                $('#MPeditPoint').fadeOut(300);\r
            }\r
        ]);\r
        saveChainer.execute();\r
\r
        function setMissionIndex() {\r
            let activeIndex = singleMissionActive() ? 1 : $('#activeNissionIndex').text();\r
            mspHelper.setSetting("nav_wp_multi_mission_index", activeIndex, function () {\r
                MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {\r
                    GUI.log(i18n.getMessage('multimission_active_index_saved_eeprom'));\r
                });\r
            });\r
        }\r
    }\r
\r
    function updateTotalInfo() {\r
        if (CONFIGURATOR.connectionValid) {\r
            let availableWPs = mission.getMaxWaypoints() - mission.get().length;\r
            if (multimissionCount && singleMissionActive()) {\r
                availableWPs = availableWPs - multimission.get().length;\r
            }\r
            $('#availablePoints').text(availableWPs + '/' + mission.getMaxWaypoints());\r
            $('#missionValid').html(mission.getValidMission() ? i18n.getMessage('armingCheckPass') : i18n.getMessage('armingCheckFail'));\r
        }\r
    }\r
\r
    function updateFilename(filename) {\r
        $('#missionFilename').text(filename);\r
        $('#infoMissionFilename').show();\r
    }\r
\r
    function changeSwitch(element, checked) {\r
        element.prop('checked', checked);\r
    }\r
\r
    function updateSelectedShAndFwAp(index) {\r
        selectedSafehome = FC.SAFEHOMES.get()[index];\r
        selectedFwApproachSh = FC.FW_APPROACH.get()[index];\r
    }\r
\r
    /* resetAltitude = true : For selected WPs only. Changes WP Altitude value back to previous value if setting below ground level.\r
     ^ resetAltitude = false : changes WP Altitude to value required to give ground clearance = default Altitude setting\r
     ^ AbsAltCheck : check value for whether or not to use absolute altitude. This can be the P3 bitset or excplicitly set to true or false */\r
    function checkAltElevSanity(resetAltitude, checkAltitude, elevation, AbsAltCheck) {\r
        let groundClearance = "NO HOME";\r
        let altitude = checkAltitude;\r
        AbsAltCheck = (typeof AbsAltCheck == "boolean") ? AbsAltCheck : missionControlTab.isBitSet(AbsAltCheck, MWNP.P3.ALT_TYPE);\r
\r
        if (AbsAltCheck) {\r
            if (checkAltitude < 100 * elevation) {\r
                if (resetAltitude) {\r
                    dialog.alert(i18n.getMessage('MissionPlannerAltitudeChangeReset'));\r
                    altitude = selectedMarker.getAlt();\r
                } else {\r
                    altitude = settings.alt + 100 * elevation;\r
                }\r
            }\r
            groundClearance = altitude / 100 - elevation;\r
        } else if (homeMarkers.length && HOME.getAlt() != "N/A") {\r
            let elevationAtHome = HOME.getAlt();\r
            if ((checkAltitude / 100 + elevationAtHome) < elevation) {\r
                if (resetAltitude) {\r
                    dialog.alert(i18n.getMessage('MissionPlannerAltitudeChangeReset'));\r
                    altitude = selectedMarker.getAlt();\r
                } else {\r
                    let currentGroundClearance = 100 * Number($('#groundClearanceValueAtWP').text());\r
                    if (isNaN(currentGroundClearance) || selectedMarker == null) {\r
                        currentGroundClearance = settings.alt;  // use default altitude if no current ground clearance\r
                    }\r
                    altitude = currentGroundClearance + 100 * (elevation - elevationAtHome);\r
                }\r
            }\r
            groundClearance = altitude / 100 + (elevationAtHome - elevation);\r
        }\r
        $('#pointAlt').val(altitude);\r
        let altitudeMeters = parseInt(altitude) / 100;\r
        $('#altitudeInMeters').text(\` \${altitudeMeters}m\`);\r
        document.getElementById('groundClearanceAtWP').style.color = groundClearance < (settings.alt / 100) ? "#FF0000" : "#303030";\r
        $('#groundClearanceValueAtWP').text(\` \${groundClearance}\`);\r
\r
        return altitude;\r
    }\r
\r
    // Track elevation chart update sequence to prevent race conditions\r
    let elevationUpdateSequence = 0;\r
\r
    function plotElevation() {\r
        if ($('#missionPlannerElevation').is(":visible") && !disableMarkerEdit) {\r
            if (mission.isEmpty()) {\r
                const ctx = $("#elevationChart").get(0);\r
\r
                if (!ctx || ctx.tagName !== 'CANVAS') {\r
                    console.error('elevationChart canvas element not found');\r
                    return;\r
                }\r
\r
                // Destroy existing chart if it exists\r
                if (window.elevationChartInstance) {\r
                    window.elevationChartInstance.destroy();\r
                    window.elevationChartInstance = null;\r
                }\r
\r
                // Create empty chart with message\r
                window.elevationChartInstance = new Chart(ctx, {\r
                    type: 'line',\r
                    data: {\r
                        labels: [0],\r
                        datasets: [\r
                            {\r
                                label: 'WGS84 elevation',\r
                                data: [{x: 0, y: 0}],\r
                                borderColor: '#ff7f0e',\r
                                backgroundColor: 'rgba(255, 127, 14, 0.2)',\r
                                borderWidth: 2,\r
                                fill: true,\r
                                pointRadius: 0,\r
                            },\r
                            {\r
                                label: 'Mission altitude',\r
                                data: [{x: 0, y: 0}],\r
                                borderColor: '#1497f1',\r
                                backgroundColor: 'rgba(20, 151, 241, 0)',\r
                                borderWidth: 2,\r
                                pointRadius: 5,\r
                                pointBackgroundColor: '#1f77b4',\r
                            }\r
                        ]\r
                    },\r
                    options: {\r
                        responsive: true,\r
                        maintainAspectRatio: false,\r
                        plugins: {\r
                            title: {\r
                                display: true,\r
                                text: 'Mission Elevation Profile'\r
                            },\r
                            legend: {\r
                                display: true,\r
                                position: 'top',\r
                            }\r
                        },\r
                        scales: {\r
                            x: {\r
                                type: 'linear',\r
                                title: {\r
                                    display: true,\r
                                    text: 'Distance (m)'\r
                                }\r
                            },\r
                            y: {\r
                                title: {\r
                                    display: true,\r
                                    text: 'Elevation (m)'\r
                                },\r
                                beginAtZero: true\r
                            }\r
                        }\r
                    }\r
                });\r
            }\r
            else {\r
                (async () => {\r
                    // Capture current sequence number to detect stale updates\r
                    const currentSequence = ++elevationUpdateSequence;\r
\r
                    try {\r
                        const [lengthMission, totalMissionDistance, samples, elevation, altPoint2measure, namePoint2measure, refPoint2measure] = await mission.getElevation(globalSettings);\r
\r
                        // Check if a newer update has been triggered while we were fetching data\r
                        if (currentSequence !== elevationUpdateSequence) {\r
                            console.log('Ignoring stale elevation data');\r
                            return;\r
                        }\r
                        const x_elevation = Array.from(Array(samples+1), (_,i)=> i*totalMissionDistance/samples);\r
                        const y_missionElevation = altPoint2measure.map((x,i) => x / 100 + HOME.getAlt()*(1-refPoint2measure[i]));\r
\r
                        /* Show multi mission number in plot title when single mission displayed\r
                         * Not updated when ALL multi missions displayed since plot disabled\r
                         */\r
                        let missionNumber = '';\r
                        if (multimissionCount) {\r
                            missionNumber = ' ' + ($('#multimissionOptionList').val());\r
                        }\r
                        const chartTitle = 'Mission' + missionNumber + ' Elevation Profile';\r
\r
                        // Calculate Y-axis range safely\r
                        const minElevation = elevation.length > 0 ? Math.min(...elevation) : 0;\r
                        const minMission = y_missionElevation.length > 0 ? Math.min(...y_missionElevation) : 0;\r
                        const maxElevation = elevation.length > 0 ? Math.max(...elevation) : 100;\r
                        const maxMission = y_missionElevation.length > 0 ? Math.max(...y_missionElevation) : 100;\r
\r
                        const ctx = $("#elevationChart").get(0);\r
                        if (!ctx || ctx.tagName !== 'CANVAS') {\r
                            console.error('elevationChart canvas element not found');\r
                            return;\r
                        }\r
\r
                        const newData = {\r
                            labels: x_elevation,\r
                            datasets: [\r
                                {\r
                                    label: 'WGS84 elevation',\r
                                    data: elevation.map((y, i) => ({x: x_elevation[i], y: y})),\r
                                    borderColor: '#ff7f0e',\r
                                    backgroundColor: 'rgba(255, 127, 14, 0.2)',\r
                                    borderWidth: 2,\r
                                    fill: true,\r
                                    pointRadius: 0,\r
                                },\r
                                {\r
                                    label: 'Mission altitude',\r
                                    data: lengthMission.map((x, i) => ({x: x, y: y_missionElevation[i]})),\r
                                    borderColor: '#1497f1',\r
                                    backgroundColor: 'rgba(20, 151, 241, 0)',\r
                                    borderWidth: 2,\r
                                    pointRadius: 5,\r
                                    pointBackgroundColor: '#1f77b4',\r
                                }\r
                            ]\r
                        };\r
\r
                        // Update existing chart if it exists, otherwise create new one\r
                        if (window.elevationChartInstance) {\r
                            // Update data\r
                            window.elevationChartInstance.data = newData;\r
                            window.elevationChartInstance.options.plugins.title.text = chartTitle;\r
                            window.elevationChartInstance.options.scales.y.min = Math.floor(-10 + Math.min(minMission, minElevation));\r
                            window.elevationChartInstance.options.scales.y.max = Math.ceil(10 + Math.max(maxMission, maxElevation));\r
                            // Trigger re-render without animation for better performance during drag operations\r
                            window.elevationChartInstance.update('none');\r
                        } else {\r
                            // Create new chart\r
                            window.elevationChartInstance = new Chart(ctx, {\r
                                type: 'line',\r
                                data: newData,\r
                                options: {\r
                                    responsive: true,\r
                                    maintainAspectRatio: false,\r
                                    plugins: {\r
                                        title: {\r
                                            display: true,\r
                                            text: chartTitle\r
                                        },\r
                                        legend: {\r
                                            display: true,\r
                                            position: 'top',\r
                                        }\r
                                    },\r
                                    scales: {\r
                                        x: {\r
                                            type: 'linear',\r
                                            title: {\r
                                                display: true,\r
                                                text: 'Distance (m)'\r
                                            }\r
                                        },\r
                                        y: {\r
                                            title: {\r
                                                display: true,\r
                                                text: 'Elevation (m)'\r
                                            },\r
                                            min: Math.floor(-10 + Math.min(minMission, minElevation)),\r
                                            max: Math.ceil(10 + Math.max(maxMission, maxElevation))\r
                                        }\r
                                    }\r
                                }\r
                            });\r
                        }\r
                    } catch (error) {\r
                        console.error('Failed to plot elevation:', error);\r
                    }\r
                })()\r
            }\r
        }\r
    }\r
\r
    function parseBooleans (str) {\r
        if (/^(?:true|false)$/i.test(str)) {\r
          str = str.toLowerCase() === 'true';\r
        }\r
        return str;\r
      };\r
};\r
\r
missionControlTab.isBitSet = function(bits, testBit) {\r
    let isTrue = ((bits & (1 << testBit)) != 0);\r
\r
    return isTrue;\r
}\r
\r
missionControlTab.setBit = function(bits, bit, value) {\r
    return value ? bits |= (1 << bit) : bits &= ~(1 << bit);\r
}\r
\r
// window.addEventListener("error", handleError, true);\r
\r
// function handleError(evt) {\r
    // if (evt.message) { // Chrome sometimes provides this\r
      // GUI.alert("error: "+evt.message +" at linenumber: "+evt.lineno+" of file: "+evt.filename);\r
    // } else {\r
      // GUI.alert("error: "+evt.type+" from element: "+(evt.srcElement || evt.target));\r
    // }\r
// }\r
\r
missionControlTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default missionControlTab;`;export{e as default};
