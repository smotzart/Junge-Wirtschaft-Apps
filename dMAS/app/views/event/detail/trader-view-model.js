"use strict";

var Base        = require("~/components/common/base-view-model");
var Nav         = require("~/utils/navigation/navigation");
var viewsModule = require("~/utils/views/views");

var TraderViewModel = (function (_super) {
    __extends(TraderViewModel, _super);
    function TraderViewModel(trader) {
        _super.call(this);
        this.trader = trader;
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
    TraderViewModel.prototype.traderView = function (args) {
        Nav.navigate({
            moduleName: viewsModule.Views.traderView,
            context: args.view.bindingContext,
        });
    };
    return TraderViewModel;
}(Base.BaseViewModel));
exports.TraderViewModel = TraderViewModel;