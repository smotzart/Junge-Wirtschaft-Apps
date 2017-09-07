"use strict";
var viewModel;

var navigationModule = require("~/utils/navigation/navigation");
var frame = require("tns-core-modules/ui/frame");

function navigatingTo(args) {
  var page = args.object;
  viewModel = page.navigationContext;
  viewModel.menuIndex = 4;
  viewModel.loadProducts();
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

function productTap(args) {  
  viewModel.traders_search = args.view.bindingContext;
  frame.topmost().navigate({
    moduleName: "views/drawer/traders/traders",
    context: viewModel
  });
}
exports.productTap = productTap;