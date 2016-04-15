angular.module('streetcleaning.services.store', [])

    .factory('StorageSrv', function($q, $http, $window, $filter, $rootScope, $ionicLoading) {

        var storageService = {};

        storageService.getMarkers = function(date) {
            if (!!localStorage[date]) {
                var markers = JSON.parse(localStorage[date]);
                return markers;
            }
            return null;
        }

        storageService.getFavoriteMarkers = function() {

            var favoriteList = [];

            for (var i = 0; i < localStorage.length; i++) {
                var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));

                for (var j = 0; j < obj.length; j++) {
                    if (obj[j].favorite) {
                        favoriteList.push(obj[j]);
                    }
                }
            }

            return favoriteList;

        }


        var findMarkerIndexInArray = function(markerArray, marker) {
            return markerArray.indexOf(marker);
        }


        storageService.saveMarkers = function(markers, date) {
            var deferred = $q.defer();

            if (!!markers) {
                localStorage[date] = JSON.stringify(markers);
            } else {
                localStorage.removeItem(date);
            }

            deferred.resolve(markers);
            return deferred.promise;

        }

        storageService.saveSingleMarker = function(marker) {

            var deferred = $q.defer();

            var key = null;
            var index = -1;
            var markersList = null;

            for (var i = 0; i < localStorage.length; i++) {
                var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));

                for (var j = 0; j < obj.length; j++) {
                    if (obj[j].polyline = marker.polyline) {
                        index = j;
                        key = localStorage.key(i);
                        break;
                    }
                }
                if (index > -1) {
                    markersList = obj;
                    break;
                }
            }

            markersList[index] = marker;

            localStorage[key] = JSON.stringify(markersList);

            deferred.resolve(marker);

            return deferred.promise;

        }


        return storageService;

    });