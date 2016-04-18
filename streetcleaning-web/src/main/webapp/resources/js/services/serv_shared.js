'use strict';

/* Services */
var cgServices = angular.module('cgServices');
cg.service('sharedDataService', function(){
	
	// This section is shared between all the controllers
	// Shared field description
	this.usedLanguage = 'ita';
	this.name = '';
	this.surname = '';
	this.gameId = '';
	this.myGame = {};
	this.token = '';
	this.api_url = 'api/';
	
	// Shared field app conf
	this.conf_app_id;
	this.conf_url_ws;
	this.conf_map_zoom;
	this.conf_map_center;
	this.conf_map_recenter;
	this.conf_map_bounds;
	this.conf_visible_obj_list = [];
	
	this.conf_show_area;
	this.conf_show_street;
	this.conf_show_pm;
	this.conf_show_ps;
	this.conf_show_bp;
	this.conf_show_zone;
	
	this.ueCitizen = false;
	this.familyAllowances = false;
	this.loading = false;
	this.userIdentity = 'HMTRND69R11Z100M';
	this.base64 = '';
	
	this.allFamilyUpdated = false;
	this.isTest = false;
	this.userId = '';
	
	// Shared time variables
	//-------------------------------------------------------------
	this.three_years_millis = 1000 * 60 * 60 * 24 * 365 * 3;	// I consider an year of 360 days
	this.two_years_millis = 1000 * 60 * 60 * 24 * 365 * 2;
	this.one_year_millis = 1000 * 60 * 60 * 24 * 365; 			// I consider an year of 360 days (12 month of 30 days)
	this.one_year_365_millis = 1000 * 60 * 60 * 24 * 365; 		// I consider an year of 365 days
	this.one_month_millis = 1000 * 60 * 60 * 24 * 30;			// Milliseconds of a month
	this.one_day_millis = 1000 * 60 * 60 * 24 * 2; 				// Milliseconds of a day
	this.six_hours_millis = 1000 * 60 * 60 * 6;					// Milliseconds in six hours
	//-------------------------------------------------------------

	this.isInList = false;
	this.utente = {};
	this.idDomanda = '';
	
    this.static_ambiti = [];
    this.static_comuni = [];
    this.static_edizioni = [];
    this.selectedGame = false;
    this.setSelectedGame = function(value){
    	this.selectedGame = value;
    };
    this.getSelectedGame = function(){
    	return this.selectedGame;
    };
            
    this.genders = [
         'Femminile',
         'Maschile'
    ];
            
    this.yes_no = [
         {code: 'true' , title: 'Si'},
         {code: 'false' , title: 'No'}
    ];    
    
    this.yes_no_val = [
         {value: true , title: 'Si'},
         {value: false , title: 'No'}
    ];
  
    this.flux_view_tabs = [];
    this.showOccStreetLogEdit = false;
    this.showOccStructLogEdit = false;
    this.showProfPMLogEdit = false;
    this.showProfStructLogEdit = false;
    
    // Shared filter fields and methods
    this.filter_topiclist;
    this.filter_space;
    this.filter_vis;
    this.filter_year;
    this.filter_month;
    this.filter_dowType;
    this.filter_dowVal;
    this.filter_hour;
    
	// Get and Set methods
	this.getUsedLanguage = function(){
		var value = sessionStorage.language;
		return this.usedLanguage;
	};
	
	this.setUsedLanguage = function(value){
		sessionStorage.language = value;
		this.usedLanguage = value;
	};
	
	this.getName = function(){
		return this.name;
	};
	
	this.setName = function(value){
		this.name = value;
	};
	
	this.getSurname = function(){
		return this.surname;
	};
	
	this.setSurname = function(value){
		this.surname = value;
	};
	
	this.setGameId = function(value){
		this.gameId = value;
	};
	
	this.getGameId = function(){
		return this.gameId;
	};
	
	this.setMyGame = function(value){
		this.myGame = value;
	};
	
	this.getMyGame = function(){
		return this.myGame;
	};
	
	this.setToken = function(value){
		this.token = value;
	};
	
	this.getToken = function(){
		return this.token;
	};
	
	this.setApiUrl = function(value){
		this.api_url = value;
	};
	
	this.getApiUrl = function(){
		return this.api_url;
	};
	
	this.setIsInList = function(value){
		this.isInList = value;
	};
	
	this.getIsInList = function(){
		return this.isInList;
	};
	
	this.isLoading = function(){
		return this.loading;
	};
	
	this.setLoading = function(value){
		this.loading = value;
	};
	
	this.setUserIdentity = function(value){
		//this.userIdentity = value;
		this.utente.codiceFiscale;
	};
	
	this.setInGlobalLogPage = function(value){
		this.inGlobalLogPage = value;
	};
	
	this.isInGlobalLogPage = function(){
		return this.inGlobalLogPage;
	};
	
	// ----------------- ONLY FOR TESTS-------------
	this.getUserIdentity = function(){
		if(this.utente.codiceFiscale == null || this.utente.codiceFiscale == ""){
			return this.userIdentity;
		}
		else {
			return this.utente.codiceFiscale;
		}
	};
	//---------------------------------------------
	
	
	// Lists getters
	this.getConfAppId = function(){
		return this.conf_app_id;
	};
	
	this.setConfAppId = function(value){
		this.conf_app_id = value;
	};
	
	this.getConfUrlWs = function(){
		return this.conf_url_ws;
	};
	
	this.setConfUrlWs = function(value){
		this.conf_url_ws = value;
	};
	
	this.getConfMapZoom = function(){
		return this.conf_map_zoom;
	};
	
	this.setConfMapZoom = function(value){
		this.conf_map_zoom = value;
	};
	
	this.getConfMapCenter = function(){
		return this.conf_map_center;
	};
	
	this.setConfMapCenter = function(value){
		this.conf_map_center = value;
	};
	
	this.getConfMapBounds = function(){
		return this.conf_map_bounds;
	};
	
	this.setConfMapBounds = function(value){
		this.conf_map_bounds = value;
	};
	
	this.getYesNoVal = function(){
		return this.yes_no_val;
	};
	
	this.getYesNo = function(){
		return this.yes_no;
	};
	
	this.getYesNoVal = function(){
		return this.yes_no_val;
	};
	
	this.getThreeYearsMillis = function(){
		return this.three_years_millis;
	};
	
	this.getTwoYearsMillis = function(){
		return this.two_years_millis;
	};
	
	this.getOneYearMillis = function(){
		return this.one_year_millis;
	};
	
	this.getOneYear365Millis = function(){
		return this.one_year_365_millis;
	};
	
	this.getOneMonthMillis = function(){
		return this.one_month_millis;
	};
	
	this.getOneDayMillis = function(){
		return this.one_day_millis;
	};
	
	this.getSixHoursMillis = function(){
		return this.six_hours_millis;
	};
	
	this.setUserId = function(value){
		this.userId = value;
	};
	
	this.getUserId = function(){
		return this.userId;
	};
});

