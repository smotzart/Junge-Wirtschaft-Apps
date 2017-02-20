"use strict";

var tabView     = require("ui/tab-view");
var Nav         = require("~/utils/navigation/navigation");
var viewsModule = require("~/utils/views/views");

var THIS_TAB_IDX = 5;
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

function loadActions() {
  if (typeof(thisContent.actionsCount) != 'undefined') {
    return;
  }
  setTimeout(function() {
    thisContent.loadActions();
  }, 200);  
}

function onTabChange(args) {
  if (args.newIndex === THIS_TAB_IDX) {
      loadActions();
  }
}

function goToProgram(args) {
  Nav.navigate({
    moduleName: viewsModule.Views.programView,
    context: {
      model: args.view.bindingContext,
      eventName: thisContent.event.name
    }
  });
}
exports.goToProgram = goToProgram;