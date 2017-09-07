"use strict";

var closeTimeout = 0;

function inputTap(args) {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
  closeTimeout = setTimeout(() => {
    closeTimeout = 0;
  }, 20);
}
exports.inputTap = inputTap;

function tap (args) {
  var page = args.object.page;
  if (!closeTimeout) {
    closeTimeout = setTimeout(() => {
      page.getViewById("search1").dismissSoftInput();
      closeTimeout = 0;
    }, 20);
  }
}
exports.tap = tap;

function doNotShowAndroidKeyboard(args) {
  var searchBar = args.object;
  if (searchBar.android) {
    searchBar.android.clearFocus();
  }
}
exports.doNotShowAndroidKeyboard = doNotShowAndroidKeyboard;

var viewModel;

var navigationModule = require("~/utils/navigation/navigation");
var frame = require("tns-core-modules/ui/frame");

function navigatingTo(args) {
  var page = args.object;
  viewModel = page.navigationContext;
  viewModel.menuIndex = 3;
  viewModel.traders_view = page.getViewById("traders_list");
  viewModel.loadTraders();

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