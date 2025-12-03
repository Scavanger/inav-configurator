const n=`'use strict';\r
\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import i18n from './../js/localization';\r
\r
const ledStripTab = {};\r
\r
ledStripTab.wireMode = false;\r
ledStripTab.functions = ['i', 'w', 'f', 'a', 't', 'r', 'c', 'g', 's', 'b', 'l', 'o', 'n'];\r
ledStripTab.baseFuncs = ['c', 'f', 'a', 'l', 's', 'g', 'r', 'h'];\r
ledStripTab.overlays = ['t', 'o', 'b', 'n', 'i', 'w', 'e'];\r
ledStripTab.directions = ['n', 'e', 's', 'w', 'u', 'd'],\r
\r
ledStripTab.initialize = function (callback, scrollPosition) {\r
    var self = this;\r
    var selectedColorIndex = null;\r
    var selectedModeColor = null;\r
\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    function load_led_config() {\r
        MSP.send_message(MSPCodes.MSP2_INAV_LED_STRIP_CONFIG_EX, false, false, load_led_colors);\r
    }\r
\r
    function load_led_colors() {\r
        MSP.send_message(MSPCodes.MSP_LED_COLORS, false, false, load_led_mode_colors);\r
    }\r
\r
    function load_led_mode_colors() {\r
        MSP.send_message(MSPCodes.MSP_LED_STRIP_MODECOLOR, false, false, load_html);\r
    }\r
\r
    function load_html() {\r
        import('./led_strip.html?raw').then(({default: html}) => GUI.load(html, process_html));\r
    }\r
\r
    load_led_config();\r
\r
\r
    function buildUsedWireNumbers() {\r
        var usedWireNumbers = [];\r
        $('.mainGrid .gPoint .wire').each(function () {\r
            var wireNumber = parseInt($(this).html());\r
            if (wireNumber >= 0) {\r
                usedWireNumbers.push(wireNumber);\r
            }\r
        });\r
        usedWireNumbers.sort(function(a,b){return a - b});\r
        return usedWireNumbers;\r
    }\r
\r
    function process_html() {\r
\r
       i18n.localize();;\r
\r
        // Build Grid\r
        var theHTML = [];\r
        var theHTMLlength = 0;\r
        for (var i = 0; i < 256; i++) {\r
            theHTML[theHTMLlength++] = ('<div class="gPoint"><div class="indicators"><span class="north"></span><span class="south"></span><span class="west"></span><span class="east"></span><span class="up">U</span><span class="down">D</span></div><span class="wire"></span><span class="overlay-t"> </span><span class="overlay-o"> </span><span class="overlay-b"> </span><span class="overlay-n"> </span><span class="overlay-w"> </span><span class="overlay-i"> </span><span class="overlay-color"> </span></div>');\r
        }\r
        $('.mainGrid').html(theHTML.join(''));\r
\r
        $('.tempOutput').on('click', function () {\r
            $(this).select();\r
        });\r
\r
        // Clear button\r
        $('.funcClear').on('click', function () {\r
            $('.gPoint').each(function() {\r
                if ($(this).is('.ui-selected')) {\r
                    removeFunctionsAndDirections(this);\r
                    $(this).find('.wire').html('');\r
                }\r
            });\r
\r
            $('.controls button').removeClass('btnOn');\r
            updateBulkCmd();\r
        });\r
\r
        // Clear All button\r
        $('.funcClearAll').on('click', function () {\r
            $('.gPoint').each(function() {\r
                removeFunctionsAndDirections(this);\r
            });\r
            $('.gPoint .wire').html('');\r
\r
            updateBulkCmd();\r
\r
            $('.controls button').removeClass('btnOn');\r
        });\r
\r
        function removeFunctionsAndDirections(element) {\r
            var classesToRemove = [];\r
\r
            ledStripTab.baseFuncs.forEach(function(letter) {\r
                classesToRemove.push('function-' + letter);\r
            });\r
            ledStripTab.overlays.forEach(function(letter) {\r
                classesToRemove.push('function-' + letter);\r
            });\r
            ledStripTab.directions.forEach(function(letter) {\r
                classesToRemove.push('dir-' + letter);\r
            });\r
            $(element).removeClass(classesToRemove.join(' '));\r
        }\r
\r
        // Directional Buttons\r
        $('.directions').on('click', 'button', function() {\r
            var that = this;\r
            if ($('.ui-selected').length > 0) {\r
                ledStripTab.directions.forEach(function(letter) {\r
                    if ($(that).is('.dir-' + letter)) {\r
                        if ($(that).is('.btnOn')) {\r
                            $(that).removeClass('btnOn');\r
                            $('.ui-selected').removeClass('dir-' + letter);\r
                        } else {\r
                            $(that).addClass('btnOn');\r
                            $('.ui-selected').addClass('dir-' + letter);\r
                        }\r
                    }\r
                });\r
\r
                clearModeColorSelection();\r
                updateBulkCmd();\r
            }\r
        });\r
\r
        // Mode Color Buttons\r
        $('.mode_colors').on('click', 'button', function() {\r
            var that = this;\r
            FC.LED_MODE_COLORS.forEach(function(mc) {\r
                if ($(that).is('.mode_color-' + mc.mode + '-' + mc.direction)) {\r
                    if ($(that).is('.btnOn')) {\r
                        $(that).removeClass('btnOn');\r
                        $('.ui-selected').removeClass('mode_color-' + mc.mode + '-' + mc.direction);\r
                        selectedModeColor = null;\r
                    } else {\r
                        $(that).addClass('btnOn');\r
                        selectedModeColor = { mode: mc.mode, direction: mc.direction };\r
\r
                        // select the color button\r
                        for (var colorIndex = 0; colorIndex < 16; colorIndex++) {\r
                            var className = '.color-' + colorIndex;\r
                            if (colorIndex == getModeColor(mc.mode, mc.direction)) {\r
                                $(className).addClass('btnOn');\r
                                selectedColorIndex = colorIndex;\r
                                setColorSliders(colorIndex);\r
\r
                            } else {\r
                                $(className).removeClass('btnOn');\r
                            }\r
                        }\r
                    }\r
                }\r
            });\r
\r
            $('.mode_colors').each(function() {\r
                $(this).children().each(function() {\r
                    if (! $(this).is($(that))) {\r
                        if ($(this).is('.btnOn')) {\r
                            $(this).removeClass('btnOn');\r
                        }\r
                    }\r
                });\r
            });\r
\r
            updateBulkCmd();\r
\r
        });\r
\r
        // Color sliders\r
        var ip = $('div.colorDefineSliders input');\r
        ip.eq(0).on("input change", function() { updateColors($(this).val(), 0); });\r
        ip.eq(1).on("input change", function() { updateColors($(this).val(), 1); });\r
        ip.eq(2).on("input change", function() { updateColors($(this).val(), 2); });\r
        for (var i = 0; i < 3; i++) {\r
            updateColors(ip.eq(i).val(), i);\r
        }\r
\r
        // Color Buttons\r
        $('.colors').on('click', 'button', function(e) {\r
            var that = this;\r
            var colorButtons = $(this).parent().find('button');\r
\r
            for (var colorIndex = 0; colorIndex < 16; colorIndex++) {\r
                colorButtons.removeClass('btnOn');\r
                if (selectedModeColor == undefined)\r
                    $('.ui-selected').removeClass('color-' + colorIndex);\r
\r
                if ($(that).is('.color-' + colorIndex)) {\r
                    selectedColorIndex = colorIndex;\r
                    if (selectedModeColor == undefined)\r
                        $('.ui-selected').addClass('color-' + colorIndex);\r
                }\r
            }\r
\r
\r
            setColorSliders(selectedColorIndex);\r
\r
            $(this).addClass('btnOn');\r
\r
            if (selectedModeColor) {\r
                setModeColor(selectedModeColor.mode, selectedModeColor.direction, selectedColorIndex);\r
            }\r
\r
            drawColorBoxesInColorLedPoints();\r
\r
            // refresh color buttons\r
            $('.colors').children().each(function() { setBackgroundColor($(this)); });\r
            $('.overlay-color').each(function() { setBackgroundColor($(this)); });\r
\r
            $('.mode_colors').each(function() { setModeBackgroundColor($(this)); });\r
            $('.special_colors').each(function() { setModeBackgroundColor($(this)); });\r
\r
            updateBulkCmd();\r
        });\r
\r
        $('.colors').on('dblclick', 'button', function(e) {\r
\r
            var moveLeft = $('.tab-led-strip').offset().left + ($('.colorDefineSliders').width() / 2);\r
            var moveUp =   $('.tab-led-strip').offset().top  + $('.colorDefineSliders').height() + 20;\r
\r
            $('.colorDefineSliders').css('left', e.pageX - e.offsetX - moveLeft);\r
            $('.colorDefineSliders').css('top', e.pageY - e.offsetY - moveUp);\r
            $('.colorDefineSliders').show();\r
\r
        });\r
\r
        $('.colorDefineSliders').on({\r
            mouseleave: function () {\r
                $('.colorDefineSliders').hide();\r
            }\r
        });\r
\r
        $('.colors').children().on({\r
            mouseleave: function () {\r
                if (!$('.colorDefineSliders').is(":hover"))\r
                    $('.colorDefineSliders').hide();\r
            }\r
        });\r
\r
        $('.funcWire').on('click', function () {\r
            $(this).toggleClass('btnOn');\r
            ledStripTab.wireMode = $(this).hasClass('btnOn');\r
            $('.mainGrid').toggleClass('gridWire');\r
        });\r
\r
        $('.funcWireClearSelect').on('click', function () {\r
            $('.ui-selected').each(function() {\r
                var thisWire = $(this).find('.wire');\r
                if (thisWire.html() != '') {\r
                    thisWire.html('');\r
                }\r
                updateBulkCmd();\r
            });\r
        });\r
\r
        $('.funcWireClear').on('click', function () {\r
            $('.gPoint .wire').html('');\r
            updateBulkCmd();\r
        });\r
\r
        $('.mainGrid').selectable({\r
            filter: ' > div',\r
            stop: function() {\r
                var functionsInSelection = [];\r
                var directionsInSelection = [];\r
\r
                clearModeColorSelection();\r
\r
                var that;\r
                $('.ui-selected').each(function() {\r
\r
                    var usedWireNumbers = buildUsedWireNumbers();\r
\r
                    var nextWireNumber = 0;\r
                    for (var nextWireNumber = 0; nextWireNumber < usedWireNumbers.length; nextWireNumber++) {\r
                        if (usedWireNumbers[nextWireNumber] != nextWireNumber) {\r
                            break;\r
                        }\r
                    }\r
\r
                    if (ledStripTab.wireMode) {\r
                        if ($(this).find('.wire').html() == '' && nextWireNumber < FC.LED_STRIP.length) {\r
                            $(this).find('.wire').html(nextWireNumber);\r
                        }\r
                    }\r
\r
                    if ($(this).find('.wire').text() != '') {\r
\r
                        that = this;\r
\r
                        // Get function & overlays or current cell\r
                        ledStripTab.directions.forEach(function(letter) {\r
                            var className = '.dir-' + letter;\r
                            if ($(that).is(className)) {\r
                                directionsInSelection.push(className);\r
                            }\r
                        });\r
\r
                        ledStripTab.baseFuncs.forEach(function(letter) {\r
                            var className = '.function-' + letter;\r
                            if ($(that).is(className)) {\r
                                functionsInSelection.push(className);\r
                            }\r
                        });\r
\r
                        ledStripTab.overlays.forEach(function(letter) {\r
                            var className = '.function-' + letter;\r
                            if ($(that).is(className)) {\r
                                functionsInSelection.push(className);\r
                            }\r
                        });\r
                    }\r
                });\r
\r
                var uiSelectedLast = that;\r
                $('select.functionSelect').val("");\r
\r
                ledStripTab.baseFuncs.forEach(function(letter) {\r
                    var className = 'function-' + letter;\r
                    if ($('select.functionSelect').is("." + className)) {\r
                        $('select.functionSelect').removeClass(className);\r
                    }\r
                });\r
\r
                selectedColorIndex = 0;\r
\r
                if (uiSelectedLast) {\r
\r
                    // set active color\r
                    for (var colorIndex = 0; colorIndex < 16; colorIndex++) {\r
                        var className = '.color-' + colorIndex;\r
                        if ($(uiSelectedLast).is(className)) {\r
                            $(className).addClass('btnOn');\r
                            selectedColorIndex = colorIndex;\r
\r
                        } else {\r
                            $(className).removeClass('btnOn');\r
                        }\r
                    }\r
\r
                    // set checkbox values\r
                    ledStripTab.overlays.forEach(function(letter) {\r
                        var feature_o = $('.checkbox').find('input.function-' + letter);\r
\r
                        var newVal = ($(uiSelectedLast).is('.function-' + letter));\r
\r
                        if (feature_o.is(':checked') != newVal) {\r
                            feature_o.prop('checked', newVal);\r
                            feature_o.trigger('change');\r
                        }\r
                    });\r
\r
                    // Update active function in combobox\r
                    ledStripTab.baseFuncs.forEach(function(letter) {\r
                        if ($(uiSelectedLast).is('.function-' + letter)) {\r
                            $('select.functionSelect').val("function-" + letter);\r
                            $('select.functionSelect').addClass("function-" + letter);\r
                        }\r
                    });\r
                }\r
                updateBulkCmd();\r
\r
                setColorSliders(selectedColorIndex);\r
\r
                setOptionalGroupsVisibility();\r
\r
                $('.directions button').removeClass('btnOn');\r
                directionsInSelection.forEach(function(direction_e) {\r
                    $(direction_e).addClass('btnOn');\r
                });\r
            }\r
        });\r
\r
        // UI: select LED function from drop-down\r
        $('.functionSelect').on('change', function() {\r
            clearModeColorSelection();\r
            applyFunctionToSelectedLeds();\r
            drawColorBoxesInColorLedPoints();\r
            setOptionalGroupsVisibility();\r
            updateBulkCmd();\r
        });\r
\r
        // UI: select mode from drop-down\r
        $('.modeSelect').on('change', function() {\r
\r
            var that = this;\r
\r
            var mode = Number($(that).val());\r
            $('.mode_colors').find('button').each(function() {\r
                for (var i = 0; i < 6; i++)\r
                    for (var j = 0; j < 6; j++)\r
                        if ($(this).hasClass('mode_color-' + i + '-' + j)) {\r
                            $(this).removeClass('mode_color-' + i + '-' + j);\r
                            $(this).addClass('mode_color-' + mode + '-' + j);\r
                        }\r
                            });\r
\r
            $('.mode_colors').each(function() { setModeBackgroundColor($(this)); });\r
        });\r
\r
        function toggleSwitch(that, letter)\r
        {\r
            if ($(that).is(':checked')) {\r
                $('.ui-selected').find('.wire').each(function() {\r
                    if ($(this).text() != "") {\r
\r
                        var p = $(this).parent();\r
\r
                        ledStripTab.functions.forEach(function(f) {\r
                            if (p.is('.function-' + f)) {\r
\r
                                switch (letter) {\r
                                case 't':\r
                                case 'o':\r
                                case 's':\r
                                    if (areModifiersActive('function-' + f))\r
                                        p.addClass('function-' + letter);\r
                                    break;\r
                                case 'b':\r
                                case 'e':\r
                                case 'n':\r
                                    if (areBlinkersActive('function-' + f))\r
                                        p.addClass('function-' + letter);\r
                                    break;\r
                                case 'i':\r
                                    if (areOverlaysActive('function-' + f))\r
                                        p.addClass('function-' + letter);\r
                                    break;\r
                                case 'w':\r
                                    if (areOverlaysActive('function-' + f))\r
                                        if (isWarningActive('function-' + f))\r
                                            p.addClass('function-' + letter);\r
                                    break;\r
                                }\r
                            }\r
                        });\r
                    }\r
                });\r
            } else {\r
                $('.ui-selected').removeClass('function-' + letter);\r
            }\r
            return $(that).is(':checked');\r
        }\r
\r
        // UI: check-box toggle\r
        $('.checkbox').on('change', function(e) {\r
            if (e.originalEvent) {\r
                // user-triggered event\r
                var that = $(this).find('input');\r
                if ($('.ui-selected').length > 0) {\r
\r
                    ledStripTab.overlays.forEach(function(letter) {\r
                        if ($(that).is('.function-' + letter)) {\r
                            var ret = toggleSwitch(that, letter);\r
\r
                            var cbn = $('.checkbox .function-n'); // blink on landing\r
                            var cbb = $('.checkbox .function-b'); // blink\r
\r
                            if (ret) {\r
                                if (letter == 'b' && cbn.is(':checked')) {\r
                                    cbn.prop('checked', false);\r
                                    cbn.trigger('change');\r
                                    toggleSwitch(cbn, 'n');\r
                                } else if (letter == 'n' && cbb.is(':checked')) {\r
                                    cbb.prop('checked', false);\r
                                    cbb.trigger('change');\r
                                    toggleSwitch(cbb, 'b');\r
                                }\r
                            }\r
                        }\r
                    });\r
\r
                    clearModeColorSelection();\r
                    updateBulkCmd();\r
                    setOptionalGroupsVisibility();\r
                }\r
            } else {\r
                // code-triggered event\r
            }\r
        });\r
\r
\r
\r
        $('.mainGrid').disableSelection();\r
\r
        $('.gPoint').each(function(){\r
            var gridNumber = ($(this).index() + 1);\r
            var row = Math.ceil(gridNumber / 16) - 1;\r
            var col = gridNumber/16 % 1 * 16 - 1;\r
            if (col < 0) {\r
                col = 15;\r
            }\r
\r
            var ledResult = findLed(col, row);\r
            if (!ledResult) {\r
                return;\r
            }\r
\r
            var ledIndex = ledResult.index;\r
            var led = ledResult.led;\r
\r
            if (led.functions[0] == 'c' && led.functions.length == 1 && led.directions.length == 0 && led.color == 0 && led.x == 0 && led.y == 0) {\r
                return;\r
            }\r
\r
            $(this).find('.wire').html(ledIndex);\r
\r
            for (var modeIndex = 0; modeIndex < led.functions.length; modeIndex++) {\r
                $(this).addClass('function-' + led.functions[modeIndex]);\r
            }\r
\r
            for (var directionIndex = 0; directionIndex < led.directions.length; directionIndex++) {\r
                $(this).addClass('dir-' + led.directions[directionIndex]);\r
            }\r
\r
            $(this).addClass('color-' + led.color);\r
\r
        });\r
\r
        $('a.save').on('click', function () {\r
\r
            mspHelper.sendLedStripConfig(send_led_strip_colors);\r
\r
            function send_led_strip_colors() {\r
                mspHelper.sendLedStripColors(send_led_strip_mode_colors);\r
            }\r
\r
            function send_led_strip_mode_colors() {\r
                mspHelper.sendLedStripModeColors(save_to_eeprom);\r
            }\r
\r
            function save_to_eeprom() {\r
                MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function() {\r
                    GUI.log(i18n.getMessage('ledStripEepromSaved'));\r
                });\r
            }\r
\r
        });\r
\r
        $('.colorDefineSliders').hide();\r
\r
        applyFunctionToSelectedLeds();\r
        drawColorBoxesInColorLedPoints();\r
        setOptionalGroupsVisibility();\r
\r
        updateBulkCmd();\r
\r
        GUI.content_ready(callback);\r
    }\r
\r
\r
\r
\r
\r
\r
\r
    function findLed(x, y) {\r
        for (var ledIndex = 0; ledIndex < FC.LED_STRIP.length; ledIndex++) {\r
            var led = FC.LED_STRIP[ledIndex];\r
            if (led.x == x && led.y == y) {\r
                return { index: ledIndex, led: led };\r
            }\r
        }\r
        return undefined;\r
    }\r
\r
\r
    function updateBulkCmd() {\r
        var counter = 0;\r
\r
        var lines = [];\r
        var ledStripLength = FC.LED_STRIP.length;\r
        var ledColorsLength = FC.LED_COLORS.length;\r
        var ledModeColorsLenggth = FC.LED_MODE_COLORS.length;\r
\r
        FC.LED_STRIP = [];\r
\r
        $('.gPoint').each(function(){\r
            if ($(this).is('[class*="function"]')) {\r
                var gridNumber = ($(this).index() + 1);\r
                var row = Math.ceil(gridNumber / 16) - 1;\r
                var col = gridNumber/16 % 1 * 16 - 1;\r
                if (col < 0) {col = 15;}\r
\r
                var wireNumber = $(this).find('.wire').html();\r
                var functions = '';\r
                var directions = '';\r
                var colorIndex = 0;\r
                var that = this;\r
\r
                var match = $(this).attr("class").match(/(^|\\s)color-([0-9]+)(\\s|$)/);\r
                if (match) {\r
                    colorIndex = match[2];\r
                }\r
\r
                ledStripTab.baseFuncs.forEach(function(letter){\r
                    if ($(that).is('.function-' + letter)) {\r
                        functions += letter;\r
                    }\r
                });\r
                ledStripTab.overlays.forEach(function(letter){\r
                    if ($(that).is('.function-' + letter)) {\r
                        functions += letter;\r
                    }\r
                });\r
\r
                ledStripTab.directions.forEach(function(letter){\r
                    if ($(that).is('.dir-' + letter)) {\r
                        directions += letter;\r
                    }\r
                });\r
\r
                if (wireNumber != '') {\r
                    var led = {\r
                        x: col,\r
                        y: row,\r
                        directions: directions,\r
                        functions: functions,\r
                        color: colorIndex\r
                    }\r
\r
                    FC.LED_STRIP[wireNumber] = led;\r
                }\r
                counter++;\r
            }\r
        });\r
\r
        var defaultLed = {\r
            x: 0,\r
            y: 0,\r
            directions: '',\r
            functions: ''\r
        };\r
\r
        for (var i = 0; i < ledStripLength; i++) {\r
            if (FC.LED_STRIP[i]) {\r
                continue;\r
            }\r
            FC.LED_STRIP[i] = defaultLed;\r
        }\r
\r
        var usedWireNumbers = buildUsedWireNumbers();\r
\r
        var remaining = FC.LED_STRIP.length - usedWireNumbers.length;\r
\r
        $('.wires-remaining div').html(remaining);\r
    }\r
\r
    // refresh mode color buttons\r
    function setModeBackgroundColor(element) {\r
        element.find('[class*="mode_color"]').each(function() {\r
            var m = 0;\r
            var d = 0;\r
\r
            var match = $(this).attr("class").match(/(^|\\s)mode_color-([0-9]+)-([0-9]+)(\\s|$)/);\r
            if (match) {\r
                m = Number(match[2]);\r
                d = Number(match[3]);\r
                $(this).css('background-color', HsvToColor(FC.LED_COLORS[getModeColor(m, d)]));\r
            }\r
        });\r
    }   \r
\r
    function setBackgroundColor(element) {\r
        if (element.is('[class*="color"]')) {\r
            var colorIndex = 0;\r
\r
            var match = element.attr("class").match(/(^|\\s)color-([0-9]+)(\\s|$)/);\r
            if (match) {\r
                colorIndex = match[2];\r
                element.css('background-color', HsvToColor(FC.LED_COLORS[colorIndex]));\r
            }\r
        }\r
    }\r
\r
    function areModifiersActive(activeFunction) {\r
        switch (activeFunction) {\r
            case "function-c":\r
            case "function-a":\r
            case "function-f":\r
                return true;\r
            break;\r
        }\r
        return false;\r
    }\r
\r
    function areOverlaysActive(activeFunction) {\r
        switch (activeFunction) {\r
            case "":\r
            case "function-c":\r
            case "function-a":\r
            case "function-f":\r
            case "function-s":\r
            case "function-l":\r
            case "function-r":\r
            case "function-o":\r
            case "function-g":\r
                        return true;\r
            break;\r
        }\r
        return false;\r
    }\r
\r
    function areBlinkersActive(activeFunction) {\r
        switch (activeFunction) {\r
            case "function-c":\r
            case "function-a":\r
            case "function-f":\r
            case "function-e":\r
                return true;\r
            break;\r
        }\r
        return false;\r
    }\r
\r
    function isWarningActive(activeFunction) {\r
        switch (activeFunction) {\r
            case "function-l":\r
            case "function-s":\r
            case "function-g":\r
            case "function-r":\r
            case "function-b":\r
                return false;\r
                break;\r
            default:\r
                return true;\r
            break;\r
        }\r
    }\r
\r
    function setOptionalGroupsVisibility() {\r
\r
        var activeFunction = $('select.functionSelect').val();\r
        $('select.functionSelect').addClass(activeFunction);\r
\r
        // >= 20\r
        // Show GPS (Func)\r
        // Hide RSSI (O/L), Blink (Func)\r
        // Show Battery, RSSI (Func), Larson (O/L), Blink (O/L), Landing (O/L)\r
        $(".extra_functions20").show();\r
        $(".mode_colors").show();\r
\r
        // set color modifiers (check-boxes) visibility\r
        $('.overlays').hide();\r
        $('.modifiers').hide();\r
        $('.blinkers').hide();\r
        $('.warningOverlay').hide();\r
        $('.channel_info').hide();\r
\r
        if (areOverlaysActive(activeFunction))\r
            $('.overlays').show();\r
\r
        if (areModifiersActive(activeFunction))\r
            $('.modifiers').show();\r
\r
        if (areBlinkersActive(activeFunction))\r
            $('.blinkers').show();\r
\r
        if (isWarningActive(activeFunction))\r
            $('.warningOverlay').show();\r
\r
        $('.mode_colors').hide();\r
        // set mode colors visibility\r
\r
        if (activeFunction == "function-f") {\r
            $('.mode_colors').show();\r
        }\r
\r
        // set special colors visibility\r
        $('.special_colors').show();\r
        $('.mode_color-6-0').hide();\r
        $('.mode_color-6-1').hide();\r
        $('.mode_color-6-2').hide();\r
        $('.mode_color-6-3').hide();\r
        $('.mode_color-6-4').hide();\r
        $('.mode_color-6-5').hide();\r
        $('.mode_color-6-6').hide();\r
        $('.mode_color-6-7').hide();\r
\r
        switch (activeFunction) {\r
            case "":           // none\r
            case "function-f": // Modes & Orientation\r
            case "function-l": // Battery\r
                // $('.mode_color-6-3').show(); // background\r
                $('.special_colors').hide();\r
                break;\r
            case "function-g": // GPS\r
                $('.mode_color-6-5').show(); // no sats\r
                $('.mode_color-6-6').show(); // no lock\r
                $('.mode_color-6-7').show(); // locked\r
                // $('.mode_color-6-3').show(); // background\r
                break;\r
            case "function-b": // Blink\r
                $('.mode_color-6-4').show(); // blink background\r
                break;\r
            case "function-a": // Arm state\r
                $('.mode_color-6-0').show(); // disarmed\r
                $('.mode_color-6-1').show(); // armed\r
                break;\r
            case "function-h": // Channel\r
                $('.special_colors').hide();\r
                $('.channel_info').show();\r
                break;\r
\r
            case "function-r": // Ring\r
            default:\r
                $('.special_colors').hide();\r
            break;\r
        }\r
    }\r
\r
    function applyFunctionToSelectedLeds() {\r
        var activeFunction = $('select.functionSelect').val();\r
        ledStripTab.baseFuncs.forEach(function(letter) {\r
\r
            if (activeFunction == 'function-' + letter) {\r
                $('select.functionSelect').addClass('function-' + letter);\r
\r
                $('.ui-selected').find('.wire').each(function() {\r
                    if ($(this).text() != "")\r
                        $(this).parent().addClass('function-' + letter);\r
                });\r
\r
                unselectOverlays(letter);\r
\r
            } else {\r
                $('select.functionSelect').removeClass('function-' + letter);\r
                $('.ui-selected').removeClass('function-' + letter);\r
            }\r
\r
            if (activeFunction == '') {\r
                unselectOverlays(activeFunction);\r
            }\r
\r
        });\r
    }\r
\r
    function unselectOverlays(letter) {\r
        // MSP 1.20\r
        if (letter == 'r' || letter == '') {\r
            unselectOverlay(letter, 'o');\r
            unselectOverlay(letter, 'b');\r
            unselectOverlay(letter, 'n');\r
            unselectOverlay(letter, 't');\r
        }\r
        if (letter == 'l' || letter == 'g' || letter == 's') {\r
            unselectOverlay(letter, 'w');\r
            unselectOverlay(letter, 't');\r
            unselectOverlay(letter, 'o');\r
            unselectOverlay(letter, 'b');\r
            unselectOverlay(letter, 'n');\r
        }\r
    }\r
\r
    function unselectOverlay(func, overlay) {\r
        $('input.function-' + overlay).prop('checked', false);\r
        $('input.function-' + overlay).trigger('change');\r
        $('.ui-selected').each(function() {\r
            if (func == '' || $(this).is('.function-' + func)) {\r
                $(this).removeClass('function-' + overlay);\r
            }\r
        });\r
    }\r
\r
    function updateColors(value, hsvIndex) {\r
        var change = false;\r
\r
        value = Number(value);\r
\r
        var className = '.color-' + selectedColorIndex;\r
        if ($(className).hasClass('btnOn')) {\r
            switch (hsvIndex) {\r
                case 0:\r
                    if (FC.LED_COLORS[selectedColorIndex].h != value) {\r
                        FC.LED_COLORS[selectedColorIndex].h = value;\r
                        $('.colorDefineSliderValue.Hvalue').text(FC.LED_COLORS[selectedColorIndex].h);\r
                        change = true\r
                    }\r
                    break;\r
                case 1:\r
                    if (FC.LED_COLORS[selectedColorIndex].s != value) {\r
                        FC.LED_COLORS[selectedColorIndex].s = value;\r
                        $('.colorDefineSliderValue.Svalue').text(FC.LED_COLORS[selectedColorIndex].s);\r
                        change = true\r
                    }\r
                    break;\r
                case 2:\r
                    if (FC.LED_COLORS[selectedColorIndex].v != value) {\r
                        FC.LED_COLORS[selectedColorIndex].v = value;\r
                        $('.colorDefineSliderValue.Vvalue').text(FC.LED_COLORS[selectedColorIndex].v);\r
                        change = true\r
                    }\r
                    break;\r
            }\r
        }\r
\r
\r
        // refresh color buttons\r
        $('.colors').children().each(function() { setBackgroundColor($(this)); });\r
        $('.overlay-color').each(function() { setBackgroundColor($(this)); });\r
\r
        $('.mode_colors').each(function() { setModeBackgroundColor($(this)); });\r
        $('.special_colors').each(function() { setModeBackgroundColor($(this)); });\r
\r
        if (change)\r
            updateBulkCmd();\r
    }\r
\r
    function drawColorBoxesInColorLedPoints() {\r
        $('.gPoint').each(function() {\r
            if ($(this).is('.function-c') || $(this).is('.function-r') || $(this).is('.function-b')) {\r
                $(this).find('.overlay-color').show();\r
\r
                for (var colorIndex = 0; colorIndex < 16; colorIndex++) {\r
                    var className = 'color-' + colorIndex;\r
                    if ($(this).is('.' + className)) {\r
                        $(this).find('.overlay-color').addClass(className);\r
                        $(this).find('.overlay-color').css('background-color', HsvToColor(FC.LED_COLORS[colorIndex]))\r
                    } else {\r
                        if ($(this).find('.overlay-color').is('.' + className))\r
                            $(this).find('.overlay-color').removeClass(className);\r
                    }\r
                }\r
            } else {\r
                $(this).find('.overlay-color').hide();\r
            }\r
        });\r
    }\r
\r
    function setColorSliders(colorIndex) {\r
\r
        var sliders = $('div.colorDefineSliders input');\r
        var change = false;\r
\r
        if (!FC.LED_COLORS[colorIndex])\r
            return;\r
\r
        if (FC.LED_COLORS[colorIndex].h != Number(sliders.eq(0).val())) {\r
            sliders.eq(0).val(FC.LED_COLORS[colorIndex].h);\r
            $('.colorDefineSliderValue.Hvalue').text(FC.LED_COLORS[colorIndex].h);\r
            change = true;\r
        }\r
\r
        if (FC.LED_COLORS[colorIndex].s != Number(sliders.eq(1).val())) {\r
            sliders.eq(1).val(FC.LED_COLORS[colorIndex].s);\r
            $('.colorDefineSliderValue.Svalue').text(FC.LED_COLORS[colorIndex].s);\r
            change = true;\r
        }\r
\r
        if (FC.LED_COLORS[colorIndex].v != Number(sliders.eq(2).val())) {\r
            sliders.eq(2).val(FC.LED_COLORS[colorIndex].v);\r
            $('.colorDefineSliderValue.Vvalue').text(FC.LED_COLORS[colorIndex].v);\r
            change = true;\r
        }\r
\r
        // only fire events when all values are set\r
        if (change)\r
            sliders.trigger('input');\r
\r
    }\r
\r
    function HsvToColor(input) {\r
        if (input == undefined)\r
            return "";\r
\r
        var HSV = { h:Number(input.h), s:Number(input.s), v:Number(input.v) };\r
\r
        if (HSV.s == 0 && HSV.v == 0)\r
            return "";\r
\r
        HSV = { h:HSV.h, s:1 - HSV.s / 255, v:HSV.v / 255 };\r
\r
        var HSL = { h:0, s:0, v:0};\r
        HSL.h = HSV.h;\r
        HSL.l = (2 - HSV.s) * HSV.v / 2;\r
        HSL.s = HSL.l && HSL.l < 1 ? HSV.s * HSV.v / (HSL.l < 0.5 ? HSL.l * 2 : 2 - HSL.l * 2) : HSL.s;\r
\r
        var ret = 'hsl(' + HSL.h + ', ' + HSL.s * 100 + '%, ' + HSL.l * 100 + '%)';\r
        return ret;\r
    }\r
\r
    function getModeColor(mode, dir) {\r
        for (var i = 0; i < FC.LED_MODE_COLORS.length; i++) {\r
            var mc = FC.LED_MODE_COLORS[i];\r
            if (mc.mode == mode && mc.direction == dir)\r
                return mc.color;\r
        }\r
        return "";\r
    }\r
\r
    function setModeColor(mode, dir, color) {\r
        for (var i = 0; i < FC.LED_MODE_COLORS.length; i++) {\r
            var mc = FC.LED_MODE_COLORS[i];\r
            if (mc.mode == mode && mc.direction == dir) {\r
                mc.color = color;\r
                return 1;\r
            }\r
        }\r
        return 0;\r
    }\r
\r
    function clearModeColorSelection() {\r
        selectedModeColor = null;\r
        $('.mode_colors').each(function() {\r
            $(this).children().each(function() {\r
                if ($(this).is('.btnOn')) {\r
                    $(this).removeClass('btnOn');\r
                }\r
            });\r
        });\r
    }\r
};\r
\r
ledStripTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default ledStripTab;`;export{n as default};
