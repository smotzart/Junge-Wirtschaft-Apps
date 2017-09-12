"use strict";

var observableModule = require("data/observable");
var dialogsModule = require("ui/dialogs");
var connectivity = require("connectivity");

var BaseViewModel = (function (_super) {
    __extends(BaseViewModel, _super);
    function BaseViewModel() {
        _super.call(this);
        this._loadingCount = 0;
    }
    Object.defineProperty(BaseViewModel.prototype, "isLoading", {
        get: function () {
            return this._isLoading;
        },
        set: function (value) {
            if (this._isLoading != value) {
                this._isLoading = value;
                this.notifyPropertyChange("isLoading", value);
            }
        },
        enumerable: true,
        configurable: true
    });
    BaseViewModel.prototype.beginLoading = function () {
        //if (connectivity.getConnectionType() === connectivity.connectionType.none) {
            //this.showError("No internet connection.");
            //return false;
        //}
        if (!this._loadingCount) {
            this.isLoading = true;
        }
        this._loadingCount++;
        return true;
    };
    BaseViewModel.prototype.endLoading = function () {
        if (this._loadingCount > 0) {
            this._loadingCount--;
            if (!this._loadingCount) {
                this.isLoading = false;
            }
        }
    };
    BaseViewModel.prototype.waitLoading = function () {
        if (this._loadingCount > 0) {
            this._loadingCount--;
            if (!this._loadingCount) {
                this.isLoading = false;
            }
        }
    };
    BaseViewModel.prototype.showError = function (error) {
        dialogsModule.alert({ title: "Error", message: error, okButtonText: "Close" });
    };
    BaseViewModel.prototype.showInfo = function (message) {
        dialogsModule.alert({ title: "Info", message: message, okButtonText: "OK" });
    };
    return BaseViewModel;
}(observableModule.Observable));

exports.BaseViewModel = BaseViewModel;
