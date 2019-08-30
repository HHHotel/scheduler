import { IHttpResponse, IHttpProviderDefaults, IHttpService, ILocationService } from "angular";
import { DEFAULT, Settings } from "../default";
import * as HHH from "../types/HHHTypes";

export class ApiService {

    private http: IHttpService;
    private httpConfig: IHttpProviderDefaults;
    private loc: ILocationService;

    constructor(http: IHttpService, loc: ILocationService) {
        this.http = http;
        this.loc = loc;
        this.httpConfig = {headers:  {Version: DEFAULT.VERSION }};
    }

    public login(username: string, password: string,
                 callback: (response: IHttpResponse<unknown>) => void) {
        const user = {
            password,
            username,
        };

        this.http.post(Settings.BASE_URL + "/login", user, this.httpConfig)
            .then(
                (response) => {
                    Settings.user = response.data as HHH.ISchedulerUser;
                    callback(response);
                },
                (response) => callback(response),
            );

    }

    /* TODO: implement error function for this service */
    public get(endpoint: string, query: string,
               callback?: (response: IHttpResponse<unknown>) => void) {
        const url = Settings.BASE_URL + endpoint + "?" + query
            + buildQuery("username", Settings.user.username, "token", Settings.user.token);
        this.http.get(url, this.httpConfig).then(callback, (res) => this.handleError(res));
    }

    public post(endpoint: string, data: object,
                callback?: (response: IHttpResponse<unknown>) => void) {
        const url = Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", Settings.user.username, "token", Settings.user.token);
        this.http.post(url, data, this.httpConfig).then(callback, (res) => this.handleError(res));
    }

    public put(endpoint: string, data: object,
               callback?: (response: IHttpResponse<unknown>) => void) {
        this.http.put(Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", Settings.user.username, "token", Settings.user.token),
            data).then(callback, (res) => this.handleError(res));
    }

    public delete(endpoint: string, callback?: (response: IHttpResponse<unknown>) => void) {
        const url = Settings.BASE_URL + endpoint + "?"
            + buildQuery("username", Settings.user.username, "token", Settings.user.token);
        this.http.delete(url, this.httpConfig).then(callback, (res) => this.handleError(res));
    }

    private handleError(err: IHttpResponse<unknown>) {
        console.error(err);
        this.loc.path("/");
    }

}

function buildQuery(...args: string[]) {
    let query = "";
    for (let i = 0; i < args.length; i += 2) {
        query += "&" + args[i] + "=" + args[i + 1];
    }
    return query;
}
