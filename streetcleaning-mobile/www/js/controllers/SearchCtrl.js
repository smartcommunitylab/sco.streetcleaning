angular.module('streetcleaning.controllers.search', [])
    .controller('SearchCtrl', function($scope, $state, $ionicPopup, $timeout, $filter, SearchSrv) {

        var markers = [];
        $scope.formData = {};
        $scope.doSearch = function() {
            if ($scope.formData.searchString) {
                SearchSrv.searchStreet($scope.formData.searchString).then(function(items) {
                    $scope.markers = items;
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