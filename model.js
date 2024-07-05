import { createScene } from './scene.js';
const { scene, camera, renderer } = createScene();
import { calculateArcLength, interpolateSurface, perfectArc, calculateSurfaceArea } from './model-utils.js';


export function updateModel() {
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    const vertices = [
        [0, 0, 0],
        [width, 0, 0],
        [0, depth, 0],
        [width, depth, 0],
        [width / 2, depth / 2, height]
    ];

    const arc1 = perfectArc(vertices[0], vertices[3], height);
    const arc2 = perfectArc(vertices[1], vertices[2], height);

    const surface1 = interpolateSurface(arc1, arc2);

    const area1 = calculateSurfaceArea(surface1);

    const arcLength1 = calculateArcLength(arc1);
    const arcLength2 = calculateArcLength(arc2);

    let totalArea = 0;

    if (document.getElementById('surface1').checked) {
        totalArea += area1;
        const geometry = new THREE.BufferGeometry();
        const verticesArray = new Float32Array(surface1.x.length * surface1.x[0].length * 3);
        let index = 0;
        for (let i = 0; i < surface1.x.length; i++) {
            for (let j = 0; j < surface1.x[i].length; j++) {
                verticesArray[index++] = surface1.x[i][j];
                verticesArray[index++] = surface1.y[i][j];
                verticesArray[index++] = surface1.z[i][j];
            }
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, opacity: 0.5, transparent: true });
        const surface = new THREE.Mesh(geometry, material);
        scene.add(surface);
    }

    document.getElementById('surfaceArea').innerText = `Surface area: ${totalArea.toFixed(2)} m²`;
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;

    // Adding arcs
    const arcMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    
    function addArcToScene(arc) {
        const arcPoints = [];
        for (let i = 0; i < arc.x.length; i++) {
            arcPoints.push(new THREE.Vector3(arc.x[i], arc.y[i], arc.z[i]));
        }
        const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
        const arcLine = new THREE.Line(arcGeometry, arcMaterial);
        scene.add(arcLine);
    }

    addArcToScene(arc1);
    addArcToScene(arc2);
}

