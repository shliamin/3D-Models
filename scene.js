import * as THREE from './libs/three.module.min.js';
import { OrbitControls } from './libs/OrbitControls.js';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(2, 2, 2);

    const renderer = new THREE.WebGLRenderer();
    const container = document.getElementById('tentModel');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const size = 10;
    const divisions = 10;

    const gridHelperXY = new THREE.GridHelper(size, divisions);
    gridHelperXY.rotation.x = Math.PI / 2;
    scene.add(gridHelperXY);

    const gridHelperXZ = new THREE.GridHelper(size, divisions);
    scene.add(gridHelperXZ);

    const gridHelperYZ = new THREE.GridHelper(size, divisions);
    gridHelperYZ.rotation.z = Math.PI / 2;
    scene.add(gridHelperYZ);

    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Update controls
        renderer.render(scene, camera);
    }

    animate();

    return { scene, camera, renderer };
}
