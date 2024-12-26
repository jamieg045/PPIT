import React, { useContext } from 'react';
import {useEffect, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LocationContext } from './locationcontext';
import TakeOrBookPrompt from './takeorbookprompt';

function SetUserLocation({userLocation})
{
    const map = useMap();
    useEffect(() => {
        if(userLocation)
        {
            map.setView(userLocation, 15);
        }
    }, [userLocation, map]);
    return null;
}

function MapComponent()
{
    const [locations, setLocations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const navigate = useNavigate();
    const {setSelectedLocation: setContextLocation} = useContext(LocationContext);


    useEffect(() => {
        axios.get('http://192.168.1.1:4000/api/data')
        .then(response => {
            console.log('Locations data:', response.data);
            setLocations(response.data);
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });

        navigator.geolocation.getCurrentPosition((position) => {
            const userCoords = [position.coords.latitude, position.coords.longitude];
            setUserLocation(userCoords);
            console.log("Coordinates fetched successfully" + position.coords.latitude, position.coords.longitude)
        }, 
        (error) => {
            console.error('Error getting user location', error);
        },
        {
            enableHighAccuracy: true,
            timeout:5000,
            maximumAge: 0,
        }
    );
    }, []);

    const handleLocationClick = (location) => {
        console.log('Clicked eircode:', location.Eircode);
        setContextLocation(location);
        setSelectedLocation(location);
        if(location.takeaway_enabled || location.bookings_enabled)
        {
            setShowPrompt(true);
        } else {
            console.log('This location does not support takeaway or booking');
            setTimeout(() => {
                navigate(`/menu/${location.Eircode}`);
            }, 0);
            
        }
        // navigate(`/scan-qr/${location.Eircode}');
    };

    const handleModalClose = () => {
        setShowPrompt(false);
    };

    return (
        <div>
        <MapContainer center={userLocation || [53.7523451, -9.0293420]} zoom={20} style={{ height: "100vh", width: "100%"}}>
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userLocation && <SetUserLocation userLocation={userLocation}/>}


            {locations.map(location => {
                const customIcon = new L.Icon({
                    iconUrl: location.image_url, // Use the image URL from the location data
                    iconSize: [30, 30], // Adjust the size as needed
                    iconAnchor: [19, 38], // The point of the icon which will correspond to marker's location
                    popupAnchor: [0, -38] // The point from which the popup should open relative to the iconAnchor
                });

                return (
                <Marker
                key={location.location_id}
                position={[location.latitude, location.longitude]}
                icon={customIcon}
                eventHandlers={{
                    click: () => {
                    handleLocationClick(location);
                },
            }}
            >
                <Popup>
                    {location.LocationName}
                </Popup>
            </Marker>
            );
        })}
            {/* {userLocationState && (
                <Marker position={userLocationState}>
                    <Popup>Your Location</Popup>
                </Marker>
            )} */}
        </MapContainer>
        {showPrompt && selectedLocation && (
            <TakeOrBookPrompt
            location={selectedLocation}
            onClose={handleModalClose}
            onProceed={(type) => {
                setContextLocation(selectedLocation);
                setShowPrompt(false);
                if(type === 'takeaway')
                {
                    sessionStorage.setItem('Takeaway', 'True');
                    navigate(`/menu/${selectedLocation.Eircode}?type=takeaway`);
                } else if (type === 'booking')
                {
                    sessionStorage.setItem('Takeaway', 'False');
                    navigate(`/booking/${selectedLocation.Eircode}`);
                } else
                {
                    sessionStorage.setItem('Takeaway', 'False');
                }
            }}
            />
        )}
        </div>
    );
};

export default MapComponent;