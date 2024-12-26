import React from 'react';

function TakeOrBookPrompt({ onProceed, onClose, location }) {
    if (!location) {
        console.error('TakeOrBookPrompt: location is undefined');
        return null;
    }

    console.log('TakeOrBookPrompt location:', location);

    const modalStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1050,
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)'
    };

    const backdropStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1040
    };

    return (
        <div style={backdropStyle}>
            <div style={modalStyle}>
                <h2>{`Welcome to ${location.LocationName}`}</h2>
                <p>Choose from the following options:</p>
                <div>
                    {location.takeaway_enabled && (
                        <button onClick={() => onProceed('takeaway')} className="btn btn-primary">
                            Takeaway
                        </button>
                    )}
                    {location.bookings_enabled && (
                        <button onClick={() => onProceed('booking')} className="btn btn-secondary">
                            Table Booking
                        </button>
                    )}
                </div>
                <button onClick={onClose} className="btn btn-danger">
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default TakeOrBookPrompt;