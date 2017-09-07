"use strict";
var vmModule    = require("./maps-view-model");
var mapsModule  = require("nativescript-google-maps-sdk");
var permissions = require("nativescript-permissions");
var application = require("application");
var imageSource = require("tns-core-modules/image-source");
var utils = require("utils/utils");

var markers = [
  [0.014934539625812857, -0.020084381103515625],
  [0.007381439188572252, -0.010814666748046875],
  [0.005493164054094371, 0.012531280517578125],
  [-0.003948211666792128, 0.023860931396484375],
  [-0.006694793685938815, 0.023860931396484375],
  [-0.009269714315022413, 0.023345947265625],
  [-0.023517607982212068, 0.01064300537109375],
  [-0.016479491960279726, 0.0034332275390625],
  [-0.006523132310124609, -0.00858306884765625],
  [-0.0061798095583308075, -0.020084381103515625],
  [-0.009956359813164905, -0.020084381103515625],
  [0.015964507850075714, 0.034503936767578125],
  [0.01836776701937846, 0.023174285888671875],
];
function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = vmModule.mainViewModel;
}
exports.pageLoaded = pageLoaded;

var mapView = null;

function onMapReady(args) {
  mapView = args.object;
  
  mapView.settings.compassEnabled = false;
  mapView.settings.rotateGesturesEnabled = false;
  mapView.gMap.setMinZoomPreference(13);
  mapView.gMap.setMaxZoomPreference(15);
  mapView.gMap.setMapType(mapView.gMap.MAP_TYPE_NONE);

  // create overlay
  var overlay = new com.google.android.gms.maps.model.GroundOverlayOptions();
  // get image resource ID
  var img_id = utils.ad.resources.getDrawableId('hallenplan');
  // set overlay image  
  overlay.image(new com.google.android.gms.maps.model.BitmapDescriptorFactory.fromResource(img_id));
  // set overlay position
  overlay.position(new com.google.android.gms.maps.model.LatLng(0, 0), 10000);
  var result = mapView.gMap.addGroundOverlay(overlay);
  var overlay_bounds = result.getBounds();
  var overlay_center = overlay_bounds.getCenter();
 
  mapView.gMap.setLatLngBoundsForCameraTarget(overlay_bounds);

  var lastValidCenter = overlay_center;
  mapView.gMap.setOnCameraChangeListener(new com.google.android.gms.maps.GoogleMap.OnCameraChangeListener({
    onCameraChange: function(position) {
      return;
      var bounds = mapView.gMap.getProjection().getVisibleRegion().latLngBounds;
      //alert(bounds);
      /*mapView.gMap.addMarker(new com.google.android.gms.maps.model.MarkerOptions()
        .position(new com.google.android.gms.maps.model.LatLng(bounds.northeast.latitude, bounds.northeast.longitude))
      );
      mapView.gMap.addMarker(new com.google.android.gms.maps.model.MarkerOptions()
        .position(new com.google.android.gms.maps.model.LatLng(bounds.southwest.latitude, bounds.southwest.longitude))
      );*/
      lastValidCenter = bounds //new com.google.android.gms.maps.model.LatLng(position.target.latitude, position.target.longitude);

      if (
        (bounds.northeast.latitude < overlay_bounds.northeast.latitude) && 
        (bounds.northeast.longitude < overlay_bounds.northeast.longitude) && 
        (bounds.southwest.latitude > overlay_bounds.southwest.latitude) &&
        (bounds.southwest.longitude > overlay_bounds.southwest.longitude)
      ) {
          return;
        }
      mapView.setViewport(lastValidCenter);
      //alert(lastValidCenter);
      //mapView.gMap.animateCamera(new com.google.android.gms.maps.CameraUpdateFactory.newCameraPosition(lastValidCenter));
    }
  }));

  
  for (var i = 0; i < markers.length; i++) {
    mapView.gMap.addMarker(new com.google.android.gms.maps.model.MarkerOptions()
      .position(new com.google.android.gms.maps.model.LatLng(markers[i][0], markers[i][1]))
      .title("Marker place - " + i)
      .snippet("Marker place information - " + i)
    );
  }
}

exports.onMapReady = onMapReady;

