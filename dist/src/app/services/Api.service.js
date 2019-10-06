"use strict";
exports.__esModule = true;
var default_1 = require("../default");
var ApiService = (function () {
    function ApiService(http, loc) {
        this.http = http;
        this.loc = loc;
        this.httpConfig = { headers: { Version: default_1.DEFAULT.VERSION } };
    }
    ApiService.prototype.login = function (username, password, callback) {
        var user = {
            password: password,
            username: username
        };
        this.http.post(default_1.Settings.BASE_URL + "/login", user, this.httpConfig)
            .then(function (response) {
            default_1.Settings.user = response.data;
            callback(response);
        }, function (response) { return callback(response); });
    };
    ApiService.prototype.get = function (endpoint, query, callback) {
        var _this = this;
        var url = default_1.Settings.BASE_URL + endpoint + "?" + query
            + buildQuery("username", default_1.Settings.user.username, "token", default_1.Settings.user.token);
        this.http.get(url, this.httpConfig).then(callback, function (res) { return _this.handleError(res); });
    };
    ApiService.prototype.post = function (endpoint, data, callback) {
        var _this = this;
        var url = default_1.Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", default_1.Settings.user.username, "token", default_1.Settings.user.token);
        this.http.post(url, data, this.httpConfig).then(callback, function (res) { return _this.handleError(res); });
    };
    ApiService.prototype.put = function (endpoint, data, callback) {
        var _this = this;
        var url = default_1.Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", default_1.Settings.user.username, "token", default_1.Settings.user.token);
        this.http.put(url, data, this.httpConfig).then(callback, function (res) { return _this.handleError(res); });
    };
    ApiService.prototype["delete"] = function (endpoint, callback) {
        var _this = this;
        var url = default_1.Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", default_1.Settings.user.username, "token", default_1.Settings.user.token);
        this.http["delete"](url, this.httpConfig).then(callback, function (res) { return _this.handleError(res); });
    };
    ApiService.prototype.handleError = function (err) {
        console.error(err);
        this.loc.path("/");
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
