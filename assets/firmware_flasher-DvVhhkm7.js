const e=`'use strict';\r
\r
import { marked } from 'marked';\r
import semver from 'semver';\r
\r
import i18n from './../js/localization';\r
import GUI from './../js/gui';\r
import MSP from './../js/msp';\r
import MSPCodes from './../js/msp/MSPCodes';\r
import FC from './../js/fc';\r
import { usbDevices, PortHandler } from './../js/port_handler';\r
import CONFIGURATOR from './../js/data_storage';\r
import SerialBackend from './../js/serial_backend';\r
import timeout from './../js/timeouts';\r
import interval from './../js/intervals';\r
import mspQueue from './../js/serial_queue';\r
import mspHelper from './../js/msp/MSPHelper';\r
import STM32 from './../js/protocols/stm32';\r
import STM32DFU from './../js/protocols/stm32usbdfu';\r
import mspDeduplicationQueue from './../js/msp/mspDeduplicationQueue';\r
import dialog from './../js/dialog.js';\r
import {bridge, Platform} from './../js/bridge';\r
\r
const firmwareFlasherTab = {};\r
\r
firmwareFlasherTab.initialize = function (callback) {\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    var intel_hex = false, // standard intel hex in string format\r
        parsed_hex = false, // parsed raw hex in array format\r
        fileName = "inav.hex";\r
\r
    import('./firmware_flasher.html?raw').then(({default: html}) => GUI.load(html, function () {\r
        // translate to user-selected language\r
        i18n.localize();\r
\r
        function enable_load_online_button() {\r
            $(".load_remote_file").text(i18n.getMessage('firmwareFlasherButtonLoadOnline')).removeClass('disabled');\r
        }\r
\r
        function parse_hex(str, callback) {\r
            // parsing hex in different thread\r
            const worker = new Worker(new URL('./../js/workers/hex_parser.js', import.meta.url));\r
            \r
            // "callback"\r
            worker.onmessage = function (event) {\r
                callback(event.data);\r
            };\r
\r
            // send data/string over for processing\r
            worker.postMessage(str);\r
            \r
        }\r
\r
        function getReleaseMajor(releaseName) {\r
            // "name":"inav-9.0.0-dev-20250124-28-d1ef85e82d8aa5bb8b85e518893c8e4f6ab61d6e"\r
            var releaseNameExpression = /^inav-(\\d+)([\\d.]+)-(ci|dev)-(\\d{4})(\\d{2})(\\d{2})-(\\d+)-(\\w+)$/;\r
            var match = releaseNameExpression.exec(releaseName);\r
\r
            if(!match) {\r
                console.log(releaseName + " not matched");\r
                //alert(releaseName);\r
                return 0;\r
            }\r
\r
            return match[1];\r
        }\r
\r
        function parseDevFilename(filename) {\r
            //var targetFromFilenameExpression = /inav_([\\d.]+)?_?([^.]+)\\.(.*)/;\r
            // inav_8.0.0_TUNERCF405_dev-20240617-88fb1d0.hex\r
            // inav_8.0.0_TUNERCF405_ci-20240617-88fb1d0.hex\r
            var targetFromFilenameExpression = /^inav_(\\d+)([\\d.]+)_([A-Za-z0-9_]+)_(ci|dev)-(\\d{4})(\\d{2})(\\d{2})-(\\w+)\\.(hex)$/;\r
            var match = targetFromFilenameExpression.exec(filename);\r
\r
            if (!match) {\r
                console.log(filename + " not matched");\r
                return null;\r
            }\r
\r
            return {\r
                raw_target: match[3],\r
                target: match[3].replace("_", " "),\r
                format: match[9],\r
                version: match[1]+match[2],\r
                major: match[1]\r
            };\r
        }\r
\r
        function parseFilename(filename) {\r
            //var targetFromFilenameExpression = /inav_([\\d.]+)?_?([^.]+)\\.(.*)/;\r
            var targetFromFilenameExpression = /inav_([\\d.]+(?:-rc\\d+)?)?_?([^.]+)\\.(.*)/;\r
            var match = targetFromFilenameExpression.exec(filename);\r
\r
            if (!match) {\r
                return null;\r
            }\r
\r
            //GUI.log("non dev: match[2]: " + match[2] + " match[3]: " + match[3]);\r
\r
            return {\r
                raw_target: match[2],\r
                target: match[2].replace("_", " "),\r
                format: match[3],\r
            };\r
        }\r
\r
        $('input.show_development_releases').on('click', function () {\r
            let selectedTarget = String($('select[name="board"]').val());\r
            GUI.log(i18n.getMessage('selectedTarget') + selectedTarget);\r
            buildBoardOptions();\r
            GUI.log(i18n.getMessage('toggledRCs'));\r
            if (selectedTarget === "0") {\r
                firmwareFlasherTab.getTarget();\r
            } else {\r
                $('select[name="board"] option[value=' + selectedTarget + ']').attr("selected", "selected");\r
                $('select[name="board"]').trigger('change');\r
            }\r
        });\r
\r
        $('.target_search').on('input', function(){\r
            var searchText = $('.target_search').val().toLocaleLowerCase();\r
\r
            $('#board_targets option').each(function(i){\r
                var target = $(this);\r
                //alert("Comparing " + searchText + " with " + target.text());\r
                if (searchText.length > 0 && i !== 0) { \r
                    if (target.text().toLowerCase().includes(searchText) || target.val().toLowerCase().includes(searchText)) {\r
                        target.show();\r
                    } else {\r
                        target.hide();\r
                    }\r
                } else {\r
                    target.show();\r
                }\r
            });\r
        });\r
\r
        var buildBoardOptions = function(releasesData) {\r
            const start = performance.now();\r
            var boards_e = $('select[name="board"]').empty();\r
            var versions_e = $('select[name="firmware_version"]').empty();\r
            var showDevReleases = ($('input.show_development_releases').is(':checked'));\r
            \r
            boards_e.append($("<option value='0'>{0}</option>".format(i18n.getMessage('firmwareFlasherOptionLabelSelectBoard'))));\r
            versions_e.append($("<option value='0'>{0}</option>".format(i18n.getMessage('firmwareFlasherOptionLabelSelectFirmwareVersion'))));\r
\r
            var releases = {};\r
            var sortedTargets = [];\r
            var unsortedTargets = [];\r
\r
            firmwareFlasherTab.releasesData.forEach(function(release){\r
                release.assets.forEach(function(asset){\r
                    var result = parseFilename(asset.name);\r
\r
                    if ((!showDevReleases && release.prerelease) || !result) {\r
                        return;\r
                    }\r
                    if($.inArray(result.target, unsortedTargets) == -1) {\r
                        unsortedTargets.push(result.target);\r
                    }\r
                });\r
            });\r
\r
            if (showDevReleases) {\r
                var majorCount = {};\r
                firmwareFlasherTab.devReleasesData.forEach(function (release) {\r
                    release.assets.forEach(function (asset) {\r
                        var result = parseDevFilename(asset.name);\r
\r
                        if (result && $.inArray(result.target, unsortedTargets) == -1) {\r
                            unsortedTargets.push(result.target);\r
                        }\r
                    });\r
                });\r
            }\r
\r
            sortedTargets = unsortedTargets.sort();\r
\r
            sortedTargets.forEach(function(release) {\r
                releases[release] = [];\r
            });\r
\r
            firmwareFlasherTab.releasesData.forEach(function(release){\r
\r
                var versionFromTagExpression = /v?(.*)/;\r
                var matchVersionFromTag = versionFromTagExpression.exec(release.tag_name);\r
                var version = matchVersionFromTag[1];\r
\r
                release.assets.forEach(function(asset){\r
                    var result = parseFilename(asset.name);\r
                    if ((!showDevReleases && release.prerelease) || !result) {\r
                        return;\r
                    }\r
\r
                    if (result.format != 'hex') {\r
                        return;\r
                    }\r
\r
                    var date = new Date(release.published_at);\r
                    var formattedDate = "{0}-{1}-{2} {3}:{4}".format(\r
                            date.getFullYear(),\r
                            date.getMonth() + 1,\r
                            date.getDate(),\r
                            date.getUTCHours(),\r
                            date.getMinutes()\r
                    );\r
                    \r
                    var descriptor = {\r
                        "releaseUrl": release.html_url,\r
                        "name"      : semver.clean(release.name),\r
                        "version"   : release.tag_name,\r
                        "url"       : asset.browser_download_url,\r
                        "file"      : asset.name,\r
                        "raw_target": result.raw_target,\r
                        "target"    : result.target,\r
                        "date"      : formattedDate,\r
                        "notes"     : release.body,\r
                        "status"    : release.prerelease ? "release-candidate" : "stable"\r
                    };\r
                    releases[result.target].push(descriptor);\r
                });\r
            });\r
\r
            if(showDevReleases && firmwareFlasherTab.devReleasesData) {\r
                var majorCount = {};\r
                firmwareFlasherTab.devReleasesData.forEach(function(release){\r
                    var major = getReleaseMajor(release.name);\r
\r
                    if (!(major in majorCount)) {\r
                        majorCount[major] = 0;\r
                    }\r
\r
                    if(majorCount[major] >= 10) {\r
                        return;\r
                    }\r
\r
                    majorCount[major]++;\r
\r
                    var versionFromTagExpression = /v?(.*)/;\r
                    var matchVersionFromTag = versionFromTagExpression.exec(release.tag_name);\r
                    var version = matchVersionFromTag[1];\r
\r
                    release.assets.forEach(function(asset){\r
                        var result = parseDevFilename(asset.name);\r
                        if ((!showDevReleases && release.prerelease) || !result) {\r
                            return;\r
                        }\r
\r
                        if (result.format != 'hex') {\r
                            return;\r
                        }\r
\r
                        var date = new Date(release.published_at);\r
                        var formattedDate = "{0}-{1}-{2} {3}:{4}".format(\r
                                date.getFullYear(),\r
                                date.getMonth() + 1,\r
                                date.getDate(),\r
                                date.getUTCHours(),\r
                                date.getMinutes()\r
                        );\r
\r
                        var descriptor = {\r
                            "releaseUrl": release.html_url,\r
                            "name"      : semver.clean(release.name),\r
                            "version"   : release.tag_name,\r
                            "url"       : asset.browser_download_url,\r
                            "file"      : asset.name,\r
                            "raw_target": result.raw_target,\r
                            "target"    : result.target,\r
                            "date"      : formattedDate,\r
                            "notes"     : release.body,\r
                            "status"    : release.prerelease ? "nightly" : "stable"\r
                        };\r
                        releases[result.target].push(descriptor);\r
                    });\r
                });\r
            }\r
            \r
            var selectTargets = [];\r
            Object.keys(releases)\r
                .sort()\r
                .forEach(function(target, i) {\r
                    var descriptors = releases[target];\r
                    descriptors.forEach(function(descriptor){\r
                        if($.inArray(target, selectTargets) == -1) {\r
                            selectTargets.push(target);\r
                            var select_e =\r
                                    $("<option value='{0}'>{1}</option>".format(\r
                                            descriptor.raw_target,\r
                                            descriptor.target\r
                                    )).data('summary', descriptor);\r
                            boards_e.append(select_e);\r
                        }\r
                    });\r
                });\r
            firmwareFlasherTab.releases = releases;\r
            const end = performance.now();\r
            console.log(\`buildBoardOptions: \${end - start} ms\`)\r
            return;\r
        };\r
\r
        $.get('https://api.github.com/repos/iNavFlight/inav-nightly/releases?per_page=50', function(releasesData) {\r
            firmwareFlasherTab.devReleasesData = releasesData;\r
        }).fail(function (data){\r
            firmwareFlasherTab.devReleasesData = {};\r
            if (data["responseJSON"]){\r
                GUI.log("<b>GITHUB Query Failed: <code>{0}</code></b>".format(data["responseJSON"].message));\r
            }\r
            $('select[name="board"]').empty().append('<option value="0">Offline</option>');\r
            $('select[name="firmware_version"]').empty().append('<option value="0">Offline</option>');\r
            $('a.auto_select_target').addClass('disabled');\r
        });\r
\r
\r
        $.get('https://api.github.com/repos/iNavFlight/inav/releases?per_page=10', function (releasesData){\r
            firmwareFlasherTab.releasesData = releasesData;\r
            buildBoardOptions(releasesData);\r
\r
            // bind events\r
            $('select[name="board"]').on('change', function () {\r
\r
                $("a.load_remote_file").addClass('disabled');\r
                var target = $(this).children("option:selected").val();\r
\r
                if (!GUI.connect_lock) {\r
                    $('.progress').val(0).removeClass('valid invalid');\r
                    $('span.progressLabel').text(i18n.getMessage('firmwareFlasherLoadFirmwareFile'));\r
                    $('div.git_info').slideUp();\r
                    $('div.release_info').slideUp();\r
                    $('a.flash_firmware').addClass('disabled');\r
\r
                    var versions_e = $('select[name="firmware_version"]').empty();\r
                    if(target == 0) {\r
                        versions_e.append($("<option value='0'>{0}</option>".format(i18n.getMessage('firmwareFlasherOptionLabelSelectFirmwareVersion'))));\r
                    } else {\r
                        versions_e.append($("<option value='0'>{0} {1}</option>".format(i18n.getMessage('firmwareFlasherOptionLabelSelectFirmwareVersionFor'), target)));\r
                    }\r
\r
                    if (typeof firmwareFlasherTab.releases[target]?.forEach === 'function') {\r
                        firmwareFlasherTab.releases[target].forEach(function(descriptor) {\r
                            var select_e =\r
                                    $("<option value='{0}'>{0} - {1} - {2} ({3})</option>".format(\r
                                            descriptor.version,\r
                                            descriptor.target,\r
                                            descriptor.date,\r
                                            descriptor.status\r
                                    )).data('summary', descriptor);\r
\r
                            versions_e.append(select_e);\r
                        });\r
                    }\r
                }\r
            });\r
\r
            $('a.auto_select_target').removeClass('disabled');\r
            firmwareFlasherTab.getTarget();\r
        }).fail(function (data){\r
            if (data["responseJSON"]){\r
                GUI.log("<b>GITHUB Query Failed: <code>{0}</code></b>".format(data["responseJSON"].message));\r
            }\r
            $('select[name="board"]').empty().append('<option value="0">Offline</option>');\r
            $('select[name="firmware_version"]').empty().append('<option value="0">Offline</option>');\r
            $('a.auto_select_target').addClass('disabled');\r
        });\r
\r
        $('a.load_file').on('click', function () {\r
\r
            var options = {\r
                filters: [ { name: "HEX file", extensions: ['hex'] } ]\r
            };\r
            dialog.showOpenDialog(options).then(result =>  {\r
                if (result.canceled) {\r
                    return;\r
                }\r
\r
                let file;\r
                if (result.files.length == 1) {\r
                    file = result.files[0];\r
                }\r
                \r
                $('div.git_info').slideUp();\r
\r
                bridge.readFile(file).then(response => {\r
\r
                    if (response.error) {\r
                        console.log("Error loading local file", response.error);\r
                        return;\r
                    }\r
\r
                    console.log('File loaded');\r
\r
                    parse_hex(response.data, function (data) {\r
                        parsed_hex = data;\r
\r
                        if (parsed_hex) {\r
                            $('a.flash_firmware').removeClass('disabled');\r
\r
                            $('span.progressLabel').text('Loaded Local Firmware: (' + parsed_hex.bytes_total + ' bytes)');\r
                        } else {\r
                            $('span.progressLabel').text(i18n.getMessage('firmwareFlasherHexCorrupted'));\r
                        }\r
                    });\r
                });\r
\r
            });\r
\r
        });\r
\r
        /**\r
         * Lock / Unlock the firmware download button according to the firmware selection dropdown.\r
         */\r
        $('select[name="firmware_version"]').on('change', function(evt){\r
            $('div.release_info').slideUp();\r
            $('a.flash_firmware').addClass('disabled');\r
            if (evt.target.value=="0") {\r
                $("a.load_remote_file").addClass('disabled');\r
            }\r
            else {\r
                enable_load_online_button();\r
            }\r
        });\r
\r
        $('a.load_remote_file').on('click', function () {\r
\r
            if ($('select[name="firmware_version"]').val() == "0") {\r
                GUI.log(i18n.getMessage('noFirmwareSelectedToLoad'));\r
                return;\r
            }\r
\r
            function process_hex(data, summary) {\r
                intel_hex = data;\r
\r
                parse_hex(intel_hex, function (data) {\r
                    parsed_hex = data;\r
\r
                    if (parsed_hex) {\r
                        var url;\r
\r
                        $('span.progressLabel').html('<a class="save_firmware" href="#" title="Save Firmware">Loaded Online Firmware: (' + parsed_hex.bytes_total + ' bytes)</a>');\r
\r
                        $('a.flash_firmware').removeClass('disabled');\r
\r
                        if (summary.commit) {\r
                            $.get('https://api.github.com/repos/iNavFlight/inav/commits/' + summary.commit, function (data) {\r
                                var data = data,\r
                                    d = new Date(data.commit.author.date),\r
                                    offset = d.getTimezoneOffset() / 60,\r
                                    date;\r
\r
                                date = d.getFullYear() + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + ('0' + (d.getDate())).slice(-2);\r
                                date += ' @ ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);\r
                                date += (offset > 0) ? ' GMT+' + offset : ' GMT' + offset;\r
\r
                                $('div.git_info .committer').text(data.commit.author.name);\r
                                $('div.git_info .date').text(date);\r
                                $('div.git_info .hash').text(data.sha.slice(0, 7)).prop('href', 'https://api.github.com/repos/iNavFlight/inav/commit/' + data.sha);\r
\r
                                $('div.git_info .message').text(data.commit.message);\r
\r
                                $('div.git_info').slideDown();\r
                            });\r
                        }\r
\r
                        $('div.release_info .target').text(summary.target);\r
\r
                        var status_e = $('div.release_info .status');\r
                        if (summary.status == 'release-candidate') {\r
                            $('div.release_info .status').html(i18n.getMessage('firmwareFlasherReleaseStatusReleaseCandidate')).show();\r
                        } else {\r
                            status_e.hide();\r
                        }\r
\r
                        $('div.release_info .name').text(summary.name).prop('href', summary.releaseUrl);\r
                        $('div.release_info .date').text(summary.date);\r
                        $('div.release_info .status').text(summary.status);\r
                        $('div.release_info .file').text(summary.file).prop('href', summary.url);\r
\r
                        var formattedNotes = marked.parse(summary.notes);\r
                        $('div.release_info .notes').html(formattedNotes);\r
                        // Make links in the release notes open in a new window\r
                        $('div.release_info .notes a').each(function () {\r
                            $(this).attr('target', '_blank');\r
                        });\r
\r
                        $('div.release_info').slideDown();\r
\r
                    } else {\r
                        $('span.progressLabel').text(i18n.getMessage('firmwareFlasherHexCorrupted'));\r
                    }\r
                });\r
            }\r
\r
            function failed_to_load() {\r
                $('span.progressLabel').text(i18n.getMessage('firmwareFlasherFailedToLoadOnlineFirmware'));\r
                $('a.flash_firmware').addClass('disabled');\r
                enable_load_online_button();\r
            }\r
\r
            var summary = $('select[name="firmware_version"] option:selected').data('summary');\r
            if (summary) { // undefined while list is loading or while running offline\r
                fileName = summary.file;\r
                $(".load_remote_file").text(i18n.getMessage('firmwareFlasherButtonLoading')).addClass('disabled');\r
                \r
                const url = bridge.proxy(summary.url);\r
                \r
                $.get(url, function (data) {\r
                    enable_load_online_button();\r
                    process_hex(data, summary);\r
                }).fail(failed_to_load);\r
            } else {\r
                $('span.progressLabel').text(i18n.getMessage('firmwareFlasherFailedToLoadOnlineFirmware'));\r
            }\r
        });\r
\r
        $('a.flash_firmware').on('click', function () {\r
            if (!$(this).hasClass('disabled')) {\r
                if (!GUI.connect_lock) { // button disabled while flashing is in progress\r
                    if (parsed_hex != false) {\r
                        var options = {};\r
\r
                        if ($('input.erase_chip').is(':checked')) {\r
                            options.erase_chip = true;\r
                        }\r
\r
                        if (String($('div#port-picker #port').val()) != 'DFU') {\r
                            if (String($('div#port-picker #port').val()) != '0') {\r
                                var port = String($('div#port-picker #port').val()),\r
                                    baud;\r
\r
                                switch (GUI.operating_system) {\r
                                    case 'Windows':\r
                                    case 'MacOS':\r
                                    case 'ChromeOS':\r
                                    case 'Linux':\r
                                    case 'UNIX':\r
                                        baud = 921600;\r
                                        break;\r
\r
                                    default:\r
                                        baud = 115200;\r
                                }\r
\r
                                if ($('input.updating').is(':checked')) {\r
                                    options.no_reboot = true;\r
                                } else {\r
                                    options.reboot_baud = parseInt($('div#port-picker #baud').val());\r
                                }\r
\r
                                if ($('input.flash_manual_baud').is(':checked')) {\r
                                    baud = parseInt($('#flash_manual_baud_rate').val());\r
                                }\r
\r
\r
                                STM32.connect(port, baud, parsed_hex, options);\r
                            } else {\r
                                console.log('Please select valid serial port');\r
                                GUI.log(i18n.getMessage('selectValidSerialPort'));\r
                            }\r
                        } else {\r
                            STM32DFU.connect(usbDevices, parsed_hex, options);\r
                        }\r
                    } else {\r
                        $('span.progressLabel').text(i18n.getMessage('firmwareFlasherFirmwareNotLoaded'));\r
                    }\r
                }\r
            }\r
        });\r
\r
        $(document).on('click', 'span.progressLabel a.save_firmware', function () {\r
            var options = {\r
                defaultPath: fileName,\r
                filters: [ {name: "HEX File", extensions: ['hex'] } ]\r
            };\r
            dialog.showSaveDialog(options).then(result => {\r
                if (result.canceled) {\r
                    return;\r
                }\r
                bridge.writeFile(result.filePath, intel_hex).then(error => {\r
                    if (error) {\r
                        GUI.log(i18n.getMessage('ErrorWritingFile'));\r
                        return console.error(error);\r
                    }\r
                });\r
                let sFilename = String(result.filePath.split('\\\\').pop().split('/').pop());\r
                GUI.log(sFilename + i18n.getMessage('savedSuccessfully'));\r
            });\r
        });\r
\r
        \r
        if (bridge.storeGet('no_reboot_sequence', false)) {\r
            $('input.updating').prop('checked', true);\r
            $('.flash_on_connect_wrapper').show();\r
        } else {\r
            $('input.updating').prop('checked', false);\r
        }\r
\r
        // bind UI hook so the status is saved on change\r
        $('input.updating').on('change', function () {\r
            var status = $(this).is(':checked');\r
\r
            if (status) {\r
                $('.flash_on_connect_wrapper').show();\r
            } else {\r
                $('input.flash_on_connect').prop('checked', false).trigger('change');\r
                $('.flash_on_connect_wrapper').hide();\r
            }\r
\r
            bridge.storeSet('no_reboot_sequence', status);\r
        });\r
\r
        $('input.updating').trigger('change');\r
        \r
        if (bridge.storeGet('flash_manual_baud', false)) {\r
            $('input.flash_manual_baud').prop('checked', true);\r
        } else {\r
            $('input.flash_manual_baud').prop('checked', false);\r
        }\r
\r
        // bind UI hook so the status is saved on change\r
        $('input.flash_manual_baud').on('change', function () {\r
            var status = $(this).is(':checked');\r
            bridge.storeSet('flash_manual_baud', status);\r
        });\r
\r
        $('input.flash_manual_baud').trigger('change');\r
        \r
\r
        var flash_manual_baud_rate = bridge.storeGet('flash_manual_baud_rate', '');\r
        $('#flash_manual_baud_rate').val(flash_manual_baud_rate);\r
\r
        // bind UI hook so the status is saved on change\r
        $('#flash_manual_baud_rate').on('change', function () {\r
            var baud = parseInt($('#flash_manual_baud_rate').val());\r
            bridge.storeSet('flash_manual_baud_rate', baud);\r
        });\r
\r
        $('input.flash_manual_baud_rate').trigger('change');\r
\r
        \r
        if (bridge.storeGet('flash_on_connect', false)) {\r
            $('input.flash_on_connect').prop('checked', true);\r
        } else {\r
            $('input.flash_on_connect').prop('checked', false);\r
        }\r
\r
        $('input.flash_on_connect').on('change', function () {\r
            var status = $(this).is(':checked');\r
\r
            if (status) {\r
                var catch_new_port = function () {\r
                    PortHandler.port_detected('flash_detected_device', function (result) {\r
                        var port = result[0];\r
\r
                        if (!GUI.connect_lock) {\r
                            GUI.log('Detected: <strong>' + port + '</strong> - triggering flash on connect');\r
                            console.log('Detected: ' + port + ' - triggering flash on connect');\r
\r
                            // Trigger regular Flashing sequence\r
                            timeout.add('initialization_timeout', function () {\r
                                $('a.flash_firmware').trigger( "click" );\r
                            }, 100); // timeout so bus have time to initialize after being detected by the system\r
                        } else {\r
                            GUI.log('Detected <strong>' + port + '</strong> - previous device still flashing, please replug to try again');\r
                        }\r
\r
                        // Since current port_detected request was consumed, create new one\r
                        catch_new_port();\r
                    }, false, true);\r
                };\r
\r
                catch_new_port();\r
            } else {\r
                PortHandler.flush_callbacks();\r
            }\r
\r
            bridge.storeSet('flash_on_connect', status);\r
        }).trigger('change');\r
        \r
\r
        \r
        if (bridge.storeGet('erase_chip', false)) {\r
            $('input.erase_chip').prop('checked', true);\r
        } else {\r
            $('input.erase_chip').prop('checked', false);\r
        }\r
\r
        // bind UI hook so the status is saved on change\r
        $('input.erase_chip').on('change', async function () {\r
            bridge.storeSet('erase_chip', $(this).is(':checked'));\r
        });\r
\r
        $('input.erase_chip').trigger('change');\r
\r
        \r
\r
        $(document).keypress(function (e) {\r
            if (e.which == 13) { // enter\r
                // Trigger regular Flashing sequence\r
                $('a.flash_firmware').trigger( "click" );\r
            }\r
        });\r
\r
        $('a.auto_select_target').on('click', function () {\r
            firmwareFlasherTab.getTarget();\r
        });\r
\r
        GUI.content_ready(callback);\r
    }));\r
};\r
\r
firmwareFlasherTab.FLASH_MESSAGE_TYPES = {NEUTRAL : 'NEUTRAL',\r
                                             VALID   : 'VALID',\r
                                             INVALID : 'INVALID',\r
                                             ACTION  : 'ACTION'};\r
\r
firmwareFlasherTab.flashingMessage = function(message, type) {\r
    let self = this;\r
\r
    let progressLabel_e = $('span.progressLabel');\r
    switch (type) {\r
        case self.FLASH_MESSAGE_TYPES.VALID:\r
            progressLabel_e.removeClass('invalid actionRequired')\r
                           .addClass('valid');\r
            break;\r
        case self.FLASH_MESSAGE_TYPES.INVALID:\r
            progressLabel_e.removeClass('valid actionRequired')\r
                           .addClass('invalid');\r
            break;\r
        case self.FLASH_MESSAGE_TYPES.ACTION:\r
            progressLabel_e.removeClass('valid invalid')\r
                           .addClass('actionRequired');\r
            break;\r
        case self.FLASH_MESSAGE_TYPES.NEUTRAL:\r
        default:\r
            progressLabel_e.removeClass('valid invalid actionRequired');\r
            break;\r
    }\r
    if (message != null) {\r
        progressLabel_e.html(message);\r
    }\r
\r
    return self;\r
};\r
\r
firmwareFlasherTab.flashProgress = function(value) {\r
    $('.progress').val(value);\r
\r
    return this;\r
};\r
\r
firmwareFlasherTab.cleanup = function (callback) {\r
    PortHandler.flush_callbacks();\r
\r
    // unbind "global" events\r
    $(document).unbind('keypress');\r
    $(document).off('click', 'span.progressLabel a');\r
\r
    if (callback) callback();\r
};\r
\r
firmwareFlasherTab.getTarget = function() {\r
    GUI.log(i18n.getMessage('automaticTargetSelect'));\r
    \r
    var selected_baud = parseInt($('#baud').val());\r
    var selected_port = $('#port').find('option:selected').data().isManual ? $('#port-override').val() : String($('#port').val());\r
    \r
    if (selected_port !== 'DFU') {\r
        if (!selected_port || selected_port == '0') {\r
            GUI.log(i18n.getMessage('targetPrefetchFailNoPort'));\r
        } else {\r
            console.log('Connecting to: ' + selected_port);\r
            GUI.connecting_to = selected_port;\r
\r
            if (selected_port == 'tcp' || selected_port == 'udp') {\r
                CONFIGURATOR.connection.connect($portOverride.val(), {}, firmwareFlasherTab.onOpen);\r
            } else {\r
                CONFIGURATOR.connection.connect(selected_port, {bitrate: selected_baud}, firmwareFlasherTab.onOpen);\r
            }\r
        }\r
    } else {\r
        GUI.log(i18n.getMessage('targetPrefetchFailDFU'));\r
    }\r
};\r
\r
firmwareFlasherTab.onOpen = async function(openInfo) {\r
    if (openInfo) {\r
        GUI.connected_to = GUI.connecting_to;\r
\r
        // reset connecting_to\r
        GUI.connecting_to = false;\r
\r
        // save selected port with chrome.storage if the port differs\r
        var last_used_port = bridge.storeGet('last_used_port', '');\r
        if (last_used_port) {\r
            if (last_used_port != GUI.connected_to) {\r
                // last used port doesn't match the one found in local db, we will store the new one\r
                bridge.storeSet('last_used_port', GUI.connected_to);\r
            }\r
        } else {\r
            // variable isn't stored yet, saving\r
            bridge.storeSet('last_used_port', GUI.connected_to);\r
        }\r
        \r
\r
        bridge.storeSet('last_used_bps', CONFIGURATOR.connection.bitrate);\r
        bridge.storeSet('wireless_mode_enabled', $('#wireless-mode').is(":checked"));\r
\r
        CONFIGURATOR.connection.addOnReceiveListener(SerialBackend.read_serial);\r
\r
        // disconnect after 10 seconds with error if we don't get IDENT data\r
        timeout.add('connecting', function () {\r
            if (!CONFIGURATOR.connectionValid) {\r
                GUI.log(i18n.getMessage('targetPrefetchFail') + i18n.getMessage('noConfigurationReceived'));\r
\r
                firmwareFlasherTab.closeTempConnection();\r
            }\r
        }, 10000);\r
\r
        FC.resetState();\r
\r
        // request configuration data. Start with MSPv1 and\r
        // upgrade to MSPv2 if possible.\r
        MSP.protocolVersion = MSP.constants.PROTOCOL_V2;\r
        MSP.send_message(MSPCodes.MSP_API_VERSION, false, false, function () {\r
            \r
            if (FC.CONFIG.apiVersion === "0.0.0") {\r
                GUI_control.prototype.log("Cannot prefetch target: <span style='color: red; font-weight: bolder'><strong>" + i18n.getMessage("illegalStateRestartRequired") + "</strong></span>");\r
                FC.restartRequired = true;\r
                return;\r
            }\r
\r
            MSP.send_message(MSPCodes.MSP_FC_VARIANT, false, false, function () {\r
                if (FC.CONFIG.flightControllerIdentifier == 'INAV') {\r
                    MSP.send_message(MSPCodes.MSP_FC_VERSION, false, false, function () {\r
                        if (semver.lt(FC.CONFIG.flightControllerVersion, "5.0.0")) {\r
                            GUI.log(i18n.getMessage('targetPrefetchFailOld'));\r
                            firmwareFlasherTab.closeTempConnection();\r
                        } else {\r
                            mspHelper.getCraftName(function(name) {\r
                                if (name) {\r
                                    FC.CONFIG.name = name;\r
                                }\r
                                firmwareFlasherTab.onValidFirmware();  \r
                            });\r
                        }\r
                    });\r
                } else {\r
                    GUI.log(i18n.getMessage('targetPrefetchFailNonINAV'));\r
                    firmwareFlasherTab.closeTempConnection();\r
                }\r
            });\r
        });\r
    } else {\r
        GUI.log(i18n.getMessage('targetPrefetchFail') + i18n.getMessage('serialPortOpenFail'));\r
        return;\r
    }\r
};\r
\r
firmwareFlasherTab.onValidFirmware = function() {\r
    MSP.send_message(MSPCodes.MSP_BUILD_INFO, false, false, function () {\r
        MSP.send_message(MSPCodes.MSP_BOARD_INFO, false, false, function () {\r
            var boardSelect = $('select[name="board"]');\r
            boardSelect.val(FC.CONFIG.target);\r
\r
            GUI.log(i18n.getMessage('targetPrefetchsuccessful') + FC.CONFIG.target);\r
\r
            firmwareFlasherTab.closeTempConnection();\r
\r
            // Only trigger change if the board was actually found and selected\r
            if (boardSelect.val() === FC.CONFIG.target) {\r
                boardSelect.trigger('change');\r
            }\r
        });\r
    });\r
};\r
\r
firmwareFlasherTab.closeTempConnection = function() {\r
    timeout.killAll();\r
    interval.killAll(['global_data_refresh', 'msp-load-update', 'ltm-connection-check']);\r
\r
    mspQueue.flush();\r
    mspQueue.freeHardLock();\r
    mspQueue.freeSoftLock();\r
    mspDeduplicationQueue.flush();\r
    CONFIGURATOR.connection.emptyOutputBuffer();\r
\r
    CONFIGURATOR.connectionValid = false;\r
    GUI.connected_to = false;\r
\r
    CONFIGURATOR.connection.disconnect();\r
    MSP.disconnect_cleanup();\r
};\r
\r
export default firmwareFlasherTab;`;export{e as default};
