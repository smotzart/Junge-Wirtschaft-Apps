"use strict";

var mapsModule = require("nativescript-google-maps-sdk");
var page;
var context;
var closeCallback;

function wait(milliSeconds) {
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
           resolve(milliSeconds);
        }, milliSeconds);
    });
}

function onLoaded(args) {    
    page = args.object;
}
exports.onLoaded = onLoaded;

function onUnloaded(args) {}
exports.onUnloaded = onUnloaded;

function onShownModally(args) {
    context = args.context;
    closeCallback = args.closeCallback;
    page.bindingContext = context;
}
exports.onShownModally = onShownModally;

function closeModally(args) {
    closeCallback();
}
exports.closeModally = closeModally;

function onMapReady(args) {
    var mapView = args.object;
    wait(3000).then(function(){
        var marker = new mapsModule.Marker();
        marker.position = mapsModule.Position.positionFromLatLng(context.coords.latitude, context.coords.longitude);
        marker.title = context.event_name;
        mapView.addMarker(marker);
    });
}
exports.onMapReady = onMapReady;
