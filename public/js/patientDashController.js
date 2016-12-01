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
                templateUrl: '/ejs/patientHeader.ejs',
                controller: 'headerController'


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
                controller: 'headerController'
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
                controller: 'headerController'
            }
            ,
            'content@': {
                templateUrl: '/ejs/bookAppointment.ejs',
                controller: 'appointmentController'
            }
        }
    })
    .state('app.doctorDirectory', {

        url: '/doctorDirectory',
        views : {
            'header@' : {
                templateUrl: '/ejs/patientHeader.ejs',
                controller: 'headerController'
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
                controller: 'headerController'
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
patientDashApp.controller('headerController',['$scope', '$http', '$state','$localStorage', '$window',function($scope, $http, $state,$localStorage, $window) {

    getSessionValues = function () {
        $http({
            method : 'get',
            url : '/sessionValues'
        }).success(function(data) {
            //checking the response data for statusCode
            console.log("SESSION NAME " +data.name);
    $scope.userName = data.name;
        }).error(function(error) {
            //handle error
        });
    }
    getSessionValues();

    $scope.logout = function() {

        alert("Logout");
        $localStorage.$reset();
        $http({
            method: 'get',
            url: '/logout'
        });
    }
}]);