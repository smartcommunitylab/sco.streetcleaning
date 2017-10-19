angular.module('streetcleaning.controllers.home', [])
    .controller('HomeCtrl', function ($scope, $state, $ionicPopup, $ionicPlatform, $timeout, leafletBoundsHelpers, $filter, MapSrv, GeoLocate, Config, HomeSrv, NotifSrv, LangSrv, StorageSrv) {

        $scope.mapView = true;
        $scope.listView = false;
        $scope.runningDate = new Date();
        $scope.runningDate.setHours(0, 0, 0, 0);
        var mapDefaults = new Object();
        var headerHeight = 43;
        var footerHeight = 44;
        var divHeight = 50;
        $scope.bounds = [];
        $scope.markers = [];
        $scope.pathLine = {};

        if (ionic.Platform.isIOS() && !ionic.Platform.isFullScreen) {
            headerHeight += 20;
        }

        $scope.mapWinSize = window.innerHeight - headerHeight - footerHeight - divHeight;

        // custom style.
        $scope.mapStyle = {
            "width": "100%",
            "height": $scope.mapWinSize + "px",
        }

        window.onresize = function (event) {
            $scope.mapWinSize = window.innerHeight - 44 - 50 - 44;
        }

        var successMarkers = function (response) {
            $scope.markers = [];
            if (response && response.length > 0) {
                var dateMarkers = response;
                $scope.markers = dateMarkers;
                $ionicPlatform.ready(function () {
                    var boundsArray = [];

                    for (var i = 0; i < dateMarkers.length; i++) {
                        var coord = [dateMarkers[i].lat, dateMarkers[i].lng];
                        boundsArray.push(coord);
                    }

                    if (boundsArray.length > 0) {
                        var bounds = L.latLngBounds(boundsArray);
                        MapSrv.getMap('scMap').then(function (map) {
                            map.fitBounds(bounds);
                            map.invalidateSize();
                        });
                    }
                })

            } else {
                $scope.markers = [];
                HomeSrv.toast($filter('translate')('no_markers_available'));
                $ionicPlatform.ready(function () {
                    var boundsArray = Config.getDefaultBound();
                    if (boundsArray.length > 0) {
                        var bounds = L.latLngBounds(boundsArray);
                        MapSrv.getMap('scMap').then(function (map) {
                            map.fitBounds(bounds);
                            map.invalidateSize();
                        });
                    }
                })
            }
            Config.loaded();
        }

        var failureMarkers = function (error) {
            $scope.markers = [];
            Config.loaded();
            HomeSrv.toast($filter('translate')('lbl_error_internet'));
            $ionicPlatform.ready(function () {
                var boundsArray = Config.getDefaultBound();
                if (boundsArray.length > 0) {
                    var bounds = L.latLngBounds(boundsArray);
                    MapSrv.getMap('scMap').then(function (map) {
                        map.fitBounds(bounds);
                        map.invalidateSize();
                    });
                }
            })
        }

        // go to next date
        $scope.nextDate = function () {
            $scope.markers = [];
            $scope.runningDate.setHours(0, 0, 0, 0);
            $scope.runningDate.setDate($scope.runningDate.getDate() + 1);
            HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);

        }
        // go to prev date
        $scope.prevDate = function () {
            $scope.markers = [];
            $scope.runningDate.setHours(0, 0, 0, 0);
            $scope.runningDate.setDate($scope.runningDate.getDate() - 1);
            HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);

        }

        $scope.initMap = function () {
            Config.loading();
            window.onresize();
            MapSrv.initMap('scMap').then(function (map) {
                HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);
            })
        }

        $scope.$on('$ionicView.beforeEnter', function () {
            $ionicPlatform.ready(function () {
                MapSrv.initMap('scMap').then(function (map) {
                    Config.loading();
                    HomeSrv.getMarkers($scope.runningDate).then(successMarkers, failureMarkers);
                })
            });
        });


        $scope.$on('leafletDirectiveMarker.scMap.click', function (e, args) {
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
                        , onTap: function (e) {
                            $scope.pathLine = {};
                        }
                    }
                    , {
                        text: $filter('translate')('lbl_details'),
                        type: 'button-small sc-popup-button-blue'
                        , onTap: function (e) {
                            return args.model;
                        }
                    }
                ]
            });
            myPopup.then(function (marker) {
                if (marker) {
                    $scope.pathLine = {};
                    $scope.showMarkerDetails(marker, $scope.runningDate);
                }
            })
        }
        );


        angular.extend($scope, Config, {

            bounds: $scope.bounds,
            markers: $scope.markers,
            center: {},
            defaults: {
                scrollWheelZoom: false
            },
            events: {
                map: {
                    enable: ['click']
                }
            },
            pathLine: $scope.pathLine
        });

        $scope.mapViewShow = function () {
            $scope.mapView = true;
            $scope.initMap();
        }


        $scope.listViewShow = function () {
            $scope.mapView = false;
        }

        $scope.showMarkerDetails = function (arg1, arg2) {
            $state.go('app.markerDetails', {
                streetName: arg1.streetName
            });
        }

        $scope.markFavorite = function (arg1) {

            Config.loading();
            if (arg1.favorite) {
                arg1.favorite = false;
            } else {
                arg1.favorite = true;
            }
            HomeSrv.addFavorite(arg1.streetName).then(function (updated) {
                arg1 = updated;
                NotifSrv.update().then(function (success) {
                    Config.loaded();
                }, function (error) {
                    Config.loaded();
                }
                );
            }, function error() {
                Config.loaded();
            }
            )
        }

        // after routine.
        $scope.$on("$ionicView.afterLeave", function () {
            // $scope.pathLine = {};
            // $scope.markers = [];
            // $scope.bounds = [];
        });

        // open once at the start of app.
        $ionicPlatform.ready(function () {

            if (!StorageSrv.get("isDisclaimerAccepted")) {
                LangSrv.getLang().then(function (data) {
                    $scope.disclaimer = $filter('translate')('msg_disclaimer');
                    var myPopup = $ionicPopup.show({
                        templateUrl: "templates/disclaimerPopup.html",
                        scope: $scope,
                        title: $filter('translate')('title_disclaimer'),
                        cssClass: 'disclaimer-popup',
                        buttons: [
                            {
                                text: $filter('translate')('lbl_cancel'),
                                type: 'button-disclaimer button-small sc-popup-button-red'
                                , onTap: function (e) {

                                }
                            }
                            , {
                                text: $filter('translate')('lbl_ok_diclaimer'),
                                type: 'button-disclaimer button-small sc-popup-button-blue'
                                , onTap: function (e) {
                                    StorageSrv.set("isDisclaimerAccepted", true);
                                }
                            }
                        ]
                    })
                });

            }
        })

    })

    .controller('MarkerDetailsCtrl', function ($scope, $state, $ionicPopup, $filter, $timeout, HomeSrv, NotifSrv, Config) {

        $scope.streetName = $state.params.streetName;

        $scope.markFavorite = function (streetName) {
            Config.loading();
            HomeSrv.addFavorite(streetName).then(function (updated) {
                $scope.favorite = HomeSrv.isFavoriteStreet(streetName);
                NotifSrv.update().then(function (success) {
                    Config.loaded();
                }, function (error) {
                    Config.loaded();
                });
            },
                function error() {
                    Config.loaded();
                }
            )

        }

        $scope.favorite = HomeSrv.isFavoriteStreet($scope.streetName);

        Config.loading();
        HomeSrv.getTimeTable($scope.streetName).then(function (hashMap) {
            // order map keys;
            $scope.associatedMap = hashMap;
            $scope.keys = HomeSrv.orderMapKeys(hashMap);
            Config.loaded();
        }, function error() {
            Config.loaded();
        });

        $scope.getLocale = function (date) {
            var locale = $filter('translate')('lbl_' + $filter('date')(date, "MMM"));
            return locale;
        }

    });

