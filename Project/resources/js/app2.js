var app= angular.module('myApp', ['ngRoute']);


app.config(function ($routeProvider) {
    $routeProvider
    
    .when('/', {
        templateUrl: 'resources/js/pages/circle.html',
        controller: 'myCtrl'
    })
    
    .when('/graph', {
        templateUrl: 'resources/js/pages/graph.html',
        controller: 'myCtrl'
    })
    
});