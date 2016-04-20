angular.module('streetcleaning.controllers.preference', [])
    .controller('PreferenceCtrl', function($scope, $state, $ionicPopup, $timeout, $filter, HomeSrv, NotifSrv) {

        var successMarkers = function(response) {
            if (response) {
                favoriteMarkers = response;
                $scope.sNames = favoriteMarkers;
            } else {
                $scope.markers = [];
            }
        }

        var failureMarkers = function(error) {

        }

        HomeSrv.getFavoriteMarkers().then(successMarkers, failureMarkers);

        $scope.showMarkerDetails = function(arg1, arg2) {
            $state.go('app.markerDetails', {
                streetName: arg1
            });
        }

        $scope.removeFavorite = function(streetName) {
            HomeSrv.addFavorite(streetName).then(function(updated) {
                NotifSrv.update().then(function(success) { });
                HomeSrv.getFavoriteMarkers().then(successMarkers, failureMarkers);
            })
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            HomeSrv.getFavoriteMarkers().then(successMarkers, failureMarkers);
        });


    })