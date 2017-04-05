"use strict";

var utils = require("utils/utils");
var View = require("ui/core/view");
var gestures = require("ui/gestures");

var item = View;

var density, prevDeltaX, prevDeltaY;
var startScale = 1;

var page;
var context;
var closeCallback;

function onLoaded(args) {    
    page = args.object;

    item = page.getViewById("item");
    density = utils.layout.getDisplayDensity();

    item.translateX = 0;
    item.translateY = 0;
    item.scaleX = 1;
    item.scaleY = 1;
}
exports.onLoaded = onLoaded;

function onUnloaded(args) {}
exports.onUnloaded = onUnloaded;

function onShownModally(args) {
    context = args.context;
    closeCallback = args.closeCallback;
    page.bindingContext = context;
}
exports.onShownModally = onShownModally;

function closeModally(args) {
    closeCallback();
}
exports.closeModally = closeModally;

function onPan(args) {
    if (args.state === 1) {
        prevDeltaX = 0;
        prevDeltaY = 0;
    }
    else if (args.state === 2) {
        item.translateX += args.deltaX - prevDeltaX;
        item.translateY += args.deltaY - prevDeltaY;

        prevDeltaX = args.deltaX;
        prevDeltaY = args.deltaY;
    }
}
exports.onPan = onPan;

function onPinch(args) {
    if (args.state === 1) {
        const newOriginX = args.getFocusX() - item.translateX;
        const newOriginY = args.getFocusY() - item.translateY;

        const oldOriginX = item.originX * item.getMeasuredWidth();
        const oldOriginY = item.originY * item.getMeasuredHeight();

        item.translateX += (oldOriginX - newOriginX) * (1 - item.scaleX);
        item.translateY += (oldOriginY - newOriginY) * (1 - item.scaleY);

        item.originX = newOriginX / item.getMeasuredWidth();
        item.originY = newOriginY / item.getMeasuredHeight();

        startScale = item.scaleX;
    }

    else if (args.scale && args.scale !== 1) {
        var newScale = startScale * args.scale;
        newScale = Math.min(8, newScale);
        newScale = Math.max(0.125, newScale);

        item.scaleX = newScale;
        item.scaleY = newScale;
    }
}
exports.onPinch = onPinch;

function onDoubleTap(args) {
    item.animate({
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        curve: "easeOut",
        duration: 300
    });
}
exports.onDoubleTap = onDoubleTap;
