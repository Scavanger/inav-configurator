const r=`<!DOCTYPE html>\r
<html>\r
<head>\r
    <meta charset="utf-8">\r
    <title>JavaScript Programming</title>\r
</head>\r
<body>\r
    <div id="javascript-programming-tab" class="tab-programming">\r
\r
        <!-- Header -->\r
        <div class="section">\r
            <div class="gui_box grey">\r
                <div class="gui_box_titlebar">\r
                    <div class="spacer_box_title" i18n="tabJavaScriptProgramming"></div>\r
                </div>\r
                <div class="content_wrapper">\r
                    <div class="note" style="margin-bottom: 10px;">\r
                        <div class="note_spacer">\r
                            <p i18n="javascriptProgrammingDescription"></p>\r
                            <p>\r
                                <strong>Write JavaScript, Get INAV Logic Conditions!</strong>\r
                                Use familiar JavaScript syntax with full autocomplete and error checking.\r
                                <strong>Currently in beta, for testing. Do not use for safety-critical applications!</strong>\r
                            </p>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Main Editor Area -->\r
        <div class="section">\r
            <div class="gui_box grey">\r
                <div class="gui_box_titlebar">\r
                    <div class="spacer_box_title">JavaScript Editor (shift-ctrl-v to paste)</div>\r
                    <div class="spacer_box_title" style="margin-left: auto;">\r
                       <div class="examples-section" id="js-example-select">\r
                           <label for="examples-select">Load Example:</label>\r
                           <select id="examples-select" class="select-example">\r
                               <option value="">-- Select Example --</option>\r
                           </select>\r
                       </div>\r
\r
                    </div>\r
                </div>\r
                <div class="content_wrapper">\r
                    <!-- Monaco Editor Container -->\r
                    <div id="monaco-editor" style="height: 400px; border: 1px solid #ccc;"></div>\r
\r
                    <!-- Editor Controls -->\r
                    <div class="default_btn" style="margin-top: 10px;">\r
                        <div class="btn" style="width: 100%;">\r
                            <div style="display: flex; gap: 10px;">\r
                                <a class="transpile" href="#" i18n="javascriptTranspile">Transpile to INAV</a>\r
                                <a class="load" href="#" i18n="javascriptLoad">Load from FC</a>\r
                                <a class="save" href="#" i18n="javascriptSave">Save to FC</a>\r
                                <a class="clear" href="#" i18n="javascriptClear">Clear</a>\r
                            </div>\r
                        </div>\r
                    </div>\r
\r
                    <!-- Warnings/Errors - Positioned here for immediate visibility -->\r
                    <div id="transpiler-warnings" class="transpiler-warnings" style="display: none; margin-top: 10px;"></div>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Transpiler Output -->\r
        <div class="section">\r
            <div class="gui_box grey">\r
                <div class="gui_box_titlebar">\r
                    <div class="spacer_box_title">INAV Logic Conditions Output</div>\r
                    <div class="spacer_box_title" style="margin-left: auto;">\r
                        <span id="lc-count" class="lc-count">0/64 LCs</span>\r
                    </div>\r
                </div>\r
                <div class="content_wrapper">\r
                    <!-- Output Display -->\r
                    <textarea id="transpiler-output"\r
                              class="transpiler-output"\r
                              readonly\r
                              style="width: 100%; height: 200px; font-family: monospace; font-size: 12px;"></textarea>\r
\r
                    <!-- Optimization Stats -->\r
                    <div id="optimization-stats" class="optimization-stats" style="display: none; margin-top: 10px;">\r
                        <div class="note">\r
                            <div class="note_spacer">\r
                                <strong>Optimizations Applied:</strong>\r
                                <pre id="optimization-details" style="margin: 5px 0; font-size: 11px;"></pre>\r
                            </div>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- API Reference (Collapsible) -->\r
        <div class="section">\r
            <div class="gui_box grey">\r
                <div class="gui_box_titlebar">\r
                    <div class="spacer_box_title">\r
                        <a href="#" id="api-reference-toggle" style="color: inherit; text-decoration: none;">\r
                            ▶ API Reference & Examples\r
                        </a>\r
                    </div>\r
                </div>\r
                <div class="content_wrapper" id="api-reference-content" style="display: none;">\r
                    <div class="note">\r
                        <div class="note_spacer">\r
                            <h4>Quick Reference</h4>\r
\r
                            <h5>Flight Parameters (Read-Only)</h5>\r
                            <pre>flight.homeDistance  // meters\r
flight.altitude      // cm\r
flight.vbat          // centivolts\r
flight.cellVoltage   // centivolts\r
flight.rssi          // 0-99\r
flight.mode.failsafe // boolean</pre>\r
\r
                            <h5>RC Channels</h5>\r
                            <pre>rc[5].high   // boolean\r
rc[5].mid    // boolean\r
rc[5].low    // boolean\r
rc[5].value  // 1000-2000</pre>\r
\r
                            <h5>Overrides (Write)</h5>\r
                            <pre>override.vtx.power = 3;           // 0-4\r
override.throttleScale = 50;      // 0-100%\r
override.yaw.angle = 180;         // degrees\r
override.rcChannel[8] = 2000;     // trigger switch</pre>\r
\r
                            <h5>Global Variables</h5>\r
                            <pre>gvar[0] = 100;     // write\r
const x = gvar[0]; // read</pre>\r
\r
\r
                            <h5>Complete Example</h5>\r
                            <pre>const { flight, override } = inav;\r
\r
if (flight.homeDistance > 100) {\r
  override.vtx.power = 3;\r
}</pre>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
\r
    </div>\r
</body>\r
</html>\r
\r
<style>\r
.tab-programming {\r
    width: 100%;\r
}\r
\r
.section {\r
    margin-bottom: 15px;\r
}\r
\r
.lc-count {\r
    font-weight: bold;\r
    padding: 3px 8px;\r
    border-radius: 3px;\r
    background: #e8e8e8;\r
}\r
\r
.lc-count.warning {\r
    background: #ff9800;\r
    color: white;\r
}\r
\r
.lc-count.error {\r
    background: #f44336;\r
    color: white;\r
}\r
\r
.transpiler-output {\r
    background: #1e1e1e;\r
    color: #d4d4d4;\r
    border: 1px solid #ccc;\r
    padding: 10px;\r
    resize: vertical;\r
}\r
\r
.optimization-stats .note {\r
    background: #e7f5e7;\r
    border-left: 4px solid #4caf50;\r
}\r
\r
.transpiler-warnings .note {\r
    background: #fff3cd;\r
    border-left: 4px solid #ff9800;\r
}\r
\r
.transpiler-warnings .note.error {\r
    background: #f8d7da;\r
    border-left: 4px solid #f44336;\r
}\r
\r
.example-select {\r
    padding: 4px 8px;\r
    border: 1px solid #ccc;\r
    border-radius: 3px;\r
    background: white;\r
}\r
\r
#monaco-editor {\r
    border-radius: 3px;\r
    overflow: hidden;\r
}\r
\r
.default_btn .btn div {\r
    justify-content: center;\r
}\r
\r
.default_btn .btn a {\r
    flex: 1;\r
    text-align: center;\r
}\r
</style>\r
</html>\r
`;export{r as default};
