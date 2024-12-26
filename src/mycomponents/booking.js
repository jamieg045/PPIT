import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Booking() {
    const [settings, setSettings] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [specialRequirements, setSpecialRequirements] = useState('');
    const [locationName, setLocationName] = useState('');
    const { eircode } = useParams();

    useEffect(() => {
        axios.get(`http://192.168.1.1:4000/api/manager-settings/${eircode}`)
            .then(response => {
                setSettings(response.data);
            })
            .catch(err => {
                console.error('Error fetching manager settings:', err);
            });
    }, [eircode]);

    useEffect(() => {
        if (eircode) {
          // Fetch location name based on eircode
          axios
            .get(`http://192.168.1.1:4000/api/data/${eircode}`)
            .then((response) => {
              setLocationName(response.data.LocationName);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }, [eircode]);

    if (!settings) {
        return <p>Loading settings...</p>;
    }

    return (
        <div>
            <h1>Booking for {locationName}</h1>
            <form>
                <div>
                    <label>Available Time Slots:</label>
                    <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                        <option value="">Select a time</option>
                        {settings.slot_times.map((time, index) => (
                            <option key={index} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Customer Name:</label>
                    <input 
                        type="text" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Contact Number:</label>
                    <input 
                        type="text" 
                        value={contactNumber} 
                        onChange={(e) => setContactNumber(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Special Requirements:</label>
                    <textarea 
                        value={specialRequirements} 
                        onChange={(e) => setSpecialRequirements(e.target.value)} 
                    />
                </div>
                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    );
}

export default Booking;