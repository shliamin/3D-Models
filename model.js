import { calculateArcLength, generateSemiEllipse3DFromPoints, calculateDiagonals, linspace } from './model-utils.js';

export function updateModel() {
    // Convert values from centimeters to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Calculate the four corners of the tent's base
    const point1 = {
        x: -width / 2,
        y: -depth / 2,
        z: 0
    };
    
    const point2 = {
        x: width / 2,
        y: -depth / 2,
        z: 0
    };
    
    const point3 = {
        x: width / 2,
        y: depth / 2,
        z: 0
    };
    
    const point4 = {
        x: -width / 2,
        y: depth / 2,
        z: 0
    };

    // Calculate the apex point at the top center of the tent
    const apexPoint = {
        x: 0,
        y: 0,
        z: height
    };


    // Generate semi-ellipses for both diagonals
    //const semiEllipse1 = generateSemiEllipse(point1, point3, apexPoint, 100);
    //const semiEllipse2 = generateSemiEllipse(point2, point4, apexPoint, 100);
    
    const x_fine1 = semiEllipse1.x;
    const z_fine1 = semiEllipse1.y;
    const x_fine2 = semiEllipse2.x;
    const z_fine2 = semiEllipse2.y;
    const y = linspace(0, depth, 100);

    console.log(`x_fine1: ${x_fine1}, z_fine1: ${z_fine1}`);
    console.log(`x_fine2: ${x_fine2}, z_fine2: ${z_fine2}`);
    console.log(`y: ${y}`);

    // Validate arc data
    if (!Array.isArray(x_fine1) || !Array.isArray(z_fine1) || !Array.isArray(x_fine2) || !Array.isArray(z_fine2) || !Array.isArray(y)) {
        console.error("Error in arc data.");
        return;
    }

    // Create arcs
    const arc1 = {
        x: x_fine1,
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };
    
    const arc2 = {
        x: x_fine1.map(x => -x),
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    console.log(`arc1: ${arc1}, arc2: ${arc2}`);
    
    // Scale axes based on arc end points
    const allX = arc1.x.concat(arc2.x);
    const allY = arc1.y.concat(arc2.y);
    const allZ = arc1.z.concat(arc2.z);
    
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const minZ = Math.min(...allZ);
    const maxZ = Math.max(...allZ);

    console.log(`X range: [${minX}, ${maxX}], Y range: [${minY}, ${maxY}], Z range: [${minZ}, ${maxZ}]`);

    // Calculate arc lengths
    let arcLength1 = calculateArcLength(arc1);
    let arcLength2 = calculateArcLength(arc2);

    console.log(`Arc lengths: ${arcLength1}, ${arcLength2}`);

    // Initialize graph data
    let data = [];

    // Add arcs to graph
    data.push(arc1);
    data.push(arc2);

    // Update arc lengths
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;

    let layout = {
        scene: {
            xaxis: {
                title: 'Width',
                dtick: 0.1, // Grid step on X axis 10 cm
                range: [minX, maxX]
            },
            yaxis: {
                title: 'Depth',
                dtick: 0.1, // Grid step on Y axis 10 cm
                range: [0, depth]
            },
            zaxis: {
                title: 'Height',
                dtick: 0.1, // Grid step on Z axis 10 cm
                range: [minZ, maxZ]
            },
            aspectratio: {
                x: width / Math.max(width, depth, height),
                y: depth / Math.max(width, depth, height),
                z: height / Math.max(width, depth, height)
            },
            camera: {
                eye: {
                    x: 2, // Adjust these values to zoom out the camera
                    y: 1,
                    z: 2
                },
                center: {
                    x: 0.5, // Shift right (positive value)
                    y: 0,
                    z: 0.1 // Shift down (negative value)
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
