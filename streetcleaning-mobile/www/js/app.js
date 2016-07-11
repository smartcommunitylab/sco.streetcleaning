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
    'streetcleaning.controllers.credits',
    'streetcleaning.controllers.terms',
    'streetcleaning.services.filters',
    'streetcleaning.services.config',
    'streetcleaning.services.map',
    'streetcleaning.services.geo',
    'streetcleaning.services.home',
    'streetcleaning.services.search',
    'streetcleaning.services.store',
    'streetcleaning.services.notification',
    'streetcleaning.services.loggingtokensrv',
    'streetcleaning.services.lang'

])

    .run(function ($ionicPlatform, $state, $rootScope, $q, $translate, GeoLocate, Config, HomeSrv, LangSrv) {


        $rootScope.questionnaireWindow = function () {

            var deferred = $q.defer();
            var questionnaireWindow = null;
            // open questionnaire page.
            var authapi = {
                authorize: function (url) {
                    var deferred = $q.defer();

                    var processThat = false;

                    var authUrl = 'https://in-app.cloudfoundry.welive.eu/html/index.html?app=' + Config.getAppId() + '&pilotId=Trento' + '&callback=' + Config.getRedirectUri() + '&lang=' + $translate.use().toUpperCase();

                    //Open the questionnaire page in the InAppBrowser
                    if (!questionnaireWindow) {
                        questionnaireWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
                        processThat = !!questionnaireWindow;
                    }

                    var processURL = function (url, deferred, w) {
                        var status = /http:\/\/localhost(\/)?\?questionnaire-status=(.+)$/.exec(url);

                        if (w && (status)) {
                            if (status == 'error') {
                                HomeSrv.toast($filter('translate')('lbl_error'));
                            }
                            //Always close the browser when match is found
                            w.close();
                            questionnaireWindow = null;
                        }
                    }

                    if (ionic.Platform.isWebView()) {
                        if (processThat) {
                            questionnaireWindow.addEventListener('loadstart', function (e) {
                                //console.log(e);
                                var url = e.url;
                                processURL(url, deferred, questionnaireWindow);
                            });
                        }
                        else {
                            angular.element($window).bind('message', function (event) {
                                $rootScope.$apply(function () {
                                    processURL(event.data, deferred);
                                });
                            });
                        }
                    }

                    return deferred.promise;
                }
            };

            authapi.authorize().then(
                function (success) { }, function (failure) { }
            );

            return deferred.promise;
        }


        $ionicPlatform.ready(function () {

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


            LangSrv.getLang().then(function (data) { $translate.use(data) }, function () { });

            if (ionic.Platform.isWebView()) {
                //log.
                Config.log('AppStarted', null);
            }


        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
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

            .state('app.termine', {
                url: '/termine'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/termine.html'
                        , controller: 'TermsCtrl'
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
                // url: '/apps/:marker/:runningDate'
                url: '/apps/:streetName'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/markerDetails.html'
                        , controller: 'MarkerDetailsCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise(function ($injector) {
            var isPrivacyAccepted = $injector.get('StorageSrv').get("isPrivacyAccepted");
            if (isPrivacyAccepted) {
                return '/app/home';
            } else {
                return '/app/termine';
            }
        });

    })

    .config(function ($translateProvider, $ionicConfigProvider) {
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $translateProvider.translations('it', {
            app_name: 'Trento Pulizia Strade',
            lbl_home: 'Home',
            lbl_search: 'Cerca',
            lbl_search_placeholder: 'Inserisci il nome di una via.',
            lbl_preference: 'Preferiti',
            lbl_questionnaire: 'Questionario',
            lbl_about: 'Credits',
            lbl_info: 'INFO',
            lbl_close: 'CHIUDI',
            lbl_start: 'Dalle',
            lbl_end: 'alle',
            lbl_details: 'VEDI DETTAGLI',
            lbl_calendar_title: 'Calendario delle pulizie',
            lbl_inprogress: 'In costruzione',
            lbl_searchresult: 'RISULTATI RICERCA',
            no_markers_available: 'In questa giornata non sono previste pulizie stradali.',
            no_favorite_selected1: 'Definisci una strada come preferita toccando il pulsante ',
            no_favorite_selected2: ' nella scheda di tuo interesse.',
            no_timetable_found: 'Nessuno calendario disponible.',
            lbl_msg_notification: 'in programma per la pulizia domani',
            lbl_Jan: 'Gennaio',
            lbl_Feb: 'Febbraio',
            lbl_Mar: 'Marzo',
            lbl_Apr: 'Aprile',
            lbl_May: 'Maggio',
            lbl_Jun: 'Giugno',
            lbl_Jul: 'Luglio',
            lbl_Aug: 'Agosto',
            lbl_Sep: 'Settembre',
            lbl_Oct: 'Ottobre',
            lbl_Nov: 'Novembre',
            lbl_Dec: 'Dicembre',
            lbl_error: 'oops errore',
            lbl_error_internet: 'Connessione Internet assente. Riprovare più tardi."',
            lbl_version: 'Versione',
            lbl_terms_of_service: 'Termini di utilizzo',
            lbl_accept: 'Accept',
            lbl_reject: 'Reject',
            about_subtitle: 'Information and Terms of Use',
            terms_refused_alert_text: 'Terms refused.',

        });

        $translateProvider.translations('en', {
            app_name: 'Trento Street Cleaning',
            lbl_home: 'Home',
            lbl_search: 'Search',
            lbl_search_placeholder: 'Enter a street name.',
            lbl_preference: 'Bookmarks',
            lbl_questionnaire: 'Questionnaire',
            lbl_about: 'Credits',
            lbl_info: 'INFO',
            lbl_close: 'CLOSE',
            lbl_start: 'From',
            lbl_end: 'to',
            lbl_details: 'VIEW DETAILS',
            lbl_calendar_title: 'Calendar cleaning closures',
            lbl_inprogress: 'Under construction',
            lbl_searchresult: 'SEARCH RESULTS',
            no_markers_available: 'No streets to be cleaned.',
            no_favorite_selected1: 'Select a favorite street by tapping  ',
            no_favorite_selected2: ' in the card of your choice.',
            no_timetable_found: 'No calendar available.',
            lbl_msg_notification: 'scheduled for cleaning tomorrow',
            lbl_Jan: 'January',
            lbl_Feb: 'Febrary',
            lbl_Mar: 'March',
            lbl_Apr: 'April',
            lbl_May: 'May',
            lbl_Jun: 'June',
            lbl_Jul: 'July',
            lbl_Aug: 'August',
            lbl_Sep: 'September',
            lbl_Oct: 'October',
            lbl_Nov: 'November',
            lbl_Dec: 'Dicember',
            lbl_error: 'oops error',
            lbl_error_internet: 'Internet connection issue. Please try again later."',
            lbl_version: 'Version',
            lbl_terms_of_service: 'Terms of service',
            lbl_accept: 'Accept',
            lbl_reject: 'Reject',
            about_subtitle: 'Information and Terms of Use',
            terms_refused_alert_text: 'Terms refused.',

        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
    }
    );
