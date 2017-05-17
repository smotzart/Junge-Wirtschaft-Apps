"use strict";

function productTap(args) {  
  var view = args.object;
  var content = view.page.bindingContext;
  var tabs = view.page.getViewById("eventTabs");
  tabs.selectedIndex = 3;
  content.traders_search = args.view.bindingContext;
}
exports.productTap = productTap;