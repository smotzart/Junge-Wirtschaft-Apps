"use strict";

var navigationModule = require("~/utils/navigation/navigation");

var action;

function navigatingTo(args) {
  var page = args.object;
  action = page.navigationContext;
  action.loadUsers();
  page.bindingContext = null;
  page.bindingContext = action;
}
exports.navigatingTo = navigatingTo;

function goBack(args) {
  navigationModule.goBack();
}
exports.goBack = goBack;