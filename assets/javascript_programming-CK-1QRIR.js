const n=`/**\r
 * INAV JavaScript Programming Tab\r
 *\r
 * Integrates Monaco Editor with INAV transpiler and MSP communication.\r
 */\r
\r
'use strict';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer.js';\r
import mspHelper from './../js/msp/MSPHelper.js';\r
import GUI from './../js/gui.js';\r
import FC from './../js/fc.js';\r
import i18n from './../js/localization.js';\r
import { Transpiler } from './../js/transpiler/index.js';\r
import { Decompiler } from './../js/transpiler/transpiler/decompiler.js';\r
import * as MonacoLoader from './../js/transpiler/editor/monaco_loader.js';\r
import examples from './../js/transpiler/examples/index.js';\r
import settingsCache from './../js/settingsCache.js';\r
import * as monaco from 'monaco-editor';\r
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'\r
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'\r
\r
self.MonacoEnvironment = {\r
  getWorker(_, label) {\r
    if (label === 'typescript' || label === 'javascript') {\r
      return new tsWorker()\r
    }\r
    return new editorWorker()\r
  }\r
}\r
\r
const javascriptProgrammingTab = {\r
\r
    currentProgrammingPIDProfile: null,\r
    isDirty: false,\r
    editor: null,\r
    transpiler: null,\r
    decompiler: null,\r
    currentCode: '',\r
\r
    analyticsChanges: {},\r
\r
    initialize: function (callback) {\r
        const self = this;\r
\r
        if (GUI.active_tab !== this) {\r
            GUI.active_tab = this;\r
        }\r
\r
        import('./javascript_programming.html?raw').then(({default: html}) => {\r
            GUI.load(html, () => {\r
                try {\r
                    self.initTranspiler();\r
\r
                    // Initialize editor with INAV configuration\r
                    self.editor = MonacoLoader.initializeMonacoEditor(monaco, 'monaco-editor');\r
\r
                    // Add INAV type definitions\r
                    MonacoLoader.addINAVTypeDefinitions(monaco);\r
\r
                    // Set up linting\r
                    MonacoLoader.setupLinting(self.editor, function() {\r
                        if (self.lintCode) {\r
                            self.lintCode();\r
                        }\r
                    });\r
\r
                    // Continue with initialization\r
                    self.setupEventHandlers();\r
                    self.loadExamples();\r
\r
                    self.loadFromFC(function() {\r
                        self.isDirty = false;\r
\r
                        // Set up dirty tracking AFTER initial load to avoid marking as dirty during decompilation\r
                        self.editor.onDidChangeModelContent(function() {\r
                            if (!self.isDirty) {\r
                                console.log('[JavaScript Programming] Editor marked as dirty (unsaved changes)');\r
                            }\r
                            self.isDirty = true;\r
                        });\r
\r
                        // Localize i18n strings\r
                        i18n.localize();\r
\r
                        GUI.content_ready(callback);\r
                    }); \r
                } catch (error) {\r
                    console.error('Failed to load Monaco Editor:', error);\r
                    // Localize i18n strings even on error\r
                    i18n.localize();\r
                    GUI.content_ready(callback);\r
                }\r
\r
            });\r
        });\r
    },\r
\r
    /**\r
     * Initialize transpiler and decompiler\r
     */\r
    initTranspiler: function() {\r
        if (typeof Transpiler !== 'undefined') {\r
            this.transpiler = new Transpiler();\r
        } else {\r
            console.error('Transpiler not loaded');\r
            GUI.log(i18n.getMessage('transpilerNotAvailable') || 'JavaScript transpiler not available');\r
        }\r
\r
        if (typeof Decompiler !== 'undefined') {\r
            this.decompiler = new Decompiler();\r
        } else {\r
            console.error('Decompiler not loaded');\r
            GUI.log(i18n.getMessage('decompilerNotAvailable') || 'JavaScript decompiler not available');\r
        }\r
    },\r
\r
    /**\r
     * Get default starter code\r
     */\r
    getDefaultCode: function() {\r
    return \`// INAV JavaScript Programming\r
// Write JavaScript, get INAV logic conditions!\r
\r
// Example: Increase VTX power when far from home\r
if (inav.flight.homeDistance > 100) {\r
  inav.override.vtx.power = 3;\r
}\r
\r
// Add your code here...\r
\`;\r
    },\r
\r
    /**\r
     * Set up UI event handlers\r
     */\r
    setupEventHandlers: function() {\r
        const self = this;\r
\r
        // Transpile button\r
        $('.tab-programming .transpile').click(function() {\r
            self.transpileCode();\r
        });\r
\r
        // Load from FC button\r
        $('.tab-programming .load').click(function() {\r
            self.loadFromFC();\r
        });\r
\r
        // Save to FC button\r
        $('.tab-programming .save').click(function() {\r
            self.saveToFC();\r
        });\r
\r
        // Clear button\r
        $('.tab-programming .clear').click(function() {\r
            if (confirm('Clear editor? This cannot be undone.')) {\r
                self.editor.setValue(self.getDefaultCode());\r
                self.isDirty = false;\r
            }\r
        });\r
\r
        // Example selector - bind to the actual select element, not the container div\r
        $('#examples-select').change(function() {\r
            const exampleId = $(this).val();\r
            if (exampleId) {\r
                self.loadExample(exampleId);\r
                $(this).val(''); // Reset selector\r
            }\r
        });\r
\r
        // API Reference toggle\r
        $('#api-reference-toggle').click(function(e) {\r
            e.preventDefault();\r
            const content = $('#api-reference-content');\r
            const toggle = $(this);\r
\r
            if (content.is(':visible')) {\r
                content.slideUp();\r
                toggle.text('▶ API Reference & Examples');\r
            } else {\r
                content.slideDown();\r
                toggle.text('▼ API Reference & Examples');\r
            }\r
        });\r
    },\r
\r
    /*\r
    **\r
     * Load a specific example into the editor\r
     * @param {string} exampleId - The ID of the example to load\r
     */\r
    loadExample: function(exampleId) {\r
        const self = this;\r
\r
        try {\r
            // examples imported at top\r
            if (!examples[exampleId]) {\r
                console.error('Example not found:', exampleId);\r
                return;\r
            }\r
\r
            // Check for unsaved changes before loading example\r
            if (self.isDirty) {\r
                const confirmMsg = i18n.getMessage('loadExampleConfirm') ||\r
                    'You have unsaved changes. Load example anyway?';\r
                if (!confirm(confirmMsg)) {\r
                    return; // User cancelled\r
                }\r
            }\r
\r
            const example = examples[exampleId];\r
\r
            // Set the code in the editor\r
            if (self.editor && self.editor.setValue) {\r
                self.editor.setValue(example.code);\r
                console.log('Loaded example:', example.name);\r
            } else {\r
                console.error('Editor not initialized');\r
            }\r
\r
            // Mark as dirty since we changed the code\r
            self.isDirty = true;\r
\r
        } catch (error) {\r
            console.error('Failed to load example:', error);\r
        }\r
    },\r
\r
    /**\r
     * Load and populate the examples dropdown\r
     */\r
    loadExamples: function() {\r
        const self = this;\r
\r
        try {\r
            // examples imported at top\r
            const $examplesSelect = $('#examples-select');\r
\r
            if (!$examplesSelect.length) {\r
                console.warn('Examples dropdown not found');\r
                return;\r
            }\r
\r
            // Clear existing options\r
            $examplesSelect.empty();\r
\r
            // Add default option\r
            $examplesSelect.append('<option value="">-- Select Example --</option>');\r
\r
            // Group examples by category\r
            const categories = {};\r
            for (const [id, example] of Object.entries(examples)) {\r
                const category = example.category || 'Other';\r
                if (!categories[category]) {\r
                    categories[category] = [];\r
                }\r
                categories[category].push({ id, ...example });\r
            }\r
\r
            // Add examples grouped by category\r
            for (const [category, exampleList] of Object.entries(categories)) {\r
                const $optgroup = $('<optgroup>').attr('label', category);\r
\r
                for (const example of exampleList) {\r
                    $optgroup.append(\r
                        $('<option>')\r
                            .attr('value', example.id)\r
                            .text(example.name)\r
                            .attr('title', example.description)\r
                    );\r
                }\r
\r
                $examplesSelect.append($optgroup);\r
            }\r
\r
            // Set up change handler\r
            $examplesSelect.off('change').on('change', function() {\r
                const exampleId = $(this).val();\r
                if (exampleId) {\r
                    self.loadExample(exampleId);\r
                }\r
            });\r
\r
            console.log('Examples dropdown populated with', Object.keys(examples).length, 'examples');\r
\r
        } catch (error) {\r
            console.error('Failed to load examples:', error);\r
        }\r
    },\r
\r
\r
    /**\r
     * Transpile JavaScript to INAV logic conditions\r
     */\r
    transpileCode: function() {\r
        const self = this;\r
        const code = this.editor.getValue();\r
\r
        if (!this.transpiler) {\r
            GUI.log(i18n.getMessage('transpilerNotAvailable') || 'Transpiler not available');\r
            return;\r
        }\r
\r
        GUI.log(i18n.getMessage('transpiling') || 'Transpiling JavaScript...');\r
\r
        try {\r
            const result = this.transpiler.transpile(code);\r
\r
            if (result.success) {\r
                // Display output\r
                const formattedOutput = this.transpiler.formatOutput(\r
                    result.commands,\r
                    result.warnings,\r
                    result.optimizations\r
                );\r
                $('#transpiler-output').val(formattedOutput);\r
\r
                // Update LC count\r
                this.updateLCCount(result.logicConditionCount);\r
\r
                // Show optimization stats\r
                if (result.optimizations && result.optimizations.total > 0) {\r
                    $('#optimization-details').text(result.optimizations.report);\r
                    $('#optimization-stats').show();\r
                } else {\r
                    $('#optimization-stats').hide();\r
                }\r
\r
                // Show warnings if any\r
                if (result.warnings && (result.warnings.errors.length > 0 ||\r
                    result.warnings.warnings.length > 0)) {\r
                    this.showWarnings(result.warnings);\r
                } else {\r
                    $('#transpiler-warnings').hide();\r
                }\r
\r
                GUI.log(\`Transpiled successfully: \${result.logicConditionCount}/64 logic conditions\`);\r
\r
            } else {\r
                // Show error\r
                this.showError(result.error);\r
                GUI.log('Transpilation failed: ' + result.error);\r
            }\r
\r
        } catch (error) {\r
            this.showError(error.message);\r
            console.error('Transpilation error:', error);\r
        }\r
    },\r
\r
    /**\r
     * Update LC count display\r
     */\r
    updateLCCount: function(count) {\r
        const el = $('#lc-count');\r
        el.text(\`\${count}/64 LCs\`);\r
\r
        // Color code based on usage\r
        el.removeClass('warning error');\r
        if (count > 64) {\r
            el.addClass('error');\r
        } else if (count > 50) {\r
            el.addClass('warning');\r
        }\r
    },\r
\r
    /**\r
     * Show transpilation error\r
     */\r
    showError: function(message) {\r
        const warningsDiv = $('#transpiler-warnings');\r
        warningsDiv.html(\`\r
            <div class="note error">\r
                <div class="note_spacer">\r
                    <strong>Transpilation Error:</strong><br>\r
                    \${this.escapeHtml(message)}\r
                </div>\r
            </div>\r
        \`);\r
        warningsDiv.show();\r
    },\r
\r
    /**\r
     * Show transpilation/decompilation warnings\r
     */\r
    showWarnings: function(warnings) {\r
        const warningsDiv = $('#transpiler-warnings');\r
        let html = '';\r
\r
        if (warnings.errors && warnings.errors.length > 0) {\r
            html += '<div class="note error"><div class="note_spacer">';\r
            html += '<strong>Errors:</strong><ul style="margin: 5px 0; padding-left: 20px;">';\r
            warnings.errors.forEach(w => {\r
                html += \`<li>\${this.escapeHtml(w.message)} \${w.line ? \`(line \${w.line})\` : ''}</li>\`;\r
            });\r
            html += '</ul></div></div>';\r
        }\r
\r
        if (warnings.warnings && warnings.warnings.length > 0) {\r
            html += '<div class="note warning"><div class="note_spacer">';\r
            html += '<strong>Warnings:</strong><ul style="margin: 5px 0; padding-left: 20px;">';\r
            warnings.warnings.forEach(w => {\r
                html += \`<li>\${this.escapeHtml(w.message)} \${w.line ? \`(line \${w.line})\` : ''}</li>\`;\r
            });\r
            html += '</ul></div></div>';\r
        }\r
\r
        warningsDiv.html(html);\r
        warningsDiv.show();\r
    },\r
\r
    /**\r
     * Show decompiler warnings\r
     */\r
    showDecompilerWarnings: function(warnings) {\r
        const warningsDiv = $('#transpiler-warnings');\r
\r
        let html = '<div class="note warning"><div class="note_spacer">';\r
        html += '<strong>Decompilation Warnings:</strong><br>';\r
        html += '<ul style="margin: 5px 0; padding-left: 20px;">';\r
\r
        for (const warning of warnings) {\r
            html += \`<li>\${this.escapeHtml(warning)}</li>\`;\r
        }\r
\r
        html += '</ul>';\r
        html += '<p style="margin-top: 10px;"><em>Please review the generated code carefully and test before using.</em></p>';\r
        html += '</div></div>';\r
\r
        warningsDiv.html(html);\r
        warningsDiv.show();\r
    },\r
\r
    /**\r
     * Escape HTML to prevent XSS\r
     */\r
    escapeHtml: function(text) {\r
        const div = document.createElement('div');\r
        div.textContent = text;\r
        return div.innerHTML;\r
    },\r
\r
    /**\r
     * Load logic conditions from FC and decompile to JavaScript\r
     * Uses MSP chaining pattern from programming.js\r
     */\r
    loadFromFC: function(callback) {\r
        const self = this;\r
\r
        if (!this.decompiler) {\r
            GUI.log(i18n.getMessage('decompilerNotAvailable') || 'Decompiler not available');\r
            if (callback) callback();\r
            return;\r
        }\r
\r
        GUI.log(i18n.getMessage('loadingFromFC') || 'Loading logic conditions from flight controller...');\r
\r
        // Create MSP chainer for loading logic conditions\r
        const loadChainer = new MSPChainerClass();\r
\r
        loadChainer.setChain([\r
            mspHelper.loadLogicConditions\r
        ]);\r
\r
        loadChainer.setExitPoint(function() {\r
            self.onLogicConditionsLoaded(callback);\r
        });\r
\r
        loadChainer.execute();\r
    },\r
\r
    /**\r
     * Called after logic conditions are loaded from FC\r
     */\r
    onLogicConditionsLoaded: function(callback) {\r
        const self = this;\r
\r
        // Get logic conditions from FC object\r
        const logicConditions = self.getLogicConditionsArray();\r
\r
        if (!logicConditions || logicConditions.length === 0) {\r
            GUI.log(i18n.getMessage('noLogicConditions') || 'No logic conditions found on FC');\r
            self.editor.setValue(self.getDefaultCode());\r
            self.isDirty = false;\r
            if (callback) callback();\r
            return;\r
        }\r
\r
        GUI.log(\`Found \${logicConditions.length} logic conditions, decompiling...\`);\r
\r
        // Track which slots were occupied before we modify them\r
        // This is used when saving to clear stale conditions\r
        self.previouslyOccupiedSlots = new Set();\r
        const conditions = FC.LOGIC_CONDITIONS.get();\r
        for (let i = 0; i < conditions.length; i++) {\r
            if (conditions[i].getEnabled() !== 0) {\r
                self.previouslyOccupiedSlots.add(i);\r
            }\r
        }\r
\r
        // Retrieve variable map for name preservation\r
        const variableMap = settingsCache.get('javascript_variables') || {\r
            let_variables: {},\r
            var_variables: {}\r
        };\r
        console.log('Variable map retrieved:', variableMap);\r
\r
        // Decompile to JavaScript\r
        try {\r
            const result = self.decompiler.decompile(logicConditions, variableMap);\r
\r
            if (result.success) {\r
                // Set the decompiled code\r
                self.editor.setValue(result.code);\r
\r
                // Show stats\r
                if (result.stats) {\r
                    GUI.log(\r
                        \`Decompiled \${result.stats.enabled}/\${result.stats.total} \` +\r
                        \`logic conditions into \${result.stats.groups} handler(s)\`\r
                    );\r
                }\r
\r
                // Show warnings if any\r
                if (result.warnings && result.warnings.length > 0) {\r
                    self.showDecompilerWarnings(result.warnings);\r
                } else {\r
                    $('#transpiler-warnings').hide();\r
                }\r
\r
                self.isDirty = false;\r
            } else {\r
                // Decompilation failed\r
                GUI.log('Decompilation failed: ' + result.error);\r
                self.showError('Decompilation failed: ' + result.error);\r
                self.editor.setValue(result.code || self.getDefaultCode());\r
                self.isDirty = false;\r
            }\r
\r
        } catch (error) {\r
            console.error('Decompilation error:', error);\r
            GUI.log('Decompilation error: ' + error.message);\r
            self.showError('Decompilation error: ' + error.message);\r
            self.editor.setValue(self.getDefaultCode());\r
            self.isDirty = false;\r
        }\r
\r
        if (callback) callback();\r
    },\r
\r
    /**\r
     * Get logic conditions array from FC.LOGIC_CONDITIONS\r
     */\r
    getLogicConditionsArray: function() {\r
        const conditions = [];\r
\r
        // FC.LOGIC_CONDITIONS stores logic conditions\r
        if (!FC.LOGIC_CONDITIONS || !FC.LOGIC_CONDITIONS.get) {\r
            console.error('FC.LOGIC_CONDITIONS not available');\r
            return conditions;\r
        }\r
\r
        // Get count of logic conditions\r
        const count = FC.LOGIC_CONDITIONS.getCount ?\r
            FC.LOGIC_CONDITIONS.getCount() : 64; // Max 64 logic conditions\r
\r
        for (let i = 0; i < count; i++) {\r
            const lc = FC.LOGIC_CONDITIONS.get()[i];\r
            if (lc) {\r
                conditions.push({\r
                    index: i,\r
                    enabled: lc.getEnabled(),\r
                    activatorId: lc.getActivatorId(),\r
                    operation: lc.getOperation(),\r
                    operandAType: lc.getOperandAType(),\r
                    operandAValue: lc.getOperandAValue(),\r
                    operandBType: lc.getOperandBType(),\r
                    operandBValue: lc.getOperandBValue(),\r
                    flags: lc.getFlags()\r
                });\r
            }\r
        }\r
\r
        return conditions;\r
    },\r
\r
    /**\r
     * Save transpiled logic conditions to FC\r
     * Uses MSP chaining pattern from programming.js\r
     */\r
    saveToFC: function() {\r
        const self = this;\r
        const code = this.editor.getValue();\r
\r
        if (!this.transpiler) {\r
            GUI.log(i18n.getMessage('transpilerNotAvailable') || 'Transpiler not available');\r
            return;\r
        }\r
\r
        // First transpile\r
        GUI.log(i18n.getMessage('transpilingBeforeSave') || 'Transpiling before save...');\r
        const result = this.transpiler.transpile(code);\r
\r
        if (!result.success) {\r
            this.showError('Cannot save: Transpilation failed - ' + result.error);\r
            return;\r
        }\r
\r
        if (result.logicConditionCount > 64) {\r
            this.showError('Cannot save: Too many logic conditions (' + result.logicConditionCount + '/64)');\r
            return;\r
        }\r
\r
        // Confirm save\r
        const confirmMsg = i18n.getMessage('confirmSaveLogicConditions') ||\r
            \`Save \${result.logicConditionCount} logic conditions to flight controller?\`;\r
        if (!confirm(confirmMsg)) {\r
            return;\r
        }\r
\r
        GUI.log(i18n.getMessage('savingToFC') || 'Saving to flight controller...');\r
\r
        // Store variable map for preservation between sessions\r
        if (result.variableMap) {\r
            settingsCache.set('javascript_variables', result.variableMap);\r
            console.log('Variable map stored:', result.variableMap);\r
        }\r
\r
        // Clear existing logic conditions\r
        FC.LOGIC_CONDITIONS.flush();\r
\r
        // Create empty condition factory function\r
        const createEmptyCondition = () => ({\r
            enabled: 0,\r
            activatorId: -1,\r
            operation: 0,\r
            operandAType: 0,\r
            operandAValue: 0,\r
            operandBType: 0,\r
            operandBValue: 0,\r
            flags: 0,\r
\r
            getEnabled: function() { return this.enabled; },\r
            getActivatorId: function() { return this.activatorId; },\r
            getOperation: function() { return this.operation; },\r
            getOperandAType: function() { return this.operandAType; },\r
            getOperandAValue: function() { return this.operandAValue; },\r
            getOperandBType: function() { return this.operandBType; },\r
            getOperandBValue: function() { return this.operandBValue; },\r
            getFlags: function() { return this.flags; }\r
        });\r
\r
        // Build a map of slot index -> condition from transpiler output\r
        const conditionMap = new Map();\r
\r
        // Parse transpiled commands and build the condition map\r
        for (const cmd of result.commands) {\r
            if (cmd.startsWith('logic ')) {\r
                const parts = cmd.split(' ');\r
                if (parts.length >= 9) {\r
                    const slotIndex = parseInt(parts[1], 10);\r
                    const lc = {\r
                        enabled: parseInt(parts[2], 10),\r
                        activatorId: parseInt(parts[3], 10),\r
                        operation: parseInt(parts[4], 10),\r
                        operandAType: parseInt(parts[5], 10),\r
                        operandAValue: parseInt(parts[6], 10),\r
                        operandBType: parseInt(parts[7], 10),\r
                        operandBValue: parseInt(parts[8], 10),\r
                        flags: parts[9] ? parseInt(parts[9], 10) : 0,\r
\r
                        getEnabled: function() { return this.enabled; },\r
                        getActivatorId: function() { return this.activatorId; },\r
                        getOperation: function() { return this.operation; },\r
                        getOperandAType: function() { return this.operandAType; },\r
                        getOperandAValue: function() { return this.operandAValue; },\r
                        getOperandBType: function() { return this.operandBType; },\r
                        getOperandBValue: function() { return this.operandBValue; },\r
                        getFlags: function() { return this.flags; }\r
                    };\r
\r
                    conditionMap.set(slotIndex, lc);\r
                }\r
            }\r
        }\r
\r
        // Add empty conditions for previously-occupied slots that aren't in the new script\r
        if (self.previouslyOccupiedSlots) {\r
            for (const oldSlot of self.previouslyOccupiedSlots) {\r
                if (!conditionMap.has(oldSlot)) {\r
                    // This slot was occupied before but isn't in new script - clear it\r
                    conditionMap.set(oldSlot, createEmptyCondition());\r
                }\r
            }\r
        }\r
\r
        // Sort by slot index and add to FC.LOGIC_CONDITIONS in order\r
        const sortedSlots = Array.from(conditionMap.keys()).sort((a, b) => a - b);\r
        for (const slotIndex of sortedSlots) {\r
            FC.LOGIC_CONDITIONS.put(conditionMap.get(slotIndex));\r
        }\r
\r
        const saveChainer = new MSPChainerClass();\r
\r
        saveChainer.setChain([\r
            mspHelper.sendLogicConditions,\r
            mspHelper.saveToEeprom\r
        ]);\r
\r
        saveChainer.setExitPoint(function() {\r
            GUI.log(i18n.getMessage('logicConditionsSaved') || 'Logic conditions saved successfully');\r
            self.isDirty = false;\r
\r
            // Optionally reboot (commented out for safety - user can reboot manually)\r
            // const shouldReboot = confirm('Reboot flight controller to apply changes?');\r
            // if (shouldReboot) {\r
            //     self.rebootFC();\r
            // }\r
        });\r
\r
        saveChainer.execute();\r
    },\r
\r
    /**\r
     * Reboot flight controller\r
     */\r
    rebootFC: function() {\r
        GUI.log(i18n.getMessage('rebooting') || 'Rebooting...');\r
\r
        GUI.tab_switch_cleanup(function() {\r
            MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, function() {\r
                GUI.log(i18n.getMessage('rebootComplete') || 'Reboot complete');\r
            });\r
        });\r
    },\r
\r
    cleanup: function (callback) {\r
        console.log('[JavaScript Programming] cleanup() - disposing editor');\r
\r
        // Dispose Monaco editor\r
        // Note: Unsaved changes are checked BEFORE cleanup() is called:\r
        // - For disconnect: in serial_backend.js\r
        // - For tab switch: in configurator_main.js\r
        if (this.editor && this.editor.dispose) {\r
            this.editor.dispose();\r
            this.editor = null;\r
        }\r
\r
        if (callback) callback();\r
    }\r
};\r
\r
export default javascriptProgrammingTab;`;export{n as default};
