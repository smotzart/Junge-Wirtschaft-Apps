"use strict";

var baseViewModelModule = require("~/components/common/base-view-model");
var moment = require('moment');

var ActionViewModel = (function (_super) {
    __extends(ActionViewModel, _super);
    function ActionViewModel(action) {
        _super.call(this);
        this.action = action;
    }
    Object.defineProperty(ActionViewModel.prototype, "action", {
        get: function () {
            return this._action;
        },
        set: function (value) {
            if (this._action != value) {
                this._action = value;
                this.notifyPropertyChange("action", value);
            }
        },
        enumerable: true,
        configurable: true
    });    
    Object.defineProperty(ActionViewModel.prototype, "time_from", {
        get: function () {     
            if (this.action.starts_at) {                
                return moment(this.action.starts_at).format("HH.mm");
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });    
    Object.defineProperty(ActionViewModel.prototype, "time_to", {
        get: function () {     
            if (this.action.ends_at) {                
                return moment(this.action.ends_at).format("HH.mm");
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionViewModel.prototype, "action_date", {
        get: function () {
            if (this.action.starts_at && this.action.ends_at) {
                var starts_at_format = moment(this.action.starts_at).month() == moment(this.action.ends_at).month() ? "D.-" : "D. MMMM YYYY-"
                var start = moment(this.action.starts_at).format(starts_at_format);
                var end = moment(this.action.ends_at).format("D. MMMM YYYY");
                return start + '' + end;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    return ActionViewModel;
}(baseViewModelModule.BaseViewModel));
exports.ActionViewModel = ActionViewModel;