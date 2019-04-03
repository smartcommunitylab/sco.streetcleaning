angular.module('streetcleaning.services.map', [])

.factory('MapSrv', function ($q, $http, $ionicPlatform, $filter, $timeout, leafletData, GeoLocate) {
    var cachedMap = {};

    var mapService = {};
    var myLocation = {};


    mapService.getMap = function (mapId) {
        var deferred = $q.defer();

        if (cachedMap[mapId] == null) {
            mapService.initMap(mapId).then(function () {
                deferred.resolve(cachedMap[mapId]);
            });
        } else {
            deferred.resolve(cachedMap[mapId]);
        }

        return deferred.promise;
    }

    mapService.setMyLocation = function (myNewLocation) {
        myLocation = myNewLocation
    };
    mapService.getMyLocation = function () {
        return myLocation;
    };

    //init map with tile server provider and show my position
    mapService.initMap = function (mapId) {
        
        var deferred = $q.defer();
        
        leafletData.getMap(mapId).then(function (map) {
            cachedMap[mapId] = map;
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                type: 'map',
                attribution: '',
                maxZoom: 18,
                minZoom: 8,
            }).addTo(map);
            L.control.locate().addTo(map);
            deferred.resolve(map);
        },
            function (error) {
                console.log('error creation');
                deferred.reject(error);
            });
        
        return deferred.promise;
    }
    mapService.centerOnMe = function (mapId, zoom) {
        leafletData.getMap(mapId).then(function (map) {
            GeoLocate.locate().then(function (e) {
                $timeout(function () {
                    map.setView(L.latLng(e[0], e[1]), zoom);
                });
            });
        });

    };

    mapService.encodePolyline = function (coordinate, factor) {
        coordinate = Math.round(coordinate * factor);
        coordinate <<= 1;
        if (coordinate < 0) {
            coordinate = ~coordinate;
        }
        var output = '';
        while (coordinate >= 0x20) {
            output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
            coordinate >>= 5;
        }
        output += String.fromCharCode(coordinate + 63);
        return output;
    }

    mapService.resizeElementHeight = function (element, mapId) {
        var height = 0;
        var body = window.document.body;
        if (window.innerHeight) {
            height = window.innerHeight;
        } else if (body.parentElement.clientHeight) {
            height = body.parentElement.clientHeight;
        } else if (body && body.clientHeight) {
            height = body.clientHeight;
        }
        console.log('height' + height);
        element.style.height = (((height - element.offsetTop) / 2) + "px");
        this.getMap(mapId).then(function (map) {
            map.invalidateSize();
        })
    }
    mapService.refresh = function (mapId) {
        this.getMap(mapId).then(function (map) {
            map.invalidateSize();
        })
    }

    mapService.formatPolyLine = function(polylines) {

        var listOfPoints = {};
        var i = 1;
        polylines.forEach(function(encodedPL) {

            listOfPoints["p" + i] = {
                color: '#008000',
                weight: 5,
                latlngs: mapService.decodePolyline(encodedPL)
            }
            i++;
        })

        
        return listOfPoints;

    }

    mapService.decodePolyline = function (str, precision) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {

            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;

            coordinates.push([lat / factor, lng / factor]);
        }

        return coordinates;
    };

    mapService.encodePolyline = function (coordinates, precision) {
        if (!coordinates.length) return '';

        var factor = Math.pow(10, precision || 5),
            output = encode(coordinates[0][0], factor) + encode(coordinates[0][1], factor);

        for (var i = 1; i < coordinates.length; i++) {
            var a = coordinates[i],
                b = coordinates[i - 1];
            output += encode(a[0] - b[0], factor);
            output += encode(a[1] - b[1], factor);
        }

        return output;
    };

    return mapService;
})
