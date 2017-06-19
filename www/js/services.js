angular.module('starter.services', [])
.factory('epaperService', function($http, $window, Api01Constant) {
	
	var baseUrl = Api01Constant.baseUrl;
	
	var service = {};
	
	var browseListUrl = Api01Constant.browseListUrl;
	service.getBrowseList = function() {  
	     return $http.get(baseUrl + browseListUrl, {cache:false}).then(function(response) {
            return response.data;
        });
    }
	
	return service;
});
