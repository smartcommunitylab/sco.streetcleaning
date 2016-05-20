angular.module('streetcleaning.services.lang', [])

    .factory('LangSrv', function ($q, $http, $window, $filter, $rootScope, $translate, $ionicLoading, $ionicPlatform, MapSrv, StorageSrv, Config) {

        // a global promise.

        var langService = {};
        var deferred; // this is the promise.

        langService.getLang = function () {

            if (!deferred) {

                deferred = $q.defer();

                $ionicPlatform.ready(function () {
                    if (typeof navigator.globalization !== "undefined") {

                        var success = function (language) {
                            var lang = language.value.split("-")[0];
                            if (Config.getSupportedLanguages().indexOf(lang) > -1) {
                                $translate.use((language.value).split("-")[0]).then(function (data) {
                                    console.log("SUCCESS -> " + data);
                                    deferred.resolve(data);
                                }, function (error) {
                                    console.log("ERROR -> " + error);
                                    deferred.resolve($translate.preferredLanguage());
                                });
                            } else {
                                $translate.use("en").then(function (data) {
                                    console.log("SUCCESS -> " + data);
                                    deferred.resolve(data);
                                }, function (error) {
                                    console.log("ERROR -> " + error);
                                    deferred.resolve($translate.preferredLanguage());
                                });
                            }
                        }

                        var failure = function (error) {
                            deferred.resolve($translate.preferredLanguage());
                        }

                        navigator.globalization.getPreferredLanguage(success, failure);

                    } else {
                        deferred.resolve($translate.preferredLanguage());
                    }
                });
            }

            return deferred.promise;

        }

        return langService;
    });