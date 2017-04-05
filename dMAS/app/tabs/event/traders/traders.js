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