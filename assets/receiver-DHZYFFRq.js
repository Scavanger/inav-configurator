const r=`'use strict';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import mspHelper from './../js/msp/MSPHelper';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import CONFIGURATOR from './../js/data_storage';\r
import Settings from './../js/settings';\r
import i18n from './../js/localization';\r
import interval from './../js/intervals';\r
\r
const receiverTab = { };\r
 \r
receiverTab.rateChartHeight = 117;\r
\r
 receiverTab.initialize = function (callback) {\r
    var self = this;\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    var loadChainer = new MSPChainerClass();\r
\r
    var loadChain = [\r
        mspHelper.loadMiscV2,\r
        mspHelper.loadRcData,\r
        mspHelper.loadRcMap,\r
        mspHelper.loadRxConfig,\r
        mspHelper.loadRcDeadband\r
    ];\r
\r
    loadChain.push(mspHelper.loadRateProfileData);\r
    loadChainer.setChain(loadChain);\r
    loadChainer.setExitPoint(load_html);\r
    loadChainer.execute();\r
\r
    function load_html() {\r
        import('./receiver.html?raw').then(({default: html}) => GUI.load(html, Settings.processHtml(process_html)));\r
    }\r
\r
    function saveSettings(onComplete) {\r
        Settings.saveInputs(onComplete);\r
    }\r
\r
    function process_html(settingsPromise) {\r
        // translate to user-selected language\r
       i18n.localize();;\r
\r
        let $receiverMode = $('#receiver_type'),\r
            $serialWrapper = $('#serialrx_provider-wrapper');\r
\r
        // Order Serial Rx providers\r
        let serialRxProviders = $('#serialrx_provider option');\r
        let selectedRxProvider = $('#serialrx_provider').val();\r
        serialRxProviders.sort(function(a,b) {\r
            if (a.text > b.text) {\r
                return 1;\r
            } else if (a.text < b.text) {\r
                return -1;\r
            } else {\r
                return 0;\r
            }\r
        });\r
\r
        let $serialRxProvider = $("#serialrx_provider");\r
        $serialRxProvider.empty().append(serialRxProviders);\r
        $serialRxProvider.val(selectedRxProvider);\r
\r
        $serialRxProvider.on('change', function() {\r
            const frSkyRXProviders = ["SBUS", "FPORT", "FPORT2", "FBUS"];\r
            \r
            if (frSkyRXProviders.includes($(this).find("option:selected").text())) {\r
                $("#frSkyOptions").show();\r
            } else {\r
                $("#frSkyOptions").hide();\r
            }\r
        });\r
\r
        $receiverMode.on('change', function () {\r
            if ($(this).find("option:selected").text() == "SERIAL") {\r
                $serialWrapper.show();\r
                $serialRxProvider.trigger("change");\r
                $receiverMode.parent().removeClass("no-bottom-border");\r
            } else {\r
                $serialWrapper.hide();\r
                $("#frSkyOptions").hide();\r
                $receiverMode.parent().addClass("no-bottom-border");\r
            }\r
        });\r
\r
        // Wait for settings to load before triggering change events\r
        // Trigger receiverMode which will trigger serialRxProvider when mode is SERIAL\r
        settingsPromise.then(function() {\r
            $receiverMode.trigger("change");\r
        });\r
\r
        // fill in data from RC_tuning\r
        $('.tunings .throttle input[name="mid"]').val(FC.RC_tuning.throttle_MID.toFixed(2));\r
        $('.tunings .throttle input[name="expo"]').val(FC.RC_tuning.throttle_EXPO.toFixed(2));\r
\r
        $('.deadband input[name="yaw_deadband"]').val(FC.RC_deadband.yaw_deadband);\r
        $('.deadband input[name="deadband"]').val(FC.RC_deadband.deadband);\r
\r
        // generate bars\r
        var bar_names = [\r
                i18n.getMessage('controlAxisRoll'),\r
                i18n.getMessage('controlAxisPitch'),\r
                i18n.getMessage('controlAxisYaw'),\r
                i18n.getMessage('controlAxisThrottle')\r
            ],\r
            bar_container = $('.tab-receiver .bars');\r
\r
        for (var i = 0; i < FC.RC.active_channels; i++) {\r
            var name;\r
            if (i < bar_names.length) {\r
                name = bar_names[i];\r
            } else {\r
                name = i18n.getMessage("radioChannelShort") + (i + 1);\r
            }\r
\r
            bar_container.append('\\\r
                <ul>\\\r
                    <li class="name">' + name + '</li>\\\r
                    <li class="meter">\\\r
                        <div class="meter-bar">\\\r
                            <div class="label"></div>\\\r
                            <div class="fill">\\\r
                                <div class="label"></div>\\\r
                            </div>\\\r
                        </div>\\\r
                    </li>\\\r
                </ul>\\\r
            ');\r
        }\r
\r
        // we could probably use min and max throttle for the range, will see\r
        var meter_scale = {\r
            'min': 800,\r
            'max': 2200\r
        };\r
\r
        var meter_fill_array = [];\r
        $('.meter .fill', bar_container).each(function () {\r
            meter_fill_array.push($(this));\r
        });\r
\r
        var meter_label_array = [];\r
        $('.meter', bar_container).each(function () {\r
            meter_label_array.push($('.label', this));\r
        });\r
\r
        // correct inner label margin on window resize (i don't know how we could do this in css)\r
        self.resize = function () {\r
            var containerWidth = $('.meter:first', bar_container).width(),\r
                labelWidth = $('.meter .label:first', bar_container).width(),\r
                margin = (containerWidth / 2) - (labelWidth / 2);\r
\r
            for (var i = 0; i < meter_label_array.length; i++) {\r
                meter_label_array[i].css('margin-left', margin);\r
            }\r
        };\r
\r
        $(window).on('resize', self.resize).resize(); // trigger so labels get correctly aligned on creation\r
\r
        // handle rcmap & rssi aux channel\r
        var strBuffer = [], rcMapLetters = FC.getRcMapLetters();\r
        for (var i = 0; i < FC.RC_MAP.length; i++) {\r
            strBuffer[FC.RC_MAP[i]] = rcMapLetters[i];\r
        }\r
\r
        // reconstruct\r
        var str = strBuffer.join(''),\r
            $rcMap = $('input[name="rcmap"]');\r
\r
        // set current value\r
        $rcMap.val(str);\r
\r
        // validation / filter\r
        var last_valid = str;\r
\r
        $rcMap.on('input', function () {\r
            var val = $(this).val();\r
\r
            // limit length to max 8\r
            if (val.length > 8) {\r
                val = val.substr(0, 8);\r
                $(this).val(val);\r
            }\r
        });\r
\r
        $rcMap.focusout(function () {\r
            if (!FC.isRcMapValid($(this).val()))\r
                $(this).val(last_valid);\r
        });\r
\r
        $rcMap.on('input change', function() {\r
            $(this).css("color", FC.isRcMapValid($(this).val()) ? "" : "#FF0000");\r
        });\r
\r
        // handle helper\r
        $('select[name="rcmap_helper"]').val(0); // go out of bounds\r
        $('select[name="rcmap_helper"]').on('change', function () {\r
            $rcMap.val($(this).val());\r
        });\r
\r
        // rssi\r
        var rssi_channel_e = $('select[name="rssi_channel"]');\r
        rssi_channel_e.append('<option value="0">Disabled</option>');\r
        for (var i = 5; i < FC.RC.active_channels + 1; i++) {\r
            rssi_channel_e.append('<option value="' + i + '">CH' + i + '</option>');\r
        }\r
\r
        $('select[name="rssi_channel"]').val(FC.MISC.rssi_channel);\r
\r
        var rateHeight = receiverTab.rateChartHeight;\r
\r
        // UI Hooks\r
        // curves\r
        $('.tunings .throttle input').on('input change', function () {\r
            setTimeout(function () { // let global validation trigger and adjust the values first\r
                var throttleMidE = $('.tunings .throttle input[name="mid"]'),\r
                    throttleExpoE = $('.tunings .throttle input[name="expo"]'),\r
                    mid = parseFloat(throttleMidE.val()),\r
                    expo = parseFloat(throttleExpoE.val()),\r
                    throttle_curve = $('.throttle_curve canvas').get(0),\r
                    context = throttle_curve.getContext("2d");\r
\r
                // local validation to deal with input event\r
                if (mid >= parseFloat(throttleMidE.prop('min')) &&\r
                    mid <= parseFloat(throttleMidE.prop('max')) &&\r
                    expo >= parseFloat(throttleExpoE.prop('min')) &&\r
                    expo <= parseFloat(throttleExpoE.prop('max'))) {\r
                    // continue\r
                } else {\r
                    return;\r
                }\r
\r
                // math magic by englishman\r
                var midx = 200 * mid,\r
                    midxl = midx * 0.5,\r
                    midxr = (((200 - midx) * 0.5) + midx),\r
                    midy = rateHeight - (midx * (rateHeight / 200)),\r
                    midyl = rateHeight - ((rateHeight - midy) * 0.5 * (expo + 1)),\r
                    midyr = (midy / 2) * (expo + 1);\r
\r
                // draw\r
                context.clearRect(0, 0, 200, rateHeight);\r
                context.beginPath();\r
                context.moveTo(0, rateHeight);\r
                context.quadraticCurveTo(midxl, midyl, midx, midy);\r
                context.moveTo(midx, midy);\r
                context.quadraticCurveTo(midxr, midyr, 200, 0);\r
                context.lineWidth = 2;\r
                context.strokeStyle = '#37a8db';\r
                context.stroke();\r
            }, 0);\r
        }).trigger('input');\r
\r
        $('a.update').on('click', function () {\r
            // catch RC_tuning changes\r
            FC.RC_tuning.throttle_MID = parseFloat($('.tunings .throttle input[name="mid"]').val());\r
            FC.RC_tuning.throttle_EXPO = parseFloat($('.tunings .throttle input[name="expo"]').val());\r
\r
            FC.RC_deadband.yaw_deadband = parseInt($('.deadband input[name="yaw_deadband"]').val());\r
            FC.RC_deadband.deadband = parseInt($('.deadband input[name="deadband"]').val());\r
\r
            // catch rc map\r
            var rcMapValue = $('input[name="rcmap"]').val();\r
            var strBuffer = rcMapValue.split('');\r
\r
\r
            for (var i = 0; i < FC.RC_MAP.length; i++) {\r
                FC.RC_MAP[i] = strBuffer.indexOf(FC.getRcMapLetters()[i]);\r
            }\r
\r
            // catch rssi aux\r
            FC.MISC.rssi_channel = parseInt($('select[name="rssi_channel"]').val());\r
\r
            function save_rc_map() {\r
                MSP.send_message(MSPCodes.MSP_SET_RX_MAP, mspHelper.crunch(MSPCodes.MSP_SET_RX_MAP), false, save_misc);\r
            }\r
\r
            function save_misc() {\r
                MSP.send_message(MSPCodes.MSPV2_INAV_SET_MISC, mspHelper.crunch(MSPCodes.MSPV2_INAV_SET_MISC), false, save_rc_configs);\r
            }\r
\r
            function save_rc_configs() {\r
                MSP.send_message(MSPCodes.MSP_SET_RC_DEADBAND, mspHelper.crunch(MSPCodes.MSP_SET_RC_DEADBAND), false, storeSettings);\r
            }\r
\r
            function storeSettings() {\r
                saveSettings(save_to_eeprom);\r
            }\r
\r
            function save_to_eeprom() {\r
                MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {\r
                    GUI.log(i18n.getMessage('receiverEepromSaved'));\r
\r
                    GUI.tab_switch_cleanup(function () {\r
                        MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, function () {\r
                            GUI.log(i18n.getMessage('deviceRebooting'));\r
                            GUI.handleReconnect($('.tab_receiver a'));\r
                        });\r
                    });\r
                });\r
            }\r
\r
            MSP.send_message(MSPCodes.MSPV2_INAV_SET_RATE_PROFILE, mspHelper.crunch(MSPCodes.MSPV2_INAV_SET_RATE_PROFILE), false, save_rc_map);\r
        });\r
\r
        $("a.sticks").on('click', function () {\r
            var mspWin = window.open("tabs/receiver_msp.html", "receiver_msp", "width=420,height=760,menubar=no");\r
            \r
            mspWin.setRawRx = function (channels) {\r
                if (CONFIGURATOR.connectionValid && GUI.active_tab != 'cli') {\r
                    mspHelper.setRawRx(channels);\r
                    return true;\r
                } else {\r
                    return false;\r
                }\r
            }\r
        });\r
\r
        /* Drop MSP control sticks for now, works inconsistently across platforms\r
        Doesn't work properly in either elecron or PWA, and it takes quite a bit of effort to get both to run.\r
        If anyone misses it, feel free. I give up.\r
        // Only show the MSP control sticks if the MSP Rx feature is enabled\r
        mspHelper.getSetting("receiver_type").then(function (s) {\r
            if (s && s.setting.table && s.setting.table.values) {\r
                $(".sticks_btn").toggle(s.setting.table.values[s.value] == 'MSP');\r
            }\r
        });\r
        */\r
       $(".sticks_btn").hide();\r
\r
        function get_rc_data() {\r
            MSP.send_message(MSPCodes.MSP_RC, false, false, update_ui);\r
        }\r
\r
        function update_ui() {\r
            // update bars with latest data\r
            for (let i = 0; i < FC.RC.active_channels; i++) {\r
                meter_fill_array[i].css('width', ((FC.RC.channels[i] - meter_scale.min) / (meter_scale.max - meter_scale.min) * 100).clamp(0, 100) + '%');\r
                meter_label_array[i].text(FC.RC.channels[i]);\r
            }\r
\r
        }\r
\r
        interval.add('receiver_pull', get_rc_data, 25);\r
\r
        GUI.content_ready(callback);\r
    }\r
};\r
\r
receiverTab.cleanup = function (callback) {\r
    $(window).off('resize', this.resize);\r
\r
    if (callback) callback();\r
};\r
\r
export default receiverTab;`;export{r as default};
