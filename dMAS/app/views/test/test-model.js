"use strict";

var Base  = require("~/components/common/base-view-model");
var frame = require("tns-core-modules/ui/frame");

var testModel1 = (function (_super) {
  __extends(testModel1, _super);
  function testModel1() {
    _super.call(this);  }
 
  testModel1.prototype.onOpenDrawerTap = function () {
    var sideDrawer = frame.topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
  };
  testModel1.prototype.onCloseDrawerTap = function () {
    var sideDrawer = frame.topmost().getViewById("sideDrawer");
    sideDrawer.closeDrawer();
  }; 
  return testModel1;
}(Base.BaseViewModel));
exports.testModel1 = testModel1;
