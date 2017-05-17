"use strict";
var trader;

var navigationModule = require("~/utils/navigation/navigation");

function navigatingTo(args) {
  var page = args.object;
  trader = page.navigationContext;
  page.bindingContext = null;
  page.bindingContext = trader;
}
exports.navigatingTo = navigatingTo;

function goBack(args) {
  navigationModule.goBack();
}
exports.goBack = goBack;
