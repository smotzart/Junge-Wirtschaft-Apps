"use strict";
var frameModule = require("ui/frame");
frameModule.Frame.defaultTransition = {
  name: "slideLeft"
}

function navigate(navigationEntry) {
  var topmost = frameModule.topmost();
  topmost.navigate(navigationEntry);
}
exports.navigate = navigate;

function goBack() {
  var topmost = frameModule.topmost();
  topmost.goBack();
}
exports.goBack = goBack;