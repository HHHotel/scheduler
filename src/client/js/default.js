/* eslint-disable */

const DEFAULT = {

  MAIN_PKG: 'HHH.Scheduler.App',

  API: {
    BASE_URL: process.env.NODE_ENV !== 'DEVELOPMENT' ? "" : "http://localhost:3333"
  },

  PKG: function (suffix) {
  if (suffix != null && suffix.length) {
    return DEFAULT.MAIN_PKG + '.' + suffix;
  } else {
    return DEFAULT.MAIN_PKG;
  }
}


}
