angular.module('streetcleaning.services.search', [])

    .factory('SearchSrv', function($q, $http, $window, $filter, $rootScope, $ionicLoading) {

        var searchServices = {};

        searchServices.searchStreet = function(searchText) {
            var deferred = $q.defer();
            $http.get('data/12-04-2016.json').then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.resolve(null);
            });
            return deferred.promise;
        }

        return searchServices;

    });