angular.module('streetcleaning.controllers.preference', [])
    .controller('PreferenceCtrl', function($scope, $state, $ionicPopup, $timeout, $filter, HomeSrv, NotifSrv, Config) {

        var successMarkers = function(response) {
            if (response) {
                favoriteMarkers = response;
                $scope.sNames = favoriteMarkers;
                Config.loaded();
            } else {
                $scope.markers = [];
                Config.loaded();
            }
        }

        var failureMarkers = function(error) {
            Config.loaded();
        }

        Config.loading();
        HomeSrv.getFavoriteMarkers().then(successMarkers, failureMarkers);

        $scope.showMarkerDetails = function(arg1, arg2) {
            $state.go('app.markerDetails', {
                streetName: arg1
            });
        }

        $scope.removeFavorite = function(streetName) {
            Config.loading();
            HomeSrv.addFavorite(streetName).then(function(updated) {
                NotifSrv.update().then(function(success) { });
                HomeSrv.getFavoriteMarkers().then(successMarkers, failureMarkers);
            })
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            Config.loading();
            HomeSrv.getFavoriteMarkers().then(successMarkers, failureMarkers);
        });


    })