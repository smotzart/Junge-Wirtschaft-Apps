"use strict";

var Utils = require("utils/utils");

var thisView;

function onTabLoaded(args) {
  thisView = args.object;
}
exports.onTabLoaded = onTabLoaded;

function onTabUnloaded(args) {
  thisView = null;
}
exports.onTabUnloaded = onTabUnloaded;

function goToInfoTab(args) {
  thisView.parent.selectedIndex = 1;
}
exports.goToInfoTab = goToInfoTab;

function openTicketUrl(args) {
  Utils.openUrl("http://www.oeticket.com/Tickets.html?affiliate=EOE&doc=artistPages%2Ftickets&fun=artist&action=tickets&erid=1759044&includeOnlybookable=false&xtmc=fishing_festival&xtnp=1&xtcr=1");
}
exports.openTicketUrl = openTicketUrl;