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

    // Find the index of the intersection point
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

// Interpolating surfaces with a new function to make sure the interpolation works properly
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

export function updateModel() {
    // Get values in centimeters and convert to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Tent vertices coordinates
    let vertices = [
        [0, 0, 0],         // Bottom front left corner
        [width, 0, 0],     // Bottom front right corner
        [0, depth, 0],     // Bottom back left corner
        [width, depth, 0], // Bottom back right corner
        [width / 2, depth / 2, height]  // Top center point
    ];

    // Draw arcs intersecting at the tent's top vertex
    let arc1 = perfectArc(vertices[0], vertices[3], height);
    let arc2 = perfectArc(vertices[1], vertices[2], height);
    let arc3 = perfectArc(vertices[0], vertices[3], height);
    let arc4 = perfectArc(vertices[2], vertices[1], height);

    // Interpolate to create surface points between arcs
    let surface1 = interpolateSurface(arc1, arc2);
    let surface2a = interpolateSurface(arc3, arc4);

    // Calculate surface areas
    let area1 = calculateSurfaceArea(surface1);
    let area2a = calculateSurfaceArea(surface2a);

    // Calculate arc lengths
    let arcLength1 = calculateArcLength(arc1);
    let arcLength2 = calculateArcLength(arc2);

    // Initialize total area
    let totalArea = 0;

    // Check which surfaces are enabled
    let data = [];
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
        totalArea += area2a;
        data.push({
            x: surface2a.x,
            y: surface2a.y,
            z: surface2a.z,
            type: 'surface',
            colorscale: [[0, 'rgba(255, 0, 0, 0.3)'], [1, 'rgba(255, 0, 0, 0.3)']],
            opacity: 0.7,
            showscale: false
        });
    }

    // Update total surface area and arc lengths
    document.getElementById('surfaceArea').innerText = `Surface area: ${totalArea.toFixed(2)} m²`;
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;

    // Add arcs and edges
    data.push({
        x: arc1.x,
        y: arc1.y,
        z: arc1.z,
        mode: 'lines',
        line: {
            color: 'blue',
            width: 5
        },
        type: 'scatter3d'
    });
    data.push({
        x: arc2.x,
        y: arc2.y,
        z: arc2.z,
        mode: 'lines',
        line: {
            color: 'blue',
            width: 5
        },
        type: 'scatter3d'
    });
    data.push({
        x: [arc1.x[0], arc2.x[0], arc2.x[arc2.x.length - 1], arc1.x[arc1.x.length - 1], arc1.x[0]],
        y: [arc1.y[0], arc2.y[0], arc2.y[arc2.y.length - 1], arc1.y[arc1.y.length - 1], arc1.y[0]],
        z: [arc1.z[0], arc2.z[0], arc2.z[arc2.z.length - 1], arc1.z[arc1.z.length - 1], arc1.z[0]],
        mode: 'lines',
        line: {
            color: 'blue',
            width: 5
        },
        type: 'scatter3d'
    });

    let layout = {
        scene: {
            xaxis: {
                title: 'Width',
                dtick: 0.1  // Grid step for X axis 10 cm
            },
            yaxis: {
                title: 'Depth',
                dtick: 0.1  // Grid step for Y axis 10 cm
            },
            zaxis: {
                title: 'Height',
                dtick: 0.1  // Grid step for Z axis 10 cm
            },
            aspectratio: { x: width, y: depth, z: height },
            camera: {
                eye: {
                    x: 2, // Adjust these values to zoom out
                    y: 1,
                    z: 2
                },
                center: {
                    x: 0.5,  // Move right (positive value)
                    y: 0,
                    z: 0.1 // Move down (negative value)
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
