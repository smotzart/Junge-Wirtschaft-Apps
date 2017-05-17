"use strict";

function itemLoading(args) {
  var cell = args.ios;
  if (cell) {
    cell.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
    cell.backgroundColor = UIColor.clearColor;
  }
}
exports.itemLoading = itemLoading;