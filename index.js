import { updateModel } from './model.js';
import { generateModel, generatePattern } from './server.js';

document.getElementById('generateModelButton').onclick = async () => {
    const amount = 3;
    const description = "3D Models";

    await handlePayment(amount, description, generateModel);
};

document.getElementById('generatePatternButton').onclick = async () => {
    const amount = 10;
    const description = "Patterns";

    await handlePayment(amount, description, generatePattern);
};

document.getElementById('width').onchange = updateModel;
document.getElementById('depth').onchange = updateModel;
document.getElementById('height').onchange = updateModel;
document.getElementById('surface1').onchange = updateModel;
document.getElementById('surface2').onchange = updateModel;

window.onload = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobile) {
        updateModel();
    } else {
        document.querySelector('.mobile-message').style.display = 'block';
    }
};

async function handlePayment(amount, description, callback) {
    try {
        const response = await fetch('/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount, description })
        });

        const data = await response.json();

        if (response.ok) {
            await paypalPayment(data.paymentID, callback);
        } else {
            console.error('Error creating payment:', data.error);
        }
    } catch (error) {
        console.error('Error handling payment:', error);
    }
}

async function paypalPayment(paymentID, callback) {
    paypal.Buttons({
        createOrder: () => paymentID,
        onApprove: async (data) => {
            try {
                const response = await fetch('/execute-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentID: data.paymentID,
                        payerID: data.payerID
                    })
                });

                const details = await response.json();

                if (response.ok) {
                    alert('Transaction completed by ' + details.payer.name.given_name);
                    callback();
                } else {
                    console.error('Error executing payment:', details.error);
                }
            } catch (error) {
                console.error('Error on approval:', error);
            }
        }
    }).render('#paypal-button-container');
}
