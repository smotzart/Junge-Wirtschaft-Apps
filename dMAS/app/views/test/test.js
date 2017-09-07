"use strict";
var testModel = require("./test-model");

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext  = new testModel.testModel1();
}
exports.pageLoaded = pageLoaded;