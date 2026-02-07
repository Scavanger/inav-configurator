const r=`'use strict'\r
\r
import smalltalk from 'smalltalk';\r
\r
import GUI from './../js/gui';\r
import i18n from './../js/localization';\r
import { SITLProcess, SitlSerialPortUtils } from './../js/sitl';\r
import dialog from './../js/dialog';\r
import {bridge, Platform} from './../js/bridge';\r
import SITLWebAssembly from '../js/web/SITL-Webassembly';\r
\r
const localhost = "127.0.0.1"\r
\r
const simulators = [\r
    {\r
        name: "X-Plane",\r
        port: 49001,\r
        isPortFixed: false,\r
        inputChannels: 4,\r
        fixedChanMap: ["Throttle", "Roll", "Pitch", "Yaw" ]\r
    },\r
    {\r
        name: "RealFlight",\r
        port: 18083,\r
        isPortFixed: true,\r
        inputChannels: 12,\r
        fixedChanMap: false\r
    }\r
];\r
\r
const stdProfiles = [\r
    {\r
        name: "[Standard] Configurator",\r
        sim: "X-Plane",\r
        eepromFileName: "standard-configurator.bin",\r
        isStdProfile: true,\r
        simEnabled: false,\r
        port: 49001,\r
        ip: "127.0.0.1",\r
        useImu: false,\r
        channelMap: [ 1, 15, 13, 16],\r
        useSerialReceiver: true,\r
        serialPort: "",\r
        serialUart: 3,\r
        serialProtocol: "SBus",\r
        baudRate: false,\r
        stopBits: false,\r
        parity: false\r
    },\r
    {\r
        name: "[Standard] X-Plane",\r
        sim: "X-Plane",\r
        eepromFileName: "standard-x-plane.bin",\r
        isStdProfile: true,\r
        simEnabled: true,\r
        port: 49001,\r
        ip: "127.0.0.1",\r
        useImu: false,\r
        channelMap: [ 1, 15, 13, 16],\r
        useSerialReceiver: true,\r
        serialPort: "",\r
        serialUart: 3,\r
        serialProtocol: "SBus",\r
        baudRate: false,\r
        stopBits: false,\r
        parity: false\r
    },\r
    {\r
        name: "[Standard] RealFlight Flying Wing",\r
        sim: "RealFlight",\r
        eepromFileName: "standard-realflight.bin",\r
        isStdProfile: true,\r
        simEnabled: true,\r
        port: 49001,\r
        ip: "127.0.0.1",\r
        useImu: false,\r
        channelMap: [ 1, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0],\r
        useSerialReceiver: true,\r
        serialPort: "",\r
        serialUart: 3,\r
        serialProtocol: "SBus",\r
        baudRate: false,\r
        stopBits: false,\r
        parity: false\r
    }\r
];\r
\r
var SITL_LOG = "";\r
\r
const sitlTab = {};\r
sitlTab.initialize = (callback) => {\r
 \r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    import('./sitl.html?raw').then(({default: html}) => GUI.load(html, function () {\r
        \r
        i18n.localize();\r
\r
        if (bridge.getPlatform() === Platform.Web) {\r
            $('#sitlWebAssemblyInfo').show();\r
            $('#wasmProxy').removeClass('is-hidden');\r
            $('#wasmProxyPort').removeClass('is-hidden');\r
            $('#eepromFiles').removeClass('is-hidden');\r
        }\r
    \r
        var currentSim, currentProfile, profiles, sitlWasmProxyEnabled, sitlWasmProxyPort;\r
        var mapping = new Array(28).fill(0);\r
        var serialProtocolls = SitlSerialPortUtils.getProtocolls();\r
        var sim_e = $('#simulator');\r
        var enableSim_e = $('#sitlEnableSim');\r
        var port_e = $('#simPort');\r
        var simIp_e = $('#simIP');\r
        var useImu_e = $('#sitlUseImu');\r
        var profiles_e = $('#sitlProfile');\r
        var profileSaveBtn_e = $('#sitlProfileSave');\r
        var profileNewBtn_e = $('#sitlProfileNew');\r
        var profileDeleteBtn_e = $('#sitlProfileDelete');\r
        var serialPorts_e = $('#sitlSerialPort');\r
        var serialReceiverEnable_e = $('#serialReceiverEnable');\r
        var serialUart_e = $('#sitlSerialUART');\r
        var protocollPreset_e = $('#serialProtocoll'); \r
        var baudRate_e = $('#sitlBaud');\r
        var stopBits_e = $('#serialStopbits');\r
        var parity_e = $('#serialParity');\r
        var wasmProxy_e = $('#sitlEnableWasmProxy');\r
        var wasmProxyPort_e = $('#sitlWasmProxyPort');\r
        \r
        if (bridge.getPlatform() === Platform.Electron) {\r
            if (SITLProcess.isRunning) {\r
                $('.sitlStart').addClass('disabled');\r
                $('.sitlStop').removeClass('disabled');\r
            } else {\r
                $('.sitlStop').addClass('disabled');\r
                $('.sitlStart').removeClass('disabled');\r
            }\r
        } else {\r
            if (SITLWebAssembly.isRunning()) {\r
                $('.sitlStart').addClass('disabled');\r
                $('.sitlStop').removeClass('disabled');\r
            } else {\r
                $('.sitlStop').addClass('disabled');\r
                $('.sitlStart').removeClass('disabled');\r
            }\r
             renderEepromFilesTable();\r
\r
        }\r
\r
        var $sitlLog = $('#sitlLog');\r
        $sitlLog.val(SITL_LOG);\r
        if ($sitlLog && $sitlLog.length == 1) {\r
            $sitlLog.val(SITL_LOG);\r
            $sitlLog.animate({scrollTop: $sitlLog[0].scrollHeight -  $sitlLog.height()}, 1);\r
        }\r
\r
        profiles = structuredClone(stdProfiles);\r
        const sitlProfiles = bridge.storeGet('sitlProfiles', false);\r
        if (sitlProfiles) {\r
            profiles.push(...sitlProfiles);\r
        }\r
        initElements(true);\r
\r
        sitlWasmProxyEnabled = bridge.storeGet('sitlWasmProxyEnabled', true);\r
        wasmProxy_e.prop('checked', sitlWasmProxyEnabled);\r
        wasmProxyPort_e.prop('disabled', !sitlWasmProxyEnabled);\r
        \r
\r
        sitlWasmProxyPort = bridge.storeGet('sitlWasmProxyPort', 8081);\r
        wasmProxyPort_e.val(sitlWasmProxyPort);\r
\r
        if (bridge.getPlatform() === Platform.Electron) {\r
            SitlSerialPortUtils.resetPortsList();\r
            SitlSerialPortUtils.pollSerialPorts(ports => {\r
                serialPorts_e.find('*').remove();\r
                ports.forEach(port => {\r
                    serialPorts_e.append(\`<option value="\${port}">\${port}</option>\`)\r
                });\r
\r
            });\r
        } else {\r
            $('#serialReceiver').hide();\r
        }\r
        \r
        enableSim_e.on('change', () => {\r
            currentProfile.simEnabled = enableSim_e.is(':checked');\r
            updateSim();\r
        });\r
\r
        sim_e.on('change', () => {     \r
            updateSim();\r
        });\r
        \r
        profiles_e.on('change', () => {\r
            updateCurrentProfile();\r
        });\r
\r
        port_e.on('change', () => {\r
            if (!currentSim.isPortFixed) {\r
                var port = parseInt(port_e.val());\r
                if (port != NaN)\r
                    currentProfile.port = parseInt(port_e.val());\r
            } \r
        });\r
\r
        simIp_e.on('change', () => {\r
            currentProfile.ip = simIp_e.val();\r
        });\r
\r
        useImu_e.on('change', () => {\r
            currentProfile.useImu = useImu_e.is(':checked');\r
        });\r
\r
        wasmProxy_e.on('change', () => {\r
            sitlWasmProxyEnabled = wasmProxy_e.is(':checked');\r
            bridge.storeSet('sitlWasmProxyEnabled', sitlWasmProxyEnabled);\r
            wasmProxyPort_e.prop('disabled', !sitlWasmProxyEnabled);\r
\r
        });\r
\r
        wasmProxyPort_e.on('change', () => {\r
            sitlWasmProxyPort = parseInt(wasmProxyPort_e.val());\r
            if (sitlWasmProxyPort != NaN) {\r
                bridge.storeSet('sitlWasmProxyPort', sitlWasmProxyPort);\r
            }\r
        });\r
\r
        $('.sitlStart').on('click', ()=> {\r
            $('.sitlStart').addClass('disabled');\r
            $('.sitlStop').removeClass('disabled');\r
            \r
            if (bridge.getPlatform() === Platform.Web) {\r
                $('.eepromActionButton').prop('disabled', true);\r
            }\r
   \r
            var sim, simPort, simIp, channelMap = "";\r
\r
            if (enableSim_e.is(':checked')) {\r
                switch(currentSim.name) {\r
                    case 'X-Plane':\r
                        sim = 'xp';\r
                        break;\r
                    case 'RealFlight':\r
                        sim = 'rf'\r
                        break;\r
                }\r
            }\r
\r
            if (port_e.val() !== "") {\r
                simPort = port_e.val();\r
            }\r
            \r
            if (simIp_e.val() !== "") {\r
                simIp = simIp_e.val();\r
            }\r
            \r
            const zeroPad = (num, places) => String(num).padStart(places, '0');\r
\r
            for (let i = 0; i < currentSim.inputChannels; i++) {\r
                var inavChan = mapping[i];\r
                if (inavChan == 0) {\r
                    continue;\r
                } else if (inavChan < 13) {\r
                    channelMap += \`M\${zeroPad(inavChan, 2)}-\${zeroPad(i + 1, 2)},\`;\r
                } else {\r
                    channelMap += \`S\${zeroPad(inavChan - 12, 2)}-\${zeroPad(i + 1, 2)},\`;\r
                }\r
            }\r
            channelMap = channelMap.substring(0, channelMap.length - 1);\r
            if (bridge.getPlatform() === Platform.Electron) {\r
                var serialOptions = null;\r
                if ( serialReceiverEnable_e.is(':checked') && !!serialPorts_e.val()) {\r
                    var selectedProtocoll = protocollPreset_e.find(':selected').val();\r
                    if (selectedProtocoll == "manual") {\r
                        serialOptions = {\r
                            protocollName: "manual",\r
                            baudRate: baudRate_e.val() || currentProfile.baudRate || "115200",\r
                            stopBits: stopBits_e.val() || currentProfile.stopBits || "One",\r
                            parity: parity_e.val() || currentProfile.parity || "None",\r
                            serialPort: serialPorts_e.val() || currentProfile.serialPort || "",\r
                            serialUart: serialUart_e.val() || currentProfile.serialUart || -1\r
                        }\r
                    } else {;\r
                        serialOptions = {\r
                            protocollName: selectedProtocoll || "SBus",\r
                            serialPort: serialPorts_e.val() || currentProfile.serialPort || "" ,\r
                            serialUart: serialUart_e.val() || currentProfile.serialUart || -1\r
                        }\r
                    }\r
                }\r
            }\r
\r
            appendLog("\\n");\r
            \r
            if (bridge.getPlatform() === Platform.Electron) {\r
                SITLProcess.start(currentProfile.eepromFileName, sim, useImu_e.is(':checked'), simIp, simPort, channelMap, serialOptions, result => {\r
                    appendLog(result);\r
                });\r
            } else {\r
                SITLWebAssembly.reset();\r
                SITLWebAssembly.start( \r
                    {\r
                        eepromFile: currentProfile.eepromFileName,\r
                        sim: sim,\r
                        useIMU: useImu_e.is(':checked'),\r
                        simIp: simIp,\r
                        simPort: simPort,\r
                        channelMap: channelMap,\r
                        proxyPort: sitlWasmProxyEnabled ? sitlWasmProxyPort : 0\r
                    },\r
                    (error, commandLineArgs) => {\r
                        if (error)\r
                            appendLog(error);\r
\r
                        appendLog(\`SITL started with args: \${commandLineArgs}\\n\`);\r
                    }\r
                );\r
\r
                setTimeout(() => {\r
                    renderEepromFilesTable();\r
                }, sitlWasmProxyEnabled ? 7500 : 2500);\r
            }\r
\r
        });\r
\r
        $('.sitlStop').on('click', ()=> {\r
               \r
            if (bridge.getPlatform() === Platform.Electron) {\r
                SITLProcess.stop();\r
            } else {\r
                try {\r
                    SITLWebAssembly.stop();\r
                } catch (e) {\r
                    appendLog(e.message);\r
                    return;\r
                }\r
            }\r
            \r
            $('.sitlStop').addClass('disabled');\r
            $('.sitlStart').removeClass('disabled');\r
\r
            $('.eepromActionButton').prop('disabled', false);\r
            \r
            appendLog(i18n.getMessage('sitlStopped'));\r
        });\r
\r
        profileSaveBtn_e.on('click', function () {\r
            saveProfiles();\r
        });\r
\r
        profileNewBtn_e.on('click', function () {\r
            smalltalk.prompt(i18n.getMessage('sitlNewProfile'), i18n.getMessage('sitlEnterName')).then(rawName => {\r
                const name = (rawName || '').trim();\r
                if (!name)\r
                    return;\r
\r
                if (profiles.find(e => e.name == name )) {\r
                    dialog.alert(i18n.getMessage('sitlProfileExists'));\r
                    return;\r
                }\r
                const safeText = $('<div>').text(name).html(); // escape\r
                const eepromName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.bin';;\r
                var profile = {\r
                        name: name,\r
                        sim: 'RealFlight',\r
                        isStdProfile: false,\r
                        simEnabled: false,\r
                        eepromFileName: eepromName,\r
                        port: 49001,\r
                        ip: '127.0.0.1',\r
                        useImu: false,\r
                        channelMap: [ 1, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0],\r
                        useSerialReceiver: true,\r
                        serialPort: serialPorts_e.val(),\r
                        serialUart: 3,\r
                        serialProtocol: 'SBus',\r
                        baudRate: false,\r
                        stopBits: false,\r
                        parity: false\r
                };\r
                profiles.push(profile);\r
                profiles_e.append(\`<option value="\${safeText}">\${safeText}</option>\`)\r
                profiles_e.val(name);\r
                updateCurrentProfile();\r
                saveProfiles();\r
            }).catch(() => {});\r
        });\r
\r
        profileDeleteBtn_e.on('click', function () {\r
\r
            if (currentProfile.isStdProfile) {\r
                dialog.alert(i18n.getMessage('sitlStdProfileCantDeleted'));            \r
                return;\r
            }\r
\r
            var selected = profiles_e.find(':selected').val();\r
            profiles = profiles.filter(profile => {\r
                return profile.name != selected;\r
            });\r
            \r
            SITLProcess.deleteEepromFile(currentProfile.eepromFileName);\r
            profiles_e.find('*').remove();\r
            \r
            initElements(false);\r
        });\r
\r
        serialReceiverEnable_e.on('change', () => {\r
        currentProfile.useSerialReceiver = serialReceiverEnable_e.is(':checked');\r
        });\r
\r
        protocollPreset_e.on('change', () => {\r
            var selectedProtocoll = protocollPreset_e.find(':selected').val();\r
            \r
            var protocoll = serialProtocolls.find(protocoll => {\r
                return protocoll.name == selectedProtocoll;\r
            });\r
\r
            if (selectedProtocoll != 'manual'){  \r
                baudRate_e.prop('disabled', true);\r
                baudRate_e.val(protocoll.baudRate);\r
                stopBits_e.prop('disabled', true);\r
                stopBits_e.val(protocoll.stopBits);\r
                parity_e.prop('disabled', true);\r
                parity_e.val(protocoll.parity);\r
                serialUart_e.prop('disabled', selectedProtocoll == "Flight Controller Proxy");\r
            } else {\r
                baudRate_e.prop('disabled', false);\r
                stopBits_e.prop('disabled', false);\r
                parity_e.prop('disabled', false);\r
                serialUart_e.prop('disabled', false);\r
            }\r
\r
            currentProfile.serialProtocol = selectedProtocoll;\r
        });\r
\r
        serialPorts_e.on('change', () => {\r
            currentProfile.serialPort = serialPorts_e.val();\r
        });\r
\r
        serialUart_e.on('change', () => {\r
            currentProfile.serialUart = parseInt(serialUart_e.val());\r
        });\r
\r
        baudRate_e.on('change', () => {\r
            var baud = parseInt(baudRate_e.val());\r
            if (baud != NaN)\r
                currentProfile.baudRate = baud\r
        });\r
\r
        stopBits_e.on('change', () => {\r
            currentProfile.stopBits = stopBits_e.val();\r
        });\r
\r
        parity_e.on('change', () => {\r
            currentProfile.parity = parity_e.val();\r
            });\r
        \r
        if (bridge.getPlatform() === Platform.Electron) {\r
            window.electronAPI.onChildProcessStdout(data => {\r
                appendLog(data);\r
            });\r
\r
            window.electronAPI.onChildProcessStderr(data => {\r
                appendLog(data);\r
            });\r
\r
            window.electronAPI.onChildProcessError(error => {\r
                SITLProcess.stop();\r
                appendLog(error);\r
            });\r
        } else {\r
\r
            SITLWebAssembly.onPrint((data) => {\r
                appendLog(data);\r
            });\r
\r
            SITLWebAssembly.onPrintErr((data) => {\r
                appendLog(data);\r
            });\r
        }\r
\r
        function initElements(init)\r
        {\r
            profiles.forEach(profile => {\r
                profiles_e.append(\`<option value="\${profile.name}">\${profile.name}</option>\`)\r
            });\r
\r
            if (init) {\r
                simulators.forEach(simulator => {\r
                    sim_e.append(\`<option value="\${simulator.name}">\${simulator.name}</option>\`)       \r
                });\r
\r
                protocollPreset_e.append('<option value="manual">Manual</option>');\r
                serialProtocolls.forEach(protocoll => {\r
                    protocollPreset_e.append(\`<option value="\${protocoll.name}">\${protocoll.name}</option>\`);\r
                });\r
\r
                const sitlLastProfile = bridge.storeGet('sitlLastProfile', false);\r
                if (sitlLastProfile) {    \r
                    var element = profiles.find(profile => {\r
                        return profile.name == sitlLastProfile;\r
                    });\r
\r
                    if (element)\r
                        profiles_e.val(element.name).trigger('change');\r
                }\r
            }\r
            \r
            updateCurrentProfile();\r
        }\r
\r
        function saveProfiles() {\r
            if (currentProfile.isStdProfile) {\r
                dialog.alert(i18n.getMessage('sitlStdProfileCantOverwritten'));\r
                return;\r
            }        \r
            var profilesToSave = [];\r
            profiles.forEach(profile => {\r
                if (!profile.isStdProfile)\r
                    profilesToSave.push(profile);\r
            });\r
\r
            bridge.storeSet('sitlProfiles', profilesToSave);\r
        \r
        }\r
\r
        function updateSim() {\r
            simulators.forEach(simulator => {\r
                if (simulator.name == sim_e.find(':selected').text()) {         \r
                    currentSim = simulator;\r
                    //currentProfile.sim = currentSim.name;\r
                    if (currentSim.isPortFixed) {\r
                    port_e.val(currentSim.port).trigger('change');\r
                    } else {\r
                        port_e.val(currentProfile.port);\r
                    }\r
                    currentProfile.sim = currentSim.name;\r
                    sim_e.prop('disabled', !currentProfile.simEnabled);\r
                    simIp_e.prop('disabled', !currentProfile.simEnabled);\r
                    port_e.prop('disabled', simulator.isPortFixed || !currentProfile.simEnabled);\r
                    useImu_e.prop('disabled', !currentProfile.simEnabled);\r
                    \r
                    renderChanMapTable();\r
                    return;\r
                }\r
            });\r
        }\r
\r
        function updateCurrentProfile() {\r
            var selected = profiles_e.find(':selected').val(); \r
            var selectedIndex = profiles.findIndex(element => {     \r
                return element.name == selected;\r
            });\r
            currentProfile = profiles[selectedIndex];\r
            \r
            protocollPreset_e.val(currentProfile.serialProtocol);\r
            if (currentProfile.serialProtocol == "manual")\r
            {\r
                baudRate_e.val(currentProfile.baudRate);\r
                baudRate_e.prop('disabled', false);\r
                stopBits_e.val(currentProfile.stopBits);\r
                stopBits_e.prop('disabled', false);\r
                parity_e.val(currentProfile.parity);\r
                parity_e.prop('disabled', false);\r
                serialUart_e.prop('disabled', false);\r
            } else {      \r
                var protocoll = serialProtocolls.find(protocoll => {\r
                    return protocoll.name == currentProfile.serialProtocol;\r
                });\r
                baudRate_e.prop('disabled', true);\r
                baudRate_e.val(protocoll.baudRate);\r
                stopBits_e.prop('disabled', true);\r
                stopBits_e.val(protocoll.stopBits);\r
                parity_e.prop('disabled', true);\r
                parity_e.val(protocoll.parity);   \r
                serialUart_e.prop('disabled', currentProfile.serialProtocol == "Flight Controller Proxy");\r
            }\r
            \r
            if (currentProfile.serialPort != "")\r
                serialPorts_e.val(currentProfile.serialPort);\r
            \r
            enableSim_e.prop('checked', currentProfile.simEnabled).trigger('change');\r
            serialReceiverEnable_e.prop('checked', currentProfile.useSerialReceiver).trigger('change');\r
            serialUart_e.val(currentProfile.serialUart);\r
            mapping = currentProfile.channelMap;\r
            sim_e.val(currentProfile.sim);\r
            updateSim();\r
            simIp_e.val(currentProfile.ip).trigger('change'); \r
            useImu_e.prop('checked', currentProfile.useImu).trigger('change');\r
\r
            bridge.storeSet('sitlLastProfile', selected);\r
        }\r
\r
        function renderChanMapTable() \r
        {\r
            var mapTableBody = $('.mapTableBody');\r
            mapTableBody.find('*').remove();\r
            for (let i = 0; i < currentSim.inputChannels; i++) {\r
            \r
                var output;\r
                if (currentSim.fixedChanMap) {\r
                    output = currentSim.fixedChanMap[i];\r
                } else {\r
                    output = i + 1;\r
                }\r
                \r
                mapTableBody.append("<tr><td>" + output + "</td><td><select data-out=\\"" + i + "\\" class=\\"inavChannel\\"\\"></select></td></td>");\r
                const row = mapTableBody.find('tr:last');\r
                GUI.fillSelect(row.find(".inavChannel"), getInavChannels(), mapping[i]);\r
\r
                row.find(".inavChannel").val(mapping[i]).on('change', (sender) => {\r
                    mapping[$(sender.target).data('out')] = parseInt($(sender.target).val());\r
                    bridge.storeSet('sitlMapping', mapping);\r
                });\r
            }\r
        }\r
\r
        async function renderEepromFilesTable()\r
        {\r
            var eepromFilesBody = $('.eepromFilesTableBody');\r
            eepromFilesBody.find('*').remove();\r
\r
            const dirHandle = await navigator.storage.getDirectory();\r
            const files = dirHandle.values();\r
            for await (const handle of files) {\r
                if (handle.kind === 'file' && handle.name.endsWith('.bin')) {\r
                    const row = \`<tr><td>\${handle.name}</td>\r
                                 <td>\r
                                    <button title="\${i18n.getMessage('sitlDeleteEeprom')}" class="button eepromActionButton deleteEepromFileBtn" data-filename="\${handle.name}">🗑️</button> \r
                                    <button title="\${i18n.getMessage('sitlDownloadEeprom')}" class="button eepromActionButton downloadEepromFileBtn" data-filename="\${handle.name}">⬇️</button>\r
                                 </td></tr>\`;\r
                    eepromFilesBody.append(row);\r
                }\r
            }\r
\r
            if (SITLWebAssembly.isRunning()) {\r
                $('.eepromActionButton').prop('disabled', true);\r
            } else {\r
                $('.eepromActionButton').prop('disabled', false);\r
            }\r
\r
        $('.downloadEepromFileBtn').on('click', async (event) => {\r
            const filename = $(event.currentTarget).data('filename');\r
            const dirHandle = await navigator.storage.getDirectory();\r
            try {\r
                const fileHandle = await dirHandle.getFileHandle(filename);\r
                const file = await fileHandle.getFile();\r
                const arrayBuffer = await file.arrayBuffer();\r
                bridge.writeFile(filename, new Uint8Array(arrayBuffer), true);\r
                appendLog(\`EEPROM file '\${filename}' downloaded.\\n\`);\r
            } catch (e) {\r
                appendLog(\`Failed to download EEPROM file '\${filename}': \${e.message}\\n\`);\r
            }\r
        });\r
\r
        $('.deleteEepromFileBtn').on('click', async (event) => {\r
            const filename = $(event.currentTarget).data('filename');\r
            const dirHandle = await navigator.storage.getDirectory();\r
            try {\r
                await dirHandle.removeEntry(filename);\r
                appendLog(\`EEPROM file '\${filename}' deleted.\\n\`);\r
                renderEepromFilesTable();\r
            } catch (e) {\r
                appendLog(\`Failed to delete EEPROM file '\${filename}': \${e.message}\\n\`);\r
            }\r
        });\r
        }\r
\r
        function getInavChannels() {\r
            var channels = [];\r
            for (var i = 0; i <= 12; i++) {\r
                if (i == 0)\r
                    channels.push("None");\r
                else\r
                    channels.push("Motor " + i);\r
            }\r
\r
            for (var i = 1; i <= 16; i++) {\r
                if (i == 0)\r
                    channels.push("None");\r
                else    \r
                    channels.push("Servo " + i);\r
            }\r
            return channels;\r
        }\r
\r
        function appendLog(message){\r
            SITL_LOG += message;\r
            var $sitlLog = $('#sitlLog');\r
            if ($sitlLog && $sitlLog.length == 1) {\r
                $sitlLog.val(SITL_LOG);\r
                $sitlLog.animate({scrollTop: $sitlLog[0].scrollHeight -  $sitlLog.height()}, 1);\r
            }\r
        }\r
\r
        GUI.content_ready(callback);\r
    }));  \r
};\r
\r
sitlTab.cleanup = (callback) => {\r
    SitlSerialPortUtils.stopPollSerialPorts();\r
    if (callback) \r
        callback();\r
};\r
\r
export default sitlTab;\r
`;export{r as default};
