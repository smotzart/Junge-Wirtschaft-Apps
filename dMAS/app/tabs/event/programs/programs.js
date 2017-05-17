"use strict";

var closeTimeout2 = 0;

function inputTap2 (args) {
  if (closeTimeout2) {
    clearTimeout(closeTimeout2);
  }
  closeTimeout2 = setTimeout(() => {
    closeTimeout2 = 0;
  }, 20);
}
exports.inputTap2 = inputTap2;

function tap2 (args) {
  var page = args.object.page;
  if (!closeTimeout2) {
    closeTimeout2 = setTimeout(() => {
      page.getViewById("search2").dismissSoftInput();
      closeTimeout2 = 0;
    }, 20);
  }
}
exports.tap2 = tap2;

function doNotShowAndroidKeyboard(args) {
  var searchBar = args.object;
  if (searchBar.android) {
    searchBar.android.clearFocus();
  }
}
exports.doNotShowAndroidKeyboard = doNotShowAndroidKeyboard;
