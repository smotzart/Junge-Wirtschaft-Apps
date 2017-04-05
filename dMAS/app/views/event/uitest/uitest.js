var model = require("./test-model");
var closeTimeout = 0;
/*
function onPageLoaded(args) {
    var page = args.object;
    page.bindingContext = new viewModel.ViewModel();
}
exports.onPageLoaded = onPageLoaded;*/

function listViewLoaded (args) {
    var listView  = args.object;
    var page      = listView.page;
    if (!page.bindingContext) {
      page.bindingContext = new model.ViewModel(listView); 
    }
}
exports.listViewLoaded = listViewLoaded;

function inputTap(args) {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
  closeTimeout = setTimeout(() => {
    closeTimeout = 0;
  }, 20);
}
exports.inputTap = inputTap;

function tap (args) {
  var page = args.object.page;
  if (!closeTimeout) {
    closeTimeout = setTimeout(() => {
      page.getViewById("search").dismissSoftInput();
      closeTimeout = 0;
    }, 20);
  }
}
exports.tap = tap;