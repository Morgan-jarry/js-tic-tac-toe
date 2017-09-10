/* jshint -W033 */
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
(function(window) {
  window.Utility = {
    matchFirstArray: function(array1, array2) {
      findItems = []

      for (var i = 0; i < array1.length; i++) {
        findItems.push(array2.indexOf(array1[i]) != -1)
      }

      return findItems.indexOf(false) === -1
    },

    Object: {
      byString: function(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1')
        s = s.replace(/^\./, '')
        var a = s.split('.')

        for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i]

          if (k in o) {
            o = o[k]
          } else {
            return
          }
        }

        return o
      }
    },

    foreach: function(array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i])
      }
    },
  }
})(window)
