import * as THREE from './libs/three.js-master/build/three.module.js';

// Define linspace function
function linspace(start, end, num) {
    const step = (end - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + (i * step));
}

// Function to calculate the length of an arc
export function calculateArcLength(arc) {
    let length = 0;
    for (let i = 1; i < arc.x.length; i++) {
        let dx = arc.x[i] - arc.x[i - 1];
        let dy = arc.y[i] - arc.y[i - 1];
        let dz = arc.z[i] - arc.z[i - 1];
        length += Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    return length;
}

// Function to find the first intersection point of two arcs
function findIntersection(arc1, arc2, num_points = 100) {
    for (let i = 0; i < num_points; i++) {
        if (arc1.x[i] === arc2.x[i] && arc1.y[i] === arc2.y[i] && arc1.z[i] === arc2.z[i]) {
            return i;
        }
    }
    return -1; // Returns -1 if there is no intersection
}

// Function to interpolate between two arcs until the first intersection point
export function interpolateSurfaceUntilIntersection(arc1, arc2, num_points = 100) {
    let surface = { x: [], y: [], z: [] };

    let intersectionIndex = findIntersection(arc1, arc2, num_points);
    if (intersectionIndex === -1) {
        intersectionIndex = num_points - 1; // Use all points if there is no intersection
    }

    for (let i = 0; i <= intersectionIndex; i++) {
        let xRow = [];
        let yRow = [];
        let zRow = [];
        
        for (let j = 0; j < num_points; j++) {
            let t = j / (num_points - 1);
            xRow.push((1 - t) * arc1.x[i] + t * arc2.x[i]);
            yRow.push((1 - t) * arc1.y[i] + t * arc2.y[i]);
            zRow.push((1 - t) * arc1.z[i] + t * arc2.z[i]);
        }
        
        surface.x.push(xRow);
        surface.y.push(yRow);
        surface.z.push(zRow);
    }
    
    return surface;
}

export function perfectArc(startCoord, endCoord, height, num_points = 100) {
    const [x0, y0, z0] = startCoord;
    const [x2, y2, z2] = endCoord;
    const width = Math.abs(y2 - y0);
    const theta = linspace(-Math.PI / 2, Math.PI / 2, num_points);
    const x = linspace(x0, x2, num_points);
    const y = theta.map(t => width * Math.sin(t));
    const z = theta.map(t => height * Math.cos(t));

    let arc = {
        x: x,
        y: y.map((yi, i) => yi + (y0 + y2) / 2),
        z: z.map((zi, i) => zi + z0)
    };

    return arc;
}

export function halfPerfectArc(startCoord, endCoord, height, num_points = 100) {
    const fullArc = perfectArc(startCoord, endCoord, height, num_points * 2);
    const halfNumPoints = Math.ceil(fullArc.x.length / 2);

    let halfArc = {
        x: fullArc.x.slice(0, halfNumPoints),
        y: fullArc.y.slice(0, halfNumPoints),
        z: fullArc.z.slice(0, halfNumPoints)
    };

    return halfArc;
}

export function interpolateSurface(arc1, arc2, num_points = 100) {
    let surface = { x: [], y: [], z: [] };

    for (let i = 0; i < num_points; i++) {
        let xRow = [];
        let yRow = [];
        let zRow = [];
        
        for (let j = 0; j < num_points; j++) {
            let t = j / (num_points - 1);
            xRow.push((1 - t) * arc1.x[i] + t * arc2.x[i]);
            yRow.push((1 - t) * arc1.y[i] + t * arc2.y[i]);
            zRow.push((1 - t) * arc1.z[i] + t * arc2.z[i]);
        }
        
        surface.x.push(xRow);
        surface.y.push(yRow);
        surface.z.push(zRow);
    }
    
    return surface;
}

export function calculateSurfaceArea(surface, num_points = 100) {
    let area = 0;

    for (let i = 0; i < num_points - 1; i++) {
        for (let j = 0; j < num_points - 1; j++) {
            let x1 = surface.x[i][j];
            let y1 = surface.y[i][j];
            let z1 = surface.z[i][j];
            let x2 = surface.x[i + 1][j];
            let y2 = surface.y[i + 1][j];
            let z2 = surface.z[i + 1][j];
            let x3 = surface.x[i][j + 1];
            let y3 = surface.y[i][j + 1];
            let z3 = surface.z[i][j + 1];
            let x4 = surface.x[i + 1][j + 1];
            let y4 = surface.y[i + 1][j + 1];
            let z4 = surface.z[i + 1][j + 1];

            let area1 = 0.5 * Math.sqrt(
                Math.pow((y2 - y1) * (z3 - z1) - (z2 - z1) * (y3 - y1), 2) +
                Math.pow((z2 - z1) * (x3 - x1) - (x2 - x1) * (z3 - z1), 2) +
                Math.pow((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1), 2)
            );
            let area2 = 0.5 * Math.sqrt(
                Math.pow((y3 - y4) * (z2 - z4) - (z3 - z4) * (y2 - y4), 2) +
                Math.pow((z3 - z4) * (x2 - x4) - (x3 - x4) * (z2 - z4), 2) +
                Math.pow((x3 - x4) * (y2 - y4) - (y3 - y4) * (x2 - x4), 2)
            );

            area += area1 + area2;
        }
    }

    return area;
}

export function updateModel() {
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    let vertices = [
        [0, 0, 0],
        [width, 0, 0],
        [0, depth, 0],
        [width, depth, 0],
        [width / 2, depth / 2, height]
    ];

    let arc1 = perfectArc(vertices[0], vertices[3], height);
    let arc2 = perfectArc(vertices[1], vertices[2], height);
    let arc3 = perfectArc(vertices[0], vertices[3], height);
    let arc4 = perfectArc(vertices[2], vertices[1], height);

    let surface1 = interpolateSurface(arc1, arc2);
    let surface2a = interpolateSurface(arc3, arc4);

    let area1 = calculateSurfaceArea(surface1);
    let area2a = calculateSurfaceArea(surface2a);

    let arcLength1 = calculateArcLength(arc1);
    let arcLength2 = calculateArcLength(arc2);

    let totalArea = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('tentModel').appendChild(renderer.domElement);

    const surfaceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, opacity: 0.3, transparent: true });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    if (document.getElementById('surface1').checked) {
        totalArea += area1;
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(surface1.x.length * surface1.x[0].length * 3);
        let index = 0;
        for (let i = 0; i < surface1.x.length; i++) {
            for (let j = 0; j < surface1.x[i].length; j++) {
                vertices[index++] = surface1.x[i][j];
                vertices[index++] = surface1.y[i][j];
                vertices[index++] = surface1.z[i][j];
            }
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const surface = new THREE.Mesh(geometry, surfaceMaterial);
        scene.add(surface);
    }

    if (document.getElementById('surface2').checked) {
        totalArea += area2a;
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(surface2a.x.length * surface2a.x[0].length * 3);
        let index = 0;
        for (let i = 0; i < surface2a.x.length; i++) {
            for (let j = 0; j < surface2a.x[i].length; j++) {
                vertices[index++] = surface2a.x[i][j];
                vertices[index++] = surface2a.y[i][j];
                vertices[index++] = surface2a.z[i][j];
            }
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const surface = new THREE.Mesh(geometry, surfaceMaterial);
        scene.add(surface);
    }

    const arc1Geometry = new THREE.BufferGeometry();
    const arc1Vertices = new Float32Array(arc1.x.length * 3);
    for (let i = 0; i < arc1.x.length; i++) {
        arc1Vertices[i * 3] = arc1.x[i];
        arc1Vertices[i * 3 + 1] = arc1.y[i];
        arc1Vertices[i * 3 + 2] = arc1.z[i];
    }
    arc1Geometry.setAttribute('position', new THREE.BufferAttribute(arc1Vertices, 3));
    const arc1Line = new THREE.Line(arc1Geometry, lineMaterial);
    scene.add(arc1Line);

    const arc2Geometry = new THREE.BufferGeometry();
    const arc2Vertices = new Float32Array(arc2.x.length * 3);
    for (let i = 0; i < arc2.x.length; i++) {
        arc2Vertices[i * 3] = arc2.x[i];
        arc2Vertices[i * 3 + 1] = arc2.y[i];
        arc2Vertices[i * 3 + 2] = arc2.z[i];
    }
    arc2Geometry.setAttribute('position', new THREE.BufferAttribute(arc2Vertices, 3));
    const arc2Line = new THREE.Line(arc2Geometry, lineMaterial);
    scene.add(arc2Line);

    const bottomEdgeGeometry = new THREE.BufferGeometry();
    const bottomEdgeVertices = new Float32Array(5 * 3);
    bottomEdgeVertices[0] = arc1.x[0];
    bottomEdgeVertices[1] = arc1.y[0];
    bottomEdgeVertices[2] = arc1.z[0];
    bottomEdgeVertices[3] = arc2.x[0];
    bottomEdgeVertices[4] = arc2.y[0];
    bottomEdgeVertices[5] = arc2.z[0];
    bottomEdgeVertices[6] = arc2.x[arc2.x.length - 1];
    bottomEdgeVertices[7] = arc2.y[arc2.y.length - 1];
    bottomEdgeVertices[8] = arc2.z[arc2.z.length - 1];
    bottomEdgeVertices[9] = arc1.x[arc1.x.length - 1];
    bottomEdgeVertices[10] = arc1.y[arc1.y.length - 1];
    bottomEdgeVertices[11] = arc1.z[arc1.z.length - 1];
    bottomEdgeVertices[12] = arc1.x[0];
    bottomEdgeVertices[13] = arc1.y[0];
    bottomEdgeVertices[14] = arc1.z[0];
    bottomEdgeGeometry.setAttribute('position', new THREE.BufferAttribute(bottomEdgeVertices, 3));
    const bottomEdgeLine = new THREE.Line(bottomEdgeGeometry, lineMaterial);
    scene.add(bottomEdgeLine);

    camera.position.z = 2;
    camera.position.y = 1;
    camera.position.x = 2;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    document.getElementById('surfaceArea').innerText = `Surface area: ${totalArea.toFixed(2)} m²`;
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;
}
