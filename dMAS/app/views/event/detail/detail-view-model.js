"use strict";

var Base        = require("~/components/common/base-view-model");
var Trade       = require("~/views/event/detail/trader-view-model");
var Action      = require("~/views/event/detail/action-view-model");
var Nav         = require("~/utils/navigation/navigation");
var viewsModule = require("~/utils/views/views");
var Service     = require("~/utils/service/service");
var moment      = require('moment');
moment.locale('de');

var DetailModel = (function (_super) {
  __extends(DetailModel, _super);
  function DetailModel(event) {
    _super.call(this);
    this.event = event;
  }
  Object.defineProperty(DetailModel.prototype, "event", {
    get: function () {
      return this._event;
    },
    set: function (value) {
      if (this._event != value) {
        this._event = value;
        this.notifyPropertyChange("event", value);
      }
    },
    enumerable: true,
    configurable: true
  });    
  Object.defineProperty(DetailModel.prototype, "event_actions", {
    get: function () {
      return this._event_actions;
    },
    set: function (value) {
      if (this._event_actions != value) {
        this._event_actions = value;
        this.notifyPropertyChange("event_actions", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "start", {
    get: function () {            
      if (this.event.starts_at) {                
        var starts_at_format = moment(this.event.starts_at).year() == moment(this.event.ends_at).year() ? "dd, D. MMM" : "dd, D. MMM YYYY" 
        return moment(this.event.starts_at).format(starts_at_format);
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "end", {
    get: function () {     
      if (this.event.ends_at) {                
        return moment(this.event.ends_at).format("dd, D. MMM YYYY");
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "event_halls", {
    get: function () {
      return this._event_halls;
    },
    set: function (value) {
      if (this._event_halls != value) {
        this._event_halls = value;
        this.notifyPropertyChange("event_halls", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "exhibitors", {
    get: function () {
      return this._exhibitors;
    },
    set: function (value) {
      if (this._exhibitors != value) {
        this._exhibitors = value;
        this.notifyPropertyChange("exhibitors", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "event_time", {
    get: function () {
      if (this.event.starts_at && this.event.ends_at) {
        return moment(this.event.starts_at).format("HH.mm") + ' - ' + moment(this.event.ends_at).format("HH.mm");
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "selectedProduct", {
    get: function () {
      return this._selectedProduct;
    },
    set: function (value) {
      if (this._selectedProduct != value) {
        this._selectedProduct = value;
        this.notifyPropertyChange("selectedProduct", value);
        this.loadExhibitors();
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "event_date", {
    get: function () {
      if (this.event.starts_at && this.event.ends_at) {
        var starts_at_format = moment(this.event.starts_at).month() == moment(this.event.ends_at).month() ? "D.-" : "D. MMMM YYYY-"
        var start = moment(this.event.starts_at).format(starts_at_format);
        var end = moment(this.event.ends_at).format("D. MMMM YYYY");
        return start + '' + end;
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "products", {
    get: function () {
      var source = this.event.products;
      var ne = source.split('\n');

      var ne2 = new Array();
      var ne3 = undefined;

      for (var j = 0; j < ne.length; j++) {
        if (ne[j].charAt(0) != '-') {
          if (typeof(ne3) !== 'undefined') {
            ne2.push(ne3);
          }      
          var ne3 = {};
          ne3.cat_name = ne[j].toUpperCase();
          ne3.values = new Array();
        } else {
          if (ne[j].substring(0,4) != '- - ') {
            var re = '- ';
            ne[j] = ne[j].replace(re, '');
            ne3.values.push(ne[j]);
          }
        }
      }
      ne2.push(ne3);
      return ne2;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "exhibitorsCount", {
    get: function () {
      if (this.exhibitors) {
        return this.exhibitors.length;
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "actionsCount", {
    get: function () {
      if (this.event_actions) {
        return this.event_actions.length;
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  DetailModel.prototype.detailView = function (args) {
    Nav.navigate({
      moduleName: viewsModule.Views.eventView,
      context: args.view.bindingContext,
    });
  };
  DetailModel.prototype.traderView = function (args) {
    Nav.navigate({
      moduleName: viewsModule.Views.traderView,
      context: {
        model: args.view.bindingContext,
        eventName: this.event.name
      }
    });
  };
  DetailModel.prototype.programView = function (args) {
    Nav.navigate({
      moduleName: viewsModule.Views.programView,
      context: {
        model: args.view.bindingContext,
        eventName: this.event.name
      }
    });
  };
  DetailModel.prototype.refresh = function () {
      //alert("refresh");
  };
  DetailModel.prototype.loadExhibitors = function () {
    var _this = this;
    if (!this.beginLoading())
        return;
    var getExhibitors = Service.service.getExhibitorsByEvent(this.event.Id);
    getExhibitors.then(function (data) {
      var exhibitors = new Array();
      var data = data[0].exhibitors;
      for (var i = 0; i < data.length; i++) {
        exhibitors.push(new Trade.TraderViewModel(data[i]));
      }
      exhibitors = exhibitors.sort(function(a, b) {
        var nameA = a.trader.user.company.toUpperCase();
        var nameB = b.trader.user.company.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
      });
      _this.exhibitors = exhibitors;
      _this.endLoading();
    }, function (error) {
      _this.endLoading();
    });
  };
  
  DetailModel.prototype.loadHalls = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    var event_halls = new Array();
    var data = _this.event.event_halls;
    for (var i = 0; i < data.length; i++) {
      event_halls.push(data[i]);
    }
    _this.event_halls = event_halls;
    _this.endLoading();
  };

  DetailModel.prototype.loadActions = function () {
    var _this = this;
    if (!this.beginLoading())
        return;
    var getActions = Service.service.getActionsByEvent(this.event.Id);
    getActions.then(function (data) {
      var event_actions = new Array();
      var day_index = new Array();
      var data = data[0].event_actions;
      for (var i = 0; i < data.length ; i++) {
        if (!Array.isArray(data[i].languages)) {
          data[i].languages = data[i].languages.split(",");
        }
        var day = moment(data[i].starts_at).dayOfYear();
        var di = day_index.indexOf(day);
        if (di == -1) {
          day_index.push(day);
          di = day_index.indexOf(day);
          event_actions[di] = {
            "day_name": moment(data[i].starts_at).format("D. MMMM YYYY"),
            "list": new Array()
          };
        }
        event_actions[di].list.push(new Action.ActionViewModel(data[i]));
      }
      _this.event_actions = event_actions;
      _this.endLoading();
    }, function (error) {
      _this.endLoading();
    });
  };
  return DetailModel;
}(Base.BaseViewModel));

exports.DetailModel = DetailModel;
