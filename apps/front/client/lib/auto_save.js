/**
 * Autosave
 *    set()               set the job doing a callback function periodically
 *
 *    clear()             release the job
 */

Autosave = function() {
  // trigger autosave operation
  this.set = function(callbackSave, interval) {
    interval = interval || 5000;

    return Meteor.setTimeout(function() {
      callbackSave();
    }, interval);
  };

  // release autosave operation
  this.clear = function(timer) {
    if (timer) {
      Meteor.clearInterval(timer);
    }
  };

  return this;
};

