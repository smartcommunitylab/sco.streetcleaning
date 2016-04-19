angular.module('streetcleaning.services.search', [])

    .factory('SearchSrv', function($q, $http, $window, $filter, $rootScope, $ionicLoading, StorageSrv, Config) {

        var searchService = {};

        searchService.searchStreet = function(searchText) {
            var deferred = $q.defer();
            var url = Config.getSCWebURL() + '/rest/search?searchText=' + searchText;
            $http.get(url, {
                headers: {
                    "Accept": "application/json"
                }
            }).then(function(response) {
                deferred.resolve(response.data);
                }, function(error) {
                    deferred.resolve(null);
            });
            return deferred.promise;

        }

        return searchService;

    });