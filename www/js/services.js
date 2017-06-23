angular.module('starter.services', [])

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
