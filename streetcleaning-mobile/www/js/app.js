// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('streetcleaning', [
    'ionic',
    'ngCordova',
    'ngIOS9UIWebViewPatch',
    'pascalprecht.translate',
    'leaflet-directive',
    'streetcleaning.controllers.home',
    'streetcleaning.controllers.search',
    'streetcleaning.controllers.preference',
    'streetcleaning.controllers.questionnaire',
    'streetcleaning.controllers.credits',
    'streetcleaning.services.filters',
    'streetcleaning.services.config',
    'streetcleaning.services.map',
    'streetcleaning.services.geo',
    'streetcleaning.services.home'
])

    .run(function($ionicPlatform, $state, $rootScope, $translate, GeoLocate, Config) {

        /*$rootScope.loginStarted = false;
        $rootScope.login = function() {

            if ($rootScope.loginStarted) return;

            $rootScope.loginStarted = true;
            LoginSrv.login().then(
                function(profile) {
                    $rootScope.loginStarted = false;

                    $state.go('app.home', {}, {
                        reload: true
                    });
                }
                , function(error) {
                    $rootScope.loginStarted = false;
                    Utils.toast();
                    StorageSrv.saveUser(null);
                    ionic.Platform.exitApp();
                }
            );
        };

        $rootScope.logout = function() {
            LoginSrv.logout().then(
                function(data) {
                    window.location.reload(true);
                }
                , function(error) { }
            );
        };*/

        $ionicPlatform.ready(function() {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            Config.init().then(function() {
                if (ionic.Platform.isWebView()) {
                    // DataManager.dbSetup();
                } else {
                    // DataManager.syncStopData();
                }
            });

            if (typeof navigator.globalization !== "undefined") {
                navigator.globalization.getPreferredLanguage(function(language) {
                    var lang = language.value.split("-")[0];
                    if (Config.getSupportedLanguages().indexOf(lang) > -1) {
                        $translate.use((language.value).split("-")[0]).then(function(data) {
                            console.log("SUCCESS -> " + data);
                        }, function(error) {
                            console.log("ERROR -> " + error);
                        });
                    } else {
                        $translate.use("en").then(function(data) {
                            console.log("SUCCESS -> " + data);
                        }, function(error) {
                            console.log("ERROR -> " + error);
                        });
                    }

                }, null);
            }

            // if (LoginSrv.userIsLogged()) {
            $state.go('app.home', {}, {
                reload: true
            });
            // } else {
            // $rootScope.login();
            // }

            // LOG EVENT (PlayerAccess)
            // var jsonPlayerAccess = Config.getPlayerAccessJson();
            // var userId = StorageSrv.getLoggedInUserId();
            // jsonPlayerAccess.custom_attr.UserID = userId;


            // Utils.log(jsonPlayerAccess);

        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
            })

            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchCtrl'
                    }
                }
            })


            .state('app.preference', {
                url: '/preference',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/preference.html',
                        controller: 'PreferenceCtrl'
                    }
                }
            })

            .state('app.questionnaire', {
                url: '/questionnaire',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/questionnaire.html',
                        controller: 'QuestionnaireCtrl'
                    }
                }
            })

            .state('app.credits', {
                url: '/credits',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/credits.html',
                        controller: 'CreditsCtrl'
                    }
                }
            })

            .state('app.markerDetails', {
                url: '/apps/:marker/:runningDate'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/markerDetails.html'
                        , controller: 'MarkerDetailsCtrl'
                    }
                }
            });        

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    })

    .config(function($translateProvider, $ionicConfigProvider) {
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $translateProvider.translations('it', {
            app_name: 'Street Cleaning',
            lbl_home: 'HOME',
            lbl_search: 'CERCA',
            lbl_preference: 'PREFERITI',
            lbl_questionnaire: 'QUESTIONARIO',
            lbl_credits: 'CREDITS',
            lbl_info: 'INFO',
            lbl_close: 'CHIUDI',
            lbl_start: 'Dalle',
            lbl_end: 'alle',
            lbl_details: 'VEDI DETTAGLI',
            lbl_calendar_title: 'Calendar Chiusere 2016',
            lbl_inprogress: 'In costruzione'

        });

        $translateProvider.translations('en', {
            app_name: 'Street Cleaning',
            lbl_home: 'HOME',
            lbl_search: 'SEARCH',
            lbl_preference: 'PREFERENCE',
            lbl_questionnaire: 'QUESTIONNAIRE',
            lbl_credits: 'CREDITS',
            lbl_info: 'INFO',
            lbl_close: 'CLOSE',
            lbl_start: 'From',
            lbl_end: 'to',
            lbl_details: 'VIEW DETAILS',
            lbl_calendar_title: 'Calendar Closures 2016',
            lbl_inprogress: 'Under construction'

        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
    }


    );
