"use strict";
var vmModule    = require("./maps-view-model");
var mapsModule  = require("nativescript-google-maps-sdk");
var permissions = require("nativescript-permissions");
var application = require("application");

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = vmModule.mainViewModel;
}
exports.pageLoaded = pageLoaded;

var mapView = null;

function wait(milliSeconds) {
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
           resolve(milliSeconds);
        }, milliSeconds);
    });
}

function requestPermissions() {
  return new Promise(function(resolve, reject) {
    if (!application.android) return resolve(true);
    permissions.requestPermission([
          android.Manifest.permission.ACCESS_FINE_LOCATION,
          android.Manifest.permission.ACCESS_COARSE_LOCATION],
        "This demo will stink without these...")
        .then(function (result) {
          alert("Permissions granted!");
          resolve(true);
        })
        .catch(function (result) {
          alert("Permissions failed :(", result);
          resolve(false);
        });

  });
}

function onMapReady(args) {
  mapView = args.object;

  mapView.settings.compassEnabled = false;

  var marker = new mapsModule.Marker();
  marker.position = mapsModule.Position.positionFromLatLng(-33.86, 151.20);
  marker.title = "Sydney";
  marker.snippet = "Australia";
  marker.color = "green";
  marker.userData = {index: 1};
  mapView.addMarker(marker);
  /*
  requestPermissions()
    .then(function(granted) {
        if(granted) {
            alert("Enabling My Location..");
            mapView.myLocationEnabled = true;
            mapView.settings.myLocationButtonEnabled = true;
        }
        return wait(3000);
    }).catch(function (error) {
        alert(error);
    });*/

}

exports.onMapReady = onMapReady;