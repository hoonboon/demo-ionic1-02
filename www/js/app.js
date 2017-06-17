// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope, $ionicHistory) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            alert('State change from: ' + fromState.name + ' to: ' + toState.name);
            
            var history = $ionicHistory.viewHistory();
	        
	        var viewStr = '';
	        angular.forEach(history.views, function(view, index){
	            viewStr += view.stateName + ',';
	        });
	        alert('views: [' + viewStr + ']');
	        
	        var historyStr = '';
	        angular.forEach(history.histories[$ionicHistory.currentHistoryId()].stack, function(view, index){
	             historyStr += view.stateName + ',';
	        });
	        alert('history stack: [' + historyStr + ']');
            
            //$timeout(function() {
            //    console.log('$timeout after 1 sec $ionicHistory.backView().stateName');
            //    console.log($ionicHistory.backView() === null ? "<null>" : $ionicHistory.backView().stateName);
            //}, 1000);
        });
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('app.search', {
		url: '/search',
		views: {
			'menuContent': {
				templateUrl: 'templates/search.html'
			}
		}
	})

	.state('app.browse', {
		url: '/browse',
		views: {
			'menuContent': {
				templateUrl: 'templates/browse.html'
			}
		}
	})

	.state('app.playlists', {
		url: '/playlists',
		views: {
			'menuContent': {
				templateUrl: 'templates/playlists.html',
				controller: 'PlaylistsCtrl'
			}
		}
	})

	.state('app.single', {
		url: '/playlists/:playlistId',
		views: {
			'menuContent': {
				templateUrl: 'templates/playlist.html',
				controller: 'PlaylistCtrl'
			}
		}
	});
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/playlists');
});


// http://blog.ionic.io/angularjs-authentication/
//angular.module('starter')
//.config(function($httpProvider) {
//	$httpProvider.defaults.withCredentials = true;
//});
//
//angular.module('starter', ['ngCookies'])
//.run(['$http', '$cookies', function($http, $cookies) {
//	$http.defaults.headers.post['X-CSRF-Token'] = $cookies.csrftoken;
//}]);
//
//angular.module('starter')
//.provider('myCSRF',[function(){
//	var headerName = 'X-CSRF-Token';
//	var cookieName = 'csrftoken';
//	var allowedMethods = ['GET'];
//
//	this.setHeaderName = function(n) {
//		headerName = n;
//	}
//	this.setCookieName = function(n) {
//		cookieName = n;
//	}
//	this.setAllowedMethods = function(n) {
//		allowedMethods = n;
//	}
//	this.$get = ['$cookies', function($cookies){
//		return {
//			'request': function(config) {
//				if(allowedMethods.indexOf(config.method) === -1) {
//					// do something on success
//					config.headers[headerName] = $cookies[cookieName];
//				}
//				return config;
//			}
//		}
//	}];
//}])
//
//.config(function($httpProvider) {
//	$httpProvider.interceptors.push('myCSRF');
//});

