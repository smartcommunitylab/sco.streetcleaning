angular.module('streetcleaning.controllers.home', [])
    .controller('HomeCtrl', function($scope, $state, $ionicPopup, $timeout, leafletBoundsHelpers, $filter, MapSrv, GeoLocate, Config, HomeSrv, NotifSrv) {

        $scope.mapView = true;
        $scope.listView = false;
        $scope.runningDate = new Date();
        $scope.runningDate.setHours(0, 0, 0, 0);
        var mapDefaults = new Object();
        var headerHeight = 43;
        var footerHeight = 44;
        var divHeight = 50;
        var bounds = null;


        if (ionic.Platform.isIOS() && !ionic.Platform.isFullScreen) {
            headerHeight += 20;
        }

        $scope.mapWinSize = window.innerHeight - headerHeight - footerHeight - divHeight;

        // custom style.
        $scope.mapStyle = {
            "width": "100%",
            "height": $scope.mapWinSize + "px",
        }

        window.onresize = function(event) {
            $scope.mapWinSize = window.innerHeight - 44 - 50 - 44;
            $scope.center = {
                lat: Config.getMapPosition().lat,
                lng: Config.getMapPosition().lon,
                zoom: Config.getMapPosition().zoom
            };
            map.fitBounds(bounds);

        }

        var successMarkers = function(response) {
            if (response) {
                var dateMarkers = response;
                $scope.markers = dateMarkers;
                var boundsArray = [];

                for (var i = 0; i < dateMarkers.length; i++) {
                    var coord = [dateMarkers[i].lat, dateMarkers[i].lng];
                    boundsArray.push(coord);
                }

                if (boundsArray.length > 0) {
                    var bounds = L.latLngBounds(boundsArray);
                    MapSrv.getMap('scMap').then(function(map) {
                        map.fitBounds(bounds);
                    });
                }

            } else {
                $scope.markers = [];
            }
        }

        var failureMarkers = function(error) {
            $scope.markers = [];
        }

        HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);

        // go to next date
        $scope.nextDate = function() {
            markers = [];
            $scope.runningDate.setHours(0, 0, 0, 0);
            $scope.runningDate.setDate($scope.runningDate.getDate() + 1);
            HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);

        }
        // go to prev date
        $scope.prevDate = function() {
            markers = [];
            $scope.runningDate.setHours(0, 0, 0, 0);
            $scope.runningDate.setDate($scope.runningDate.getDate() - 1);
            HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);

        }

        $scope.initMap = function() {
            MapSrv.initMap('scMap').then(function(map) {
                $scope.center = {
                    lat: Config.getMapPosition().lat,//46.074779,
                    lng: Config.getMapPosition().lon,//11.121749,
                    zoom: Config.getMapPosition().zoom//18
                };
                HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);
            }
            )
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);
        });

        $scope.$on('leafletDirectiveMarker.scMap.click', function(e, args) {
            $scope.streetName = args.model.streetName;
            $scope.streetSchedule = args.model.streetSchedule;
            $scope.pathLine = args.model.polyline;

            var myPopup = $ionicPopup.show({
                templateUrl: "templates/streetPopup.html",
                title: $filter('translate')('lbl_info'),
                scope: $scope
                , buttons: [
                    {
                        text: $filter('translate')('lbl_close'),
                        type: 'button-small sc-popup-button-red'
                        , onTap: function(e) {
                            $scope.pathLine = {};
                        }
                    }
                    , {
                        text: $filter('translate')('lbl_details'),
                        type: 'button-small sc-popup-button-blue'
                        , onTap: function(e) {
                            return args.model;
                        }
                    }
                ]
            });
            myPopup.then(function(marker) {
                if (marker) {
                    $scope.showMarkerDetails(marker, $scope.runningDate);
                }
            })
        }
        );


        angular.extend($scope, Config, {

            center: $scope.center,
            markers: $scope.markers,
            defaults: {
                scrollWheelZoom: false
            },
            events: {
                map: {
                    enable: ['click']
                }
            },
            pathLine: {}
        });

        $scope.mapViewShow = function() {
            $scope.mapView = true;
        }

        $scope.listViewShow = function() {
            $scope.mapView = false;
        }

        $scope.showMarkerDetails = function(arg1, arg2) {
            $state.go('app.markerDetails', {
                // marker: JSON.stringify(arg1),
                // runningDate: arg2
                streetName: arg1.streetName
            });
        }

        $scope.markFavorite = function(arg1) {

            if (arg1.favorite) {
                arg1.favorite = false;
            } else {
                arg1.favorite = true;
            }
            HomeSrv.addFavorite(arg1.streetName).then(function(updated) {
                arg1 = updated;
                NotifSrv.update().then(function(success) {});
            }, function error() { })

            MapSrv.refresh('scMap');

        }


    })

    .controller('MarkerDetailsCtrl', function($scope, $state, $ionicPopup, $timeout, HomeSrv, NotifSrv) {

        $scope.streetName = $state.params.streetName;

        $scope.markFavorite = function(streetName) {
            HomeSrv.addFavorite(streetName).then(function(updated) {
                $scope.favorite = HomeSrv.isFavoriteStreet(streetName);
                NotifSrv.update().then(function(success) {});
            }, function error() { })
        }

        $scope.favorite = HomeSrv.isFavoriteStreet($scope.streetName);

        HomeSrv.getTimeTable($scope.streetName).then(function(hashMap) {
            // order map keys;
            $scope.associatedMap = hashMap;

            $scope.keys = HomeSrv.orderMapKeys(hashMap);

        });

    });

