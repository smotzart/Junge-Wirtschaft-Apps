"use strict";

var thisTab;

function onTabLoaded(args) {    
    thisTab = args.object;
}
exports.onTabLoaded = onTabLoaded;

function onTabUnloaded(args) {
    thisTab = null;
}
exports.onTabUnloaded = onTabUnloaded;
