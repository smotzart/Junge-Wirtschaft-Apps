"use strict";

var app               = require('application');
var appSettings       = require("application-settings");
var platform          = require("platform");
var viewsModule       = require("~/utils/views/views");
var countryModule     = require("~/utils/country/country");
var serviceModule     = require("~/utils/service/service");
var imageCache        = require("nativescript-web-image-cache");
var connectivity      = require("connectivity");
var moment            = require('moment');
var googleAnalytics   = require("nativescript-google-analytics");

updateData();

if (app.ios) {
  //iOS 
  var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
  };
    
  var appDelegate = (function (_super) {
    __extends(appDelegate, _super);
    function appDelegate() {
      _super.apply(this, arguments);
    }    
    appDelegate.prototype.applicationDidFinishLaunchingWithOptions = function (app, launchOptions) {
      initAnalytics(); //Module Code to initalize 
    };    
    appDelegate.ObjCProtocols = [UIApplicationDelegate];
    return appDelegate;
  })(UIResponder);
  app.ios.delegate = appDelegate;
}

app.on(app.launchEvent, function(args) {
  if (args.android) {   
    initAnalytics();
    imageCache.initialize();
    // hook the onActivityCreated callback upon application launching
    app.android.onActivityCreated = function(activity) {
      // apply the default theme once the Activity is created
      // Changing the SplashTheme for AppTheme
      var id = activity.getResources().getIdentifier("AppTheme", "style", activity.getPackageName());
      activity.setTheme(id);
    }
  }
});
/*
app.setResources("countryName", function(value) {
  return countryModule.countries[value];
});
app.setResources("textTruncate", function(value, length) {
  return value.length > length ? value.substring(0, length - 3) + "..." : value;
});
app.setResources("uppercase", function(value) {
  return value.toUpperCase();
});*/

app.start({
  moduleName: viewsModule.Views.eventList //"views/drawer/maps/maps"// //testView//
});

function initAnalytics(){
  googleAnalytics.initalize({
    trackingId: "UA-40191066-4", //YOUR Id from GA 
    dispatchInterval: 5,
    logging: {
      native: true,
      console: false
    }
  });
}

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
    return fetch("https://login.dmas.at/api/v5/ios/events.json?presenter_id=122400")
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