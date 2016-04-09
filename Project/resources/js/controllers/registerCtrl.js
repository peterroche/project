app.controller('registerCtrl', function($scope, $http, $location, registerService){
    
    $scope.register = function() { 
        if($scope.password == null){
            $scope.passwordReq = true;
            $scope.reset();
        } else{
            registerService.register($scope.username, $scope.password).then(function(result){
                if(result){
                    $location.path('/login');
                } else {
                    $scope.usernameTaken = true;
                    $scope.passwordReq = false;
                    $scope.reset();
                }
            }, function(error){
                console.error(error);
            })
        }
    }
    
    
    $scope.reset = function () {
        $scope.username = "";
        $scope.password = "";
    };
});