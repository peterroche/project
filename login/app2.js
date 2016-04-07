var app = angular.module('loginApp', ['ui.router']);




app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    
    
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'resources/js/pages/login.html',
            controller: 'loginCtrl'
        })
    
        .state('register', {
            url: '/register',
            templateUrl: 'resources/js/pages/register.html',
            controller: 'registerCtrl'
        })
        .state('home', {

           /* resolve: {
                "check": function($location, $rootScope) {
                    console.info($rootScope.login);
                    if(!$rootScope.login) {
                        $location.path('/login');
                    }
                }
            },*/
        
            url: '/home',
            templateUrl: 'resources/js/pages/loggedin.html',
            controller: 'homeCtrl',
            resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                    if (userInfo) {
                        return $q.when(userInfo);
                    } else {
                        return $q.reject({ authenticated: false });
                    }
                }
            }
        })
    
        .state('home.circle', {   
            url: '/circle',
            templateUrl: 'resources/js/pages/loggedin.circle.html',
            controller: 'homeCtrl'
        })
    
        .state('home.graph', {
            url: '/graph',
            templateUrl: 'resources/js/pages/loggedin.graph.html',
            controller: 'homeCtrl'
        });
    
    $urlRouterProvider.otherwise('/login');
    
}]);

app.run(["$rootScope", "$location", function ($rootScope, $location) {

    $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        console.log(userInfo);
    });

    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/login");
        }
    });
}]);

   
app.controller('loginCtrl', function($scope, $location, $rootScope, $http, $window, authenticationSvc){
    
    
    $scope.userInfo = null;
    $scope.login = function () {
        authenticationSvc.login($scope.username, $scope.password)
            .then(function (result) {
                $scope.userInfo = result;
                $location.path("/home");
            }, function (error) {
                $window.alert("Invalid credentials");
                console.log(error);
            });
    };

    $scope.cancel = function () {
        $scope.username = "";
        $scope.password = "";
    };
    
       
});


app.controller('registerCtrl', function($scope, $http){
    
    $scope.register = function() { 
        $http.post("http://192.168.1.12:3000/registerUser", {username: $scope.username, password: $scope.password}).success(function(data) {
            $scope.regStatus = data;
        });
    }
});


app.controller('homeCtrl', function($scope, $location, authenticationSvc, auth){
    $scope.userInfo = auth;

    $scope.logout = function () {
        authenticationSvc.logout().then(function (result) {
                $scope.userInfo = null;
                $location.path("/login");
        }, function (error) {
                console.log(error);
        });
    };
});



app.factory("authenticationSvc", function($http, $q, $window) {
    var userInfo;

  function login(username, password) {
    var deferred = $q.defer();

    $http.get("http://192.168.1.12:3000/login/" + username + "/" + password).then(function(result) {
        if(result.data.success){
            userInfo = {
                accessToken: result.data.access_token,
                username: result.data.username
            };
        }else{
            userInfo = null;
        }
        $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            deferred.resolve(userInfo);
        }, function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
  }
   
    function logout() {
        var deferred = $q.defer();
        
        $http.post("http://192.168.1.12:3000/logout", {"access_token": userInfo.accessToken}).then(function (result) {
            userInfo = null;
            $window.sessionStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    }
    init();

    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
});