// Proxy Methods section
cg.factory('invokeWSService', function($http, $q, sharedDataService) {
	//var url = 'https://climbdev.smartcommunitylab.it/game-dashboard/api';
	var getProxy = function(method, funcName, params, headers, data){
		var url = sharedDataService.getApiUrl();
		var deferred = $q.defer();
		if(method == 'GET' && params == null){
			$http({
				method : method,
				url : url + funcName + '?noCache=' + new Date().getTime(),
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params != null){
			$http({
				method : method,
				url : url + funcName,
				params : params + '&noCache=' + new Date().getTime(),
				headers : headers,
				data : data
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else {
			$http({
				method : method,
				url : url + funcName,
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
cg.factory('invokeWSServiceProxy', function($http, $q) {
	var getProxy = function(method, funcName, params, headers, data){
		var deferred = $q.defer();
		//var url = 'http://localhost:8080/service.epu/';
		//var urlWS = url + funcName;
		var urlWS = funcName;
		if(params != null){
			urlWS += '?';
			for(var propertyName in params) {
				urlWS += propertyName + '=' + params[propertyName];
				urlWS += '&';
			};
			urlWS = urlWS.substring(0, urlWS.length - 1); // I remove the last '&'
		}
		//console.log("Proxy Service: url completo " + urlWS);
		
		if(method == 'GET' && params != null){
			$http({
				method : method,
				url : 'rest/allGet',
				params : {
					"urlWS" : urlWS + '&noCache=' + new Date().getTime()	// quela mer.. de ie el cacheava tut e con sta modifica el funzia
				},
				headers : headers
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params == null){
			$http({
				method : method,
				url : 'rest/allGet',
				params : {
					"urlWS" : urlWS + '?noCache=' + new Date().getTime()	// quela mer.. de ie el cacheava tut e con sta modifica el funzia
				},
				headers : headers
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'POST'){
			$http({
				method : method,
				url : 'rest/allPost',
				params : {
					"urlWS" : urlWS
				},
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'PUT'){
			$http({
				method : method,
				url : 'rest/allPut',
				params : {
					"urlWS" : urlWS
				},
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'DELETE'){
			$http({
				method : method,
				url : 'rest/allDelete',
				params : {
					"urlWS" : urlWS	// quela mer.. de ie el cacheava tut e con sta modifica el funzia
				},
				headers : headers
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		}
			
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
