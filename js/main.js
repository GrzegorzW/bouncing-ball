var BouncingBall = function (THREE, TWEEN, GUI, Stats) {
    var renderer;
    var scene;
    var camera;
    var control;
    var stats;
    var ball;

    function init() {

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000000, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        new THREE.OrbitControls(camera, renderer.domElement);

        var planeGeometry = new THREE.PlaneGeometry(20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -2;
        plane.position.z = 0;

        scene.add(plane);

        var ballGeometry = new THREE.SphereGeometry(4, 100, 100);
        var cubeMaterial = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('img/dino-texture.jpg')});
        ball = new THREE.Mesh(ballGeometry, cubeMaterial);
        ball.name = 'cube';
        ball.castShadow = true;
        ball.position.y = 20;

        scene.add(ball);

        camera.position.x = 15;
        camera.position.y = 16;
        camera.position.z = 13;
        camera.lookAt(scene.position);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(10, 20, 20);
        spotLight.shadowCameraNear = 20;
        spotLight.shadowCameraFar = 50;
        spotLight.castShadow = true;

        scene.add(spotLight);

        var light = new THREE.PointLight(0x00ffff, 1, 100);
        light.position.set(20, 0, 0);
        scene.add(light);

        control = new function () {
            this.rotationSpeed = 0.005;
            this.duration = 2000;
            this.color = cubeMaterial.color.getHex();
        };

        addControlGui(control);
        addStatsObject();

        document.body.appendChild(renderer.domElement);

        setupTweens();
        render();
    }

    function setupTweens() {
        TWEEN.removeAll();

        var upPosition = {y: 20};
        var downPosition = {y: 2};

        var tween = new TWEEN.Tween(upPosition)
            .to(downPosition, control.duration)
            .delay(500)
            .onUpdate(function () {
                ball.position.y = upPosition.y;
            });
        tween.easing(TWEEN.Easing.Bounce.Out);

        tween.start();
    }

    function addControlGui(controlObject) {
        var gui = new GUI();
        gui.add(controlObject, 'rotationSpeed', -0.01, 0.01);
        gui.add(controlObject, 'duration', 1000, 3000);
        gui.addColor(controlObject, 'color');
    }

    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild(stats.domElement);
    }

    function render() {
        ball.rotation.y += control.rotationSpeed * 10;

        scene.getObjectByName('cube').material.color = new THREE.Color(control.color);

        stats.update();

        renderer.render(scene, camera);

        requestAnimationFrame(render);

        TWEEN.update();
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return {
        'init': init,
        'handleResize': handleResize,
        'setupTweens': setupTweens
    }
};
