angular.module('starter.services', [])
.factory('myService', function($http, $window, Api01Constant) {
	
	var baseUrl = Api01Constant.baseUrl;
	
	var service = {};
	
	var browseListUrl = Api01Constant.browseListUrl;
	service.getBrowseList = function() {  
	    return $http.get(baseUrl + browseListUrl, {cache:false}).then(function(response) {
            return response.data;
        });
    };
	
	service.login = function(username, password) {
		// get session token
		var getSessionToken = function() {
			var sessionTokenUrl = Api01Constant.sessionTokenUrl;
			
			return $http.get(baseUrl + sessionTokenUrl, {cache:false});
		};
		
		var postLogin = function(username, password, sessionToken) {
			var loginUrl = Api01Constant.loginUrl;
			
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
			var logoutUrl = Api01Constant.logoutUrl;
			
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
