angular.module('starter.services', [])

//Mock backend data service
.factory('playlistService', function($filter) {
	
	var service = {};
	
	var nextId = 1001;
	var playlists = [];
	for (i = 1; i <= 100; i++) {
	    playlists.push({ title: 'Playlist #' + i, description: 'Description #' + i, lastUpdated : new Date(), id: nextId++ });
	}
	
	service.playlists = playlists;
	
	service.nextId = nextId;
	
//	service.playlists = [
//		{ title: 'Reggae', description: 'Description #1', lastUpdated : new Date(), id: 1001 },
//		{ title: 'Chill', description: 'Description #2', lastUpdated : new Date(), id: 1002 },
//		{ title: 'Dubstep', description: 'Description #3', lastUpdated : new Date(), id: 1003 },
//		{ title: 'Indie', description: 'Description #4', lastUpdated : new Date(), id: 1004 },
//		{ title: 'Rap', description: 'Description #5', lastUpdated : new Date(), id: 1005 },
//		{ title: 'Cowbell', description: 'Description #6', lastUpdated : new Date(), id: 1006 }
//		];
//	
//	service.nextId = 1007;
	
	// returns only the first record with matching id
	service.getById = function(id) {
		// refer to https://stackoverflow.com/questions/40306927/find-object-by-its-property-in-array-of-objects-with-angular-way
		return $filter('filter')(service.playlists, {'id' : Number.parseInt(id)}, true)[0];
	};
	
	service.create = function(newPlaylist) {
		newPlaylist.id = service.nextId;
		service.nextId += 1;
		service.playlists.push(newPlaylist);
	};
	
	// remove the first record with matching id
	service.deleteById = function(id) {
		var index = service.playlists.findIndex(function(item) { return item.id == id; });
		if (index >= 0) {
			service.playlists.splice(index, 1);
		} else {
			alert('Item not found for id=' + id);
		}
	};
	
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
	
	var service = {};
	
	// param "targetUrl": "http://.../..." excluding any request params starting with "?" 
	service.constructApiUrl = function(targetUrl) {
        
        // remove original baseUrl if present
        var baseUrlPattern = /^https?:\/\/[^\/:]+/i;
        var strippedTargetUrl = targetUrl.replace(baseUrlPattern, '');
        //console.log('service.constructApiUrl(): targetUrl=' + targetUrl + ', strippedTargetUrl=' + strippedTargetUrl);
        
        var result = '';
        if (Api01Constants.useProxy) {
            // use proxied baseUrl
            result = Api01Constants.baseUrlProxied + strippedTargetUrl;
        } else {
            // use actual baseUrl
            result = Api01Constants.baseUrl + strippedTargetUrl;
        }
        
        //console.log('service.constructApiUrl(): result=' + result);
        
        return result;
    }
	
	var browseListUrl = Api01Constants.browseListUrl;
	service.getBrowseList = function() {  
	    return $http.get(service.constructApiUrl(browseListUrl), {cache:false}).then(function(response) {
            return response.data;
        });
    };
	
	service.login = function(username, password) {
		// get session token
		var getSessionToken = function() {
			var sessionTokenUrl = Api01Constants.sessionTokenUrl;
			
			return $http.get(service.constructApiUrl(sessionTokenUrl), {cache:false});
		};
		
		var postLogin = function(username, password, sessionToken) {
			var loginUrl = Api01Constants.loginUrl;
			
			return $http({
				method : 'post',
				url : service.constructApiUrl(loginUrl),
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
				url : service.constructApiUrl(logoutUrl),
				headers : { 'X-CSRF-Token' : sessionToken }
			});
		};
		
		// submit login request
		return postLogout(sessionToken);
	};
	
	return service;
})

// base worker
.factory("BaseWorker", function($q) {
    
    function BaseWorker(workerFunction) {
        this.workerFunction = workerFunction;
        
        //this.worker;

        if (this.worker) {
            this.worker.terminate();
        }
        
        // convert the workerFunction to string
        var dataObj = '(' + this.workerFunction + ')();'; 
        // firefox adds user strict to any function which was blocking might block worker execution so knock it off
        var blob = new Blob([dataObj.replace('"use strict";', '')]); 

        var blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob, {
            type: 'application/javascript; charset=utf-8'
        });

        this.worker = new Worker(blobURL);
        this.worker.onerror = function(error) {
            console.error('error.message=' + error.message);
        };
    }
    
    BaseWorker.prototype.startWork = function(postData) {
        var defer = $q.defer();

        this.worker.onmessage = function(e) {
            //console.log('Worker said: ', e.data);
            defer.notify(e.data);
        };
        this.worker.postMessage(postData); // Send data to our worker.
        return defer.promise;
    };

    BaseWorker.prototype.stopWork = function() {
        if (this.worker) {
            this.worker.terminate();
        }
    };
    
    return BaseWorker;
})

// web worker #1
.factory("SearchWorker", function(BaseWorker) {
    
    var workerFunction = function () {
        var self = this;
        self.onmessage = function(event) {
            //console.log('Called from main script: ' + event.data[0] + ', ' +  event.data[1]);
            
            var result = event.data[0] * event.data[1];
            
            //console.log('Replying to main script: ' + result);
            postMessage(result);
        }
    }
    
    var service = {};
    
    var workerService = new BaseWorker(workerFunction);
    
    service.startWork = function(postData) {
        return workerService.startWork(postData);
    };
    
    service.stopWork = function() {
        workerService.stopWork();
    };
    
    return service;
})

//web worker #2
.factory("BrowseWorker", function(BaseWorker) {
    
    function workerFunction() {
        var self = this;
        self.onmessage = function(event) {
            //console.log('Called from main script: ' + event.data);
            var dataUrl = event.data;
            
            // web worker runs in a different global context than the main app context
            // hence only standard javascript available out-of-the-box
            // refer to: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    //var response = JSON.parse(xmlhttp.responseText);
                    self.postMessage('Loaded: ' + event.data);
                }
            };
            xmlhttp.open('GET', dataUrl, true);
            xmlhttp.send();

        }
    }
    
    var service = {};
    
    var workerService = new BaseWorker(workerFunction);
    
    service.startWork = function(postData) {
        return workerService.startWork(postData);
    };
    
    service.stopWork = function() {
        workerService.stopWork();
    };
    
    return service;
})

;

