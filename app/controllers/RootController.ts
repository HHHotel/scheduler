import { ILocationService } from "angular";
import { HoundsService } from "../services/Hounds.service";
import { HoundsSettings } from "../services/Settings.service";

interface IRootScope extends ng.IScope {
}

export class RootController {

    protected static $inject = ["$scope", "$location", "HoundsService", "HoundsSettings"];

    constructor(private $scope: IRootScope, private $location: ILocationService, private hounds: HoundsService,
                private $settings: HoundsSettings) {

        window.addEventListener("beforeunload", () => {
            $settings.save();
        });

        hounds.checkAuth().then(() => {
            this.$location.path("/main");
        }).catch(() => {
            this.$location.path("/");
        }).finally(() => {
            $scope.$apply();
        });
    }
}
