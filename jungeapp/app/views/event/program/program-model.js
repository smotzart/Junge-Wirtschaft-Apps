"use strict";

var Base        = require("~/components/common/base-view-model");
var Service     = require("~/utils/service/service");
var Person      = require("~/views/event/program/person-model");
var observable  = require("data/observable-array");
var moment      = require('moment');
var timer       = require("timer");

var ActionViewModel = (function (_super) {
    __extends(ActionViewModel, _super);
    function ActionViewModel(action) {
      _super.call(this);
      this.action       = action;
      this.isFavourite  = this.action.fav;
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
    Object.defineProperty(ActionViewModel.prototype, "action_users_count", {
      get: function () {
        if (this.action_users) {
          return this.action_users.length;
        }
        return undefined;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ActionViewModel.prototype, "action_users", {
      get: function () {
        return this._action_users;
      },
      set: function (value) {
        if (this._action_users != value) {
          this._action_users = value;
          this.notifyPropertyChange("action_users", value);
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ActionViewModel.prototype, "isFavourite", {
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
    
    Object.defineProperty(ActionViewModel.prototype, "action_time_from", {
      get: function () {     
        if (this.action.starts_at) {                
          return moment(this.action.starts_at).format("HH.mm");
        }
        return undefined;
      },
      enumerable: true,
      configurable: true
    });    
    Object.defineProperty(ActionViewModel.prototype, "action_time_to", {
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
          var end   = moment(this.action.ends_at).format("D. MMMM YYYY");
          return start + '' + end;
        }
        return undefined;
      },
      enumerable: true,
      configurable: true
    });    
    Object.defineProperty(ActionViewModel.prototype, "action_languages", {
      get: function () {
        if (Array.isArray(this.action.languages)) {
          return this.action.languages;
        }
        var langs   = this.action.languages.split(",");
        var results = new observable.ObservableArray();
        for (var i = 0; i < langs.length; i++) {
          results.push(langs[i]);
        }
        return results;
      },
      enumerable: true,
      configurable: true
    });
    
    ActionViewModel.prototype.loadUsers = function () {
      var _this = this;
      if (!this.beginLoading())
        return;
      var getUsers = Service.service.getUsersByAction(_this.action.id);
      getUsers.then(function (data) {
        timer.setTimeout(() => {
          var users = new observable.ObservableArray();
          for (var i = 0; i < data.length; i++) {
            users.push(new Person.PersonViewModel(data[i]));
          }
          _this.set("action_users", users);
          _this.endLoading();
        }, 1500);      
      }, function (error) {
        _this.endLoading();
      });
    };  
    ActionViewModel.prototype.toggleFavourite = function () {
      var _this = this;
      var favourite = _this.get("isFavourite");
      var toggleFav = Service.service.updateFav(_this.action.id, favourite ? 0 : 1, 'Actions');
      toggleFav.then(function(data) {
        return _this.set("isFavourite", favourite ? 0 : 1); 
      });
    };
    return ActionViewModel;
}(Base.BaseViewModel));
exports.ActionViewModel = ActionViewModel;