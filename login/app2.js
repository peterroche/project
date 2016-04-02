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
        .state('project', {

            /*resolve: {
                "check": function($location, $rootScope) {
                    console.info($rootScope.login);
                    if(!$rootScope.login) {
                        $location.path('/');
                    }
                }
            },*/
        
            url: '/project',
            templateUrl: 'resources/js/pages/loggedin.html',
            controller: 'loginCtrl'
        })
    
        .state('project.circle', {
            url: '/circle',
            templateUrl: 'resources/js/pages/loggedin.circle.html',
            controller: 'loginCtrl'
        })
    
        .state('project.graph', {
            url: '/graph',
            templateUrl: 'resources/js/pages/loggedin.graph.html',
            controller: 'loginCtrl'
        });
    
    $urlRouterProvider.otherwise('/login');
    
}]);

   
app.controller('loginCtrl', function($scope, $location, $rootScope, $http){
    
        $scope.login = function(){
            $http.get("http://192.168.1.12:3000/login/" + $scope.username + "/" + $scope.password).success(function(data) {
                $scope.loginAuth = data;
            });  
        };
        
        /*if($scope.username === 'peter') {
            
            $rootScope.currentUser = $scope.username;
            
            $rootScope.login = true;
            $location.path('/project');
        }
        else{
            alert('Incorrect Username/Password');
        }*/
});


app.controller('registerCtrl', function($scope, $http){
    
    $scope.register = function() { 
        $http.post("http://192.168.1.12:3000/registerUser", {username: $scope.username, password: $scope.password}).success(function(data) {
            $scope.regStatus = data;
        });
    }
});


