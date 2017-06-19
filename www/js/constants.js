angular.module('starter')
.constant('Api01Constant', {
	
	// Proxied path (defined in ionic.config.json)
	// ref: http://blog.ionic.io/handling-cors-issues-in-ionic/
	// Use this only when running 'ionic serve' or 'ionic run -l' for testing
//	baseUrl : '/api-proxy',
    
	// Use this when running 'ionic run' or 'ionic emulate'
	baseUrl : 'http://cors.api.com',
	
	browseListUrl : '/api.json'
	
});