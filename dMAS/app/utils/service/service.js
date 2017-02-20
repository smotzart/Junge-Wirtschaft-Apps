"use strict";
var constantsModule = require("~/utils/constants/constants");
var notificationsModule = require("~/utils/notifications/notifications");
var Everlive = require('everlive-sdk');
var connectivity = require("connectivity");

var EVENT = 'Events';
var ACTION = 'EventActions';
var HALL = 'EventHalls';
var TRADER = 'EventTraders';
var TEST = 'Test';
var DEBUG = 'EventDebug';

var Service = (function () {
    function Service() {
      //this.everliveOffline();
    }
    Service.prototype.clearEverlive = function () {
        if (this._everlive) {
            this._everlive = null;
        }
    };
    Service.prototype.getAllEvents = function () {
        return this.getEventsByCategory("Alle");
    };
    Service.prototype.getPublicEvents = function () {
        return this.getEventsByCategory("Publikumsmessen,Publikumsmesse");
    };
    Service.prototype.getTraderEvents = function () {
        return this.getEventsByCategory("Fachmessen");
    };
    Service.prototype.getConferenseEvents = function () {
        return this.getEventsByCategory("Kongresse");
    };    
    Service.prototype.createEverlive = function () {
        if (!this._everlive) {
          this._everlive = new Everlive({
            apiKey: constantsModule.telerikApiKey,
            offlineStorage: true,
            offline: {
              storage: {
                provider: Everlive.Constants.StorageProvider.FileSystem
              }
            }
          });
        }
        if (connectivity.getConnectionType() === connectivity.connectionType.none) {
          this._everlive.offline();
        } else {
          if (this._everlive.isOffline) {
            this._everlive.online();
          }
        }
        return this._everlive;
    };

    Service.showErrorAndReject = function (error, reject) {
        notificationsModule.showError(error.message);
        reject(error);
    };
    
    Service.prototype.createEvent = function (event) {
        return this.createItem(EVENT, event);
    };
    Service.prototype.updateEvent = function (event) {
        return this.updateItem(EVENT, event);
    };
    Service.prototype.createAction = function (action) {
        return this.createItem(ACTION, action);
    };
    Service.prototype.updateAction = function (action) {
        return this.updateItem(ACTION, action);
    };
    Service.prototype.createHall = function (hall) {
        return this.createItem(HALL, hall);
    };
    Service.prototype.updateHall = function (hall) {
        return this.updateItem(HALL, hall);
    };
    Service.prototype.createTrader = function (trader) {
        return this.createItem(TRADER, trader);
    };
    Service.prototype.updateTrader = function (trader) {
        return this.updateItem(TRADER, trader);
    };

    Service.prototype.createItem = function (dataName, item) {
        var _this = this;
        item['api_id'] = item['id'];
        item['publish'] = false;
        delete item['id'];

        var event = new Promise(function (resolve, reject) {
            var everlive = _this.createEverlive();           
            var row = _this.getItem(DEBUG, item['api_id']);
            row.then(function(data){
              if (data.length > 0) {
                item = Object.assign(data[0], item);
              }
              everlive.data(DEBUG).save(item, function (result) {
                //alert(JSON.stringify(result));
                resolve(result);
              }, function (error) {
                Service.showErrorAndReject(error, reject);
              });
            });
        });
        
    };
    Service.prototype.updateItem = function (dataName, item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var everlive = _this.createEverlive();
            everlive.data(dataName).updateSingle(item, resolve, function (error) {
                Service.showErrorAndReject(error, reject);
            });
        });
    };
    Service.prototype.getItem = function (dataName, item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var everlive = _this.createEverlive();
            everlive.data(dataName).get({'api_id': item}).then(function (data) {
                resolve(data.result);
            }, function (error) {
                Service.showErrorAndReject(error, reject);
            });
        });
    };
    Service.prototype.getEventsByCategory = function (category) {
        var query = new Everlive.Query();
        if (category !== "Alle") {
          category = category.split(',');
          query
            .select('summary', 'zip', 'banner_url', 'event_halls', 'location_details', 'place', 'name', 'products', 'route', 'category', 'city', 'country', 'description', 'ends_at', 'starts_at', 'api_id')
            .where()
            .eq("publish", true)
            .isin("category", category)
            .done();
        } else {
          query
            .select('summary', 'zip', 'banner_url', 'event_halls', 'location_details', 'place', 'name', 'products', 'route', 'category', 'city', 'country', 'description', 'ends_at', 'starts_at', 'api_id')
            .where()
            .eq("publish", true)
            .done();
        }
        return this.getEvents(query);
    };
    Service.prototype.getEvents = function (query) {
        var _this = this;        
        return new Promise(function (resolve, reject) {
            query.order("starts_at");
            var everlive = _this.createEverlive();
            everlive.data(DEBUG).get(query).then(function (data) {
              //alert(JSON.stringify(data));
                resolve(data.result);
            }, function (error) {
                Service.showErrorAndReject(error, reject);
            });
        });
    };
    
    Service.prototype.getExhibitorsByEvent = function (event) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        var query = new Everlive.Query();
        var everlive = _this.createEverlive();
        query
          .select('exhibitors')
          .where()
          .eq('Id', event)
          .done();
        everlive.data(DEBUG).get(query).then(function (data) {
          //alert(JSON.stringify(data.result.exhibitors));
          resolve(data.result);
        }, function (error) {
          Service.showErrorAndReject(error, reject);
        });
      });
    };

    Service.prototype.getActionsByEvent = function (event) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        var query = new Everlive.Query();
        var everlive = _this.createEverlive();
        query
          .select('event_actions')
          .where()
          .eq('Id', event)
          .done();
        everlive.data(DEBUG).get(query).then(function (data) {
          resolve(data.result);
        }, function (error) {
          Service.showErrorAndReject(error, reject);
        });
      });
    };
    
    Service.prototype.getHallsByEvent = function (event) {
        var query = new Everlive.Query();
        query
            .where()
            .eq("Event", event.Id);
        return this.getHalls(query);
    };
    Service.prototype.getHalls = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            query.order("api_id");
            var everlive = _this.createEverlive();
            everlive.data('EventHalls').get(query).then(function (data) {
                resolve(data.result);
            }, function (error) {
                Service.showErrorAndReject(error, reject);
            });
        });
    };/*
    Service.prototype.getExhibitorsByEvent = function (event) {
        var query = new Everlive.Query();
        query
            .where()
            .eq("Event", event.Id);
        return this.getExhibitors(query);
    };*/
    Service.prototype.getExhibitors = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            query.order("api_id");
            var everlive = _this.createEverlive();
            everlive.data('EventTraders').get(query).then(function (data) {
                resolve(data.result);
            }, function (error) {
                Service.showErrorAndReject(error, reject);
            });
        });
    };
    /*
    Service.prototype.getActionsByEvent = function (event) {
        var query = new Everlive.Query();
        query
            .where()
            .eq("Event", event.Id);
        return this.getActions(query);
    };*/
    Service.prototype.getActions = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            query.order("api_id");
            var everlive = _this.createEverlive();
            everlive.data('EventActions').get(query).then(function (data) {
                resolve(data.result);
            }, function (error) {
                Service.showErrorAndReject(error, reject);
            });
        });
    };
    
    Service.prototype.updateDatabase = function (item) {
      var _this = this;
      item['api_id'] = item['id'];
      //item['publish'] = true;
      delete item['id'];

      var event = new Promise(function (resolve, reject) {
        var everlive = _this.createEverlive();           
        var row = _this.getItem(DEBUG, item['api_id']);
        row.then(function(data){
          if (data.length > 0) {
            item = Object.assign(data[0], item);
          }
          everlive.data(DEBUG).save(item, function (result) {
            resolve(result);
          }, function (error) {
            Service.showErrorAndReject(error, reject);
          });
        });
      });   

      //return this._everlive.offline();     
    };
    return Service;
}());

exports.Service = Service;
exports.service = new Service();
