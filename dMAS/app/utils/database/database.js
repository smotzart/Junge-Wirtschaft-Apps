"use strict";

var constMod = require("~/utils/constants/constants");
var notifMod = require("~/utils/notifications/notifications");
var sqlite  = require("nativescript-sqlite");

var EVENT  = 'Events2';
var ACTION = 'EventActions';
var HALL   = 'EventHalls';
var TRADER = 'EventTraders';


var Database = (function () {
    function Database() {
      
    }
    Database.prototype.initSqlite = function () {
      var database = new sqlite(constMod.dbName);      
      database.then(db => {
        this._db = db;
        alert("+++" + this._db);
      }, error => {
        console.log("OPEN DB ERROR", error);
      });
      return this._db;
    };
    Database.prototype.dropTables = function () {
      
      alert("try to srop all table if exist");
      var database = new sqlite(constMod.dbName);
      database.then(db => {
        db.execSQL("DROP TABLE IF EXISTS " + EVENT).then(id => {
          alert("TABLE EVENT DROPPED");
        }, error => {
          alert("TABLE EVENT no DROPPED");
        });
        db.execSQL("DROP TABLE IF EXISTS " + ACTION + " ", [], function(err) {
            alert("TABLE ACTION DROPPED");
        });
        db.execSQL("DROP TABLE IF EXISTS " + HALL + " ", [], function(err) {
            alert("TABLE HALL DROPPED");
        });
        db.execSQL("DROP TABLE IF EXISTS " + TRADER + " ", [], function(err) {
            alert("TABLE TRADER DROPPED");
        });
      }, error => {
        console.log("OPEN DB ERROR", error);
      });
      
    };
    Database.prototype.createTables = function () {
      this.createEventTable();
    };
    Database.prototype.createEventTable = function () {  
      var database = new sqlite(constMod.dbName);
      (new sqlite(constMod.dbName)).then(db => {
        db.execSQL("CREATE TABLE IF NOT EXISTS " + EVENT + " (id INTEGER PRIMARY KEY AUTOINCREMENT, or_id INT NOT NULL, category CHAR(100), city CHAR(100), country CHAR(10), description TEXT, ends_at CHAR(100), latitude REAL, location_details TEXT, longitude REAL, name TEXT, place CHAR(100), products TEXT, route TEXT, starts_at CHAR(100), summary TEXT, zip CHAR(20), banner_url TEXT)").then(id => {
          alert("TABLE " + EVENT + " CREATE");
          //this.createTraderTable();
        }, error => {
          console.log("CREATE " + EVENT + " TABLE ERROR", error);
        });
      }, error => {
        console.log("OPEN DB ERROR", error);
      });
    };    
    Database.prototype.createTraderTable = function () {
      alert("try to TABLE TRADER CREATE");
      this.db.execSQL("CREATE TABLE IF NOT EXISTS " + TRADER + " (id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INT NOT NULL, or_id INT NOT NULL, tag TEXT, products TEXT, stand CHAR(20), address TEXT, city CHAR(100), company CHAR(100), country CHAR(20), email CHAR(100), website CHAR(100), zip CHAR(20), image_url TEXT)").then(id => {
        alert("TABLE TRADER CREATE");
        this.createPlaceTable();
      }, error => {
        console.log("CREATE " + TRADER + " TABLE ERROR", error);
      });
    };
    Database.prototype.createPlaceTable = function () {
      alert("try to TABLE HALL CREATE");
      this.db.execSQL("CREATE TABLE IF NOT EXISTS " + HALL + " (id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INT NOT NULL, or_id INT NOT NULL, title TEXT, file_url TEXT)").then(id => {
        alert("TABLE HALL CREATE");
        this.createActionTable();
      }, error => {
        console.log("CREATE " + HALL + " TABLE ERROR", error);
      });
    };
    Database.prototype.createActionTable = function () {
      alert("try to TABLE ACTION CREATE");
      this.db.execSQL("CREATE TABLE IF NOT EXISTS " + ACTION + " (id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INT NOT NULL, or_id INTEGER, description TEXT, ends_at CHAR(100), group_name TEXT, languages CHAR(100), location CHAR(100), starts_at CHAR(100), title TEXT)").then(id => {
        alert("TABLE ACTION CREATE");
      }, error => {
        console.log("CREATE " + ACTION + " TABLE ERROR", error);
      });
    };
    return Database;
})();
exports.Database = Database;
exports.db = new Database();