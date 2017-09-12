"use strict";

var Base          = require("~/components/common/base-view-model");
var Service       = require("~/utils/service/service");
var Detail        = require("./detail-model");
var Sqlite        = require("nativescript-sqlite");
var Moment        = require('moment');
var Timer         = require("timer");

var ListModel = (function (_super) {
  __extends(ListModel, _super);

  var refresh_i;
  function ListModel() {
    _super.call(this);
    this._selectedCat = 0;
    this.refresh_i = 0;
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
    var _this = this;
    if (!this.beginLoading()) {
      return;
    };
    var getEvents = Service.service.getEventsByCat(_this.selectedCat);
    getEvents.then(function (data) {
      Timer.setTimeout(() => {
        if (data.length == 0 && _this.selectedCat == 0 && _this.refresh_i < 15) {
          _this.refresh();
          _this.refresh_i++;
        }
        var events = new Array();
        var month  = 0;
        for (var i = 0; i < data.length; i++) {
          var c_month = Moment(data[i].starts_at).get('month');
          if (c_month != month) {
            events.push({'month': Moment().month(c_month).format('MMMM').toUpperCase()})
            month = c_month;
          }
          events.push(new Detail.DetailShortModel(data[i]));
        }
        _this.set("events", events);     
        _this.endLoading();
      }, 500);
    }, function (error) {
      _this.endLoading();
    });
  };
  return ListModel;
}(Base.BaseViewModel));
exports.ListModel = ListModel;
