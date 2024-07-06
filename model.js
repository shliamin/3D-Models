import { calculateArcLength, generateSemiEllipse, calculateDiagonals, linspace, interpolateSurface } from './model-utils.js';

export function updateModel() {
    // Convert values from centimeters to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Calculate the diagonals
    const [diagonal1, diagonal2] = calculateDiagonals(width, depth);

    // Generate semi-ellipses for both diagonals
    const semiEllipse1 = generateSemiEllipse(diagonal1 / 2, height, 100);
    const semiEllipse2 = generateSemiEllipse(diagonal2 / 2, height, 100);
    
    const x_fine1 = semiEllipse1.x;
    const z_fine1 = semiEllipse1.y;
    const x_fine2 = semiEllipse2.x;
    const z_fine2 = semiEllipse2.y;
    const y = linspace(0, depth, 100);

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

    const arc3 = {
        x: x_fine2,
        y: y,
        z: z_fine2,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    const arc4 = {
        x: x_fine2.map(x => -x).reverse(),
        y: y,
        z: z_fine2,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    // Interpolate surfaces
    const surface1 = interpolateSurface(arc1, arc2, 100);
    const surface2 = interpolateSurface(arc3, arc4, 100);

    // Create surface traces
    const surfaceTrace1 = {
        x: surface1.x,
        y: surface1.y,
        z: surface1.z,
        type: 'surface',
        colorscale: [[0, 'cyan'], [1, 'cyan']],
        opacity: 0.3,
        showscale: false 
    };

    const surfaceTrace2 = {
        x: surface2.x,
        y: surface2.y,
        z: surface2.z,
        type: 'surface',
        colorscale: [[0, 'cyan'], [1, 'cyan']],
        opacity: 0.3,
        showscale: false 
    };

    // Scale axes based on arc end points
    const allX = arc1.x.concat(arc2.x, arc3.x, arc4.x);
    const allY = arc1.y.concat(arc2.y, arc3.y, arc4.y);
    const allZ = arc1.z.concat(arc2.z, arc3.z, arc4.z);
    
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const minZ = Math.min(...allZ);
    const maxZ = Math.max(...allZ);

    // Calculate arc lengths
    let arcLength1 = calculateArcLength(arc1);
    let arcLength2 = calculateArcLength(arc2);
    let arcLength3 = calculateArcLength(arc3);
    let arcLength4 = calculateArcLength(arc4);

    // Initialize graph data
    let data = [];

    // Add arcs and surfaces to graph
    data.push(arc1);
    data.push(arc2);
    data.push(arc3);
    data.push(arc4);
    data.push(surfaceTrace1);
    data.push(surfaceTrace2);

    // Update arc lengths
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2 + arcLength3 + arcLength4).toFixed(2)} m`;

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
                range: [minY, maxY]
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
                    x: 1, 
                    y: 0.25, 
                    z: 0.5 
                },
                center: {
                    x: 0, 
                    y: 0,
                    z: 0 
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
