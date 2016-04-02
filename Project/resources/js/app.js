/**
 * Created by 10378711 on 05/03/2016.
 */

var app= angular.module('myApp', ['ui.router']);


app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('circle', {
            url: '/',
            templateUrl: 'resources/js/pages/circle.html',
            controller: 'myCtrl'
        })
        .state('graph', {
            url: '/graph',
            templateUrl: 'resources/js/pages/graph.html',
            controller: 'myCtrl'
        })
}]);