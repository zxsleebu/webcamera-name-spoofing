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

    console.log("Webcamera name spoof enabled!\nCurrent name: " + cameraName);
    var old = MediaStream.prototype.getVideoTracks;
    MediaStream.prototype.getVideoTracks = function() {
        var ret = old.call(this, ...arguments);
        for(let video in ret){
            ret[video].label = cameraName;
        }
        return ret;
    }
    var old2 = navigator.mediaDevices.enumerateDevices;
    navigator.mediaDevices.enumerateDevices = function(){
        console.log("Asked for devices");
        return new Promise((resolve, reject) => {
            var ret2 = old2.call(navigator.mediaDevices, ...arguments).then(devices => {
                var ret4 = [];
                for(let device in devices){
                    var old3 = devices[device].getCapabilities;
                    var ret3 = JSON.parse(JSON.stringify(devices[device]));
                    if(ret3.label === "OBS Virtual Camera"){
                        ret3.getCapabilities = old3;
                        ret3.label = cameraName;
                        ret4.push(ret3)
                    }
                }
                resolve(ret4);
            }).catch(err => {reject(err)});
        });
    }
})();
