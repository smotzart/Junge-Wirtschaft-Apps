"use strict";
var navigation  = require("~/utils/navigation/navigation");
var frame = require("tns-core-modules/ui/frame");
var viewsModule       = require("~/utils/views/views");

function onLoaded(args) {}
exports.onLoaded = onLoaded;

function sideDrawer() {
  var sideDrawer = frame.topmost().getViewById("sideDrawer");
  return sideDrawer;
}

function closeDrawer() {
  var instance = sideDrawer();
  if (instance) {
    instance.closeDrawer();
  }
}

function openPage(args) {
  closeDrawer();
  navigation.openPage(args.object);
}
exports.openPage = openPage;


function goBack(args) {
  closeDrawer();
  navigation.navigate(viewsModule.Views.eventList);
}
exports.goBack = goBack;