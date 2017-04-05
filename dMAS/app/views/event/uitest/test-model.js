
var observable          = require("data/observable-array");
var Base                = require("~/components/common/base-view-model");

var Trade               = require("~/views/event/trader/trader-model");

var Nav                 = require("~/utils/navigation/navigation");
var viewsModule         = require("~/utils/views/views");
var sqlite              = require("nativescript-sqlite");
var Service             = require("~/utils/service/service");
var moment              = require('moment');
var timer               = require("timer");
var Utils               = require("utils/utils");
var listViewModule      = require("nativescript-telerik-ui/listview");

moment.locale('de');

var ViewModel = (function (_super) {
    var _items;
    var _backupItems;  
    var _numberOfAddedItems;
    var _currentItemIndex;
    var _owner;
    var _search;

    __extends(ViewModel, _super);

    function ViewModel(owner) {
        _super.call(this);
        this._owner = owner;
        this.initData();
        this.Mode = "ALL";
        this.search = null;
        this.isSelectionActive = false;
    }

    Object.defineProperty(ViewModel.prototype, "dataItems", {
      get: function () {
        if (this._items) {
          return this._items;
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ViewModel.prototype, "traders", {
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
    Object.defineProperty(ViewModel.prototype, "tradersCount", {
      get: function () {
        if (this.traders) {
          return this.traders.length;
        }
        return undefined;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ViewModel.prototype, "search", {
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
    Object.defineProperty(ViewModel.prototype, "Mode", {
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
    Object.defineProperty(ViewModel.prototype, "currentItem", {
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
    
    ViewModel.prototype.filter = function () {
      var textFilter = this.search ? this.search.toLocaleLowerCase() : this.search;
      var filteredTraders = this._backupItems.filter((trader) => {        
        return trader.trader.company.toLocaleLowerCase().indexOf(textFilter) >= 0;
      });

      this.set("traders", filteredTraders);
      this.updateCurrentState();

    };
    ViewModel.prototype.initData = function () {
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
    ViewModel.prototype.updateCurrentState = function () {
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
    ViewModel.prototype.onItemTap = function (args) {
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
    ViewModel.prototype.doNotShowAndroidKeyboard = function (args) {
      var searchBar = args.object;
      alert("?");
      if (searchBar.android){
        searchBar.android.clearFocus();
      }
    };
    ViewModel.prototype.onTap_SetAsFavourite = function (args) {
      var tmp = this.dataItems.getItem(0);
      tmp.isFavourite = !tmp.isFavourite;
      if (tmp.isFavourite === false && this.Mode === "FAVOURITES") {
        this.dataItems.splice(0, 1);
      }
      this._owner.notifySwipeToExecuteFinished();
    };
    ViewModel.prototype.onTap_FavoritesMode = function (args) {
      if (this.Mode !== "FAVOURITES") {
        this.Mode = "FAVOURITES";
        this.updateCurrentState();
      }
    };
    ViewModel.prototype.onTap_AllMode = function (args) {
      if (this.Mode !== "ALL") {
        this.Mode = "ALL";
        this.updateCurrentState();
      }
    };
    ViewModel.prototype.onLoadMoreItemsRequested = function (args) {
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
    ViewModel.prototype.onPullToRefreshInitiated = function (args) {
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
    return ViewModel;
}(Base.BaseViewModel));
exports.ViewModel = ViewModel;