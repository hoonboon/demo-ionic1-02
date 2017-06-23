angular.module('starter')
.constant('Api01Constants', {
	
	/* 
	 * Handling CORS issues for 'ionic serve'
	 * 
	 * Ref: http://blog.ionic.io/handling-cors-issues-in-ionic/
	 * Proxied path is defined in ionic.config.json
	 * 
	 * Options:
	 * - true: when need to test run using 'ionic serve' or 'ionic run -l'
	 * - false: when test run using 'ionic run' or 'ionic emulate' or during UAT or Production
	 */ 
	useProxy : true,
	
	// Used only when running 'ionic serve' or 'ionic run -l' for testing
	// Note: this is a relative path
	baseUrlProxied : '/myapi-proxy',
    
	// Used when running 'ionic run' or 'ionic emulate' or during UAT or Production
	baseUrl : 'http://cors.api.com',
	
	browseListUrl : '/itemList.json',
	
	sessionTokenUrl : '/session/token',
	
	loginUrl : '/user/login',
	
	logoutUrl : '/user/logout'
	
});