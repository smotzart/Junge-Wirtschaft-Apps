"use strict";

var Base        = require("~/components/common/base-view-model");

var TraderViewModel = (function (_super) {
    __extends(TraderViewModel, _super);
    function TraderViewModel(trader) {
      _super.call(this);
      this.trader       = trader;
      this.isFavourite  = false;
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
    TraderViewModel.prototype.toggleFavourite = function () {
      var _this = this;
      var favourite = _this.get("isFavourite");
      return _this.set("isFavourite", !favourite);
    };
    return TraderViewModel;
}(Base.BaseViewModel));
exports.TraderViewModel = TraderViewModel;