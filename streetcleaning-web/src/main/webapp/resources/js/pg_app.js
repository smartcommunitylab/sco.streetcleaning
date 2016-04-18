'use strict';

/* App Module */

var cg = angular.module('cg', [
	'ngLocale',
	'ngRoute',
	'ngSanitize',
	'colorpicker.module',
	'ngMap',
	
	'cgServices',
	'cgControllers',
	'cgFilters',
	'cgDirectives',
	
	'ngCookies',
	'dialogs',
	'ui.bootstrap',
	'localization'
]);

cg.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
  	$routeProvider
    	.when('/pedibus-game', {
    		templateUrl: 'html/pedibus-game/home.html',
    		controller: 'MainCtrl',
    		controllerAs: 'main'
    	})
    	.when('/pedibus-game/home', {
    		templateUrl: 'html/pedibus-game/home.html',
    		controller: 'MainCtrl',
    		controllerAs: 'main'
    	})
    	.when('/pedibus-game/map', {
    		templateUrl: 'html/pedibus-game/game_map.html',
    		controller: 'ViewCtrlGmap',
    		controllerAs: 'view_ctrl_gmap'
    	})
    	.otherwise({
    		redirectTo:'/pedibus-game'
    	});
  			
  	$locationProvider.html5Mode({
  		enabled: true,
  		requiredBase: false
  	});
}]);
cg.config(['$provide', function($provide) {
    $provide.decorator('$browser', ['$delegate', function($delegate) {
        var originalUrl = $delegate.url;
        $delegate.url = function() {
            var result = originalUrl.apply(this, arguments);
            if (result && result.replace) {
                result = result.replace(/%23/g, '#');
            }
            return result;
        };
        return $delegate;
    }]);
}]);
cg.config(['$compileProvider',
    function( $compileProvider )
    {  
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|file):/);
    }
]);
cg.run(function($rootScope, $templateCache) {
	$rootScope.$on('$viewContentLoaded', function() {
		$templateCache.removeAll();
	});
});
//cg.config(['ngTranslationProvider', function(ngTranslationProvider) {
//    ngTranslationProvider
//    .setDirectory('/game-dashboard/i18n')
//    .langsFiles({
//      en: 'resources_en.json',
//      it: 'resources_it.json'
//    })
//    .fallbackLanguage('it')
//}]).run(['ngTranslation', '$location'], function(ngTranslation, $location) {
//  ngTranslation.use(
//     $location.search().lang
//  );
//});