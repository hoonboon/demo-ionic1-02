// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'pdf', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $ionicHistory, $cordovaPushV5, $cordovaPreferences) {
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
		
		// Google Analytics
		if (typeof window.ga !== 'undefined') {
			window.ga.startTrackerWithId('UA-101472314-1', 15);
		} else {
			console.log("demo02: Google Analytics Unavailable!");
		}
		
		
//		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
//
//            var msgStr = 'State change from: ' + fromState.name + ' to: ' + toState.name;
//            
//            var history = $ionicHistory.viewHistory();
//	        
//	        var viewStr = '';
//	        angular.forEach(history.views, function(view, index){
//	            viewStr += view.stateName + ',';
//	        });
//	        msgStr += '\n\nviews: [' + viewStr + ']';
//	        
//	        var historyStr = '';
//	        angular.forEach(history.histories[$ionicHistory.currentHistoryId()].stack, function(view, index){
//	             historyStr += view.stateName + ',';
//	        });
//	        msgStr += '\n\nhistory stack: [' + historyStr + ']';
//	        
//	        alert(msgStr);
//            
//            //$timeout(function() {
//            //    console.log('$timeout after 1 sec $ionicHistory.backView().stateName');
//            //    console.log($ionicHistory.backView() === null ? "<null>" : $ionicHistory.backView().stateName);
//            //}, 1000);
//        });
		
		if(window.cordova) {
		    var options = {
		            android: {
		                senderID: "250705741651",
		                "iconColor": "#343434"
		            },
		            ios: {
		                alert: "true",
		                badge: "true",
		                sound: "true"
		            },
		            windows: {}
		    };

		    // initialize
		    $cordovaPushV5.initialize(options).then(function(result) {
		        // start listening for new notifications
		        $cordovaPushV5.onNotification();
		        // start listening for errors
		        $cordovaPushV5.onError();
		        
		        $cordovaPushV5.register().then(function(registrationId) {
		            console.log('Register Push Notification: registrationId=' + registrationId);
		            
    		        var topic = 'general';
    		        $cordovaPushV5.subscribe(topic).then(function() {
                        console.log('subscribed to topic:' + topic);
                        
                    }, function(err){
                        console.error('Subscribe Push Notification Error: ' + err);
                    });
		        });
		        
		        // register to get registrationId
		        //we will only register if there is no existing token keep in preference.
//		        $cordovaPreferences.fetch('token')
//		        .success(function(token) {
//		            console.log("token", token);
//		            if(token == undefined || token === "") {
//		                $cordovaPushV5.register().then(function(registrationId) {
//		                    var currentPlatform = ionic.Platform.platform();
//		                    var deviceId = window.device.uuid;
//		                    
//		                    console.log('Register Push Notification: registrationId=' + registrationId + ', deviceId=' + deviceId + ', platform=' + currentPlatform);
//		                    
//		                    $cordovaPreferences.store('token', registrationId).success(function(value) {
//		                        console.log("token stored successfully", value);
//		                    }).error(function(error) {
//		                        console.log("token stored failed", error);
//		                    });
//		                    
//		                }, function(err){
//		                    console.error('Register Push Notification Error: ' + err);
//		                });
//		            }
//		        })
//		        .error(function(error) {
//		            console.log("fail to fetch token", error);
//		        })

		    });
		    
		    // triggered every time notification received
		    $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data){
		        console.log('Received pushed notification');
		    });
		    
		    // triggered every time error occurs
		    $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e){
                console.log('Error receiving pushed notification');
		    });
		}
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

	.state('app.home', {
		url: '/home',
		views: {
			'menuContent': {
				templateUrl: 'templates/home.html'
			}
		}
	})

	.state('app.search', {
		url: '/search',
		views: {
			'menuContent': {
				templateUrl: 'templates/search.html',
				controller: 'SearchCtrl'
			}
		}
	})

	.state('app.browse', {
		url: '/browse',
		views: {
			'menuContent': {
				templateUrl: 'templates/browse.html',
				controller: 'BrowseCtrl'
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
	$urlRouterProvider.otherwise('/app/home');
});


//angular.module('starter')
//.config(['$httpProvider', function($httpProvider) {
//    $httpProvider.defaults.withCredentials = true;
//}]);


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

