'use strict';

/* Controllers */
var cgControllers = angular.module('cgControllers');

cg.controller('MainCtrl',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', '$locale', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeWSServiceProxy','$timeout',
    function($scope, $http, $route, $routeParams, $rootScope, localize, $locale, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, $timeout) {

    $scope.$route = $route;
    $scope.$routeParams = $routeParams;
    $scope.app ;
    $scope.user_token = token;
    $scope.user_name = conf_username;
    
    sharedDataService.setToken($scope.user_token);
    sharedDataService.setName($scope.user_name);
    if(conf_api != null && conf_api != ""){
    	sharedDataService.setApiUrl(conf_api);
    }
    
    $scope.myGame;
                  			
    // new elements for view
    $scope.currentView;
    $scope.editMode;
    $scope.currentViewDetails;
                  			
    // max practices displayed in home list
    $scope.maxPractices = 10;
    $scope.practicesWSM = [];

    // for language icons
    var itaLanguage = "active";
    var engLanguage = "";
    
	// for localization
    $scope.setEnglishLanguage = function(){
    	$scope.used_lang = "i18n/angular-locale_en-EN.js";
    	itaLanguage = "";
    	engLanguage = "active";
    	localize.setLanguage('en-US');
    	//ngTranslation.use('en');
    	sharedDataService.setUsedLanguage('eng');
    	//$route.reload();
    };
    
    $scope.setItalianLanguage = function(){
    	$scope.used_lang = "i18n/angular-locale_it-IT.js";
    	itaLanguage = "active";
    	engLanguage = "";
    	localize.setLanguage('it-IT');
    	//ngTranslation.use('it');
    	sharedDataService.setUsedLanguage('ita');
    	//$route.reload();
    };
    
    if(sharedDataService.getUsedLanguage() == 'ita'){
    	// here I force ita for the first app access
    	$scope.setItalianLanguage();
    }
    
    $scope.setUserLocale = function(lan){
    	var lan_uri = '';
    	if(lan == "it-IT"){
    		lan_uri = 'i18n/angular-locale_it-IT.js';
    	} else if (lan == "en-US"){
    		lan_uri = 'i18n/angular-locale_en-EN.js';
    	}
    	$http.get(lan_uri)
    		.success(function(results){
    			console.log("Success get locale " + results);
    			$locale = results;
    			$locale.id;
    		})
    		.error(function(results) {
        	console.log("Error get locale " + results);
        });
    };
    
    $scope.isActiveItaLang = function(){
        return itaLanguage;
    };
                  			
    $scope.isActiveEngLang = function(){
    	return engLanguage;
    };
    
    // for services selection
    var homeShowed = true;
    // for menu manageing
    var home = "";
    var mappage = "";
                			
    $scope.isHomeActive = function(){
    	return home;
    };
    
    $scope.setHomeActive = function(){
    	home = "active";
    	mappage = "";
    };
    
    $scope.isMapActive = function(){
        return (sharedDataService.getSelectedGame()) ? mappage : "disabled";
    };
    
    $scope.isMapLinkDisabled = function(){
    	return !sharedDataService.getSelectedGame();
    };
    
    $scope.setMapPageActive = function(){
    	home = "";
    	mappage = "active";
    };
    
    $scope.logout = function() {
    	// Clear some session variables
    	//sharedDataService.setName(null);
        //sharedDataService.setSurname(null);
        $scope.user_token = null;
        $scope.user_name = null;
    	window.location.href = "logout";
    };
                  		    
    $scope.getToken = function() {
        return sharedDataService.getToken();
    };
                  		    
    $scope.authHeaders = {
         'X-ACCESS-TOKEN': $scope.getToken(),
         'Accept': 'application/json;charset=UTF-8'
    };
    
    sharedDataService.setConfMapCenter(conf_map_center);
    sharedDataService.setConfMapZoom(conf_map_zoom);
    
    $scope.getUserName = function(){
  	  return sharedDataService.getName();
    };
    
    $scope.getUserSurname = function(){
  	  return sharedDataService.getSurname();
    };

    // Method getAllGames: used to retrieve all games list by the specific web service
    $scope.getAllGames = function(){
    	/*http://localhost:8080/game-dashboard/api/game/TEST*/
    	$scope.allGames = [];
    	var method = "GET";
    	var user = sharedDataService.getName();
    	var myDataPromise = invokeWSService.getProxy(method, "/game/" + user, null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		   angular.copy(result, $scope.allGames);
		   for(var i = 0; i < $scope.allGames.length; i++){
			   var sharedGameId = sharedDataService.getGameId();
			   if(sharedGameId != null){
				   if($scope.allGames[i].gameId == sharedGameId){
					   $scope.myGame = $scope.allGames[i];
				   }
			   }
		   }
		});
		return myDataPromise;
    	/*$scope.returnedFromService = [
    	     {
    	         "ownerId": "TEST",
    	         "objectId": "59be0c50-2c1b-4a4e-bf43-a1fbda964b3b",
    	         "creationDate": 1454599874222,
    	         "lastUpdate": 1455180953901,
    	         "schoolId": "schoolId1",
    	         "schoolName": "schooldName1",
    	         "classRooms": null,
    	         "gameId": "56b9b129dd0a82ada7cce4c5",
    	         "gameName": "climb-pedibus-local",
    	         "gameDescription": "gameDescription1",
    	         "gameOwner": "TEST",
    	         "from": 1454593685879,
    	         "to": 1454680085000,
    	         "token": "L2MEq8WPbTAIT134"
    	     },
    	     {
    	        "ownerId": "TEST",
    	        "objectId": "73a3b952-dbab-4ad5-9bb3-1be66109a9bc",
    	        "creationDate": 1454937120576,
    	        "lastUpdate": 1454937120576,
    	        "schoolId": "schoolId2",
    	        "schoolName": "schooldName1",
    	         "classRooms": null,
    	        "gameId": "56b9b129dd0a82ada7cce4c6",
    	        "gameName": "gameName2",
    	        "gameDescription": "gameDescription2",
    	        "gameOwner": "TEST",
    	        "from": 1454593685879,
    	        "to": 1454680085000,
    	        "token": "L2MEq8WPbTAIT134"
    	     }
    	];
    	
    	$scope.allGames = [];
    	for(var i = 0; i < $scope.returnedFromService.length; i++){
    		if($scope.returnedFromService[i].gameOwner == "TEST"){
    			var sharedGameId = sharedDataService.getGameId();
    			if(sharedGameId != null){
    	    		if($scope.returnedFromService[i].gameId == sharedGameId){
    	    			$scope.myGame = $scope.returnedFromService[i];
    	    		}
    	    	}
    			$scope.allGames.push($scope.returnedFromService[i]);
    		}
    	}*/ 	
    };
    
    var schoolName = "";
    
    $scope.setSelectedGame = function(game){
    	if(game != null){
    		$scope.myGame = game;
    		sharedDataService.setGameId(game.gameId);
    		sharedDataService.setSelectedGame(true);
    		sharedDataService.setMyGame($scope.myGame);
    	} else {
    		sharedDataService.setSelectedGame(false);
    	}
    };
    
    $scope.checkGameSelected = function(){
    	if($scope.myGame){
    		return true;
    	} else {
    		return false;
    	}
    };
    
    $scope.returnSchoolName = function(){
    	var gm = sharedDataService.getMyGame();
    	if(gm.schoolName){
    		return gm.schoolName.toUpperCase();
    	}
    };
         			
}]);