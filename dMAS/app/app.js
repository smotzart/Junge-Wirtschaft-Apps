"use strict";

var applicationModule = require('application');
var appSettings       = require("application-settings");
var platform          = require("platform");
var viewsModule       = require("~/utils/views/views");
var countryModule     = require("~/utils/country/country");
var serviceModule     = require("~/utils/service/service");
var imageCache        = require("nativescript-web-image-cache");
var connectivity      = require("connectivity");
var moment            = require('moment');

updateData();

applicationModule.mainEntry = {
  moduleName: viewsModule.Views.eventList
};

applicationModule.on(applicationModule.launchEvent, function(args) {
  if (args.android) {   
    imageCache.initialize();
    // hook the onActivityCreated callback upon application launching
    applicationModule.android.onActivityCreated = function(activity) {
      // apply the default theme once the Activity is created
      // Changing the SplashTheme for AppTheme
      var id = activity.getResources().getIdentifier("AppTheme", "style", activity.getPackageName());
      activity.setTheme(id);
    }
  }
});

var textTruncate = function(value, length) {
  return value.length > length ? value.substring(0, length - 3) + "..." : value;
}

var countryName = function(value) {
  return countryModule.countries[value];
}

var uppercase = function(value) {
  return value.toUpperCase();
}

applicationModule.resources["countryName"]  = countryName;
applicationModule.resources["textTruncate"] = textTruncate;
applicationModule.resources["uppercase"]    = uppercase;

applicationModule.start();

function updateData() {  
  if (connectivity.getConnectionType() === connectivity.connectionType.none) {
    return false;
  }

  var currentDate = moment(new Date());
  var lastUpdate  = appSettings.getString("update_date", currentDate.toString());

  if (currentDate.diff(moment(lastUpdate), 'minutes') < 30 && currentDate.toString() != lastUpdate) {
    return false;
  } else {
    appSettings.setString("update_date", currentDate.toString());
    return fetch("https://login.dmas.at/api/v5/ios/events.json?presenter_id=58")
      .then(handleErrors)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        serviceModule.service.update(data);
      });	
  }
};

function handleErrors(response) {
  if (!response.ok) {
    console.log(JSON.stringify(response));
    throw Error(response.statusText);
  }
  return response;
};