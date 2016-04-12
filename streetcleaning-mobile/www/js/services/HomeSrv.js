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


        return homeServices;
    });