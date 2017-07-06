angular.module('starter.controllers', ['ngCookies'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $ionicPopover, myService, $window, $cookies, Api01Constants) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the login modal
	$scope.loginData = {};
	
	$scope.isAuthenticated = true;
	$scope.currentUser = localStorage.getItem('myApiUsername');
	if ($scope.currentUser == undefined) {
		
		$scope.currentUser = 'Guest';
		$scope.isAuthenticated = false;
		
		if (Api01Constants.useProxy) {
			$cookies.remove(localStorage.getItem('myApiSessionKey'), {path:'/'});
		}
		
	} else {
		
		// verify if session cookies is still available
		// - if gone need to refresh session data based on localStorage values
		// - possible scenario: user closed the app intentionally or restart device
		if (Api01Constants.useProxy) {
			
			// for 'ionic serve', closing the browser tab/window will not remove the localStorage 
			// - new incognito window will start with new localStarage though
			if ($cookies.get(localStorage.getItem('myApiSessionKey')) == undefined) {
				$cookies.put(
						localStorage.getItem('myApiSessionKey'), localStorage.getItem('myApiSessionValue'), 
						{path:'/'});
			} 
			
		} else if (sessionStorage.getItem('toRefreshMyApiSession') == undefined) {
			
			var refreshMyApiSession = function() {
				
				myService.login(
						localStorage.getItem('myApiUsername'), 
						window.atob(localStorage.getItem('myApiPassword'))).then(function(response){
					
					console.log('refreshMyApiSession(): data=' + JSON.stringify(response.data));
					
					// store refreshed data in local storage for subsequent api calls
					localStorage.setItem('myApiSessionToken', response.data.token);
					console.log('sessionToken: ' + response.data.token);
					
					localStorage.setItem('myApiSessionKey', response.data.session_name);
					console.log('sessionKey: ' + response.data.session_name);
					
					localStorage.setItem('myApiSessionValue', response.data.sessid);
					console.log('sessionValue: ' + response.data.sessid);
					
					// store session cookies to be sent over to server for subsequent api calls
					if (Api01Constants.useProxy) {
						$cookies.put(
								response.data.session_name, response.data.sessid, 
								{path:'/'});
					}
					
				}, function(error){
					
					// TODO: error handling
					alert('refreshMyApiSession(): error=' + JSON.stringify(error));
					
				});
				
			};
			
			refreshMyApiSession();
			
			sessionStorage.setItem('toRefreshMyApiSession', 'N');
		}
		
	}

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.showLogin = function() {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
		
		myService.login($scope.loginData.username, $scope.loginData.password).then(function(response){
			
			console.log('AppCtrl.doLogin(): data=' + JSON.stringify(response.data));
			
			// store credentials and returned data in local storage for subsequent api calls
			localStorage.setItem('myApiUsername', $scope.loginData.username);
			console.log('username: ' + $scope.loginData.username);
			
			var passwordEnc = window.btoa($scope.loginData.password);
			localStorage.setItem('myApiPassword', passwordEnc);
			console.log('passwordEnc: ' + passwordEnc);
			
			localStorage.setItem('myApiSessionToken', response.data.token);
			console.log('sessionToken: ' + response.data.token);
			
			localStorage.setItem('myApiSessionKey', response.data.session_name);
			console.log('sessionKey: ' + response.data.session_name);
			
			localStorage.setItem('myApiSessionValue', response.data.sessid);
			console.log('sessionValue: ' + response.data.sessid);
			
			if (Api01Constants.useProxy) {
				// store session cookies to be sent over to server for subsequent api calls
				$cookies.put(response.data.session_name, response.data.sessid, {'path':'/'});
			}
			
			$scope.currentUser = $scope.loginData.username;
			$scope.isAuthenticated = true;
			
			$scope.loginData = {};
			$scope.closeLogin();
			$state.go('app.browse');
			
		}, function(error){
			
			// TODO: error handling
			alert('AppCtrl.doLogin(): error=' + JSON.stringify(error));
			
		});
		
	};
	
	// Perform logout action
	$scope.doLogout = function() {
		
		if (localStorage.getItem('myApiSessionToken') == undefined) {
			console.log('AppCtrl.doLogout: sessionToken unavailable');
		} else {
			
			var postLogoutProcess = function() {
				if (Api01Constants.useProxy) {
					// remove session cookies
					$cookies.remove(localStorage.getItem('myApiSessionKey'));
				}
				
				// remove previously saved data in local storage
				localStorage.removeItem('myApiUsername');
				localStorage.removeItem('myApiPassword');
				localStorage.removeItem('myApiSessionToken');
				localStorage.removeItem('myApiSessionKey');
				localStorage.removeItem('myApiSessionValue');
				
				$scope.currentUser = 'Guest';
				$scope.isAuthenticated = false;
				
				$state.go('app.home');
			};
			
			myService.logout(localStorage.getItem('myApiSessionToken')).then(function(response){

				console.log('AppCtrl.doLogout(): response=' + JSON.stringify(response));
				
				postLogoutProcess();
				
			}, function(error){
				
				// TODO: error handling
				alert('AppCtrl.doLogout(): error=' + JSON.stringify(error));
				
				postLogoutProcess();
				
			});
		}
	};
	
	$scope.goto = function(stateName) {
		$state.go(stateName);
	};
	
	
	/*
	 * pop over a floating view
	 */
	$ionicPopover.fromTemplateUrl('templates/menu.popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});
	
	$scope.showPopover = function($event) {
		$scope.popover.show($event);
	};

})

