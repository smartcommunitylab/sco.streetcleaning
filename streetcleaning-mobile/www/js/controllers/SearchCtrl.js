angular.module('streetcleaning.controllers.search', [])
    .controller('SearchCtrl', function($scope, $state, $ionicPopup, $timeout, $filter, SearchSrv, Config) {

        $scope.formData = {};
        $scope.doSearch = function() {
            if ($scope.formData.searchString) {
                Config.loading();
                SearchSrv.searchStreet($scope.formData.searchString).then(function(response) {
                    if (response) {
                        found = response;
                        $scope.markers = found;
                        Config.loaded();
                    } else {
                        $scope.markers = [];
                        Config.loaded();
                    }
                });
            }
        }

        $scope.showMarkerDetails = function(arg1, arg2) {
            $state.go('app.markerDetails', {
                streetName: arg1.name
            });
        }

    })