"use strict";

var constantsModule     = require("~/utils/constants/constants");
var notificationsModule = require("~/utils/notifications/notifications");
var Sqlite              = require("nativescript-sqlite");
var Connectivity        = require("connectivity");

var EVENT   = 'Events';
var ACTION  = 'Actions';
var HALL    = 'Places';
var TRADER  = 'Traders';
var USER    = 'Users';

var Service = (function () {
    
    function Service() {

    }  
    Service.prototype.getEventsByCat = function (category) {
      switch (category) {
        case 0:
          return this.getEvents("");
        case 1:
          return this.getEvents("Publikumsmesse");
        case 2:
          return this.getEvents("Fachmessen");
        default:
          return this.getEvents("Kongresse");
      }
    };
    Service.prototype.getEvents = function (category) {
      var query = "SELECT * FROM Events ORDER BY `starts_at`";
      if (category != "") {
        query = "SELECT * FROM Events WHERE category IN ('" + category + "') ORDER BY `starts_at`";
      } 
      return new Promise(function (resolve, reject) {
        (new Sqlite("messewels.db")).then(db => {
          db.resultType(2);
          db.all(query).then(rows => {
            resolve(rows);
          }, error => {
            Service.showErrorAndReject(error, reject);
          });
        }, error => {
          Service.showErrorAndReject(error, reject);
        });
      });
    };
    Service.prototype.getEventById = function (event_id) {
      return new Promise(function (resolve, reject) {
        (new Sqlite("messewels.db")).then(db => {
          db.resultType(2);
          db.get("SELECT * FROM Events WHERE id = ?", [event_id]).then(row => {
            //alert(JSON.stringify(row));
            resolve(row);
          }, error => {
            Service.showErrorAndReject(error, reject);
          });
        }, error => {
          Service.showErrorAndReject(error, reject);
        });
      });
    };
    Service.showErrorAndReject = function (error, reject) {
        notificationsModule.showError(error.message);
        reject(error);
    };

    Service.prototype.getPlacesByEvent = function (event_id) {
      return new Promise(function (resolve, reject) {
        (new Sqlite("messewels.db")).then(db => {
          db.resultType(2);
          db.all("SELECT * FROM Places WHERE event_id = ? ORDER BY or_id", [event_id]).then(rows => {
            resolve(rows);
          }, error => {
            Service.showErrorAndReject(error, reject);
          });
        }, error => {
          Service.showErrorAndReject(error, reject);
        });
      });
    };
    
    Service.prototype.getActionsByEvent = function (event_id) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        (new Sqlite("messewels.db")).then(db => {
          db.resultType(2);
          db.all("SELECT * FROM Actions WHERE event_id = ? ORDER BY starts_at", [event_id]).then(rows => {
            resolve(rows);
          }, error => {
            Service.showErrorAndReject(error, reject);
          });
        }, error => {
          Service.showErrorAndReject(error, reject);
        });
      });
    };

    Service.prototype.getTradesByEvent = function (event_id) {
      return new Promise(function (resolve, reject) {
        (new Sqlite("messewels.db")).then(db => {
          db.resultType(2);
          db.all("SELECT * FROM Traders WHERE event_id = ? ORDER BY company", [event_id]).then(rows => {
            resolve(rows);
          }, error => {
            Service.showErrorAndReject(error, reject);
          });
        }, error => {
          Service.showErrorAndReject(error, reject);
        });
      });
    };

    Service.prototype.getUsersByAction = function (action_id) {
      return new Promise(function (resolve, reject) {
        (new Sqlite("messewels.db")).then(db => {
          db.resultType(2);
          db.all("SELECT * FROM Users WHERE action_id = ?", [action_id]).then(rows => {
            resolve(rows);
          }, error => {
            Service.showErrorAndReject(error, reject);
          });
        }, error => {
          Service.showErrorAndReject(error, reject);
        });
      });
    };
    
    Service.prototype.update = function (data) {
      //return false;
      if (Connectivity.getConnectionType() === Connectivity.connectionType.none) {
        return false;
      }/*
      return fetch("https://login.dmas.at/api/v5/ios/events.json?presenter_id=122400")
        .then(handleErrors)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {*/
      if (!Sqlite.exists("messewels.db")) {
        Sqlite.copyDatabase("messewels.db");
      }
      (new Sqlite("messewels.db")).then(db => {
        data.forEach(function(event) {
          db.execSQL("INSERT OR REPLACE INTO Events (id, or_id, category, city, country, description, ends_at, latitude, location_details, longitude, name, place, products, route, starts_at, summary, zip, banner_url) VALUES ((SELECT id FROM Events WHERE or_id = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [event.id, event.id, event.category, event.city, event.country, event.description, event.ends_at, event.latitude, event.location_details, event.longitude, event.name, event.place, event.products, event.route, event.starts_at, event.summary, event.zip, event.banner_url]).then(id => {  
            var event_id = id;
            // Insert Traders
            event.exhibitors.forEach(function(trader) {
              db.execSQL("INSERT OR REPLACE INTO Traders (id, event_id, or_id, tag, products, stand, address, city, company, country, email, website, zip, image_url) VALUES ((SELECT id FROM Traders WHERE or_id = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [trader.id, event_id, trader.id, trader.tag, trader.products, trader.stand, trader.user.address, trader.user.city, trader.user.company, trader.user.country, trader.user.email, trader.user.website, trader.user.zip, trader.user.image_url]).then(id => {}, error => {
                console.log("INSERT Traders ERROR", error);
              });
            });
            // Insert Places
            event.event_halls.forEach(function(place) {
              db.execSQL("INSERT OR REPLACE INTO Places (id, event_id, or_id, title, file_url) VALUES ((SELECT id FROM Places WHERE or_id = ?), ?, ?, ?, ?)", [place.id, event_id, place.id, place.title, place.file_url]).then(id => {}, error => {
                console.log("INSERT Places ERROR", error);
              });
            });
            // Insert Actions
            event.event_actions.forEach(function(action) {
              db.execSQL("INSERT OR REPLACE INTO Actions (id, event_id, or_id, description, ends_at, group_name, languages, location, starts_at, title) VALUES ((SELECT id FROM Actions WHERE or_id = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?)", [action.id, event_id, action.id, action.description, action.ends_at, action.group_name, action.languages, action.location, action.starts_at, action.title]).then(id => {
                var action_id = id;
                // Insert Actions Users
                action.users.forEach(function(user) {
                  db.execSQL("INSERT OR REPLACE INTO Users (id, action_id, or_id, first_name, gender, last_name, position, title, name, image_url) VALUES ((SELECT id FROM Users WHERE or_id = ? AND action_id = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?)", [user.id, action_id, action_id, user.id, user.first_name, user.gender, user.last_name, user.position, user.title, user.name, user.image_url]).then(id => {}, error => {
                    alert("INSERT Users ERROR", error);
                  });
                });
              }, error => {
                alert("INSERT Actions ERROR " + error);
              });
            });
          }, error => {
            console.log("INSERT Events ERROR", error);
          });
        });
      });

        //});
    };
    Service.prototype.updateFav = function (id, value, tableName) {
      return new Promise(function (resolve, reject) {
        (new Sqlite("messewels.db")).then(db => {
          db.execSQL("UPDATE " + tableName + " SET fav = ? WHERE id = ?", [value, id]).then(id => {
            resolve(id);
          }, error => {
            Service.showErrorAndReject(error, reject);
          });
        }, error => {
          Service.showErrorAndReject(error, reject);
        });
      });
    };
    return Service;
}());

exports.Service = Service;
exports.service = new Service();


function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};