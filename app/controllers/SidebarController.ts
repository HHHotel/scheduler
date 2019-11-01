import { DEFAULT, IHoundUser } from "@happyhoundhotel/hounds-ts";
import { HoundsSettings } from "../services/Settings.service";

interface ISidebarScope extends ng.IScope {
    sidebar: {
        index: number;
        newUser: IHoundUser;
        showRepeat: boolean;
        form: {
            booking: any,
            dog: any,
            event: any,
        };
    };
}

export class SidebarController {

    protected static $inject = ["$scope", "HoundsSettings"];

    constructor(private $scope: ISidebarScope, private $settings: HoundsSettings) {
        this.clearForm();
        $scope.sidebar.index = 0;
     }

    public printSchedule() {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("print-schedule");
    };

    public eventSearchComparator(a: any, b: any) {
        if (a.value.type === DEFAULT.CONSTANTS.DOG) {
            return 1;
        } else if (b.value.type === DEFAULT.CONSTANTS.DOG) {
            return -1;
        } else {
            return (a.value.startDate < b.value.startDate) ? -1 : 1;
        }
    }

    private clearForm() {
        this.$scope.sidebar.form = {
            booking: {},
            dog: {},
            event: {},
        };
    }

}
