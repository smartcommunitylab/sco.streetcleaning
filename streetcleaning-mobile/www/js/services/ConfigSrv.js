angular.module('streetcleaning.services.config', [])

    .factory('Config', function($q, $http, $window, $filter, $translate, $rootScope, $ionicLoading) {

        var HTTP_CONFIG = {
            timeout: 5000
        };

        var lang = $translate.use();

        var mapJsonConfig = { 'lat': 46.074779, 'lon': 11.126543, 'zoom': 14 };
        var ttJsonConfig = null;

        var monthNameMap = {
            "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "it": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }

        var STREETCLEANING_WEB_SERVER = "https://dev.smartcommunitylab.it/streetcleaning";

        return {
            init: function() {
                var deferred = $q.defer();
                if (mapJsonConfig != null) deferred.resolve(mapJsonConfig);
                else $http.get('data/config.json').success(function(response) {
                    mapJsonConfig = response;
                    lat = response.lat;
                    lon = response.lon;
                    zoom = response.zoom;
                    deferred.resolve(true);
                });
                return deferred.promise;
            },
            getMonthName: function(monthNumber) {
                if (monthNameMap[lang]) {
                    var monthNames = monthNameMap[lang];
                    return monthNames[monthNumber];
                }
                return null;
            },
            getMapPosition: function() {
                return {
                    lat: mapJsonConfig.lat,
                    lon: mapJsonConfig.lon,
                    zoom: mapJsonConfig.zoom
                };
            },
            getLang: function() {
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
            getLanguage: function() {

                navigator.globalization.getLocaleName(
                    function(locale) {
                        alert('locale: ' + locale.value + '\n');
                    },
                    function() {
                        alert('Error getting locale\n');
                    }
                );

            },
            getSCWebURL: function() {
                return STREETCLEANING_WEB_SERVER;
            },
            loading: function() {
                $ionicLoading.show();
            },
            loaded: function() {
                $ionicLoading.hide();
            }

        }

    })
