"use strict";
var viewModel;

var item;
var places;
var place_view;

var app         = require("application");
var timer       = require("timer");
var TabView     = require("ui/tab-view");
var imageModule = require("ui/image");
var stackLayout = require("ui/layouts/stack-layout");
var segmentedBarModule = require("ui/segmented-bar");

var navigationModule = require("~/utils/navigation/navigation");
var frame = require("tns-core-modules/ui/frame");

function navigatingTo(args) {
  var page = args.object;
  place_view = page.getViewById("test");
  viewModel = page.navigationContext;
  viewModel.menuIndex = 6;
  viewModel.loadPlaces();
  buildTabs();
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


function buildTabs() {
  timer.setTimeout(() => {   
    places = viewModel.event_places;
    if (places.length < 1) {
      return;
    }
    place_view.removeChildren();
    if (app.ios) {
      var segmentedBar = new segmentedBarModule.SegmentedBar();
      var segmentedItems = [];
      for (var i = 0; i < places.length; i++) {
        var item_ = new segmentedBarModule.SegmentedBarItem();
        item_.title = places[i].title;
        segmentedItems.push(item_);
      }
      segmentedBar.items = segmentedItems;   
      segmentedBar.cssClass = 'ios-segmented-bar';
      segmentedBar.selectedIndex = 0;
      segmentedBar.id = "olo";
      place_view.addChild(segmentedBar);

      var stL =  new stackLayout.StackLayout();
      var img = new imageModule.Image();
      img.src = places[segmentedBar.selectedIndex].file_url;
      img.stretch = "aspectFill";
      stL.addChild(img);
      place_view.addChild(stL);

      segmentedBar.on(segmentedBarModule.SegmentedBar.selectedIndexChangedEvent, function (args) {
        img.src = places[args.newIndex].file_url;
      });

    }
    if (app.android) {
      var tabView_    = new TabView.TabView();
      tabView_.items = new Array();
      for (var i = 0; i < places.length; i++) {
        var stL =  new stackLayout.StackLayout();
        var img = new imageModule.Image();
        img.src = places[i].file_url;
        img.stretch = "aspectFill";
        stL.addChild(img);
        var tabEntry = {
          title: places[i].title,
          view: stL
        }
        tabView_.items.push(tabEntry);
      }
      tabView_.tabsBackgroundColor = "white"; 
      tabView_.selectedColor = "#d0021b"; 
      tabView_.selectedIndex = 0;
      tabView_.id = "olo";
      place_view.addChild(tabView_);
    }
  }, 3000);
}