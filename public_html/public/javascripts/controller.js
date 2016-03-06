/**
 * Created by 10378711 on 05/03/2016.
 */

var app= angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http, $interval){



    $interval(function(){
        $http.get('http://140.203.245.209:3000/live').success(function(data){
            $scope.liveTemp = data;
        });
    }, 1000);


    $interval(function(){
        $http.get('http://140.203.245.209:3000/mongodata').success(function(data){
            $scope.mongoData = data;
        });
    }, 1000);
});



//directive to create circle and change colour and size with temperature
app.directive('tempCircle', function () {

    return {

        restrict: 'E',
        replace: false,

        //store data from radius-data in views
        scope: {data: '=radiusData'},
        link: function (scope) {

            //scale which maps values to colours
            var color = d3.scale.linear()
                .domain([21, 24])
                .range(["blue", "red"]);

            //create an svg canvas
            var canvas = d3.select("body").append("svg")
                .attr("class", "circle")
                .attr("width", 400)
                .attr("height", 400);

            //move group to the middle of the page
            var group = canvas.append("g")
                .attr("transform", "translate(200, 200)");

            scope.$watch('data', function(newVal){
                //remove all text and circles and create news ones each time temp changes
                canvas.selectAll("path").remove();
                canvas.selectAll("text").remove();
                r = (newVal)*5; //to make the circle larger
                var p = Math.PI*2;

                //blueprint for the arc
                var arc = d3.svg.arc()
                    .innerRadius(r - 20)
                    .outerRadius(r)
                    .startAngle(0)
                    .endAngle(p);

                //append temperature text to middle of the circle
                group.append("text")
                    .attr("class", "circleText")
                    .attr("x", -28)
                    .attr("y", 5)
                    // .attr("font-size", 20)
                    .text(scope.data + "°");

                //draw the arc and colour it - newVal is used as r was changed (multiplied by 5)
                group.append("path")
                    .attr("d", arc)
                    .attr("fill", function(){ return color(newVal) });
            });
        }
    };
});



app.directive('tempGraph', function ($parse) {

    return {

        restrict: 'E',

        replace: false,

        link: function (scope, elem, attrs){

            var exp = $parse(attrs.graphData);
            var dataToPlot = exp(scope);

            //create an svg canvas
            var canvas = d3.select("body").append("svg")
                .attr("class", "graph")
                .attr("width", 800)
                .attr("height", 500);

            scope.$watchCollection(exp, function(newVal){

                dataToPlot=newVal;

                canvas.selectAll("path").remove();
                canvas.selectAll("g").remove();

                var xScale = d3.scale.linear()
                    .domain([dataToPlot[0].time, dataToPlot[dataToPlot.length-1].time])
                    .range([20, 700]);

                var yScale = d3.scale.linear()
                    .domain([30, 18])
                    .range([20,350]);

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

                var line = d3.svg.line()
                    .x(function(d){
                        return xScale(d.time);
                    })
                    .y(function(d){
                        return yScale(d.temp);
                    })
                    .interpolate("basis");

                var xLabel = canvas.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(80,373)")
                    .call(xAxis);

                var yLabel = canvas.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(100,20)")
                    .call(yAxis);

                canvas.append("path")
                    .attr("class", "pathClass")
                    .attr("transform", "translate(80,0)")
                    .attr("d", line(dataToPlot))

                xLabel.append("text")
                    .attr("class", "x label")
                    .attr("transform", "translate(325, 50)")
                    .text("Seconds (s)");

                yLabel.append("text")
                    .attr("class", "y label")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -270)
                    .attr("y", -50)
                    .text("Temperature (°)");

            });
        }
    }
});