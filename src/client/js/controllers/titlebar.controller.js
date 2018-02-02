/* eslint-disable */

let BrowserWindow = require('electron').remote.BrowserWindow;

angular.module('scheduler').
  controller('titleBar', [
    '$scope',
    function ($scope) {
      $scope.minimize = function () {
        BrowserWindow.getFocusedWindow().minimize();
      }

      $scope.maximize = function () {
        BrowserWindow.getFocusedWindow().maximize();
      }

      $scope.close = function () {
        BrowserWindow.getFocusedWindow().close();
    }
  }]);
