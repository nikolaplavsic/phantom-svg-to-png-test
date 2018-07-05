
var page = require('webpage').create();
page.viewportSize = { width: 400, height: 400 };
page.content = '<html><body></body></html>';
// var THREE = require('three');

page.onConsoleMessage = function (msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
    if(msg == 'canvas-rendered') {
        page.render('box.png');
        phantom.exit();
    }
};

if (page.injectJs('/node_modules/three/build/three.min.js')) {
    if (page.injectJs('/node_modules/three/examples/js/renderers/CanvasRenderer.js')) {
        if (page.injectJs('/node_modules/three/examples/js/renderers/Projector.js')) {
            page.evaluate(function () {
                var scene = new THREE.Scene();
                var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

                var renderer = new THREE.CanvasRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);

                var geometry = new THREE.BoxGeometry(700, 700, 700, 10, 10, 10);
                var material = new THREE.MeshBasicMaterial({ color: 0xfffff, wireframe: true });
                var cube = new THREE.Mesh(geometry, material);
                scene.add(cube);

                camera.position.z = 1000;

                renderer.render(scene, camera);

                console.log('canvas-rendered');
            });
            // page.render('box.png');
            phantom.exit();
        }
    }
}

phantom.exit();






// ----------------------------------------------------------------------------------------------
