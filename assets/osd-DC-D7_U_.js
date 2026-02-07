const n=`'use strict';\r
\r
import { titleize } from  'inflection';\r
import semver from 'semver';\r
import mapSeries from 'promise-map-series';\r
import jBox from 'jbox';\r
import { debounce } from 'throttle-debounce';\r
\r
import FC from './../js/fc';\r
import GUI from './../js/gui';\r
import MSP from './../js/msp';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import mspHelper from './../js/msp/MSPHelper';\r
import Settings from './../js/settings';\r
import { globalSettings } from './../js/globalSettings';\r
import { PortHandler } from './../js/port_handler';\r
import i18n from './../js/localization';\r
import dialog from './../js/dialog';\r
import {bridge, Platform} from './../js/bridge';\r
\r
var SYM = SYM || {};\r
SYM.LAST_CHAR = 225; // For drawing the font preview\r
SYM.BLANK = 0x20;\r
SYM.MILLIOHM = 0x62;\r
SYM.BATT = 0x63;\r
SYM.RSSI = 0x01;\r
SYM.AH_RIGHT = 0x12D;\r
SYM.AH_LEFT = 0x12C;\r
SYM.THR = 0x95;\r
SYM.VOLT = 0x1F;\r
SYM.AH_DECORATION_UP = 0x15;\r
SYM.AH_DECORATION_DOWN = 0x16;\r
SYM.WIND_SPEED_HORIZONTAL = 0x86;\r
SYM.WIND_SPEED_VERTICAL = 0x87;\r
SYM.FLY_M = 0x9F;\r
SYM.ON_M = 0x9E;\r
SYM.AH_CENTER_LINE = 0x13A;\r
SYM.AH_CENTER_LINE_RIGHT = 0x13B;\r
SYM.AH_BAR9_0 = 0x14C;\r
SYM.AZIMUTH = 0x05;\r
SYM.AH_DECORATION = 0x131;\r
SYM.AMP = 0x6A;\r
SYM.MAH = 0x99;\r
SYM.WH = 0x6D;\r
SYM.WATT = 0x71;\r
SYM.MAH_KM_0 = 0x6B;\r
SYM.MAH_KM_1 = 0x6C;\r
SYM.MAH_MI_0 = 0x93;\r
SYM.MAH_MI_1 = 0x94;\r
SYM.AH_V_FT_0 = 0xD6;\r
SYM.AH_V_FT_1 = 0xD7;\r
SYM.AH_V_M_0 = 0xD8;\r
SYM.AH_V_M_1 = 0xD9;\r
SYM.WH_KM = 0x6E;\r
SYM.WH_MI = 0x6F;\r
SYM.GPS_SAT1 = 0x08;\r
SYM.GPS_SAT2 = 0x09;\r
SYM.GPS_HDP1 = 0x0E;\r
SYM.GPS_HDP2 = 0x0F;\r
SYM.KM = 0x83;\r
SYM.KMH = 0x90;\r
SYM.KMH_3D = 0x88;\r
SYM.MPH = 0x91;\r
SYM.MPH_3D = 0x89;\r
SYM.ALT_M = 0x76;\r
SYM.ALT_FT = 0x78;\r
SYM.LAT = 0x03;\r
SYM.LON = 0x04;\r
SYM.AIR = 0x8C;\r
SYM.DIRECTION = 0x17;\r
SYM.DIR_TO_HOME = 0x13C;\r
SYM.SCALE = 0x0D;\r
SYM.DIST_KM = 0x7E;\r
SYM.DIST_MI = 0x80;\r
SYM.M = 0x82;\r
SYM.MI = 0x84;\r
SYM.HOME = 0x10;\r
SYM.TRIP_DIST = 0x75;\r
SYM.HEADING = 0x0C;\r
SYM.DEGREES = 0x0B;\r
SYM.HEADING_N = 0xC8;\r
SYM.HEADING_E = 0xCA;\r
SYM.HEADING_W = 0xCB;\r
SYM.HEADING_DIVIDED_LINE = 0xCC;\r
SYM.HEADING_LINE = 0xCD;\r
SYM.VARIO_UP_2A = 0x155;\r
SYM.THROTTLE_GAUGE_EMPTY = 0x16B;\r
SYM.THROTTLE_GAUGE_FULL = 0x16D;\r
SYM.M_S = 0x8F;\r
SYM.FT_S = 0x8D;\r
SYM.CLOCK = 0xA0;\r
SYM.ZERO_HALF_TRAILING_DOT = 0xA1;\r
SYM.ZERO_HALF_LEADING_DOT = 0xB1;\r
SYM.ROLL_LEFT = 0xAD;\r
SYM.ROLL_LEVEL = 0xAE;\r
SYM.ROLL_RIGHT = 0xAF;\r
SYM.PITCH_UP = 0xB0;\r
SYM.PITCH_DOWN = 0xBB;\r
SYM.TEMP_C = 0x97;\r
SYM.TEMP_F = 0x96;\r
SYM.BARO_TEMP = 0xC0;\r
SYM.IMU_TEMP = 0xC1;\r
SYM.TEMP = 0xC2;\r
SYM.GFORCE = 0xBC;\r
SYM.GFORCE_X = 0xBD;\r
SYM.GFORCE_Y = 0xBE;\r
SYM.GFORCE_Z = 0xBF;\r
SYM.RPM = 0x8B;\r
SYM.ESC_TEMPERATURE = 0xC3;\r
SYM.RSS2 = 0x11;\r
SYM.DB = 0x12;\r
SYM.DBM = 0x13;\r
SYM.MW = 0x72;\r
SYM.SNR = 0x14;\r
SYM.LQ = 0x02;\r
SYM.GLIDESLOPE = 0x9C;\r
SYM.DIST_NM = 0x81;\r
SYM.NM = 0x85;\r
SYM.KT_3D = 0x8A;\r
SYM.KT = 0x92;\r
SYM.HUND_FTM = 0x8E;\r
SYM.MAH_NM_0 = 0x60;\r
SYM.MAH_NM_1 = 0x61;\r
SYM.AH_NM = 0x3F;\r
SYM.WH_NM = 0x70;\r
SYM.VTX_POWER = 0x27;\r
SYM.MAX = 0xCE;\r
SYM.PROFILE = 0xCF;\r
SYM.SWITCH_INDICATOR_HIGH = 0xD2;\r
SYM.GLIDE_MINS = 0xD5;\r
SYM.GLIDE_RANGE = 0xD4;\r
SYM.FLIGHT_MINS_REMAINING = 0xDA;\r
SYM.FLIGHT_DIST_REMAINING = 0x167;\r
SYM.GROUND_COURSE = 0xDC;\r
SYM.ALERT = 0xDD;\r
SYM.CROSS_TRACK_ERROR = 0xFC;\r
SYM.ADSB = 0xFD;\r
SYM.PAN_SERVO_IS_OFFSET_L = 0x1C7;\r
SYM.ODOMETER = 0x168;\r
SYM.BLACKBOX = 0xFE;\r
SYM.PILOT_LOGO_SML_L = 0x1D5;\r
SYM.PILOT_LOGO_SML_C = 0x1D6;\r
SYM.PILOT_LOGO_SML_R = 0x1D7;\r
SYM.MIN_GND_SPEED = 0xDE;\r
\r
SYM.AH_AIRCRAFT0 = 0x1A2;\r
SYM.AH_AIRCRAFT1 = 0x1A3;\r
SYM.AH_AIRCRAFT2 = 0x1A4;\r
SYM.AH_AIRCRAFT3 = 0x1A5;\r
SYM.AH_AIRCRAFT4 = 0x1A6;\r
\r
SYM.SYM_HUD_SIGNAL_3 = 0x163;\r
SYM.SYM_HUD_CARDINAL = 0x1BA;\r
SYM.RX_BAND = 0x169;\r
SYM.RX_MODE = 0x16A;\r
\r
SYM.AH_CROSSHAIRS = new Array(0x166, 0x1A4, new Array(0x190, 0x191, 0x192), new Array(0x193, 0x194, 0x195), new Array(0x196, 0x197, 0x198), new Array(0x199, 0x19A, 0x19B), new Array (0x19C, 0x19D, 0x19E), new Array (0x19F, 0x1A0, 0x1A1));\r
\r
var video_type = null;\r
var isGuidesChecked = false;\r
var FONT = FONT || {};\r
\r
var layout_clipboard = {layout: [], filled: false};\r
\r
var FONT = FONT || {};\r
FONT.initData = function () {\r
    if (FONT.data) {\r
        return;\r
    }\r
    FONT.data = {\r
        // default font file name\r
        loaded_font_file: 'default',\r
        // array of arry of image bytes ready to upload to fc\r
        characters_bytes: [],\r
        // array of array of image bits by character\r
        characters: [],\r
        // an array of base64 encoded image strings by character\r
        character_image_urls: []\r
    }\r
};\r
\r
FONT.constants = {\r
    SIZES: {\r
        /** NVM ram size for one font char, actual character bytes **/\r
        MAX_NVM_FONT_CHAR_SIZE: 54,\r
        /** NVM ram field size for one font char, last 10 bytes dont matter **/\r
        MAX_NVM_FONT_CHAR_FIELD_SIZE: 64,\r
        CHAR_HEIGHT: 18,\r
        CHAR_WIDTH: 12,\r
        LINE: 30\r
    },\r
    COLORS: {\r
        // black\r
        0: 'rgba(0, 0, 0, 1)',\r
        // also the value 3, could yield transparent according to\r
        // https://www.sparkfun.com/datasheets/BreakoutBoards/MAX7456.pdf\r
        1: 'rgba(255, 255, 255, 0)',\r
        // white\r
        2: 'rgba(255,255,255, 1)'\r
    }\r
};\r
\r
/**\r
 * Each line is composed of 8 asci 1 or 0, representing 1 bit each for a total of 1 byte per line\r
 */\r
FONT.parseMCMFontFile = function (data) {\r
    data = data.split("\\n");\r
    // clear local data\r
    FONT.data.characters.length = 0;\r
    FONT.data.characters_bytes.length = 0;\r
    FONT.data.character_image_urls.length = 0;\r
\r
    // make sure the font file is valid\r
    if (data.shift().trim() != 'MAX7456') {\r
        var msg = 'that font file doesn\\'t have the MAX7456 header, giving up';\r
        console.debug(msg);\r
        Promise.reject(msg);\r
    }\r
\r
    var character_bits = [];\r
    var character_bytes = [];\r
\r
    // hexstring is for debugging\r
    FONT.data.hexstring = [];\r
    var pushChar = function () {\r
        FONT.data.characters_bytes.push(character_bytes);\r
        FONT.data.characters.push(character_bits);\r
        FONT.draw(FONT.data.characters.length - 1);\r
        //$log.debug('parsed char ', i, ' as ', character);\r
        character_bits = [];\r
        character_bytes = [];\r
    };\r
\r
    for (var i = 0; i < data.length; i++) {\r
\r
        var line = data[i];\r
        // hexstring is for debugging\r
        FONT.data.hexstring.push('0x' + parseInt(line, 2).toString(16));\r
\r
        // every 64 bytes (line) is a char, we're counting chars though, which are 2 bits\r
        if (character_bits.length == FONT.constants.SIZES.MAX_NVM_FONT_CHAR_FIELD_SIZE * (8 / 2)) {\r
            pushChar()\r
        }\r
\r
        for (var y = 0; y < 8; y = y + 2) {\r
            var v = parseInt(line.slice(y, y + 2), 2);\r
            character_bits.push(v);\r
        }\r
        character_bytes.push(parseInt(line, 2));\r
\r
    }\r
\r
    // push the last char\r
    pushChar();\r
\r
    return FONT.data.characters;\r
};\r
\r
\r
//noinspection JSUnusedLocalSymbols\r
FONT.openFontFile = function ($preview) {\r
    return new Promise(function (resolve) {\r
        var options = {\r
            filters: [\r
                { name: 'Font file', extensions: ['mcm'] }\r
            ],\r
        };\r
        dialog.showOpenDialog(options).then(result =>  {\r
            if (result.canceled) {\r
                console.log('No file selected');\r
                return;\r
            }\r
\r
            if (result.files.length == 1) {\r
                    bridge.readFile(result.files[0]).then(response => {\r
                    if (response.error) {\r
                        GUI.log(i18n.getMessage('ErrorReadingFile'));\r
                        console.log(response.error);\r
                        return;\r
                    }\r
\r
                    FONT.parseMCMFontFile(response.data.toString());\r
                    resolve();\r
                });\r
            }\r
        }).catch (err => {\r
            console.log(err);\r
        });\r
    });\r
};\r
\r
/**\r
 * returns a canvas image with the character on it\r
 */\r
var drawCanvas = function (charAddress) {\r
    var canvas = document.createElement('canvas');\r
    var ctx = canvas.getContext("2d");\r
\r
    // TODO: do we want to be able to set pixel size? going to try letting the consumer scale the image.\r
    var pixelSize = pixelSize || 1;\r
    var width = pixelSize * FONT.constants.SIZES.CHAR_WIDTH;\r
    var height = pixelSize * FONT.constants.SIZES.CHAR_HEIGHT;\r
\r
    canvas.width = width;\r
    canvas.height = height;\r
\r
    for (var y = 0; y < height; y++) {\r
        for (var x = 0; x < width; x++) {\r
            if (!(charAddress in FONT.data.characters)) {\r
                console.log('charAddress', charAddress, ' is not in ', FONT.data.characters.length);\r
            }\r
            var v = FONT.data.characters[charAddress][(y * width) + x];\r
            ctx.fillStyle = FONT.constants.COLORS[v];\r
            ctx.fillRect(x, y, pixelSize, pixelSize);\r
        }\r
    }\r
    return canvas;\r
};\r
\r
FONT.draw = function (charAddress) {\r
    var cached = FONT.data.character_image_urls[charAddress];\r
    if (!cached) {\r
        cached = FONT.data.character_image_urls[charAddress] = drawCanvas(charAddress).toDataURL('image/png');\r
    }\r
    return cached;\r
};\r
\r
// Returns the font data for a blank character\r
FONT.blank = function() {\r
    var size = FONT.constants.SIZES.MAX_NVM_FONT_CHAR_SIZE;\r
    return Array.apply(null, {length: size}).map(function() { return SYM.BLANK; });\r
};\r
\r
FONT.msp = {\r
    encode: function (charAddress) {\r
        var addr = [];\r
        if (charAddress > 255) {\r
            addr.push16(charAddress);\r
        } else {\r
            addr.push8(charAddress);\r
        }\r
        var data = FONT.data.characters_bytes[charAddress];\r
        if (!data) {\r
            data = FONT.blank();\r
        }\r
        return addr.concat(data.slice(0, FONT.constants.SIZES.MAX_NVM_FONT_CHAR_SIZE));\r
    }\r
};\r
\r
FONT.upload = function (callback) {\r
    // Always upload 512 characters, using extra blanks if the font\r
    // has less characters. This ensures we overwrite the 2nd page\r
    // when uploading a 1-page font over a 2-page one.\r
    var count = 512;\r
    var addrs = [];\r
    for (var ii = 0; ii < count; ii++) {\r
        // Upload 2nd page first, so chips supporting just one page\r
        // overwrite page 2 with page 1. Note that this works fine with\r
        // INAV < 2.1 because it will write invalid character data over\r
        // the first pass, but then it will be ovewritten by the first\r
        // 256 characters.\r
        var charIndex = ii < 256 ? ii + 256 : ii - 256;\r
        addrs.push(charIndex);\r
    }\r
    addrs.reduce(function(p, next, idx) {\r
        return p.then(function() {\r
            if (callback) {\r
                callback(idx, count, (idx / count) * 100);\r
            }\r
            // Force usage of V1/V2 protocol to workaround the 64 byte write bug\r
            // on F3 when the configurator is running on macOS\r
            var proto = next <= 255 ? MSP.constants.PROTOCOL_V1 : MSP.constants.PROTOCOL_V2;\r
            var data = FONT.msp.encode(next);\r
            return MSP.promise(MSPCodes.MSP_OSD_CHAR_WRITE, data, proto);\r
        });\r
    }, Promise.resolve()).then(function() {\r
        OSD.GUI.jbox.close();\r
        return MSP.promise(MSPCodes.MSP_SET_REBOOT);\r
    });\r
};\r
\r
FONT.preview = function ($el) {\r
    $el.empty();\r
    for (var i = 1; i <= SYM.LAST_CHAR; i++) {\r
        var url = FONT.data.character_image_urls[i];\r
        $el.append('<img src="' + url + '" title="0x' + i.toString(16) + ' (' + i.toString(10) + ') "></img> ');\r
    }\r
};\r
\r
FONT.symbol = function (hexVal) {\r
    return String.fromCharCode(hexVal);\r
};\r
\r
FONT.embed_dot = function(str) {\r
    var zero = '0'.charCodeAt(0);\r
    var repl = str.replace(/\\d\\.\\d/, function(match) {\r
        var c1 = match.charCodeAt(0) + SYM.ZERO_HALF_TRAILING_DOT - zero;\r
        var c2 = match.charCodeAt(2) + SYM.ZERO_HALF_LEADING_DOT - zero;\r
        return FONT.symbol(c1) + FONT.symbol(c2);\r
    });\r
    return repl;\r
}\r
\r
var OSD = OSD || {};\r
\r
// common functions for altitude and negative altitude alarms\r
function altitude_alarm_unit(osd_data) {\r
    switch (OSD.data.preferences.units) {\r
        case 0: // Imperial\r
        case 3: // UK\r
        case 4: // GA\r
            return 'ft';\r
        default: // Metric\r
            return 'm';\r
    }\r
}\r
\r
function altitude_alarm_to_display(osd_data, value) {\r
    switch (OSD.data.preferences.units) {\r
        case 0: // Imperial\r
        case 3: // UK\r
        case 4: // GA\r
            // feet to meters\r
            return Math.round(value * 3.28084)\r
        default: // Metric\r
            return value;\r
    }\r
}\r
\r
function altitude_alarm_from_display(osd_data, value) {\r
    switch (OSD.data.preferences.units) {\r
        case 0: // Imperial\r
        case 3: // UK\r
        case 4: // GA\r
            // feet to meters\r
            return Math.round(value / 3.28084);\r
        default: // Metric\r
            return value;\r
    }\r
}\r
\r
function altitude_alarm_max(osd_data, value) {\r
    var meters_max = 10000;\r
    switch (OSD.data.preferences.units) {\r
        case 0: // Imperial\r
        case 3: // UK\r
        case 4: // GA\r
            // meters max to feet max\r
            return Math.trunc(meters_max * 3.28084);\r
        default: // Metric\r
            return meters_max;\r
    }\r
}\r
\r
// Used to wrap altitude conversion functions for firmwares up\r
// to 1.7.3, since the altitude alarm used either m or feet\r
// depending on the OSD display unit used (hence, no conversion)\r
function altitude_alarm_display_function(fn) {\r
    return function(osd_data, value) {\r
        return fn(osd_data, value)\r
    }\r
}\r
\r
function osdDecimalsMainBatteryPreview() {\r
    var s = '16.8';\r
    if (Settings.getInputValue('osd_main_voltage_decimals') == 2) {\r
        s += '3';\r
    }\r
\r
    s += FONT.symbol(SYM.VOLT);\r
    return FONT.symbol(SYM.BATT) + FONT.embed_dot(s);\r
}\r
\r
function osdDecimalsAltitudePreview() {\r
    var s = FONT.symbol(SYM.BLANK) + '114';\r
    if (Settings.getInputValue('osd_decimals_altitude') == 4) {\r
        s += '3';\r
    } if (Settings.getInputValue('osd_decimals_altitude') == 5) {\r
        s += '38';\r
    }\r
\r
    switch (OSD.data.preferences.units) {\r
        case 0: // Imperial\r
        case 3: // UK\r
        case 4: // GA\r
            s += FONT.symbol(SYM.ALT_FT);\r
        default: // Metric\r
            s += FONT.symbol(SYM.ALT_M);\r
    }\r
\r
    return s;\r
}\r
\r
function osdDecimalsRemainingFlightDistancePreview() {\r
    return osdDecimalsDistancePreview(SYM.FLIGHT_DIST_REMAINING);\r
}\r
\r
function osdDecimalsHomeDistancePreview() {\r
    return osdDecimalsDistancePreview(SYM.HOME);\r
}\r
\r
function osdDecimalsTripDistancePreview() {\r
    return osdDecimalsDistancePreview(SYM.TRIP_DIST);\r
}\r
\r
function osdDecimalsDistancePreview(prependedSymbol) {\r
    var s = '24.9';\r
    if (Settings.getInputValue('osd_decimals_distance') == 4) {\r
        s+= '3';\r
    } if (Settings.getInputValue('osd_decimals_distance') == 5) {\r
        s = '1' + s + '6';\r
    }\r
\r
    s = FONT.embed_dot(s);\r
\r
    switch (OSD.data.preferences.units) {\r
        case 0: // Imperial\r
        case 3: // UK\r
            s += FONT.symbol(SYM.DIST_MI);\r
            break;\r
        case 4: // GA\r
            s += FONT.symbol(SYM.DIST_NM);\r
            break;\r
        default: // Metric\r
            s += FONT.symbol(SYM.DIST_KM);\r
            break;\r
    }\r
\r
    s = FONT.symbol(prependedSymbol) + s;\r
\r
    return s;\r
}\r
\r
function osdmAhPrecisionPreview() {\r
    let precision = Settings.getInputValue('osd_mah_precision');\r
    let rnd = (Math.floor(10000000000000 + Math.random() * 90000000000000)).toString();\r
    rnd = rnd.replace('0', '');\r
    let preview = rnd.substring(0, precision);\r
\r
    return preview + FONT.symbol(SYM.MAH);\r
}\r
\r
function osdCoordinatePreview(symbol, coordinate) {\r
    return function() {\r
        var digits = Settings.getInputValue('osd_coordinate_digits');\r
        if (!digits) {\r
            // Setting doesn't exist in the FC. Use 11, which\r
            // will make it look close to how it looked before 2.0\r
            digits = 11;\r
        }\r
        var integerLength = ('' + parseInt(coordinate)).length;\r
        return FONT.symbol(symbol) + FONT.embed_dot(coordinate.toFixed(digits - integerLength));\r
    }\r
}\r
\r
// parsed fc output and output to fc, used by to OSD.msp.encode\r
OSD.initData = function () {\r
    OSD.data = {\r
        supported: false,\r
        preferences: {\r
            video_system: null,\r
            main_voltage_decimals: null,\r
            ahi_reverse_roll: null,\r
            crosshairs_style: null,\r
            left_sidebar_scroll: null,\r
            right_sidebar_scroll: null,\r
            sidebar_scroll_arrows: null,\r
            units: null,\r
            stats_energy_unit: null,\r
            adsb_warning_style: null,\r
        },\r
        alarms: {\r
            rssi: null,\r
            batt_cap: null,\r
            fly_minutes: null,\r
            max_altitude: null,\r
            dist: null,\r
            max_neg_altitude: null,\r
            gforce: null,\r
            gforce_axis_min: null,\r
            gforce_axis_max: null,\r
            current: null,\r
            imu_temp_alarm_min: null,\r
            imu_temp_alarm_max: null,\r
            baro_temp_alarm_min: null,\r
            baro_temp_alarm_max: null,\r
            adsb_distance_warning: null,\r
            adsb_distance_alert: null,\r
        },\r
        layouts: [],\r
        layout_count: 1, // This needs to be 1 for compatibility with < 2.0\r
        item_count: 0,\r
        items: [],\r
        groups: {},\r
        preview: []\r
    };\r
};\r
\r
OSD.DjiElements =  {\r
    supported: [\r
        "RSSI_VALUE",\r
        "MAIN_BATT_VOLTAGE",\r
        "MAIN_BATT_CELL_VOLTAGE",\r
        "CRAFT_NAME",\r
        "FLYMODE",\r
        "ESC_TEMPERATURE",\r
        "ALTITUDE",\r
        "VERTICAL_SPEED_INDICATOR",\r
        "CROSSHAIRS",\r
        "HORIZON_SIDEBARS",\r
        "PITCH_ANGLE",\r
        "ROLL_ANGLE",\r
        "CURRENT_DRAW",\r
        "MAH_DRAWN",\r
        "GPS_SPEED",\r
        "GPS_SATS",\r
        "LONGITUDE",\r
        "LATITUDE",\r
        "DIRECTION_TO_HOME",\r
        "DISTANCE_TO_HOME"\r
    ],\r
    emptyGroups: [\r
        "MapsAndRadars",\r
        "GForce",\r
        "Timers",\r
        "VTX",\r
        "RX",\r
        "SwitchIndicators",\r
        "OSDCustomElements",\r
        "GVars",\r
        "PIDs",\r
        "PIDOutputs",\r
        "PowerLimits"\r
    ],\r
    supportedSettings: [\r
        "craft_name",\r
        "units"\r
    ],\r
    supportedAlarms: [\r
        "rssi_alarm",\r
        "osd_alt_alarm"\r
    ],\r
    craftNameElements: [\r
        "MESSAGES",\r
        "THROTTLE_GAUGE",\r
        "THROTTLE_POSITION",\r
        "SCALED_THROTTLE_POSITION",\r
        "3D_SPEED",\r
        "EFFICIENCY_MAH",\r
        "TRIP_DIST"\r
    ]\r
};\r
\r
OSD.constants = {\r
    VISIBLE: 0x2000,\r
    VIDEO_TYPES: [\r
        'AUTO',\r
        'PAL',\r
        'NTSC',\r
        'HDZERO',\r
        'DJIWTF',\r
        'AVATAR',\r
        'BF43COMPAT',\r
        'BFHDCOMPAT',\r
        'DJI_NATIVE'\r
    ],\r
    VIDEO_LINES: {\r
        PAL: 16,\r
        NTSC: 13,\r
        HDZERO: 18,\r
        DJIWTF: 22,\r
        AVATAR: 20,\r
        BF43COMPAT: 16,\r
        BFHDCOMPAT: 20,\r
        DJI_NATIVE: 20\r
    },\r
    VIDEO_COLS: {\r
        PAL: 30,\r
        NTSC: 30,\r
        HDZERO: 50,\r
        DJIWTF: 60,\r
        AVATAR: 53,\r
        BF43COMPAT: 30,\r
        BFHDCOMPAT: 53,\r
        DJI_NATIVE: 53,\r
    },\r
    VIDEO_BUFFER_CHARS: {\r
        PAL: 480,\r
        NTSC: 390,\r
        HDZERO: 900,\r
        DJIWTF: 1320,\r
        AVATAR: 1060,\r
        BF43COMPAT: 480,\r
        BFHDCOMPAT: 1060,\r
        DJI_NATIVE: 1060\r
    },\r
    UNIT_TYPES: [\r
        {name: 'osdUnitImperial', value: 0},\r
        {name: 'osdUnitMetric', value: 1},\r
        {name: 'osdUnitMetricMPH', tip: 'osdUnitMetricMPHTip', value: 2},\r
        {name: 'osdUnitUK', tip: 'osdUnitUKTip', value: 3},\r
        {name: 'osdUnitGA', tip: 'osdUnitGATip', value: 4},\r
    ],\r
    AHISIDEBARWIDTHPOSITION: 7,\r
    AHISIDEBARHEIGHTPOSITION: 3,\r
\r
    ADSB_WARNING_STYLE: {\r
        'COMPACT' : 0,\r
        'EXTENDED' : 1,\r
    },\r
\r
    ALL_ALARMS: [\r
        {\r
            name: 'RSSI',\r
            field: 'rssi',\r
            unit: '%',\r
            min: 0,\r
            max: 100\r
        },\r
        {\r
            name: 'BATT_CAP',\r
            field: 'batt_cap',\r
            unit: 'mah',\r
            min: 0,\r
            max: 4294967295\r
        },\r
        {\r
            name: 'FLY_MINUTES',\r
            field: 'fly_minutes',\r
            unit: 'minutes',\r
            min: 0,\r
            max: 600\r
        },\r
        {\r
            name: 'MAX_ALTITUDE',\r
            field: 'max_altitude',\r
            unit: altitude_alarm_unit,\r
            to_display: altitude_alarm_display_function(altitude_alarm_to_display),\r
            from_display: altitude_alarm_display_function(altitude_alarm_from_display),\r
            min: 0,\r
            max: altitude_alarm_max\r
        },\r
        {\r
            name: 'MAX_NEG_ALTITUDE',\r
            field: 'max_neg_altitude',\r
            unit: altitude_alarm_unit,\r
            to_display: altitude_alarm_to_display,\r
            from_display: altitude_alarm_from_display,\r
            min: 0,\r
            max: altitude_alarm_max\r
        },\r
\r
        {\r
            name: 'DIST',\r
            field: 'dist',\r
            unit: function(osd_data) {\r
                switch (OSD.data.preferences.units) {\r
                    case 0: // Imperial\r
                    case 3: // UK\r
                        return 'mi';\r
                    case 4: // GA\r
                        return 'NM';\r
                    default: // Metric\r
                        return 'm';\r
                }\r
            },\r
            to_display: function(osd_data, value) {\r
                switch (OSD.data.preferences.units) {\r
                    case 0: // Imperial\r
                    case 3: // UK\r
                        // meters to miles\r
                        return (value / 1609.344).toFixed(2);\r
                    case 4: // GA\r
                        // metres to nautical miles\r
                        return (value / 1852.001).toFixed(2);\r
                    default: // Metric\r
                        return value;\r
                }\r
            },\r
            from_display: function(osd_data, value) {\r
                switch (OSD.data.preferences.units) {\r
                    case 0: // Imperial\r
                    case 3: // UK\r
                        // miles to meters\r
                        return Math.round(value * 1609.344);\r
                    case 4: // GA\r
                        return Math.round(value * 1852.001);\r
                    default: // Metric\r
                        return value;\r
                }\r
            },\r
            step: function(osd_data) {\r
                switch (OSD.data.preferences.units) {\r
                    case 0: // Imperial\r
                    case 3: // UK\r
                    case 4: // GA\r
                        return 0.01;\r
                    default: // Metric\r
                        return 1;\r
                }\r
            },\r
            min: 0,\r
            max: function(osd_data) {\r
                var meters_max = 50000;\r
                switch (OSD.data.preferences.units) {\r
                    case 0: // Imperial\r
                    case 3: // UK\r
                        // Meters max to miles max\r
                        return Math.trunc(meters_max / 1609.344);\r
                    case 4: // GA\r
                        // Meters max to nautical miles max\r
                        return Math.trunc(meters_max / 1852.001);\r
                    default: // Metric\r
                        return meters_max;\r
                }\r
            }\r
        },\r
        {\r
            name: 'GFORCE',\r
            field: 'gforce',\r
            min_version: '2.2.0',\r
            step: 0.1,\r
            unit: 'g',\r
            to_display: function(osd_data, value) { return value / 1000 },\r
            from_display: function(osd_data, value) { return value * 1000 },\r
            min: 0,\r
            max: 20\r
        },\r
        {\r
            name: 'GFORCE_AXIS_MIN',\r
            field: 'gforce_axis_min',\r
            min_version: '2.2.0',\r
            step: 0.1,\r
            unit: 'g',\r
            to_display: function(osd_data, value) { return value / 1000 },\r
            from_display: function(osd_data, value) { return value * 1000 },\r
            min: -20,\r
            max: 20\r
        },\r
        {\r
            name: 'GFORCE_AXIS_MAX',\r
            field: 'gforce_axis_max',\r
            min_version: '2.2.0',\r
            step: 0.1,\r
            unit: 'g',\r
            to_display: function(osd_data, value) { return value / 1000 },\r
            from_display: function(osd_data, value) { return value * 1000 },\r
            min: -20,\r
            max: 20\r
        },\r
        {\r
            name: 'CURRENT',\r
            field: 'current',\r
            min_version: '2.2.0',\r
            step: 1,\r
            unit: 'A',\r
            min: 0,\r
            max: 255\r
        },\r
        {\r
            name: 'IMU_TEMPERATURE_MIN',\r
            field: 'imu_temp_alarm_min',\r
            unit: '°C',\r
            step: 0.5,\r
            to_display: function(osd_data, value) { return value / 10 },\r
            from_display: function(osd_data, value) { return value * 10 },\r
            min: -55,\r
            max: 125\r
        },\r
        {\r
            name: 'IMU_TEMPERATURE_MAX',\r
            field: 'imu_temp_alarm_max',\r
            step: 0.5,\r
            unit: '°C',\r
            to_display: function(osd_data, value) { return value / 10 },\r
            from_display: function(osd_data, value) { return value * 10 },\r
            min: -55,\r
            max: 125\r
        },\r
        {\r
            name: 'BARO_TEMPERATURE_MIN',\r
            field: 'baro_temp_alarm_min',\r
            step: 0.5,\r
            unit: '°C',\r
            to_display: function(osd_data, value) { return value / 10 },\r
            from_display: function(osd_data, value) { return value * 10 },\r
            min: -55,\r
            max: 125\r
        },\r
        {\r
            name: 'BARO_TEMPERATURE_MAX',\r
            field: 'baro_temp_alarm_max',\r
            step: 0.5,\r
            unit: '°C',\r
            to_display: function(osd_data, value) { return value / 10 },\r
            from_display: function(osd_data, value) { return value * 10 },\r
            min: -55,\r
            max: 125\r
        },\r
        {\r
            name: 'ADSB_MAX_DISTANCE_WARNING',\r
            field: 'adsb_distance_warning',\r
            step: 1,\r
            unit: "meters",\r
            min: 1,\r
            max: 64000,\r
            min_version: '7.1.0',\r
        },\r
        {\r
            name: 'ADSB_MAX_DISTANCE_ALERT',\r
            field: 'adsb_distance_alert',\r
            step: 1,\r
            unit: "meters",\r
            min: 1,\r
            max: 64000,\r
            min_version: '7.1.0',\r
        },\r
    ],\r
\r
    // All display fields, from every version, do not remove elements, only add!\r
    ALL_DISPLAY_GROUPS: [\r
        {\r
            name: 'osdGroupGeneral',\r
            items: [\r
                {\r
                    name: 'RSSI_VALUE',\r
                    id: 0,\r
                    preview: FONT.symbol(SYM.RSSI) + '99'\r
                },\r
                {\r
                    name: 'MAIN_BATT_VOLTAGE',\r
                    id: 1,\r
                    preview: osdDecimalsMainBatteryPreview,\r
                },\r
                {\r
                    name: 'SAG_COMP_MAIN_BATT_VOLTAGE',\r
                    id: 53,\r
                    preview: osdDecimalsMainBatteryPreview,\r
                },\r
                {\r
                    name: 'MAIN_BATT_CELL_VOLTAGE',\r
                    id: 32,\r
                    preview: FONT.symbol(SYM.BATT) + FONT.embed_dot('3.90') + FONT.symbol(SYM.VOLT)\r
                },\r
                {\r
                    name: 'SAG_COMP_MAIN_BATT_CELL_VOLTAGE',\r
                    id: 54,\r
                    preview: FONT.symbol(SYM.BATT) + FONT.embed_dot('4.18') + FONT.symbol(SYM.VOLT)\r
                },\r
                {\r
                    name: 'POWER_SUPPLY_IMPEDANCE',\r
                    id: 55,\r
                    preview: ' 23' + FONT.symbol(SYM.MILLIOHM)\r
                },\r
                {\r
                    name: 'MAIN_BATT_REMAINING_PERCENTAGE',\r
                    id: 38,\r
                    preview: FONT.symbol(SYM.BATT) + '100%'\r
                },\r
                {\r
                    name: 'REMAINING_FLIGHT_TIME',\r
                    id: 48,\r
                    preview: FONT.symbol(SYM.FLIGHT_MINS_REMAINING) + '10:35'\r
                },\r
                {\r
                    name: 'REMAINING_FLIGHT_DISTANCE',\r
                    id: 49,\r
                    preview: osdDecimalsRemainingFlightDistancePreview,\r
                },\r
                {\r
                    name: 'THROTTLE_GAUGE',\r
                    id: 168,\r
                    preview: FONT.symbol(SYM.THROTTLE_GAUGE_EMPTY) + '\\n' +\r
                        FONT.symbol(SYM.THROTTLE_GAUGE_EMPTY) + '\\n' +\r
                        FONT.symbol(SYM.THROTTLE_GAUGE_FULL) + '\\n' +\r
                        FONT.symbol(SYM.THROTTLE_GAUGE_FULL) + '\\n' +\r
                        FONT.symbol(SYM.THROTTLE_GAUGE_FULL) + '\\n'\r
                },\r
                {\r
                    name: 'THROTTLE_POSITION',\r
                    id: 9,\r
                    preview: ' ' + FONT.symbol(SYM.THR) + ' 69'\r
                },\r
                {\r
                    name: 'SCALED_THROTTLE_POSITION',\r
                    id: 33,\r
                    preview: FONT.symbol(SYM.SCALE) + FONT.symbol(SYM.THR) + ' 51'\r
                },\r
                {\r
                    name: 'CRAFT_NAME',\r
                    id: 8,\r
                    preview: '[CRAFT_NAME]'\r
                },\r
                {\r
                    name: 'PILOT_NAME',\r
                    id: 142,\r
                    preview: '[PILOT_NAME]'\r
                },\r
                {\r
                    name: 'PILOT_LOGO',\r
                    id: 146,\r
                    preview: FONT.symbol(SYM.PILOT_LOGO_SML_L) + FONT.symbol(SYM.PILOT_LOGO_SML_C) + FONT.symbol(SYM.PILOT_LOGO_SML_R)\r
                },\r
                {\r
                    name: 'FLYMODE',\r
                    id: 7,\r
                    preview: 'ACRO'\r
                },\r
                {\r
                    name: 'MESSAGES',\r
                    id: 30,\r
                    preview: '       SYSTEM MESSAGE       ', // 28 chars, like OSD_MESSAGE_LENGTH on osd.c\r
                },\r
                {\r
                    name: 'HEADING',\r
                    id: 24,\r
                    preview: FONT.symbol(SYM.HEADING) + '175' + FONT.symbol(SYM.DEGREES)\r
                },\r
                {\r
                    name: 'HEADING_GRAPH',\r
                    id: 34,\r
                    preview: FONT.symbol(SYM.HEADING_W) +\r
                        FONT.symbol(SYM.HEADING_LINE) +\r
                        FONT.symbol(SYM.HEADING_DIVIDED_LINE) +\r
                        FONT.symbol(SYM.HEADING_LINE) +\r
                        FONT.symbol(SYM.HEADING_N) +\r
                        FONT.symbol(SYM.HEADING_LINE) +\r
                        FONT.symbol(SYM.HEADING_DIVIDED_LINE) +\r
                        FONT.symbol(SYM.HEADING_LINE) +\r
                        FONT.symbol(SYM.HEADING_E)\r
                },\r
                {\r
                    name: 'AIR_SPEED',\r
                    id: 27,\r
                    enabled: function() {\r
                        return HARDWARE.capabilities.usePitot;\r
                    },\r
                    preview: function(osd_data) {\r
                        var speed;\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                            case 3: // UK\r
                                speed = '115' + FONT.symbol(SYM.MPH);\r
                                break;\r
                            case 4: // GA\r
                                speed = '100' + FONT.symbol(SYM.KT);\r
                                break;\r
                            default: // Metric\r
                                speed = '185' + FONT.symbol(SYM.KMH);\r
                                break;\r
                        }\r
\r
                        return FONT.symbol(SYM.AIR) + speed;\r
                    }\r
                },\r
                {\r
                    name: 'MIN_GROUND_SPEED',\r
                    id: 167,\r
                    preview: function(osd_data) {\r
                        var speed;\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                            case 3: // UK\r
                                speed = ' 22' + FONT.symbol(SYM.MPH);\r
                                break;\r
                            case 4: // GA\r
                                speed = ' 19' + FONT.symbol(SYM.KT);\r
                                break;\r
                            default: // Metric\r
                                speed = ' 35' + FONT.symbol(SYM.KMH);\r
                                break;\r
                        }\r
\r
                        return FONT.symbol(SYM.MIN_GND_SPEED) + speed;\r
                    }\r
                },\r
                {\r
                    name: 'AIR_MAX_SPEED',\r
                    id: 127,\r
                    enabled: function() {\r
                        return HARDWARE.capabilities.usePitot;\r
                    },\r
                    preview: function(osd_data) {\r
                        // 3 chars\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                            case 3: // UK\r
                                return FONT.symbol(SYM.MAX) + FONT.symbol(SYM.AIR) + FONT.embed_dot('135') + FONT.symbol(SYM.MPH);\r
                            case 4: // GA\r
                                return FONT.symbol(SYM.MAX) + FONT.symbol(SYM.AIR) + FONT.embed_dot('177') + FONT.symbol(SYM.KT);\r
                            default: // Metric\r
                                return FONT.symbol(SYM.MAX) + FONT.symbol(SYM.AIR) + FONT.embed_dot('217') + FONT.symbol(SYM.KMH);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'RTC_TIME',\r
                    id: 29,\r
                    preview: FONT.symbol(SYM.CLOCK) + '13:37:25'\r
                },\r
                {\r
                    name: 'RC_SOURCE',\r
                    id: 104,\r
                    preview: 'MSP'\r
                },\r
                {\r
                    name: 'ESC_RPM',\r
                    id: 106,\r
                    min_version: '2.3.0',\r
                    enabled: function() {\r
                        return HARDWARE.capabilities.useESCTelemetry;\r
                    },\r
                    preview: function(){\r
                        let rpmPreview = '112974'.substr((6 - parseInt(Settings.getInputValue('osd_esc_rpm_precision'))));\r
                        return FONT.symbol(SYM.RPM) + rpmPreview;\r
                    }\r
                },\r
                {\r
                    name: 'GLIDESLOPE',\r
                    id: 124,\r
                    min_version: '3.0.0',\r
                    preview: FONT.symbol(SYM.GLIDESLOPE) + FONT.embed_dot('12.3'),\r
                },\r
                {\r
                    name: 'GLIDE_TIME',\r
                    id: 136,\r
                    min_version: '5.0.0',\r
                    preview: FONT.symbol(SYM.GLIDE_MINS) + '02:34',\r
                },\r
                {\r
                    name: 'GLIDE_RANGE',\r
                    id: 137,\r
                    min_version: '5.0.0',\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                                return FONT.symbol(SYM.GLIDE_RANGE) + FONT.embed_dot(' 12') + FONT.symbol(SYM.MI);\r
                            case 4: // GA\r
                                return FONT.symbol(SYM.GLIDE_RANGE) + FONT.embed_dot(' 11') + FONT.symbol(SYM.NM);\r
                            default: // Metric & Metric + MPH\r
                                return FONT.symbol(SYM.GLIDE_RANGE) + FONT.embed_dot(' 21') + FONT.symbol(SYM.KM);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'PAN_SERVO_CENTRED',\r
                    id: 143,\r
                    min_version: '6.0.0',\r
                    preview: FONT.symbol(SYM.PAN_SERVO_IS_OFFSET_L) + '120' + FONT.symbol(SYM.DEGREES)\r
                },\r
                {\r
                    name: 'MISSION INFO',\r
                    id: 129,\r
                    min_version: '4.0.0',\r
                    preview: 'M1/6>101WP'\r
                },\r
                {\r
                    name: 'VERSION',\r
                    id: 119,\r
                    min_version: '3.0.0',\r
                    preview: 'INAV 2.7.0'\r
                },\r
                {\r
                    name: 'MULTI FUNCTION STATUS',\r
                    id: 144,\r
                    min_version: '6.0.0',\r
                    preview: '0 WARNINGS'\r
                },\r
                {\r
                    name: 'BLACKBOX',\r
                    id: 152,\r
                    min_version: '8.0.0',\r
                    preview: function(osd_data) {\r
                        return FONT.symbol(SYM.BLACKBOX) + FONT.embed_dot('000123');\r
                    }\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupTemperature',\r
            items: [\r
                {\r
                    name: 'IMU_TEMPERATURE',\r
                    id: 86,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return FONT.symbol(SYM.IMU_TEMP) + ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return FONT.symbol(SYM.IMU_TEMP) + ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'BARO_TEMPERATURE',\r
                    id: 87,\r
                    enabled: function() {\r
                        return HARDWARE.capabilities.useBaro;\r
                    },\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return FONT.symbol(SYM.BARO_TEMP) + ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return FONT.symbol(SYM.BARO_TEMP) + ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'ESC_TEMPERATURE',\r
                    id: 107,\r
                    min_version: '2.5.0',\r
                    enabled: function() {\r
                        return HARDWARE.capabilities.useESCTelemetry;\r
                    },\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return FONT.symbol(SYM.ESC_TEMPERATURE) + ' 98' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return FONT.symbol(SYM.ESC_TEMPERATURE) + ' 38' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'SENSOR1_TEMPERATURE',\r
                    id: 88,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'SENSOR2_TEMPERATURE',\r
                    id: 89,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'SENSOR3_TEMPERATURE',\r
                    id: 90,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'SENSOR4_TEMPERATURE',\r
                    id: 91,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'SENSOR5_TEMPERATURE',\r
                    id: 92,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'SENSOR6_TEMPERATURE',\r
                    id: 93,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'SENSOR7_TEMPERATURE',\r
                    id: 94,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'SENSOR8_TEMPERATURE',\r
                    id: 95,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                                return ' 90' + FONT.symbol(SYM.TEMP_F);\r
                            default: // Metric\r
                                return ' 32' + FONT.symbol(SYM.TEMP_C);\r
                        }\r
                    }\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupAltitude',\r
            // TODO: Make this disappear when there's no baro and no GPS.\r
            // Requires not drawing these indicators in INAV even when enabled\r
            // if there are no sensors to provide their data. Currently they're\r
            // always drawn as long as BARO or NAV support is compiled in.\r
            items: [\r
                {\r
                    name: 'ALTITUDE',\r
                    id: 15,\r
                    preview: osdDecimalsAltitudePreview,\r
                },\r
                {\r
                    name: 'VARIO',\r
                    id: 25,\r
                    preview: FONT.symbol(SYM.VARIO_UP_2A) + '\\n' +\r
                        FONT.symbol(SYM.VARIO_UP_2A) + '\\n' +\r
                        FONT.symbol(SYM.VARIO_UP_2A) + '\\n' +\r
                        FONT.symbol(SYM.VARIO_UP_2A) + '\\n' +\r
                        FONT.symbol(SYM.VARIO_UP_2A) + '\\n'\r
                },\r
                {\r
                    name: 'VERTICAL_SPEED_INDICATOR',\r
                    id: 26,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                                return FONT.embed_dot('-1.6') + FONT.symbol(SYM.FT_S);\r
                            case 4: // GA\r
                                return FONT.embed_dot('-2.6') + FONT.symbol(SYM.HUND_FTM);\r
                            default: // Metric\r
                                return FONT.embed_dot('-0.5') + FONT.symbol(SYM.M_S);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'OSD_RANGEFINDER',\r
                    id: 120,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                                return FONT.embed_dot('15.9') + FONT.symbol(SYM.DIST_MI);\r
                            case 4: // GA\r
                                return FONT.embed_dot('13.8') + FONT.symbol(SYM.DIST_NM);\r
                            default: // Metric\r
                                return FONT.embed_dot('25.6') + FONT.symbol(SYM.DIST_KM);\r
                        }\r
                    }\r
                }\r
            ]\r
        },\r
        {\r
            name: 'osdGroupGForce',\r
            items: [\r
                {\r
                    name: 'G_FORCE',\r
                    id: 100,\r
                    min_version: '2.2.0',\r
                    preview: FONT.symbol(SYM.GFORCE) + FONT.embed_dot('1.00')\r
                },\r
                {\r
                    name: 'G_FORCE_X',\r
                    id: 101,\r
                    min_version: '2.2.0',\r
                    preview: FONT.symbol(SYM.GFORCE_X) + FONT.embed_dot('-0.10')\r
                },\r
                {\r
                    name: 'G_FORCE_Y',\r
                    id: 102,\r
                    min_version: '2.2.0',\r
                    preview: FONT.symbol(SYM.GFORCE_Y) + FONT.embed_dot('-0.20')\r
                },\r
                {\r
                    name: 'G_FORCE_Z',\r
                    id: 103,\r
                    min_version: '2.2.0',\r
                    preview: FONT.symbol(SYM.GFORCE_Z) + FONT.embed_dot('-0.30')\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupTimers',\r
            items: [\r
                {\r
                    name: 'ONTIME_FLYTIME',\r
                    id: 28,\r
                    preview: FONT.symbol(SYM.FLY_M) + '04:11'\r
                },\r
                {\r
                    name: 'ONTIME',\r
                    id: 5,\r
                    preview: FONT.symbol(SYM.ON_M) + '04:11'\r
                },\r
                {\r
                    name: 'FLYTIME',\r
                    id: 6,\r
                    preview: FONT.symbol(SYM.FLY_M) + '04:11'\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupAttitude',\r
            items: [\r
                {\r
                    name: 'CROSSHAIRS',\r
                    id: 2,\r
                    positionable: false\r
                },\r
                {\r
                    name: 'ARTIFICIAL_HORIZON',\r
                    id: 3,\r
                    positionable: false\r
                },\r
                {\r
                    name: 'HORIZON_SIDEBARS',\r
                    id: 4,\r
                    positionable: false\r
                },\r
                {\r
                    name: 'PITCH_ANGLE',\r
                    id: 41,\r
                    preview: function () {\r
                        return FONT.symbol(SYM.PITCH_UP) + FONT.embed_dot(' 1.5');\r
                    },\r
                },\r
                {\r
                    name: 'ROLL_ANGLE',\r
                    id: 42,\r
                    preview: function () {\r
                        return FONT.symbol(SYM.ROLL_LEFT) + FONT.embed_dot('31.4');\r
                    },\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupCurrentMeter',\r
            enabled: function() {\r
                return FC.isFeatureEnabled('CURRENT_METER');\r
            },\r
            items: [\r
                {\r
                    name: 'CURRENT_DRAW',\r
                    id: 11,\r
                    preview: function() {\r
                        return FONT.embed_dot('42.1') + FONT.symbol(SYM.AMP);\r
                    }\r
                },\r
                {\r
                    name: 'MAH_DRAWN',\r
                    id: 12,\r
                    preview: function() {\r
                        return osdmAhPrecisionPreview();\r
                    }\r
                },\r
                {\r
                    name: 'WH_DRAWN',\r
                    id: 36,\r
                    preview: function() {\r
                        return FONT.embed_dot('1.25') + FONT.symbol(SYM.WH);\r
                    }\r
                },\r
                {\r
                    name: 'POWER',\r
                    id: 19,\r
                    preview: function() {\r
                        return ' 69' + FONT.symbol(SYM.WATT); // 3 chars\r
                    }\r
                },\r
                {\r
                    name: 'MAIN_BATT_REMAINING_CAPACITY',\r
                    id: 37,\r
                    preview: function() {\r
                        return osdmAhPrecisionPreview();\r
                    }\r
                },\r
                {\r
                    name: 'EFFICIENCY_MAH',\r
                    id: 35,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                                return '116' + FONT.symbol(SYM.MAH_MI_0) + FONT.symbol(SYM.MAH_MI_1);\r
                            case 4: // GA\r
                                return '101' + FONT.symbol(SYM.MAH_NM_0) + FONT.symbol(SYM.MAH_NM_1);\r
                            default: // Metric\r
                                return '187' + FONT.symbol(SYM.MAH_KM_0) + FONT.symbol(SYM.MAH_KM_1);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'EFFICIENCY_WH',\r
                    id: 39,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                                return FONT.embed_dot('0.76') + FONT.symbol(SYM.WH_MI);\r
                            case 4: // GA\r
                                return FONT.embed_dot('0.66') + FONT.symbol(SYM.WH_NM);\r
                            default: // Metric\r
                                return FONT.embed_dot('1.23') + FONT.symbol(SYM.WH_KM);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'CLIMB_EFFICIENCY',\r
                    id: 138,\r
                    min_version: '5.0.0',\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                            case 4: // GA\r
                                return FONT.embed_dot('0.76') + FONT.symbol(SYM.AH_V_FT_0) + FONT.symbol(SYM.AH_V_FT_1);\r
                            default: // Metric & Metric + MPH\r
                                return FONT.embed_dot('1.23') + FONT.symbol(SYM.AH_V_M_0) + FONT.symbol(SYM.AH_V_M_1);\r
                        }\r
                    }\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupPowerLimits',\r
            items: [\r
                {\r
                    name: 'PLIMIT_REMAINING_BURST_TIME',\r
                    id: 121,\r
                    preview: FONT.embed_dot('10.0S')\r
                },\r
                {\r
                    name: 'PLIMIT_ACTIVE_CURRENT_LIMIT',\r
                    id: 122,\r
                    preview: FONT.embed_dot('42.1') + FONT.symbol(SYM.AMP)\r
                },\r
                {\r
                    name: 'PLIMIT_ACTIVE_POWER_LIMIT',\r
                    id: 123,\r
                    preview: '500' + FONT.symbol(SYM.WATT)\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupGPS',\r
            enabled: function() {\r
                return FC.isFeatureEnabled('GPS');\r
            },\r
            items: [\r
                {\r
                    name: 'MSL_ALTITUDE',\r
                    id: 96,\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                            case 4: // GA\r
                                return ' 375' + FONT.symbol(SYM.ALT_FT);\r
                            default: // Metric\r
                                return ' 114' + FONT.symbol(SYM.ALT_M);\r
                        }\r
                    },\r
                },\r
                {\r
                    name: 'GPS_SPEED',\r
                    id: 13,\r
                    preview: function(osd_data) {\r
                        // 3 chars\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                            case 3: // UK\r
                                return FONT.embed_dot('115') + FONT.symbol(SYM.MPH);\r
                            case 4: // GA\r
                                return FONT.embed_dot('100') + FONT.symbol(SYM.KT);\r
                            default: // Metric\r
                                return FONT.embed_dot('185') + FONT.symbol(SYM.KMH);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: '3D_SPEED',\r
                    id: 85,\r
                    preview: function(osd_data) {\r
                        // 3 chars\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                            case 3: // UK\r
                                return FONT.embed_dot('127') + FONT.symbol(SYM.MPH_3D);\r
                            case 4: // GA\r
                                return FONT.embed_dot('110') + FONT.symbol(SYM.KT_3D);\r
                            default: // Metric\r
                                return FONT.embed_dot('204') + FONT.symbol(SYM.KMH_3D);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'GPS_MAX_SPEED',\r
                    id: 125,\r
                    preview: function(osd_data) {\r
                        // 3 chars\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                            case 3: // UK\r
                                return FONT.symbol(SYM.MAX) + FONT.embed_dot('138') + FONT.symbol(SYM.MPH);\r
                            case 4: // GA\r
                                return FONT.symbol(SYM.MAX) + FONT.embed_dot('120') + FONT.symbol(SYM.KT);\r
                            default: // Metric\r
                                return FONT.symbol(SYM.MAX) + FONT.embed_dot('222') + FONT.symbol(SYM.KMH);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: '3D_MAX_SPEED',\r
                    id: 126,\r
                    preview: function(osd_data) {\r
                        // 3 chars\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                            case 3: // UK\r
                                return FONT.symbol(SYM.MAX) + FONT.embed_dot('150') + FONT.symbol(SYM.MPH_3D);\r
                            case 4: // GA\r
                                return FONT.symbol(SYM.MAX) + FONT.embed_dot('130') + FONT.symbol(SYM.KT_3D);\r
                            default: // Metric\r
                                return FONT.symbol(SYM.MAX) + FONT.embed_dot('241') + FONT.symbol(SYM.KMH_3D);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'GPS_SATS',\r
                    id: 14,\r
                    preview: FONT.symbol(SYM.GPS_SAT1) + FONT.symbol(SYM.GPS_SAT2) + '14'\r
                },\r
                {\r
                    name: 'LONGITUDE',\r
                    id: 20,\r
                    preview: osdCoordinatePreview(SYM.LON, -114.7652134),\r
                },\r
                {\r
                    name: 'LATITUDE',\r
                    id: 21,\r
                    preview: osdCoordinatePreview(SYM.LAT, 52.9872367),\r
                },\r
                {\r
                    name: 'PLUS_CODE',\r
                    id: 97,\r
                    preview: function() {\r
                        let digits = parseInt(Settings.getInputValue('osd_plus_code_digits')) + 1;\r
                        let digitsRemoved = parseInt(Settings.getInputValue('osd_plus_code_short')) * 2;\r
                        console.log("DITIS", digits);\r
                        return '9547X6PM+VWCCC'.substr(digitsRemoved, digits-digitsRemoved);\r
                    }\r
                },\r
                {\r
                    name: 'DIRECTION_TO_HOME',\r
                    id: 22,\r
                    preview: FONT.symbol(SYM.DIR_TO_HOME)\r
                },\r
                {\r
                    name: 'HOME_HEADING_ERROR',\r
                    id: 50,\r
                    preview: FONT.symbol(SYM.HOME) + FONT.symbol(SYM.HEADING) + ' -10' + FONT.symbol(SYM.DEGREES)\r
                },\r
                {\r
                    name: 'AZIMUTH',\r
                    id: 108,\r
                    preview: FONT.symbol(SYM.AZIMUTH) + '120' + FONT.symbol(SYM.DEGREES)\r
                },\r
                {\r
                    name: 'DISTANCE_TO_HOME',\r
                    id: 23,\r
                    preview: osdDecimalsHomeDistancePreview,\r
                },\r
                {\r
                    name: 'TRIP_DIST',\r
                    id: 40,\r
                    min_version: '1.9.1',\r
                    preview: osdDecimalsTripDistancePreview,\r
                },\r
                {\r
                    name: 'ODOMETER',\r
                    id: 145,\r
                    min_version: '6.1.0',\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                                return FONT.symbol(SYM.ODOMETER) + FONT.embed_dot('00016.9') + FONT.symbol(SYM.DIST_MI);\r
                            case 4: // GA\r
                                return FONT.symbol(SYM.ODOMETER) + FONT.embed_dot('00014.7') + FONT.symbol(SYM.DIST_NM);\r
                            default: // Metric\r
                                return FONT.symbol(SYM.ODOMETER) + FONT.embed_dot('00027.2') + FONT.symbol(SYM.DIST_KM);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'GPS_HDOP',\r
                    id: 31,\r
                    preview: FONT.symbol(SYM.GPS_HDP1) + FONT.symbol(SYM.GPS_HDP2) + FONT.embed_dot('1.8')\r
                },\r
                {\r
                    name: 'WIND_SPEED_HORIZONTAL',\r
                    id: 46,\r
                    preview: function(osd_data) {\r
                        // 6 chars\r
                        var p = FONT.symbol(SYM.WIND_SPEED_HORIZONTAL) + FONT.symbol(SYM.DIRECTION + 1);\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                            case 3: // UK\r
                                p += FONT.embed_dot('3.27') + FONT.symbol(SYM.MPH);\r
                                break;\r
                            case 4: // GA\r
                                p += FONT.embed_dot('2.84') + FONT.symbol(SYM.KT);\r
                                break;\r
                            default: // Metric\r
                                p += FONT.embed_dot('5.26') + FONT.symbol(SYM.KMH);\r
                                break;\r
                        }\r
                        return p;\r
                    }\r
                },\r
                {\r
                    name: 'WIND_SPEED_VERTICAL',\r
                    id: 47,\r
                    preview: function(osd_data) {\r
                        // 6 chars\r
                        var p = FONT.symbol(SYM.WIND_SPEED_VERTICAL) + FONT.symbol(SYM.AH_DECORATION_UP);\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                            case 3: // UK\r
                                p += FONT.embed_dot('1.03') + FONT.symbol(SYM.MPH);\r
                                break;\r
                            case 4: // GA\r
                                p += FONT.embed_dot('0.90') + FONT.symbol(SYM.KT);\r
                                break;\r
                            default: // Metric\r
                                p += FONT.embed_dot('1.66') + FONT.symbol(SYM.KMH);\r
                                break;\r
                        }\r
                        return p;\r
                    }\r
                },\r
                {\r
                    name: 'COURSE_HOLD_ERROR',\r
                    id: 51,\r
                    preview: FONT.symbol(SYM.HEADING) + '  5' + FONT.symbol(SYM.DEGREES)\r
                },\r
                {\r
                    name: 'COURSE_HOLD_ADJUSTMENT',\r
                    id: 52,\r
                    preview: FONT.symbol(SYM.HEADING) + ' -90' + FONT.symbol(SYM.DEGREES)\r
                },\r
                {\r
                    name: 'GROUND COURSE',\r
                    id: 140,\r
                    min_version: '6.0.0',\r
                    preview: FONT.symbol(SYM.GROUND_COURSE) + '245' + FONT.symbol(SYM.DEGREES)\r
                },\r
                {\r
                    name: 'ADSB_WARNING_MESSAGE',\r
                    id: 150,\r
                    min_version: '7.1.0',\r
                    preview: function(osd_data) {\r
\r
                        var distanceSymbol;\r
                        var distanceSymbolSmaller;\r
                        var velocitySymbol;\r
\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 2: // Metric + MPH\r
                                distanceSymbol = SYM.KM;\r
                                distanceSymbolSmaller = SYM.M;\r
                                velocitySymbol = SYM.MPH;\r
                                break;\r
                            case 3: // UK\r
                                distanceSymbol = SYM.MI;\r
                                distanceSymbolSmaller = SYM.ALT_FT;\r
                                velocitySymbol = SYM.MPH;\r
                                break;\r
                            case 4: // GA\r
                                distanceSymbol = SYM.MI;\r
                                distanceSymbolSmaller = SYM.ALT_FT;\r
                                velocitySymbol = SYM.KT;\r
                                break;\r
                            default: // Metric\r
                                distanceSymbol = SYM.KM;\r
                                distanceSymbolSmaller = SYM.M;\r
                                velocitySymbol = SYM.KMH;\r
                                break;\r
                        }\r
\r
                        var el =  FONT.symbol(SYM.ADSB) + FONT.embed_dot('9.28') + FONT.symbol(distanceSymbol) + FONT.symbol(SYM.SYM_HUD_CARDINAL+5) + FONT.embed_dot('-423') + FONT.symbol(distanceSymbolSmaller);\r
                        if (OSD.data.preferences.adsb_warning_style !== null && OSD.data.preferences.adsb_warning_style === OSD.constants.ADSB_WARNING_STYLE.EXTENDED){\r
                            el +=  "\\n" + "HEAVY " + FONT.symbol(SYM.DIR_TO_HOME+1)+FONT.embed_dot('653') + FONT.symbol(velocitySymbol);\r
                        }\r
\r
                        return el;\r
                    },\r
                },\r
                {\r
                    name: 'ADSB_INFO',\r
                    id: 151,\r
                    min_version: '7.1.0',\r
                    preview: FONT.symbol(SYM.ADSB) + '2',\r
                },\r
                {\r
                    name: 'CROSS TRACK ERROR',\r
                    id: 141,\r
                    min_version: '6.0.0',\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                                return FONT.symbol(SYM.CROSS_TRACK_ERROR) + FONT.embed_dot('0.98') + FONT.symbol(SYM.DIST_MI);\r
                            case 4: // GA\r
                                return FONT.symbol(SYM.CROSS_TRACK_ERROR) + FONT.embed_dot('0.85') + FONT.symbol(SYM.DIST_NM);\r
                            default: // Metric\r
                                return FONT.symbol(SYM.CROSS_TRACK_ERROR) + FONT.embed_dot('1.57') + FONT.symbol(SYM.DIST_KM);\r
                        }\r
                    }\r
                },{\r
                    name: 'COURSE_NEXT_GEOZONE',\r
                    id: 163,\r
                    min_version: '8.0.0',\r
                    enabled: function() {\r
                        return FC.isFeatureEnabled('GEOZONE');\r
                    },\r
                    preview: FONT.symbol(SYM.DIR_TO_HOME)\r
                }, {\r
                    name: 'HOR_DIST_TO_NEXT_GEOZONE',\r
                    id: 164,\r
                    min_version: '8.0.0',\r
                    enabled: function() {\r
                        return FC.isFeatureEnabled('GEOZONE');\r
                    },\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                                return 'FD  ' + FONT.embed_dot('0.88') + FONT.symbol(SYM.DIST_MI);\r
                            case 4: // GA\r
                                return 'FD  ' + FONT.embed_dot('0.78') + FONT.symbol(SYM.DIST_NM);\r
                            default: // Metric\r
                                return 'FD  ' + FONT.embed_dot('1.42') + FONT.symbol(SYM.DIST_KM);\r
                        }\r
                    }\r
                },\r
                {\r
                    name: 'VERT_DIST_TO_NEXT_GEOZONE',\r
                    id: 165,\r
                    min_version: '8.0.0',\r
                    enabled: function() {\r
                        return FC.isFeatureEnabled('GEOZONE');\r
                    },\r
                    preview: function(osd_data) {\r
                        switch (OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                            case 4: // GA\r
                                return 'FD  466' + FONT.symbol(SYM.ALT_FT) + FONT.symbol(SYM.DIR_TO_HOME);\r
                            default: // Metric\r
                                return 'FD  142'  + FONT.symbol(SYM.ALT_M) + FONT.symbol(SYM.DIR_TO_HOME);\r
                        }\r
                    }\r
                }\r
            ]\r
        },\r
        {\r
            name: 'osdGroupMapsAndRadars',\r
            items: [\r
                {\r
                    name: 'MAP_NORTH',\r
                    id: 43,\r
                    positionable: false,\r
                },\r
                {\r
                    name: 'MAP_TAKEOFF',\r
                    id: 44,\r
                    positionable: false,\r
                },\r
                {\r
                    name: 'RADAR',\r
                    id: 45,\r
                    positionable: false,\r
                },\r
                {\r
                    name: 'MAP_SCALE',\r
                    id: 98,\r
                    preview: function(osd_data) {\r
                        var scale;\r
                        switch(OSD.data.preferences.units) {\r
                            case 0: // Imperial\r
                            case 3: // UK\r
                                scale = FONT.embed_dot("0.10") + FONT.symbol(SYM.MI);\r
                                break;\r
                            case 4: // GA\r
                                scale = FONT.embed_dot("0.08") + FONT.symbol(SYM.NM);\r
                                break;\r
                            default: // Metric\r
                                scale = "100" + FONT.symbol(SYM.M);\r
                                break;\r
                        }\r
                        return FONT.symbol(SYM.SCALE) + scale;\r
                    },\r
                },\r
                {\r
                    name: 'MAP_REFERENCE',\r
                    id: 99,\r
                    preview: FONT.symbol(SYM.DIRECTION) + '\\nN',\r
                },\r
                {\r
                    name: 'FORMATION_FLIGHT',\r
                    id: 153,\r
                    min_version: '8.0.0',\r
                    positionable: true,\r
                    preview:  function(osd_data) {\r
                        return FONT.symbol(SYM.DIRECTION) + 'B' + FONT.symbol(SYM.SYM_HUD_SIGNAL_3) + FONT.symbol(SYM.SYM_HUD_CARDINAL) + "\\n 150" + "\\n" + FONT.symbol(SYM.AH_DECORATION_UP) + " 27" ;\r
                    }\r
                },\r
            ],\r
        },\r
        {\r
            name: 'osdGroupVTX',\r
            items: [\r
                {\r
                    name: 'VTX_CHANNEL',\r
                    id: 10,\r
                    positionable: true,\r
                    preview: function(osd_data) {\r
                        return 'CH:F7:1';\r
                    },\r
                },\r
                {\r
                    name: 'VTX_POWER',\r
                    id: 105,\r
                    preview: FONT.symbol(SYM.VTX_POWER) + '1'\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupRx',\r
            enabled: function() {\r
                return HARDWARE.capabilities.useRx;\r
            },\r
            items: [\r
                {\r
                    name: 'RSSI_DBM',\r
                    id: 109,\r
                    positionable: true,\r
                    preview: FONT.symbol(SYM.RSSI) + '-100' + FONT.symbol(SYM.DBM)\r
                },\r
                {\r
                    name: 'LQ_UPLINK',\r
                    id: 110,\r
                    positionable: true,\r
                    preview: function(osd_data) {\r
                        var lqFormat;\r
                        if (HARDWARE.capabilities.useCRSF && Settings.getInputValue('osd_crsf_lq_format') == 1){\r
                            lqFormat = FONT.symbol(SYM.LQ) + '2:100';\r
                        } else if (HARDWARE.capabilities.useCRSF && Settings.getInputValue('osd_crsf_lq_format') == 2) {\r
                            lqFormat = FONT.symbol(SYM.LQ) + '300';\r
                        } else {\r
                            lqFormat = FONT.symbol(SYM.LQ) + '100';\r
                        }\r
                        return lqFormat;\r
                    }\r
                },\r
                {\r
                    name: 'LQ_DOWNLINK',\r
                    id: 159,\r
                    positionable: true,\r
                    preview: FONT.symbol(SYM.LQ) + '100' + FONT.symbol(SYM.AH_DECORATION_DOWN)\r
                },\r
                {\r
                    name: 'SNR_DB',\r
                    id: 111,\r
                    positionable: true,\r
                    preview: FONT.symbol(SYM.SNR) + '-12' + FONT.symbol(SYM.DB)\r
                },\r
                {\r
                    name: 'TX_POWER_UPLINK',\r
                    id: 112,\r
                    positionable: true,\r
                    preview: '  10' + FONT.symbol(SYM.MW)\r
                },\r
                {\r
                    name: 'RX_POWER_DOWNLINK',\r
                    id: 160,\r
                    positionable: true,\r
                    preview: '  10' + FONT.symbol(SYM.MW) + FONT.symbol(SYM.AH_DECORATION_DOWN)\r
                },\r
                {\r
                    name: 'RX_BAND',\r
                    id: 161,\r
                    positionable: true,\r
                    preview: FONT.symbol(SYM.RX_BAND) + '2.4G'\r
                },\r
                {\r
                    name: 'RX_MODE',\r
                    id: 162,\r
                    positionable: true,\r
                    preview: FONT.symbol(SYM.RX_MODE) + '150HZ '\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupSwitchIndicators',\r
            items: [\r
                {\r
                    name: 'SWITCH_INDICATOR_0',\r
                    id: 130,\r
                    positionable: true,\r
                    preview: 'SWI1' + FONT.symbol(SYM.SWITCH_INDICATOR_HIGH)\r
                },\r
                {\r
                    name: 'SWITCH_INDICATOR_1',\r
                    id: 131,\r
                    positionable: true,\r
                    preview: 'SWI2' + FONT.symbol(SYM.SWITCH_INDICATOR_HIGH)\r
                },\r
                {\r
                    name: 'SWITCH_INDICATOR_2',\r
                    id: 132,\r
                    positionable: true,\r
                    preview: 'SWI3' + FONT.symbol(SYM.SWITCH_INDICATOR_HIGH)\r
                },\r
                {\r
                    name: 'SWITCH_INDICATOR_3',\r
                    id: 133,\r
                    positionable: true,\r
                    preview: 'SWI4' + FONT.symbol(SYM.SWITCH_INDICATOR_HIGH)\r
                }\r
            ]\r
        },\r
        {\r
            name: 'osdGroupOSDCustomElements',\r
            items: [\r
                {\r
                    name: 'CUSTOM_ELEMENT_1',\r
                    id: 147,\r
                    min_version: '7.1.0',\r
                    positionable: true,\r
                    preview: "CE_1",\r
                },\r
                {\r
                    name: 'CUSTOM_ELEMENT_2',\r
                    id: 148,\r
                    min_version: '7.1.0',\r
                    positionable: true,\r
                    preview: "CE_2",\r
                },\r
                {\r
                    name: 'CUSTOM_ELEMENT_3',\r
                    id: 149,\r
                    min_version: '7.1.0',\r
                    positionable: true,\r
                    preview: "CE_3",\r
                },\r
                {\r
                    name: 'CUSTOM_ELEMENT_4',\r
                    id: 154,\r
                    min_version: '8.0.0',\r
                    positionable: true,\r
                    preview: "CE_4",\r
                },\r
                {\r
                    name: 'CUSTOM_ELEMENT_5',\r
                    id: 155,\r
                    min_version: '8.0.0',\r
                    positionable: true,\r
                    preview: "CE_5",\r
                },\r
                {\r
                    name: 'CUSTOM_ELEMENT_6',\r
                    id: 156,\r
                    min_version: '8.0.0',\r
                    positionable: true,\r
                    preview: "CE_6",\r
                },\r
                {\r
                    name: 'CUSTOM_ELEMENT_7',\r
                    id: 157,\r
                    min_version: '8.0.0',\r
                    positionable: true,\r
                    preview: "CE_7",\r
                },\r
                {\r
                    name: 'CUSTOM_ELEMENT_8',\r
                    id: 158,\r
                    min_version: '8.0.0',\r
                    positionable: true,\r
                    preview: "CE_8",\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupGVars',\r
            items: [\r
                {\r
                    name: 'GVAR_0',\r
                    id: 113,\r
                    positionable: true,\r
                    preview: 'G0:01337'\r
                },\r
                {\r
                    name: 'GVAR_1',\r
                    id: 114,\r
                    positionable: true,\r
                    preview: 'G1:31415'\r
                },\r
                {\r
                    name: 'GVAR_2',\r
                    id: 115,\r
                    positionable: true,\r
                    preview: 'G2:01611'\r
                },\r
                {\r
                    name: 'GVAR_3',\r
                    id: 116,\r
                    positionable: true,\r
                    preview: 'G3:30126'\r
                }\r
            ]\r
        },\r
        {\r
            name: 'osdGroupPIDs',\r
            items: [\r
                {\r
                    name: 'ACTIVE_PROFILE',\r
                    id: 128,\r
                    preview:  function(osd_data) {\r
                        return FONT.symbol(SYM.PROFILE) + '1';\r
                    }\r
                },\r
                {\r
                    name: 'ROLL_PIDS',\r
                    id: 16,\r
                    preview: 'ROL  40  30  20  23'\r
                },\r
                {\r
                    name: 'PITCH_PIDS',\r
                    id: 17,\r
                    preview: 'PIT  40  30  20  23'\r
                },\r
                {\r
                    name: 'YAW_PIDS',\r
                    id: 18,\r
                    preview: 'YAW  85  45   0  20'\r
                },\r
                {\r
                    name: 'LEVEL_PIDS',\r
                    id: 56,\r
                    preview: 'LEV  20  15  80'\r
                },\r
                {\r
                    name: 'POS_XY_PIDS',\r
                    id: 57,\r
                    preview: 'PXY  20  15  80'\r
                },\r
                {\r
                    name: 'POS_Z_PIDS',\r
                    id: 58,\r
                    preview: 'PZ   20  15  80'\r
                },\r
                {\r
                    name: 'VEL_XY_PIDS',\r
                    id: 59,\r
                    preview: 'VXY  20  15  80'\r
                },\r
                {\r
                    name: 'VEL_Z_PIDS',\r
                    id: 60,\r
                    preview: 'VZ   20  15  80'\r
                },\r
                {\r
                    name: 'HEADING_P',\r
                    id: 61,\r
                    preview: 'HP  20'\r
                },\r
                {\r
                    name: 'BOARD_ALIGNMENT_ROLL',\r
                    id: 62,\r
                    preview: 'AR    0'\r
                },\r
                {\r
                    name: 'BOARD_ALIGNMENT_PITCH',\r
                    id: 63,\r
                    preview: 'AP   ' + FONT.embed_dot('1.0')\r
                },\r
                {\r
                    name: 'THROTTLE_EXPO',\r
                    id: 66,\r
                    preview: 'TEX   0'\r
                },\r
                {\r
                    name: 'STABILIZED.RC_EXPO',\r
                    id: 64,\r
                    preview: 'EXP  20'\r
                },\r
                {\r
                    name: 'STABILIZED.RC_YAW_EXPO',\r
                    id: 65,\r
                    preview: 'YEX  20'\r
                },\r
                {\r
                    name: 'STABILIZED.PITCH_RATE',\r
                    id: 67,\r
                    preview: 'SPR  20'\r
                },\r
                {\r
                    name: 'STABILIZED.ROLL_RATE',\r
                    id: 68,\r
                    preview: 'SRR  20'\r
                },\r
                {\r
                    name: 'STABILIZED.YAW_RATE',\r
                    id: 69,\r
                    preview: 'SYR  20'\r
                },\r
                {\r
                    name: 'MANUAL_RC_EXPO',\r
                    id: 70,\r
                    preview: 'MEX  20'\r
                },\r
                {\r
                    name: 'MANUAL_RC_YAW_EXPO',\r
                    id: 71,\r
                    preview: 'MYX  20'\r
                },\r
                {\r
                    name: 'MANUAL_PITCH_RATE',\r
                    id: 72,\r
                    preview: 'MPR  20'\r
                },\r
                {\r
                    name: 'MANUAL_ROLL_RATE',\r
                    id: 73,\r
                    preview: 'MRR  20'\r
                },\r
                {\r
                    name: 'MANUAL_YAW_RATE',\r
                    id: 74,\r
                    preview: 'MYR  20'\r
                },\r
                {\r
                    name: 'NAV_FW_CRUISE_THROTTLE',\r
                    id: 75,\r
                    preview: 'CRS 1500'\r
                },\r
                {\r
                    name: 'NAV_FW_PITCH_TO_THROTTLE',\r
                    id: 76,\r
                    preview: 'P2T  10'\r
                },\r
                {\r
                    name: 'FW_MIN_THROTTLE_DOWN_PITCH_ANGLE',\r
                    id: 77,\r
                    preview: '0TP  ' + FONT.embed_dot('4.5')\r
                },\r
                {\r
                    name: 'THRUST_PID_ATTENUATION',\r
                    id: 117,\r
                    preview: 'TPA    0\\nBP  1500'\r
                },\r
                {\r
                    name: 'CONTROL_SMOOTHNESS',\r
                    id: 118,\r
                    preview: 'CTL S 3'\r
                },\r
                {\r
                    name: 'TPA_TIME_CONSTANT',\r
                    id: 134,\r
                    preview: 'TPA TC   10'\r
                },\r
                {\r
                    name: 'FW_LEVEL_TRIM',\r
                    id: 135,\r
                    preview: 'LEVEL  ' + FONT.embed_dot('5.4')\r
                },\r
                {\r
                    name: 'MISSION_INDEX',\r
                    id: 139,\r
                    preview: 'WP NO 7'\r
                },\r
                {\r
                    name: 'FW_ALT_CONTROL_RESPONSE',\r
                    id: 166,\r
                    preview: 'ACR 40'\r
                },\r
            ]\r
        },\r
        {\r
            name: 'osdGroupPIDOutputs',\r
            items: [\r
                {\r
                    name: 'FW_ALT_PID_OUTPUTS',\r
                    id: 79,\r
                    preview: 'PZO  ' + FONT.embed_dot('  1.2') + ' ' + FONT.embed_dot('  0.1') + ' ' + FONT.embed_dot('  0.0') + ' ' + FONT.embed_dot('  1.3')\r
                },\r
                {\r
                    name: 'FW_POS_PID_OUTPUTS',\r
                    id: 80,\r
                    preview: 'PXYO ' + FONT.embed_dot('  1.2') + ' ' + FONT.embed_dot('  0.1') + ' ' + FONT.embed_dot('  0.0') + ' ' + FONT.embed_dot('  1.3')\r
                },\r
                {\r
                    name: 'MC_VEL_X_PID_OUTPUTS',\r
                    id: 81,\r
                    preview: 'VXO  ' + FONT.embed_dot('  1.2') + ' ' + FONT.embed_dot('  0.1') + ' ' + FONT.embed_dot('  0.0') + ' ' + FONT.embed_dot('  1.3')\r
                },\r
                {\r
                    name: 'MC_VEL_Y_PID_OUTPUTS',\r
                    id: 82,\r
                    preview: 'VYO  ' + FONT.embed_dot('  1.2') + ' ' + FONT.embed_dot('  0.1') + ' ' + FONT.embed_dot('  0.0') + ' ' + FONT.embed_dot('  1.3')\r
                },\r
                {\r
                    name: 'MC_VEL_Z_PID_OUTPUTS',\r
                    id: 83,\r
                    preview: 'VZO  ' + FONT.embed_dot('  1.2') + ' ' + FONT.embed_dot('  0.1') + ' ' + FONT.embed_dot('  0.0') + ' ' + FONT.embed_dot('  1.3')\r
                },\r
                {\r
                    name: 'MC_POS_XYZ_P_OUTPUTS',\r
                    id: 84,\r
                    preview: 'POSO ' + FONT.embed_dot('  1.2') + ' ' + FONT.embed_dot('  0.1') + ' ' + FONT.embed_dot('  0.0')\r
                },\r
            ]\r
        }\r
    ]\r
};\r
\r
OSD.get_item = function(item_id) {\r
    for (var ii = 0; ii < OSD.constants.ALL_DISPLAY_GROUPS.length; ii++) {\r
        var group = OSD.constants.ALL_DISPLAY_GROUPS[ii];\r
        for (var jj = 0; jj < group.items.length; jj++) {\r
            if (group.items[jj].id == item_id) {\r
                return group.items[jj];\r
            }\r
        }\r
    }\r
    return null;\r
};\r
\r
OSD.is_item_displayed = function(item, group) {\r
    if (!OSD.data.items[item.id]) {\r
        // FC has no data about this item, so\r
        // it doesn't support it.\r
        return false;\r
    }\r
    if (FC.getOsdDisabledFields().indexOf(item.name) != -1) {\r
        return false;\r
    }\r
    if (!group) {\r
        return false;\r
    }\r
    if (typeof group.enabled === 'function' && group.enabled() === false) {\r
        return false;\r
    }\r
    if (item.min_version && !semver.gte(FC.CONFIG.flightControllerVersion, item.min_version)) {\r
        return false;\r
    }\r
    if (typeof item.enabled === 'function' && item.enabled() === false) {\r
        return false;\r
    }\r
    return true;\r
};\r
\r
OSD.get_item_preview = function(item) {\r
    var preview = item.preview;\r
    if (typeof preview == 'function') {\r
        return preview();\r
    }\r
    return preview;\r
}\r
\r
OSD.reload = function(callback) {\r
    OSD.initData();\r
    var done = function() {\r
        OSD.updateDisplaySize();\r
        if (callback) {\r
            callback();\r
        }\r
    };\r
\r
    MSP.promise(MSPCodes.MSP2_INAV_OSD_LAYOUTS).then(function (resp) {\r
\r
        OSD.msp.decodeLayoutCounts(resp);\r
        // Get data for all layouts\r
        var ids = Array.apply(null, {length: OSD.data.layout_count}).map(Number.call, Number);\r
        var layouts = mapSeries(ids, function (layoutIndex, ii) {\r
            var data = [];\r
            data.push8(layoutIndex);\r
            return MSP.promise(MSPCodes.MSP2_INAV_OSD_LAYOUTS, data).then(function (resp) {\r
                OSD.msp.decodeLayout(layoutIndex, resp);\r
            });\r
        });\r
        layouts.then(function () {\r
            OSD.updateSelectedLayout(OSD.data.selected_layout || 0);\r
\r
            MSP.promise(MSPCodes.MSP2_INAV_OSD_ALARMS).then(function (resp) {\r
                OSD.msp.decodeAlarms(resp);\r
\r
                MSP.promise(MSPCodes.MSP2_INAV_OSD_PREFERENCES).then(function (resp) {\r
                    OSD.data.supported = true;\r
                    OSD.msp.decodePreferences(resp);\r
                    \r
                    MSP.promise(MSPCodes.MSP2_INAV_CUSTOM_OSD_ELEMENTS).then(() => { \r
                        mspHelper.loadOsdCustomElements(() => {\r
                            createCustomElements();\r
                            done();\r
                        });\r
                    });\r
                });\r
            });\r
        });\r
    });\r
\r
    \r
};\r
\r
OSD.updateSelectedLayout = function(new_layout) {\r
    OSD.data.selected_layout = new_layout;\r
    OSD.data.items = OSD.data.layouts[OSD.data.selected_layout];\r
};\r
\r
OSD.updateDisplaySize = function () {\r
    video_type = OSD.constants.VIDEO_TYPES[OSD.data.preferences.video_system];\r
    if (video_type == 'AUTO') {\r
        video_type = 'PAL';\r
    }\r
\r
    // save the original OSD element positions for all layouts\r
    var osdLayouts = [];\r
    for (var ii = 0; ii < OSD.data.layout_count; ii++) {\r
        var items = OSD.data.layouts[ii];\r
        var origPos = [];\r
        for (var jj = 0; jj < OSD.data.items.length; jj++) {\r
            origPos.push(OSD.msp.helpers.pack.position(items[jj]));\r
        }\r
        osdLayouts.push(origPos);\r
    }\r
\r
    // set the new video type and cols per line\r
    FONT.constants.SIZES.LINE = OSD.constants.VIDEO_COLS[video_type];\r
\r
    // set the new display size\r
    OSD.data.display_size = {\r
        x: FONT.constants.SIZES.LINE,\r
        y: OSD.constants.VIDEO_LINES[video_type],\r
        total: OSD.constants.VIDEO_BUFFER_CHARS[video_type]\r
    };\r
\r
    // re-calculate the OSD element positions for each layout\r
    for (var ii = 0; ii < OSD.data.layout_count; ii++) {\r
        var origPos = osdLayouts[ii];\r
        var items = OSD.data.layouts[ii];\r
        for (var jj = 0; jj < OSD.data.item_count; jj++) {\r
            var item = OSD.msp.helpers.unpack.position(origPos[jj]);\r
            // leave element alone if outside of screen (enable and disable element to relocate to 0,0)\r
            if (item.x < OSD.data.display_size.x && item.y < OSD.data.display_size.y) {\r
                items[jj] = item;\r
            }\r
        }\r
    }\r
\r
    // set the preview size based on the video type\r
    // -- AVATAR\r
    $('.third_left').toggleClass('preview_avatar_side', (video_type == 'AVATAR'))\r
    $('.preview').toggleClass('preview_avatar cut43_left', (video_type == 'AVATAR'))\r
    $('.third_right').toggleClass('preview_avatar_side', (video_type == 'AVATAR'))\r
    // -- DJI WTF\r
    $('.third_left').toggleClass('preview_dji_hd_side', video_type == 'DJIWTF')\r
    $('.preview').toggleClass('preview_dji_hd cut43_left', video_type == 'DJIWTF')\r
    $('.third_right').toggleClass('preview_dji_hd_side', video_type == 'DJIWTF')\r
    // -- HD ZERO\r
    $('.third_left').toggleClass('preview_hdzero_side', (video_type == 'HDZERO'))\r
    $('.preview').toggleClass('preview_hdzero cut43_left', (video_type == 'HDZERO'))\r
    $('.third_right').toggleClass('preview_hdzero_side', (video_type == 'HDZERO'))\r
    // -- BFHDCOMPAT\r
    $('.third_left').toggleClass('preview_bfhdcompat_side', (video_type == 'BFHDCOMPAT' || video_type == 'DJI_NATIVE'))\r
    $('.preview').toggleClass('preview_bfhdcompat cut43_left', (video_type == 'BFHDCOMPAT' || video_type == 'DJI_NATIVE'))\r
    $('.third_right').toggleClass('preview_bfhdcompat_side', (video_type == 'BFHDCOMPAT' || video_type == 'DJI_NATIVE'))\r
\r
    OSD.GUI.updateGuidesView($('#videoGuides').find('input').is(':checked'));\r
};\r
\r
OSD.saveAlarms = function(callback) {\r
    let data = OSD.msp.encodeAlarms();\r
    return MSP.promise(MSPCodes.MSP2_INAV_OSD_SET_ALARMS, data).then(callback);\r
}\r
\r
OSD.saveConfig = function(callback) {\r
    return OSD.saveAlarms(function () {\r
        var data = OSD.msp.encodePreferences();\r
        return MSP.promise(MSPCodes.MSP2_INAV_OSD_SET_PREFERENCES, data).then(callback);\r
    });\r
};\r
\r
OSD.saveItem = function(item, callback) {\r
    let pos = OSD.data.items[item.id];\r
    let data = OSD.msp.encodeLayoutItem(OSD.data.selected_layout, item, pos);\r
    return MSP.promise(MSPCodes.MSP2_INAV_OSD_SET_LAYOUT_ITEM, data).then(callback);\r
};\r
\r
//noinspection JSUnusedLocalSymbols\r
OSD.msp = {\r
    /**\r
     * Unsigned 16 bit int for position is packed:\r
     * 0: unused\r
     * v: visible flag\r
     * b: blink flag\r
     * y: y coordinate\r
     * x: x coordinate\r
     * 00vb yyyy yyxx xxxx\r
     */\r
    helpers: {\r
        unpack: {\r
            position: function (bits) {\r
                var display_item = {};\r
                display_item.x = bits & 0x3F;\r
				display_item.y = (bits >> 6) & 0x3F;\r
                display_item.position = (display_item.y) * FONT.constants.SIZES.LINE + (display_item.x);\r
                display_item.isVisible = (bits & OSD.constants.VISIBLE) != 0;\r
                return display_item;\r
            }\r
        },\r
        calculate: {\r
        	coords: function(display_item) {\r
        		display_item.x = (display_item.position % FONT.constants.SIZES.LINE) & 0x3F;\r
        		display_item.y = (display_item.position / FONT.constants.SIZES.LINE) & 0x3F;\r
        		return display_item;\r
        	}\r
        },\r
        pack: {\r
            position: function (display_item) {\r
                return (display_item.isVisible ? OSD.constants.VISIBLE : 0)\r
                	| ((display_item.y & 0x3F) << 6) | (display_item.x & 0x3F);\r
            }\r
        }\r
    },\r
\r
    encodeAlarms: function() {\r
        var result = [];\r
\r
        result.push8(OSD.data.alarms.rssi);\r
        result.push16(OSD.data.alarms.fly_minutes);\r
        result.push16(OSD.data.alarms.max_altitude);\r
        result.push16(OSD.data.alarms.dist);\r
        result.push16(OSD.data.alarms.max_neg_altitude);\r
        result.push16(OSD.data.alarms.gforce);\r
        result.push16(OSD.data.alarms.gforce_axis_min);\r
        result.push16(OSD.data.alarms.gforce_axis_max);\r
        result.push8(OSD.data.alarms.current);\r
        result.push16(OSD.data.alarms.imu_temp_alarm_min);\r
        result.push16(OSD.data.alarms.imu_temp_alarm_max);\r
        result.push16(OSD.data.alarms.baro_temp_alarm_min);\r
        result.push16(OSD.data.alarms.baro_temp_alarm_max);\r
        result.push16(OSD.data.alarms.adsb_distance_warning);\r
        result.push16(OSD.data.alarms.adsb_distance_alert);\r
        return result;\r
    },\r
\r
    decodeAlarms: function(resp) {\r
        var alarms = resp.data;\r
\r
        OSD.data.alarms.rssi = alarms.readU8();\r
        OSD.data.alarms.fly_minutes = alarms.readU16();\r
        OSD.data.alarms.max_altitude = alarms.readU16();\r
        OSD.data.alarms.dist = alarms.readU16();\r
        OSD.data.alarms.max_neg_altitude = alarms.readU16();\r
        OSD.data.alarms.gforce = alarms.readU16();\r
        OSD.data.alarms.gforce_axis_min = alarms.read16();\r
        OSD.data.alarms.gforce_axis_max = alarms.read16();\r
        OSD.data.alarms.current = alarms.readU8();\r
        OSD.data.alarms.imu_temp_alarm_min = alarms.read16();\r
        OSD.data.alarms.imu_temp_alarm_max = alarms.read16();\r
        OSD.data.alarms.baro_temp_alarm_min = alarms.read16();\r
        OSD.data.alarms.baro_temp_alarm_max = alarms.read16();\r
        OSD.data.alarms.adsb_distance_warning = alarms.read16();\r
        OSD.data.alarms.adsb_distance_alert = alarms.read16();\r
    },\r
\r
    encodePreferences: function() {\r
        var result = [];\r
        var p = OSD.data.preferences;\r
\r
        result.push8(p.video_system);\r
        result.push8(p.main_voltage_decimals);\r
        result.push8(p.ahi_reverse_roll);\r
        result.push8(p.crosshairs_style);\r
        result.push8(p.left_sidebar_scroll);\r
        result.push8(p.right_sidebar_scroll);\r
        result.push8(p.sidebar_scroll_arrows);\r
        result.push8(p.units);\r
        result.push8(p.stats_energy_unit);\r
        result.push8(p.adsb_warning_style);\r
\r
        return result;\r
    },\r
\r
    decodePreferences: function(resp) {\r
        var prefs = resp.data;\r
        var p = OSD.data.preferences;\r
\r
        p.video_system = prefs.readU8();\r
        p.main_voltage_decimals = prefs.readU8();\r
        p.ahi_reverse_roll = prefs.readU8();\r
        p.crosshairs_style = prefs.readU8();\r
        p.left_sidebar_scroll = prefs.readU8();\r
        p.right_sidebar_scroll = prefs.readU8();\r
        p.sidebar_scroll_arrows = prefs.readU8();\r
        p.units = prefs.readU8();\r
        p.stats_energy_unit = prefs.readU8();\r
        p.adsb_warning_style = prefs.readU8();\r
    },\r
\r
    encodeLayoutItem: function(layout, item, pos) {\r
        var result = [];\r
\r
        result.push8(layout);\r
        result.push8(item.id);\r
        result.push16(this.helpers.pack.position(pos));\r
\r
        return result;\r
    },\r
\r
    decodeLayoutCounts: function(resp) {\r
        OSD.data.layout_count = resp.data.readU8();\r
        OSD.data.item_count = resp.data.readU8();\r
    },\r
\r
    decodeLayout: function(layoutIndex, resp) {\r
        var items = [];\r
\r
        for (var ii = 0; ii < OSD.data.item_count; ii++) {\r
            var bits = resp.data.readU16();\r
            items.push(this.helpers.unpack.position(bits));\r
        }\r
        OSD.data.layouts[layoutIndex] = items;\r
    },\r
\r
    encodeOther: function () {\r
        var result = [-1, OSD.data.preferences.video_system];\r
        result.push8(OSD.data.preferences.units);\r
        // watch out, order matters! match the firmware\r
        result.push8(OSD.data.alarms.rssi);\r
        result.push16(OSD.data.alarms.batt_cap);\r
        result.push16(OSD.data.alarms.fly_minutes);\r
        result.push16(OSD.data.alarms.max_altitude);\r
        // These might be null, since there weren't supported\r
        // until version 1.8\r
        if (OSD.data.alarms.dist !== null) {\r
            result.push16(OSD.data.alarms.dist);\r
        }\r
        if (OSD.data.alarms.max_neg_altitude !== null) {\r
            result.push16(OSD.data.alarms.max_neg_altitude);\r
        }\r
        return result;\r
    },\r
\r
    encodeItem: function (id, itemData) {\r
        var buffer = [];\r
        buffer.push8(id);\r
        buffer.push16(this.helpers.pack.position(itemData));\r
        return buffer;\r
    },\r
\r
    decode: function (payload) {\r
        if (payload.length <= 1) {\r
            return;\r
        }\r
        var view = payload.data;\r
        var d = OSD.data;\r
        d.supported = view.readU8();\r
        d.preferences.video_system = view.readU8();\r
        d.preferences.units = view.readU8();\r
\r
        d.alarms.rssi = view.readU8();\r
        d.alarms.batt_cap = view.readU16();\r
        d.alarms.fly_minutes = view.readU16();\r
        d.alarms.max_altitude = view.readU16();\r
\r
        d.alarms.dist = view.readU16();\r
        d.alarms.max_neg_altitude = view.readU16();\r
\r
        d.items = [];\r
        // start at the offset from the other fields\r
        while (view.offset < view.byteLength) {\r
            var bits = view.readU16();\r
            d.items.push(this.helpers.unpack.position(bits));\r
        }\r
    },\r
};\r
\r
OSD.GUI = {};\r
OSD.GUI.preview = {\r
    onMouseEnter: function () {\r
        var item = $(this).data('item');\r
        if (!item) {\r
            return;\r
        }\r
        $('.field-' + item.id).addClass('mouseover');\r
    },\r
\r
    onMouseLeave: function () {\r
        var item = $(this).data('item');\r
        if (!item) {\r
            return;\r
        }\r
        $('.field-' + item.id).removeClass('mouseover')\r
    },\r
\r
    onDragStart: function (e) {\r
        var ev = e.originalEvent;\r
        var item = $(ev.target).data('item');\r
        //noinspection JSUnresolvedVariable\r
        ev.dataTransfer.setData("text/plain", item.id);\r
        //noinspection JSUnresolvedVariable\r
        ev.dataTransfer.setDragImage(item.preview_img, 6, 9);\r
    },\r
    onDragOver: function (e) {\r
        var ev = e.originalEvent;\r
        ev.preventDefault();\r
        //noinspection JSUnresolvedVariable\r
        ev.dataTransfer.dropEffect = "move";\r
        $(this).css({\r
            background: 'rgba(0,0,0,.5)'\r
        });\r
    },\r
\r
    onDragLeave: function (e) {\r
        // brute force unstyling on drag leave\r
        $(this).removeAttr('style');\r
    },\r
\r
    onDrop: function (e) {\r
        var ev = e.originalEvent;\r
        var position = $(this).removeAttr('style').data('position');;\r
        //noinspection JSUnresolvedVariable\r
        var item_id = parseInt(ev.dataTransfer.getData('text'));\r
        var item = OSD.get_item(item_id);\r
        var preview = OSD.get_item_preview(item);\r
        var line_width = 0;\r
        var item_width = 0;\r
        for (var ii = 0; ii < preview.length; ii++) {\r
            if (preview[ii] == '\\n') {\r
                item_width = Math.max(item_width, line_width);\r
                line_width = 0;\r
                continue;\r
            }\r
            line_width++;\r
        }\r
        item_width = Math.max(item_width, line_width);\r
        var overflows_line = FONT.constants.SIZES.LINE - ((position % FONT.constants.SIZES.LINE) + item_width);\r
        if (overflows_line < 0) {\r
            position += overflows_line;\r
        }\r
\r
        $('input.' + item_id + '.position').val(position).trigger('change');\r
    }\r
};\r
\r
OSD.GUI.checkAndProcessSymbolPosition = function(pos, charCode) {\r
    if (typeof OSD.data.preview[pos] === 'object' && OSD.data.preview[pos][0] !== null) {\r
        // position already in use, always put object item at position\r
        OSD.data.preview[pos] = [OSD.data.preview[pos][0], charCode, 'red'];\r
    } else {\r
        // position not used by an object type, put character at position\r
        // character types can overwrite character types (e.g. crosshair)\r
        OSD.data.preview[pos] = charCode;\r
    }\r
};\r
\r
const mspVideoSystem = [1,3,4,5,6,7,8];   // indexes of PAL, HDZERO, DJIWTF, AVATAR, BF43COMPAT, BFHDCOMPAT & DJI_NATIVE\r
const analogVideoSystem = [0,1,2];  // indexes of AUTO, PAL, & NTSC\r
\r
OSD.GUI.updateVideoMode = function() {\r
    // video mode\r
    var $videoTypes = $('.video-types').empty();\r
\r
    if (!HARDWARE.capabilities.isDjiHdFpv) {\r
        $('#dji_settings').hide();\r
    }\r
\r
    if (HARDWARE.capabilities.isMspDisplay) {\r
        if (mspVideoSystem.includes(OSD.data.preferences.video_system) == false) {\r
            OSD.data.preferences.video_system = OSD.constants.VIDEO_TYPES.indexOf('HDZERO');\r
            OSD.updateDisplaySize();\r
            OSD.GUI.saveConfig();\r
        }\r
    } else {\r
        if (analogVideoSystem.includes(OSD.data.preferences.video_system) == false) {\r
            OSD.data.preferences.video_system = OSD.constants.VIDEO_TYPES.indexOf('AUTO')\r
            OSD.updateDisplaySize();\r
            OSD.GUI.saveConfig();\r
        }\r
    }\r
\r
    if (HARDWARE.capabilities.isMspDisplay) {\r
        for (var i = 0; i < OSD.constants.VIDEO_TYPES.length; i++) {\r
            if (mspVideoSystem.includes(i))\r
            {\r
                $videoTypes.append(\r
                    $('<option value="' + OSD.constants.VIDEO_TYPES[i] + '">' + OSD.constants.VIDEO_TYPES[i] + '</option>')\r
                        .prop('selected', i === OSD.data.preferences.video_system)\r
                        .data('type', i)\r
                );\r
            }\r
        }\r
    } else {\r
        for (var i = 0; i < OSD.constants.VIDEO_TYPES.length; i++) {\r
            if (analogVideoSystem.includes(i))\r
            {\r
                $videoTypes.append(\r
                    $('<option value="' + OSD.constants.VIDEO_TYPES[i] + '">' + OSD.constants.VIDEO_TYPES[i] + '</option>')\r
                        .prop('selected', i === OSD.data.preferences.video_system)\r
                        .data('type', i)\r
                );\r
            }\r
        }\r
    }\r
\r
    $videoTypes.on('change', function () {\r
        OSD.data.preferences.video_system = $(this).find(':selected').data('type');\r
        OSD.updateDisplaySize();\r
        OSD.GUI.saveConfig();\r
    });\r
};\r
\r
OSD.GUI.updateUnits = function() {\r
    // units\r
    var $unitMode = $('#unit_mode').empty();\r
    var $unitTip = $('.units .cf_tip');\r
\r
    for (var i = 0; i < OSD.constants.UNIT_TYPES.length; i++) {\r
        var unitType = OSD.constants.UNIT_TYPES[i];\r
        if (unitType.min_version && semver.lt(FC.CONFIG.flightControllerVersion, unitType.min_version)) {\r
            continue;\r
        }\r
        var name = i18n.getMessage(unitType.name);\r
        var $option = $('<option>' + name + '</option>');\r
        $option.attr('value', name);\r
        $option.data('type', unitType.value);\r
        if (OSD.data.preferences.units === unitType.value) {\r
            $option.prop('selected', true);\r
        }\r
        $unitMode.append($option);\r
    }\r
    function updateUnitHelp() {\r
        var unitType = OSD.constants.UNIT_TYPES[OSD.data.preferences.units];\r
        var tip;\r
        if (unitType.tip) {\r
            tip = i18n.getMessage(unitType.tip);\r
        }\r
        if (tip) {\r
            $unitTip.attr('title', tip);\r
            $unitTip.fadeIn();\r
        } else {\r
            $unitTip.fadeOut();\r
        }\r
    }\r
    updateUnitHelp();\r
    $unitMode.on('change', function (e) {\r
        var selected = $(this).find(':selected');\r
        OSD.data.preferences.units = selected.data('type');\r
        globalSettings.osdUnits = OSD.data.preferences.units;\r
        OSD.GUI.saveConfig();\r
        updateUnitHelp();\r
    });\r
};\r
\r
OSD.GUI.updateFields = function(event) {\r
    // display fields on/off and position\r
    var $tmpl = $('#osd_group_template').hide();\r
    // Clear previous groups, if any\r
    $('.osd_group').remove();\r
    for (var ii = 0; ii < OSD.constants.ALL_DISPLAY_GROUPS.length; ii++) {\r
        var group = OSD.constants.ALL_DISPLAY_GROUPS[ii];\r
        var groupItems = [];\r
        for (var jj = 0; jj < group.items.length; jj++) {\r
            var item = group.items[jj];\r
            if (!OSD.is_item_displayed(item, group)) {\r
                continue;\r
            }\r
            OSD.data.groups[item.id] = group;\r
            groupItems.push(item);\r
        }\r
        if (groupItems.length == 0) {\r
            continue;\r
        }\r
        var groupContainer = $tmpl.clone().addClass('osd_group').show();\r
        groupContainer.attr('id', group.name);\r
        var groupTitleContainer = groupContainer.find('.spacer_box_title');\r
        var groupTitle = i18n.getMessage(group.name);\r
        groupTitleContainer.text(groupTitle);\r
        var groupHelp = i18n.getMessage(group.name + '_HELP');\r
        if (groupHelp) {\r
            $('<div class="helpicon cf_tip"></div>')\r
                .css('margin-top', '1px')\r
                .attr('title', groupHelp)\r
                .appendTo(groupTitleContainer.parent())\r
                .jBox('Tooltip', {\r
                    delayOpen: 100,\r
                    delayClose: 100,\r
                    position: {\r
                        x: 'right',\r
                        y: 'center'\r
                    },\r
                    outside: 'x'\r
                });\r
        }\r
        var $displayFields = groupContainer.find('.display-fields');\r
        var osdSearch = $('.osd_search');\r
        for (var jj = 0; jj < groupItems.length; jj++) {\r
            var item = groupItems[jj];\r
            var itemData = OSD.data.items[item.id];\r
            var checked = itemData.isVisible ? 'checked' : '';\r
            var $field = $('<div class="display-field field-' + item.id + '"/>');\r
            var name = item.name;\r
            var nameKey = 'osdElement_' + name;\r
            var nameMessage = i18n.getMessage(nameKey);\r
            if (nameMessage) {\r
                name = nameMessage;\r
            } else {\r
                name = titleize(name);\r
            }\r
            var searchTerm = osdSearch.val();\r
            if (searchTerm.length > 0 && !name.toLowerCase().includes(searchTerm.toLowerCase())) {\r
                continue;\r
            }\r
            var help = i18n.getMessage(nameKey + '_HELP');\r
            if (help) {\r
                $('<div class="helpicon cf_tip"></div>')\r
                    .css('margin-top', '1px')\r
                    .attr('title', help)\r
                    .appendTo($field)\r
                    .jBox('Tooltip', {\r
                        delayOpen: 100,\r
                        delayClose: 100,\r
                        position: {\r
                            x: 'right',\r
                            y: 'center'\r
                        },\r
                        outside: 'x'\r
                    });\r
            }\r
            $field.append(\r
                $('<input type="checkbox" name="' + item.name + '" class="togglesmall"></input>')\r
                    .data('item', item)\r
                    .attr('checked', itemData.isVisible)\r
                    .on('change', function () {\r
                        var item = $(this).data('item');\r
                        var itemData = OSD.data.items[item.id];\r
                        var $position = $(this).parent().find('.position.' + item.name);\r
                        itemData.isVisible = !itemData.isVisible;\r
\r
                        if (itemData.isVisible) {\r
                            // Ensure the element is inside the viewport, at least partially.\r
                            // In that case move it to the very first row/col, otherwise there's\r
                            // no way to reposition items that are outside the viewport.\r
                            OSD.msp.helpers.calculate.coords(itemData);\r
                            if (itemData.x > OSD.data.display_size.x || itemData.y > OSD.data.display_size.y) {\r
                                itemData.x = itemData.y = itemData.position = 0;\r
                            }\r
                            $position.show();\r
                        } else {\r
                            $position.hide();\r
                        }\r
\r
                        OSD.GUI.saveItem(item);\r
                    })\r
            );\r
\r
            $field.append('<label for="' + item.name + '" class="char-label">' + name + '</label>');\r
            if (item.positionable !== false) {\r
                $field.append(\r
                    $('<input type="number" class="' + item.id + ' position"></input>')\r
                        .data('item', item)\r
                        .val(itemData.position)\r
                        .on('change', debounce(250, function (e) {\r
                            var item = $(this).data('item');\r
                            var itemData = OSD.data.items[item.id];\r
                            itemData.position = parseInt($(this).val());\r
                            OSD.msp.helpers.calculate.coords(itemData);\r
                            OSD.GUI.saveItem(item);\r
                        }))\r
                );\r
            }\r
            $displayFields.append($field);\r
        }\r
        if (groupContainer.find('.display-fields').children().length > 0) {\r
            $tmpl.parent().append(groupContainer);\r
        }\r
    }\r
\r
    if ($('#videoGuidesToggle').length == false) {\r
        $('#videoGuides').prepend(\r
            $('<input id="videoGuidesToggle" type="checkbox" class="toggle" />')\r
            .attr('checked', isGuidesChecked)\r
            .on('change', function () {\r
                OSD.GUI.updateGuidesView(this.checked);\r
                bridge.storeSet('showOSDGuides', this.checked);\r
                OSD.GUI.updatePreviews();\r
            })\r
        );\r
    }\r
\r
    if ($('#djiUnsupportedElementsToggle').length == false) {\r
        $('#djiUnsupportedElements').prepend(\r
            $('<input id="djiUnsupportedElementsToggle" type="checkbox" class="toggle" />')\r
            .attr('checked', HARDWARE.capabilities.isDjiHdFpv && !HARDWARE.capabilities.isMspDisplay)\r
            .on('change', function () {\r
                OSD.GUI.updateDjiView(this.checked);\r
                OSD.GUI.updatePreviews();\r
            })\r
        );\r
    }\r
\r
    // TODO: If we add more switches somewhere else, this\r
    // needs to be called after all of them have been set up\r
    GUI.switchery();\r
\r
    if(event != null && event.currentTarget !== osdSearch[0])\r
    {\r
        // Update the OSD preview\r
        refreshOSDSwitchIndicators();\r
        updatePilotAndCraftNames();\r
        updatePanServoPreview();\r
    }\r
};\r
\r
OSD.GUI.removeBottomLines = function(){\r
    // restore\r
    $('.display-field').removeClass('no-bottom');\r
    $('.gui_box').each(function(index, gui_box){\r
        var elements = $(gui_box).find('.display-fields, .settings').children();\r
        var lastVisible = false;\r
        elements.each(function(index, element){\r
            if ($(element).is(':visible')) {\r
                lastVisible = $(element);\r
            }\r
        });\r
        if (lastVisible) {\r
            lastVisible.addClass('no-bottom');\r
        }\r
    });\r
};\r
\r
OSD.GUI.updateDjiMessageElements = function(on) {\r
    $('.display-field').each(function(index, element) {\r
        var name = $(element).find('input').attr('name');\r
        if (OSD.DjiElements.craftNameElements.includes(name)) {\r
            if (on) {\r
                $(element)\r
                    .addClass('blue')\r
                    .show();\r
            } else if ($('#djiUnsupportedElements').find('input').is(':checked')) {\r
                $(element).hide();\r
            }\r
        }\r
\r
        if (!on) {\r
            $(element).removeClass('blue');\r
        }\r
    });\r
    OSD.GUI.removeBottomLines();\r
};\r
\r
OSD.GUI.updateGuidesView = function(on) {\r
    let isHdZero = OSD.constants.VIDEO_TYPES[OSD.data.preferences.video_system] == 'HDZERO';\r
    $('.hd_43_margin_left').toggleClass('hdzero_43_left', (isHdZero && on))\r
    $('.hd_43_margin_right').toggleClass('hdzero_43_right', (isHdZero && on))\r
    $('.hd_3016_box_top').toggleClass('hd_3016_top', (isHdZero && on))\r
    $('.hd_3016_box_bottom').toggleClass('hd_3016_bottom', (isHdZero && on))\r
    $('.hd_3016_box_left').toggleClass('hd_3016_left', (isHdZero && on))\r
    $('.hd_3016_box_right').toggleClass('hd_3016_right', (isHdZero && on))\r
\r
    let isDJIWTF = OSD.constants.VIDEO_TYPES[OSD.data.preferences.video_system] == 'DJIWTF';\r
    $('.hd_43_margin_left').toggleClass('dji_hd_43_left', (isDJIWTF && on))\r
    $('.hd_43_margin_right').toggleClass('dji_hd_43_right', (isDJIWTF && on))\r
\r
    let isAvatar = OSD.constants.VIDEO_TYPES[OSD.data.preferences.video_system] == 'AVATAR';\r
    $('.hd_43_margin_left').toggleClass('hd_avatar_43_left', (isAvatar && on))\r
    $('.hd_43_margin_right').toggleClass('hd_avatar_43_right', (isAvatar && on))\r
    $('.hd_avatar_bottom_bar').toggleClass('hd_avatar_bottom', (isAvatar && on))\r
    $('.hd_avatar_storage_box_top').toggleClass('hd_avatar_storagebox_t', (isAvatar && on))\r
    $('.hd_avatar_storage_box_bottom').toggleClass('hd_avatar_storagebox_b', (isAvatar && on))\r
    $('.hd_avatar_storage_box_left').toggleClass('hd_avatar_storagebox_l', (isAvatar && on))\r
    $('.hd_avatar_storage_box_right').toggleClass('hd_avatar_storagebox_r', (isAvatar && on))\r
\r
    let isBfHdCompat = OSD.constants.VIDEO_TYPES[OSD.data.preferences.video_system] == 'BFHDCOMPAT' || OSD.constants.VIDEO_TYPES[OSD.data.preferences.video_system] == 'DJI_NATIVE';\r
    $('.hd_43_margin_left').toggleClass('hd_bfhdcompat_43_left', (isBfHdCompat && on));\r
    $('.hd_43_margin_right').toggleClass('hd_bfhdcompat_43_right', (isBfHdCompat && on));\r
    $('.hd_bfhdcompat_bottom_box').toggleClass('hd_bfhdcompat_bottom', (isBfHdCompat && on));\r
    $('.hd_bfhdcompat_storage_box').toggleClass('hd_bfhdcompat_storagebox', (isBfHdCompat && on));\r
\r
    let isPAL = OSD.constants.VIDEO_TYPES[OSD.data.preferences.video_system] == 'PAL' || OSD.constants.VIDEO_TYPES[OSD.data.preferences.video_system] == 'AUTO';\r
    $('.pal_ntsc_box_bottom').toggleClass('ntsc_bottom', (isPAL && on))\r
};\r
\r
OSD.GUI.updateDjiView = function(on) {\r
    if (on) {\r
        $(OSD.DjiElements.emptyGroups).each(function(index, groupName) {\r
            $('#osdGroup' + groupName).hide();\r
        });\r
\r
        var displayFields = $('.display-field');\r
        displayFields.each(function(index, element) {\r
            var name = $(element).find('input').attr('name');\r
            if (!OSD.DjiElements.supported.includes(name)) {\r
                $(element).hide();\r
            }\r
        });\r
\r
        var settings = $('.settings-container').find('.settings').children();\r
        settings.each(function(index, element) {\r
            var name = $(element).attr('class');\r
            if (!OSD.DjiElements.supportedSettings.includes(name)) {\r
                $(element).hide();\r
            }\r
        });\r
\r
        var settings = $('.decimals-container').find('.settings').children();\r
        settings.each(function(index, element) {\r
            var name = $(element).attr('class');\r
            if (!OSD.DjiElements.supportedSettings.includes(name)) {\r
                $(element).hide();\r
            }\r
        });\r
\r
\r
        var alarms = $('.alarms-container').find('.settings').children();\r
        alarms.each(function(index, element) {\r
            var name = $(element).attr('for');\r
            if (!OSD.DjiElements.supportedAlarms.includes(name)) {\r
                $(element).hide();\r
            }\r
        });\r
\r
        $('.switch-indicator-container').hide();\r
    } else {\r
        $(OSD.DjiElements.emptyGroups).each(function(index, groupName) {\r
            $('#osdGroup' + groupName).show();\r
        });\r
\r
        $('.display-field')\r
            .show()\r
            .removeClass('no-bottom');\r
\r
        $('.settings-container, .decimals-container, .alarms-container').find('.settings').children()\r
            .show()\r
            .removeClass('no-bottom');\r
\r
        $('.switch-indicator-container').show();\r
    }\r
    OSD.GUI.updateDjiMessageElements($('#useCraftnameForMessages').is(':checked'));\r
};\r
\r
OSD.GUI.updateAlarms = function() {\r
    $(".osd_use_airspeed_alarm").toggle(HARDWARE.capabilities.usePitot);\r
    $(".osd_use_baro_temp_alarm").toggle(HARDWARE.capabilities.useBaro);\r
    $(".osd_use_esc_telemetry").toggle(HARDWARE.capabilities.useESCTelemetry);\r
    $(".osd_use_rx").toggle(HARDWARE.capabilities.useRx);\r
    $(".osd_use_crsf").toggle(HARDWARE.capabilities.useCRSF);\r
};\r
\r
OSD.GUI.updateMapPreview = function(mapCenter, name, directionSymbol, centerSymbol) {\r
    if ($('input[name="' + name + '"]').prop('checked')) {\r
        var mapInitialX = OSD.data.display_size.x - 2;\r
        OSD.GUI.checkAndProcessSymbolPosition(mapCenter, centerSymbol);\r
    }\r
};\r
\r
OSD.GUI.updatePreviews = function() {\r
    if (!OSD.data) {\r
        return;\r
    }\r
    // buffer the preview;\r
   \r
    if (!OSD.data) {\r
        return;\r
    }\r
    \r
    OSD.data.preview = [];\r
    \r
    if (OSD.data.display_size != undefined) {\r
        // clear the buffer\r
        for (let i = 0; i < OSD.data.display_size.total; i++) {\r
            OSD.data.preview.push([null, ' '.charCodeAt(0)]);\r
        };\r
\r
        // draw all the displayed items and the drag and drop preview images\r
        for (var ii = 0; ii < OSD.data.items.length; ii++) {\r
            var item = OSD.get_item(ii);\r
            if (!item || !OSD.is_item_displayed(item, OSD.data.groups[item.id])) {\r
                continue;\r
            }\r
            var itemData = OSD.data.items[ii];\r
            if (!itemData.isVisible) {\r
                continue;\r
            }\r
\r
            if (itemData.x >= OSD.data.display_size.x)\r
            {\r
                continue;\r
            }\r
\r
            // DJI HD FPV: Hide elements that only appear in craft name\r
            if (OSD.DjiElements.craftNameElements.includes(item.name) &&\r
            $('#djiUnsupportedElements').find('input').is(':checked')) {\r
                continue;\r
            }\r
            var j = (itemData.position >= 0) ? itemData.position : itemData.position + OSD.data.display_size.total;\r
            // create the preview image\r
            item.preview_img = new Image();\r
            var canvas = document.createElement('canvas');\r
            var ctx = canvas.getContext("2d");\r
            // fill the screen buffer\r
            var preview = OSD.get_item_preview(item);\r
            if (!preview) {\r
                continue;\r
            }\r
            var x = 0;\r
            var y = 0;\r
            for (let i = 0; i < preview.length; i++) {\r
                var charCode = preview.charCodeAt(i);\r
                if (charCode == '\\n'.charCodeAt(0)) {\r
                    x = 0;\r
                    y++;\r
                    continue;\r
                }\r
                var previewPos = j + x + (y * OSD.data.display_size.x);\r
                if (previewPos >= OSD.data.preview.length) {\r
                    // Character is outside the viewport\r
                    x++;\r
                    continue;\r
                }\r
                // test if this position already has a character placed\r
                if (OSD.data.preview[previewPos][0] !== null) {\r
                    // if so set background color to red to show user double usage of position\r
                    OSD.data.preview[previewPos] = [item, charCode, 'red'];\r
                } else {\r
                    OSD.data.preview[previewPos] = [item, charCode];\r
                }\r
                // draw the preview\r
                var img = new Image();\r
                img.src = FONT.draw(charCode);\r
                ctx.drawImage(img, x*FONT.constants.SIZES.CHAR_WIDTH, y*FONT.constants.SIZES.CHAR_HEIGHT);\r
                x++;\r
            }\r
            item.preview_img.src = canvas.toDataURL('image/png');\r
            // Required for NW.js - Otherwise the <img /> will\r
            // consume drag/drop events.\r
            item.preview_img.style.pointerEvents = 'none';\r
        }\r
\r
\r
        var centerPosition = (OSD.data.display_size.x * OSD.data.display_size.y / 2);\r
        if (OSD.data.display_size.y % 2 == 0) {\r
            centerPosition += Math.floor(OSD.data.display_size.x / 2);\r
        }\r
\r
        let hudCenterPosition = centerPosition - (OSD.constants.VIDEO_COLS[video_type] * $('#osd_horizon_offset').val());\r
\r
        // artificial horizon\r
        if ($('input[name="ARTIFICIAL_HORIZON"]').prop('checked')) {\r
            for (let i = 0; i < 9; i++) {\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition - 4 + i, SYM.AH_BAR9_0 + 4);\r
            }\r
        }\r
\r
        // crosshairs\r
        if ($('input[name="CROSSHAIRS"]').prop('checked')) {\r
            let crsHNumber = Settings.getInputValue('osd_crosshairs_style');\r
            if (crsHNumber == 1) {\r
                // AIRCRAFT style\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition - 2, SYM.AH_AIRCRAFT0);\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition - 1, SYM.AH_AIRCRAFT1);\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition, SYM.AH_AIRCRAFT2);\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition + 1, SYM.AH_AIRCRAFT3);\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition + 2, SYM.AH_AIRCRAFT4);\r
            } else if ((crsHNumber > 1) && (crsHNumber < 8)) {\r
                // TYPES 3 to 8 (zero indexed)\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition - 1, SYM.AH_CROSSHAIRS[crsHNumber][0]);\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition, SYM.AH_CROSSHAIRS[crsHNumber][1]);\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition + 1, SYM.AH_CROSSHAIRS[crsHNumber][2]);\r
            } else {\r
                // DEFAULT or unknown style\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition - 1, SYM.AH_CENTER_LINE);\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition, SYM.AH_CROSSHAIRS[crsHNumber]);\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition + 1, SYM.AH_CENTER_LINE_RIGHT);\r
            }\r
        }\r
\r
        // sidebars\r
        if ($('input[name="HORIZON_SIDEBARS"]').prop('checked')) {\r
            var hudwidth = OSD.constants.AHISIDEBARWIDTHPOSITION;\r
            var hudheight = OSD.constants.AHISIDEBARHEIGHTPOSITION;\r
            for (let i = -hudheight; i <= hudheight; i++) {\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition - hudwidth + (i * FONT.constants.SIZES.LINE), SYM.AH_DECORATION);\r
                OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition + hudwidth + (i * FONT.constants.SIZES.LINE), SYM.AH_DECORATION);\r
            }\r
            // AH level indicators\r
            OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition - hudwidth + 1, SYM.AH_LEFT);\r
            OSD.GUI.checkAndProcessSymbolPosition(hudCenterPosition + hudwidth - 1, SYM.AH_RIGHT);\r
        }\r
\r
        OSD.GUI.updateMapPreview(centerPosition, 'MAP_NORTH', 'N', SYM.HOME);\r
        OSD.GUI.updateMapPreview(centerPosition, 'MAP_TAKEOFF', 'T', SYM.HOME);\r
        OSD.GUI.updateMapPreview(centerPosition, 'RADAR', null, SYM.DIR_TO_HOME);\r
\r
        // render\r
        var $preview = $('.display-layout .preview').empty();\r
        var $row = $('<div class="row"/>');\r
        for (let i = 0; i < OSD.data.display_size.total;) {\r
            var charCode = OSD.data.preview[i];\r
            var colorStyle = '';\r
\r
            if (typeof charCode === 'object') {\r
                var item = OSD.data.preview[i][0];\r
                charCode = OSD.data.preview[i][1];\r
                if (OSD.data.preview[i][2] !== undefined) {\r
                    // if third field is set it contains a background color\r
                    colorStyle = 'style="background-color: ' + OSD.data.preview[i][2] + ';"';\r
                }\r
            }\r
            var $img = $('<div class="char"' + colorStyle + '><img src=' + FONT.draw(charCode) + '></img></div>')\r
                .on('mouseenter', OSD.GUI.preview.onMouseEnter)\r
                .on('mouseleave', OSD.GUI.preview.onMouseLeave)\r
                .on('dragover', OSD.GUI.preview.onDragOver)\r
                .on('dragleave', OSD.GUI.preview.onDragLeave)\r
                .on('drop', OSD.GUI.preview.onDrop)\r
                .data('item', item)\r
                .data('position', i);\r
            // Required for NW.js - Otherwise the <img /> will\r
            // consume drag/drop events.\r
            $img.find('img').css('pointer-events', 'none');\r
            if (item && item.positionable !== false) {\r
                var nameKey = 'osdElement_' + item.name;\r
                var nameMessage = i18n.getMessage(nameKey);\r
\r
                if (!nameMessage) {\r
                    nameMessage = titleize(item.name);\r
                }\r
\r
                $img.addClass('field-' + item.id)\r
                    .data('item', item)\r
                    .prop('draggable', true)\r
                    .on('dragstart', OSD.GUI.preview.onDragStart)\r
                    .prop('title', nameMessage);\r
            }\r
\r
            $row.append($img);\r
            if (++i % OSD.data.display_size.x == 0) {\r
                $preview.append($row);\r
                $row = $('<div class="row"/>');\r
            }\r
        }\r
    }\r
};\r
\r
OSD.GUI.updateAll = function() {\r
    if (!OSD.data.supported) {\r
        $('.unsupported').fadeIn();\r
        return;\r
    }\r
    var layouts = $('.osd_layouts');\r
    var copy = $('.osd_copy');\r
    var paste = $('.osd_paste').hide();\r
    var clear = $('.osd_clear');\r
    if (OSD.data.layout_count > 1) {\r
        layouts.empty();\r
        for (var ii = 0; ii < OSD.data.layout_count; ii++) {\r
            var name = ii > 0 ? i18n.getMessage('osdLayoutAlternative', [ii]) : i18n.getMessage('osdLayoutDefault');\r
            var opt = $('<option/>').val(ii).text(name).appendTo(layouts);\r
        }\r
        layouts.val(OSD.data.selected_layout);\r
        layouts.show();\r
        layouts.on('change', function() {\r
            OSD.updateSelectedLayout(parseInt(layouts.val()));\r
            OSD.GUI.updateFields();\r
            OSD.GUI.updateGuidesView($('#videoGuides').find('input').is(':checked'));\r
            OSD.GUI.updateDjiView($('#djiUnsupportedElements').find('input').is(':checked'));\r
            OSD.GUI.updatePreviews();\r
        });\r
\r
        copy.on('click', function() {\r
            if(OSD.data.selected_layout >= 0 && OSD.data.selected_layout < OSD.data.layout_count){\r
                layout_clipboard = {layout: JSON.parse(JSON.stringify(OSD.data.layouts[OSD.data.selected_layout])), filled: true};\r
                paste.show();\r
                GUI.log(i18n.getMessage('osdLayoutInsertedIntoClipboard'));\r
            }\r
        });\r
\r
        paste.on('click',  async function() {\r
            if(layout_clipboard.filled == true){\r
\r
                var oldLayout = JSON.parse(JSON.stringify(OSD.data.layouts[OSD.data.selected_layout]))\r
                OSD.data.layouts[OSD.data.selected_layout] = JSON.parse(JSON.stringify(layout_clipboard.layout));\r
                layouts.trigger('change');\r
\r
                for(var index in OSD.data.layouts[OSD.data.selected_layout])\r
                {\r
                    var item = OSD.data.layouts[OSD.data.selected_layout][index];\r
                    if(!(item.isVisible === false && oldLayout[index].isVisible === false) && (oldLayout[index].x !== item.x || oldLayout[index].y !== item.y || oldLayout[index].position !== item.position || oldLayout[index].isVisible !== item.isVisible)){\r
                        await OSD.saveItem({id: index});\r
                    }\r
                }\r
\r
                GUI.log(i18n.getMessage('osdLayoutPasteFromClipboard'));\r
            }\r
        });\r
\r
        clear.on('click', async function() {\r
            var oldLayout = JSON.parse(JSON.stringify(OSD.data.layouts[OSD.data.selected_layout]));\r
\r
            var clearedLayout = [];\r
            oldLayout.forEach(function(item, index){\r
                var itemCopy = JSON.parse(JSON.stringify(item));\r
                itemCopy.isVisible = false;\r
                clearedLayout[index] = itemCopy;\r
            })\r
\r
            OSD.data.layouts[OSD.data.selected_layout] = clearedLayout;\r
            layouts.trigger('change');\r
\r
            for(var index in OSD.data.layouts[OSD.data.selected_layout]) {\r
                var item = OSD.data.layouts[OSD.data.selected_layout][index];\r
                if(oldLayout[index].isVisible === true){\r
                    await OSD.saveItem({id: index});\r
                }\r
            }\r
\r
            GUI.log(i18n.getMessage('osdClearLayout'));\r
        });\r
\r
\r
    } else {\r
        layouts.hide();\r
        layouts.off('change');\r
\r
        copy.hide();\r
        copy.off('change');\r
\r
        paste.hide();\r
        paste.off('change');\r
\r
        clear.hide();\r
        clear.off('change');\r
    }\r
\r
    $('.osd_search').on('input', function(event) {\r
        OSD.GUI.updateFields(event);\r
    });\r
    $('.supported').fadeIn();\r
    OSD.GUI.updateVideoMode();\r
    OSD.GUI.updateUnits();\r
    OSD.GUI.updateFields();\r
    updatePilotAndCraftNames();\r
    OSD.GUI.updatePreviews();\r
    OSD.GUI.updateGuidesView($('#videoGuides').find('input').is(':checked'));\r
    OSD.GUI.updateDjiView(HARDWARE.capabilities.isDjiHdFpv && !HARDWARE.capabilities.isMspDisplay);\r
    OSD.GUI.updateAlarms();\r
};\r
\r
OSD.GUI.update = function() {\r
    OSD.reload(function() {\r
        OSD.GUI.updateAll();\r
    });\r
};\r
\r
OSD.GUI.saveItem = function(item) {\r
    OSD.saveItem(item, function() {\r
        OSD.GUI.updatePreviews();\r
    });\r
};\r
\r
OSD.GUI.saveConfig = function() {\r
    OSD.saveConfig(function() {\r
        OSD.GUI.updatePreviews();\r
    });\r
};\r
\r
let HARDWARE = {};\r
HARDWARE.init = function() {\r
    HARDWARE.capabilities = {\r
        isDjiHdFpv: false,\r
        isMspDisplay: false,\r
        useESCTelemetry: false,\r
        useRx: false,\r
        useCRSF: false,\r
        useBaro: false,\r
        usePitot: false\r
    };\r
};\r
\r
HARDWARE.update = function(callback) {\r
\r
    HARDWARE.init();\r
\r
    MSP.send_message(MSPCodes.MSP2_CF_SERIAL_CONFIG, false, false, function() {\r
        $.each(FC.SERIAL_CONFIG.ports, function(index, port){\r
            if(port.functions.includes('DJI_FPV')) {\r
                HARDWARE.capabilities.isDjiHdFpv = true;\r
            }\r
            if(port.functions.includes('MSP_DISPLAYPORT')) {\r
                HARDWARE.capabilities.isMspDisplay = true;\r
            }\r
            if (port.functions.includes('ESC')) {\r
                HARDWARE.capabilities.useESCTelemetry = true;\r
            }\r
        });\r
\r
        // Update RX data for Crossfire detection\r
        mspHelper.loadRxConfig(function() {\r
            HARDWARE.capabilities.useCRSF = (FC.RX_CONFIG.serialrx_provider == 6); // CRSF\r
            HARDWARE.capabilities.useRx = (FC.RX_CONFIG.serialrx_provider == 6 || FC.RX_CONFIG.receiver_type == 2 || FC.RX_CONFIG.serialrx_provider == 12); // CRSF or MSP or MAVLINK\r
\r
            mspHelper.loadSensorConfig(function () {\r
                HARDWARE.capabilities.useBaro  = (FC.SENSOR_CONFIG.barometer != 0);\r
                HARDWARE.capabilities.usePitot = (FC.SENSOR_CONFIG.pitot != 0);\r
\r
                if (callback) {\r
                    callback();\r
                }\r
            });\r
        });\r
    });\r
};\r
\r
const osdTab = {};\r
osdTab.initialize = function (callback) {\r
\r
    mspHelper.loadServoMixRules();\r
    mspHelper.loadLogicConditions(function() {\r
        // Refresh LC dropdowns now that conditions are loaded\r
        $('select.lc, select.ico_lc').html(getLCoptions());\r
    });\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    function save_to_eeprom() {\r
        console.log('save_to_eeprom');\r
        MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {\r
            GUI.log(i18n.getMessage('eepromSaved'));\r
        });\r
    }\r
\r
    HARDWARE.update(function () {\r
        import('./osd.html?raw').then(({default: html}) => GUI.load(html, Settings.processHtml(function() {\r
            // translate to user-selected language\r
           i18n.localize();\r
\r
            // Open modal window\r
            OSD.GUI.jbox = new jBox('Modal', {\r
                width: 750,\r
                height: 300,\r
                position: {y:'bottom'},\r
                offset: {y:-50},\r
                closeButton: 'title',\r
                animation: false,\r
                attach: $('#fontmanager'),\r
                title: 'OSD Font Manager',\r
                content: $('#fontmanagercontent')\r
            });\r
\r
            $('a.save').on('click', function () {\r
                Settings.saveInputs(save_to_eeprom);\r
            });\r
\r
            // Initialise guides checkbox\r
            isGuidesChecked = bridge.storeGet('showOSDGuides', false);\r
\r
            // Setup switch indicators\r
            $(".osdSwitchInd_channel option").each(function() {\r
                $(this).text("Ch " + $(this).text());\r
            });\r
\r
            // Function when text for switch indicators change\r
            $('.osdSwitchIndName').on('keyup', function() {\r
                // Make sure that the switch hint only contains A to Z\r
                let testExp = new RegExp('^[A-Za-z0-9]');\r
                let testText = $(this).val();\r
                if (testExp.test(testText.slice(-1))) {\r
                    $(this).val(testText.toUpperCase().slice(0, 4));\r
                } else {\r
                    $(this).val(testText.slice(0, -1));\r
                }\r
\r
                // Update the OSD preview\r
                refreshOSDSwitchIndicators();\r
            });\r
\r
            // Function to update the OSD layout when the switch text alignment changes\r
            $("#switchIndicators_alignLeft").on('change', function() {\r
                refreshOSDSwitchIndicators();\r
            });\r
\r
            // Functions for when pan servo settings change\r
            $('#osdPanServoIndicatorShowDegrees').on('change', function() {\r
                // Update the OSD preview\r
                updatePanServoPreview();\r
            });\r
\r
            $('#panServoOutput').on('change', function() {\r
                // Update the OSD preview\r
                updatePanServoPreview();\r
            });\r
\r
            // Function for when text for craft name changes\r
            $('#craft_name').on('keyup', function() {\r
                // Make sure that the craft name only contains A to Z, 0-9, spaces, and basic ASCII symbols\r
                let testExp = new RegExp('^[A-Za-z0-9 !_,:;=@#\\\\%\\\\&\\\\-\\\\*\\\\^\\\\(\\\\)\\\\.\\\\+\\\\<\\\\>\\\\[\\\\]]');\r
                let testText = $(this).val();\r
                if (testExp.test(testText.slice(-1))) {\r
                    $(this).val(testText.toUpperCase());\r
                } else {\r
                    $(this).val(testText.slice(0, -1));\r
                }\r
\r
                // Update the OSD preview\r
                updatePilotAndCraftNames();\r
            });\r
\r
            $('#pilot_name').on('keyup', function() {\r
                // Make sure that the pilot name only contains A to Z, 0-9, spaces, and basic ASCII symbols\r
                let testExp = new RegExp('^[A-Za-z0-9 !_,:;=@#\\\\%\\\\&\\\\-\\\\*\\\\^\\\\(\\\\)\\\\.\\\\+\\\\<\\\\>\\\\[\\\\]]');\r
                let testText = $(this).val();\r
                if (testExp.test(testText.slice(-1))) {\r
                    $(this).val(testText.toUpperCase());\r
                } else {\r
                    $(this).val(testText.slice(0, -1));\r
                }\r
\r
                // Update the OSD preview\r
                updatePilotAndCraftNames();\r
            });\r
\r
            // font preview window\r
            var $preview = $('.font-preview');\r
\r
            //  init structs once, also clears current font\r
            FONT.initData();\r
\r
            var $fontPicker = $('.fontbuttons button');\r
            $fontPicker.on('click', function () {\r
                if (!$(this).data('font-file')) {\r
                    return;\r
                }\r
                $fontPicker.removeClass('active');\r
                $(this).addClass('active');\r
                bridge.storeSet('osd_font', $(this).data('font-file'));\r
                \r
                import(\`./../resources/osd/analogue/\${$(this).data('font-file')}.mcm?raw\`).then(({default: data}) => {\r
                    FONT.parseMCMFontFile(data);\r
                    FONT.preview($preview);\r
                    OSD.GUI.update();\r
                });\r
                \r
            });\r
\r
            // load the last selected font when we change tabs\r
            var osd_font = bridge.storeGet('osd_font', false);\r
            var previous_font_button;\r
            if (osd_font) {\r
                previous_font_button = $('.fontbuttons button[data-font-file="' + osd_font + '"]');\r
                if (previous_font_button.attr('data-font-file') == undefined) previous_font_button = undefined;\r
            }\r
\r
            if (typeof previous_font_button == "undefined") {\r
                $fontPicker.first().trigger( "click" );\r
            } else {\r
                previous_font_button.trigger( "click" );\r
            }\r
\r
\r
            $('button.load_font_file').on('click', function () {\r
                $fontPicker.removeClass('active');\r
                FONT.openFontFile().then(function () {\r
                    FONT.preview($preview);\r
                    OSD.GUI.update();\r
                });\r
            });\r
\r
            // font upload\r
            $('a.flash_font').on('click', function () {\r
                if (!GUI.connect_lock) { // button disabled while flashing is in progress\r
                    var progressLabel = $('.progressLabel');\r
                    var progressBar = $('.progress');\r
                    var uploading = i18n.getMessage('uploadingCharacters');\r
                    progressLabel.text(uploading);\r
                    var progressCallback = function(done, total, percentage) {\r
                        progressBar.val(percentage);\r
                        if (done == total) {\r
                            progressLabel.text(i18n.getMessage('uploadedCharacters'), [total]);\r
                        } else {\r
                            progressLabel.text(uploading + ' (' + done + '/' + total + ')');\r
                        }\r
                    }\r
                    FONT.upload(progressCallback);\r
                }\r
            });\r
\r
            $('.update_preview').on('change', function () {\r
                if (OSD.data) {\r
                    // Force an OSD redraw by saving any element\r
                    // with a small delay, to make sure the setting\r
                    // change is performance before the OSD starts\r
                    // the full redraw.\r
                    // This will also update all previews\r
                    setTimeout(function() {\r
                        OSD.GUI.saveItem({id: 0});\r
                    }, 100);\r
                }\r
            });\r
\r
            $('#useCraftnameForMessages').on('change', function() {\r
                OSD.GUI.updateDjiMessageElements(this.checked);\r
            });\r
\r
            GUI.content_ready(callback);\r
        })));\r
    });\r
};\r
\r
function createCustomElements(){\r
    if(FC.OSD_CUSTOM_ELEMENTS.settings.customElementsCount == 0){\r
        $('.custom-element-container').remove();\r
        return;\r
    }\r
\r
    $('#INAVCharacterMapDocURL').attr('href', globalSettings.configuratorTreeLocation + 'resources/osd/INAV%20Character%20Map.md');\r
\r
    var customElementsContainer = $('#osdCustomElements');\r
    var init = true;\r
\r
    for(var i = 0; i < FC.OSD_CUSTOM_ELEMENTS.settings.customElementsCount; i++){\r
        var label = $('<label>');\r
\r
        var customElementTable = $('<table>').addClass('osdCustomElement_main_table');\r
        var customElementRowType = $('<tr>').data('row', i);\r
        var customElementRowValue = $('<tr>').data('row', i);\r
\r
        var customElementLabel = $('<tr>');\r
        customElementLabel.append($('<td>').attr('colspan', 2).append($('<span>').html(i18n.getMessage("custom_element") + ' ' + (i + 1))));\r
\r
        for(var ii = 0; ii < FC.OSD_CUSTOM_ELEMENTS.settings.customElementParts; ii++){\r
            var select = $('<select>').addClass('osdCustomElement-' + i + '-part-' + ii + '-type').data('valueCellClass', 'osdCustomElement-' + i + '-part-' + ii + '-value').html(\`\r
                        <option value="0">none</option>\r
                        <option data-value="text" value="1">Text</option>\r
                        <option data-value="ico" value="2">Icon Static</option>\r
                        <option data-value="ico_gv" value="3">Icon from Global Variable</option>\r
                        <option data-value="ico_lc" value="4">Icon from Logic Condition</option>\r
                        <option data-value="gv" value="5">Global Variable 0</option>\r
                        <option data-value="gv" value="6">Global Variable 00</option>\r
                        <option data-value="gv" value="7">Global Variable 000</option>\r
                        <option data-value="gv" value="8">Global Variable 0000</option>\r
                        <option data-value="gv" value="9">Global Variable 00000</option>\r
                        <option data-value="gv" value="10">Global Variable 0.0</option>\r
                        <option data-value="gv" value="11">Global Variable 0.00</option>\r
                        <option data-value="gv" value="12">Global Variable 00.0</option>\r
                        <option data-value="gv" value="13">Global Variable 00.00</option>\r
                        <option data-value="gv" value="14">Global Variable 000.0</option>\r
                        <option data-value="gv" value="15">Global Variable 000.00</option>\r
                        <option data-value="gv" value="16">Global Variable 0000.0</option>\r
                        <option data-value="lc" value="17">Logic Condition 0</option>\r
                        <option data-value="lc" value="18">Logic Condition 00</option>\r
                        <option data-value="lc" value="19">Logic Condition 000</option>\r
                        <option data-value="lc" value="20">Logic Condition 0000</option>\r
                        <option data-value="lc" value="21">Logic Condition 00000</option>\r
                        <option data-value="lc" value="22">Logic Condition 0.0</option>\r
                        <option data-value="lc" value="23">Logic Condition 0.00</option>\r
                        <option data-value="lc" value="24">Logic Condition 00.0</option>\r
                        <option data-value="lc" value="25">Logic Condition 00.00</option>\r
                        <option data-value="lc" value="26">Logic Condition 000.0</option>\r
                        <option data-value="lc" value="27">Logic Condition 000.00</option>\r
                        <option data-value="lc" value="28">Logic Condition 0000.0</option>\r
                        \`);\r
\r
            customElementRowType.append($('<td>').append(select));\r
            customElementRowValue.append($('<td>').addClass('osdCustomElement-' + i + '-part-' + ii + '-value').append(\r
                $('<input>').addClass('value').addClass('text').attr('type', 'text').attr('maxlength', FC.OSD_CUSTOM_ELEMENTS.settings.customElementTextSize).hide()).append(\r
                $('<input>').addClass('value').addClass('ico').attr('min', 1).attr('max', 255).hide()).append(\r
                $('<select>').addClass('value').addClass('ico_gv').html(getGVoptions()).hide()).append(\r
                $('<select>').addClass('value').addClass('ico_lc').html(getLCoptions()).hide()).append(\r
                $('<select>').addClass('value').addClass('gv').html(getGVoptions()).hide()).append(\r
                $('<select>').addClass('value').addClass('lc').html(getLCoptions()).hide()\r
            ));\r
\r
            select.change(function(){\r
                var dataValue = $(this).find(':selected').data('value');\r
                var valueBlock = $('.' + $(this).data('valueCellClass'))\r
                valueBlock.find('.value').hide();\r
                valueBlock.find('.' + dataValue).show();\r
                if(!init){\r
                    updateOSDCustomElementsDisplay();\r
                }\r
            });\r
        }\r
\r
        var selectVisibility = $('<select>').addClass('osdCustomElement-' + i + '-visibility-type').data('valueCellClass', 'osdCustomElement-' + i + '-visibility-value').html(\`\r
            <option value="0">always</option>\r
            <option data-value="gv" value="1">Global Variable</option>\r
            <option data-value="lc" value="2">Logic Condition</option>\r
        \`);\r
        customElementRowType.append($('<td>').append(selectVisibility));\r
        customElementRowValue.append($('<td>').addClass('osdCustomElement-' + i + '-visibility-value').append(\r
            $('<select>').addClass('value').addClass('gv').html(getGVoptions()).hide()\r
        ).append(\r
            $('<select>').addClass('value').addClass('lc').html(getLCoptions()).hide()\r
        ));\r
\r
        selectVisibility.change(function(){\r
            var dataValue = $(this).find(':selected').data('value');\r
            var valueBlock = $('.' + $(this).data('valueCellClass'))\r
            valueBlock.find('.value').hide();\r
            valueBlock.find('.' + dataValue).show();\r
        });\r
\r
        customElementTable.append(customElementLabel).append(customElementRowType).append(customElementRowValue);\r
        label.append(customElementTable);\r
        customElementsContainer.append(label);\r
    }\r
\r
    fillCustomElementsValues();\r
    customElementsInitCallback();\r
    init = false;\r
}\r
\r
function updateOSDCustomElementsDisplay() {\r
    let foundOSDCustomElements = 0;\r
    let generalGroup = OSD.constants.ALL_DISPLAY_GROUPS.filter(function(e) {\r
        return e.name == "osdGroupOSDCustomElements";\r
    })[0];\r
\r
    for (var i = 0; i < FC.OSD_CUSTOM_ELEMENTS.settings.customElementsCount; i++) {\r
        if ($('.osdCustomElement-' + i + '-part-0-type').val() != undefined) {\r
            for (let si = 0; si < generalGroup.items.length; si++) {\r
                if (generalGroup.items[si].name == "CUSTOM_ELEMENT_" + (i + 1)) {\r
                    let preview = "";\r
                    foundOSDCustomElements++;\r
\r
                    for (let ii = 0; ii < FC.OSD_CUSTOM_ELEMENTS.settings.customElementParts; ii++) {\r
                        var typeCell = $('.osdCustomElement-' + i + '-part-' + ii + '-type');\r
                        var valueCell = $('.osdCustomElement-' + i + '-part-' + ii + '-value');\r
\r
                        switch (parseInt(typeCell.val())) {\r
                            case 1:\r
                                preview += valueCell.find('.text').val().trim();\r
                                break;\r
                            case 2:\r
                                preview += FONT.symbol("0x" + parseInt(valueCell.find('.ico').val()).toString(16).toUpperCase());\r
                                break;\r
                            case 3:\r
                                preview += FONT.symbol(SYM.HOME);\r
                                break;\r
                            case 4:\r
                                preview += FONT.symbol(SYM.HOME);\r
                                break;\r
                            case 5:\r
                            case 17:\r
                                preview += FONT.symbol(SYM.BLANK) + "2";\r
                                break;\r
                            case 6:\r
                            case 18:\r
                                preview += FONT.symbol(SYM.BLANK) + "57";\r
                                break;\r
                            case 7:\r
                            case 19:\r
                                preview += FONT.symbol(SYM.BLANK) + "316";\r
                                break;\r
                            case 8:\r
                            case 20:\r
                                preview += FONT.symbol(SYM.BLANK) + "6926";\r
                                break;\r
                            case 9:\r
                            case 21:\r
                                preview += FONT.symbol(SYM.BLANK) + "36520";\r
                                break;\r
                            case 10:\r
                            case 22:\r
                                preview += FONT.symbol(SYM.BLANK) + FONT.embed_dot("1.6");\r
                                break;\r
                            case 11:\r
                            case 23:\r
                                preview += FONT.symbol(SYM.BLANK) + FONT.embed_dot("2.64");\r
                                break;\r
                            case 12:\r
                            case 24:\r
                                preview += FONT.symbol(SYM.BLANK) + FONT.embed_dot("21.4");\r
                                break;\r
                            case 13:\r
                            case 25:\r
                                preview += FONT.symbol(SYM.BLANK) + FONT.embed_dot("34.26");\r
                                break;\r
                            case 14:\r
                            case 26:\r
                                preview += FONT.symbol(SYM.BLANK) + FONT.embed_dot("315.7");\r
                                break;\r
                            case 15:\r
                            case 27:\r
                                preview += FONT.symbol(SYM.BLANK) + FONT.embed_dot("562.46");\r
                                break;\r
                            case 16:\r
                            case 28:\r
                                preview += FONT.symbol(SYM.BLANK) + FONT.embed_dot("4629.1");\r
                                break;\r
                        }\r
                    }\r
\r
                    if (preview == "") {\r
                        preview = "CE_" + (i + 1);\r
                    }\r
\r
                    generalGroup.items[si].preview = preview;\r
                }\r
            }\r
        }\r
\r
        if (foundOSDCustomElements >= FC.OSD_CUSTOM_ELEMENTS.settings.customElementsCount) {\r
            break;\r
        }\r
    }\r
    OSD.GUI.updatePreviews();\r
}\r
\r
function fillCustomElementsValues() {\r
    for (var i = 0; i < FC.OSD_CUSTOM_ELEMENTS.settings.customElementsCount; i++) {\r
        // Safety check - items may not be loaded yet\r
        if (!FC.OSD_CUSTOM_ELEMENTS.items[i] || !FC.OSD_CUSTOM_ELEMENTS.items[i].customElementItems) {\r
            continue;\r
        }\r
        for (var ii = 0; ii < FC.OSD_CUSTOM_ELEMENTS.settings.customElementParts; ii++) {\r
            if (!FC.OSD_CUSTOM_ELEMENTS.items[i].customElementItems[ii]) {\r
                continue;\r
            }\r
            $('.osdCustomElement-' + i + '-part-' + ii + '-type').val(FC.OSD_CUSTOM_ELEMENTS.items[i].customElementItems[ii].type).trigger('change');\r
\r
            var valueCell = $('.osdCustomElement-' + i + '-part-' + ii + '-value');\r
            switch (FC.OSD_CUSTOM_ELEMENTS.items[i].customElementItems[ii].type){\r
                case 1:\r
                    valueCell.find('.text').val(FC.OSD_CUSTOM_ELEMENTS .items[i].customElementText).trigger('change');\r
                    break;\r
                case 2:\r
                    valueCell.find('.ico').val(FC.OSD_CUSTOM_ELEMENTS.items[i].customElementItems[ii].value).trigger('change');\r
                    break;\r
                case 3:\r
                    valueCell.find('.ico_gv').val(FC.OSD_CUSTOM_ELEMENTS.items[i].customElementItems[ii].value).trigger('change');\r
                    break;\r
                case 4:\r
                    valueCell.find('.ico_lc').val(FC.OSD_CUSTOM_ELEMENTS.items[i].customElementItems[ii].value).trigger('change');\r
                    break;\r
                case 5:\r
                case 6:\r
                case 7:\r
                case 8:\r
                case 9:\r
                case 10:\r
                case 11:\r
                case 12:\r
                case 13:\r
                case 14:\r
                case 15:\r
                case 16:\r
                    valueCell.find('.gv').val(FC.OSD_CUSTOM_ELEMENTS.items[i].customElementItems[ii].value).trigger('change');\r
                    break;\r
                case 17:\r
                case 18:\r
                case 19:\r
                case 20:\r
                case 21:\r
                case 22:\r
                case 23:\r
                case 24:\r
                case 25:\r
                case 26:\r
                case 27:\r
                case 28:\r
                    valueCell.find('.lc').val(FC.OSD_CUSTOM_ELEMENTS.items[i].customElementItems[ii].value).trigger('change');\r
                    break;\r
            }\r
        }\r
\r
        $('.osdCustomElement-' + i + '-visibility-type').val(FC.OSD_CUSTOM_ELEMENTS .items[i].customElementVisibility.type).trigger('change');\r
        var valueVisibilityCell = $('.osdCustomElement-' + i + '-visibility-value');\r
        switch (FC.OSD_CUSTOM_ELEMENTS .items[i].customElementVisibility.type){\r
            case 1:\r
                valueVisibilityCell.find('.gv').val(FC.OSD_CUSTOM_ELEMENTS .items[i].customElementVisibility.value).trigger('change');\r
                break;\r
            case 2:\r
                valueVisibilityCell.find('.lc').val(FC.OSD_CUSTOM_ELEMENTS .items[i].customElementVisibility.value).trigger('change');\r
                break;\r
        }\r
\r
        customElementNormaliseRow(i);\r
        customElementDisableNonValidOptionsRow(i);\r
    }\r
}\r
\r
function customElementsInitCallback() {\r
\r
    var callback = function(){\r
        var row = $(this).closest('tr').data('row');\r
\r
        customElementNormaliseRow(row);\r
        customElementDisableNonValidOptionsRow(row);\r
\r
        MSP.promise(MSPCodes.MSP2_INAV_SET_CUSTOM_OSD_ELEMENTS, customElementGetDataForRow(row));\r
    };\r
\r
    var customElements = $('#osdCustomElements')\r
    customElements.find('input, select').change(callback);\r
    customElements.find('input').keyup(callback);\r
}\r
\r
function customElementNormaliseRow(row){\r
    for(var i = 0; i < FC.OSD_CUSTOM_ELEMENTS.settings.customElementParts; i++){\r
        var elementType = $('.osdCustomElement-' + row + '-part-' + i + '-type');\r
        var valueCell = $('.' + elementType.data('valueCellClass'));\r
\r
        switch (parseInt(elementType.val())){\r
            case 1:\r
                valueCell.find('.text').val(valueCell.find('.text').val().toUpperCase());\r
                valueCell.find('.text').val(valueCell.find('.text').val().replace(/[^A-Z0-9!.\\* ]/g, ""));\r
                break;\r
            case 2:\r
                valueCell.find('.ico').val(valueCell.find('.ico').val() > 255 ? 255 : valueCell.find('.ico').val());\r
                valueCell.find('.ico').val((valueCell.find('.ico').val() != '' && valueCell.find('.ico').val() < 1 )? 1 : valueCell.find('.ico').val());\r
        }\r
    }\r
    updateOSDCustomElementsDisplay();\r
}\r
\r
function customElementDisableNonValidOptionsRow(row) {\r
    var selectedTextIndex = false;\r
    for(let i = 0; i < FC.OSD_CUSTOM_ELEMENTS.settings.customElementParts; i++){\r
        let elementType = $('.osdCustomElement-' + row + '-part-' + i + '-type');\r
\r
        if(parseInt(elementType.val()) === 1)\r
        {\r
            selectedTextIndex = i;\r
            break;\r
        }\r
    }\r
\r
    for(let i = 0; i < FC.OSD_CUSTOM_ELEMENTS.settings.customElementParts; i++){\r
        let elementType = $('.osdCustomElement-' + row + '-part-' + i + '-type');\r
        if(i !== selectedTextIndex && selectedTextIndex !== false){\r
            elementType.find('option[value="1"]').attr('disabled', 'disabled');\r
        }else{\r
            elementType.find('option[value="1"]').removeAttr('disabled');\r
        }\r
    }\r
}\r
\r
function customElementGetDataForRow(row){\r
    var data = [];\r
    data.push8(row);\r
\r
    var text = "";\r
\r
    for(var ii = 0; ii < FC.OSD_CUSTOM_ELEMENTS.settings.customElementParts; ii++){\r
        var elementType = $('.osdCustomElement-' + row + '-part-' + ii + '-type');\r
        var valueCell = $('.' + elementType.data('valueCellClass'));\r
        var partValue = 0;\r
\r
        switch (parseInt(elementType.val())){\r
            case 1:\r
                text = valueCell.find('.text').val();\r
                break;\r
            case 2:\r
                partValue = parseInt(valueCell.find('.ico').val());\r
                break;\r
            case 3:\r
                partValue = parseInt(valueCell.find('.ico_gv').find(':selected').val());\r
                break;\r
            case 4:\r
                partValue = parseInt(valueCell.find('.ico_lc').find(':selected').val());\r
                break;\r
            case 5:\r
            case 6:\r
            case 7:\r
            case 8:\r
            case 9:\r
            case 10:\r
            case 11:\r
            case 12:\r
            case 13:\r
            case 14:\r
            case 15:\r
            case 16:\r
                partValue = parseInt(valueCell.find('.gv').find(':selected').val());\r
                break;\r
            case 17:\r
            case 18:\r
            case 19:\r
            case 20:\r
            case 21:\r
            case 22:\r
            case 23:\r
            case 24:\r
            case 25:\r
            case 26:\r
            case 27:\r
            case 28:\r
                partValue = parseInt(valueCell.find('.lc').find(':selected').val());\r
                break;\r
        }\r
\r
        data.push8(parseInt(elementType.val()));\r
        data.push16(partValue);\r
    }\r
\r
    var elementVisibilityType = $('.osdCustomElement-' + row + '-visibility-type');\r
    var valueVisibilityCell = $('.' + elementVisibilityType.data('valueCellClass'));\r
    var visibilityValue = null;\r
    switch (parseInt(elementVisibilityType.val())){\r
        case 1:\r
            visibilityValue = parseInt(valueVisibilityCell.find('.gv').find(':selected').val());\r
            break;\r
        case 2:\r
            visibilityValue = parseInt(valueVisibilityCell.find('.lc').find(':selected').val());\r
            break;\r
    }\r
\r
    data.push8(parseInt(elementVisibilityType.val()));\r
    data.push16(visibilityValue);\r
\r
    console.log("Saving osd custom data for number " + row + " | data: " + data);\r
\r
    for(var i = 0; i < FC.OSD_CUSTOM_ELEMENTS.settings.customElementTextSize; i++){\r
        if(i < text.length){\r
            data.push8(text.charCodeAt(i))\r
        }else{\r
            data.push8(0);\r
        }\r
    }\r
\r
    return data;\r
}\r
\r
function getGVoptions(){\r
    var result = '';\r
    for(var i = 0; i < 8; i++) {\r
        result += \`<option value="\` + i + \`">GV \` + i + \`</option>\`;\r
    }\r
    return result;\r
}\r
\r
function getLCoptions(){\r
    var result = '';\r
    // Return empty if conditions aren't fully loaded yet - callback will refresh\r
    if (FC.LOGIC_CONDITIONS.getCount() < FC.LOGIC_CONDITIONS.getMaxLogicConditionCount()) {\r
        return result;\r
    }\r
    for(var i = 0; i < FC.LOGIC_CONDITIONS.getMaxLogicConditionCount(); i++) {\r
        if (FC.LOGIC_CONDITIONS.isEnabled(i)) {\r
            result += \`<option value="\` + i + \`">LC \` + i + \`</option>\`;\r
        }\r
    }\r
    return result;\r
}\r
\r
function refreshOSDSwitchIndicators() {\r
    let group = OSD.constants.ALL_DISPLAY_GROUPS.filter(function(e) {\r
        return e.name == "osdGroupSwitchIndicators";\r
      })[0];\r
    for (let si = 0; si < group.items.length; si++) {\r
        let item = group.items[si];\r
        if ($("#osdSwitchInd" + si +"_name").val() != undefined) {\r
            let switchIndText = $("#osdSwitchInd" + si +"_name").val();\r
            if (switchIndText == "") {\r
                item.preview = FONT.symbol(SYM.SWITCH_INDICATOR_HIGH);\r
            } else {\r
                if ($("#switchIndicators_alignLeft").prop('checked')) {\r
                    item.preview = switchIndText + FONT.symbol(SYM.SWITCH_INDICATOR_HIGH);\r
                } else {\r
                    item.preview = FONT.symbol(SYM.SWITCH_INDICATOR_HIGH) + switchIndText;\r
                }\r
            }\r
        }\r
    }\r
\r
    OSD.GUI.updatePreviews();\r
}\r
\r
function updatePilotAndCraftNames() {\r
    // Guard against being called before OSD constants are initialized\r
    if (!OSD.constants || !OSD.constants.ALL_DISPLAY_GROUPS) {\r
        return;\r
    }\r
\r
    let foundPilotName = ($('#pilot_name').val() == undefined);\r
    let foundCraftName = ($('#craft_name').val() == undefined);\r
\r
    let generalGroup = OSD.constants.ALL_DISPLAY_GROUPS.filter(function(e) {\r
        return e.name == "osdGroupGeneral";\r
    })[0];\r
\r
    if (!generalGroup || !generalGroup.items) {\r
        return;\r
    }\r
\r
    if (($('#craft_name').val() != undefined) || ($('#pilot_name').val() != undefined)) {\r
        for (let si = 0; si < generalGroup.items.length; si++) {\r
            if (generalGroup.items[si].name == "CRAFT_NAME") {\r
                let nameText = $('#craft_name').val();\r
\r
                if (nameText == "") {\r
                    generalGroup.items[si].preview = "CRAFT_NAME";\r
                } else {\r
                    generalGroup.items[si].preview = nameText;\r
                }\r
                foundCraftName = true;\r
            }\r
\r
            if (generalGroup.items[si].name == "PILOT_NAME") {\r
                let nameText = $('#pilot_name').val();\r
\r
                if (nameText == "") {\r
                    generalGroup.items[si].preview = "PILOT_NAME";\r
                } else {\r
                    generalGroup.items[si].preview = nameText;\r
                }\r
                foundPilotName = true;\r
            }\r
\r
            if (foundCraftName && foundPilotName) {\r
                break;\r
            }\r
        }\r
    }\r
\r
    OSD.GUI.updatePreviews();\r
};\r
\r
function updatePanServoPreview() {\r
    // Show or hide the settings, based on of the feature is active.\r
    if ($('#panServoOutput').val() === "0") {\r
        $('#osd_pan_settings').hide();\r
        $('#panServoOutput').parent().addClass('no-bottom');\r
    } else {\r
        $('#osd_pan_settings').show();\r
        $('#panServoOutput').parent().removeClass('no-bottom');\r
    }\r
\r
    // Update the panServoOutput select to be visibly easier to use\r
    let servoRules = FC.SERVO_RULES;\r
    $('#panServoOutput option').each(function() {\r
        let servoIndex = $(this).val();\r
\r
        if (servoIndex === "0") {\r
            $(this).text("OFF");\r
        } else {\r
            let servo = servoRules.getServoMixRuleFromTarget(servoIndex);\r
            if (servo == null) {\r
                $(this).remove();\r
            } else {\r
                let servoInputIndex = parseInt(servo.getInput());\r
                $(this).text("Servo " + servoIndex + ": " + FC.getServoMixInputName(servoInputIndex));\r
            }\r
        }\r
    });\r
\r
    // Update the OSD preview based on settings\r
    let generalGroup = OSD.constants.ALL_DISPLAY_GROUPS.filter(function(e) {\r
        return e.name == "osdGroupGeneral";\r
      })[0];\r
\r
    for (let si = 0; si < generalGroup.items.length; si++) {\r
        if (generalGroup.items[si].name == "PAN_SERVO_CENTRED") {\r
            let craftNameText = $('#craft_name').val();\r
\r
            if ($('#osdPanServoIndicatorShowDegrees').prop('checked')) {\r
                generalGroup.items[si].preview = FONT.symbol(SYM.PAN_SERVO_IS_OFFSET_L) + '120' + FONT.symbol(SYM.DEGREES);\r
            } else {\r
                generalGroup.items[si].preview = FONT.symbol(SYM.PAN_SERVO_IS_OFFSET_L);\r
            }\r
            break;\r
        }\r
    }\r
\r
    OSD.GUI.updatePreviews();\r
}\r
\r
osdTab.cleanup = function (callback) {\r
    PortHandler.flush_callbacks();\r
\r
    // unbind "global" events\r
    $(document).unbind('keypress');\r
    $(document).off('click', 'span.progressLabel a');\r
\r
    delete OSD.GUI.jbox;\r
    $('.jBox-wrapper').remove();\r
\r
    if (callback) callback();\r
};\r
\r
export default osdTab;`;export{n as default};
