"use strict";

var Base        = require("~/components/common/base-view-model");
var Service     = require("~/utils/service/service");
var observable  = require("data/observable-array");
var moment      = require('moment');
var timer       = require("timer");

var PersonViewModel = (function (_super) {
    __extends(PersonViewModel, _super);
    function PersonViewModel(person) {
      _super.call(this);
      this.person       = person;
      this.isFavourite  = this.person.fav;
    }
    Object.defineProperty(PersonViewModel.prototype, "person", {
      get: function () {
        return this._person;
      },
      set: function (value) {
        if (this._person != value) {
          this._person = value;
          this.notifyPropertyChange("person", value);
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(PersonViewModel.prototype, "isFavourite", {
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
    PersonViewModel.prototype.togglePFavourite = function () {
      var _this = this;
      var favourite = _this.get("isFavourite");
      var toggleFav = Service.service.updateFav(_this.person.id, favourite ? 0 : 1, 'Users');
      toggleFav.then(function(data) {
        return _this.set("isFavourite", favourite ? 0 : 1); 
      });
    };
    return PersonViewModel;
}(Base.BaseViewModel));
exports.PersonViewModel = PersonViewModel;