angular.module('streetcleaning.services.home', [])

    .factory('HomeSrv', function($q, $http, $window, $filter, $rootScope, $translate, $ionicLoading, MapSrv, StorageSrv, Config) {

        var homeServices = {};

        homeServices.getMarkers = function(date) {
            var deferred = $q.defer();
            var formattedDate = homeServices.formatDate(date);

            var existingMarkers = StorageSrv.getMarkers(formattedDate);

            if (existingMarkers && existingMarkers.length > 0) {
                deferred.resolve(existingMarkers);
            }
            else {
                var url = Config.getSCWebURL() + '/rest/day?daymillis=' + date.getTime();

                $http.get(url, {
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(function(response) {
                    var dateMarkers = response.data;
                    var markers = [];
                    for (var i = 0; i < dateMarkers.length; i++) {
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
                            favorite: ((dateMarkers[i].favorite) ? (dateMarkers[i].favorite) : false)
                        });

                    }
                    StorageSrv.saveMarkers(markers, formattedDate).then(function(saved) {
                        deferred.resolve(saved);
                    }, function(unsaved) {
                        deferred.resolve(null);
                    }
                    )
                }, function(error) {
                    deferred.resolve(null);
                });
            }

            return deferred.promise;
        }

        homeServices.getFavoriteMarkers = function() {
            var deferred = $q.defer();

            StorageSrv.getFavoriteMarkers().then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.resolve(null);
            });

            return deferred.promise;

        }



        homeServices.formatDate = function(today) {
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

        homeServices.formatTimeHHMM = function(time) {
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

        homeServices.getMonthName = function(time) {
            var date = new Date(time);
            var month = Config.getMonthName(date.getMonth());

            return month;
        }

        homeServices.getMonthNumber = function(time) {
            var date = new Date(time);

            return date.getMonth();

        }


        homeServices.getTimeTable = function(marker) {

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


            var deferred = $q.defer();

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
            });

            return deferred.promise;


        }

        var sorters = {
            byTime: function(a, b) {
                return ((a.startingTime < b.startingTime) ? 1 : ((a.startingTime > b.startingTime) ? -1 : 0));
            }
        }


        homeServices.orderByStartTime = function(type, list) {

            var tt = {};

            if (type == "Time") {
                tt = list.sort(sorters.byTime);
            }

            return tt;
        }

        homeServices.updateMarker = function(marker) {
            var deferred = $q.defer();

            StorageSrv.saveSingleMarker(marker).then(function(savedMarker) {
                deferred.resolve(savedMarker);
            }, function(error) {
                deferred.resolve(null);

            })

            return deferred.promise;

        }


        return homeServices;
    });