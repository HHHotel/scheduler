/* global angular DEFAULT Settings */
/* eslint-disable no-console */

angular.module(DEFAULT.MAIN_PKG)
    .factory('Api', [ '$http',
    function (http) { return new ApiService(http); }]);

class ApiService {

    constructor (http) {
        let self = this;
        self.http = http;
    }

    login (username, password) {
        let self = this;
        const user = {
            username: username,
            password: password,
        };

        self.http.post(DEFAULT.API.BASE_URL + '/login',
            user)
            .then(
                (response) => {
                    Settings.user = response.data;
                },
                (response) => console.error('Error: ', response)
            );

    }

    /* TODO: implement error function for this service */
    get (endpoint, query, callback) {
        let self = this;
        self.http.get(DEFAULT.API.BASE_URL + endpoint + '?'
            + query
            + buildQuery('username', Settings.user.username, 'token', Settings.user.token)
        ).then(callback, (res) => {
            console.err(res);
        });
    }

    post (endpoint, data, callback) {
        let self = this;
        self.http.post(DEFAULT.API.BASE_URL + endpoint + '?'
            + buildQuery('username', Settings.user.username, 'token', Settings.user.token),
            data).then(callback);
    }

    put (endpoint, data, callback) {
        let self = this;
        self.http.post(DEFAULT.API.BASE_URL + endpoint + '?'
            + buildQuery('username', Settings.user.username, 'token', Settings.user.token),
            data).then(callback);
    }

}

function buildQuery() {
    let query = '&' + arguments[0] + '=' + arguments[1];
    for (var i = 2; i < arguments.length; i += 2) {
        query += '&' + arguments[i] + '=' + arguments[i + 1];
    }
    return query;
}
