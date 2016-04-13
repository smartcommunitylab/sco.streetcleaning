angular.module('streetcleaning.controllers.home', [])
    .controller('HomeCtrl', function($scope, $state, $ionicPopup, $timeout, leafletBoundsHelpers, $filter, mapService, GeoLocate, Config, HomeSrv) {

        $scope.mapView = true;
        $scope.listView = false;
        $scope.runningDate = new Date();
        var mapDefaults = new Object();
        var markers = [];
        var boundArray = [];
        var bounds = null;

        var successMarkers = function(dateMarkers) {
            for (var i = 0; i < dateMarkers.length; i++) {
                markers.push({
                    lat: dateMarkers[i].coordinates[0],
                    lng: dateMarkers[i].coordinates[1],
                    streetName: dateMarkers[i].streetName,
                    startingTime: dateMarkers[i].startingTime,
                    endingTime: dateMarkers[i].endingTime,
                    cleaningDay: dateMarkers[i].cleaningDay,
                    streetSchedule: $filter('translate')('lbl_start') + ' ' + HomeSrv.formatTimeHHMM(dateMarkers[i].startingTime) + ' ' + $filter('translate')('lbl_end') + ' ' + HomeSrv.formatTimeHHMM(dateMarkers[i].endingTime),
                    favorite: false
                });
                var coord = [];
                coord.push(dateMarkers[i].lat);
                coord.push(dateMarkers[i].lng);
                boundArray.push(coord);
            }
            // bounds = leafletBoundsHelpers.createBoundsFromArray([[51.508742458803326, -0.087890625], [51.508742458803326, -0.087890625]]);
            bounds = leafletBoundsHelpers.createBoundsFromArray(boundArray);
        }

        var failureMarkers = function(error) {

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
            mapService.initMap('scMap').then(function() {
                $scope.center = {
                    lat: Config.getMapPosition().lat,//46.074779,
                    lng: Config.getMapPosition().lon,//11.121749,
                    zoom: Config.getMapPosition().zoom//18
                };
            }
            )
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            mapService.refresh('scMap');
        });

        $scope.showDetails = function(e, args) {
            alert(args.model.lat);
        }


        $scope.$on('leafletDirectiveMarker.scMap.click', function(e, args) {
            $scope.streetName = args.model.streetName;
            $scope.streetSchedule = args.model.streetSchedule;

            var myPopup = $ionicPopup.show({
                templateUrl: "templates/streetPopup.html",
                title: $filter('translate')('lbl_info'),
                scope: $scope
                , buttons: [
                    {
                        text: $filter('translate')('lbl_close'),
                        type: 'button-small sc-popup-button-red'
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
        });


        angular.extend($scope, Config, {

            bounds: bounds,
            center: {
                lat: Config.getMapPosition().lat, //46.074779,
                lng: Config.getMapPosition().lon, //11.121749,
                zoom: Config.getMapPosition().zoom //18
            },
            markers: markers,
            defaults: {
                scrollWheelZoom: false
            },
            events: {
                map: {
                    enable: ['click']
                }
            }

        });

        $scope.mapViewShow = function() {
            if ($scope.listView) {
                $scope.listView = false;
            }
            $scope.mapView = true;
        }

        $scope.listViewShow = function() {
            if ($scope.mapView) {
                $scope.mapView = false;
            }
            $scope.listView = true;
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
            // marker.favorite = $scope.favorite;
        }

        $scope.dividerFunction = function(key) {
            return key;
        }

        HomeSrv.getTimeTable($scope.marker).then(function(items) {
            $scope.items = items
        });




    });

