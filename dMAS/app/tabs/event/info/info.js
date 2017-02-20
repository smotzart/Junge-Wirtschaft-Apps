"use strict";

var thisView;

function onTabLoaded(args) {
  thisView = args.object;
}
exports.onTabLoaded = onTabLoaded;

function onTabUnloaded(args) {
  thisView = null;
}
exports.onTabUnloaded = onTabUnloaded;
