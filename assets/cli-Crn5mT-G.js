const n=`'use strict';\r
\r
import MSP from './../js/msp';\r
import mspQueue from './../js/serial_queue';\r
import GUI from './../js/gui';\r
import CONFIGURATOR from './../js/data_storage';\r
import timeout from './../js/timeouts';\r
import i18n from './../js/localization';\r
import { globalSettings } from './../js/globalSettings';\r
import CliAutoComplete from './../js/CliAutoComplete';\r
import { ConnectionType } from './../js/connection/connection';\r
import jBox from 'jbox';\r
import mspDeduplicationQueue from './../js/msp/mspDeduplicationQueue';\r
import FC from './../js/fc';\r
import { generateFilename } from './../js/helpers';\r
import dialog from '../js/dialog';\r
import {bridge, Platform} from '../js/bridge';\r
import interval from '../js/intervals';\r
\r
const cliTab = {};\r
\r
cliTab.lineDelayMs = 50;\r
cliTab.profileSwitchDelayMs = 100;\r
cliTab.outputHistory = "";\r
cliTab.cliBuffer = "";\r
cliTab.GUI = { snippetPreviewWindow: null };\r
\r
function removePromptHash(promptText) {\r
    return promptText.replace(/^# /, '');\r
}\r
\r
function cliBufferCharsToDelete(command, buffer) {\r
    var commonChars = 0;\r
    for (var i = 0;i < buffer.length;i++) {\r
        if (command[i] === buffer[i]) {\r
            commonChars++;\r
        } else {\r
            break;\r
        }\r
    }\r
\r
    return buffer.length - commonChars;\r
}\r
\r
function commandWithBackSpaces(command, buffer, noOfCharsToDelete) {\r
    const backspace = String.fromCharCode(127);\r
    return backspace.repeat(noOfCharsToDelete) + command.substring(buffer.length - noOfCharsToDelete, command.length);\r
}\r
\r
function getCliCommand(command, cliBuffer) {\r
    const buffer = removePromptHash(cliBuffer);\r
    const bufferRegex = new RegExp('^' + buffer, 'g');\r
    if (command.match(bufferRegex)) {\r
        return command.replace(bufferRegex, '');\r
    }\r
\r
    const noOfCharsToDelete = cliBufferCharsToDelete(command, buffer);\r
\r
    return commandWithBackSpaces(command, buffer, noOfCharsToDelete);\r
}\r
\r
function copyToClipboard(text) {\r
    function onCopySuccessful() {\r
        const button = $('.tab-cli .copy');\r
        const origText = button.text();\r
        const origWidth = button.css("width");\r
        button.text(i18n.getMessage("cliCopySuccessful"));\r
        button.css({\r
            width: origWidth,\r
            textAlign: "center",\r
        });\r
        setTimeout(() => {\r
            button.text(origText);\r
            button.css({\r
                width: "",\r
                textAlign: "",\r
            });\r
        }, 1500);\r
    }\r
\r
    function onCopyFailed(ex) {\r
        console.warn(ex);\r
    }\r
\r
    navigator.clipboard.writeText(text)\r
        .then(onCopySuccessful, onCopyFailed);\r
}\r
\r
cliTab.initialize = function (callback) {\r
    var self = this;\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    timeout.killAll();\r
    interval.killAll();\r
\r
    // Flush MSP queue as well as all MSP registered callbacks\r
    mspQueue.flush();\r
    mspDeduplicationQueue.flush();\r
    MSP.callbacks_cleanup();\r
\r
    self.outputHistory = "";\r
    self.cliBuffer = "";\r
\r
    const clipboardCopySupport = !!(navigator.clipboard?.writeText) || document.queryCommandSupported?.('copy');\r
\r
\r
    function executeCommands(out_string) {\r
        self.history.add(out_string.trim());\r
\r
        var outputArray = out_string.split("\\n");\r
        return outputArray.reduce((p, line, index) =>\r
            p.then((delay) =>\r
                new Promise((resolve) => {\r
                    timeout.add('CLI_send_slowly', () => {\r
                        let processingDelay = cliTab.lineDelayMs;\r
                        if (line.toLowerCase().includes('_profile')) {\r
                            processingDelay = cliTab.profileSwitchDelayMs;\r
                        }\r
                        const isLastCommand = outputArray.length === index + 1;\r
                        if (isLastCommand && cliTab.cliBuffer) {\r
                            line = getCliCommand(line, cliTab.cliBuffer);\r
                        }\r
                        cliTab.sendLine(line, () => {\r
                            resolve(processingDelay);\r
                        });\r
                    }, delay);\r
                })\r
            ), Promise.resolve(0),\r
        );\r
    }\r
    import('./cli.html?raw').then(({default: html}) => GUI.load(html, function () {\r
        // translate to user-selected language\r
       i18n.localize();\r
\r
        $('.cliDocsBtn').attr('href', globalSettings.docsTreeLocation + 'Settings.md');\r
\r
        CONFIGURATOR.cliActive = true;\r
\r
        var textarea = $('.tab-cli textarea[name="commands"]');\r
        CliAutoComplete.initialize(textarea, self.sendLine.bind(self), writeToOutput);\r
        $(CliAutoComplete).on('build:start', function() {\r
            textarea\r
                .val('')\r
                .attr('placeholder', i18n.getMessage('cliInputPlaceholderBuilding'))\r
                .prop('disabled', true);\r
        });\r
        $(CliAutoComplete).on('build:stop', function() {\r
            textarea\r
                .attr('placeholder', i18n.getMessage('cliInputPlaceholder'))\r
                .prop('disabled', false)\r
                .focus();\r
        });\r
\r
        $('.tab-cli .save').on('click', function () {\r
            var prefix = 'cli';\r
            var suffix = 'txt';\r
            var filename = generateFilename(FC.CONFIG, prefix, suffix);\r
            var options = {\r
                defaultPath: filename,\r
                filters: [\r
                    { name: suffix.toUpperCase(), extensions: [suffix] },\r
                    { name: prefix.toUpperCase(), extensions: [prefix] }\r
                ],\r
            };\r
            dialog.showSaveDialog(options).then(result => {\r
                if (result.canceled) {\r
                    GUI.log(i18n.getMessage('cliSaveToFileAborted'));\r
                    return;\r
                }\r
\r
                bridge.writeFile(result.filePath, self.outputHistory).then(err => {\r
                    if (err) {\r
                        GUI.log(i18n.getMessage('ErrorWritingFile'));\r
                        return console.error(err);\r
                    }    \r
                });\r
                GUI.log(i18n.getMessage('FileSaved'));\r
\r
            }).catch (err => {\r
                console.log(err);\r
            });\r
        });\r
\r
        $('.tab-cli .exit').on('click', function () {\r
            self.send(getCliCommand('exit\\n', cliTab.cliBuffer));\r
        });\r
\r
        $('.tab-cli .savecmd').on('click', function () {\r
            self.send(getCliCommand('save\\n', cliTab.cliBuffer));\r
        });\r
\r
        $('.tab-cli .msc').on('click', function () {\r
            self.send(getCliCommand('msc\\n', cliTab.cliBuffer));\r
        });\r
\r
        $('.tab-cli .diffall').on('click', function () {\r
            self.outputHistory = "";\r
            $('.tab-cli .window .wrapper').empty();\r
            self.send(getCliCommand('diff all\\n', cliTab.cliBuffer));\r
        });\r
\r
        $('.tab-cli .clear').on('click', function () {\r
            self.outputHistory = "";\r
            $('.tab-cli .window .wrapper').empty();\r
        });\r
\r
        if (clipboardCopySupport) {\r
            $('.tab-cli .copy').on('click', function () {\r
                copyToClipboard(self.outputHistory);\r
            });\r
        } else {\r
            $('.tab-cli .copy').hide();\r
        }\r
\r
        $('.tab-cli .load').on('click', function () {\r
            var options = {\r
                filters: [\r
                    { name: 'CLI/TXT', extensions: ['cli', 'txt'] },\r
                    { name: 'ALL', extensions: ['*'] }\r
                ],\r
            };\r
            dialog.showOpenDialog(options).then( result => {\r
                if (result.canceled) {\r
                    console.log('No file selected');\r
                    return;\r
                }\r
\r
                let previewArea = $("#snippetpreviewcontent textarea#preview");\r
\r
                function executeSnippet() {\r
                    const commands = previewArea.val();\r
                    executeCommands(commands);\r
                    self.GUI.snippetPreviewWindow.close();\r
                }\r
\r
                function previewCommands(result) {\r
                    if (!self.GUI.snippetPreviewWindow) {\r
                        self.GUI.snippetPreviewWindow = new jBox("Modal", {\r
                            id: "snippetPreviewWindow",\r
                            width: 'auto',\r
                            height: 'auto',\r
                            closeButton: 'title',\r
                            animation: false,\r
                            isolateScroll: false,\r
                            title: i18n.getMessage("cliConfirmSnippetDialogTitle"),\r
                            content: $('#snippetpreviewcontent'),\r
                            onCreated: () => $("#snippetpreviewcontent a.confirm").on('click', executeSnippet),\r
                        });\r
                    }\r
                    previewArea.val(result);\r
                    self.GUI.snippetPreviewWindow.open();\r
                }\r
\r
                if (result.files.length == 1) {\r
                    bridge.readFile(result.files[0]).then(response => {\r
                        if (response.error) {\r
                            GUI.log(i18n.getMessage('ErrorReadingFile'));\r
                            console.error(response.error);\r
                            return;                        }\r
\r
                        previewCommands(response.data);\r
                    });\r
                }\r
            }).catch (err => {\r
                console.log(err);\r
            });\r
        });\r
\r
        // Tab key detection must be on keydown,\r
        // \`keypress\`/\`keyup\` happens too late, as \`textarea\` will have already lost focus.\r
        textarea.on('keydown', function (event) {\r
            const tabKeyCode = 9;\r
            if (event.which == tabKeyCode) {\r
                // prevent default tabbing behaviour\r
                event.preventDefault();\r
                if (!CliAutoComplete.isEnabled()) {\r
                    const outString = textarea.val();\r
                    const lastCommand = outString.split("\\n").pop();\r
                    const command = getCliCommand(lastCommand, self.cliBuffer);\r
                    if (command) {\r
                        self.sendAutoComplete(command);\r
                        textarea.val('');\r
                    }\r
                }\r
                else if (!CliAutoComplete.isOpen() && !CliAutoComplete.isBuilding()) {\r
                    // force show autocomplete on Tab\r
                    CliAutoComplete.openLater(true);\r
                }\r
            }\r
        });\r
\r
        textarea.on('keypress', function (event) {\r
            const enterKeyCode = 13;\r
            if (event.which == enterKeyCode) {\r
                event.preventDefault(); // prevent the adding of new line\r
\r
                if (CliAutoComplete.isBuilding()) {\r
                    return; // silently ignore commands if autocomplete is still building\r
                }\r
\r
                var out_string = textarea.val();\r
                self.history.add(out_string.trim());\r
\r
                if (out_string.trim().toLowerCase() == "cls" || out_string.trim().toLowerCase() == "clear") {\r
                    self.outputHistory = "";\r
                    $('.tab-cli .window .wrapper').empty();\r
                } else {\r
                    executeCommands(out_string);\r
                }\r
\r
                textarea.val('');\r
            }\r
        });\r
\r
        textarea.on('keyup', function (event) {\r
            var keyUp = {38: true},\r
                keyDown = {40: true};\r
\r
                if (CliAutoComplete.isOpen()) {\r
                    return; // disable history keys if autocomplete is open\r
                }\r
\r
            if (event.keyCode in keyUp) {\r
                textarea.val(self.history.prev());\r
            }\r
\r
            if (event.keyCode in keyDown) {\r
                textarea.val(self.history.next());\r
            }\r
        });\r
\r
        // give input element user focus\r
        textarea.focus();\r
\r
        timeout.add('enter_cli', function enter_cli() {\r
            // Enter CLI mode\r
            var bufferOut = new ArrayBuffer(1);\r
            var bufView = new Uint8Array(bufferOut);\r
\r
            bufView[0] = 0x23; // #\r
\r
            CONFIGURATOR.connection.send(bufferOut);\r
        }, 250);\r
\r
        if (CONFIGURATOR.connection.type == ConnectionType.UDP) {\r
            CONFIGURATOR.connection.isCli = true;\r
        }\r
\r
        if (CONFIGURATOR.connection.type == ConnectionType.BLE) {\r
            let delay = CONFIGURATOR.connection.deviceDescription.delay;\r
            if (delay > 0) {\r
                timeout.add('cli_delay', () =>  {\r
                    self.send(getCliCommand("cli_delay " +  delay + '\\n', cliTab.cliBuffer));\r
                    self.send(getCliCommand('# ' + i18n.getMessage('connectionBleCliEnter') + '\\n', cliTab.cliBuffer));\r
                }, 400);\r
            }\r
        }\r
\r
        GUI.content_ready(callback);\r
    }));\r
};\r
\r
cliTab.history = {\r
    history: [],\r
    index:  0\r
};\r
\r
cliTab.history.add = function (str) {\r
    this.history.push(str);\r
    this.index = this.history.length;\r
};\r
\r
cliTab.history.prev = function () {\r
    if (this.index > 0) this.index -= 1;\r
    return this.history[this.index];\r
};\r
\r
cliTab.history.next = function () {\r
    if (this.index < this.history.length) this.index += 1;\r
    return this.history[this.index - 1];\r
};\r
\r
const backspaceCode = 8;\r
const lineFeedCode = 10;\r
const carriageReturnCode = 13;\r
\r
function writeToOutput(text) {\r
    $('.tab-cli .window .wrapper').append(text);\r
    $('.tab-cli .window').scrollTop($('.tab-cli .window .wrapper').height());\r
}\r
\r
function writeLineToOutput(text) {\r
    if (CliAutoComplete.isBuilding()) {\r
        CliAutoComplete.builderParseLine(text);\r
        return; // suppress output if in building state\r
    }\r
\r
    if (text.startsWith("### ERROR: ")) {\r
        writeToOutput('<span class="error_message">' + text + '</span><br>');\r
    } else {\r
        writeToOutput(text + "<br>");\r
    }\r
}\r
\r
function setPrompt(text) {\r
    $('.tab-cli textarea').val(text);\r
}\r
\r
cliTab.read = function (readInfo) {\r
    /*  Some info about handling line feeds and carriage return\r
\r
        line feed = LF = \\n = 0x0A = 10\r
        carriage return = CR = \\r = 0x0D = 13\r
\r
        MAC only understands CR\r
        Linux and Unix only understand LF\r
        Windows understands (both) CRLF\r
        Chrome OS currently unknown\r
    */\r
    var data = new Uint8Array(readInfo.data),\r
        validateText = "",\r
        sequenceCharsToSkip = 0;\r
\r
    for (var i = 0; i < data.length; i++) {\r
        const currentChar = String.fromCharCode(data[i]);\r
\r
        if (!CONFIGURATOR.cliValid) {\r
            // try to catch part of valid CLI enter message\r
            validateText += currentChar;\r
            writeToOutput(currentChar);\r
            continue;\r
        }\r
\r
        const escapeSequenceCode = 27;\r
        const escapeSequenceCharLength = 3;\r
        if (data[i] == escapeSequenceCode && !sequenceCharsToSkip) { // ESC + other\r
            sequenceCharsToSkip = escapeSequenceCharLength;\r
        }\r
\r
        if (sequenceCharsToSkip) {\r
            sequenceCharsToSkip--;\r
            continue;\r
        }\r
\r
        switch (data[i]) {\r
            case lineFeedCode:\r
                if (GUI.operating_system === "Windows") {\r
                    writeLineToOutput(this.cliBuffer);\r
                    this.cliBuffer = "";\r
                }\r
                break;\r
            case carriageReturnCode:\r
                if (GUI.operating_system !== "Windows") {\r
                    writeLineToOutput(this.cliBuffer);\r
                    this.cliBuffer = "";\r
                }\r
                break;\r
            case 60:\r
                this.cliBuffer += '&lt';\r
                break;\r
            case 62:\r
                this.cliBuffer += '&gt';\r
                break;\r
            case backspaceCode:\r
                this.cliBuffer = this.cliBuffer.slice(0, -1);\r
                break;\r
\r
            default:\r
                this.cliBuffer += currentChar;\r
        }\r
\r
        if (!CliAutoComplete.isBuilding()) {\r
            // do not include the building dialog into the history\r
            this.outputHistory += currentChar;\r
        }\r
\r
        if (this.cliBuffer == 'Rebooting') {\r
            CONFIGURATOR.cliActive = false;\r
            CONFIGURATOR.cliValid = false;\r
            GUI.log(i18n.getMessage('cliReboot'));\r
            GUI.log(i18n.getMessage('deviceRebooting'));\r
            GUI.handleReconnect();\r
        }\r
\r
    }\r
\r
    if (!CONFIGURATOR.cliValid && validateText.indexOf('CLI') !== -1) {\r
        GUI.log(i18n.getMessage('cliEnter'));\r
        CONFIGURATOR.cliValid = true;\r
\r
        if (CliAutoComplete.isEnabled() && !CliAutoComplete.isBuilding()) {\r
            // start building autoComplete\r
            CliAutoComplete.builderStart();\r
        }\r
    }\r
\r
    // fallback to native autocomplete\r
    if (!CliAutoComplete.isEnabled()) {\r
        setPrompt(removePromptHash(this.cliBuffer));\r
    }\r
\r
    setPrompt(removePromptHash(this.cliBuffer));\r
};\r
\r
cliTab.sendLine = function (line, callback) {\r
    this.send(line + '\\n', callback);\r
};\r
\r
cliTab.sendAutoComplete = function (line, callback) {\r
    this.send(line + '\\t', callback);\r
};\r
\r
cliTab.send = function (line, callback) {\r
    var bufferOut = new ArrayBuffer(line.length);\r
    var bufView = new Uint8Array(bufferOut);\r
\r
    for (var c_key = 0; c_key < line.length; c_key++) {\r
        bufView[c_key] = line.charCodeAt(c_key);\r
    }\r
\r
    CONFIGURATOR.connection.send(bufferOut, callback);\r
};\r
\r
cliTab.cleanup = function (callback) {\r
    if (!(CONFIGURATOR.connectionValid && CONFIGURATOR.cliValid && CONFIGURATOR.cliActive)) {\r
        if (callback) callback();\r
        return;\r
    }\r
    this.send(getCliCommand('exit\\r', this.cliBuffer), function (writeInfo) {\r
        // we could handle this "nicely", but this will do for now\r
        // (another approach is however much more complicated):\r
        // we can setup an interval asking for data lets say every 200ms, when data arrives, callback will be triggered and tab switched\r
        // we could probably implement this someday\r
        timeout.add('waiting_for_bootup', function waiting_for_bootup() {\r
            if (callback) callback();\r
        }, 1000); // if we dont allow enough time to reboot, CRC of "first" command sent will fail, keep an eye for this one\r
        CONFIGURATOR.cliActive = false;\r
\r
        CliAutoComplete.cleanup();\r
        $(CliAutoComplete).off();\r
    });\r
};\r
\r
export default cliTab;`;export{n as default};
