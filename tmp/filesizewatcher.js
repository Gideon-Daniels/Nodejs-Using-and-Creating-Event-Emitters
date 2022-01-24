"use strict";

var fs = require("fs");
var util = require("util");
var EventEmittter = require("events").EventEmitter;

var FilesizeWatcher = function (path) {
  var self = this;

  self.callbacks = {};
  //   check if the given path starts with a slash using a regular expression
  if (/^\//.test(path) === false) {
    process.nextTick(function () {
      self.callbacks["error"]("Path does not start with a slash");
    });
    return;
  }
  /*If the check succeeds, we start an initial stat operation in order to store the file size of the given path
- we need this base value in order to recognize future changes in file size. */
  fs.stat(path, function (err, stats) {
    self.lastfilesize = stats.size;
  });
  /*We set up a 1-second interval where we call stat on every
interval iteration and compare the current file size with the last known file size. */
  self.interval = setInterval(function () {
    fs.stat(
      path,
      //In both cases, the new file size is saved.
      function (err, stats) {
        // handles the case where the file grew in size,
        if (stats.size > self.lastfilesize) {
          self.callbacks["grew"](stats.size - self.lastfilesize);
          self.lastfilesize = stats.size;
        }
        // handles the opposite case.
        if (stats.size < self.lastfilesize) {
          self.callbacks["shrank"](self.lastfilesize - stats.size);
          self.lastfilesize = stats.size;
        }
      },
      1000
    );
  });
};

util.inherits(FilesizeWatcher, EventEmittter);
// FilesizeWatcher.prototype = new EventEmittter();
/*store the callback under the event name in our callbacks object. */
FilesizeWatcher.prototype.on = function (eventType, callback) {
  this.callbacks[eventType] = callback;
};
/* cancels the interval we set up in the constructor
function*/
FilesizeWatcher.prototype.stop = function () {
  clearInterval(this.interval);
};

module.exports = FilesizeWatcher;
