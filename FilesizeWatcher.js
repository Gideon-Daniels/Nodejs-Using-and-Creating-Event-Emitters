'use strict'

watcher = new FilesizeWatcher('video1.mp4');

watcher.on('error', function(err){
    console.log('File grew by', gain, 'bytes');
});

watcher.on('grew', function(gain) {
    console.log('File grew by', gain, 'bytes');
});

watcher.on('shark', function(loss){
    console.log('File shrank by', loss, 'bytes');
});

watcher.stop();