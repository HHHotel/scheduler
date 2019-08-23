/* global angular DEFAULT */

angular
        .module(DEFAULT.MAIN_PKG, [
                require("angular-route"),
        ])

        .config(function ($routeProvider) {

                // To-DO add login.html
                $routeProvider
                        .when("/", {
                                templateUrl: "views/login.html"
                        })
                        .when("/main", {
                                templateUrl: "views/main.html"
                        });
        });



