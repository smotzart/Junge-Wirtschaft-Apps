"use strict";

var applicationModule = require('application');
var platform          = require("platform");
var connectivity      = require("connectivity");
var viewsModule       = require("~/utils/views/views");
var countryModule     = require("~/utils/country/country");
var serviceModule     = require("~/utils/service/service");


applicationModule.onLaunch = function(intent) {
    if (platform.device.os === platform.platformNames.android) {
        // hook the onActivityCreated callback upon application launching
        applicationModule.android.onActivityCreated = function(activity) {
            // apply the default theme once the Activity is created
            // Changing the SplashTheme for AppTheme
            var id = activity.getResources().getIdentifier("AppTheme", "style", activity.getPackageName());
            activity.setTheme(id);
        }
    }
    
    updateData();

    applicationModule.mainEntry = {
        moduleName: viewsModule.Views.eventList,
        //backstackVisible: false
    };
}

var textTruncate = function(value, length) {
    return value.length > length ? value.substring(0, length - 3) + "..." : value;
}

var countryName = function(value) {
    return countryModule.countries[value];
}

var uppercase = function(value) {
    return value.toUpperCase();
}

applicationModule.resources["countryName"] = countryName;
applicationModule.resources["textTruncate"] = textTruncate;
applicationModule.resources["uppercase"] = uppercase;

applicationModule.start();

function updateData() {
  if (connectivity.getConnectionType() === connectivity.connectionType.none) {
    return false;
  }
  return fetch("https://login.dmas.at/api/v5/ios/events.json?presenter_id=58")
    .then(handleErrors)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.forEach(function(event) {
        alert("kakogo ?");//serviceModule.service.updateDatabase(event);
      });
    });		
};


function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
};