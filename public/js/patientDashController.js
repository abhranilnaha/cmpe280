/**
 * Created by devanshis24 on 11/26/2016.
 */
var patientDashApp = angular.module('patientDashApp', ['ui.router', 'ngStorage']);
patientDashApp.config(function($stateProvider, $urlRouterProvider) {
$urlRouterProvider.otherwise('/');

$stateProvider

// route for the home page
    .state('app', {
        url: '/',
        views: {
            'header':{
                templateUrl: '/ejs/patientHeader.ejs'


            },
            'content': {
                templateUrl: '/ejs/patientFitbit.ejs',
                controller: 'patientController'
            }

        }
    })
    .state('app.appointment', {

        url: '/appointment',
        views : {
            'header@' : {
                templateUrl: '/ejs/patientHeader.ejs',
            }
            ,
            'content@': {
                templateUrl: '/ejs/bookAppointment.ejs',
                controller: 'appointmentController'
            }
        }
    })
    .state('app.heartRate', {

        url: '/heartRate',
        views : {
            'header@' : {
                templateUrl: '/ejs/patientHeader.ejs',
            }
            ,
            'content@': {
                templateUrl: '/ejs/heartRate.ejs',
                controller: 'heartRateController'
            }
        }
    })
    .state('app.doctorDirectory', {

        url: '/doctorDirectory',
        views : {
            'header@' : {
                templateUrl: '/ejs/patientHeader.ejs',
            }
            ,
            'content@': {
                templateUrl: '/ejs/bookAppointment.ejs',
                controller: 'appointmentController'
            }
        }
    })
    .state('app.chat', {

        url: '/chat',
        views : {
            'header@' : {
                templateUrl: '/ejs/patientHeader.ejs',
            }
            ,
            'content@': {
                templateUrl: '/ejs/bookAppointment.ejs',
                controller: 'appointmentController'
            }
        }
    })


});


patientDashApp.controller('patientController',['$scope','$http','$state',function($scope,$http,$state){
fetchFitbitData = function () {
        $http({
            method : "get",
            url : "/fb-profile"
        }).success(function (data) {
            if(data.statusCode == 200) {
                console.log(data);
                $scope.hello = data;
                Highcharts.chart('calorieContainer', {

                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },

                    series: [{
                        data: data.calorieData
                    }]
                });
                Highcharts.chart('heartContainer', {

                    xAxis: {
                        categories: data.time
                    },

                    series: [{
                        data: data.heart
                    }]
                });
            }
            else
                {
                    console.log("eror")
                }
        }).error(function(error) {
            //handle error
        });
    }

    fetchFitbitData();
}]);


patientDashApp.controller('heartRateController',['$scope','$http','$state','$window',function($scope,$http,$state,$window){
    $scope.getData=function(){
        //console.log('inside test');
        var socket = new WebSocket('ws://localhost:3000', 'echo-protocol');
        $scope.socket=socket;


        $scope.createSocket=function(){

            //$scope.score=0;
            //$scope.socket.disconnect();
        }
        var flag=0;
        $scope.waitForConnection=function() {
            if (socket.readyState == 1) {
                flag=1;
                $scope.readingArr = [];
                $scope.socket.addEventListener("message", function(e) {
                    // The data is simply the message that we're sending back
                    // Create the chart
                    console.log(e.data);
                    $scope.readingArr.push(e.data);
                    //$scope.requestData(e.data);
                });
                function  closeIt() {
                    $scope.socket.close();
                }
                //setTimeout(closeIt,10000);

                var chart;
                console.log("inside create soccet");

                console.log(socket.readyState);
                $scope.socket.send('hello-  test');


                $scope.chart = Highcharts.chart({
                    chart: {
                        renderTo: 'graphDiv',
                        defaultSeriesType: 'spline',
                        events: {
                            load: function () {

                                var series = this.series[0];
                                setInterval(function () {
                                    var shift = series.data.length > 20,
                                        point = 0,
                                        x = new Date().getTime();
                                    if (typeof $scope.readingArr !== 'undefined' && $scope.readingArr.length > 0) {
                                        // the array is defined and has at least one element
                                        point = parseInt($scope.readingArr.shift());
                                        console.log("New point is : "+point);
                                    }
                                    console.log("Adding point : "+point);

                                    series.addPoint([x, point], true, shift);
                                    console.log(series);
                                },1000);
                            }
                        }
                    },
                    title: {
                        text: 'Live data feed'
                    },

                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150,
                        maxZoom: 20 * 1000
                    },
                    yAxis: {
                        minPadding: 0.2,
                        maxPadding: 0.2,
                        title: {
                            text: 'Value',
                            margin: 80
                        }
                    },

                    series: [{
                        name: 'Time',
                        data: []
                    }]
                });
            }
            else{
                setTimeout($scope.waitForConnection,1000);
            }
        }
        if(flag==0){
            $scope.waitForConnection();
        }










    }
}]);
patientDashApp.controller('appointmentController',['$scope', '$http', '$state', '$window',function($scope, $http, $state, $window){
    $scope.doctorNames = [];
    $http({
        method : "GET",
        url : '/findDoctors'
    }).success(function(data) {
        //checking the response data for statusCode
        if (data.statusCode == 200) {
            var doctors = data.result;
            for (i = 0; i < doctors.length; i++) {
                $scope.doctorNames.push(doctors[i].name);
            }
        }
        else {
            //handle error
        }
    }).error(function(error) {
        //handle error
    });

    $scope.bookAppointment = function() {
        $http({
            method : "POST",
            url : '/bookAppointment',
            data : {
                "name": $scope.name,
                "dob": $scope.dob,
                "gender": $scope.gender,
                "service": $scope.service,
                "doctorName": $scope.doctorName,
                "appointmentDate": $scope.appointmentDate,
                "email":$scope.email,
                "phone":$scope.phone,
                "serviceDesc" : $scope.serviceDesc
            }
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                //registration success
                console.log(data);
                $state.transitionTo('app');
            }
            else {
                //handle error
            }
        }).error(function(error) {
            //handle error
        });
    };
}]);