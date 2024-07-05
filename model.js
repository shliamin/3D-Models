import { 
    linspace, 
    calculateArcLength, 
    calculateSurfaceArea, 
    findIntersection, 
    interpolateSurface, 
    perfectArc, 
    halfPerfectArc, 
    interpolateSurfaceUntilIntersection 
} from './model-utils.js';

// model.js

export function updateModel() {
    // Get values in centimeters
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    // Validate input values
    if (isNaN(width) || isNaN(depth) || isNaN(height)) {
        alert('Please enter valid numbers for width, depth, and height.');
        return;
    }

    // Create or select a canvas and set its context
    let canvas = document.getElementById('tentCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'tentCanvas';
        canvas.width = 500;
        canvas.height = 500;
        document.body.appendChild(canvas);
    }
    const context = canvas.getContext('2d', { willReadFrequently: true });

    // Drawing on the canvas
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing
    context.fillStyle = 'lightblue';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'red';
    context.beginPath();
    context.arc(250, 250, 100, 0, Math.PI * 2, true); // Drawing a red circle as a placeholder
    context.fill();

    // Tent vertices coordinates
    const vertices = [
        [0, 0, 0],         // Bottom front left corner
        [width, 0, 0],     // Bottom front right corner
        [0, depth, 0],     // Bottom back left corner
        [width, depth, 0], // Bottom back right corner
        [width / 2, depth / 2, height]  // Top center point
    ];

    // Draw arcs intersecting at the tent's top vertex
    const arc1 = perfectArc(vertices[0], vertices[4], height);
    const arc2 = perfectArc(vertices[1], vertices[4], height);
    const arc3 = perfectArc(vertices[2], vertices[4], height);
    const arc4 = perfectArc(vertices[3], vertices[4], height);

    // Interpolate to create surface points between arcs
    const surface1 = interpolateSurface(arc1, arc2);
    const surface2 = interpolateSurface(arc3, arc4);

    // Calculate surface areas
    const area1 = calculateSurfaceArea(surface1);
    const area2 = calculateSurfaceArea(surface2);

    // Calculate arc lengths
    const arcLength1 = calculateArcLength(arc1);
    const arcLength2 = calculateArcLength(arc2);
    const arcLength3 = calculateArcLength(arc3);
    const arcLength4 = calculateArcLength(arc4);

    // Initialize total area
    let totalArea = 0;

    // Check which surfaces are enabled
    const data = [];
    if (document.getElementById('surface1').checked) {
        totalArea += area1;
        data.push({
            x: surface1.x,
            y: surface1.y,
            z: surface1.z,
            type: 'surface',
            colorscale: [[0, 'rgba(0, 255, 255, 0.3)'], [1, 'rgba(0, 255, 255, 0.3)']],
            opacity: 0.7,
            showscale: false
        });
    }
    if (document.getElementById('surface2').checked) {
        totalArea += area2;
        data.push({
            x: surface2.x,
            y: surface2.y,
            z: surface2.z,
            type: 'surface',
            colorscale: [[0, 'rgba(255, 0, 0, 0.3)'], [1, 'rgba(255, 0, 0, 0.3)']],
            opacity: 0.7,
            showscale: false
        });
    }

    // Update total surface area and arc lengths
    document.getElementById('surfaceArea').innerText = `Surface area: ${totalArea.toFixed(2)} cm²`;
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2 + arcLength3 + arcLength4).toFixed(2)} cm`;

    // Add arcs and edges
    const arcs = [arc1, arc2, arc3, arc4];
    arcs.forEach((arc) => {
        data.push({
            x: arc.x,
            y: arc.y,
            z: arc.z,
            mode: 'lines',
            line: {
                color: 'blue',
                width: 5
            },
            type: 'scatter3d'
        });
    });

    data.push({
        x: [vertices[0][0], vertices[1][0], vertices[3][0], vertices[2][0], vertices[0][0]],
        y: [vertices[0][1], vertices[1][1], vertices[3][1], vertices[2][1], vertices[0][1]],
        z: [vertices[0][2], vertices[1][2], vertices[3][2], vertices[2][2], vertices[0][2]],
        mode: 'lines',
        line: {
            color: 'blue',
            width: 5
        },
        type: 'scatter3d'
    });

    const allX = arcs.flatMap(arc => arc.x);
    const allY = arcs.flatMap(arc => arc.y);
    const allZ = arcs.flatMap(arc => arc.z);

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const minZ = Math.min(...allZ);
    const maxZ = Math.max(...allZ);

    // Create the layout with more tick marks and centered object
    const layout = {
        scene: {
            xaxis: {
                title: 'Width',
                range: [minX - 10, maxX + 10],  // Adding a margin for better visualization
                dtick: 10  // 10 cm ticks
            },
            yaxis: {
                title: 'Depth',
                range: [minY - 10, maxY + 10],  // Adding a margin for better visualization
                dtick: 10  // 10 cm ticks
            },
            zaxis: {
                title: 'Height',
                range: [minZ - 10, maxZ + 10],  // Adding a margin for better visualization
                dtick: 10  // 10 cm ticks
            },
            aspectratio: { x: width, y: depth, z: height },
            camera: {
                eye: {
                    x: 1.5,
                    y: 1.5,
                    z: 1.5
                },
                center: {
                    x: (minX + maxX) / 2,
                    y: (minY + maxY) / 2,
                    z: (minZ + maxZ) / 2
                }
            }
        },
        legend: {
            y: -0.2,
            yanchor: 'top'
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        }
    };

    Plotly.newPlot('tentModel', data, layout);
}
