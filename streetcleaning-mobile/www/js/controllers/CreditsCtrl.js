angular.module('streetcleaning.controllers.credits', [])
    .controller('CreditsCtrl', function ($scope, $state, $ionicPopup, $timeout, $filter, $translate, Config) {

        if (ionic.Platform.isWebView()) {
            cordova.getAppVersion(function (version) {
                $scope.version = "v " + version;
            }, function (error) {
                $scope.version = "v " + "0.1.3";
            }
            );

        }

        $scope.credits_info_p1 = Config.getCreditInfoP1($translate.use());
        
    })