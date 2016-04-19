angular.module('streetcleaning.controllers.search', [])
    .controller('SearchCtrl', function($scope, $state, $ionicPopup, $timeout, $filter, SearchSrv) {

        $scope.formData = {};
        $scope.doSearch = function() {
            if ($scope.formData.searchString) {
                SearchSrv.searchStreet($scope.formData.searchString).then(function(response) {
                    if (response) {
                        found = response;
                        $scope.markers = found;
                    } else {
                        $scope.markers = [];
                    }
                });
            }
        }

        $scope.showMarkerDetails = function(arg1, arg2) {
            $state.go('app.markerDetails', {
                marker: JSON.stringify(arg1),
                runningDate: arg2
            });
        }

    })