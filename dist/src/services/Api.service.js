"use strict";
exports.__esModule = true;
var default_1 = require("../default");
var ApiService = (function () {
    function ApiService(http) {
        this.http = http;
    }
    ApiService.prototype.login = function (username, password, callback) {
        var user = {
            password: password,
            username: username
        };
        this.http.post(default_1.Settings.BASE_URL + "/login", user)
            .then(function (response) {
            default_1.Settings.user = response.data;
            callback(response);
        }, function (response) { return callback(response); });
    };
    ApiService.prototype.get = function (endpoint, query, callback) {
        var url = default_1.Settings.BASE_URL + endpoint + "?" + query
            + buildQuery("username", default_1.Settings.user.username, "token", default_1.Settings.user.token);
        this.http.get(url).then(callback, function (res) { return console.error(res); });
    };
    ApiService.prototype.post = function (endpoint, data, callback) {
        var url = default_1.Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", default_1.Settings.user.username, "token", default_1.Settings.user.token);
        this.http.post(url, data).then(callback, callback);
    };
    ApiService.prototype.put = function (endpoint, data, callback) {
        this.http.put(default_1.Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", default_1.Settings.user.username, "token", default_1.Settings.user.token), data).then(callback);
    };
    ApiService.prototype["delete"] = function (endpoint, callback) {
        this.http["delete"](default_1.Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", default_1.Settings.user.username, "token", default_1.Settings.user.token))
            .then(callback);
    };
    return ApiService;
}());
exports.ApiService = ApiService;
function buildQuery() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var query = "";
    for (var i = 0; i < args.length; i += 2) {
        query += "&" + args[i] + "=" + args[i + 1];
    }
    return query;
}
