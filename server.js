// static/js/server.js

import { interpolateSurface, calculateSemiAxes, circularArc, halfCircularArc, interpolateSurfaceUntilIntersection } from './model.js';

export async function generateModel() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    let p0 = [0, 0];
    let p1 = [depth, 0];
    let p2 = [depth, width];
    let p3 = [0, width];
    
    let { a, b } = calculateSemiAxes(p0, p1, p2, p3);

    console.log('Current values for 3D Model:', { width, depth, height });

    const arc1 = circularArc([0, 0], [width, depth], height, a, b);
    const arc2 = circularArc([width, 0], [0, depth], height, a, b);
    const arc3 = circularArc([0, 0], [width, depth], height, a, b);
    const arc4 = circularArc([0, depth], [width, 0], height, a, b);
    const arc5 = halfCircularArc([0, 0], [width, depth], height, a, b);
    const arc6 = halfCircularArc([width, 0], [0, depth], height, a, b);
    const arc7 = halfCircularArc([0, 0], [width, depth], height, a, b);
    const arc8 = halfCircularArc([0, depth], [width, 0], height, a, b);

    const surface1 = interpolateSurface(arc1, arc2);
    const surface2 = interpolateSurface(arc3, arc4);
    const surface3 = interpolateSurfaceUntilIntersection(arc5, arc6);
    const surface4 = interpolateSurfaceUntilIntersection(arc7, arc8);

    const payload = {
        width,
        depth,
        height,
        surface1,
        surface2,
        surface3,
        surface4,
        enable_relaxation: true // Always enable relaxation
    };

    // 
    document.getElementById('spinner').style.display = 'block';

    try {
        const response = await fetch('https://interactive-tent-0697ab02fbe0.herokuapp.com/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'models.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        // 
        document.getElementById('spinner').style.display = 'none';
    }
}

export async function generatePattern() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    console.log('Current values for 2D Pattern:', { width, depth, height });

    const arc5 = halfCircularArc([0, 0], [width, depth], height, a, b);
    const arc6 = halfCircularArc([width, 0], [0, depth], height, a, b);
    const arc7 = halfCircularArc([0, 0], [width, depth], height, a, b);
    const arc8 = halfCircularArc([0, depth], [width, 0], height, a, b);

    const surface3 = interpolateSurfaceUntilIntersection(arc5, arc6);
    const surface4 = interpolateSurfaceUntilIntersection(arc7, arc8);

    const payload = {
        width,
        depth,
        height,
        surface3,
        surface4,
        enable_relaxation: true // Always enable relaxation
    };

    // 
    document.getElementById('spinner').style.display = 'block';

    try {
        const response = await fetch('https://interactive-tent-0697ab02fbe0.herokuapp.com/generate_pattern', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Patterns_and_Models.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        // 
        document.getElementById('spinner').style.display = 'none';
    }
}
