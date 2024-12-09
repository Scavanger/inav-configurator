'use strict'
import { chmod, rm } from 'fs';
import { GUI } from './gui';

const serialRXProtocolls = [
{
    name : "Flight Controller Proxy",
    baudRate: 115200,
    stopBits: "One",
    parity: "None"
},
{
    name : "SBus",
    baudRate: 100000,
    stopBits: "Two",
    parity: "Even"
},
{
    name : "SBus Fast",
    baudRate: 200000,
    stopBits: "Two",
    parity: "Even"
},
{
    name : "Crossfire/Ghost",
    baudRate: 420000,
    stopBits: "One",
    parity: "None"
},
{
    name : "FPort/IBus/Spektrum/SRXL2/SUMD",
    baudRate: 115200,
    stopBits: "One",
    parity: "None"
},
{
    name : "JETI EX Bus",
    baudRate: 125000,
    stopBits: "One",
    parity: "None"
},
];

var SitlSerialPortUtils = {

    portsList: [],
    stopPolling: false,

    getProtocolls: function() {
        return serialRXProtocolls;
    },

    getDevices: function(callback) {
        window.electronAPI.listSerialDevices().then(devices => callback(devices));
    },

    pollSerialPorts: function(callback) {
        this.getDevices(devices => {
            if (!this.arraysEqual(this.portsList, devices)) {
               this.portsList = devices;
                if (callback)
                    callback(this.portsList);
            }

        });
        if (!this.stopPolling) {
            setTimeout(() => { this.pollSerialPorts(callback) }, 250);
        } else {
            this.stopPolling = false;
        }
    },

    resetPortsList: function() {
        this.portsList = [];
    },

    stopPollSerialPorts: function()
    {
        this.stopPolling = true;
    },

    arraysEqual: function(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }
}

var SITLProcess = {

    spawn : null,
    isRunning: false,
    process: null,

    deleteEepromFile(filename) {
        rm(`${window.electronAPI.getPath('userData')}/${filename}`, error => {
            if (error) {
                GUI.log(`Unable to reset Demo mode: ${error.message}`);
            }
        });
    },

    start: function(eepromFileName, sim, useIMU, simIp, simPort, channelMap, serialPortOptions, callback) {

        if (this.isRunning)
            this.stop();

        var sitlExePath, eepromPath;
        var path = window.electronAPI.getPath('userData');
        if (GUI.operating_system == 'Windows') {
            sitlExePath = path.join(__dirname, './../resources/sitl/windows/inav_SITL.exe');
            eepromPath = `${path}\\${eepromFileName}`
        } else if (GUI.operating_system == 'Linux') {
            sitlExePath = path.join(__dirname, './../resources/sitl/linux/inav_SITL');
            eepromPath = `${path}/${eepromFileName}`
            chmod(sitlExePath, 0o755, err => {
                if (err)
                    console.log(err);
            });
        } else if (GUI.operating_system == 'MacOS') {
            sitlExePath = path.join(__dirname, './../resources/sitl/macos/inav_SITL');
            eepromPath = `${path}/${eepromFileName}`
            chmod(sitlExePath, 0o755, err => {
                if (err)
                    console.log(err);
            });
 
        } else {
            return;
        }

        var args = [];
        args.push(`--path=${eepromPath}`);

        if (sim) {
            args.push(`--sim=${sim}`);
            if (useIMU)
                args.push("--useimu")

            if (simIp)
                args.push(`--simip=${simIp}`);

            if (simPort)
                args.push(`--simport=${simPort}`);

            if (channelMap)
                args.push(`--chanmap=${channelMap}`)
        }

        if (serialPortOptions != null) {
            var protocoll = serialRXProtocolls.find(proto => {
                return proto.name == serialPortOptions.protocollName;
            });

            if (protocoll && protocoll.name != "manual") {
                args.push(`--serialport=${serialPortOptions.serialPort}`)
                args.push(`--baudrate=${protocoll.baudRate}`);
                args.push(`--stopbits=${protocoll.stopBits}`)
                args.push(`--parity=${protocoll.parity}`)
                if ( protocoll.name == "Flight Controller Proxy") {
                    args.push(`--fcproxy`);
                } else {
                    args.push(`--serialuart=${serialPortOptions.serialUart}`);
                }
            } else {
                args.push(`--serialport=${serialPortOptions.serialPort}`)
                args.push(`--baudrate=${serialPortOptions.baudRate}`);
                args.push(`--stopbits=${serialPortOptions.stopBits}`)
                args.push(`--parity=${serialPortOptions.parity}`)
                args.push(`--serialuart=${serialPortOptions.serialUart}`);
            }
        }

        callback( sitlExePath + " " + args.join(" ") + "\n");
        this.spawn(sitlExePath, args, callback);
    },

    spawn: function(path, args, callback) {

        var opts = undefined;
        if (GUI.operating_system == 'Linux')
            opts = { useShell: true };

        this.process = window.electronAPI.spawn(path, args, opts);
        this.isRunning = true;

        this.process.stdout.on('data', (data) => {
            if (callback)
                callback(data);
        });

        this.process.stderr.on('data', (data) => {
            if (callback)
                callback(data);
        });

        this.process.on('error', (error) => {
            if (callback)
                callback(error);
            this.isRunning = false;
        });
    },

    stop: function() {
        if (this.isRunning) {
            this.isRunning = false;
            this.process.kill();
        }
    }
};

export { SITLProcess, SitlSerialPortUtils };
