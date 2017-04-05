"use strict";

var Nav         = require("~/utils/navigation/navigation");
var viewsModule = require("~/utils/views/views");
var timer       = require("timer");
var TabView     = require("ui/tab-view");
var imageModule = require("ui/image");
var stackLayout = require("ui/layouts/stack-layout");

var tabView_    = new TabView.TabView();

var item;
var places;
var place_view;

function onPageLoaded(args) {
}
exports.onPageLoaded = onPageLoaded;

function navigatedTo(args) {  
  var page = args.object;
  item = args.context;
  item.traders_view = page.getViewById("traders_list");
  item.actions_view = page.getViewById("actions_list");
  place_view = page.getViewById("test");
  page.bindingContext = item;
}
exports.navigatedTo = navigatedTo;

function onSelectedIndexChanged(args) {
  if (args.newIndex == 3 && typeof item.event_traders_count == 'undefined') {
    item.loadTraders();
  }
  if (args.newIndex == 4 && typeof item.event_products_count == 'undefined') {
    item.loadProducts();
  }
  if (args.newIndex == 5 && typeof item.event_actions_count == 'undefined') {
    item.loadActions();
  }
  if (args.newIndex == 6 && typeof item.event_places_count == 'undefined') {
    item.loadPlaces();
    buildTabs();
  }
}
exports.onSelectedIndexChanged = onSelectedIndexChanged;

function goBack(args) {
  Nav.goBack();
}
exports.goBack = goBack;

function buildTabs() {
  timer.setTimeout(() => {   
    places = item.event_places;
    if (places.length < 1) {
      return;
    }
    place_view.removeChildren();
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
    tabView_.id = "olo"
    
    place_view.addChild(tabView_);
  }, 3000);
}