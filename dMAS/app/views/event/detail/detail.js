"use strict";

var Nav = require("~/utils/navigation/navigation");
var thisModel;
var page;

function navigatingTo(args) {
    page = args.object;
    thisModel = page.navigationContext;
    page.bindingContext = thisModel;
}
exports.navigatingTo = navigatingTo;

function goBack(args) {
    Nav.goBack();
}
exports.goBack = goBack;