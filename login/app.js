var app = angular.module('loginApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    
    
    $routeProvider
        .when('/', {
            templateUrl: 'resources/js/pages/login.html',
            controller: 'loginCtrl'
        })
        .when('/loggedin', {
            
            resolve: {
                "check": function($location, $rootScope) {
                    console.info($rootScope.login);
                    if(!$rootScope.login) {
                        $location.path('/');
                    }
                }
            },
        
            templateUrl: 'resources/js/pages/loggedin.html',
            controller: 'loginCtrl'
        })
}]);

   
app.controller('loginCtrl', function($scope, $location, $rootScope){
    $rootScope.login = false;
    
    $scope.submit = function() {
        if($scope.username === 'peter') {
            $rootScope.login = true;
            $location.path('/loggedin');
        }
        else{
            alert('Incorrect Username/Password');
        }
    }
    
});