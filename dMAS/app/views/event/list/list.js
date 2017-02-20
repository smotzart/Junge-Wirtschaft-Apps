"use strict";

var List        = require("~/views/event/list/list-view-model");
var Nav         = require("~/utils/navigation/navigation");
var viewsModule = require("~/utils/views/views");
var viewModel   = new List.ListModel();
var page;

function onPageLoaded(args) {}
exports.onPageLoaded = onPageLoaded;

function navigatingTo(args) {
  page = args.object;
  page.bindingContext = viewModel;
}
exports.navigatingTo = navigatingTo;