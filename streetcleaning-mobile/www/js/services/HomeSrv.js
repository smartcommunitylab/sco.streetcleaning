angular.module('streetcleaning.services.home', [])

    .factory('HomeSrv', function ($q, $http, $window, $filter, $rootScope, $translate, $ionicLoading, $ionicPlatform, MapSrv, StorageSrv, Config) {

        var homeServices = {};

        var marker_icon = {
            iconUrl: 'img/ic_location.png',
            iconSize:     [38, 50], // size of the icon
            shadowSize:   [50, 19], // size of the shadow
            iconAnchor:   [22, 49], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 17],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor

        }


        homeServices.getMarkers = function (date) {
            var deferred = $q.defer();
            var formattedDate = homeServices.formatDate(date);

            var url = Config.getSCWebURL() + '/rest/day?daymillis=' + date.getTime();

            $http.get(url, {
                timeout: 5000,
                headers: {
                    "Accept": "application/json"
                }
            }).then(function (response) {
                var dateMarkers = response.data;
                var markers = [];
                var isFavorite = false;
                for (var i = 0; i < dateMarkers.length; i++) {

                    isFavorite = StorageSrv.isFavorite(dateMarkers[i].streetName)

                    markers.push({
                        id: dateMarkers[i].id,
                        streetName: dateMarkers[i].streetName,
                        streetCode: dateMarkers[i].streetCode,
                        cleaningDay: dateMarkers[i].cleaningDay,
                        startingTime: dateMarkers[i].startingTime,
                        endingTime: dateMarkers[i].endingTime,
                        notes: dateMarkers[i].notes,
                        lat: dateMarkers[i].centralCoords[0].lat,
                        lng: dateMarkers[i].centralCoords[0].lng,
                        centralCoords: dateMarkers[i].centralCoords[0],
                        streetSchedule: $filter('translate')('lbl_start') + ' ' + homeServices.formatTimeHHMM(dateMarkers[i].startingTime) + ' ' + $filter('translate')('lbl_end') + ' ' + homeServices.formatTimeHHMM(dateMarkers[i].endingTime),
                        polyline: MapSrv.formatPolyLine(dateMarkers[i].polylines),
                        favorite: isFavorite,
                        icon: marker_icon
                    });

                }
                deferred.resolve(markers);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        homeServices.getFavoriteMarkers = function () {
            var deferred = $q.defer();

            StorageSrv.getFavoriteMarkers().then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.resolve(null);
            });

            return deferred.promise;

        }

        homeServices.isFavoriteStreet = function (streetName) {
            return StorageSrv.isFavorite(streetName);
        }


        homeServices.formatDate = function (today) {
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }
            var today = dd + '-' + mm + '-' + yyyy;

            return today;

        }

        homeServices.formatTimeHHMM = function (time) {
            var date = new Date(time);
            var hour = date.getHours();

            if (hour < 10) {
                hour = "0" + hour;
            }

            var mins = date.getMinutes();

            if (mins < 10) {
                mins = "0" + mins;
            }

            var formatted = hour + '.' + mins;

            return formatted;
        }

        homeServices.getMonthName = function (time) {
            var date = new Date(time);
            var month = Config.getMonthName(date.getMonth());

            return month;
        }

        homeServices.getMonthNumber = function (time) {
            var date = new Date(time);

            return date.getMonth();

        }

        homeServices.generateKey = function (today) {
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (mm < 10) {
                mm = '0' + mm
            }
            var key = mm + '-' + yyyy;

            return key;

        }

        homeServices.getTimeTable = function (streetName) {

            var deferred = $q.defer();

            /** two dimensional 1.
            var arrItems = [];
            arrItems[0] = [];
            arrItems[1] = [];
            arrItems[2] = [];
            arrItems[3] = [];
            arrItems[4] = [];
            arrItems[5] = [];
            arrItems[6] = [];
            arrItems[7] = [];
            arrItems[8] = [];
            arrItems[9] = [];
            arrItems[10] = [];
            arrItems[11] = [];


            

            // $http.get('data/tt.json')
            var url = Config.getSCWebURL() + '/rest/street?streetName=' + marker.streetName;

            $http.get(url, {
                headers: {
                    "Accept": "application/json"
                }
            }).then(function(response) {
                // order items by month and format it.
                i = 0;
                homeServices.orderByStartTime("Time", response.data).forEach(function(item) {
                    var month = homeServices.getMonthName(item.cleaningDay);
                    item.month = month;
                    item.order = homeServices.getMonthNumber(item.cleaningDay);
                    var formattedDate = homeServices.formatDate(new Date(item.cleaningDay));
                    item.formattedDate = formattedDate;
                    if (!arrItems[item.order]) {
                        arrItems[item.order] = [];
                    }
                    arrItems[item.order].push(item)
                })

                deferred.resolve(arrItems);
            }, function(error) {
                deferred.resolve(null);
            });**/

            // associative map.
            var associativeMap = {};

            var url = Config.getSCWebURL() + '/rest/street?streetName=' + streetName;

            $http.get(url, {
                timeout: 5000,
                headers: {
                    "Accept": "application/json"
                }
            }).then(function (response) {

                var arr = [];

                response.data.forEach(function (item) {
                    var formattedDate = homeServices.formatDate(new Date(item.cleaningDay));
                    item.formattedDate = formattedDate;
                    var dateOfMonth = new Date(item.cleaningDay);
                    dateOfMonth.setDate(1);
                    var key = $filter('date')(dateOfMonth, 'yyyy-MM-dd');
                    if (associativeMap[key] == null) {
                        associativeMap[key] = [];
                    }
                    associativeMap[key].push(item);
                })

                deferred.resolve(associativeMap);

            }, function (error) {
                deferred.resolve(null);
            }
                );

            return deferred.promise;

        }

        homeServices.orderMapKeys = function (h) {
            var keys = [];
            for (var k in h) {
                keys.push(k);
            }
            return keys.sort();
        }

        var sorters = {
            byTime: function (a, b) {
                return ((a.startingTime < b.startingTime) ? 1 : ((a.startingTime > b.startingTime) ? -1 : 0));
            }
        }


        homeServices.orderByStartTime = function (type, list) {

            var tt = {};

            if (type == "Time") {
                tt = list.sort(sorters.byTime);
            }

            return tt;
        }

        homeServices.addFavorite = function (streetName) {
            var deferred = $q.defer();

            StorageSrv.addFavorite(streetName).then(function (streetName) {
                deferred.resolve(streetName);
            }, function (error) {
                deferred.resolve(null);

            })

            return deferred.promise;

        }


        // homeServices.questionnaireWindow = function () {
        //     var deferred = $q.defer();
        //     var questionnaireWindow = null;
        //     // open questionnaire page.
        //     var authapi = {
        //         authorize: function (url) {
        //             var deferred = $q.defer();

        //             var processThat = false;

        //             var authUrl = 'https://in-app.welive.smartcommunitylab.it/html/index.html?app=' + Config.getAppId() + '&callback=' + Config.getRedirectUri() + '&lang=' + $translate.use().toUpperCase();

        //             //Open the questionnaire page in the InAppBrowser
        //             if (!questionnaireWindow) {
        //                 questionnaireWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
        //                 processThat = !!questionnaireWindow;
        //             }

        //             var processURL = function (url, deferred, w) {
        //                 var status = /http:\/\/localhost(\/)?\?questionnaire-status=(.+)$/.exec(url);

        //                 if (w && (status)) {
        //                     if (status == 'error') {
        //                         homeServices.toast($filter('translate')('lbl_error'));
        //                     }
        //                     //Always close the browser when match is found
        //                     w.close();
        //                     questionnaireWindow = null;
        //                 }
        //             }

        //             if (ionic.Platform.isWebView()) {
        //                 if (processThat) {
        //                     questionnaireWindow.addEventListener('loadstart', function (e) {
        //                         //console.log(e);
        //                         var url = e.url;
        //                         processURL(url, deferred, questionnaireWindow);
        //                     });
        //                 }
        //             } else {
        //                 angular.element($window).bind('message', function (event) {
        //                     $rootScope.$apply(function () {
        //                         processURL(event.data, deferred);
        //                     });
        //                 });
        //             }

        //             return deferred.promise;
        //         }
        //     };

        //     authapi.authorize().then(
        //         function (success) { }, function (failure) { }
        //     );

        //     return deferred.promise;
        // };

        homeServices.toast = function (message, duration, position) {
            message = message || $filter('translate')('toast_error_generic');
            duration = duration || 'short';
            position = position || 'bottom';

            if (ionic.Platform.isWebView()) {
                $ionicPlatform.ready(function () {

                    if (!!window.cordova) {
                        // Use the Cordova Toast plugin
                        //$cordovaToast.show(message, duration, position);
                        window.plugins.toast.show(message, duration, position);
                    } else {
                        if (duration == 'short') {
                            duration = 2000;
                        } else {
                            duration = 5000;
                        }

                        var myPopup = $ionicPopup.show({
                            template: '<div class="toast">' + message + '</div>'
                            , scope: $rootScope
                            , buttons: []
                        });

                        $timeout(
                            function () {
                                myPopup.close();
                            }
                            , duration
                        );
                    }
                });
            }
        };

        return homeServices;
    });