import { HoundsService } from "../services/Hounds.service";

import { ILocationService, ITimeoutService } from "angular";

interface ILoginScope extends ng.IScope {
    login: {
    };
}

export class LoginController {
           protected static $inject = [
               "$scope",
               "HoundsService",
               "$location",
               "$timeout"
           ];

           public loginLoading: boolean;
           public user: { username: string; password: string };

           constructor(
               private $scope: ILoginScope,
               private hounds: HoundsService,
               private $location: ILocationService
           ) {
               this.loginLoading = false;
               this.user = {
                   username: "",
                   password: "",
               };
           }

           public submit() {
               const user = this.user;
               this.loginLoading = true;

               this.hounds
                   .login(user.username, user.password)
                   .then(res => {
                       if (res) {
                           this.$location.path("/main");
                       } else {
                           alert("Login failed: Please Try Again");
                       }
                   })
                   .catch(err => {
                       alert("Login failed: Please Try Again");
                   })
                   .finally(() => {
                       this.loginLoading = false;
                       user.password = "";
                   });
           }
       }
