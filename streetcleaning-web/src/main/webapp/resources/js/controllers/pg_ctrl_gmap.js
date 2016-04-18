'use strict';

/* Controllers */
var cgControllers = angular.module('cgControllers');

cg.controller('ViewCtrlGmap',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', 'sharedDataService', 'invokeWSService', '$timeout',
                      function($scope, $http, $route, $routeParams, $rootScope, localize, sharedDataService, invokeWSService, $timeout, $location, $filter) { 
	
	$scope.$route = $route;
	$scope.$routeParams = $routeParams;
	var hidedLegsMarkers = [];
	
	// Methods to initialize the header ws calls
	$scope.getToken = function() {
        return sharedDataService.getToken();
    };            		    
    $scope.authHeaders = {
         'X-ACCESS-TOKEN': $scope.getToken(),
         'Accept': 'application/json;charset=UTF-8'
    };
	
	// Colors and Marker definitions
	$scope.colorMissing = "#808080";
	$scope.colorDone = "#E53935";	//"#4285F4" - orange:"#F29100" - green: "#439981"
	$scope.missingMarkerColor = "http://maps.google.com/mapfiles/kml/paddle/wht-circle-lv.png";//"http://maps.google.com/mapfiles/ms/icons/red-dot.png";
	$scope.doneMarkerColor = "http://maps.google.com/mapfiles/kml/paddle/red-circle-lv.png";//"http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
	$scope.actualMarkerColor = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";//"https://maps.gstatic.com/mapfiles/ms2/micons/ltblu-pushpin.png";
	$scope.firstMarker = "http://maps.google.com/mapfiles/kml/paddle/red-stars-lv.png"; //"http://maps.google.com/mapfiles/kml/pal4/icon53.png";
	
	// Map style: removed pois info, transport stops, naturals labels, road labels (highway and arterial)
	$scope.mapOption = {
		center : sharedDataService.getConfMapCenter(),
		zoom : parseInt(sharedDataService.getConfMapZoom()),
		styles : [{"featureType": "poi","stylers": [{ "visibility": "off" }]},											// pois icon and label
		          {"featureType": "transit.station","stylers": [{ "visibility": "off" }]},								// bus station labels and icons
		          {"featureType": "landscape.natural","elementType": "labels","stylers": [{ "visibility": "off" }]},	// mountain names
		          {"featureType": "road.highway", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }]},	// labels "A22","SS"
		          {"featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }]}		// labels "SP"
		         ]
	};
	
	$scope.initPage = function(){
		$scope.mapelements = {
			gamepolys : true,
			legmarkers : true,
		};
	};
	
	// Method that initialize all elements (both graphic and data from WS)
	$scope.initWs = function(teamId){
		$scope.mapGameLegMarkers = [];
		$scope.mapGamePolylines = [];
		$scope.mapReady = false;
		$scope.initPage();
		var gameId = sharedDataService.getGameId();
		$scope.myGame = sharedDataService.getMyGame();
		$scope.getUserGameStatus(gameId, teamId);
	};
	
	// Method used to hide all elements in map
	$scope.hideAllMapElements = function(){
		$scope.hideLegsMarkers();
		$scope.hideStreetPolylines();
	};
	
	// Method used to change map markers visibility
	$scope.changeLegMarkers = function(){
		if($scope.mapelements.legmarkers){
			$scope.showLegsMarkers();
		} else {
			$scope.hideLegsMarkers();
		}
	};
	
	$scope.showLegsMarkers = function() {
        $scope.mapGameLegMarkers = $scope.setAllMarkersMap(hidedLegsMarkers, $scope.map, true, 0);
    };
    
    $scope.hideLegsMarkers = function() {
    	//$scope.mapGameLegMarkers = $scope.setAllMarkersMap($scope.mapGameLegMarkers, null, false, 0);
    	if(hidedLegsMarkers == null || hidedLegsMarkers.length == 0){
    		angular.copy($scope.mapGameLegMarkers, hidedLegsMarkers);
    	}
    	$scope.mapGameLegMarkers = [];
    };
    
    $scope.setAllMarkersMap = function(markers, map, visible, type){
    	for(var i = 0; i < markers.length; i++){
    		markers[i].options.visible = visible;
    		markers[i].options.map = map;
    	}
    	return markers;
    };
	
    // Method used to change polyline visibility status
    $scope.changeGamePolylines = function(){
		if($scope.mapelements.gamepolys){
			$scope.showGamePolylines();
		} else {
			$scope.hideGamePolylines();
		}
	};
    
    $scope.showGamePolylines = function() {
    	var teamId = $scope.myTeam.objectId;
    	$scope.mapGamePolylines = $scope.initPolysOnMap($scope.gameState, true, teamId);
    };
    
    $scope.hideGamePolylines = function() {
    	var teamId = $scope.myTeam.objectId;
    	$scope.mapGamePolylines = $scope.initPolysOnMap($scope.gameState, false, teamId);
    	$scope.hideAllPolys();
    };
    
    // Method used to hide all polylines in map
    $scope.hideAllPolys = function(){
    	if($scope.map && $scope.mapGamePolylines){
    		var toDelPath = $scope.map.shapes;
	    	for(var i = 0; i < $scope.mapGamePolylines.length; i++){
	    		toDelPath[$scope.mapGamePolylines[i].id].setMap(null);
	    	}
    	}
    };
    
    $scope.getPointFromLatLng = function(latLng, type){
		var point = "" + latLng;
		var pointCoord = point.split(",");
		var res;
		if(type == 1){
			var lat = pointCoord[0].substring(1, pointCoord[0].length);
			var lng = pointCoord[1].substring(0, pointCoord[1].length - 1);
		
			res = {
				latitude: lat,
				longitude: lng
			};
		} else {
			var lat = Number(pointCoord[0]);
			var lng = Number(pointCoord[1]);
			res = {
				lat: lat,
				lng: lng
			};
		}
		return res;
	};
    
	// Function that initialize the map on the page the first time it is showed
    $scope.$on('mapInitialized', function(evt, map) {
    	switch(map.id){
	    	case "viewMap":
	    		$scope.viewMap = map;
	    		break;
	    	default:
	    		break;
    	}
    	var newCenter = $scope.getPointFromLatLng(sharedDataService.getConfMapCenter(), 2);
    	$scope.mapOption.center = sharedDataService.getConfMapCenter();	// configure new center
    	map.setCenter(newCenter);
    	//map.panTo(newCenter);
    	var bounds = sharedDataService.getConfMapBounds();
    	if(bounds != null){
    		map.fitBounds(bounds);
    	}
    });	
    
    // Function that resize and center the map to fit it on the showed elements (bounds object)
    $scope.resizeMap = function(bounds){
    	var newCenter = $scope.getPointFromLatLng(sharedDataService.getConfMapCenter(), 2);
    	$scope.map = $scope.viewMap;
		if($scope.map != null){
	    	google.maps.event.trigger($scope.map, 'resize');
	    	if(bounds != null){
	    		$scope.map.fitBounds(bounds);
	    	}
	    	$scope.map.setCenter(newCenter);
	        //$scope.mapOption.zoom = $scope.map.zoom + 1;
	    } else {
	    	$scope.mapOption.center = sharedDataService.getConfMapCenter();
	    }
	    return true;
	};
	
	// Function to initialize the polyline object of roads on the map. It is used only with show/hide methods
    $scope.initPolysOnMap = function(gameState, visible, teamId){
		var poly = {};
		var poligons = {};
		var tmpPolys = [];
		var actualMarkerPosition = [];
		if(gameState){
			var polylines = gameState.legs;
			var allTeams = gameState.teams;
			var myTeam = $scope.getTeamFromId(allTeams, teamId);
			$scope.myTeamBadges = myTeam.badges["Meano-FliessItinerary"];
			var myLeg = null;
			var isCurrLeg = true;
			if(myTeam.currentLeg){
				myLeg = myTeam.currentLeg;
			}
			if(myTeam.previousLeg){
				myLeg = myTeam.previousLeg;
				isCurrLeg = false;
			}
			var myScores = myTeam.score;								//2800;
			var totalRange = (myTeam.currentLeg) ? (myTeam.currentLeg.score - myLeg.score) : myLeg.score;		//1000;
			var doneRange = (myTeam.currentLeg) ? (myScores - myLeg.score) : myLeg.score;						//800;
			if(totalRange == 0){
				totalRange = myLeg.score;
				doneRange = myScores;
			}
			if(polylines){
				for(var i = 0; i < polylines.length; i++){
					var pointArr = polyline.decode(polylines[i].polyline);
					var middlePoint = Math.floor(pointArr.length / 2);
					if(polylines[i].position == myLeg.position + 1){
						// Actual leg. I have to split them in 2 part considering the percentage
						var actual_completing = doneRange / totalRange;		//0,8
						var lengthInMeters = $scope.sumAllDistances(pointArr) * 1000;
						if(actual_completing > 0){
							if(actual_completing < 1){	// case completing between 1% and 99%
								var splittedSubPolys = $scope.retrievePercentagePoly(pointArr, actual_completing);
								for(var y = 0; y < splittedSubPolys.length; y++){
									var partialPath = {
										id: polylines[i].position + "_" + y,
										path: $scope.correctPointsGoogle(splittedSubPolys[y]),
										stroke: {
										    color: (y == 0) ? $scope.colorDone : $scope.colorMissing,
										    weight: 5
										},
										data: polylines[i],
										info_windows_pos: pointArr[middlePoint],
										info_windows_cod: "iw" + polylines[i].position,
										editable: false,
										draggable: false,
										geodesic: false,
										visible: visible
									};
									if(y == 0){	// I initialize the actual position for the specific marker with the last coord of the firt splitted polyline
										actualMarkerPosition = splittedSubPolys[y][splittedSubPolys[y].length - 1];
									}
									tmpPolys.push(partialPath);
								}
							} else {	// case completing 100%
								var partialPath = {
									id: polylines[i].position + "_" + 0,
									path: $scope.correctPointsGoogle(pointArr),
									stroke: {
									    color: $scope.colorDone,
									    weight: 5
									},
									data: polylines[i],
									info_windows_pos: pointArr[middlePoint],
									info_windows_cod: "iw" + polylines[i].position,
									editable: false,
									draggable: false,
									geodesic: false,
									visible: visible
								};
								actualMarkerPosition = pointArr[pointArr.length - 1];
								tmpPolys.push(partialPath);
							}
						} else { // case completing 0%
							var partialPath = {
								id: polylines[i].position + "_" + 0,
								path: $scope.correctPointsGoogle(pointArr),
								stroke: {
								    color: $scope.colorMissing,
								    weight: 5
								},
								data: polylines[i],
								info_windows_pos: pointArr[middlePoint],
								info_windows_cod: "iw" + polylines[i].position,
								editable: false,
								draggable: false,
								geodesic: false,
								visible: visible
							};
							actualMarkerPosition = pointArr[0];
							tmpPolys.push(partialPath);
						}
					} else {
						var partialPath = {
							id: polylines[i].position,
							path: $scope.correctPointsGoogle(pointArr),
							stroke: {
							    color: (polylines[i].position <= myLeg.position) ? $scope.colorDone : $scope.colorMissing,
							    weight: 5
							},
							data: polylines[i],
							info_windows_pos: pointArr[middlePoint],
							info_windows_cod: "iw" +polylines[i].position,
							editable: false,
							draggable: false,
							geodesic: false,
							visible: visible
						};
						tmpPolys.push(partialPath);
					}				
				}
			}
		}
		return tmpPolys;
	};
	
	// Method getUserGameStatus: used to retrieve the data of gameStatus from ws
	// passed params: gameId (object id of the fame), teamId (object id of the team)
	$scope.getUserGameStatus = function(gameId, teamId){
		//http://localhost:8080/game-dashboard/api/game/status/TEST/56b9b129dd0a82ada7cce4c5
		$scope.gameState = null;
    	var method = "GET";
    	var user = sharedDataService.getName();
    	var myDataPromise = invokeWSService.getProxy(method, "/game/status/" + user + "/" + gameId, null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    //angular.copy(result, $scope.gameState);
		    $scope.gameState = result;
		    if(teamId == null || teamId == ""){
		    	teamId = $scope.gameState.teams[0].objectId;
		    }
		    var actualMarkerCoords = $scope.correctAndDrowPolylines($scope.gameState, teamId);
			$scope.correctAndDrowMarkers($scope.gameState, actualMarkerCoords, teamId);
		});
		return myDataPromise;
	};
	
	// Method setSelectedTeam: used to select a specific team (school class) from all the available teams.
	// This event refresh the element on map and recall the data from ws.
	$scope.setSelectedTeam = function(team){
		$scope.hideAllPolys();	// force to hide all polygons
		$scope.mapGameLegMarkers = [];
		if(team){
			$scope.myTeam = team;
			$scope.initWs(team.objectId);
		}
	};
	
	// Method used to check if a point is correct or reverse (lat value is in the lon place and vice-versa)
	// In case of reverse point the function invert the lat-lon data
	$scope.checkAndCorrectPoint = function(pointCoords){
		var resCoord = [];
		if(pointCoords!= null && pointCoords.length == 2){
			var firstCoord = pointCoords[0] + "";
			if(firstCoord.charAt(0) == "1"){
				resCoord.push(pointCoords[1]);
				resCoord.push(pointCoords[0]);
			} else {
				resCoord.push(pointCoords[0]);
				resCoord.push(pointCoords[1]);
			}
		}
		return resCoord;
	};
	
	// Method used to correct geolocation data from db and draw the badges markers on map
	// Parameters: gameState: data retrieved from DB; actualCoords: coord of the team state marker; teamId: id of the selected team (school class)
	$scope.correctAndDrowMarkers = function(gameState, actualCoords, teamId){
		$scope.mapGameLegMarkers = [];
		if(gameState){
			var polylines = gameState.legs;
			var allTeams = gameState.teams;
			var myTeam = $scope.getTeamFromId(allTeams, teamId);
			var myLeg = myTeam.currentLeg;
			var isCurrent = true;
			var usedIcon = "";
			if(myTeam.previousLeg){
				myLeg = myTeam.previousLeg;
				isCurrent = false;
			}
			myLeg.scores = myTeam.score;
			myLeg.scoresToEnd = myTeam.scoreToEnd;
			myLeg.scoresToNext = myTeam.scoreToNext;
			$scope.allTeams = allTeams;
			$scope.myTeam = myTeam;
			if(polylines){
				for(var i = 0; i < polylines.length; i++){
					var coord = $scope.checkAndCorrectPoint(polylines[i].geocoding);
					if(isCurrent){
						usedIcon = $scope.missingMarkerColor;
					} else {
						usedIcon = (polylines[i].position <= myLeg.position) ? $scope.doneMarkerColor : $scope.missingMarkerColor;
					}
					var ret = {
						id: i,
						position: coord,
						options: { 
						    draggable: true,
						    visible: true,
						    map:null
						},
						data: polylines[i],
						isActualMarker: false,
						icon: usedIcon,
						showWindow: false
					};
					ret.closeClick = function () {
					    ret.showWindow = false;
					};
					ret.onClick = function () {
						ret.showWindow = !ret.showWindow;
					};
					$scope.mapGameLegMarkers.push(ret);
					if(i == 0 && myLeg.scores != 0){	// first marker (pos 0)
						var pointArr = polyline.decode(polylines[i].polyline);
						var firstMarker = {
							id: i + "_f",
							position: pointArr[0],	// first point
							options: { 
							    draggable: true,
							    visible: true,
							    map:null
							},
							data: null,
							isActualMarker: true,
							icon: $scope.firstMarker,
							showWindow: false
						};
						firstMarker.closeClick = function () {
							firstMarker.showWindow = false;
						};
						firstMarker.onClick = function () {
							firstMarker.showWindow = !firstMarker.showWindow;
						};
						$scope.mapGameLegMarkers.push(firstMarker);
					}
				}
			}
			if(actualCoords && actualCoords.length > 0){
				var actualStateMarker = {
					id: myLeg.position + "_ac",
					position: actualCoords,
					options: { 
					    draggable: true,
					    visible: true,
					    map:null
					},
					data: myLeg,
					isActualMarker: true,
					icon: $scope.actualMarkerColor,
					showWindow: false
				};
				actualStateMarker.closeClick = function () {
					actualStateMarker.showWindow = false;
				};
				actualStateMarker.onClick = function () {
					actualStateMarker.showWindow = !actualStateMarker.showWindow;
				};
				$scope.mapGameLegMarkers.push(actualStateMarker);
			}
		}
	};
	
	// Method used to correct polyline data from db and draw the roads elements on map
	// Parameters: gameState: data retrieved from DB; teamId: id of the selected team (school class)
	// Return the actual state marker position
	$scope.correctAndDrowPolylines = function(gameState, teamId){
		$scope.mapGamePolylines = [];
		var actualMarkerPosition = [];
		if(gameState){
			var polylines = gameState.legs;
			var allTeams = gameState.teams;
			var myTeam = $scope.getTeamFromId(allTeams, teamId);
			$scope.myTeamBadges = myTeam.badges["Meano-FliessItinerary"];
			var myLeg = null;
			var isCurrLeg = true;
			if(myTeam.currentLeg){
				myLeg = myTeam.currentLeg;
			}
			if(myTeam.previousLeg){
				myLeg = myTeam.previousLeg;
				isCurrLeg = false;
			}
			var myScores = myTeam.score;								//2800;
			var totalRange = (myTeam.currentLeg) ? (myTeam.currentLeg.score - myLeg.score) : myLeg.score;		//1000;
			var doneRange = (myTeam.currentLeg) ? (myScores - myLeg.score) : myLeg.score;						//800;
			if(totalRange == 0){
				totalRange = myLeg.score;
				doneRange = myScores;
			}
			if(polylines){
				var bounds = new google.maps.LatLngBounds();
				for(var i = 0; i < polylines.length; i++){
					var pointArr = polyline.decode(polylines[i].polyline);
					var lengthInMeters = $scope.sumAllDistances(pointArr) * 1000;
					polylines[i].length = lengthInMeters;
					var middlePoint = Math.floor(pointArr.length / 2);
					var actualPosition = 0;
					if(isCurrLeg || myTeam.currentLeg == null){
						actualPosition = myLeg.position;
					} else {
						actualPosition = myLeg.position + 1;
					}
					if(polylines[i].position == actualPosition){
						// Actual leg. I have to split them in 2 part considering the percentage
						var actual_completing = (totalRange > 0) ? doneRange / totalRange : 0;		//0,8
						//var proportionalLength = lengthInMeter * actual_completing;
						if(actual_completing > 0){
							if(actual_completing < 1){	// case completing between 1% and 99%
								var splittedSubPolys = $scope.retrievePercentagePoly(pointArr, actual_completing);
								for(var y = 0; y < splittedSubPolys.length; y++){
									var partialPath = {
										id: polylines[i].position + "_" + y,
										path: $scope.correctPointsGoogle(splittedSubPolys[y]),
										stroke: {
										    color: (y == 0) ? $scope.colorDone : $scope.colorMissing,
										    weight: 5
										},
										data: polylines[i],
										info_windows_pos: pointArr[middlePoint],
										info_windows_cod: "iw" +polylines[i].position,
										editable: false,
										draggable: false,
										geodesic: false,
										visible: true
									};
									if(y == 0){	// I initialize the actual position for the specific marker with the last coord of the firt splitted polyline
										actualMarkerPosition = splittedSubPolys[y][splittedSubPolys[y].length - 1];
									}
									$scope.mapGamePolylines.push(partialPath);
								}
							} else {	// case completing 100%
								var partialPath = {
									id: polylines[i].position + "_" + 0,
									path: $scope.correctPointsGoogle(pointArr),
									stroke: {
									    color: $scope.colorDone,
									    weight: 5
									},
									data: polylines[i],
									info_windows_pos: pointArr[middlePoint],
									info_windows_cod: "iw" + polylines[i].position,
									editable: false,
									draggable: false,
									geodesic: false,
									visible: true
								};
								actualMarkerPosition = pointArr[pointArr.length - 1];
								$scope.mapGamePolylines.push(partialPath);
							}
						} else {	// case completing 0%
							var partialPath = {
								id: polylines[i].position + "_" + 0,
								path: $scope.correctPointsGoogle(pointArr),
								stroke: {
								    color: $scope.colorMissing,
								    weight: 5
								},
								data: polylines[i],
								info_windows_pos: pointArr[middlePoint],
								info_windows_cod: "iw" + polylines[i].position,
								editable: false,
								draggable: false,
								geodesic: false,
								visible: true
							};
							actualMarkerPosition = pointArr[0];
							$scope.mapGamePolylines.push(partialPath);
						}
					} else {
						var partialPath = {
							id: polylines[i].position,
							path: $scope.correctPointsGoogle(pointArr),
							stroke: {
							    color: (polylines[i].position <= myLeg.position) ? $scope.colorDone : $scope.colorMissing,
							    weight: 5
							},
							data: polylines[i],
							info_windows_pos: pointArr[middlePoint],
							info_windows_cod: "iw" +polylines[i].position,
							editable: false,
							draggable: false,
							geodesic: false,
							visible: true
						};
						$scope.mapGamePolylines.push(partialPath);
					}
					for (var p = 0; p < pointArr.length; p++) {
						var lat = Number(pointArr[p][0]);
						var lng = Number(pointArr[p][1]);
						var gPoint = new google.maps.LatLng(lat,lng);
						bounds.extend(gPoint);
					}
				}
			}
		}
		if(bounds != null){
			sharedDataService.setConfMapBounds(bounds);
			var newCenter = bounds.getCenter().lat() + "," + bounds.getCenter().lng();
			sharedDataService.setConfMapCenter(newCenter);
			$scope.resizeMap(bounds);
		}
		return actualMarkerPosition;
	};
	
	// Method used to split a polyline in two polylines considering a percentage value.
	// Now the percentage is related with the array elements number but we can consider the real distance in meters
	$scope.retrievePercentagePoly = function(pointArr, percentage){
		var splittedPolys = [];
		if(percentage > 0){
			var perc = Math.floor(percentage * pointArr.length);
			if(perc <= 1)perc = 2;	// in case of too small value the system force the perc value to 2 (so the first splitted array has minimal 2 points)
			var partialPoly1 = pointArr.slice(0, perc);
			var partialPoly2 = pointArr.slice(perc - 1, pointArr.length);
		} else {
			var partialPoly1 = [];
			var partialPoly2 = pointArr;
		}
		splittedPolys.push(partialPoly1);
		splittedPolys.push(partialPoly2);
		return splittedPolys;
	};
	
	// Method used to calculate a polyline length (in meters) with the sum of the distances between each point
	$scope.sumAllDistances = function(arrOfPoints){
		var partialDist = 0;
		for(var i = 1; i < arrOfPoints.length; i++){
			var lat1 = arrOfPoints[i-1][0];
			var lon1 = arrOfPoints[i-1][1];
			var lat2 = arrOfPoints[i][0];
			var lon2 = arrOfPoints[i][1];
			partialDist += $scope.getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
		}
		return partialDist;
	};
	
	// Method used to calculate the distance between two points
	$scope.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1); 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	};

	var deg2rad = function(deg) {
	  return deg * (Math.PI/180)
	};
	
	// Method used to retrieve the team object by the objectId
	$scope.getTeamFromId = function(allTeams, teamId){
		var myTeam = null;
		if(allTeams){
			var find = false;
			for(var i = 0; (i < allTeams.length && !find); i++){
				if(allTeams[i].objectId == teamId){
					myTeam = allTeams[i];
					find = true;
				}
			}
		}
		return myTeam;
	};
	
	$scope.correctGooglePolyline = function(polystring){
		var res = polystring;
		if(polystring){
			if(polystring.indexOf("\\") > -1){
				res = polystring.replace("\\", "\\\\");
			}
		}
		return res;
	};
	
	// Method used to correct an array of lat-long objects to ad array of array with lat-long values
	$scope.correctPoints = function(points){
		var corr_points = [];
		for(var i = 0; i < points.length; i++){
			var point = {
				latitude: points[i].lat,
				longitude: points[i].lng
			};
			corr_points.push(point);
		}
		return corr_points;
	};
	
	// Method used to convert a lat-long objects array to a string with all values (like an array of arrays)
	$scope.correctPointsGoogle = function(points){
		var corr_points = "[";
		for(var i = 0; i < points.length; i++){
			var point = "";
			if(points[i].lat != null){
				point = "[ " + points[i].lat + "," + points[i].lng + "]";
			} else {
				point = "[ " + points[i][0] + "," + points[i][1] + "]";
			}
			corr_points = corr_points +point + ",";
		}
		corr_points = corr_points.substring(0, corr_points.length-1);
		corr_points = corr_points + "]";
		return corr_points;
	};
	
	$scope.invertLatLong = function(arr){
		var tmp_arr = [];
		for(var i = 0; i < arr.length; i++){
			var coord = new Array(2);
			coord[0] = arr[i][1];
			coord[1] = arr[i][0];
			tmp_arr.push(coord);
		}
		return tmp_arr;
	};
	
}]);