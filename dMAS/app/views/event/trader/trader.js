"use strict";
var viewModel;

var navigationModule = require("~/utils/navigation/navigation");
var utilityModule = require("utils/utils");

function navigatingTo(args) {
    var page = args.object;
    viewModel = page.navigationContext;
    page.bindingContext = null;
    page.bindingContext = viewModel;
}
exports.navigatingTo = navigatingTo;

function goBack(args) {
    navigationModule.goBack();
}
exports.goBack = goBack;


function visitWebsite(args) {
    var website = viewModel.model.trader.user.website;
    if (!website.match(/^[a-zA-Z]+:\/\//)) {
        website = 'http://' + website;
    }
    utilityModule.openUrl(website);
}
exports.visitWebsite = visitWebsite;


function sendEmail(args) {
    var email = viewModel.model.trader.user.email;
    email = 'mailto:' + email;
    utilityModule.openUrl(email);
}
exports.sendEmail = sendEmail;