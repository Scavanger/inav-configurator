'use strict';

let SafehomeCollection = function () {

    let self = {},
        data = [],
        maxSafehomeCount = 8;

    self.setMaxSafehomeCount = function (value) {
        maxSafehomeCount = value;
    };

    self.getMaxSafehomeCount = function () {
        return maxSafehomeCount;
    }

    self.put = function (element) {
        element.setNumber(data.length);
        data.push(element);
    };

    self.get = function () {
        return data;
    };
    
    self.clean = function (index){
        data[index].cleanup();
    };

    self.flush = function () {
        data = [];
    };

    self.isEmpty = () => {
        return data.length == 0;
    };

    self.safehomeCount = () => {
        return data.length;
    }

    self.drop = (idx) => {
        data.forEach(safehome => {
            if (safehome.getNumber() >= idx) {
                safehome.setNumber(safehome.getNumber() - 1);
            }
        });   
        data.splice(idx, 1);
    }

    self.insert = (safehome, idx) => {
        data.forEach(s => {
            if (s.getNumber() >= idx) {
                s.setNumber(s.getNumber() + 1);
            }
        });
        data.splice(idx, 0, safehome);
    }
        
    self.updateSafehome = function(newSafehome) {
        data[newSafehome.getNumber()] = newSafehome;
    };
    
    self.extractBuffer = function(safehomeId) {
        let buffer = [];
        let safehome = data[safehomeId];
        if (safehomeId < self.safehomeCount()) {    
            buffer.push(safehome.getNumber());    // sbufReadU8(src);    // number
            buffer.push(1);    
            buffer.push(specificByte(safehome.getLat(), 0));    // sbufReadU32(src);      // lat
            buffer.push(specificByte(safehome.getLat(), 1));
            buffer.push(specificByte(safehome.getLat(), 2));
            buffer.push(specificByte(safehome.getLat(), 3));
            buffer.push(specificByte(safehome.getLon(), 0));    // sbufReadU32(src);      // lon
            buffer.push(specificByte(safehome.getLon(), 1));
            buffer.push(specificByte(safehome.getLon(), 2));
            buffer.push(specificByte(safehome.getLon(), 3));
            buffer.push(specificByte(safehome.getApproachAltAsl(), 0));
            buffer.push(specificByte(safehome.getApproachAltAsl(), 1));
            buffer.push(specificByte(safehome.getApproachAltAsl(), 2));
            buffer.push(specificByte(safehome.getApproachAltAsl(), 3));
            buffer.push(specificByte(safehome.getLandAltAsl(), 0));
            buffer.push(specificByte(safehome.getLandAltAsl(), 1));
            buffer.push(specificByte(safehome.getLandAltAsl(), 2));
            buffer.push(specificByte(safehome.getLandAltAsl(), 3));
            buffer.push(safehome.getApproachDirection());
            buffer.push(specificByte(safehome.getLandHeading1(), 0));
            buffer.push(specificByte(safehome.getLandHeading1(), 1));
            buffer.push(specificByte(safehome.getLandHeading2(), 0));
            buffer.push(specificByte(safehome.getLandHeading2(), 1));
            buffer.push(safehome.getIsSeaLevelRef());
        } else {
            buffer = Array(24).fill(0);
            buffer[0] = safehomeId;
        }
        
        return buffer;
    }
    
    self.safehomeDisplayDebug = function() {
        if (data && data.length != 0) {
            data.forEach(function (element) {
                console.log("N° : ", element.getNumber(),
                            "Enabled : ", element.getEnabled(),
                            "Lon : ", element.getLon(),
                            "Lat : ", element.getLat(),
                           );
            });
        }
    }
    

    return self;
};