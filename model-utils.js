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
export function findIntersection(arc1, arc2, num_points = 100) {
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


// Function to create half arcs using the logic from createArcs
export function createHalfArc(startCoord, endCoord, height, num_points = 100) {
    // Helper function to generate a linspace array
    function linspace(start, end, num) {
        const step = (end - start) / (num - 1);
        return Array(num).fill().map((_, i) => start + (i * step));
    }

    // Calculate the width and depth based on start and end coordinates
    const width = Math.abs(endCoord[0] - startCoord[0]);
    const depth = Math.abs(endCoord[1] - startCoord[1]);

    // Generate the y and theta values
    const y = linspace(startCoord[1], endCoord[1], num_points);
    const theta = linspace(0, Math.PI / 2, num_points); // Use half of the arc

    // Calculate the x and z coordinates for the arc
    const x_fine = theta.map(t => width / 2 * Math.cos(t));
    const z_fine = theta.map(t => height * Math.sin(t));

    // Create the half arc using positive coordinates
    const halfArc = {
        x: x_fine.map(x => Math.abs(x) + startCoord[0]), // Adjust coordinates to start position
        y: y,
        z: z_fine.map(z => Math.abs(z))
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


// Function to create a linear interval
export function linspace(start, stop, num) {
    const arr = [];
    const step = (stop - start) / (num - 1);
    for (let i = 0; i < num; i++) {
        arr.push(start + step * i);
    }
    return arr;
}

// Function to create a single arc
export function createArc(width, depth, height, mirror = false) {
    const y = linspace(0, depth, 100);
    const theta = linspace(0, Math.PI, 100);

    const x_fine = theta.map(t => width / 2 * Math.cos(t));
    const z_fine = theta.map(t => height * Math.sin(t));

    // Apply mirroring if needed
    const x_final = mirror ? x_fine.map(x => -Math.abs(x)) : x_fine.map(x => Math.abs(x));
    const z_final = z_fine.map(z => Math.abs(z)); // Always ensure positive coordinates

    const arc = {
        x: x_final,
        y: y,
        z: z_final,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    return arc;
}


