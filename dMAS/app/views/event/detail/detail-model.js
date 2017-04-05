"use strict";
var observable      = require("data/observable-array");
var Base            = require("~/components/common/base-view-model");
var Trade           = require("~/views/event/detail/trader-view-model");
var Action          = require("~/views/event/detail/action-view-model");
var Nav             = require("~/utils/navigation/navigation");
var viewsModule     = require("~/utils/views/views");
var Service         = require("~/utils/service/service");
var moment          = require('moment');
var timer           = require("timer");
var Utils           = require("utils/utils");
var listViewModule  = require("nativescript-telerik-ui/listview");

moment.locale('de');

var DetailModel = (function (_super) {
  var _items;
  var _backupItems;  
  var _numberOfAddedItems;
  var _currentItemIndex;
  var _owner;
  var _search;
  __extends(DetailModel, _super);
  function DetailModel(event_id) {
    _super.call(this);
    this.loadEvent(event_id); 
    //this.initData();
    this.Mode   = "ALL";
    this.search = null;
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
  Object.defineProperty(DetailModel.prototype, "event_time", {
    get: function () {
      if (this.event && this.event.starts_at && this.event.ends_at) {
        return moment(this.event.starts_at).format("HH.mm") + ' - ' + moment(this.event.ends_at).format("HH.mm");
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "event_date", {
    get: function () {
      if (this.event && this.event.starts_at && this.event.ends_at) {
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
      if (!this.event.products) {
        return;
      }
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
  // start
  Object.defineProperty(DetailModel.prototype, "dataItems", {
    get: function () {
      if (this._items) {
        return this._items;
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "traders", {
    get: function () {
      return this._traders;
    },
    set: function (value) {
      if (this._traders != value) {
        this._traders = value;
        this.notifyPropertyChange("traders", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "tradersCount", {
    get: function () {
      if (this.traders) {
        return this.traders.length;
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "search", {
    get: function () {
      return this._search;
    },
    set: function (value) {
      if (this._search != value) {
        this._search = value;
        this.filter();
        this.notifyPropertyChange("search", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "Mode", {
    get: function () {
      return this.currentMode;
    },
    set: function (value) {
      if (this.currentMode != value) {
        this.currentMode = value;
        this.notifyPropertyChange("currentMode", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "owner", {
    get: function () {
      return this.owner;
    },
    set: function (value) {
      if (this.owner != value) {
        this.owner = value;
        this.notifyPropertyChange("owner", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailModel.prototype, "currentItem", {
    get: function () {
      return this._currentItem;
    },
    set: function (value) {
      if (this._currentItem != value) {
        this._currentItem = value;
        this.notifyPropertyChange("currentItem", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  DetailModel.prototype.loadEvent = function (event_id) {
    var _this = this;
    if (!this.beginLoading())
      return;
    var getEvent = Service.service.getEventById(event_id);
    getEvent.then(function (data) {
      timer.setTimeout(() => {
        _this._event = data;
        _this.endLoading();
      }, 3000);      
    }, function (error) {
      _this.endLoading();
    });
  };

  DetailModel.prototype.filter = function () {
    var textFilter = this.search ? this.search.toLocaleLowerCase() : this.search;
    var filteredTraders = this._backupItems.filter((trader) => {        
      return trader.trader.company.toLocaleLowerCase().indexOf(textFilter) >= 0;
    });

    this.set("traders", filteredTraders);
    this.updateCurrentState();

  };
  DetailModel.prototype.initData = function () {
    var _this = this;
    _this._items = new observable.ObservableArray();
    if (!this.beginLoading())
      return;
    var getTraders = Service.service.getExhibitorsByEvent(1);
    getTraders.then(function (data) {
      timer.setTimeout(() => {
        var traders = new Array();
        _this._numberOfAddedItems = 0;
        for (var i = 0; i < data.length; i++) {
          var item = new Trade.TraderViewModel(data[i]);
          traders.push(item);
          if (i < 10) {
            _this._numberOfAddedItems++;
            _this._items.push(item);
          }
        }
        _this.traders = traders;
        _this._backupItems = traders;
        _this.endLoading();
      }, 3000);      
    }, function (error) {
      _this.endLoading();
    });
  };
  DetailModel.prototype.updateCurrentState = function () {
    var _this = this;
    var len = _this.traders.length > 10 ? 10 : _this.traders.length;
    _this._items.splice(0, _this._items.length);
    _this._numberOfAddedItems = 0;
    if (_this.Mode == "ALL") {
      for (var i = 0; i < len; ++i) {
        _this._numberOfAddedItems++;
        _this._items.push(_this.traders[i]);
      }
    } else {
      /*var filteredTraders = _this.traders.filter((trader) => {        
        return trader.isFavourite === true;
      });
      _this.set("traders", filteredTraders);
      len = _this.traders.length > 10 ? 10 : _this.traders.length;*/
      for (var i = 0; i < len; ++i) {
        if (_this.traders[i].isFavourite === true) {
          _this._numberOfAddedItems++;
          _this._items.push(_this.traders[i]);
        }
      }
    }
    if (_this.traders.length > 10) {
      _this._owner.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.Auto];
      _this._owner.refresh();
    }
  };
  DetailModel.prototype.onItemTap = function (args) {
    if (this.isSelectionActive === true) {
      return;
    }
    this.currentItem = (this._owner.items).getItem(args.itemIndex);
    this._currentItemIndex = args.itemIndex;
    alert("index - " + args.itemIndex);
    return;
    Nav.navigate({
      moduleName: viewsModule.Views.traderView,
      context: this.currentItem
    });
  };
  DetailModel.prototype.doNotShowAndroidKeyboard = function (args) {
    var searchBar = args.object;
    alert("?");
    if (searchBar.android){
      searchBar.android.clearFocus();
    }
  };
  DetailModel.prototype.onTap_SetAsFavourite = function (args) {
    var tmp = this.dataItems.getItem(0);
    tmp.isFavourite = !tmp.isFavourite;
    if (tmp.isFavourite === false && this.Mode === "FAVOURITES") {
      this.dataItems.splice(0, 1);
    }
    this._owner.notifySwipeToExecuteFinished();
  };
  DetailModel.prototype.onTap_FavoritesMode = function (args) {
    if (this.Mode !== "FAVOURITES") {
      this.Mode = "FAVOURITES";
      this.updateCurrentState();
    }
  };
  DetailModel.prototype.onTap_AllMode = function (args) {
    if (this.Mode !== "ALL") {
      this.Mode = "ALL";
      this.updateCurrentState();
    }
  };
  DetailModel.prototype.onLoadMoreItemsRequested = function (args) {
    var that = new WeakRef(this);
    timer.setTimeout(() => {
      var listView = args.object;
      var initialNumberOfItems = that.get()._numberOfAddedItems;
      for (var i = that.get()._numberOfAddedItems; i < initialNumberOfItems + 10; i++) {          
        if (i > this.tradersCount - 1) {
          listView.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.None];
          break;
        }
        that.get()._items.push(this.traders[i]);
        that.get()._numberOfAddedItems++;
      }
      listView.notifyLoadOnDemandFinished();
    }, 1500);
    args.returnValue = true;
  };
  DetailModel.prototype.onPullToRefreshInitiated = function (args) {
    var that = new WeakRef(this);
    timer.setTimeout(() => {
      var initialNumberOfItems = that.get()._numberOfAddedItems;
      for (var i = that.get()._numberOfAddedItems; i < initialNumberOfItems + 10; i++) {
        if (i > posts.names.length - 1) {
          break;
        }
        that.get()._items.splice(0, 0, new DataItem(posts.names[i], posts.titles[i], posts.text[i]));
        that.get()._numberOfAddedItems++;
      }
      var listView = args.object;
      listView.notifyPullToRefreshFinished();
    }, 1000);
  };
  // end
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
  DetailModel.prototype.openTicketUrl = function () {     
    return Utils.openUrl("http://www.oeticket.com/Tickets.html?affiliate=EOE&doc=artistPages%2Ftickets&fun=artist&action=tickets&erid=1759044&includeOnlybookable=false&xtmc=fishing_festival&xtnp=1&xtcr=1");
  };
  DetailModel.prototype.loadHalls = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    var getHalls = Service.service.getHallsByEvent(this.event.id);
    getHalls.then(function (data) {
      timer.setTimeout(() => {        
        var event_halls = new Array();        
        for (var i = 0; i < data.length; i++) {
          event_halls.push(data[i]);
        }        
        _this.event_halls = event_halls;     
        _this.endLoading();
      }, 1000);      
    }, function (error) {
      _this.endLoading();
    });    
  };  
  DetailModel.prototype.loadActions = function () {
    var _this = this;
    if (!this.beginLoading())
        return;
    var getActions = Service.service.getActionsByEvent(this.event.id);
    getActions.then(function (data) {
      timer.setTimeout(() => {
        var event_actions = new Array();
        var day_index = new Array();
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
      }, 1000);      
    }, function (error) {
      _this.endLoading();
    });
  };
  return DetailModel;
}(Base.BaseViewModel));

exports.DetailModel = DetailModel;
