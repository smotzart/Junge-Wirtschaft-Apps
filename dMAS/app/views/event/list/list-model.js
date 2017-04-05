"use strict";

var Base          = require("~/components/common/base-view-model");
var Service       = require("~/utils/service/service");
var Detail        = require("./detail-model");
var Sqlite        = require("nativescript-sqlite");
var Moment        = require('moment');
var Timer         = require("timer");

var ListModel = (function (_super) {
  __extends(ListModel, _super);
  function ListModel() {
    _super.call(this);
    this._selectedCat = 0;
  }
  Object.defineProperty(ListModel.prototype, "events", {
    get: function () {
      return this._events;
    },
    set: function (value) {
      if (this._events != value) {
        this._events = value;
        this.notifyPropertyChange("events", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ListModel.prototype, "events_count", {
    get: function () {
      if (this.events) {
        return this.events.length;
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ListModel.prototype, "selectedCat", {
    get: function () {
      return this._selectedCat;
    },
    set: function (value) {
      if (this._selectedCat != value) {
        this._selectedCat = value;
        this.notifyPropertyChange("selectedCat", value);
      }
    },
    enumerable: true,
    configurable: true
  });    
  ListModel.prototype.refresh = function () {
    //alert("start refresh");
    var _this = this;
    if (!this.beginLoading()) {
      //alert("return");
      return;
    };
    var getEvents = Service.service.getEventsByCat(_this.selectedCat);
    getEvents.then(function (data) {
      Timer.setTimeout(() => {
        //alert(data.length + "-" + _this.selectedCat);
        if (data.length == 0 && _this.selectedCat == 0) {
          //_this.endLoading();
          //alert(" asuda");
          _this.refresh();
        }
        var events = new Array();
        var month_index = new Array();
        for (var i = 0; i < data.length; i++) {
          var month = Moment(data[i].starts_at).get('month');
          var mi = month_index.indexOf(month);
          if (mi == -1) {
            month_index.push(month);
            mi = month_index.indexOf(month);
            events[mi] = {
              "month_name": Moment().month(month).format('MMMM').toUpperCase(),
              "list": new Array()
            };
          }
          events[mi].list.push(new Detail.DetailShortModel(data[i]));
        }
        _this.set("events", events);     
        _this.endLoading();
      }, 500);
    }, function (error) {
      _this.endLoading();
    });
  };
  
  ListModel.prototype.update = function () {
    /*
    if (Connectivity.getConnectionType() === Connectivity.connectionType.none) {
      return false;
    }  
    var _this = this;
    if (!this.beginLoading())
      return;
    return fetchModule("https://login.dmas.at/api/v5/ios/events.json?presenter_id=58")
      .then(handleErrors)
      .then(function(response) {
        alert("banana3");
        return response.json();
      })
      .then(function(data) {
        alert("banana1");
      });*/
  };
  return ListModel;
}(Base.BaseViewModel));
exports.ListModel = ListModel;


function handleErrors(response) {
  alert("?");
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};
