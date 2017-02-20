"use strict";
var TabView = require("ui/tab-view");
var imageModule = require("ui/image");
var stackLayout = require("ui/layouts/stack-layout");

var tabView_ = new TabView.TabView();
var items = [];


var THIS_TAB_IDX = 6;
var thisView;
var thisModel;
var halls;

function onTabChange(args) {
    if (args.newIndex === THIS_TAB_IDX) {
        halls = thisModel.event.event_halls;
        buildTabs();
    }
}

function buildTabs() {
    if (halls.length < 1) {
        return;
    }
    var layout = thisView.page.getViewById("test");
    layout.removeChildren();
    tabView_.items = new Array();
    for (var i = 0; i < halls.length; i++) {
        var stL =  new stackLayout.StackLayout();
        var img = new imageModule.Image();
        img.src = halls[i].file_url;
        img.stretch = "aspectFill";
        stL.addChild(img);
        var tabEntry = {
            title: halls[i].title,
            view: stL
        }
        tabView_.items.push(tabEntry);
    }
    tabView_.tabsBackgroundColor = "white"; 
    tabView_.selectedColor = "#d0021b"; 
    tabView_.selectedIndex = 0;
    
    layout.addChild(tabView_);
}

function onTabLoaded(args) {
    thisView = args.object;
    thisModel = thisView.page.bindingContext;
    thisView.parent.on(TabView.TabView.selectedIndexChangedEvent, onTabChange);
}
exports.onTabLoaded = onTabLoaded;

function onTabUnloaded(args) {
    thisView.parent.off(TabView.TabView.selectedIndexChangedEvent, onTabChange);
    thisView = null;
}
exports.onTabUnloaded = onTabUnloaded;