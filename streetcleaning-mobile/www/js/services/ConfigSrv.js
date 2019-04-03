angular.module('streetcleaning.services.config', [])

    .factory('Config', function ($q, $http, $window, $filter, $translate, $rootScope, $ionicLoading) {

        var lang = $translate.use();

        var mapJsonConfig = { 'lat': 46.074779, 'lon': 11.126543, 'zoom': 14 };
        var appId = 'streetcleaning';
        var appName = 'Trento Street Cleaning';
        var defaultBound = [[46.074779, 11.121749], [46.068039, 11.116973], [46.066967, 11.128582], [46.074779, 11.121749]];

        var monthNameMap = {
            "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "it": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }

        var LANGUAGES = ["it", "en"];
        var STREETCLEANING_WEB_SERVER = "https://tn.smartcommunitylab.it/streetcleaning";

        var CREDITINFOP1 = {
            "it": "Il progetto WeLive è stato finanziato dal programma H2020 della Commissione Europea per la ricerca, lo sviluppo tecnologico e l’ innovazione secondo l’accordo N° 645845",
            "en": "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584",
        }

        var REDIRECT_URI = "http://localhost";

        return {
            init: function () {
                var deferred = $q.defer();
                if (mapJsonConfig != null) deferred.resolve(mapJsonConfig);
                else $http.get('data/config.json').success(function (response) {
                    mapJsonConfig = response;
                    lat = response.lat;
                    lon = response.lon;
                    zoom = response.zoom;
                    deferred.resolve(true);
                });
                return deferred.promise;
            },
            getMonthName: function (monthNumber) {
                if (monthNameMap[lang]) {
                    var monthNames = monthNameMap[lang];
                    return monthNames[monthNumber];
                }
                return null;
            },
            getMapPosition: function () {
                return {
                    lat: mapJsonConfig.lat,
                    lon: mapJsonConfig.lon,
                    zoom: mapJsonConfig.zoom
                };
            },
            getLang: function () {
                var browserLanguage = '';
                // works for earlier version of Android (2.3.x)
                var androidLang;
                if ($window.navigator && $window.navigator.userAgent && (androidLang = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
                    browserLanguage = androidLang[1];
                } else {
                    // works for iOS, Android 4.x and other devices
                    browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
                }
                var lang = browserLanguage.substring(0, 2);
                if (lang != 'it' && lang != 'en' && lang != 'de') lang = 'en';
                return lang;
            },
            getLanguage: function () {

                navigator.globalization.getLocaleName(
                    function (locale) {
                        alert('locale: ' + locale.value + '\n');
                    },
                    function () {
                        alert('Error getting locale\n');
                    }
                );

            },
            getSCWebURL: function () {
                return STREETCLEANING_WEB_SERVER;
            },
            getSupportedLanguages: function () {
                return LANGUAGES;
            },
            getDefaultBound: function () {
                return defaultBound;
            },
            log: function (type, customAttrs) {
                if (customAttrs == null) customAttrs = {};
                customAttrs.uuid = ionic.Platform.device().uuid;
                customAttrs.appname = appId;
                $http.post('https://dev.welive.eu/dev/api/log/' + appId, {
                    appId: appId,
                    type: type,
                    timestamp: new Date().getTime(),
                    custom_attr: customAttrs
                }, { headers: { Authorization: 'Bearer ' + loggingToken } })
                    .then(function () {
                    }, function (err) {
                        console.log('Logging error: ', err);
                    });
            },
            getCreditInfoP1: function (lang) {
                if (CREDITINFOP1[lang]) {
                    return CREDITINFOP1[lang];
                }
            },
            getAppId: function () {
                return appId;
            },
            getAppName: function () { 
                return appName;
            },
            getRedirectUri: function () {
                return REDIRECT_URI;
            },
            loading: function () {
                $ionicLoading.show();
            },
            loaded: function () {
                $ionicLoading.hide();
            }

        }

    })
