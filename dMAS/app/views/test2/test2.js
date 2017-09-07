"use strict";
var testModel = require("./test-model2");

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext  = new testModel.testModel1();
}
exports.pageLoaded = pageLoaded;