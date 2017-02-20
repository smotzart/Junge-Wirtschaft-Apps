"use strict";

var tabView     = require("ui/tab-view");
var Nav         = require("~/utils/navigation/navigation");
var viewsModule = require("~/utils/views/views");

var THIS_TAB_IDX = 3;
var thisTab;
var thisContent;

function onTabLoaded(args) {    
  thisTab = args.object;
  thisTab.parent.on(tabView.TabView.selectedIndexChangedEvent, onTabChange);
  thisContent = thisTab.page.bindingContext;
  thisTab.bindingContext = thisContent;
}
exports.onTabLoaded = onTabLoaded;

function onTabUnloaded(args) {
    thisTab.parent.off(tabView.TabView.selectedIndexChangedEvent, onTabChange);
    thisTab = null;
}
exports.onTabUnloaded = onTabUnloaded;

function loadExhibitors() {
  if (typeof(thisContent.exhibitorsCount) != 'undefined') {
    return;
  }
  setTimeout(function() {
    thisContent.loadExhibitors();
  }, 200);  
}

function onTabChange(args) {
  if (args.newIndex === THIS_TAB_IDX) {
      loadExhibitors();
  }
}

function goToTrader(args) {
  Nav.navigate({
    moduleName: viewsModule.Views.traderView,
    context: {
      model: args.view.bindingContext,
      eventName: thisContent.event.name
    }
  });
}
exports.goToTrader = goToTrader;