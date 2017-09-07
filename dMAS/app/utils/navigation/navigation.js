"use strict";
var frameModule = require("tns-core-modules/ui/frame");
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

function openPage(view) {
  var url = view.tag;
  //alert(view.page.bindingContext);
  //return;
  var topmost = frameModule.topmost();
  if (url) {
    if (topmost.currentEntry.moduleName !== url) {
      topmost.navigate({
        moduleName: url,
        context: view.page.bindingContext
      });
    }
  }
}
exports.openPage = openPage;