.controller('PlaylistsCtrl', function($scope, $state, $ionicPopover, $ionicModal, $ionicPopup, $timeout, gaService, playlistService) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		console.log("State Name: ", data.stateName);
		gaService.trackView(data.stateName);
	});
	
	$scope.playlists = playlistService.playlists;
	
	$scope.viewDetail = function(id) {
		$state.go('app.single', {playlistId : id});
	};
	
	$scope.formData = {};
	
	// Create the add form modal that we will use later
	$ionicModal.fromTemplateUrl('templates/playlist_add.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalAdd = modal;
	});

	// Triggered in the modal to close it
	$scope.closeAdd = function() {
		$scope.modalAdd.hide();
	};

	// Open the add modal
	$scope.showAdd = function() {
		$scope.closePopover();
		
		$timeout(function() {
			$scope.modalAdd.show();
		}, 0);
	};
	
	// commit changes
	$scope.doSaveAdd = function() {
		var newPlaylist = {};
		newPlaylist.title = $scope.formData.title;
		newPlaylist.description = $scope.formData.description;
		newPlaylist.lastUpdated = new Date();
		playlistService.create(newPlaylist);
		$scope.formData = {};
		$scope.modalAdd.hide();
	};
	
	// delete item
	$scope.confirmDelete = function(id, title) {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Playlist',
			template: '<h3 align="center">Confirm to delete ' + title + '?<h3>',
			cancelText: 'No',
			cancelType: 'button-balanced',
			okText: 'Yes',
			okType: 'button-assertive'
		});

		confirmPopup.then(function(res) {
			if(res) {
				console.log('Proceed delete id=' + id);
				
				playlistService.deleteById(id);
				
			} else {
				console.log('Cancel delete');
			}
		});
	};
	
	$ionicPopover.fromTemplateUrl('templates/playlists.popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});
	
	$scope.showPopover = function($event) {
		$scope.popover.show($event);
	};

	$scope.closePopover = function() {
		$scope.popover.hide();
	};

	//Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});
	
	$scope.search = {};
	
	$scope.reverse = false;
	
	$scope.toggleSort = function() {
	    if ($scope.reverse)
	        $scope.reverse = false;
	    else
	        $scope.reverse = true;
	}

})

.controller('PlaylistCtrl', function($scope, $stateParams, $ionicPopover, $ionicModal, gaService, playlistService) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		console.log("State Name: ", data.stateName);
		gaService.trackView(data.stateName);
	});
	
	$scope.playlistId = $stateParams.playlistId;
	
	$scope.recordFound = false;
	
	var playlist = playlistService.getById($scope.playlistId);
	
	if (playlist != undefined) {
		$scope.playlist = playlist;
		$scope.recordFound = true;
	} else {
		alert('Record not found for Id: ' + $scope.playlistId);
	}
	
	$scope.formData = {};
	
	// Create the edit form modal that we will use later
	$ionicModal.fromTemplateUrl('templates/playlist_edit.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	// Triggered in the modal to close it
	$scope.closeEdit = function() {
		$scope.modal.hide();
	};

	// Open the edit modal
	$scope.showEdit = function() {
		$scope.formData = angular.copy($scope.playlist);
		$scope.modal.show();
	};
	
	// commit changes
	$scope.doSaveEdit = function() {
		$scope.playlist.title = $scope.formData.title;
		$scope.playlist.description = $scope.formData.description;
		$scope.playlist.lastUpdated = new Date();
		$scope.formData = {};
		$scope.modal.hide();
	};
	
	// reset form data
	$scope.reset = function() {
		$scope.formData = angular.copy($scope.playlist);
	}
	
//	$ionicPopover.fromTemplateUrl('templates/playlists.popover.html', {
//		scope: $scope
//	}).then(function(popover) {
//		$scope.popover = popover;
//	});
//	
//	$scope.showPopover = function($event) {
//		$scope.popover.show($event);
//	};
})

.controller('BrowseCtrl', function($scope, $stateParams, myService, gaService) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		console.log("State Name: ", data.stateName);
		gaService.trackView(data.stateName);
	});
	
	myService.getBrowseList().then(function(list) {
        $scope.browseList = list;
    }, function (error) {
    });
	
})

.controller('SearchCtrl', function($scope, $stateParams, gaService) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		console.log("State Name: ", data.stateName);
		gaService.trackView(data.stateName);
	});
	
});
