angular.module('starter.services', [])

//Mock backend data service
.factory('playlistService', function($filter) {
	
	var service = {};
	
	service.playlists = [
		{ title: 'Reggae', description: 'Description #1', lastUpdated : new Date(), id: 1001 },
		{ title: 'Chill', description: 'Description #2', lastUpdated : new Date(), id: 1002 },
		{ title: 'Dubstep', description: 'Description #3', lastUpdated : new Date(), id: 1003 },
		{ title: 'Indie', description: 'Description #4', lastUpdated : new Date(), id: 1004 },
		{ title: 'Rap', description: 'Description #5', lastUpdated : new Date(), id: 1005 },
		{ title: 'Cowbell', description: 'Description #6', lastUpdated : new Date(), id: 1006 }
		];
	
	// returns only the first record with matching id
	service.getById = function(id) {
		// refer to https://stackoverflow.com/questions/40306927/find-object-by-its-property-in-array-of-objects-with-angular-way
		return $filter('filter')(service.playlists, {'id' : Number.parseInt(id)}, true)[0];
	}
	
	return service;
	
})

//Google Analytics service
.factory('gaService', function(Api01Constants) {
	
	var service = {};
	
	service.trackView = function(viewTitle) {
		if (!Api01Constants.useProxy 
				&& typeof window.ga !== 'undefined') { 
			window.ga.trackView(viewTitle); 
		}
	}
	
	return service;
	
})

// Remote API service
.factory('myService', function($http, $window, Api01Constants) {
	
	var baseUrl = Api01Constants.baseUrl;
	if (Api01Constants.useProxy) {
		baseUrl = Api01Constants.baseUrlProxied;
	}
	
	var service = {};
	
	var browseListUrl = Api01Constants.browseListUrl;
	service.getBrowseList = function() {  
	    return $http.get(baseUrl + browseListUrl, {cache:false}).then(function(response) {
            return response.data;
        });
    };
	
	service.login = function(username, password) {
		// get session token
		var getSessionToken = function() {
			var sessionTokenUrl = Api01Constants.sessionTokenUrl;
			
			return $http.get(baseUrl + sessionTokenUrl, {cache:false});
		};
		
		var postLogin = function(username, password, sessionToken) {
			var loginUrl = Api01Constants.loginUrl;
			
			return $http({
				method : 'post',
				url : baseUrl + loginUrl,
				headers : { 'X-CSRF-Token' : sessionToken },
				data : {'username' : username, 'password' : password}
			});
		};
		
		// submit login request
		return getSessionToken().then(function(response){
			return postLogin(username, password, response.data);
		}, function(error){
			throw error;
		});
	};
	
	service.logout = function(sessionToken) {
		var postLogout = function(sessionToken) {
			var logoutUrl = Api01Constants.logoutUrl;
			
			return $http({
				method : 'post',
				url : baseUrl + logoutUrl,
				headers : { 'X-CSRF-Token' : sessionToken }
			});
		};
		
		// submit login request
		return postLogout(sessionToken);
	};
	
	return service;
});
