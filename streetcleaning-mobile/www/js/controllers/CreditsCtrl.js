angular.module('streetcleaning.controllers.credits', [])
    .controller('CreditsCtrl', function($scope, $state, $ionicPopup, $timeout, $filter) {

        cordova.getAppVersion(function(version) {
            $scope.version = $filter('translate')('lbl_version') + " " + version;
        }, function(error) {
            $scope.version = $filter('translate')('lbl_version') + "0.1.0";
            }
        );        
    })