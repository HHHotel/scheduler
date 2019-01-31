/* global angular DEFAULT */
let BrowserWindow = require('electron').remote.BrowserWindow;

angular
  .module(DEFAULT.MAIN_PKG)
  .controller('titleBar', [
    '$scope',
    function ($scope) {
      $scope.minimize = function () {
        BrowserWindow.getFocusedWindow().minimize();
      };

      $scope.maximize = function () {
        let win = BrowserWindow.getFocusedWindow();
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
      };

      $scope.close = function () {
        BrowserWindow.getFocusedWindow().close();
      };

  }]);
