'use strict'

const STANDARD_UDP_PORT = 5762;

var serialUDP = {
    
    connectionIP: null,
    connectionPort: null,

    connect: function(address, callback) {
        const self = this;
        var connectionId = 0;
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }

        var addr = address.split(':');
        if (addr.length == 2) {
            connectionIP = addr[0];
            connectionPort = parseInt(addr[1])
        } else {
            connectionIP = address;
            connectionPort = STANDARD_UDP_PORT;
        }

        chrome.sockets.udp.create({
            persistent: false,
            name: "iNavUDP",
            bufferSize: 65535,
        }, function(createInfo) {
            if (createInfo && !chrome.runtime.lastError) {
                serial.bitrate = 115200; // Dummy value
                serial.connectionId = createInfo.socketId; // BLE
                serial.bytesReceived = 0;
                serial.bytesSent = 0;
                serial.failed = 0;
                serial.openRequested = false;

                GUI.log("Try to open UDP connection...");
                chrome.sockets.udp.bind(createInfo.socketId, "0.0.0.0", connectionPort, function(result) {
                    if (result === 0 && !chrome.runtime.lastError) {
                        
                        serial.onReceive.addListener(function (bytesReceived) {
                            serial.bytesReceived += bytesReceived.data.byteLength;
                        });
                
                        serial.onReceiveError.addListener(function watch_for_on_receive_errors(info) {
                            console.error(info);
                            googleAnalytics.sendException('UDP: ' + info.error, false);

                            let message;
                            switch (info.resultCode) {
                                case -15:
                                    // connection is lost, cannot write to it anymore, preventing further disconnect attempts
                                    message = 'error: ERR_SOCKET_NOT_CONNECTED';
                                    console.log(`UDP: ${message}: ${result}`);
                                    connectionId = false;
                                    return;
                                case -21:
                                    message = 'error: NETWORK_CHANGED';
                                    break;
                                case -100:
                                    message = 'error: CONNECTION_CLOSED';
                                    break;
                                case -102:
                                    message = 'error: CONNECTION_REFUSED';
                                    break;
                                case -105:
                                    message = 'error: NAME_NOT_RESOLVED';
                                    break;
                                case -106:
                                    message = 'error: INTERNET_DISCONNECTED';
                                    break;
                                case -109:
                                    message = 'error: ADDRESS_UNREACHABLE';
                                    break;
                            }
                    
                            let resultMessage = message ? `${message} ${info.resultCode}` : info.resultCode;
                            console.warn(`UDP: ${resultMessage} ID: ${connectionId}`);
                        });

                        self.registerOnRecieveCallback();

                        GUI.log("UDP connection openend with ID: " + serial.connectionId + ", Url: " + connectionIP + ":" + connectionPort);

                        if (callback) {
                            callback({connectionId: serial.connectionId});
                        }
        
                    } else {
                        GUI.log("Failed to connect: " + chrome.runtime.lastError.message);
                        if (GUI.connected_to || GUI.connecting_to) {
                            $('a.connect').click();
                        } else {
                            serial.disconnect();
                        }
                    }
                });
            }
        });

    },

    disconnect: function(funcRef) {
        chrome.sockets.udp.close(serial.connectionId);
        
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
        console.log('UDP: Connection with ID: ' + serial.connectionId + ' closed, Sent: ' + serial.bytesSent + ' bytes, Received: ' + serial.bytesReceived + ' bytes');
        self.connectionId = false;
        funcRef(true);
    },

    send: function(id, data, callback) {;
        chrome.sockets.udp.send(id, data, this.connectionIP, this.connectionPort, function (sendInfo) {
           callback(sendInfo);
        });
    },

    registerOnRecieveCallback: function() {
        serial.onReceive.register(function(listener){
            chrome.sockets.udp.onReceive.addListener(listener)
        });
    },

    addReceiveErrorListener: function(funcRef) {
        chrome.sockets.udp.onReceiveError.addListener(funcRef);   
    },

    removeReceiveErrorListener: function(funcRef) {
        chrome.sockets.udp.onReceiveError.removeListener(funcRef);  
    }
}
