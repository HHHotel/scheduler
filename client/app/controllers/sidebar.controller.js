/* global angular DEFAULT saveSettings */

angular.module(DEFAULT.MAIN_PKG).controller('sidebarCtrl', [
    '$scope',
    '$rootScope',
    '$Scheduler',
    function ($scope, $rootScope, $Scheduler) {

        $scope.saveSettings = function () {
            saveSettings();
        };

        $scope.printSchedule = function () {
            const {ipcRenderer} = require('electron');
            ipcRenderer.send('print-schedule');
        };

        /* KEEP TRACK OF INPUTS */
        $scope.form = {};
        $scope.newUser = {};
        $rootScope.search = {};
        /* MIRROR SCHEDULER CACHE */
        $scope.cache = $Scheduler.cache;
        /* INDEX OF SIDEBAR TAB */
        $scope.index = 0;

        /* USER MANAGEMENT */
        $scope.addUser = function (username, password, permissionType) {
            let permissionLevel = 0;
            if (permissionType === 'Viewer') permissionLevel = 0;
            else if (permissionType === 'Inputer') permissionLevel = 5;
            else if (permissionType === 'Admin') permissionLevel = 10;

            $Scheduler.addUser(username, password, permissionLevel);
            $scope.newUser = {};
        };

        $scope.deleteUser = function (username) {
            $Scheduler.deleteUser(username);
        };

        $scope.changePassword = function (oldPassword, newPassword) {
            $Scheduler.changePassword(oldPassword, newPassword);
        };

        $scope.logout = function () {
            $Scheduler.logout();
        };

        /* DOG SCHEDULE MANAGEMENT */
        $scope.addDog = function () {
            if ($scope.form.name && $scope.form.clientName) {
                $Scheduler.addDog($scope.form);
                $scope.form = {};
            } else {
                alert('Insufficent dog details');
            }
        };

        $scope.addEvent = function () {
            if (($scope.form.event_text || $scope.form.id) && $scope.form.event_start
                && $scope.form.event_type) {
                $Scheduler.addEvent($scope.form);
                $scope.form = {};
            } else {
                alert('Insufficent event details');
            }
        };

        $scope.removeEvent = function (id) {
            $Scheduler.removeEvent(id);
            $Scheduler.findEvents($scope.search.input);
        };

        $scope.findEvents = function (search) {
            $Scheduler.findEvents(search);
            $Scheduler.cache.searchText = search;
        };

        $scope.retrieveDog = function (dogID) {
            $Scheduler.retrieveDog(dogID);
        };

        /* MOVE AROUND WEEKS */
        $scope.jumpToWeek = function (date) {
            $Scheduler.jumpToWeek(date);
        };

    }
]);
