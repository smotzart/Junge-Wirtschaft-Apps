"use strict";
var viewModel;

var navigationModule = require("~/utils/navigation/navigation");
var frame = require("tns-core-modules/ui/frame");

function navigatingTo(args) {
  var page = args.object;
  viewModel = page.navigationContext;
  viewModel.menuIndex = 2;
  page.bindingContext = null;
  page.bindingContext = viewModel;
}
exports.navigatingTo = navigatingTo;

function goBack(args) {
  navigationModule.goBack();
}
exports.goBack = goBack;

/*
function showSlideout(args) {
  var sideDrawer = frame.topmost().getViewById("sideDrawer");
  sideDrawer.toggleDrawerState();
}
exports.showSlideout = showSlideout;*/