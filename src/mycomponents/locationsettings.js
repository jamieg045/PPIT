import { useState, useEffect } from "react";
import axios from "axios";

function LocationSettings({ eircode }) {
    const [location, setLocation] = useState({});

    useEffect(() => {
        axios.get(`http://192.168.1.1:4000/api/data/${eircode}`)
            .then(response => setLocation(response.data))
            .catch(err => console.error('Error fetching location settings:', err));
    }, [eircode]);

    const updateLocation = () => {
        axios.put(`http://192.168.1.1:4000/api/data`, location)
            .then(() => alert('Location updated'))
            .catch(err => console.error('Error updating location:', err));
    };

    return (
        <div>
            <h2>Location Settings</h2>
            <input 
                type="text" 
                value={location.name || ''} 
                onChange={(e) => setLocation({ ...location, name: e.target.value })}
            />
            <button onClick={updateLocation}>Update</button>
        </div>
    );
}

export default LocationSettings;