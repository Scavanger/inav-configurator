const n=`"use strict";\r
\r
import $ from 'jquery';\r
import noUiSlider from 'nouislider';\r
\r
var\r
    CHANNEL_MIN_VALUE = 1000,\r
    CHANNEL_MID_VALUE = 1500,\r
    CHANNEL_MAX_VALUE = 2000,\r
\r
    // What's the index of each channel in the MSP channel list?\r
    channelMSPIndexes = {\r
        Roll: 0,\r
        Pitch: 1,\r
        Yaw: 3,\r
        Throttle: 2,\r
        ch5: 4,\r
        ch6: 5,\r
        ch7: 6,\r
        ch8: 7,\r
        ch9: 8,\r
        ch10: 9,\r
        ch11: 10,\r
        ch12: 11,\r
    },\r
\r
    // Set reasonable initial stick positions (Mode 2)\r
    stickValues = {\r
        Throttle: CHANNEL_MIN_VALUE,\r
        Pitch: CHANNEL_MID_VALUE,\r
        Roll: CHANNEL_MID_VALUE,\r
        Yaw: CHANNEL_MID_VALUE,\r
        ch5: CHANNEL_MIN_VALUE,\r
        ch6: CHANNEL_MIN_VALUE,\r
        ch7: CHANNEL_MIN_VALUE,\r
        ch8: CHANNEL_MIN_VALUE,\r
        ch9: CHANNEL_MIN_VALUE,\r
        ch10: CHANNEL_MIN_VALUE,\r
        ch11: CHANNEL_MIN_VALUE,\r
        ch12: CHANNEL_MIN_VALUE,\r
    },\r
\r
    // First the vertical axis, then the horizontal:\r
    gimbals = [\r
        ["Throttle", "Yaw"],\r
        ["Pitch", "Roll"]\r
    ],\r
\r
    gimbalElems,\r
    sliderElems,\r
\r
    enableTX = false;\r
\r
function transmitChannels() {\r
    var \r
        channelValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];\r
\r
    if (!enableTX) {\r
        return;\r
    }\r
\r
    for (var stickName in stickValues) {\r
        channelValues[channelMSPIndexes[stickName]] = stickValues[stickName];\r
    }\r
\r
    // Callback given to us by the window creator so we can have it send data over MSP for us:\r
    if (!window.setRawRx(channelValues)) {\r
        // MSP connection has gone away\r
        window.current().close();\r
    }\r
}\r
\r
function stickPortionToChannelValue(portion) {\r
    portion = Math.min(Math.max(portion, 0.0), 1.0);\r
\r
    return Math.round(portion * (CHANNEL_MAX_VALUE - CHANNEL_MIN_VALUE) + CHANNEL_MIN_VALUE);\r
}\r
\r
function channelValueToStickPortion(channel) {\r
    return (channel - CHANNEL_MIN_VALUE) / (CHANNEL_MAX_VALUE - CHANNEL_MIN_VALUE);\r
}\r
\r
function updateControlPositions() {\r
    for (var stickName in stickValues) {\r
        var\r
            stickValue = stickValues[stickName];\r
\r
        // Look for the gimbal which corresponds to this stick name\r
        for (var gimbalIndex in gimbals) {\r
            var \r
                gimbal = gimbals[gimbalIndex],\r
                gimbalElem = gimbalElems.get(gimbalIndex),\r
                gimbalSize = $(gimbalElem).width(),\r
                stickElem = $(".control-stick", gimbalElem);\r
\r
            if (gimbal[0] == stickName) {\r
                stickElem.css('top', (1.0 - channelValueToStickPortion(stickValue)) * gimbalSize + "px");\r
                break;\r
            } else if (gimbal[1] == stickName) {\r
                stickElem.css('left', channelValueToStickPortion(stickValue) * gimbalSize + "px");\r
                break;\r
            }\r
        }\r
    }\r
}\r
\r
function handleGimbalMouseDrag(e) {\r
    var \r
        gimbal = $(gimbalElems.get(e.data.gimbalIndex)),\r
        gimbalOffset = gimbal.offset(),\r
        gimbalSize = gimbal.width();\r
\r
    stickValues[gimbals[e.data.gimbalIndex][0]] = stickPortionToChannelValue(1.0 - (e.pageY - gimbalOffset.top) / gimbalSize);\r
    stickValues[gimbals[e.data.gimbalIndex][1]] = stickPortionToChannelValue((e.pageX - gimbalOffset.left) / gimbalSize);\r
\r
    updateControlPositions();\r
}\r
\r
function localizeAxisNames() {\r
    for (var gimbalIndex in gimbals) {\r
        var \r
            gimbal = gimbalElems.get(gimbalIndex);\r
\r
        $(".gimbal-label-vert", gimbal).text(gimbals[gimbalIndex][0]);\r
        $(".gimbal-label-horz", gimbal).text(gimbals[gimbalIndex][1]);\r
    }\r
\r
    for (var sliderIndex = 0; sliderIndex < 8; sliderIndex++) {\r
       $(".slider-label", sliderElems.get(sliderIndex)).text("CH " + (sliderIndex + 5));\r
    }\r
}\r
\r
$(function() {\r
\r
    $("a.button-enable").on('click', function () {\r
\r
        var shrinkHeight = $(".warning").height();\r
\r
        $(".warning").slideUp("short", function() {\r
            window.current().innerBounds.minHeight -= shrinkHeight;\r
            window.current().innerBounds.height -= shrinkHeight;\r
            window.current().innerBounds.maxHeight -= shrinkHeight;\r
        });\r
\r
        enableTX = true;\r
    });\r
\r
    gimbalElems = $(".control-gimbal");\r
    sliderElems = $(".control-slider");\r
\r
    gimbalElems.each(function(gimbalIndex) {\r
        $(this).on('mousedown', {gimbalIndex: gimbalIndex}, function(e) {\r
            if (e.which == 1) { // Only move sticks on left mouse button\r
                handleGimbalMouseDrag(e);\r
\r
                $(window).on('mousemove', {gimbalIndex: gimbalIndex}, handleGimbalMouseDrag);\r
            }\r
        });\r
    });\r
\r
    $(".slider", sliderElems).each(function(sliderIndex) {\r
        var\r
            initialValue = stickValues["ch" + (sliderIndex + 5)],\r
            sliderElement = this;\r
\r
        try {\r
            noUiSlider.create(sliderElement, {\r
                start: [initialValue],\r
                range: {\r
                    min: CHANNEL_MIN_VALUE,\r
                    max: CHANNEL_MAX_VALUE\r
                }\r
            });\r
\r
            sliderElement.noUiSlider.on('update', function(values, handle) {\r
                var value = Math.round(parseFloat(values[handle]));\r
\r
                stickValues["ch" + (sliderIndex + 5)] = value;\r
\r
                $(".tooltip", sliderElement).text(value);\r
            });\r
\r
            $(sliderElement).append('<div class="tooltip"></div>');\r
\r
            $(".tooltip", sliderElement).text(initialValue);\r
        } catch (err) {\r
            console.error('Failed to create slider', sliderIndex, ':', err);\r
        }\r
    });\r
\r
    /*\r
     * Mouseup handler needs to be bound to the window in order to receive mouseup if mouse leaves window.\r
     */\r
    $(window).mouseup(function(e) {\r
        $(this).off('mousemove', handleGimbalMouseDrag);\r
    });\r
\r
    localizeAxisNames();\r
    updateControlPositions();\r
    setInterval(transmitChannels, 50);\r
});\r
`;export{n as default};
