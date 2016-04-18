angular.module('streetcleaning.controllers.home', [])
    .controller('HomeCtrl', function($scope, $state, $ionicPopup, $timeout, leafletBoundsHelpers, $filter, MapSrv, GeoLocate, Config, HomeSrv) {

        $scope.mapView = true;
        $scope.listView = false;
        $scope.runningDate = new Date();
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
        }

        var successMarkers = function(response) {
            if (response) {
                var dateMarkers = response;
                $scope.markers = dateMarkers;
                var boundArray = [];
                for (var i = 0; i < dateMarkers.length; i++) {
                    var coord = [];
                    coord.push(dateMarkers[i].lat);
                    coord.push(dateMarkers[i].lng);
                    boundArray.push(coord);
                }
                // bounds = leafletBoundsHelpers.createBoundsFromArray([[51.508742458803326, -0.087890625], [51.508742458803326, -0.087890625]]);
                $scope.bounds = leafletBoundsHelpers.createBoundsFromArray(boundArray);
                MapSrv.getMap('scMap').then(function(map) {
                    map.fitBounds = boundArray;
                    map.bounds = boundArray;
                }
                )

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
            $scope.runningDate.setDate($scope.runningDate.getDate() + 1);
            //$scope.getTT($scope.runningDate.getTime());
            HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);

        }
        // go to prev date
        $scope.prevDate = function() {
            markers = [];
            $scope.runningDate.setDate($scope.runningDate.getDate() - 1);
            // $scope.getTT($scope.runningDate.getTime());
            HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);

        }

        $scope.initMap = function() {
            MapSrv.initMap('scMap').then(function(mapObj) {
                // map = mapObj;
                $scope.center = {
                    lat: Config.getMapPosition().lat,//46.074779,
                    lng: Config.getMapPosition().lon,//11.121749,
                    zoom: Config.getMapPosition().zoom//18
                };
                // map.fitBounds(bounds);
            }
            )
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            MapSrv.refresh('scMap');
            HomeSrv.getMarkers($scope.runningDate).then(function(savedMarkers) {
                $scope.markers = savedMarkers;
            }, function(error) {
            });
        });

        // after routine.
        $scope.$on("$ionicView.afterLeave", function() {
            $scope.hideSearchInput = true;
            HomeSrv.getMarkers($scope.runningDate).then(function(savedMarkers) {
                $scope.markers = savedMarkers;
            }, function(error) {
            });
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
                        // , onTap: $scope.showDetails(e, args)
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

            bounds: bounds,
            center: {
                lat: Config.getMapPosition().lat, //46.074779,
                lng: Config.getMapPosition().lon, //11.121749,
                zoom: Config.getMapPosition().zoom //18
            },
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
            // MapSrv.getMap('scMap').then(function(map) {
            //     map.invalidateSize();
            //     map.bounds = $scope.bounds;             
            // }, function(error) {
            //     });
            $scope.mapView = true;
        }

        $scope.listViewShow = function() {
            $scope.mapView = false;
        }

        $scope.showMarkerDetails = function(arg1, arg2) {
            $state.go('app.markerDetails', {
                marker: JSON.stringify(arg1),
                runningDate: arg2
            });
        }

        $scope.markFavorite = function(arg1) {

            if (arg1.favorite) {
                arg1.favorite = false;
            } else {
                arg1.favorite = true;
            }

            HomeSrv.updateMarker(arg1).then(function(updated) {
                arg1 = updated;
            }, function error() { })

            MapSrv.refresh('scMap');

        }




    })

    .controller('MarkerDetailsCtrl', function($scope, $state, $ionicPopup, $timeout, HomeSrv) {

        $scope.marker = JSON.parse($state.params.marker);

        // $scope.streetName = marker.streetName;
        // $scope.favorite = marker.favorite;

        $scope.markFavorite = function() {
            if ($scope.marker.favorite) {
                $scope.marker.favorite = false;
            } else {
                $scope.marker.favorite = true;
            }
            HomeSrv.updateMarker($scope.marker).then(function(updated) {
                $scope.marker = updated;
            }, function error() { })
        }

        $scope.dividerFunction = function(key) {
            return key;
        }

        HomeSrv.getTimeTable($scope.marker).then(function(items) {
            $scope.items = items
        });




    });

