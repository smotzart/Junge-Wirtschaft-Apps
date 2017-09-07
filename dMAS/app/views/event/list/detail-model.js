"use strict";

var observable      = require("data/observable-array");
var Base            = require("~/components/common/base-view-model");
var Trade           = require("~/views/event/trader/trader-model");
var Action          = require("~/views/event/program/program-model");
var Nav             = require("~/utils/navigation/navigation");
var dialogs         = require("ui/dialogs");
var Service         = require("~/utils/service/service");
var viewsModule     = require("~/utils/views/views");
var frame           = require("tns-core-modules/ui/frame");
var Utils           = require("utils/utils");
var moment          = require('moment');
var timer           = require("timer");
var listViewModule  = require("nativescript-telerik-ui/listview");

moment.locale('de');

var DetailShortModel = (function (_super) {
  __extends(DetailShortModel, _super);
  
  var _items_t;
  var _items_t_backup;
  var _items_a;
  var _items_a_backup;
  var _numberOfAddedItems_t;
  var _numberOfAddedItems_a;

  function DetailShortModel(event) {
    _super.call(this);
    this.event = event;
    this.event_traders_mode = 'ALL'; 
    this.event_actions_mode = 'ALL'; 
    this.traders_search = null;
    this.actions_search = null;
  }
  Object.defineProperty(DetailShortModel.prototype, "event", {
    get: function () {
      return this._event;
    },
    set: function (value) {
      if (this._event != value) {
        this._event = value;
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_start", {
    get: function () {
      if (this.event.starts_at) {                
        var format = moment(this.event.starts_at).year() == moment(this.event.ends_at).year() ? "dd, D. MMM" : "dd, D. MMM YYYY" 
        return moment(this.event.starts_at).format(format);
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_end", {
    get: function () {     
      if (this.event.ends_at) {                
        var format = "dd, D. MMM YYYY";
        return moment(this.event.ends_at).format(format);
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_time", {
    get: function () {   
      if (this.event.starts_at && this.event.ends_at) {
        return moment(this.event.starts_at).format("HH.mm") + ' - ' + moment(this.event.ends_at).format("HH.mm");
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_date", {
    get: function () {   
      if (this.event.starts_at && this.event.ends_at) {
        var format  = moment(this.event.starts_at).month() == moment(this.event.ends_at).month() ? "D.-" : "D. MMMM YYYY-"
        var start   = moment(this.event.starts_at).format(format);
        var end     = moment(this.event.ends_at).format("D. MMMM YYYY");
        return start + '' + end;
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });  
  Object.defineProperty(DetailShortModel.prototype, "event_products_count", {
    get: function () {
      if (this.event_products) {
        return this.event_products.length;
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_products", {
    get: function () {
      return this._event_products;
    },
    set: function (value) {
      if (this._event_products != value) {
        this._event_products = value;
        this.notifyPropertyChange("event_products", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_places", {
    get: function () {
      return this._event_places;
    },
    set: function (value) {
      if (this._event_places != value) {
        this._event_places = value;
        this.notifyPropertyChange("event_places", value);
      }
    },
    enumerable: true,
    configurable: true
  });


  Object.defineProperty(DetailShortModel.prototype, "event_traders_count", {
    get: function () {
      if (this.event_traders) {
        return this.event_traders.length;
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_traders", {
    get: function () {
      return this._event_traders;
    },
    set: function (value) {
      if (this._event_traders != value) {
        this._event_traders = value;
        this.notifyPropertyChange("event_traders", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_traders_s", {
    get: function () {
      return this._event_traders_s;
    },
    set: function (value) {
      if (this._event_traders_s != value) {
        this._event_traders_s = value;
        this.notifyPropertyChange("event_traders_s", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_traders_mode", {
    get: function () {
      return this._event_traders_mode;
    },
    set: function (value) {
      if (this._event_traders_mode != value) {
        this._event_traders_mode = value;
        this.notifyPropertyChange("event_traders_mode", value);
      }
    },
    enumerable: true,
    configurable: true
  });   
  Object.defineProperty(DetailShortModel.prototype, "traders_view", {
    get: function () {
      return this._traders_view;
    },
    set: function (value) {
      if (this._traders_view != value) {
        this._traders_view = value;
        this.notifyPropertyChange("traders_view", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "traders_search", {
    get: function () {
      return this._traders_search;
    },
    set: function (value) {
      if (this._traders_search != value) {
        this._traders_search = value;
        this.updateCurrentStateTraders();
        this.notifyPropertyChange("traders_search", value);
      }
    },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(DetailShortModel.prototype, "event_actions_count", {
    get: function () {
      if (this.event_actions) {
        return this.event_actions.length;
      }
      return undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_actions", {
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
  Object.defineProperty(DetailShortModel.prototype, "event_actions_s", {
    get: function () {
      return this._event_actions_s;
    },
    set: function (value) {
      if (this._event_actions_s != value) {
        this._event_actions_s = value;
        this.notifyPropertyChange("event_actions_s", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "event_actions_mode", {
    get: function () {
      return this._event_actions_mode;
    },
    set: function (value) {
      if (this._event_actions_mode != value) {
        this._event_actions_mode = value;
        this.notifyPropertyChange("event_actions_mode", value);
      }
    },
    enumerable: true,
    configurable: true
  });   
  Object.defineProperty(DetailShortModel.prototype, "actions_view", {
    get: function () {
      return this._actions_view;
    },
    set: function (value) {
      if (this._actions_view != value) {
        this._actions_view = value;
        this.notifyPropertyChange("actions_view", value);
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DetailShortModel.prototype, "actions_search", {
    get: function () {
      return this._actions_search;
    },
    set: function (value) {
      if (this._actions_search != value) {
        this._actions_search = value;
        this.updateCurrentStateActions();
        this.notifyPropertyChange("actions_search", value);
      }
    },
    enumerable: true,
    configurable: true
  });

  DetailShortModel.prototype.reinit = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    timer.setTimeout(() => {
      _this.endLoading();
    }, 1500);
  };  
  DetailShortModel.prototype.goToList = function (args) {
    Nav.navigate({
      moduleName: viewsModule.Views.eventList
    });
  };
  DetailShortModel.prototype.showSlideout = function (args) {
    var sideDrawer = frame.topmost().getViewById("sideDrawer");
    sideDrawer.toggleDrawerState();
  };
  DetailShortModel.prototype.goToEventView = function (args) {
    Nav.navigate({
      moduleName: 'views/drawer/home/home', //viewsModule.Views.eventView
      context: args.view.bindingContext,
    });
  };
  DetailShortModel.prototype.productTap = function (args) {
    alert("productTap");
  };
  DetailShortModel.prototype.openTicketUrl = function () {     
    return Utils.openUrl("https://online.wkooe.at/web/guest/extteilnehmerportal?fsc_lectkeys=WKO_2017_3256");
  };
  DetailShortModel.prototype.loadProducts = function () {
    var _this = this;
    if (!_this.beginLoading())
      return;
    timer.setTimeout(() => {
      if (!_this.event.products) {
        _this.set("event_products", new Array());
        return _this.endLoading();
      }
      var source = _this.event.products;
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
      _this.set("event_products", ne2);     
      _this.endLoading();
    }, 1500);
  };  

  DetailShortModel.prototype.loadTraders = function () {
    var _this = this;
    _this._items_t = new observable.ObservableArray();
    if (!this.beginLoading())
      return;
    var getTraders = Service.service.getTradesByEvent(_this.event.id);
    getTraders.then(function (data) {
      timer.setTimeout(() => {
        var traders = new Array();
        _this._numberOfAddedItems_t = 0;
        for (var i = 0; i < data.length; i++) {
          var item = new Trade.TraderViewModel(data[i]);
          traders.push(item);
          if (i < 10) {
            _this._numberOfAddedItems_t++;
            _this._items_t.push(item);
          }
        }
        _this.set("event_traders_s", _this._items_t);
        _this.set("event_traders", traders);
        _this._items_t_backup = traders;
        _this.traders_view.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.Auto];
        _this.endLoading();
      }, 1500);      
    }, function (error) {
      _this.endLoading();
    });
  };  
  DetailShortModel.prototype.setTraderAsFavourite = function (args) {
    var _this = this;
    var item = args.view.bindingContext;
    var itemIndex = _this.event_traders_s.indexOf(item);
    item.toggleFavourite(); 
    if (item.isFavourite === false && _this.event_traders_mode === "FAVOURITES") {
      _this.event_traders_s.splice(itemIndex, 1);
      _this._numberOfAddedItems_t--;
      _this.traders_view.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.Auto];
    }
  };
  DetailShortModel.prototype.setTradersFavoritesMode = function (args) {
    if (this.event_traders_mode !== "FAVOURITES") {
      this.event_traders_mode = "FAVOURITES";
      this.updateCurrentStateTraders();
    }
  };
  DetailShortModel.prototype.setTradersAllMode = function (args) {
    if (this.event_traders_mode !== "ALL") {
      this.event_traders_mode = "ALL";
      this.updateCurrentStateTraders();
    }
  };
  DetailShortModel.prototype.updateCurrentStateTraders = function () {
    var _this = this;
    var textFilter = _this.traders_search ? _this.traders_search.toLocaleLowerCase() : _this.traders_search;
    if (!_this._items_t_backup) {
      timer.setTimeout(() => {
        _this.updateCurrentStateTraders();
      }, 500);
    } else {
      var _items_t_backup2 = _this._items_t_backup;
      if (textFilter) {
        _items_t_backup2 = _this._items_t_backup.filter((trader) => {
          return (trader.trader.company.toLocaleLowerCase().indexOf(textFilter) >= 0) || (trader.trader.products.toLocaleLowerCase().indexOf(textFilter) >= 0);
        });
      }
      if (_this.event_traders_mode == "FAVOURITES") {
        var filteredTraders = _items_t_backup2.filter((trader) => {        
          return trader.isFavourite === 1;
        });
        _this.set("event_traders", filteredTraders);
      } else {
        _this.set("event_traders", _items_t_backup2);
      }
      var len = _this.event_traders_count > 10 ? 10 : _this.event_traders_count;
      _this.event_traders_s.splice(0, _this.event_traders_s.length);
      _this._numberOfAddedItems_t = 0;
      if (_this.event_traders_mode == "ALL") {
        for (var i = 0; i < len; ++i) {
          _this._numberOfAddedItems_t++;
          _this.event_traders_s.push(_this.event_traders[i]);
        }
      } else {     
        for (var i = 0; i < len; ++i) {
          if (_this.event_traders[i].isFavourite === 1) {
            _this._numberOfAddedItems_t++;
            _this.event_traders_s.push(_this.event_traders[i]);
          }
        }
      }
      if (_this.event_traders_count > 10) {
        _this.traders_view.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.Auto];
        _this.traders_view.refresh();
      }
    }
  };
  DetailShortModel.prototype.onTraderItemTap = function (args) {
    Nav.navigate({
      moduleName: viewsModule.Views.traderView,
      context: args.view.bindingContext,
    });
    /*Nav.navigate({
      moduleName: viewsModule.Views.traderView,
      context: (this.traders_view.items).getItem(args.itemIndex)
    });*/
  };

  
  DetailShortModel.prototype.loadActions = function () {
    var _this = this;
    _this._items_a = new observable.ObservableArray();
    if (!this.beginLoading())
      return;
    var getActionss = Service.service.getActionsByEvent(_this.event.id);
    getActionss.then(function (data) {
      timer.setTimeout(() => {
        var actions = new Array();
        var dayOfYear = 0;
        _this._numberOfAddedItems_a = 0;
        for (var i = 0; i < data.length; i++) {
          var c_dayOfYear = moment(data[i].starts_at).dayOfYear();
          if (c_dayOfYear != dayOfYear) {
            data[i]['day_name'] = moment(data[i].starts_at).format("dd, D. MMM YYYY" );
            dayOfYear = c_dayOfYear;
          }
          var item = new Action.ActionViewModel(data[i]);
          actions.push(item);
          if (i < 10) {
            _this._numberOfAddedItems_a++;
            _this._items_a.push(item);
          }
        }
        _this.set("event_actions_s", _this._items_a);
        _this.set("event_actions", actions);
        _this._items_a_backup = actions;
        _this.actions_view.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.Auto];
        _this.endLoading();
      }, 1500);      
    }, function (error) {
      _this.endLoading();
    });
  }
  DetailShortModel.prototype.setActionAsFavourite = function (args) {
    var _this = this;
    var item = args.view.bindingContext;
    var itemIndex = _this.event_actions_s.indexOf(item);
    item.toggleFavourite(); 
    if (item.isFavourite === false && _this.event_actions_mode === "FAVOURITES") {
      _this.event_actions_s.splice(itemIndex, 1);
      _this._numberOfAddedItems_a--;
      _this.actions_view.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.Auto];
    }
  };
  DetailShortModel.prototype.setActionsFavoritesMode = function (args) {
    if (this.event_actions_mode !== "FAVOURITES") {
      this.event_actions_mode = "FAVOURITES";
      this.updateCurrentStateActions();
    }
  };
  DetailShortModel.prototype.setActionsAllMode = function (args) {
    if (this.event_actions_mode !== "ALL") {
      this.event_actions_mode = "ALL";
      this.updateCurrentStateActions();
    }
  };
  DetailShortModel.prototype.updateCurrentStateActions = function () {
    var _this = this;
    var textFilter = _this.actions_search ? _this.actions_search.toLocaleLowerCase() : _this.actions_search;
    var _items_a_backup2 = _this._items_a_backup;
    if (textFilter) {
      _items_a_backup2 = _this._items_a_backup.filter((action) => {
        return (action.action.title && action.action.title.toLocaleLowerCase().indexOf(textFilter) >= 0) || (action.action.description && action.action.description.toLocaleLowerCase().indexOf(textFilter) >= 0) || (action.action.location && action.action.location.toLocaleLowerCase().indexOf(textFilter) >= 0);
      });
    }
    if (_this.event_actions_mode == "FAVOURITES") {
      var filteredActions = _items_a_backup2.filter((action) => {        
        return action.isFavourite === 1;
      });
      _this.set("event_actions", filteredActions);
    } else {
      _this.set("event_actions", _items_a_backup2);
    }
    var len = _this.event_actions_count > 10 ? 10 : _this.event_actions_count;
    _this.event_actions_s.splice(0, _this.event_actions_s.length);
    _this._numberOfAddedItems_a = 0;
    if (_this.event_actions_mode == "ALL") {
      for (var i = 0; i < len; ++i) {
        _this._numberOfAddedItems_a++;
        _this.event_actions_s.push(_this.event_actions[i]);
      }
    } else {     
      for (var i = 0; i < len; ++i) {
        if (_this.event_actions[i].isFavourite === 1) {
          _this._numberOfAddedItems_a++;
          _this.event_actions_s.push(_this.event_actions[i]);
        }
      }
    }
    if (_this.event_actions_count > 10) {
      _this.actions_view.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.Auto];
      _this.actions_view.refresh();
    }
  };
  DetailShortModel.prototype.onActionItemTap = function (args) {
    Nav.navigate({
      moduleName: viewsModule.Views.programView,
      context: args.view.bindingContext
      //context: (this.actions_view.items).getItem(args.itemIndex)
    });
  };

  
  DetailShortModel.prototype.loadPlaces = function () {
    var _this = this;
    if (!this.beginLoading())
      return;
    var getPlaces = Service.service.getPlacesByEvent(this.event.id);
    getPlaces.then(function (data) {
      timer.setTimeout(() => {        
        var event_places = new Array();        
        for (var i = 0; i < data.length; i++) {
          event_places.push(data[i]);
        }        
        _this.set("event_places", event_places);     
        _this.endLoading();
      }, 1000);      
    }, function (error) {
      _this.endLoading();
    });    
  };  
  DetailShortModel.prototype.openDetailView = function (args) {
    var ind = args.object.page.getViewById("olo").selectedIndex;
    var modalPageModule = viewsModule.Views.placeView;
    var context = {
      place_name: this.event_places[ind].title,
      place_image: this.event_places[ind].file_url
    };
    var fullscreen = true;
    args.object.page.showModal(modalPageModule, context, function closeCallback() {
      return;
    }, fullscreen);
  };  

  DetailShortModel.prototype.onLoadMoreItemsRequestedTraders = function (args) {
    var that = new WeakRef(this);
    timer.setTimeout(() => {
      var listView = args.object;
      var initialNumberOfItems = that.get()._numberOfAddedItems_t;
      for (var i = initialNumberOfItems; i < initialNumberOfItems + 10; i++) {          
        if (i > this.event_traders_count - 1) {
          listView.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.None];
          break;
        }
        that.get()._items_t.push(this.event_traders[i]);
        that.get().set("event_traders_s", that.get()._items_t);
        that.get()._numberOfAddedItems_t++;
      }
      listView.notifyLoadOnDemandFinished();
    }, 1500);
    args.returnValue = true;
  };
  DetailShortModel.prototype.onLoadMoreItemsRequestedActions = function (args) {
    var that = new WeakRef(this);
    timer.setTimeout(() => {
      var listView = args.object;
      var initialNumberOfItems = that.get()._numberOfAddedItems_a;
      for (var i = initialNumberOfItems; i < initialNumberOfItems + 10; i++) {          
        if (i > this.event_actions_count - 1) {
          listView.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.None];
          break;
        }
        that.get()._items_a.push(this.event_actions[i]);
        that.get().set("event_actions_s", that.get()._items_a);
        that.get()._numberOfAddedItems_a++;
      }
      listView.notifyLoadOnDemandFinished();
    }, 1500);
    args.returnValue = true;
  };
  return DetailShortModel;
}(Base.BaseViewModel));

exports.DetailShortModel = DetailShortModel;
