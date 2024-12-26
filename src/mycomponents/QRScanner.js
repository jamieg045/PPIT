import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

function QRScanner() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleScan = (result) => {
        if (result) {
            try {
                const url = new URL(result);
                const tableNumber = url.searchParams.get('table');
                const eircode = sessionStorage.getItem('eircode'); // Retrieve eircode from sessionStorage

                if (tableNumber && eircode) {
                    // Save table number to sessionStorage
                    sessionStorage.setItem('tableNumber', tableNumber);

                    // Redirect to the drinks page for the specific eircode
                    navigate(`/drinks/${eircode}`);
                } else {
                    setErrorMessage('Invalid QR Code: Table number or eircode not found.');
                }
            } catch (error) {
                setErrorMessage('Invalid QR code format.');
            }
        }
    };

    const handleError = (err) => {
        console.error('QR Scan Error:', err);
        setErrorMessage('QR Scanner encountered an error');
    };

    return (
        <div>
            <h2>Scan your Table QR Code</h2>
            <QrReader
                delay={300}
                onResult={(result, error) => {
                    if (result) handleScan(result?.text);
                    if (error) handleError(error);
                }}
                style={{ width: '100%' }}
            />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default QRScanner;