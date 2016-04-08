app.controller('registerCtrl', function($scope, $http, $location, registerService){
    
    $scope.register = function() { 
        registerService.register($scope.username, $scope.password).then(function(result){
            if(result){
                $location.path('/login');
            }
        }, function(error){
            console.error(error);
        })
    }
});