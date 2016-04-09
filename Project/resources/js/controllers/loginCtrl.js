app.controller('loginCtrl', function($scope, $location, $rootScope, $http, $window, authService, registerService){
    
    $scope.userDetails = null;
    $scope.login = function () {
        authService.login($scope.username, $scope.password).then(function (result) {
            $scope.userDetails = result;
            if(!result){
                $scope.loginFailed = true;
                $scope.reset();
            }
            $location.path("/home");
        }, function (error) {
                console.log(error);
        });
    };

    $scope.reset = function () {
        $scope.username = "";
        $scope.password = "";
    };
    
    
    if(registerService.getRegStatus()){
        $scope.regMessage = 'Successfully Register';
        registerService.setRegStatus(false);
    } else {
        $scope.regMessage = '';
    }
       
});