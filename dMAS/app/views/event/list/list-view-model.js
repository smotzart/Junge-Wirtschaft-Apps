"use strict";

var Base        = require("~/components/common/base-view-model");
var Detail      = require("~/views/event/detail/detail-view-model");
var Nav         = require("~/utils/navigation/navigation");
var Service     = require("~/utils/service/service");
var viewsModule = require("~/utils/views/views");
var moment      = require('moment');

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
  Object.defineProperty(ListModel.prototype, "selectedCat", {
    get: function () {
      return this._selectedCat;
    },
    set: function (value) {
      if (this._selectedCat != value) {
        this._selectedCat = value;
        this.notifyPropertyChange("selectedCat", value);
        //this.refresh();
      }
    },
    enumerable: true,
    configurable: true
  });    
  ListModel.prototype.refresh = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    var getEvents = getByFilter(this.selectedCat);
    getEvents.then(function (data) {
      var events = new Array();
      var month_index = new Array();
      for (var i = 0; i < data.length; i++) {
        var month = moment(data[i].starts_at).get('month');
        var mi = month_index.indexOf(month);
        if (mi == -1) {
          month_index.push(month);
          mi = month_index.indexOf(month);
          events[mi] = {
            "month_name": moment().month(month).format('MMMM').toUpperCase(),
            "list": new Array()
          };
        }
        events[mi].list.push(new Detail.DetailModel(data[i]));
        }
      _this.events = events;
      _this.endLoading();
    }, function (error) {
      _this.endLoading();
    });
  };
  return ListModel;
}(Base.BaseViewModel));
exports.ListModel = ListModel;

function getByFilter(selectedCat) {
  switch (selectedCat) {
    case 0:
      return Service.service.getAllEvents();
    case 1:
      return Service.service.getPublicEvents();
    case 2:
      return Service.service.getTraderEvents();
    default:
      return Service.service.getConferenseEvents();
  }
}
