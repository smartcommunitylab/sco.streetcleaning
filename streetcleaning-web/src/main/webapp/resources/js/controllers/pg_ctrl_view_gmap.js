'use strict';

/* Controllers */
var cgControllers = angular.module('cgControllers');

cg.controller('ViewCtrlGmap',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', 'sharedDataService', 'invokeWSService', 'invokeWSServiceNS', 'invokeWSServiceProxy', '$timeout',
                          function($scope, $http, $route, $routeParams, $rootScope, localize, sharedDataService, invokeWSService, invokeWSServiceNS, invokeWSServiceProxy, $timeout, $location, $filter) { 

	$scope.params = $routeParams;
	
	$scope.parkingMetersMarkers = [];
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	$scope.pmInitialMarkers = [];
	$scope.psInitialMarkers = [];
	$scope.bpInitialMarkers = [];
	$scope.mapZones0 = [];
	$scope.mapZones1 = [];
	$scope.mapZones2 = [];
	$scope.mapZones3 = [];
	$scope.mapZones4 = [];
	$scope.zoneFilter0 = null;
	$scope.zoneFilter1 = null;
	$scope.zoneFilter2 = null;
	$scope.zoneFilter3 = null;
	$scope.zoneFilter4 = null;
	$scope.checkArea = false;
	$scope.checkStreets = false;
	$scope.checkPm = false;
	$scope.checkPs = false;
	$scope.checkBp = false;
	$scope.checkZones0 = false;
	$scope.checkZones1 = false;
	$scope.checkZones2 = false;
	$scope.checkZones3 = false;
	$scope.checkZones4 = false;
	var widget_url_filters = "";
	var SHOW_ONLY_ACTIVE = true;
	var SHOW_ONLY_CHECKED = false;
	
	// DB type for zone. I have to implement a good solution for types
	var firstStreetCall = true;
	
	$scope.pmMarkerIcon = "imgs/markerIcons/parcometro.png";			// icon for parkingMeter object
	//$scope.psMarkerIcon = "imgs/markerIcons/parcheggioStruttura.png";	// icon for parkingStructure object
	$scope.psMarkerIcon = "imgs/structIcons/parking_structures_general_outline.png";	// icon for parkingStructure object
	//$scope.bpMarkerIcon = "imgs/markerIcons/puntobici.png";				// icon for bikePoint object
	$scope.bpMarkerIcon = "imgs/bikeIcons/bicicle_outline.png";				// icon for bikePoint object
	
	$scope.authHeaders = {
	    'Accept': 'application/json;charset=UTF-8'
	};
	
	// ----------------------- Block to read conf params and show/hide elements -----------------------
    $scope.isAreaVisible = function(){
    	return initializeService.isShowedArea();
    };
    
    $scope.isStreetVisible = function(){
    	return initializeService.isShowedStreet();
    };

    $scope.isPmVisible = function(){
    	return initializeService.isShowedPm();
    };

    $scope.isPsVisible = function(){
    	return initializeService.isShowedPs();
    };
    
    $scope.isBpVisible = function(){
    	return initializeService.isShowedBp();
    };

    $scope.isZones0Visible = function(){
    	return initializeService.isShowedZone0();
    };
    
    $scope.isZones1Visible = function(){
    	return initializeService.isShowedZone1();
    };
    
    $scope.isZones2Visible = function(){
    	return initializeService.isShowedZone2();
    };
    
    $scope.isZones3Visible = function(){
    	return initializeService.isShowedZone3();
    };
    
    $scope.isZones4Visible = function(){
    	return initializeService.isShowedZone4();
    };
    
    $scope.isAreaVisibleWG = function(){
    	return initializeService.isWidgetAreaShowed();
    };
    
    $scope.isStreetVisibleWG = function(){
    	return initializeService.isWidgetStreetShowed();
    };

    $scope.isPmVisibleWG = function(){
    	return initializeService.isWidgetPmShowed();
    };

    $scope.isPsVisibleWG = function(){
    	return initializeService.isWidgetPsShowed();
    };
    
    $scope.isBpVisibleWG = function(){
    	return initializeService.isWidgetBpShowed();
    };

    $scope.isZones0VisibleWG = function(){
    	return initializeService.isWidgetZone0Showed();
    };
    
    $scope.isZones1VisibleWG = function(){
    	return initializeService.isWidgetZone1Showed();
    };
    
    $scope.isZones2VisibleWG = function(){
    	return initializeService.isWidgetZone2Showed();
    };
    
    $scope.isZones3VisibleWG = function(){
    	return initializeService.isWidgetZone3Showed();
    };
    
    $scope.isZones4VisibleWG = function(){
    	return initializeService.isWidgetZone4Showed();
    };

    $scope.isFilterZone0 = function(){
    	return initializeService.isFilterZone0();
    };
    
    $scope.isFilterZone1 = function(){
    	return initializeService.isFilterZone1();
    };
    
    $scope.isFilterZone2 = function(){
    	return initializeService.isFilterZone2();
    };
    
    $scope.isFilterZone3 = function(){
    	return initializeService.isFilterZone3();
    };
    
    $scope.isFilterZone4 = function(){
    	return initializeService.isFilterZone4();
    };
    
    $scope.getUsedLang = function(){
    	return sharedDataService.getUsedLanguage();
    };
    
    $scope.isUsedItaLang = function(){
    	return ($scope.getUsedLang() == 'ita');
    };
    
    $scope.isUsedEngLang = function(){
    	return ($scope.getUsedLang() == 'eng');
    };
    
/*    $scope.initComponents = function(){
    	$scope.aconf = initializeService.getAreaConfData();
    	$scope.sconf = initializeService.getStreetConfData();
    	$scope.pmconf = initializeService.getPmConfData();
    	$scope.psconf = initializeService.getPsConfData();
    	$scope.bpconf = initializeService.getBpConfData();
    	$scope.zconf0 = initializeService.getZoneAttData0();
    	$scope.zconf1 = initializeService.getZoneAttData1();
    	$scope.zconf2 = initializeService.getZoneAttData2();
    	$scope.zconf3 = initializeService.getZoneAttData3();
    	$scope.zconf4 = initializeService.getZoneAttData4();
    	$scope.zone0_label = initializeService.getLabel0();
    	$scope.zone1_label = initializeService.getLabel1();
    	$scope.zone2_label = initializeService.getLabel2();
    	$scope.zone3_label = initializeService.getLabel3();
    	$scope.zone4_label = initializeService.getLabel4();
    	$scope.filterForZone0 = $scope.isFilterZone0();
    	$scope.filterForZone1 = $scope.isFilterZone1();
    	$scope.filterForZone2 = $scope.isFilterZone2();
    	$scope.filterForZone3 = $scope.isFilterZone3();
    	$scope.filterForZone4 = $scope.isFilterZone4();
    	$scope.checkArea = initializeService.isWidgetAreaChecked();
		$scope.checkStreets = initializeService.isWidgetStreetChecked();
		$scope.checkPm = initializeService.isWidgetPmChecked();
		$scope.checkPs = initializeService.isWidgetPsChecked();
		$scope.checkBp = initializeService.isWidgetBpChecked();
		$scope.checkZones0 = initializeService.isWidgetZone0Checked();
		$scope.checkZones1 = initializeService.isWidgetZone1Checked();
		$scope.checkZones2 = initializeService.isWidgetZone2Checked();
		$scope.checkZones3 = initializeService.isWidgetZone3Checked();
		$scope.checkZones4 = initializeService.isWidgetZone4Checked();
		$scope.widget_inport_url = initializeService.getConfWidgetUrl() + "/viewall/" + initializeService.getConfAppId();
		$scope.widget_url_params = $scope.setWidgetUrlParameters();
		SHOW_ONLY_CHECKED = ($scope.psconf.ps_show_widget) ? $scope.psconf.ps_show_widget.visible : false;
		SHOW_ONLY_ACTIVE = (initializeService.isOnlyActivePmShowed()) ? true : false;
    };*/
    
    $scope.setWidgetUrlParameters = function(){
    	var parameters = "?elements=";
    	if($scope.isAreaVisible()){
    		if($scope.checkArea){
    			parameters += "area:1,";
    		} else {
    			parameters += "area:0,";
    		}
    	}
    	if($scope.isStreetVisible()){
    		if($scope.checkStreets){
    			parameters += "parcheggio:1,";
    		} else {
    			parameters += "parcheggio:0,";
    		}
    	}
    	if($scope.isPmVisible()){
    		if($scope.checkPm){
    			parameters += "pm:1,";
    		} else {
    			parameters += "pm:0,";
    		}
    	}
    	if($scope.isPsVisible()){
    		if($scope.checkPs){
    			parameters += "ps:1,";
    		} else {
    			parameters += "ps:0,";
    		}
    	}
    	if($scope.isBpVisible()){
    		if($scope.checkBp){
    			parameters += "pb:1,";
    		} else {
    			parameters += "pb:0,";
    		}
    	}
    	if($scope.isZones0Visible() && !$scope.filterForZone0){
    		if($scope.checkZones0){
    			parameters += "zona0:1,";
    		} else {
    			parameters += "zona0:0,";
    		}
    	}
    	if($scope.isZones1Visible() && !$scope.filterForZone1){
    		if($scope.checkZones1){
    			parameters += "zona1:1,";
    		} else {
    			parameters += "zona1:0,";
    		}
    	}
    	if($scope.isZones2Visible() && !$scope.filterForZone2){
    		if($scope.checkZones2){
    			parameters += "zona2:1,";
    		} else {
    			parameters += "zona2:0,";
    		}
    	}
    	if($scope.isZones3Visible() && !$scope.filterForZone3){
    		if($scope.checkZones3){
    			parameters += "zona3:1,";
    		} else {
    			parameters += "zona3:0,";
    		}
    	}
    	if($scope.isZones4Visible() && !$scope.filterForZone4){
    		if($scope.checkZones4){
    			parameters += "zona4:1,";
    		} else {
    			parameters += "zona4:0,";
    		}
    	}
    	/*if($scope.filterForZone0 || $scope.filterForZone1 || $scope.filterForZone2 || $scope.filterForZone3 || $scope.filterForZone4){
    		parameters += "&filters=";
    		var zIndexs = initializeService.getZFilterIndexes();
    		var zVals = initializeService.getZValues();
    	}*/
    	
    	return parameters.substring(0, parameters.length - 1);
    };
    
    $scope.updateWidgetParameter = function(param, value){
    	switch(param){
    		case "area":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("area:0", "area:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("area:1", "area:0");
    			}
    			break;
    		case "parcheggio":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("parcheggio:0", "parcheggio:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("parcheggio:1", "parcheggio:0");
    			}
    			break;
    		case "pm":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("pm:0", "pm:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("pm:1", "pm:0");
    			}
    			break;
    		case "ps":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("ps:0", "ps:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("ps:1", "ps:0");
    			}
    			break;
    		case "bp":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("bp:0", "bp:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("bp:1", "bp:0");
    			}
    			break;
    		case "zona0":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona0:0", "zona0:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona0:1", "zona0:0");
    			}
    			break;
    		case "zona1":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona1:0", "zona1:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona1:1", "zona1:0");
    			}
    			break;
    		case "zona2":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona2:0", "zona2:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona2:1", "zona2:0");
    			}
    			break;
    		case "zona3":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona3:0", "zona3:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona3:1", "zona3:0");
    			}
    			break;
    		case "zona4":
    			if(value){
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona4:0", "zona4:1");
    			} else {
    				$scope.widget_url_params = $scope.widget_url_params.replace("zona4:1", "zona4:0");
    			}
    			break;
    	}
    };
    
    $scope.updateWidgetUrlFilters = function(zone, indx){
    	var filters = "&filters="
    	if(zone != null){
    		var zone_name = zone.name;
    		if(zone.name.indexOf(" ") > -1){
    			zone_name = zone.name.replace(new RegExp(" ", 'g'), "%20");
    		}
    		filters += "zona" + indx + ":" + zone_name;
    		widget_url_filters = filters;
    	} else {
    		widget_url_filters = "";
    	}
    };
    
    $scope.getWidgetFilters = function(){
    	return widget_url_filters;
    }
    
    // ---------------------- End Block to read conf params and show/hide elements ---------------------
	
	$scope.cash_mode = "CASH";
    $scope.automated_teller_mode = "AUTOMATED_TELLER";
    $scope.prepaid_card_mode = "PREPAID_CARD";
    $scope.parcometro = "PARCOMETRO";
    
	$scope.listaPagamenti = [
	    {
	         idObj: $scope.cash_mode,
	         descrizione: "Contanti"
	    },
	    {
	         idObj: $scope.automated_teller_mode,
	         descrizione: "Cassa automatica"
	    },
	    {
	         idObj: $scope.prepaid_card_mode,
	         descrizione: "Carta prepagata"
	    },
	    {
	         idObj: $scope.parcometro,
	         descrizione: "Parcometro"
	    }
	];
	
	$scope.mapCenter = {
		latitude: 45.88875357753771,
	    longitude: 11.037440299987793
	};
	
	$scope.mapOption = {
		center : sharedDataService.getConfMapCenter(),	//"[" + $scope.mapCenter.latitude + "," + $scope.mapCenter.longitude + "]",
		zoom : parseInt(sharedDataService.getConfMapZoom())
	};
	
	$scope.initMapOption = function(zones){
		var recenter = sharedDataService.getConfMapRecenter();
		if(recenter != null && recenter != "null"){
			$scope.resizeMap(recenter, 1);
		} else {
			var center = $scope.mapOption.center;
			if(zones != null && zones.length > 0){
				if(recenter != null && recenter != "null"){
					$scope.resizeMap(recenter, 1);
				} else {
					center = zones[0];
					if(center){
						$scope.resizeMap(center, 0);
					} else {
						$scope.resizeMap($scope.mapOption.center, 1);
					}
				}
			} else {
				$scope.resizeMap(center, 1);
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
	
	$scope.resizeMap = function(center, type){
		if($scope.map != null){ 	// the first time I show the area map it is null
	    	google.maps.event.trigger($scope.map, 'resize');
	    	var corr_center = {};
	    	if(type == 0){
		    	var lat = Number(center.lat);
		    	var lng = Number(center.lng);
		    	corr_center = {
		    		lat: lat,
		    		lng: lng
		    	}
	    	} else {
	    		var pointCoord = center.split(",");
	    		var lat = Number(pointCoord[0].trim().substring(0, pointCoord[0].length));
				var lng = Number(pointCoord[1].trim().substring(0, pointCoord[1].length));
		    	corr_center = {
		    		lat: lat,
		    		lng: lng
		    	}
	    	}
	    	$scope.map.setCenter(corr_center);
	        $scope.map.setZoom(parseInt($scope.mapOption.zoom));
	    } else {
	    	$scope.mapOption.center = center;
	    }
	    return true;
	};
	
	
	$scope.initPage = function(){
		$scope.mapelements = {
			rateareas : $scope.checkArea,
			streets : $scope.checkStreets,
			parkingmeters : $scope.checkPm,
			parkingstructs : $scope.checkPs,
			bikepoints : $scope.checkBp,
			zones0 : $scope.checkZones0,
			zones1 : $scope.checkZones1,
			zones2 : $scope.checkZones2,
			zones3 : $scope.checkZones3,
			zones4 : $scope.checkZones4
		};
	};
	
	// ------------------------------- Utility methods ----------------------------------------
	$scope.correctObjId = function(id, i){
		if(i == 0){
			return id;
		} else {
			return id + '_' + i;
		}
	};
	
	$scope.correctColor = function(value){
		return "#" + value;
	};
	
	$scope.correctPointGoogle = function(point){
		return point.lat + "," + point.lng;
	};
	
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
	
	$scope.correctPointsGoogle = function(points){
		var corr_points = "[";
		for(var i = 0; i < points.length; i++){
			var point = "[ " + points[i].lat + "," + points[i].lng + "]";
			corr_points = corr_points +point + ",";
		}
		corr_points = corr_points.substring(0, corr_points.length-1);
		corr_points = corr_points + "]";
		return corr_points;
	};
	
	$scope.correctMyGeometryPolygon = function(geo){
		var tmpPolygon = {
			points: null
		};
		var points = [];
		if(geo != null && geo.points != null && geo.points.length > 0){
			for(var i = 0; i < geo.points.length; i++){
				var tmpPoint = geo.points[i];
				points.push(tmpPoint);
			}
		}
		
		tmpPolygon.points = points;

		return tmpPolygon;
	};
	
	$scope.getCorrectZoneType = function(type){
		var corrType = null;
		var types = sharedDataService.getZoneTypeList();
		if(types){
			var found = false;
			for(var i = 0; (i < types.length && !found); i++){
				if(types[i].value == type){
					corrType = types[i];
					found = true;
				}
			}
		}
		return corrType;
	};
	
	// correctMyZones: used to correct the zone object with all the necessary data
	$scope.correctMyZones = function(zones){
		var correctedZones = [];
		for(var i = 0; i < zones.length; i++){
			var sub = (zones[i].submacro) ? zones[i].submacro : ((zones[i].submicro) ? zones[i].submicro : null);
			var corrType = $scope.getCorrectZoneType(zones[i].type);
			var lbl = (sub) ? (zones[i].name + "_" + sub) : zones[i].name;
			var correctZone = {
				id: zones[i].id,
				id_app: zones[i].id_app,
				color: zones[i].color,
				name: zones[i].name,
				submacro: zones[i].submacro,
				submicro: zones[i].submicro,
				type: zones[i].type,
				myType: corrType,
				note: zones[i].note,
				centermap: zones[i].centermap,
				geometry: $scope.correctMyGeometryPolygon(zones[i].geometry),
				geometryFromSubelement: zones[i].geometryFromSubelement,
				subelements: $scope.loadStreetsFromZone(zones[i].id),
				label: lbl
			};
			correctedZones.push(correctZone);
		}
		return correctedZones;
	};
	
	$scope.castMyPaymentModeToString = function(myPm){
		var correctedPm = "";
		for(var i = 0; i < myPm.length; i++){
			var stringVal = "";
			switch (myPm[i]){
				case $scope.cash_mode : 
					stringVal = $scope.listaPagamenti[0].descrizione;
					break;
				case $scope.automated_teller_mode: 
					stringVal = $scope.listaPagamenti[1].descrizione;
					break;
				case $scope.prepaid_card_mode: 
					stringVal = $scope.listaPagamenti[2].descrizione;
					break;
				case $scope.parcometro: 
					stringVal = $scope.listaPagamenti[3].descrizione;
					break;
				default: break;
			}
			correctedPm = correctedPm + stringVal + ",";
		}
		correctedPm = correctedPm.substring(0, correctedPm.length-1);
		return correctedPm;
	};
	
	$scope.addLabelToZoneObject = function(zone){
		var sub = (zone.submacro) ? zone.submacro : ((zone.submicro) ? zone.submicro : null);
    	var lbl = (sub) ? (zone.name + "_" + sub) : zone.name;
    	var corrected_zone = {
    		id: zone.id,
    		id_app: zone.id_app,
    		color: zone.color,
    		name: zone.name,
    		submacro: zone.submacro,
    		submicro: zone.submicro,
    		type: zone.type,
    		note: zone.note,
    		geometry: zone.geometry,
    		geometryFromSubelement: zone.geometryFromSubelement,
    		subelements: zone.subelements,
    		label: lbl
    	};
    	return corrected_zone;
    };		
	
	// ----------------------------------------------------------------------------------------------
	
	$scope.initMap = function(pmMarkers, psMarkers, bpMarkers){
		
		$scope.options = {
		    scrollwheel: true
		};
		
		if(pmMarkers!= null){
			if(SHOW_ONLY_ACTIVE){
				$scope.mapParkingMetersMarkers = [];
				for(var i = 0; i < pmMarkers.length; i++){
					if(pmMarkers[i].data.status == "ACTIVE"){
						pmMarkers[i].options.visible = true;
						$scope.mapParkingMetersMarkers.push(pmMarkers[i]);
					} else {
						pmMarkers[i].options.visible = false;
					}
				}
			} else {
				$scope.mapParkingMetersMarkers = pmMarkers;
			}
		} else {
			$scope.mapParkingMetersMarkers = [];
		}
		if(psMarkers != null){
			if(SHOW_ONLY_CHECKED){
				$scope.mapParkingStructureMarkers = [];
				for(var i = 0; i < psMarkers.length; i++){
					if(psMarkers[i].data.showInWidget){
						psMarkers[i].options.visible = true;
						$scope.mapParkingStructureMarkers.push(psMarkers[i]);
					} else {
						psMarkers[i].options.visible = false;
					}
				}
			} else {
				$scope.mapParkingStructureMarkers = psMarkers;
			}
		} else {
			$scope.mapParkingStructureMarkers = [];
		}
		if(bpMarkers != null){
			$scope.mapBikePointMarkers = bpMarkers;
		} else {
			$scope.mapBikePointMarkers = [];
		}
		//$scope.addMarkerToMap($scope.map);
		$scope.mapReady = true;
		//$scope.$apply();
	};
	
	$scope.addMarkerToMap = function(map){
		if($scope.parkingMetersMarkers != null){
			for(var i = 0; i < $scope.parkingMetersMarkers.length; i++){
				$scope.parkingMetersMarkers[i].options.map = map;
			}
		}
		if($scope.parkingStructureMarkers != null){
			for(var i = 0; i < $scope.parkingStructureMarkers.length; i++){
				$scope.parkingStructureMarkers[i].options.map = map;
			}
		}
		if($scope.bikePointMarkers != null){
			for(var i = 0; i < $scope.bikePointMarkers.length; i++){
				$scope.bikePointMarkers[i].options.map = map;
			}
		}
	};
	
	// Show/hide parkingMeters markers
	$scope.changeParkingMetersMarkers = function(){
		if(!$scope.mapelements.parkingmeters){
			$scope.showParkingMetersMarkers();
			$scope.updateWidgetParameter("pm", true);
		} else {
			$scope.hideParkingMetersMarkers();
			$scope.updateWidgetParameter("pm", false);
		}
	};

	$scope.showParkingMetersMarkers = function() {
        $scope.mapParkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 0);
        //$scope.refreshMap();
    };
    
    $scope.hideParkingMetersMarkers = function() {
    	$scope.mapParkingMetersMarkers = []; //$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide parkingStructures markers
    $scope.changeParkingStructuresMarkers = function(){
		if(!$scope.mapelements.parkingstructs){
			$scope.showParkingStructuresMarkers();
			$scope.updateWidgetParameter("ps", true);
		} else {
			$scope.hideParkingStructuresMarkers();
			$scope.updateWidgetParameter("ps", false);
		}
	};
    
    $scope.showParkingStructuresMarkers = function() {
        $scope.mapParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
        //$scope.refreshMap();
    };
    
    $scope.hideParkingStructuresMarkers = function() {
    	$scope.mapParkingStructureMarkers = []; //$scope.setAllMarkersMap($scope.parkinStructureMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide bikePoints markers
    $scope.changeBikePointsMarkers = function(){
		if(!$scope.mapelements.bikepoints){
			$scope.showBikePointsMarkers();
			$scope.updateWidgetParameter("bp", true);
		} else {
			$scope.hideBikePointsMarkers();
			$scope.updateWidgetParameter("bp", false);
		}
	};
    
    $scope.showBikePointsMarkers = function() {
        $scope.mapBikePointMarkers = $scope.setAllMarkersMap($scope.bikePointMarkers, $scope.map, true, 2);
        //$scope.refreshMap();
    };
    
    $scope.hideBikePointsMarkers = function() {
    	$scope.mapBikePointMarkers = [];//$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide areas polygons
    $scope.changeAreaPolygons = function(){
		if(!$scope.mapelements.rateareas){
			$scope.showAreaPolygons();
			$scope.updateWidgetParameter("area", true);
		} else {
			$scope.hideAreaPolygons();
			$scope.updateWidgetParameter("area", false);
		}
	};
    
    $scope.showAreaPolygons = function() {
    	$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true);
        //$scope.refreshMap();
    };
    
    $scope.hideAreaPolygons = function() {
    	$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, false);
    	$scope.hideAllAreas($scope.areaWS);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide zones polygons
    $scope.changeZonePolygons = function(index){
    	switch(index){
    	case 0: 
    		if(!$scope.mapelements.zones0){
    			$scope.showZonePolygons(index);
    			$scope.updateWidgetParameter("zona0", true);
    		} else {
    			$scope.hideZonePolygons(index);
    			$scope.updateWidgetParameter("zona1", false);
    		}
    		break;
    	case 1:
    		if(!$scope.mapelements.zones1){
    			$scope.showZonePolygons(index);
    			$scope.updateWidgetParameter("zona1", true);
    		} else {
    			$scope.hideZonePolygons(index);
    			$scope.updateWidgetParameter("zona1", false);
    		}
    		break;
    	case 2: 
    		if(!$scope.mapelements.zones2){
    			$scope.showZonePolygons(index);
    			$scope.updateWidgetParameter("zona2", true);
    		} else {
    			$scope.hideZonePolygons(index);
    			$scope.updateWidgetParameter("zona2", false);
    		}
    		break;
    	case 3: 
    		if(!$scope.mapelements.zones3){
    			$scope.showZonePolygons(index);
    			$scope.updateWidgetParameter("zona3", true);
    		} else {
    			$scope.hideZonePolygons(index);
    			$scope.updateWidgetParameter("zona3", false);
    		}
    		break;
    	case 4:
    		if(!$scope.mapelements.zones4){
    			$scope.showZonePolygons(index);
    			$scope.updateWidgetParameter("zona4", true);
    		} else {
    			$scope.hideZonePolygons(index);
    			$scope.updateWidgetParameter("zona4", false);
    		}
    		break;
    	default: break;
    	}
	};
    
    $scope.showZonePolygons = function(index) {
    	switch(index){
    		case 0: 
    			//$scope.mapZones0 = $scope.initZonesOnMap($scope.zoneWS0, index, true);
    			$scope.initZonesOnMap($scope.zoneWS0, index, true);
    			break;
    		case 1: 
    			//$scope.mapZones1 = $scope.initZonesOnMap($scope.zoneWS1, index, true);
    			$scope.initZonesOnMap($scope.zoneWS1, index, true);
    			break;
    		case 2: 
    			$//scope.mapZones2 = $scope.initZonesOnMap($scope.zoneWS2, index, true);
    			$scope.initZonesOnMap($scope.zoneWS2, index, true);
    			break;
    		case 3:
    			//$scope.mapZones3 = $scope.initZonesOnMap($scope.zoneWS3, index, true);
    			$scope.initZonesOnMap($scope.zoneWS3, index, true);
    			break;
    		case 4:
    			//$scope.mapZones4 = $scope.initZonesOnMap($scope.zoneWS4, index, true);
    			$scope.initZonesOnMap($scope.zoneWS4, index, true);
    			break;
    		default: break;
    	}
    };
    
    $scope.hideZonePolygons = function(index) {
    	switch(index){
			case 0: 
				//$scope.mapZones0 = $scope.initZonesOnMap($scope.zoneWS0, index, false);
				$scope.initZonesOnMap($scope.zoneWS0, index, false);
				$scope.hideAllZones($scope.zoneWS0, index);
				break;
			case 1: 
				//$scope.mapZones1 = $scope.initZonesOnMap($scope.zoneWS1, index, false);
				$scope.initZonesOnMap($scope.zoneWS1, index, false);
				$scope.hideAllZones($scope.zoneWS1, index);
				break;
			case 2: 
				//$scope.mapZones2 = $scope.initZonesOnMap($scope.zoneWS2, index, false);
				$scope.initZonesOnMap($scope.zoneWS2, index, false);
				$scope.hideAllZones($scope.zoneWS2, index);
				break;
			case 3:
				//$scope.mapZones3 = $scope.initZonesOnMap($scope.zoneWS3, index, false);
				$scope.initZonesOnMap($scope.zoneWS3, index, false);
				$scope.hideAllZones($scope.zoneWS3, index);
				break;
			case 4:
				//$scope.mapZones4 = $scope.initZonesOnMap($scope.zoneWS4, index, false);
				$scope.initZonesOnMap($scope.zoneWS4, index, false);
				$scope.hideAllZones($scope.zoneWS4, index);
				break;
			default: break;
		}
    };
    
    // Show/hide microzones polygons
/*    $scope.changeMicrozonePolygons = function(){
		if(!$scope.mapelements.microzones){
			$scope.showMicrozonePolygons();
		} else {
			$scope.hideMicrozonePolygons();
		}
	};*/
    
/*    $scope.showMicrozonePolygons = function() {
    	$scope.mapMicrozones = $scope.initZonesOnMap($scope.microzoneWS, true);
        //$scope.refreshMap();
    };
    
    $scope.hideMicrozonePolygons = function() {
    	$scope.mapMicrozones = $scope.initZonesOnMap($scope.microzoneWS, false);
    	$scope.hideAllMicrozones();
        //$scope.refreshMap();
        //$scope.$apply();
    };    */
    
    // Show/hide streets polygons
    $scope.changeStreetPolylines = function(){
		if(!$scope.mapelements.streets){
			$scope.showStreetPolylines();
			$scope.updateWidgetParameter("parcheggio", true);
		} else {
			$scope.hideStreetPolylines();
			$scope.updateWidgetParameter("parcheggio", false);
		}
	};
    
    $scope.showStreetPolylines = function() {
    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true);
        //$scope.refreshMap();
    };
    
    $scope.hideStreetPolylines = function() {
    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, false);
    	$scope.hideAllStreets();
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    $scope.hideAllStreets = function(){
    	if($scope.map && $scope.mapStreets){
    		var toDelStreet = $scope.map.shapes;
	    	for(var i = 0; i < $scope.mapStreets.length; i++){
	    		toDelStreet[$scope.mapStreets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
	    	}
    	}
    };
    
	// Method hideAllZone: used to hide in map the poligon or polyline relative to a zona
	// - limit: consider max 5 zone type in city
	$scope.hideAllZones = function(zones, index){
		if($scope.map){
			var toHideZone = $scope.map.shapes;
			//var toHideZone = $scope.getCorrectMapZone(index);
			if(toHideZone != null && zones){
		    	for(var i = 0; i < zones.length; i++){
		    		if(zones[i].data == null){	// case zone list
			    		if(zones[i].subelements != null && zones[i].subelements.length > 0 && zones[i].geometryFromSubelement){
			    			if(zones[i].subelements.length == 1){
			    				if(toHideZone[zones[i].id] != null){
			    	    			toHideZone[zones[i].id].setMap(null);
			    	    		}
			    			} else {
			    				for(var j = 0; j < zones[i].subelements.length; j++){
			    					var myId = $scope.correctObjId(zones[i].id, j);
			    					if(toHideZone[myId] != null){
			    						toHideZone[myId].setMap(null);
						    		}
			    				}
			    			}
			    		} else {
				    		if(toHideZone[zones[i].id] != null){
				    			toHideZone[zones[i].id].setMap(null);
				    		}
			    		}
		    		} else {					// case zone polygon list
		    			if(zones[i].data.subelements != null && zones[i].data.subelements.length > 0 && zones[i].data.geometryFromSubelement){
			    			if(zones[i].data.subelements.length == 1){
			    				if(toHideZone[zones[i].id] != null){
			    	    			toHideZone[zones[i].id].setMap(null);
			    	    		}
			    			} else {
			    				for(var j = 0; j < zones[i].data.subelements.length; j++){
			    					var myId = $scope.correctObjId(zones[i].id, j);
			    					if(toHideZone[myId] != null){
			    						toHideZone[myId].setMap(null);
						    		}
			    				}
			    			}
			    		} else {
				    		if(toHideZone[zones[i].id] != null){
				    			toHideZone[zones[i].id].setMap(null);
				    		}
			    		}
		    		}
		    	}
			}
		}
    };    
    
/*    $scope.hideAllZones = function(){
    	var toDelZones = $scope.map.shapes;
    	for(var i = 0; i < $scope.mapZones.length; i++){
    		toDelZones[$scope.mapZones[i].id].setMap(null);		// I can access dinamically the value of the object shapes for zones
    	}
    };
    
    $scope.hideAllMicrozones = function(){
	    var toHideZone = $scope.map.shapes;
	    for(var i = 0; i < $scope.mapMicrozones.length; i++){
	    	if($scope.mapMicrozones[i].data.subelements != null && $scope.mapMicrozones[i].data.subelements.length > 0){
	    		if($scope.mapMicrozones[i].data.subelements.length == 1){
	    			if(toHideZone[$scope.mapMicrozones[i].id] != null){
	        			toHideZone[$scope.mapMicrozones[i].id].setMap(null);
	        		}
	    		} else {
	    			for(var j = 0; j < $scope.mapMicrozones[i].data.subelements.length; j++){
	    				var myId = $scope.correctObjId($scope.mapMicrozones[i].data.id, j);
	    				if(toHideZone[myId] != null){
	    					toHideZone[myId].setMap(null);
			    		}
	    			}
	    		}
	    	}	
	    }
    };   */ 
    
    $scope.correctAreaId = function(id, i){
		if(i == 0){
			return id;
		} else {
			return id + '_' + i;
		}
	};
    
    $scope.hideAllAreas = function(areas){
    	//var toDelAreas = $scope.map.shapes;
    	//for(var i = 0; i < $scope.mapAreas.length; i++){
    	//	toDelAreas[$scope.mapAreas[i].id].setMap(null);		// I can access dinamically the value of the object shapes for zones
    	//}
    	if($scope.map && areas){
	    	var toHideArea = $scope.map.shapes;
	    	for(var i = 0; i < areas.length; i++){
	    		if(areas[i].geometry != null && areas[i].geometry.length > 0){
		    		if(areas[i].geometry.length == 1){
		    			if(toHideArea[areas[i].id] != null){
			    			toHideArea[areas[i].id].setMap(null);
			    		}
		    		} else {
		    			for(var j = 0; j <  areas[i].geometry.length; j++){
		    				var myId = $scope.correctAreaId(areas[i].id, j);
		    				if(toHideArea[myId] != null){
				    			toHideArea[myId].setMap(null);
				    		}
		    			}
		    		}
	    		}
	    	}
    	}
    };
    
    $scope.setAllMarkersMap = function(markers, map, visible, type){
    	for(var i = 0; i < markers.length; i++){
    		var visible_state = true;
    		if(type == 0){	// case pm
	    		if(SHOW_ONLY_ACTIVE){
	    			if(markers[i].data.status && markers[i].data.status == "ACTIVE"){
	    				visible_state = true
	    			} else {
	    				visible_state = false;
	    			}
	    		}
    		}
    		if(type == 1){	// case ps
	    		if(SHOW_ONLY_CHECKED){
					if(markers[i].data.showInWidget){
						visible_state = true;
					} else {
						visible_state = false;
					}
				}
    		}
    		markers[i].options.visible = visible && visible_state;
    		markers[i].options.map = map;
    	}
    	return markers;
    };
    
    $scope.refreshMap = function() {
        //optional param if you want to refresh you can pass null undefined or false or empty arg
        $scope.map.control.refresh($scope.mapCenter);
        //$scope.map.control.refresh(null);
        $scope.map.control.getGMap().setZoom(5);
        $scope.map.control.getGMap().setZoom(14);
    };
    
    $scope.getCorrectPmIconByAreaName = function(areaName){
    	var myIcon = "";
    	switch(areaName){
    		case "Rossa":
    			myIcon = "imgs/parkingMeterIcons/parchimetro_red_outline.png";
    			break;
    		case "Gialla":
    			myIcon = "imgs/parkingMeterIcons/parchimetro_yellow_outline.png";
    			break;
    		case "Arancio (Ospedale)":
    			myIcon = "imgs/parkingMeterIcons/parchimetro_orange_outline.png";
    			break;
    		default:
    			break;
    		
    	}
    	return myIcon;
    };
	
	var createMarkers = function(i, marker, type) {
		//------ To be configured in external conf file!!!!!------
		var company = "";
		var appId = sharedDataService.getConfAppId();
		if(appId == 'rv'){ 
			company = "amr";
		} else {
			company = "tm";
		}
		var baseUrl = "rest/nosec";
		var defaultMarkerColor = "FF0000";
		//--------------------------------------------------------
		
		var myIcon = "";
		var myAreaPm = {};
		var zones0 = [];
		var zones1 = [];
		var zones2 = [];
		var zones3 = [];
		var zones4 = [];
		var cid = "";
		switch(type){
			case 1 : 
				myAreaPm = $scope.getLocalAreaById(marker.areaId);
				myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
				cid = "c" + marker.id;
				break;
			case 2 : 
				myIcon = $scope.psMarkerIcon; 
				break;
			case 3 :
				myIcon = $scope.bpMarkerIcon;
		}
		// zone init
		if(marker.zones){
			for(var j = 0; j < marker.zones.length; j++){
				var z0 = $scope.getLocalZoneById(marker.zones[j], 1, 0);
				var z1 = $scope.getLocalZoneById(marker.zones[j], 1, 1);
				var z2 = $scope.getLocalZoneById(marker.zones[j], 1, 2);
				var z3 = $scope.getLocalZoneById(marker.zones[j], 1, 3);
				var z4 = $scope.getLocalZoneById(marker.zones[j], 1, 4);
				if(z0 != null){
					zones0.push($scope.addLabelToZoneObject(z0));
				} else if(z1 != null){
					zones1.push($scope.addLabelToZoneObject(z1));
				} else if(z2 != null){
					zones2.push($scope.addLabelToZoneObject(z2));
				} else if(z3 != null){
					zones3.push($scope.addLabelToZoneObject(z3));
				} else if(z4 != null){
					zones4.push($scope.addLabelToZoneObject(z4));
				}
			}
		}
		
		var ret = {
			data: marker,
			id: i	
		};
		if(marker.geometry != null){
			ret = {
				id: i,
				position: marker.geometry.lat + "," + marker.geometry.lng,
			    coords: { 
			        latitude: marker.geometry.lat,
			        longitude: marker.geometry.lng
			    },
			    options: { 
			    	draggable: true,
			    	visible: true,
			    	map:null
			    },
			    cid : cid,
				data: marker,
				zones0: zones0,
				zones1: zones1,
				zones2: zones2,
				zones3: zones3,
				zones4: zones4,
				area: myAreaPm,
				icon: myIcon,
				showWindow: false
			};
			ret.closeClick = function () {
		        ret.showWindow = false;
		    };
		    ret.onClick = function () {
		    	console.log("I am in ret marker click event function: " + ret.data.code);
		    	ret.showWindow = !ret.showWindow;
		    };
		}
		return ret;
	};
	  
	$scope.initAreasOnMap = function(areas, visible){
		var area = {};
		var poligons = {};
		var tmpAreas = [];
		if(areas){
			for(var i = 0; i < areas.length; i++){
				if(areas[i].geometry != null && areas[i].geometry.length > 0 && areas[i].geometry[0].points.length > 0){
					var zones0 = [];
					var zones1 = [];
					var zones2 = [];
					var zones3 = [];
					var zones4 = [];
					// zone init
					if(areas[i].zones){
						for(var j = 0; j < areas[i].zones.length; j++){
							var z0 = $scope.getLocalZoneById(areas[i].zones[j], 1, 0);
							var z1 = $scope.getLocalZoneById(areas[i].zones[j], 1, 1);
							var z2 = $scope.getLocalZoneById(areas[i].zones[j], 1, 2);
							var z3 = $scope.getLocalZoneById(areas[i].zones[j], 1, 3);
							var z4 = $scope.getLocalZoneById(areas[i].zones[j], 1, 4);
							if(z0 != null){
								zones0.push($scope.addLabelToZoneObject(z0));
							} else if(z1 != null){
								zones1.push($scope.addLabelToZoneObject(z1));
							} else if(z2 != null){
								zones2.push($scope.addLabelToZoneObject(z2));
							} else if(z3 != null){
								zones3.push($scope.addLabelToZoneObject(z3));
							} else if(z4 != null){
								zones4.push($scope.addLabelToZoneObject(z4));
							}
						}
					}
					for(var j = 0; j < areas[i].geometry.length; j++){
						poligons = areas[i].geometry;
						area = {
							id: $scope.correctAreaId(areas[i].id, j),
							path: $scope.correctPoints(poligons[j].points),
							gpath: $scope.correctPointsGoogle(poligons[j].points),
							stroke: {
							    color: $scope.correctColor(areas[i].color),
							    weight: 3
							},
							data: areas[i],
							zones0: zones0,
							zones1: zones1,
							zones2: zones2,
							zones3: zones3,
							zones4: zones4,
							info_windows_pos: $scope.correctPointGoogle(poligons[j].points[1]),
							info_windows_cod: "a" + areas[i].id,
							editable: false,
							draggable: false,
							geodesic: false,
							visible: visible,
							fill: {
							    color: $scope.correctColor(areas[i].color),
							    opacity: 0.7
							}
						};
						tmpAreas.push(area);
					}
				}
			}
		}
//		if(areas != null){
//			for(var i = 0; i < areas.length; i++){
//				if(areas[i].geometry != null && areas[i].geometry.length > 0 && areas[i].geometry[0].points.length > 0 ){
//					poligons = areas[i].geometry;
//					area = {
//						id: areas[i].id,
//						path: $scope.correctPoints(poligons[0].points),
//						gpath: $scope.correctPointsGoogle(poligons[0].points),
//						stroke: {
//						    color: $scope.correctColor(areas[i].color),
//						    weight: 3
//						},
//						data: areas[i],
//						info_windows_pos: $scope.correctPointGoogle(poligons[0].points[1]),
//						info_windows_cod: "a" + areas[i].id,
//						editable: true,
//						draggable: true,
//						geodesic: false,
//						visible: visible,
//						fill: {
//						    color: $scope.correctColor(areas[i].color),
//						    opacity: 0.7
//						}
//					};
//					tmpAreas.push(area);
//				}
//			}
//		}
		return tmpAreas;
	};
	
	$scope.initStreetsOnMap = function(streets, visible){
		var street = {};
		var poligons = {};
		var tmpStreets = [];
		
		if(streets){
			for(var i = 0; i < streets.length; i++){
				var myAreaS = $scope.getLocalAreaById(streets[i].rateAreaId);
				var zones0 = [];
				var zones1 = [];
				var zones2 = [];
				var zones3 = [];
				var zones4 = [];
				// zone init
				for(var j = 0; j < streets[i].zones.length; j++){
					var z0 = $scope.getLocalZoneById(streets[i].zones[j], 1, 0);
					var z1 = $scope.getLocalZoneById(streets[i].zones[j], 1, 1);
					var z2 = $scope.getLocalZoneById(streets[i].zones[j], 1, 2);
					var z3 = $scope.getLocalZoneById(streets[i].zones[j], 1, 3);
					var z4 = $scope.getLocalZoneById(streets[i].zones[j], 1, 4);
					if(z0 != null){
						zones0.push($scope.addLabelToZoneObject(z0));
					} else if(z1 != null){
						zones1.push($scope.addLabelToZoneObject(z1));
					} else if(z2 != null){
						zones2.push($scope.addLabelToZoneObject(z2));
					} else if(z3 != null){
						zones3.push($scope.addLabelToZoneObject(z3));
					} else if(z4 != null){
						zones4.push($scope.addLabelToZoneObject(z4));
					}
				}
				if(streets[i].geometry != null){
					poligons = streets[i].geometry;
					street = {
						id: streets[i].id,
						path: $scope.correctPoints(poligons.points),
						gpath: $scope.correctPointsGoogle(poligons.points),
						stroke: {
						    color: $scope.correctColor(streets[i].color),
						    weight: (visible) ? 3 : 0
						},
						data: streets[i],
						area: myAreaS,
						zones0: zones0,
						zones1: zones1,
						zones2: zones2,
						zones3: zones3,
						zones4: zones4,
						pms: streets[i].myPms,
						info_windows_pos: $scope.correctPointGoogle(poligons.points[1]),
						info_windows_cod: "s" + streets[i].id,
						editable: false,
						draggable: false,
						geodesic: false,
						visible: visible
						//icons:
					};
					//street.setMap($scope.map);
					tmpStreets.push(street);
				}
			}
		}
		return tmpStreets;
	};
	
    $scope.addZonePoligonToList = function(zone, index){
    	switch(index){
	    	case 0: $scope.mapZones0.push(zone);
				break;
			case 1: $scope.mapZones1.push(zone);
				break;
			case 2: $scope.mapZones2.push(zone);
				break;
			case 3: $scope.mapZones3.push(zone);
				break;
			case 4: $scope.mapZones4.push(zone);
				break;
			default: break;
		}	
    };
	
	$scope.initZonesOnMap = function(zones, index, visible){
		var zone = {};
		var poligons = {};
		
		switch(index){
			case 0: 
				if($scope.mapZones0 != null && $scope.mapZones0.length > 0){
					$scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.mapZones0 = [];
				}
				break;
			case 1: 
				if($scope.mapZones1 != null && $scope.mapZones1.length > 0){
					$scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.mapZones1 = [];
				}
				break;
			case 2: 
				if($scope.mapZones2 != null && $scope.mapZones2.length > 0){
					$scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.mapZones2 = [];
				}
				break;
			case 3: 
				if($scope.mapZones3 != null && $scope.mapZones3.length > 0){
					$scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.mapZones3 = [];
				}
				break;
			case 4: 
				if($scope.mapZones4 != null && $scope.mapZones4.length > 0){
					$scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.mapZones4 = [];
				}
				break;
			default: break;
		}
		
		if(zones){
			for(var i = 0; i < zones.length; i++){
				if(zones[i].geometryFromSubelement){
					var streets = zones[i].subelements;//$scope.loadStreetsFromZone(zones[i].id);
					var color = $scope.lightgray;
					if(streets != null && streets.length > 0){
						color = streets[0].area_color;
					}
					if(streets != null && streets.length > 0){
						for(var j = 0; j < streets.length; j++){
							var polyline = streets[j].geometry;
							zone = {
								id: $scope.correctObjId(zones[i].id, j),
								type: "polyline",
								path: $scope.correctPoints(polyline.points),
								gpath: $scope.correctPointsGoogle(polyline.points),
								stroke: {
								    color: $scope.correctColor(color),
								    weight: 3,
								    opacity: 0.6
								},
								data: zones[i],
								info_windows_pos: $scope.correctPointGoogle(polyline.points[1]),
								info_windows_cod: "z" + zones[i].id,
								editable: true,
								draggable: true,
								geodesic: false,
								visible: visible,
								subelements: streets
							};
							$scope.addZonePoligonToList(zone, index);
						}
					}
				} else {
					if(zones[i].geometry != null && zones[i].geometry.points.length > 0){
						poligons = zones[i].geometry;
						zone = {
							id: zones[i].id,
							type: "polygon",
							path: $scope.correctPoints(poligons.points),
							gpath: $scope.correctPointsGoogle(poligons.points),
							stroke: {
							    color: $scope.correctColor(zones[i].color),
							    weight: 3,
							    opacity: 0.6
							},
							data: zones[i],
							info_windows_pos: $scope.correctPointGoogle(poligons.points[1]),
							info_windows_cod: "z" + zones[i].id,
							editable: true,
							draggable: true,
							geodesic: false,
							visible: visible,
							fill: {
							    color: $scope.correctColor(zones[i].color),
							    opacity: 0.4
							}
						};
						$scope.addZonePoligonToList(zone, index);
					}
				}
			}
		}
	};
	
	
	/*$scope.initZonesOnMap = function(zones, visible){
		var zone = {};
		var poligons = {};
		var tmpZones = [];
		
		for(var i = 0; i < zones.length; i++){
			if(zones[i].geometryFromSubelement){
				var streets = zones[i].subelements;//$scope.loadStreetsFromZone(zones[i].id);
				var color = $scope.lightgray;
				if(streets != null && streets.length > 0){
					color = streets[0].area_color;
				}
				if(streets != null && streets.length > 0){
					for(var j = 0; j < streets.length; j++){
						var polyline = streets[j].geometry;
						zone = {
							id: $scope.correctObjId(zones[i].id, j),
							path: $scope.correctPoints(polyline.points),
							gpath: $scope.correctPointsGoogle(polyline.points),
							stroke: {
							    color: $scope.correctColor(color),
							    weight: 3
							},
							data: zones[i],
							info_windows_pos: $scope.correctPointGoogle(polyline.points[1]),
							info_windows_cod: "z" + zones[i].id,
							editable: true,
							draggable: true,
							geodesic: false,
							visible: visible,
							subelements: streets
						};
						tmpZones.push(zone);
					}
				}
			} else {
				if(zones[i].geometry != null && zones[i].geometry.points != null && zones[i].geometry.points.length > 0){
					poligons = zones[i].geometry;
					zone = {
						id: zones[i].id,
						path: $scope.correctPoints(poligons.points),
						gpath: $scope.correctPointsGoogle(poligons.points),
						stroke: {
						    color: $scope.correctColor(zones[i].color),
						    weight: 3
						},
						data: zones[i],
						info_windows_cod: "z" + zones[i].id,
						info_windows_pos: $scope.correctPointGoogle(poligons.points[1]),
						editable: true,
						draggable: true,
						geodesic: false,
						visible: visible,
						fill: {
						    color: $scope.correctColor(zones[i].color),
						    opacity: 0.7
						}
					};
					tmpZones.push(zone);
				}
			}
		}
		return tmpZones;
	};*/
	
	$scope.getLocalPmByCode = function(code){
		var find = false;
		var myPms = sharedDataService.getSharedLocalPms();
		for(var i = 0; i < myPms.length && !find; i++){
			var pmCodeString = String(myPms[i].code);
			if(pmCodeString.localeCompare(code) == 0){
				find = true;
				return myPms[i];
			}
		}
	};
	
	$scope.getLocalPmById = function(objId){
		var find = false;
		var myPms = sharedDataService.getSharedLocalPms();
		for(var i = 0; i < myPms.length && !find; i++){
			var pmIdString = String(myPms[i].id);
			if(pmIdString.localeCompare(objId) == 0){
				find = true;
				return myPms[i];
			}
		}
		return null;
	};
	
	$scope.initAreasObjects = function(areas){
		var myAreas = [];
		for(var i = 0; i < areas.length; i++){
			var zones0 = [];
			var zones1 = [];
			var zones2 = [];
			var zones3 = [];
			var zones4 = [];
			// zone init
			if(areas[i].zones){
				for(var j = 0; j < areas[i].zones.length; j++){
					var z0 = $scope.getLocalZoneById(areas[i].zones[j], 2, 0);
					var z1 = $scope.getLocalZoneById(areas[i].zones[j], 2, 1);
					var z2 = $scope.getLocalZoneById(areas[i].zones[j], 2, 2);
					var z3 = $scope.getLocalZoneById(areas[i].zones[j], 2, 3);
					var z4 = $scope.getLocalZoneById(areas[i].zones[j], 2, 4);
					if(z0 != null){
						zones0.push($scope.addLabelToZoneObject(z0));
					} else if(z1 != null){
						zones1.push($scope.addLabelToZoneObject(z1));
					} else if(z2 != null){
						zones2.push($scope.addLabelToZoneObject(z2));
					} else if(z3 != null){
						zones3.push($scope.addLabelToZoneObject(z3));
					} else if(z4 != null){
						zones4.push($scope.addLabelToZoneObject(z4));
					}
				}
			}
			var myarea = areas[i];
			myarea.myZones0 = zones0;
			myarea.myZones1 = zones1;
			myarea.myZones2 = zones2;
			myarea.myZones3 = zones3;
			myarea.myZones4 = zones4;
			myAreas.push(myarea);
		}
		return myAreas;
	};
	
	$scope.initStreetsObjects = function(streets){
		var myStreets = [];
		for(var i = 0; i < streets.length; i++){
			var zones0 = [];
			var zones1 = [];
			var zones2 = [];
			var zones3 = [];
			var zones4 = [];
			// zone init
			for(var j = 0; j < streets[i].zones.length; j++){
				var z0 = $scope.getLocalZoneById(streets[i].zones[j], 2, 0);
				var z1 = $scope.getLocalZoneById(streets[i].zones[j], 2, 1);
				var z2 = $scope.getLocalZoneById(streets[i].zones[j], 2, 2);
				var z3 = $scope.getLocalZoneById(streets[i].zones[j], 2, 3);
				var z4 = $scope.getLocalZoneById(streets[i].zones[j], 2, 4);
				if(z0 != null){
					zones0.push($scope.addLabelToZoneObject(z0));
				} else if(z1 != null){
					zones1.push($scope.addLabelToZoneObject(z1));
				} else if(z2 != null){
					zones2.push($scope.addLabelToZoneObject(z2));
				} else if(z3 != null){
					zones3.push($scope.addLabelToZoneObject(z3));
				} else if(z4 != null){
					zones4.push($scope.addLabelToZoneObject(z4));
				}
			}
			var pms = [];
			if(streets[i].parkingMeters != null){
				for(var x = 0; x < streets[i].parkingMeters.length; x++){
					//var pm = $scope.getLocalPmByCode(streets[i].parkingMeters[x]);
					var pm = $scope.getLocalPmById(streets[i].parkingMeters[x]);
					pms.push(pm);
				}
			}
			var area = null;
			if(sharedDataService.getSharedLocalAreas()){
				area = $scope.getLocalAreaById(streets[i].rateAreaId);
			}
			var mystreet = streets[i];
			if(area){
				mystreet.area_name = area.name;
				mystreet.area_color= area.color;
			}
			mystreet.myZones0 = zones0;
			mystreet.myZones1 = zones1;
			mystreet.myZones2 = zones2;
			mystreet.myZones3 = zones3;
			mystreet.myZones4 = zones4;
			mystreet.myPms = pms;
			myStreets.push(mystreet);
		}
		return myStreets;
	};
	
	$scope.initPMObjects = function(pmeters){
		var myPms = [];
		for(var i = 0; i < pmeters.length; i++){
			var area = $scope.getLocalAreaById(pmeters[i].areaId);
			var myPmeter = pmeters[i];
			var zones0 = [];
			var zones1 = [];
			var zones2 = [];
			var zones3 = [];
			var zones4 = [];
			// zone init
			if(pmeters[i].zones){
				for(var j = 0; j < pmeters[i].zones.length; j++){
					var z0 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 0);
					var z1 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 1);
					var z2 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 2);
					var z3 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 3);
					var z4 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 4);
					if(z0 != null){
						zones0.push($scope.addLabelToZoneObject(z0));
					} else if(z1 != null){
						zones1.push($scope.addLabelToZoneObject(z1));
					} else if(z2 != null){
						zones2.push($scope.addLabelToZoneObject(z2));
					} else if(z3 != null){
						zones3.push($scope.addLabelToZoneObject(z3));
					} else if(z4 != null){
						zones4.push($scope.addLabelToZoneObject(z4));
					}
				}
			}
			myPmeter.myStatus = (pmeters[i].status == 'ACTIVE')?"ON-ACTIVE":"OFF-INACTIVE";
			myPmeter.area_name = area.name,
			myPmeter.area_color= area.color;
			myPmeter.myZones0 = zones0;
			myPmeter.myZones1 = zones1;
			myPmeter.myZones2 = zones2;
			myPmeter.myZones3 = zones3;
			myPmeter.myZones4 = zones4;
			myPms.push(myPmeter);
		}
		return myPms;
	};	
	
	$scope.getLocalAreaById = function(id){
		var find = false;
		var myAreas = sharedDataService.getSharedLocalAreas();
		for(var i = 0; i < myAreas.length && !find; i++){
			if(myAreas[i].id == id){
				find = true;
				return myAreas[i];
			}
		}
	};
	
	$scope.getLocalZoneById = function(id, type, zindex){
		var find = false;
		var corrZone = null;
		var myZones = $scope.getSharedLocalZones(zindex);
		if(myZones){
			for(var i = 0; i < myZones.length && !find; i++){
				if(myZones[i].id == id){
					find = true;
					if(type == 1){
						corrZone = myZones[i];
					} else {
						var sub = (myZones[i].submacro) ? myZones[i].submacro : ((myZones[i].submicro) ? myZones[i].submicro : null);
						var lbl = (sub) ? (myZones[i].name + "_" + sub) : myZones[i].name;
						corrZone = {
							id: myZones[i].id,
							id_app: myZones[i].id_app,
							color: myZones[i].color,
							name: myZones[i].name,
							submacro: myZones[i].submacro,
							submicro: myZones[i].submicro,
							type: myZones[i].type,
							note: myZones[i].note,
							geometry: $scope.correctMyGeometryPolygon(myZones[i].geometry),
							label: lbl
						};
					}			
				}
			}
		}
		return corrZone;
	};
	
	$scope.setSharedLocalZones = function(zones, zindex){
		switch(zindex){
			case 0:
				sharedDataService.setSharedLocalZones0(zones);
				break;
			case 1: 
				sharedDataService.setSharedLocalZones1(zones);
				break;
			case 2: 
				sharedDataService.setSharedLocalZones2(zones);
				break;
			case 3: 
				sharedDataService.setSharedLocalZones3(zones);
				break;
			case 4: 
				sharedDataService.setSharedLocalZones4(zones);
				break;
			default: break;
		}
	};
	
	$scope.getSharedLocalZones = function(zindex){
		var zones = null;
		switch(zindex){
			case 0:
				zones = sharedDataService.getSharedLocalZones0();
				break;
			case 1: 
				zones = sharedDataService.getSharedLocalZones1();
				break;
			case 2: 
				zones = sharedDataService.getSharedLocalZones2();
				break;
			case 3: 
				zones = sharedDataService.getSharedLocalZones3();
				break;
			case 4: 
				zones = sharedDataService.getSharedLocalZones4();
				break;
			default: break;
		}
		return zones;
	};
	
	$scope.filterAllData = function(zone, indx){
		$scope.widget_url_params_and_filters = $scope.updateWidgetUrlFilters(zone, indx);
		var zones = [];
		switch(indx){
			case 0: 
				if(zone != ""){
					$scope.zoneFilter0 = zone;
				} else {
					$scope.zoneFilter0 = null;
				}
				break;
			case 1: 
				if(zone != ""){
					$scope.zoneFilter1 = zone;
				} else {
					$scope.zoneFilter1 = null;
				}
				break;
			case 2: 
				if(zone != ""){
					$scope.zoneFilter2 = zone;
				} else {
					$scope.zoneFilter2 = null;
				}
				break;
			case 3: 
				if(zone != ""){
					$scope.zoneFilter3 = zone;
				} else {
					$scope.zoneFilter3 = null;
				}
				break;
			case 4: 
				if(zone != ""){
					$scope.zoneFilter4 = zone;
				} else {
					$scope.zoneFilter4 = null;
				}
				break;
		}
		for(var i = 0; i < 5; i++){
			switch(i){
				case 0 : 
					if($scope.zoneFilter0){
						zones.push($scope.zoneFilter0)
					}
					break;
				case 1 : 
					if($scope.zoneFilter1){
						zones.push($scope.zoneFilter1)
					}
					break;
				case 2 : 
					if($scope.zoneFilter2){
						zones.push($scope.zoneFilter2)
					}
					break;
				case 3 : 
					if($scope.zoneFilter3){
						zones.push($scope.zoneFilter3)
					}
					break;
				case 4 : 
					if($scope.zoneFilter4){
						zones.push($scope.zoneFilter4)
					}
					break;
			}
		}
		$scope.initWs(zones);
	};
	
	$scope.getFiltersFromParamRequest = function(){
		var filterFromPR = false;
		var zIndexs = initializeService.getZFilterIndexes();
		var zVals = initializeService.getZValues();
		if(zIndexs && zIndexs.length > 0){
			for(var i = 0; i < zIndexs.length; i++){
				var type = $scope.getCorrectZoneTypeFromId(Number(zIndexs[i]) + 2);
				var vals = [];
				if(zVals[i].indexOf(",") > -1){
					vals = zVals[i].split(",");
				} else {
					vals.push(zVals[i]);
				}
				$scope.findZoneByName(type, vals);
			}
			return true;
		} else {
			return false;
		}
	};
	
	$scope.initWs = function(fzones){
		//$scope.initComponents();
	   	$scope.initPage();
		if(!$scope.getFiltersFromParamRequest()){
			var zones_id = [];
			var zones_centers = [];
			if(fzones){
				for(var i = 0; i < fzones.length; i++){
					zones_id.push(fzones[i].id);
					zones_centers.push(fzones[i].centermap);
				}
			}
			if(zones_id.length == 0)zones_id = null;
			$scope.hideAllMapElements();
			var streetCall = $scope.getStreetsFromDb(true, zones_id);
			streetCall.then(function(resutl){
				$scope.checkAndInitSharedZones(zones_id);
			});
			// call a function for shared zones
			$scope.parkingMetersMarkers = [];
			$scope.parkingStructureMarkers = [];
		   	$scope.initMapOption(zones_centers);
			$scope.mapReady = false;
		}
	};
	
	$scope.checkAndInitSharedZones = function(fzones){
		var zonePageDataList = initializeService.getZonePagesDataList()
		var lastIndex = zonePageDataList.length - 1;
		for(var i = 0; i < zonePageDataList.length; i++){
			var ztabid = i + 2;
			var type = $scope.getCorrectZoneTypeFromId(ztabid);
	    	$scope.getZonesFromDb(type, i, lastIndex, fzones);
		}
	};
	
	$scope.callMyDbFunctionStack = function(fzones){
		var areaOk = $scope.getAreasFromDb(fzones);
		areaOk.then(function(result){
			return $scope.getParkingMetersFromDb(fzones);
		}).then(function(result){
			return $scope.getParkingStructuresFromDb(fzones);
		}).then(function(result){
			return $scope.getBikePointFromDb(fzones);
		}).then(function(resutl){
			if(firstStreetCall){
	    		$scope.getStreetsFromDb(false, fzones);
	    	}
	    	$scope.initFilters();
		});
	};
	
	$scope.getAreasFromDb = function(fzones){
		$scope.areaMapReady = false;
		var allAreas = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/area", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, allAreas);  
			$scope.areaWS = $scope.filterAreas(allAreas, fzones);
			if($scope.isAreaVisible()){
			    $scope.initAreasOnMap($scope.areaWS, $scope.checkArea);
			}  
			sharedDataService.setSharedLocalAreas(allAreas);
		});
		return myDataPromise;
	};
	
	$scope.getStreetsFromDb = function(first, fzones){
		$scope.streetMapReady = false;
		var allStreet = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/street", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    //angular.copy(result, allStreet); 
			allStreet = $scope.filterStreets(result, fzones);
		    $scope.streetWS = $scope.initStreetsObjects(allStreet);
		    if(!first){
		    	firstStreetCall = false;
		    	if($scope.isStreetVisible()){
		    		$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, $scope.checkStreets);
		    	}
		    } else {
		    	firstStreetCall = true;
		    }
		});
		return myDataPromise;
	};
		    
    $scope.getParkingMetersFromDb = function(fzones){
	    var markers = [];
		var allParkingMeters = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/parkingmeter", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, allParkingMeters);
			var filteredParkingMeters = $scope.filterPms(allParkingMeters, fzones);
		    if($scope.isPmVisible()){
		    	for (var i = 0; i < filteredParkingMeters.length; i++) {
		    		markers.push(createMarkers(i, filteredParkingMeters[i], 1));
		    	}
		    	angular.copy(markers, $scope.parkingMetersMarkers);
		    	if($scope.checkPm){
		    		$scope.pmInitialMarkers = markers;
		    	} else {
		    		$scope.pmInitialMarkers = [];
		    	}
		    }
		    sharedDataService.setSharedLocalPms(allParkingMeters);
		    //$scope.getParkingStructuresFromDb(fzones);
		});
		return myDataPromise;
	};
	
	$scope.getParkingStructuresFromDb = function(fzones){
		var markers = [];
		var allParkingStructures = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/parkingstructure", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    allParkingStructures = $scope.filterPss(result, fzones);
		    if($scope.isPsVisible()){
		    	for (var i = 0; i <  allParkingStructures.length; i++) {
			    	markers.push(createMarkers(i, allParkingStructures[i], 2));
			    }
		    	angular.copy(markers, $scope.parkingStructureMarkers);
		    	if($scope.checkPs){
		    		$scope.psInitialMarkers = markers;
		    	} else {
		    		$scope.psInitialMarkers = [];
		    	}
		    }
		   	//$scope.getBikePointFromDb(fzones);
		});
		return myDataPromise;
	};
	
	$scope.getBikePointFromDb = function(fzones){		
		var markers = [];
		var allBikePoints = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/bikepoint", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	//angular.copy(result, allBikePoints);
	    	allBikePoints = $scope.filterBps(result, fzones);
	    	if($scope.isBpVisible()){
	    		for (var i = 0; i <  allBikePoints.length; i++) {
		    		markers.push(createMarkers(i, allBikePoints[i], 3));
			    }
	    		angular.copy(markers, $scope.bikePointMarkers);
	    		if($scope.checkBp){
	    			$scope.bpInitialMarkers = markers;
	    		} else {
	    			$scope.bpInitialMarkers = [];
	    		}
	    	}
	    	$scope.initMap($scope.pmInitialMarkers, $scope.psInitialMarkers, $scope.bpInitialMarkers);
	    	//if(firstStreetCall){
	    	//	$scope.getStreetsFromDb(false, fzones);
	    	//}
	    	//$scope.initFilters();
		});
	    return myDataPromise;
	};
	
	$scope.initFilters = function(){
		$scope.fZones0 = sharedDataService.getSharedLocalZones0();
		$scope.fZones1 = sharedDataService.getSharedLocalZones1();
		$scope.fZones2 = sharedDataService.getSharedLocalZones2();
		$scope.fZones3 = sharedDataService.getSharedLocalZones3();
		$scope.fZones4 = sharedDataService.getSharedLocalZones4();
	};
	
	$scope.hideAllMapElements = function(){
		$scope.hideAreaPolygons();
		$scope.hideBikePointsMarkers();
		$scope.hideParkingStructuresMarkers();
		$scope.hideParkingMetersMarkers();
		$scope.hideStreetPolylines();
		for(var i = 0; i < 5; i++){
			$scope.hideZonePolygons(i);
		}
	};
	
	$scope.getCorrectZoneTypeFromId = function(id){
		var type = null;
		var zonePageDataList = initializeService.getZonePagesDataList();
    	var found = false
    	for(var i = 0; i < zonePageDataList.length && !found; i++){
			if(zonePageDataList[i].id == id){
				type = zonePageDataList[i].type;
				found = true;
			}
		}
    	return type;
	};
	
	$scope.findZoneByName = function(z_type, names){
		var idAndCenter = [];
		var ids = [];
		var centers = [];
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/zone/" + z_type, null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allZones);
	    	for(var j = 0; j < names.length; j++){
	    		var found = false;
	    		for(var i = 0; i < allZones.length && !found; i++){
		    		if(allZones[i].name == names[j]){
		    			ids.push(allZones[i].id);
		    			centers.push(allZones[i].centermap);
		    			found = true;
		    		}
	    		}
	    	}
	    	// continue with page inithialization
	    	var zones_id = ids;
			var zones_centers = centers;
			if(zones_id.length == 0)zones_id = null;
			$scope.hideAllMapElements();
			var streetCall = $scope.getStreetsFromDb(true, zones_id);
			streetCall.then(function(resutl){
				$scope.checkAndInitSharedZones(zones_id);
			});
			// call a function for shared zones
			$scope.parkingMetersMarkers = [];
			$scope.parkingStructureMarkers = [];
		   	$scope.initMapOption(zones_centers);
			$scope.mapReady = false;
	    });
	};
	
	$scope.getZonesFromDb = function(z_type, tindex, lastindex, fzones){
		$scope.zoneMapReady = false;
		$scope.zoneWS = [];	// clear zones;
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/zone/" + z_type, null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allZones);
	    	switch(tindex){
		    	case 0:
		    		$scope.zoneWS0 = $scope.correctMyZones(allZones);
				    $scope.initZonesOnMap($scope.zoneWS0, tindex, $scope.checkZones0);
				    var sharedzones = $scope.getSharedLocalZones(tindex);
				    if(sharedzones == null || sharedzones.length == 0){
				    	$scope.setSharedLocalZones($scope.zoneWS0, tindex);
				    }
		    		break;
		    	case 1:
		    		$scope.zoneWS1 = $scope.correctMyZones(allZones);
				    $scope.initZonesOnMap($scope.zoneWS1, tindex, $scope.checkZones1);
				    var sharedzones = $scope.getSharedLocalZones(tindex);
				    if(sharedzones == null || sharedzones.length == 0){
				    	$scope.setSharedLocalZones($scope.zoneWS1, tindex);
				    }
		    		break;
		    	case 2:
		    		$scope.zoneWS2 = $scope.correctMyZones(allZones);
				    $scope.initZonesOnMap($scope.zoneWS2, tindex, $scope.checkZones2);
				    var sharedzones = $scope.getSharedLocalZones(tindex);
				    if(sharedzones == null || sharedzones.length == 0){
				    	$scope.setSharedLocalZones($scope.zoneWS2, tindex);
				    }
		    		break;
		    	case 3:
		    		$scope.zoneWS3 = $scope.correctMyZones(allZones);
				    $scope.initZonesOnMap($scope.zoneWS3, tindex, $scope.checkZones3);
				    if(sharedzones == null || sharedzones.length == 0){
				    	$scope.setSharedLocalZones($scope.zoneWS3, tindex);
				    }
		    		break;
		    	case 4:
		    		$scope.zoneWS4 = $scope.correctMyZones(allZones);
				    $scope.initZonesOnMap($scope.zoneWS4, tindex, $scope.checkZones4);
				    if(sharedzones == null || sharedzones.length == 0){
				    	$scope.setSharedLocalZones($scope.zoneWS4, tindex);
				    }
		    		break;
		    	default:break;
	    	}
	    	if(tindex == lastindex){
	    		$scope.callMyDbFunctionStack(fzones);
	    		//$scope.getAreasFromDb(fzones);
	    	}
	    	$scope.zoneMapReady = true;
	    });
	};
	
	$scope.loadStreetsFromZone = function(z_id){
		var z_streets = [];
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			for(var i = 0; i < $scope.streetWS.length; i++){
				var found = false;
				for(var j = 0; (j < $scope.streetWS[i].zones.length) && !found; j++){
					if($scope.streetWS[i].zones[j] == z_id){
						found = true;
						z_streets.push($scope.streetWS[i]);
					}
				}
			}
		}
		return z_streets;
	};
	
	$scope.filterStreets = function(streets, zones){
		var filteredStreets = [];
		if(zones && zones.length > 0){
			for(var i = 0; i < streets.length; i++){
				if(streets[i].zones){
					var found = false;
					for(var j = 0; (j < streets[i].zones.length) && !found; j++){
						for(var z = 0; z < zones.length; z++){
							if(streets[i].zones[j] == zones[z]){
								found = true;
								filteredStreets.push(streets[i]);
							}
						}
					}
				}
			}
		} else {
			filteredStreets = streets;
		}
		return filteredStreets;
	};
	
	$scope.filterAreas = function(areas, zones){
		var filteredAreas = [];
		if(zones && zones.length > 0){
			for(var i = 0; i < areas.length; i++){
				if(areas[i].zones){
					var found = false;
					for(var j = 0; (j < areas[i].zones.length) && !found; j++){
						for(var z = 0; z < zones.length; z++){
							if(areas[i].zones[j] == zones[z]){
								found = true;
								filteredAreas.push(areas[i]);
							}
						}
					}
				}
			}
		} else {
			filteredAreas = areas;
		}
		return filteredAreas;
	};
	
	$scope.filterPms = function(pms, zones){
		var filteredPms = [];
		if(zones && zones.length > 0){
			for(var i = 0; i < pms.length; i++){
				if(pms[i].zones){
					var found = false;
					for(var j = 0; (j < pms[i].zones.length) && !found; j++){
						for(var z = 0; z < zones.length; z++){
							if(pms[i].zones[j] == zones[z]){
								found = true;
								filteredPms.push(pms[i]);
							}
						}
					}
				}
			}
		} else {
			filteredPms = pms
		}
		return filteredPms;
	};
	
	$scope.filterPss = function(pss, zones){
		var filteredPss = [];
		if(zones && zones.length > 0){
			for(var i = 0; i < pss.length; i++){
				if(pss[i].zones){
					var found = false;
					for(var j = 0; (j < pss[i].zones.length) && !found; j++){
						for(var z = 0; z < zones.length; z++){
							if(pss[i].zones[j] == zones[z]){
								found = true;
								filteredPss.push(pss[i]);
							}
						}
					}
				}
			}
		} else {
			filteredPss = pss
		}
		return filteredPss;
	};
	
	$scope.filterBps = function(bps, zones){
		var filteredBps = [];
		if(zones && zones.length > 0){
			for(var i = 0; i < bps.length; i++){
				if(bps[i].zones){
					var found = false;
					for(var j = 0; (j < bps[i].zones.length) && !found; j++){
						for(var z = 0; z < zones.length; z++){
							if(bps[i].zones[j] == zones[z]){
								found = true;
								filteredBps.push(bps[i]);
							}
						}
					}
				}
			}
		} else {
			filteredBps = bps
		}
		return filteredBps;
	};
	
	
}]);