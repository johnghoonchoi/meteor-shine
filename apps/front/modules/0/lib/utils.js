/**
 * Misc utilities
 */

// Another trim function. The string function '.trim()' does NOT work in IE8
//
if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
