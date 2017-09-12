"use strict";
var viewModel;

var navigationModule = require("~/utils/navigation/navigation");

function navigatingTo(args) {
  var page = args.object;
  viewModel = page.navigationContext;
  viewModel.menuIndex = 1;
  page.bindingContext = null;
  page.bindingContext = viewModel;
}
exports.navigatingTo = navigatingTo;

function goBack(args) {
  navigationModule.goBack();
}
exports.goBack = goBack;
