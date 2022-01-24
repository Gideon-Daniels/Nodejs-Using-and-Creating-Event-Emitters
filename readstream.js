"use strict";

var fs = require("fs");

var stream = fs.createReadStream("video1.mp4"); // event emitter

var content = "";

stream.once("data", function (data) {
  console.log("I have received the first chunk of data " + data);
});

stream.on("error", function (err) {
  console.log("Sad panda: " + err);
});

stream.on("data", function (data) {
  content = content + data;
});

stream.on("end", function () {
  console.log("File content has been retrieved: " + content);
});
