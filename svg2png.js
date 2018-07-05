
"use strict";
var webpage = require('webpage'),
    system = require('system'),
    // path = require('path'),
    configurationId, hash, configurationPath;

// phantom.exit(2);

if (system.args.length < 3) {
    console.log('Invalid args');
    phantom.exit(1);
} 

configurationId = system.args[1];
hash = system.args[2];
configurationPath = 'files/bicc/' + configurationId + '/';

// var iPath = configurationPath + hash + '_4.png';
// var fPath = configurationPath + 'side_4.svg';

// console.log('fpath: ' + fPath);
// console.log('iPath: ' + iPath);

// page.open(fPath, function (status) {
//     if (status !== 'success') {
//         console.log('Unable to load the filePath: ' + fPath);
//         phantom.exit(1);
//     } else {
//         page.render(iPath);
//         phantom.exit(2);
//     }
// });

var i;
var loaded = 0;
for (i = 0; i < 5; i++) {
    render(configurationPath + hash + '_' + i + '.png', configurationPath + 'side_' + i + '.svg');
}

// phantom.exit(1);

function render(iPath, fPath) {
    console.log('before render -> fPath: ' + fPath);
    console.log('before render -> iPath: ' + iPath);
    var page = webpage.create();
    page.open(fPath, function (status) {
        console.log('after render -> fPath: ' + fPath);
        console.log('after render -> iPath: ' + iPath);
        if (status !== 'success') {
            console.log('Unable to load the filePath: ' + fPath);
            setTimeout(function () {
                phantom.exit(1);
            }, 3000);
        } else {
            page.render(iPath);
            loaded++;
            if (loaded == 5) {
                phantom.exit(2);
            }
        }
    });
};


// console.log('args ok');

// configurationId = system.args[1];
// hash = system.args[2];

// page.viewportSize = { width: 600, height: 600 };
// filePathBase = './files' + '/' + 'bicc' + '/' + configurationId + '/' + 'side_';
// imagePathBase = './files' + '/' + 'bicc' + '/' + configurationId + '/' + hash + '_';

// console.log('configurationId: ' + configurationId);
// console.log('hash: ' + hash);
// console.log('filePathBase: ' + filePathBase);
// console.log('imagePathBase: ' + imagePathBase);

// var i;
// var loaded = 0;
// for(i = 0; i < 5; i++) {
//     var filePath = filePathBase + i + '.svg';
//     var imagePath = imagePathBase + i + '.png';

//     console.log('conversion #' + i);
//     console.log('filePath: ' + filePath);
//     console.log('imagePath: ' + imagePath);

//     page.open(filePath, function (status) {
//         if (status !== 'success') {
//             console.log('Unable to load the filePath!');
//             phantom.exit(1);
//         } else {
//             page.render(imagePath);
//             loaded++;
//             if(loaded == 5) {
//                 phantom.exit(2);
//             }
//         }
//     });


// }

    