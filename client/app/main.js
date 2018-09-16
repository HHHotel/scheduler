/* eslint-disable */

const {remote} = require('electron');

remote.globalShortcut.register('CommandOrControl+Shift+I', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})

angular
  .module(DEFAULT.MAIN_PKG, [
    require('angular-route')
  ])

  .config(function ($routeProvider) {

     // To-DO add login.html
     $routeProvider
     .when('/', {
       templateUrl: 'views/login.html'
     })
     .when('/main', {
       templateUrl: 'views/main.html'
     });
   })

  .controller('bodyCtrl', function () {

  });
