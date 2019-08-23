"use strict";
angular
    .module(DEFAULT.MAIN_PKG, [
    require("angular-route"),
])
    .config(function ($routeProvider) {
    $routeProvider
        .when("/", {
        templateUrl: "views/login.html"
    })
        .when("/main", {
        templateUrl: "views/main.html"
    });
});
