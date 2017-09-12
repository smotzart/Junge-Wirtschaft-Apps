"use strict";

var List          = require("./list-model");
var Sqlite        = require("nativescript-sqlite");
var ListModel     = new List.ListModel();

function pageLoad(args) {
  var page = args.object;
  
  if (!Sqlite.exists("jungedb.db")) {
    Sqlite.copyDatabase("jungedb.db");
  }
  (new Sqlite("jungedb.db")).then(db => {
    ListModel.refresh();
    page.bindingContext = ListModel;
  }, error => {
    console.log("OPEN DB ERROR", error);
  });
}
exports.pageLoad = pageLoad;

function onSelectedIndexChanged(args) {
  ListModel.selectedCat = args.newIndex;
  ListModel.refresh();
}
exports.onSelectedIndexChanged = onSelectedIndexChanged;


var appModule = require("application");
var dateConverter = function(value, format) {
  alert("sdf");
};

appModule.setResources("dateConverter", dateConverter);
appModule.setResources("dateFormat",  "DD.MM.YYYY");
