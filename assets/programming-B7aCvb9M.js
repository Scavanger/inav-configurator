const r=`'use strict';\r
\r
import MSPChainerClass from './../js/msp/MSPchainer';\r
import mspHelper from './../js/msp/MSPHelper';\r
import GUI from './../js/gui';\r
import FC from './../js/fc';\r
import tabs from './../js/tabs';\r
import i18n from './../js/localization';\r
import interval from './../js/intervals';\r
\r
const programmingTab = {};\r
\r
programmingTab.initialize = function (callback, scrollPosition) {\r
    let loadChainer = new MSPChainerClass(),\r
        saveChainer = new MSPChainerClass(),\r
        statusChainer = new MSPChainerClass();\r
\r
    if (GUI.active_tab !== this) {\r
        GUI.active_tab = this;\r
    }\r
\r
    loadChainer.setChain([\r
        mspHelper.loadLogicConditions,\r
        mspHelper.loadGlobalVariablesStatus,\r
        mspHelper.loadProgrammingPidStatus,\r
        mspHelper.loadProgrammingPid\r
    ]);\r
    loadChainer.setExitPoint(loadHtml);\r
    loadChainer.execute();\r
\r
    saveChainer.setChain([\r
        mspHelper.sendLogicConditions,\r
        mspHelper.sendProgrammingPid,\r
        mspHelper.saveToEeprom\r
    ]);\r
    \r
    statusChainer.setChain([\r
        mspHelper.loadLogicConditionsStatus,\r
        mspHelper.loadGlobalVariablesStatus,\r
        mspHelper.loadProgrammingPidStatus\r
    ]);\r
    statusChainer.setExitPoint(onStatusPullDone);\r
\r
    function loadHtml() {\r
        import('./programming.html?raw').then(({default: html}) => GUI.load(html, processHtml));\r
    }\r
\r
    function processHtml() {\r
        FC.LOGIC_CONDITIONS.init($('#subtab-lc'));\r
        FC.LOGIC_CONDITIONS.render();\r
        GUI.switchery();\r
\r
        FC.PROGRAMMING_PID.init($('#subtab-pid'));\r
        FC.PROGRAMMING_PID.render();\r
        GUI.switchery();\r
\r
        FC.GLOBAL_VARIABLES_STATUS.init($(".gvar__container"));\r
\r
        tabs.init($('.tab-programming'));\r
\r
        i18n.localize();;\r
\r
        $('#save-button').on('click', function () {\r
            saveChainer.execute();\r
            GUI.log(i18n.getMessage('programmingEepromSaved'));\r
        });\r
\r
        interval.add('logic_conditions_pull', function () {\r
            statusChainer.execute();\r
        }, 100);\r
\r
        GUI.content_ready(callback);\r
    }\r
\r
    function onStatusPullDone() {\r
        FC.LOGIC_CONDITIONS.update(FC.LOGIC_CONDITIONS_STATUS);\r
        FC.GLOBAL_VARIABLES_STATUS.update($('.tab-programming'));\r
        FC.PROGRAMMING_PID.update(FC.PROGRAMMING_PID_STATUS);\r
    }\r
}\r
\r
programmingTab.cleanup = function (callback) {\r
    if (callback) callback();\r
};\r
\r
export default programmingTab;`;export{r as default};
