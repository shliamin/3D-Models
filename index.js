import { updateModel } from './model.js';

document.getElementById('generateModelButton').onclick = () => redirectToPaypalMe(3);
document.getElementById('generatePatternButton').onclick = () => redirectToPaypalMe(10);
document.getElementById('width').onchange = validateAndUpdateModel;
document.getElementById('depth').onchange = validateAndUpdateModel;
document.getElementById('height').onchange = validateAndUpdateModel;
document.getElementById('surface1').onchange = updateModel; // Surface 1
document.getElementById('surface2').onchange = updateModel; // Surface 2

window.onload = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobile) {
        updateModel();
    } else {
        document.querySelector('.mobile-message').style.display = 'block';
    }
};

function validateAndUpdateModel(event) {
    const standardValues = {
        width: 140,
        depth: 230,
        height: 120
    };

    const target = event.target;
    const value = parseInt(target.value);
    let minValue, maxValue;

    switch(target.id) {
        case 'width':
            minValue = standardValues.width * 0.1;
            maxValue = standardValues.width * 2;
            break;
        case 'depth':
            minValue = standardValues.depth * 0.1;
            maxValue = standardValues.depth * 2;
            break;
        case 'height':
            minValue = standardValues.height * 0.1;
            maxValue = standardValues.height * 2;
            break;
        default:
            return;
    }

    if (value < minValue || value > maxValue) {
        showPopup();
        target.value = value < minValue ? minValue : maxValue;
    }

    updateModel();
}

function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    document.body.classList.add('blurred');

    const closeButton = document.getElementById('closePopup');
    closeButton.onclick = function() {
        popup.style.display = 'none';
        document.body.classList.remove('blurred');
        removeBackgroundBlur();
    };

    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
            document.body.classList.remove('blurred');
            removeBackgroundBlur();
        }
    };

    addBackgroundBlur();
}

function addBackgroundBlur() {
    const blurDiv = document.createElement('div');
    blurDiv.classList.add('background-blur');
    blurDiv.id = 'backgroundBlur';
    document.body.appendChild(blurDiv);
}

function removeBackgroundBlur() {
    const blurDiv = document.getElementById('backgroundBlur');
    if (blurDiv) {
        document.body.removeChild(blurDiv);
    }
}

function redirectToPaypalMe(amount) {
    let paypalMeLink = `/pay/${amount}`;
    window.location.href = paypalMeLink;
}
