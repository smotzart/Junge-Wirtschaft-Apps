"use strict";

var Base    = require("~/components/common/base-view-model");
var Service = require("~/utils/service/service");
var Sqlite  = require("nativescript-sqlite");
var Utils   = require("utils/utils");

var TraderViewModel = (function (_super) {
  __extends(TraderViewModel, _super);
  function TraderViewModel(trader) {
    _super.call(this);
    this.trader       = trader;
    this.isFavourite  = this.trader.fav;
  }
  Object.defineProperty(TraderViewModel.prototype, "trader", {
    get: function () {
      return this._trader;
    },
    set: function (value) {
      if (this._trader != value) {
        this._trader = value;
        this.notifyPropertyChange("trader", value);
      }
    },
    enumerable: true,
    configurable: true
  });    
  Object.defineProperty(TraderViewModel.prototype, "isFavourite", {
    get: function () {
      return this._isFavourite;
    },
    set: function (value) {
      if (this._isFavourite != value) {
        this._isFavourite = value;
        this.notifyPropertyChange("isFavourite", value);
      }
    },
    enumerable: true,
    configurable: true
  }); 
  Object.defineProperty(TraderViewModel.prototype, "products", {
    get: function () {
      var _this = this;
      if (_this.trader.products) {
        var data = _this.trader.products.split(",");
        var result = [];
        data.forEach(function(product) {
          result.push(product.trim());
        }); 
        return result;
      }
      return false;
    },
    enumerable: true,
    configurable: true
  });
  TraderViewModel.prototype.toggleFavourite = function () {
    var _this = this;
    var favourite = _this.get("isFavourite");
    var toggleFav = Service.service.updateFav(_this.trader.id, favourite ? 0 : 1, 'Traders');
    toggleFav.then(function(data) {
      return _this.set("isFavourite", favourite ? 0 : 1); 
    });
  };
  TraderViewModel.prototype.visitWebsite = function () {
    var _this = this;
    var website = _this.trader.website;
    if (!website.match(/^[a-zA-Z]+:\/\//)) {
      website = 'http://' + website;
    }
    return Utils.openUrl(website);
  };
  TraderViewModel.prototype.sendEmail = function () {
    var _this = this;
    var email = _this.trader.email;
    email = 'mailto:' + email;
    return Utils.openUrl(email);
  };
  return TraderViewModel;
}(Base.BaseViewModel));
exports.TraderViewModel = TraderViewModel;