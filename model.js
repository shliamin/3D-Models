// model.js

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


// Function to calculate distance between two points
function calculateDistance(p0, p1) {
    return Math.sqrt(Math.pow(p1[0] - p0[0], 2) + Math.pow(p1[1] - p0[1], 2) + Math.pow(p1[2] - p0[2], 2));
}

// New function for calculating circular arc based on oval
export function circularArc(p0, p1, height, num_points = 100) {
    let t = Array.from({ length: num_points }, (_, i) => i / (num_points - 1));
    let arc = { x: [], y: [], z: [] };

    // Midpoint coordinates between p0 and p1
    let midX = (p0[0] + p1[0]) / 2;
    let midY = (p0[1] + p1[1]) / 2;

    // Calculate a and b based on the distance between p0 and p1
    let a = calculateDistance([p0[0], p0[1]], [p1[0], p1[1]]) / 2;
    let b = a;  // Assuming a circular arc, a and b are the same

    t.forEach(val => {
        let angle = Math.PI * val;

        // Arc coordinates calculation based on oval
        let x = midX + a * Math.cos(angle);
        let y = midY + b * Math.sin(angle);  // Use sin for y to differentiate it from x
        let z = height * Math.sin(angle);

        arc.x.push(x);
        arc.y.push(y);
        arc.z.push(z);
    });

    return arc;
}

// New function for calculating half circular arc based on oval
export function halfCircularArc(p0, p1, height, num_points = 100) {
    let t = Array.from({ length: num_points }, (_, i) => i / (num_points - 1));
    let arc = { x: [], y: [], z: [] };
    
    // Midpoint coordinates between p0 and p1
    let midX = (p0[0] + p1[0]) / 2;
    let midY = (p0[1] + p1[1]) / 2;

    // Calculate a and b based on the distance between p0 and p1
    let a = calculateDistance([p0[0], p0[1]], [p1[0], p1[1]]) / 2;
    let b = a;  // Assuming a circular arc, a and b are the same
    
    t.forEach(val => {
        let angle = (Math.PI / 2) * val;  // This ensures we only go from 0 to π/2 (half arc)
        
        // Arc coordinates calculation based on oval
        let x = midX + a * Math.cos(angle);
        let y = midY + b * Math.sin(angle);  // Use sin for y to differentiate it from x
        let z = height * Math.sin(angle);
        
        arc.x.push(x);
        arc.y.push(y);
        arc.z.push(z);
    });

    return arc;
}

// Function to interpolate between two arcs
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

// Function to calculate the surface area
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

            // Calculate area of two triangles forming a quadrilateral
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

// Function to calculate semi-major and semi-minor axes of the ellipse
export function calculateSemiAxes(vertices) {
    let length = Math.sqrt(Math.pow(vertices[1][0] - vertices[0][0], 2) + Math.pow(vertices[1][1] - vertices[0][1], 2));
    let width = Math.sqrt(Math.pow(vertices[3][0] - vertices[0][0], 2) + Math.pow(vertices[3][1] - vertices[0][1], 2));

    let a = length / 2;
    let b = width / 2;

    return { a, b };
}

// Function to update the model
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

    // Calculate semi-major and semi-minor axes
    let { a, b } = calculateSemiAxes(vertices);

    // Draw arcs intersecting at the tent's top vertex using new functions
    let arc1 = circularArc(vertices[0], vertices[3], height, a, b);
    let arc2 = circularArc(vertices[1], vertices[2], height, a, b);
    let arc3 = circularArc(vertices[0], vertices[3], height, a, b);
    let arc4 = circularArc(vertices[2], vertices[1], height, a, b);

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
