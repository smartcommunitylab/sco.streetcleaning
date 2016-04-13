angular.module('streetcleaning.services.home', [])

    .factory('HomeSrv', function($q, $http, $window, $filter, $rootScope, $ionicLoading) {

        var homeServices = {};

        var markers = {};

        homeServices.getMarkers = function(date) {
            var deferred = $q.defer();
            var formattedDate = homeServices.formatDate(date);
            if (markers[formattedDate]) {
                deferred.resolve(markers[formattedDate]);

            } else {
                $http.get('data/' + formattedDate + '.json').success(function(response) {
                    markers[formattedDate] = response;
                    deferred.resolve(markers[formattedDate]);
                }, function(error) {
                    deferred.resolve(null);
                });
            }
            return deferred.promise;
        }

        homeServices.getFavoriteMarkers = function() {
            var deferred = $q.defer();

            $http.get('data/12-04-2016.json').success(function(response) {
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


        homeServices.getTimeTable = function(marker) {

            var items = [];
            var deferred = $q.defer();

            $http.get('data/tt.json').success(function(response) {

                // order items by month.
                items = homeServices.orderByStartTime("Time", response)

                deferred.resolve(items);
            }, function(error) {
                deferred.resolve(null);
            });

            return deferred.promise;

        }

        var sorters = {
            byTime: function(a, b) {
                return ((a.order < b.order) ? -1 : ((a.order > b.order) ? 1 : 0));
            }
        }


        homeServices.orderByStartTime = function(type, list) {

            var tt = {};

            if (type == "Time") {
                tt = list.sort(sorters.byTime);
            }

            return tt;
        }




        return homeServices;
    });