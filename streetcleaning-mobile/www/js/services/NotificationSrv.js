angular.module('streetcleaning.services.notification', [])

    .factory('NotifSrv', function($ionicPlatform, $state, $q, $http, $window, $filter, $rootScope, $ionicLoading, Config, StorageSrv) {

        var notifService = {};

        notifService.update = function() {

            var deferred = $q.defer();
            var promises = [];
            var notifs = [];

            StorageSrv.getFavoriteMarkers().then(function(favs) {

                cordova.plugins.notification.local.cancelAll();

                var i = 0;

                var creationSuccess = function(notifications) {
                    notifs = notifs.concat(notifications);
                    i = notifs.length + 1;
                };
                var creationError = function(error) {
                    deferred.resolve(null);
                };

                favs.forEach(function(streetName) {
                    var singlePromise = notifService.fetchSchedule(streetName, i).then(creationSuccess, creationError);
                    promises.push(singlePromise);
                })

                $q.all(promises).then(function() {
                    cordova.plugins.notification.local.schedule(notifs, function(issue) { }, $rootScope); //alert(issue);
                    deferred.resolve(notifs);
                });
            });

            return deferred.promise;
        }


        $ionicPlatform.ready(function() {
            if (ionic.Platform.isWebView() && cordova && cordova.plugins && cordova.plugins.notification) {
                cordova.plugins.notification.local.on("click", function(notification) {
                    // alert(notification.text);
                    var data = JSON.parse(notification.data);
                    $state.go('app.markerDetails', {
                        streetName: data.streetName
                    });
                });
            }
        })


        notifService.fetchSchedule = function fetchSchedule(streetName, i) {
            // call api for street schedule.
            var deferred = $q.defer();
            var notifs = [];

            var url = Config.getSCWebURL() + '/rest/street?streetName=' + streetName;
            $http.get(url, {
                timeout: 5000,
                headers: {
                    "Accept": "application/json"
                }
            }).then(function(response) {
                var arr = [];
                response.data.forEach(function(item) {
                    var date = new Date(item.cleaningDay);
                    var now = new Date();
                   
                    if (isNaN(date) == false && date > now) {
                        // day before (6 PM).
                        date.setDate(date.getDate() - 1);
                        date.setHours(18);
                        var n = {};
                        n.id = ++i;
                        n.title = "StreetCleaning";
                        n.text = item.streetName + " " + $filter('translate')('lbl_msg_notification');
                        n.icon = "img/icon.png";
                        n.data = { "streetName": item.streetName }
                        n.at = date;
                        n.led = "FF0000";
                        notifs.push(n);
                    }

                })
                deferred.resolve(notifs);
            }, function(error) {
                deferred.resolve(null);
            });

            return deferred.promise;

        }


        return notifService;
    });
