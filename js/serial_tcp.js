'use strict'

const STANDARD_TCP_PORT = 5761;

var serialTCP = {
    
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
            connectionPort = STANDARD_PORT;
        }

        chrome.sockets.tcp.create({
            persistent: false,
            name: "iNavTCP",
            bufferSize: 65535,
        }, function(createInfo) {
            if (createInfo && !chrome.runtime.lastError) {
                serial.bitrate = 115200; // Dummy value
                serial.connectionId = createInfo.socketId; // BLE
                serial.bytesReceived = 0;
                serial.bytesSent = 0;
                serial.failed = 0;
                serial.openRequested = false;

                GUI.log("Try to open TCP connection...");
                chrome.sockets.tcp.connect(createInfo.socketId, connectionIP, connectionPort, function(result) {
                    if (result === 0 && !chrome.runtime.lastError) {
                        chrome.sockets.tcp.setNoDelay(createInfo.socketId, true, function (noDelayResult) {
                            
                            if (noDelayResult === 0 && !chrome.runtime.lastError) {
                                serial.onReceive.addListener(function (bytesReceived) {
                                serial.bytesReceived += bytesReceived.data.byteLength;
                            });
                        

                            serial.onReceiveError.addListener(function watch_for_on_receive_errors(info) {
                                console.error(info);
                                googleAnalytics.sendException('TCP: ' + info.error, false);

                                let message;
                                switch (info.resultCode) {
                                    case -15:
                                        // connection is lost, cannot write to it anymore, preventing further disconnect attempts
                                        message = 'error: ERR_SOCKET_NOT_CONNECTED';
                                        console.log(`TCP: ${message}: ${result}`);
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
                                console.warn(`TCP: ${resultMessage} ID: ${connectionId}`);

                            });

                            self.registerOnRecieveCallback();

                            GUI.log("TCP connection openend with ID: " + serial.connectionId + ", Url: " + connectionIP + ":" + connectionPort);

                            if (callback) {
                                callback({connectionId: serial.connectionId});
                            }
                        }

                        });
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
        chrome.sockets.tcp.disconnect(serial.connectionId);
        
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
        console.log('TCP: Connection with ID: ' + serial.connectionId + ' closed, Sent: ' + serial.bytesSent + ' bytes, Received: ' + serial.bytesReceived + ' bytes');
        self.connectionId = false;
        funcRef(true);
    },

    send: function(id, data, callback) {;
        chrome.sockets.tcp.send(id, data, function (sendInfo) {
           callback(sendInfo);
        });
    },

    registerOnRecieveCallback: function() {
        serial.onReceive.register(function(listener){
            chrome.sockets.tcp.onReceive.addListener(listener)
        });
    },

    addReceiveErrorListener: function(funcRef) {
        chrome.sockets.tcp.onReceiveError.addListener(funcRef);   
    },

    removeReceiveErrorListener: function(funcRef) {
        chrome.sockets.tcp.onReceiveError.removeListener(funcRef);  
    }
}
