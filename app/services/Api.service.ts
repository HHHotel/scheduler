import { IHttpResponse, IHttpService, module } from "angular";
import { DEFAULT, Settings } from "../default";
import { HHH } from "../types/HHHTypes";

export class ApiService {

    private http: IHttpService;

    constructor(http: IHttpService) {
        this.http = http;
    }

    public login(username: string, password: string,
                 callback: (response: IHttpResponse<unknown>) => void) {
        const user = {
            password,
            username,
        };

        this.http.post(Settings.BASE_URL + "/login", user)
            .then(
                (response) => {
                    Settings.user = response.data as HHH.SchedulerUser;
                    callback(response);
                },
                (response) => callback(response),
            );

    }

    /* TODO: implement error function for this service */
    public get(endpoint: string, query: string,
               callback: (response: IHttpResponse<unknown>) => void) {
        const url = Settings.BASE_URL + endpoint + "?" + query
            + buildQuery("username", Settings.user.username, "token", Settings.user.token);
        this.http.get(url).then(callback, (res) => console.error(res));
    }

    public post(endpoint: string, data: object,
                callback: (response: IHttpResponse<unknown>) => void) {
        const url = Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", Settings.user.username, "token", Settings.user.token);
        this.http.post(url, data).then(callback, callback);
    }

    public put(endpoint: string, data: object,
               callback: (response: IHttpResponse<unknown>) => void) {
        this.http.put(Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", Settings.user.username, "token", Settings.user.token),
            data).then(callback);
    }

}

function buildQuery(...args: string[]) {
    let query = "";
    for (let i = 0; i < args.length; i += 2) {
        query += "&" + args[i] + "=" + args[i + 1];
    }
    return query;
}
