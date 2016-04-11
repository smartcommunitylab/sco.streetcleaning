angular.module('streetcleaning.controllers.home', [])
    .controller('HomeCtrl', function($scope, $state, $ionicPopup, $timeout, $filter, mapService, GeoLocate, Config) {

        $scope.runningDate = new Date();

        Config.init().then(function(response) { 
        }, function(error) {
         }
        )        

        // go to next date
        $scope.nextDate = function() {
            $scope.runningDate.setDate($scope.runningDate.getDate() + 1);
            //$scope.getTT($scope.runningDate.getTime());
        }
        // go to prev date
        $scope.prevDate = function() {
            $scope.runningDate.setDate($scope.runningDate.getDate() - 1);
            // $scope.getTT($scope.runningDate.getTime());
        }

        $scope.initMap = function() {
            mapService.initMap('scMap').then(function() {
                $scope.center = {
                    lat: 46.074779,
                    lng: 11.121749,
                    zoom: 18
                };
            }
            )
        }

        $scope.$on('$ionicView.beforeEnter', function() {
            mapService.refresh('modalMap');
        });

        $scope.showDetails = function(e, args) {
            alert(args.model.lat);
        }


     $scope.$on('leafletDirectiveMarker.scMap.click', function(e, args) {
         $scope.streetName = args.model.message;
         $scope.streetSchedule = 'Dalle 12:00 alle 15:30';
         var myPopup = $ionicPopup.show({
             templateUrl: "templates/streetPopup.html",
             title: $filter('translate')('lbl_info'),
             scope: $scope
             , buttons: [
                 {
                     text: $filter('translate')('lbl_close'),
                     type: 'button-small sc-popup-button-red'
                 }
                 , {
                     text: $filter('translate')('lbl_details'),
                     type: 'button-small sc-popup-button-blue'
                        // , onTap: $scope.showDetails(e, args)
                     , onTap: function(e) {
                         return args.model;
                     }
                 }
             ]
         });
         myPopup.then(function(res) {
                // alert(res);
         })
        });


        angular.extend($scope, {

            center: {
                lat: Config.getMapPosition().lat,//46.074779,
                lng: Config.getMapPosition().lon,//11.121749,
                zoom: Config.getMapPosition().zoom//18
            },
            markers: {
                marker1: {
                    lat: 46.07109,
                    lng: 11.126543,
                    message: "Castello",
                    focus: true,
                    draggable: false,
                },
                marker2: {
                    lat: 46.063571,
                    lng: 11.131527,
                    message: "Via Fiume",
                    focus: true,
                    draggable: false,
                }
            },
            defaults: {
                scrollWheelZoom: false
            },
            events: {
                map: {
                    enable: ['click']
                }
            }

        });

    

    })