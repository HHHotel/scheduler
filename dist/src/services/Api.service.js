"use strict";
angular.module(DEFAULT.MAIN_PKG)
    .factory("Api", ["$http",
    function (http) { return new ApiService(http); }]);
var ApiService = (function () {
    function ApiService(http) {
        var self = this;
        self.http = http;
    }
    ApiService.prototype.login = function (username, password, callback) {
        var self = this;
        var user = {
            username: username,
            password: password,
        };
        self.http.post(DEFAULT.API.BASE_URL + "/login", user)
            .then(function (response) {
            Settings.user = response.data;
            callback(response);
        }, function (response) { return callback(response); });
    };
    ApiService.prototype.get = function (endpoint, query, callback) {
        var self = this;
        var url = DEFAULT.API.BASE_URL + endpoint + "?" + query
            + buildQuery("username", Settings.user.username, "token", Settings.user.token);
        self.http.get(url).then(callback, function (res) {
            console.error(res);
        });
    };
    ApiService.prototype.post = function (endpoint, data, callback) {
        var self = this;
        var url = DEFAULT.API.BASE_URL + endpoint + "?"
            + buildQuery("username", Settings.user.username, "token", Settings.user.token);
        self.http.post(url, data).then(callback, callback);
    };
    ApiService.prototype.put = function (endpoint, data, callback) {
        var self = this;
        self.http.put(DEFAULT.API.BASE_URL + endpoint + "?"
            + buildQuery("username", Settings.user.username, "token", Settings.user.token), data).then(callback);
    };
    return ApiService;
}());
function buildQuery() {
    var query = "";
    for (var i = 0; i < arguments.length; i += 2) {
        query += "&" + arguments[i] + "=" + arguments[i + 1];
    }
    return query;
}
