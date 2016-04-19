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

            var deferred = $q.defer();

            var favoriteList = [];

            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.getItem(localStorage.key(i))) {
                    if (JSON.parse(localStorage.getItem(localStorage.key(i)))) {
                        favoriteList.push(localStorage.key(i));
                    }
                }
            }

            deferred.resolve(favoriteList);

            return deferred.promise;

        }

        storageService.addFavorite = function(streetName) {
            var deferred = $q.defer();

            if (!!streetName) {
                if (localStorage.getItem(streetName)) {
                    if (JSON.parse(localStorage[streetName])) {
                        localStorage[streetName] = false;
                    } else {
                        localStorage[streetName] = true;
                    }
                } else {
                    localStorage[streetName] = true;
                }
            }

            deferred.resolve(streetName);
            return deferred.promise;

        }

        storageService.isFavorite = function(streetName) {

            var isFavorite = false;

            if (!!streetName) {
                if (localStorage.getItem(streetName)) {
                    isFavorite = JSON.parse(localStorage.getItem(streetName));
                }
            }


            return isFavorite;

        }


        // storageService.search = function(searchText) {

        //     var deferred = $q.defer();

        //     var searchList = [];

        //     for (var i = 0; i < localStorage.length; i++) {

        //         var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));

        //         for (var j = 0; j < obj.length; j++) {
        //             if (obj[j].streetName.toUpperCase().indexOf(searchText.toUpperCase()) > -1) {
        //                 searchList.push(obj[j]);
        //             }
        //         }
        //     }

        //     deferred.resolve(searchList);

        //     return deferred.promise;
        // }


        // var findMarkerIndexInArray = function(markerArray, marker) {
        //     return markerArray.indexOf(marker);
        // }


        // storageService.saveMarkers = function(markers, date) {
        //     var deferred = $q.defer();

        //     if (!!markers) {
        //         localStorage[date] = JSON.stringify(markers);
        //     } else {
        //         localStorage.removeItem(date);
        //     }

        //     deferred.resolve(markers);
        //     return deferred.promise;

        // }

        // storageService.saveSingleMarker = function(marker) {

        //     var deferred = $q.defer();

        //     var key = null;
        //     var index = -1;
        //     var markersList = null;

        //     for (var i = 0; i < localStorage.length; i++) {
        //         var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));

        //         for (var j = 0; j < obj.length; j++) {
        //             if (obj[j].id == marker.id) {
        //                 index = j;
        //                 key = localStorage.key(i);
        //                 break;
        //             }
        //         }
        //         if (index > -1) {
        //             markersList = obj;
        //             break;
        //         }
        //     }

        //     markersList[index] = marker;

        //     localStorage[key] = JSON.stringify(markersList);

        //     deferred.resolve(marker);

        //     return deferred.promise;

        // }


        return storageService;

    });