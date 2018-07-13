var webserver = require('webserver');
var webpage = require('webpage');
var server = webserver.create();
var Promise = require('bluebird');
var _ = require('underscore');


var service = server.listen('127.0.0.1:9601', function (request, response) {
    
    var input = validateRequest(request, response);
    if(!input) {
        return;
    }

    console.log('phantomjs configuration: ' + input.configurationId + ' with hash: ' + input.imageHash);

    renderSides(input)
        .then(function (values) {

            renderBox(input)
                .then(function(values) {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify({success: true}));
                    response.close();
                    return;
                })
                .catch(function (values) {
                    sendError(response, 500, 'Couldn\'t create box screenshot.');
                    return;
                })
        })
        .catch(function (values) {
            sendError(response, 500, 'Couldn\'t create side images.');
            return;
        })

});


// Helpers

function validateRequest(request, response) {
    console.log(JSON.stringify(request));
    if (request.method != 'POST' || !request.post) {
        sendError(response, 404, 'Not Found.');
        return false;
    }

    if (!validJSON(request.post)) {
        sendError(response, 400, 'Bad Request.');
        return false;
    }

    var input = JSON.parse(request.post);
    console.log(JSON.stringify(input), parseInt(input.configurationId));
    if (input.configurationId === undefined || !parseInt(input.configurationId)) {
        sendError(response, 421, 'Invalid configuration ID.');
        return false;
    }

    if (input.imageHash === undefined || !_.isString(input.imageHash) || input.imageHash.length < 5) {
        sendError(response, 421, 'Invalid image hash.');
        return false;
    }

    return input;
}

function sendError(response, code, message) {
    response.statusCode = code;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({success: false, message: message}));
    response.close();
}

function validJSON(stringValue) {
    var isValidJSON = true;
    
    try {
        JSON.parse(stringValue);
    } catch(err) {
        isValidJSON = false;
    }

    return isValidJSON;
}

function renderSides(input) {
    var configurationPath = getConfigurationPath(input.configurationId);

    var i;
    var renderPromises = [];
    for (i = 0; i < 5; i++) {
        var promise = renderSide(configurationPath + input.imageHash + '_' + i + '.png', configurationPath + 'print_materials/side_' + i + '.svg');
        renderPromises.push(promise);
    }

    return Promise.all(renderPromises);
}

function renderSide(iPath, fPath) {
    var page = webpage.create();
    
    return new Promise(function(resolve, reject){
        page.open(fPath, function (status) {
            if (status !== 'success') {
                console.log('Unable to load the filePath: ' + fPath);
                reject();
            } else {
                page.render(iPath);
                resolve(1);
            }
        });
    });
}

function renderBox(input) {
    var page = webpage.create();
    var pageWidth = 960;
    var pageHeight = 960;

    page.viewportSize = { width: pageWidth, height: pageHeight };
    // page.clipRect = { top: 0, left: 0, width: 960, height: 960 };

    var configurationPath = getConfigurationPath(input.configurationId);
    var imagePath = configurationPath + input.imageHash + '_screenshot.png';
    return new Promise(function (resolve, reject) {
        page.onConsoleMessage = function (msg, lineNum, sourceId) {
            console.log('CONSOLE: ' + msg);
            if (msg == 'canvas-rendered') {

                console.log(JSON.stringify(page.viewportSize));
                page.render(imagePath);
                resolve();
            }
        };

        
        page.open('http://localhost:9501/render/' + input.configurationId, function (status) {
            if (status !== "success") {
                reject('Couldn\'t load box renderer');
            }
            page.evaluate(function (w, h) {
                document.body.style.width = w + "px";
                document.body.style.height = h + "px";
                console.log('set document w, h');
                window.box.initScene();
            }, pageWidth, pageHeight);
        });


    });

    
}

function getConfigurationPath(id) {
    return 'block_storage_link/bicc/' + id + '/';
}