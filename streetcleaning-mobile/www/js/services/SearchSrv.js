angular.module('streetcleaning.services.search', [])

    .factory('SearchSrv', function($q, $http, $window, $filter, $rootScope, $ionicLoading, StorageSrv) {

        var searchService = {};

        searchService.searchStreet = function(searchText) {
            var deferred = $q.defer();
            StorageSrv.search(searchText).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.resolve(null);
            });
            return deferred.promise;
        }

        return searchService;

    });