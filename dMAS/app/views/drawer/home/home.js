"use strict";

var viewModel;
var frame = require("tns-core-modules/ui/frame");

function navigatingTo(args) {
  var page = args.object;
  viewModel = page.navigationContext;
  viewModel.menuIndex = 0;
  page.bindingContext = null;
  page.bindingContext = viewModel;
}
exports.navigatingTo = navigatingTo;

function goToInfoPage(args) {
  frame.topmost().navigate({
    moduleName: "views/drawer/info/info",
    context: viewModel
  });
}
exports.goToInfoPage = goToInfoPage;