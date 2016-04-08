app.factory("logoutService", function($http, $q, $window, authService) {
    function logout() {
        var userDetails = authService.getUserDetails();
        var deferred = $q.defer();
        
        $http.post("http://192.168.1.12:3000/logout", {"access_token": userDetails.accessToken}).then(function (result) {
            userDetails = null;
            $window.sessionStorage["userDetails"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });
        
        authService.setUserDetails(null);

        return deferred.promise;
    }
    
    return {
        logout: logout
    }
});