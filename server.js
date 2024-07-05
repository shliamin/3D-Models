// static/js/server.js

import { interpolateSurface, circularArc, halfCircularArc, interpolateSurfaceUntilIntersection } from './model.js';

export async function generateModel() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    console.log('Current values for 3D Model:', { width, depth, height });

    const arc1 = circularArc([0, 0], [width, depth], height);
    const arc2 = circularArc([width, 0], [0, depth], height);
    const arc3 = circularArc([0, 0], [width, depth], height);
    const arc4 = circularArc([0, depth], [width, 0], height);
    const arc5 = halfCircularArc([0, 0], [width, depth], height);
    const arc6 = halfCircularArc([width, 0], [0, depth], height);
    const arc7 = halfCircularArc([0, 0], [width, depth], height);
    const arc8 = halfCircularArc([0, depth], [width, 0], height);

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

    const arc5 = halfCircularArc([0, 0], [width, depth], height);
    const arc6 = halfCircularArc([width, 0], [0, depth], height);
    const arc7 = halfCircularArc([0, 0], [width, depth], height);
    const arc8 = halfCircularArc([0, depth], [width, 0], height);

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

    document.getElementById('spinner').style.display = 'block';
    document.getElementById('progress').style.display = 'block';
    document.getElementById('progress').textContent = '0%';

    try {
        const response = await fetch('https://interactive-tent-0697ab02fbe0.herokuapp.com/generate_pattern', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 202) {
            const result = await response.json();
            const taskId = result.task_id;
            checkTaskStatus(taskId);
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('progress').style.display = 'none';
    }
}

async function checkTaskStatus(taskId) {
    try {
        const response = await fetch(`https://interactive-tent-0697ab02fbe0.herokuapp.com/status/${taskId}`);
        const result = await response.json();

        if (result.status === 'completed') {
            // Задача завершена, скачать результат
            document.getElementById('progress').textContent = '100%';
            downloadResult(taskId);
        } else if (result.status === 'failed') {
            console.error('Task failed:', result.error);
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('progress').style.display = 'none';
        } else {
            // Обновить прогресс
            const progress = Math.round((result.current / result.total) * 100);
            document.getElementById('progress').textContent = `${progress}%`;
            // Повторная проверка через некоторое время
            setTimeout(() => checkTaskStatus(taskId), 2000); // Повторная проверка каждые 2 секунды
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('progress').style.display = 'none';
    }
}

function downloadResult(taskId) {
    const link = document.createElement('a');
    link.href = `https://interactive-tent-0697ab02fbe0.herokuapp.com/download/${taskId}`;
    link.download = `Patterns_and_Models_${taskId}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    document.getElementById('spinner').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
}
