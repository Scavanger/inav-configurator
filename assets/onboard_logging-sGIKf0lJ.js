const n=`'use strict';\r
\r
import MSPCodes from './../js/msp/MSPCodes';\r
import MSP from './../js/msp';\r
import mspHelper from"./../js/msp/MSPHelper";\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import CONFIGURATOR from './../js/data_storage';\r
import features from './../js/feature_framework';\r
import i18n from './../js/localization';\r
import BitHelper from './../js/bitHelper';\r
import bridge from '../js/bridge';\r
\r
var sdcardTimer;\r
\r
const onboardLoggingTab = {\r
};\r
\r
onboardLoggingTab.initialize = function (callback) {\r
    let\r
        saveCancelled, eraseCancelled;\r
\r
    //Add future blackbox values here and in messages.json, the checkbox are drawn by js\r
    const blackBoxFields = [\r
        "BLACKBOX_FEATURE_NAV_ACC",\r
        "BLACKBOX_FEATURE_NAV_POS",\r
        "BLACKBOX_FEATURE_NAV_PID",\r
        "BLACKBOX_FEATURE_MAG",\r
        "BLACKBOX_FEATURE_ACC",\r
        "BLACKBOX_FEATURE_ATTITUDE",\r
        "BLACKBOX_FEATURE_RC_DATA",\r
        "BLACKBOX_FEATURE_RC_COMMAND",\r
        "BLACKBOX_FEATURE_MOTORS",\r
        "BLACKBOX_FEATURE_GYRO_RAW",\r
        "BLACKBOX_FEATURE_GYRO_PEAKS_ROLL",\r
        "BLACKBOX_FEATURE_GYRO_PEAKS_PITCH",\r
        "BLACKBOX_FEATURE_GYRO_PEAKS_YAW",\r
        "BLACKBOX_FEATURE_SERVOS",\r
    ];\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    if (CONFIGURATOR.connectionValid) {\r
        MSP.send_message(MSPCodes.MSP_FEATURE, false, false, function() {\r
            MSP.send_message(MSPCodes.MSP_DATAFLASH_SUMMARY, false, false, function() {\r
                MSP.send_message(MSPCodes.MSP_SDCARD_SUMMARY, false, false, function() {\r
		            MSP.send_message(MSPCodes.MSP2_BLACKBOX_CONFIG, false, false, load_html);\r
                });\r
            });\r
        });\r
    }\r
\r
    function gcd(a, b) {\r
        if (b == 0)\r
            return a;\r
\r
        return gcd(b, a % b);\r
    }\r
\r
    function save_to_eeprom() {\r
        MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, reboot);\r
    }\r
\r
    function reboot() {\r
        GUI.log(i18n.getMessage('configurationEepromSaved'));\r
\r
        GUI.tab_switch_cleanup(function() {\r
            MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitialize);\r
        });\r
    }\r
\r
    function reinitialize() {\r
        GUI.log(i18n.getMessage('deviceRebooting'));\r
        GUI.handleReconnect($('.tab_onboard_logging a'));\r
    }\r
\r
    function load_html() {\r
        import('./onboard_logging.html?raw').then(({default: html}) => GUI.load(html, function() {\r
            // translate to user-selected language\r
           i18n.localize();;\r
\r
            var\r
                dataflashPresent = FC.DATAFLASH.totalSize > 0,\r
                blackboxSupport = false;\r
\r
            if ((FC.BLACKBOX.supported || FC.DATAFLASH.supported) && BitHelper.bit_check(FC.FEATURES, 19)) {\r
                blackboxSupport = true;\r
            }\r
\r
            $(".tab-onboard_logging")\r
                .addClass("serial-supported")\r
                .toggleClass("dataflash-supported", FC.DATAFLASH.supported)\r
                .toggleClass("dataflash-present", dataflashPresent)\r
                .toggleClass("sdcard-supported", FC.SDCARD.supported)\r
                .toggleClass("blackbox-config-supported", FC.BLACKBOX.supported)\r
                .toggleClass("blackbox-supported", blackboxSupport)\r
                .toggleClass("blackbox-unsupported", !blackboxSupport);\r
\r
            if (dataflashPresent) {\r
                // UI hooks\r
                $('.tab-onboard_logging a.erase-flash').on('click', ask_to_erase_flash);\r
\r
                $('.tab-onboard_logging a.erase-flash-confirm').on('click', flash_erase);\r
                $('.tab-onboard_logging a.erase-flash-cancel').on('click', flash_erase_cancel);\r
\r
                $('.tab-onboard_logging a.save-flash').on('click', flash_save_begin);\r
                $('.tab-onboard_logging a.save-flash-cancel').on('click', flash_save_cancel);\r
                $('.tab-onboard_logging a.save-flash-dismiss').on('click', dismiss_saving_dialog);\r
            }\r
\r
            $('.save-blackbox-feature').on('click', function () {\r
                features.reset();\r
                features.fromUI($('.require-blackbox-unsupported'));\r
                features.execute(save_to_eeprom);\r
            });\r
\r
            if (FC.BLACKBOX.supported) {\r
                $(".tab-onboard_logging a.save-settings").on('click', function () {\r
                    var rate = $(".blackboxRate select").val().split('/');\r
\r
                    FC.BLACKBOX.blackboxRateNum = parseInt(rate[0], 10);\r
                    FC.BLACKBOX.blackboxRateDenom = parseInt(rate[1], 10);\r
                    FC.BLACKBOX.blackboxDevice = parseInt($(".blackboxDevice select").val(), 10);\r
                    FC.BLACKBOX.blackboxIncludeFlags = getIncludeFlags();\r
                    features.reset();\r
                    features.fromUI($('.require-blackbox-supported'));\r
                    features.execute(function () {\r
                        mspHelper.sendBlackboxConfiguration(save_to_eeprom);\r
                    });\r
                });\r
            }\r
\r
            //Add checkboxes for each blackbox field\r
            const blackboxFieldsDiv = $("#blackBoxFlagsDiv");\r
            for (let i = 0; i < blackBoxFields.length; i++) {\r
                const FIELD_ID = blackBoxFields[i];\r
                const isEnabled = (FC.BLACKBOX.blackboxIncludeFlags & 1<<i) !==0;\r
                const input = $('<input type="checkbox" class="toggle feature" />')\r
                input.attr("id",FIELD_ID);\r
                input.attr("checked",isEnabled);\r
\r
                const label = $("<label></label>");\r
                label.attr("for",FIELD_ID)\r
\r
                const span = $('<span></span>');\r
                span.html(i18n.getMessage(FIELD_ID))\r
                label.append(span);\r
\r
                const checkbox = $('<div class="checkbox"></div>')\r
                    .append([\r
                        input,label\r
                    ])\r
                blackboxFieldsDiv.append(checkbox);\r
            }\r
\r
            populateLoggingRates();\r
            populateDevices();\r
\r
            update_html();\r
\r
            GUI.content_ready(callback);\r
        }));\r
    }\r
\r
    function populateDevices() {\r
        var\r
            deviceSelect = $(".blackboxDevice select").empty();\r
\r
        deviceSelect.append('<option value="0">Serial port</option>');\r
        if (FC.DATAFLASH.ready) {\r
            deviceSelect.append('<option value="1">On-board dataflash chip</option>');\r
        }\r
        if (FC.SDCARD.supported) {\r
            deviceSelect.append('<option value="2">On-board SD card slot</option>');\r
        }\r
\r
        deviceSelect.val(FC.BLACKBOX.blackboxDevice);\r
    }\r
\r
    function populateLoggingRates() {\r
        var\r
            userRateGCD = gcd(FC.BLACKBOX.blackboxRateNum, FC.BLACKBOX.blackboxRateDenom),\r
            userRate = {num: FC.BLACKBOX.blackboxRateNum / userRateGCD, denom: FC.BLACKBOX.blackboxRateDenom / userRateGCD};\r
\r
        // Offer a reasonable choice of logging rates (if people want weird steps they can use CLI)\r
        var\r
            loggingRates = [\r
                 {num: 1, denom: 32},\r
                 {num: 1, denom: 16},\r
                 {num: 1, denom: 8},\r
                 {num: 1, denom: 5},\r
                 {num: 1, denom: 4},\r
                 {num: 1, denom: 3},\r
                 {num: 1, denom: 2},\r
                 {num: 2, denom: 3},\r
                 {num: 3, denom: 4},\r
                 {num: 4, denom: 5},\r
                 {num: 7, denom: 8},\r
                 {num: 1, denom: 1},\r
            ],\r
            loggingRatesSelect = $(".blackboxRate select");\r
\r
        var\r
            addedCurrentValue = false;\r
\r
        for (var i = 0; i < loggingRates.length; i++) {\r
            if (!addedCurrentValue && userRate.num / userRate.denom <= loggingRates[i].num / loggingRates[i].denom) {\r
                if (userRate.num / userRate.denom < loggingRates[i].num / loggingRates[i].denom) {\r
                    loggingRatesSelect.append('<option value="' + userRate.num + '/' + userRate.denom + '">'\r
                            + userRate.num + '/' + userRate.denom + ' (' + Math.round(userRate.num / userRate.denom * 100) + '%)</option>');\r
                }\r
                addedCurrentValue = true;\r
            }\r
\r
            loggingRatesSelect.append('<option value="' + loggingRates[i].num + '/' + loggingRates[i].denom + '">'\r
                + loggingRates[i].num + '/' + loggingRates[i].denom + ' (' + Math.round(loggingRates[i].num / loggingRates[i].denom * 100) + '%)</option>');\r
\r
        }\r
        loggingRatesSelect.val(userRate.num + '/' + userRate.denom);\r
    }\r
\r
    function formatFilesizeKilobytes(kilobytes) {\r
        if (kilobytes < 1024) {\r
            return Math.round(kilobytes) + "kB";\r
        }\r
\r
        var\r
            megabytes = kilobytes / 1024,\r
            gigabytes;\r
\r
        if (megabytes < 900) {\r
            return megabytes.toFixed(1) + "MB";\r
        } else {\r
            gigabytes = megabytes / 1024;\r
\r
            return gigabytes.toFixed(1) + "GB";\r
        }\r
    }\r
\r
    function formatFilesizeBytes(bytes) {\r
        if (bytes < 1024) {\r
            return bytes + "B";\r
        }\r
        return formatFilesizeKilobytes(bytes / 1024);\r
    }\r
\r
    function update_bar_width(bar, value, total, label, valuesAreKilobytes) {\r
        if (value > 0) {\r
            bar.css({\r
                width: (value / total * 100) + "%",\r
                display: 'block'\r
            });\r
\r
            $("div", bar).text((label ? label + " " : "") + (valuesAreKilobytes ? formatFilesizeKilobytes(value) : formatFilesizeBytes(value)));\r
        } else {\r
            bar.css({\r
                display: 'none'\r
            });\r
        }\r
    }\r
\r
    function update_html() {\r
        update_bar_width($(".tab-onboard_logging .dataflash-used"), FC.DATAFLASH.usedSize, FC.DATAFLASH.totalSize, "Used space", false);\r
        update_bar_width($(".tab-onboard_logging .dataflash-free"), FC.DATAFLASH.totalSize - FC.DATAFLASH.usedSize, FC.DATAFLASH.totalSize, "Free space", false);\r
\r
        update_bar_width($(".tab-onboard_logging .sdcard-other"), FC.SDCARD.totalSizeKB - FC.SDCARD.freeSizeKB, FC.SDCARD.totalSizeKB, "Unavailable space", true);\r
        update_bar_width($(".tab-onboard_logging .sdcard-free"), FC.SDCARD.freeSizeKB, FC.SDCARD.totalSizeKB, "Free space for logs", true);\r
\r
        $(".btn a.erase-flash, .btn a.save-flash").toggleClass("disabled", FC.DATAFLASH.usedSize == 0);\r
\r
        $(".tab-onboard_logging")\r
            .toggleClass("sdcard-error", FC.SDCARD.state == MSP.SDCARD_STATE_FATAL)\r
            .toggleClass("sdcard-initializing", FC.SDCARD.state == MSP.SDCARD_STATE_CARD_INIT || FC.SDCARD.state == MSP.SDCARD_STATE_FS_INIT)\r
            .toggleClass("sdcard-ready", FC.SDCARD.state == MSP.SDCARD_STATE_READY);\r
\r
        switch (FC.SDCARD.state) {\r
            case MSP.SDCARD_STATE_NOT_PRESENT:\r
                $(".sdcard-status").text("No card inserted");\r
            break;\r
            case MSP.SDCARD_STATE_FATAL:\r
                $(".sdcard-status").html("Fatal error<br>Reboot to retry");\r
            break;\r
            case MSP.SDCARD_STATE_READY:\r
                $(".sdcard-status").text("Card ready");\r
            break;\r
            case MSP.SDCARD_STATE_CARD_INIT:\r
                $(".sdcard-status").text("Card starting...");\r
            break;\r
            case MSP.SDCARD_STATE_FS_INIT:\r
                $(".sdcard-status").text("Filesystem starting...");\r
            break;\r
            default:\r
                $(".sdcard-status").text("Unknown state " + FC.SDCARD.state);\r
        }\r
\r
        if (FC.SDCARD.supported && !sdcardTimer) {\r
            // Poll for changes in SD card status\r
            sdcardTimer = setTimeout(function() {\r
                sdcardTimer = false;\r
                if (CONFIGURATOR.connectionValid) {\r
                    MSP.send_message(MSPCodes.MSP_SDCARD_SUMMARY, false, false, function() {\r
                        update_html();\r
                    });\r
                }\r
            }, 2000);\r
        }\r
    }\r
\r
    // IO related methods\r
    function zeroPad(value, width) {\r
        value = "" + value;\r
\r
        while (value.length < width) {\r
            value = "0" + value;\r
        }\r
\r
        return value;\r
    }\r
\r
    function flash_save_cancel() {\r
        saveCancelled = true;\r
    }\r
\r
    function show_saving_dialog() {\r
        $(".dataflash-saving progress").attr("value", 0);\r
        saveCancelled = false;\r
        $(".dataflash-saving").removeClass("done");\r
\r
        $(".dataflash-saving")[0].showModal();\r
    }\r
\r
    function dismiss_saving_dialog() {\r
        $(".dataflash-saving")[0].close();\r
    }\r
\r
    function mark_saving_dialog_done() {\r
        $(".dataflash-saving").addClass("done");\r
    }\r
\r
    function flash_update_summary(onDone) {\r
        MSP.send_message(MSPCodes.MSP_DATAFLASH_SUMMARY, false, false, function() {\r
            update_html();\r
\r
            if (onDone) {\r
                onDone();\r
            }\r
        });\r
    }\r
\r
    function flash_save_begin() {\r
        if (GUI.connected_to) {\r
            // Begin by refreshing the occupied size in case it changed while the tab was open\r
            flash_update_summary(function() {\r
                const maxBytes = FC.DATAFLASH.usedSize;\r
\r
                prepare_file(function(filename) {\r
                    let nextAddress = 0;\r
\r
                    show_saving_dialog();\r
                    let webBuffer = [];\r
\r
                    function onChunkRead(chunkAddress, chunk) {\r
                        if (chunk != null) {\r
                            // Did we receive any data?\r
                            if (chunk.byteLength > 0) {\r
                                nextAddress += chunk.byteLength;\r
\r
                                $(".dataflash-saving progress").attr("value", nextAddress / maxBytes * 100);\r
\r
                                if (bridge.isElectron) { \r
                                    window.electronAPI.appendFile(filename, new Uint8Array(chunk), {\r
                                        "flag": "a"\r
                                    });\r
                                } else {\r
                                    webBuffer.push(...chunk);\r
                                }\r
\r
                                // Untested !\r
                                if (saveCancelled) {\r
                                    dismiss_saving_dialog();\r
                                } else if (nextAddress >= maxBytes) {\r
                                    mark_saving_dialog_done();\r
                                } else {\r
                                    mspHelper.dataflashRead(nextAddress, onChunkRead);\r
                                }\r
\r
                            } else {\r
                                // A zero-byte block indicates end-of-file, so we're done\r
                                if (!bridge.isElectron) {\r
                                    bridge.writeFile(filename, new Uint8Array(webBuffer), true);\r
                                }\r
                                mark_saving_dialog_done();\r
                            }\r
                        } else {\r
                            // There was an error with the received block (address didn't match the one we asked for), retry\r
                            mspHelper.dataflashRead(nextAddress, onChunkRead);\r
                        }\r
                    }\r
\r
                    // Fetch the initial block\r
                    mspHelper.dataflashRead(nextAddress, onChunkRead);\r
                });\r
            });\r
        }\r
    }\r
\r
    function prepare_file(onComplete) {\r
        const date = new Date();\r
        const filename = 'blackbox_log_' + date.getFullYear() + '-'  + zeroPad(date.getMonth() + 1, 2) + '-'\r
                + zeroPad(date.getDate(), 2) + '_' + zeroPad(date.getHours(), 2) + zeroPad(date.getMinutes(), 2)\r
                + zeroPad(date.getSeconds(), 2) + '.TXT';\r
\r
        var options = {\r
            defaultPath: filename,\r
            filters: [ { name: "TXT file", extensions: ['txt'] } ]\r
        };\r
        dialog.showSaveDialog(options).then(result => {\r
            if (result.canceled) {\r
                return;\r
            }\r
            onComplete(result.filePath);\r
        });\r
    }\r
\r
    function ask_to_erase_flash() {\r
        eraseCancelled = false;\r
        $(".dataflash-confirm-erase").removeClass('erasing');\r
        $(".dataflash-confirm-erase")[0].showModal();\r
    }\r
\r
    function poll_for_erase_completion() {\r
        flash_update_summary(function() {\r
            if (CONFIGURATOR.connectionValid && !eraseCancelled) {\r
                if (FC.DATAFLASH.ready) {\r
                    $(".dataflash-confirm-erase")[0].close();\r
                } else {\r
                    setTimeout(poll_for_erase_completion, 500);\r
                }\r
            }\r
        });\r
    }\r
\r
    function flash_erase() {\r
        $(".dataflash-confirm-erase").addClass('erasing');\r
\r
        MSP.send_message(MSPCodes.MSP_DATAFLASH_ERASE, false, false, poll_for_erase_completion);\r
    }\r
\r
    function flash_erase_cancel() {\r
        eraseCancelled = true;\r
        $(".dataflash-confirm-erase")[0].close();\r
    }\r
\r
    function getIncludeFlags(){\r
        let flags = 0;\r
        for (let i = 0; i < blackBoxFields.length; i++) {\r
            const FIELD_ID = blackBoxFields[i];\r
\r
            const checkbox = $("#"+FIELD_ID);\r
            if(checkbox.prop("checked")){\r
                flags=flags|1<<i;\r
            }\r
        }\r
        return flags;\r
    }\r
};\r
\r
onboardLoggingTab.cleanup = function (callback) {\r
    if (sdcardTimer) {\r
        clearTimeout(sdcardTimer);\r
        sdcardTimer = false;\r
    }\r
\r
    if (callback) {\r
        callback();\r
    }\r
};\r
\r
export default onboardLoggingTab;`;export{n as default};
