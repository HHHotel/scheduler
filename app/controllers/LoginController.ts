import { HoundsService } from "../services/Hounds.service";
import { ILocationService, ITimeoutService } from "angular";

/** Angular controller for the login page */
export class LoginController {
    /** Declare dependencies for AngularJs injection */
    protected static $inject = [
        "$scope",
        "HoundsService",
        "$location",
        "$timeout"
    ];

    /** Boolean value to show the loading symbol or button */
    public loginLoading: boolean = false;
    /** Scope variable to hold login values */
    public user: {
        /** username of user */
        username: string;
        /** password of user */
        password: string;
    };

    constructor(
        private $scope: ng.IScope,
        private hounds: HoundsService,
        private $location: ILocationService
    ) {
        this.user = {
            username: "",
            password: ""
        };
    }

    /**
     * Login the API using the hounds service
     * @param username
     * @param password
     */
    public submit(username: string, password: string) {
        this.loginLoading = true;

        this.hounds.login(username, password).then(res => {
                if (res) {
                    this.$location.path("/main");
                } else {
                    alert("Login failed: Please Try Again");
                }
            }).catch(err => {
                console.error(err);
                alert("Error occured: " + err.message);
            }).finally(() => {
                this.loginLoading = false;
                this.user.password = "";
                this.$scope.$apply();
            });
    }
}
