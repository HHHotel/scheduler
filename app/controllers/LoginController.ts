import { HoundsService } from "../services/Hounds.service";

import { ILocationService, ITimeoutService } from "angular";

interface ILoginScope extends ng.IScope {
    login: {
        loginLoading: boolean;
        user: { username: string, password: string };
    };
}

export class LoginController {

    protected static $inject = ["$scope", "HoundsService", "$location", "$timeout"];

    constructor(private $scope: ILoginScope, private hounds: HoundsService, private $location: ILocationService) {
        this.$scope.login.loginLoading = false;
    }

    public submit() {
        const user = this.$scope.login.user;
        this.$scope.login.loginLoading = true;

        this.hounds.login(user.username, user.password)
            .then((res) => {
                if (res) {
                    this.$location.path("/main");
                    this.$scope.$apply();
                } else {
                    alert("Login failed: Please Try Again");
                }
            }).catch((err) => {
                alert("Login failed: Please Try Again");
            }).finally(() => {
                this.$scope.login.loginLoading = false;
                user.password = "";
            });
    }
}
