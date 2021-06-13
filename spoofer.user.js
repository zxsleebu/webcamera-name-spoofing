// ==UserScript==
// @name         Webcamera names spoofing
// @namespace    https://instagram.com/zxsleebu
// @version      1.1
// @description  try to take over the world!
// @author       @zxsleebu
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    var cameraName = "HD 720P Webcam (0c45:6340)";
    var width = 1080;
    var height = 1920;

    console.log("Webcamera spoof enabled!\nCurrent name: " + cameraName);
    var old = MediaStream.prototype.getVideoTracks;
    MediaStream.prototype.getVideoTracks = function() {
        console.log("Asked for devices:");
        console.log(arguments);
        var ret = old.call(this, ...arguments);
        for(let video in ret){
            ret[video].label = cameraName;
        }
        return ret;
    }
    var old2 = navigator.mediaDevices.enumerateDevices;
    navigator.mediaDevices.enumerateDevices = function(){
        console.log("Asked for devices:");
        console.log(arguments);
        return new Promise((resolve, reject) => {
            old2.call(navigator.mediaDevices, ...arguments).then(devices => {
                var ret = [];
                for(let device in devices){
                    var old = devices[device].getCapabilities;
                    var ret2 = JSON.parse(JSON.stringify(devices[device]));

                    if(ret2.label === "OBS Virtual Camera"){
                        ret2.getCapabilities = old;
                        ret2.label = cameraName;
                        ret.push(ret2)
                    }
                }
                resolve(ret);
            }).catch(err => {reject(err)});
        });
    }
    var old3 = MediaStreamTrack.prototype.getSettings;
    MediaStreamTrack.prototype.getSettings = function(){
        var settings = old3.call(this, ...arguments);
        var aspect = 1.7777777778;
        if(width > height){
            aspect = width / height
        }
        else{
            aspect = height / width
        }
        if(aspect == 1.7777777777777777) aspect = 1.7777777778;
        settings.aspectRatio = aspect;
        settings.width = width;
        settings.height = height;
        console.log(settings);
        return settings;
    }
    var old4 = MediaStream.prototype.getTracks;
    MediaStream.prototype.getTracks = function(){
        console.log("Asked for devices: ");
        var devices = old4.call(this, ...arguments);
        var ret = [];
        for(let device in devices){
            if(devices[device].label === "OBS Virtual Camera"){
                device = devices[device];
                var ret2 = {};
                var cap = device.getCapabilities();
                var constra = device.getConstraints();
                var settings = device.getSettings();
                ret2.label = cameraName;
                ret2.id = device.id;
                ret2.kind = device.kind;
                ret2.muted = device.muted;
                ret2.onended = device.onended;
                ret2.onmute = device.onmute;
                ret2.onunmute = device.onunmute;
                ret2.readyState = device.readyState;
                ret2.applyConstraints = device.applyConstraints;
                ret2.enabled = device.enabled;
                ret2.getCapabilities = function(){return cap};
                ret2.getConstraints = function(){return constra};
                ret2.getSettings = function(){return settings};
                ret.push(ret2)
            }
        }
        console.log(ret);
        return ret;
    }
})();
