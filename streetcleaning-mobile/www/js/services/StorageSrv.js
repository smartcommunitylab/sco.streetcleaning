angular.module('streetcleaning.services.store', [])

    .factory('StorageSrv', function ($q, $http, $window, $filter, $rootScope, $ionicLoading, Config) {

        var storageService = {};

        var customAttr = {
            "action": "",
        }

        var streetFavourite = function(street){
            return '_FAV_'+ street;
        }
        var favouriteStreet = function(key){
            return key.substring(5);
        }

        storageService.getMarkers = function (date) {
            if (!!localStorage[date]) {
                var markers = JSON.parse(localStorage[date]);
                return markers;
            }
            return null;
        }

        storageService.getFavoriteMarkers = function () {

            var deferred = $q.defer();

            var favoriteList = [];

            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).indexOf('_FAV_') == 0) {
                    if (JSON.parse(localStorage.getItem(localStorage.key(i)))) {
                        favoriteList.push(favouriteStreet(localStorage.key(i)));
                    }
                }
            }

            deferred.resolve(favoriteList);

            return deferred.promise;

        }

        storageService.addFavorite = function (streetName) {
            var deferred = $q.defer();

            if (!!streetName) {
                streetName = streetFavourite(streetName);
                if (localStorage.getItem(streetName)) {
                    if (JSON.parse(localStorage[streetName])) {
                        localStorage[streetName] = false;
                        customAttr.action = "remove";
                    } else {
                        localStorage[streetName] = true;
                        customAttr.action = "add";
                    }
                } else {
                    localStorage[streetName] = true;
                    customAttr.action = "add";
                }

                //Config.log('AppPersonalize', customAttr);

            }

            deferred.resolve(streetName);
            return deferred.promise;

        }

        storageService.isFavorite = function (streetName) {

            var isFavorite = false;

            if (!!streetName) {
                if (localStorage.getItem(streetFavourite(streetName))) {
                    isFavorite = JSON.parse(localStorage.getItem(streetFavourite(streetName)));
                }
            }


            return isFavorite;

        }

        storageService.get = function (privacyKey) {
            if (localStorage.getItem(privacyKey)) {
                return localStorage[privacyKey];
            }
            return null;
        }

        storageService.set = function (privacyKey, flag) {
            localStorage[privacyKey] = flag;
        }

        return storageService;

    });