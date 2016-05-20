angular.module('streetcleaning.controllers.terms', [])
    .controller('TermsCtrl', function ($scope, $ionicHistory, $ionicPlatform, $state, $filter, $ionicPopup, $ionicSideMenuDelegate, $timeout, $translate, StorageSrv, Config, LangSrv) {

        // before routine.
        $scope.$on('$ionicView.enter', function () {
            Config.loading();
            LangSrv.getLang().then(function (lang) {
                $scope.termsfile = 'resources/terms-' + lang + '.html';
                $scope.accepting = !StorageSrv.get("isPrivacyAccepted");
                Config.loaded();
            }, function (error) {
                Config.loaded();
                HomeSrv.toast($filter('translate')('lbl_error'));
                })
        });
        
        //go to the app's first page
        $scope.goToProposalsList = function () {
            // Avoid back button in the next view.
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.home');
        };

        $scope.acceptPrivacy = function () {
            StorageSrv.set("isPrivacyAccepted", true);
            $scope.goToProposalsList();
        };

        $scope.refusePrivacy = function () {
            var myPopup = $ionicPopup.show({
                template: "<center>" + $filter('translate')('terms_refused_alert_text') + "</center>",
                cssClass: 'custom-class custom-class-popup'
            });
            $timeout(function () { myPopup.close(); }, 1800) //close the popup after 1.8 seconds for some reason
                .then(function () {
                    navigator.app.exitApp(); // sometimes doesn't work with Ionic View
                    ionic.Platform.exitApp();
                    console.log('App closed');
                });
        };

    })
