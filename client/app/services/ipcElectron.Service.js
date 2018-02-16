/* eslint-disable */

angular
  .module(DEFAULT.MAIN_PKG)
  .factory('ipc',
    function () {

      class ipcService {

        constructor () {
          this.ipcRenderer = require('electron').ipcRenderer;


        }

        send (evt, data) {
          this.ipcRenderer.send(evt, data);
        }

        listen (evt, fn) {
          this.ipcRender.on(evt, fn);
        }


      }

      return new ipcService()
  });
