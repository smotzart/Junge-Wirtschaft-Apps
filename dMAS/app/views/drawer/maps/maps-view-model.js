var observable = require("data/observable");
var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);
    function HelloWorldModel() {
        _super.call(this);
        this.set("latitude", 0);
        this.set("longitude", 0);
        this.set("zoom", 13);
        this.set("bearing", 0);
        this.set("tilt", 0);
        this.set("padding", [10, 10, 10, 10]);
    }

    return HelloWorldModel;
})(observable.Observable);
exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = new HelloWorldModel();