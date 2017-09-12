"use strict";
var viewModel;
var page;

var navigationModule = require("~/utils/navigation/navigation");

function pageLoad(args) {
  page                = args.object;
  viewModel           = page.navigationContext;
  viewModel.menuIndex = 7;
  page.bindingContext = null;
  page.bindingContext = viewModel;
}
exports.pageLoad = pageLoad;

function goBack(args) {
  navigationModule.goBack();
}
exports.goBack = goBack;
