import { generateSemiEllipse, generateHalfSemiEllipse, interpolateSurface, calculateDiagonals, linspace, findIntersection } from './model-utils.js';

function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

async function checkPromoCode() {
    const promoCode = document.getElementById('promoCode').value;
    showSpinner();
    try {
        const response = await fetch('https://interactive-tent-0697ab02fbe0.herokuapp.com/check_promo_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ promo_code: promoCode })
        });

        const data = await response.json();
        hideSpinner();
        if (data.status === 'success') {
            handlePaymentWithoutPayPal(data.amount);
        } else {
            alert('Invalid promo code.');
        }
    } catch (error) {
        hideSpinner();
        console.error('There was an error checking the promo code:', error);
        alert('There was an error checking the promo code. Please try again.');
    }
}

function handlePaymentWithoutPayPal(amount) {
    if (amount == 3) {
        generateModel();
    } else if (amount == 10) {
        generatePattern();
    }
}

function redirectToPaypalMe(amount) {
    showSpinner();
    let paypalMeLink = `https://www.paypal.me/efimsh/${amount}`;
    window.location.href = paypalMeLink;
}

export async function generateModel() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    console.log('Current values for 3D Model:', { width, depth, height });

    const numPoints = 100;

    const { lengths: [diagonal1, diagonal2], endCoordinates: [endCoord1Start, endCoord1End, endCoord2Start, endCoord2End] } = calculateDiagonals(width, depth);

    const semiEllipse1 = generateSemiEllipse(diagonal1 / 2, height, 100);
    const semiEllipse2 = generateSemiEllipse(diagonal2 / 2, height, 100);

    const x_fine1 = semiEllipse1.x;
    const z_fine1 = semiEllipse1.y;
    const x_fine2 = semiEllipse2.x;
    const z_fine2 = semiEllipse2.y;
    const y = linspace(0, depth, 100);

    const apex = { x: x_fine1[0], y: y[0], z: z_fine1[0] };

    const arc1 = {
        x: x_fine1,
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 1'
    };

    const arc2 = {
        x: x_fine1.map(x => -x),
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 2'
    };

    const arc3 = {
        x: [...arc1.x].reverse(),
        y: [...arc1.y].reverse(),
        z: [...arc1.z].reverse(),
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        visible: false
    };

    const surface1 = interpolateSurface(arc1, arc2, 100);
    const surface2 = interpolateSurface(arc2, arc3, 100);

    const surface3 = interpolateSurface(arc1, arc2, 100, 5, true);
    const surface4 = interpolateSurface(arc2, arc3, 100, 5, true);

    const payload = {
        width,
        depth,
        height,
        surface1,
        surface2,
        surface3,
        surface4,
        enable_relaxation: true
    };

    console.log('Sending payload for 3D Model:', payload);

    showSpinner();

    try {
        const response = await fetch('https://interactive-tent-0697ab02fbe0.herokuapp.com/generate_model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log('3D Model file successfully sent to server.');

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
        hideSpinner();
    }
}

export async function generatePattern() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    console.log('Current values for 2D Pattern:', { width, depth, height });

    const numPoints = 100;

    const { lengths: [diagonal1, diagonal2] } = calculateDiagonals(width, depth);

    const semiEllipse1 = generateSemiEllipse(diagonal1 / 2, height, 100);
    const semiEllipse2 = generateSemiEllipse(diagonal2 / 2, height, 100);

    const x_fine1 = semiEllipse1.x;
    const z_fine1 = semiEllipse1.y;
    const x_fine2 = semiEllipse2.x;
    const z_fine2 = semiEllipse2.y;
    const y = linspace(0, depth, 100);

    const apex = { x: x_fine1[0], y: y[0], z: z_fine1[0] };

    const arc1 = {
        x: x_fine1,
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 1'
    };

    const arc2 = {
        x: x_fine1.map(x => -x),
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 2'
    };

    const arc3 = {
        x: [...arc1.x].reverse(),
        y: [...arc1.y].reverse(),
        z: [...arc1.z].reverse(),
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        visible: false
    };

    const surface3 = interpolateSurface(arc1, arc2, 100, 5, true);
    const surface4 = interpolateSurface(arc2, arc3, 100, 5, true);

    const payload = {
        width,
        depth,
        height,
        surface3,
        surface4,
        enable_relaxation: true
    };

    console.log('Sending payload for 2D Pattern:', payload);

    showSpinner();

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

        console.log('2D Pattern file successfully sent to server.');

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
        hideSpinner();
    }
}

// Прикрепляем обработчики событий
document.getElementById('generateModelButton').onclick = () => {
    const promoCode = prompt('Enter promo code if you have one, or leave blank for payment.');
    if (promoCode) {
        checkPromoCode();
    } else {
        redirectToPaypalMe(3);
    }
};

document.getElementById('generatePatternButton').onclick = () => {
    const promoCode = prompt('Enter promo code if you have one, or leave blank for payment.');
    if (promoCode) {
        checkPromoCode();
    } else {
        redirectToPaypalMe(10);
    }
};
