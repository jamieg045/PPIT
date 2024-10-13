import React, { useContext } from 'react';
import {useEffect, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LocationContext } from './locationcontext';

function MapComponent()
{
    const [locations, setLocations] = useState([]);
    const [userLocationState, setUserLocationState] = useState(null);
    const navigate = useNavigate();
    const {setSelectedLocation, setUserLocation} = useContext(LocationContext);

    useEffect(() => {
        axios.get('http://192.168.1.1:4000/api/data')
        .then(response => {
            console.log('Locations data:', response.data);
            setLocations(response.data);
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });

        navigator.geolocation.getCurrentPosition(position => {
            const userCoords = [position.coords.latitude, position.coords.longitude];
            setUserLocationState(userCoords);
            setUserLocation(userCoords);
            console.log("Coordinates fetched successfully" + position.coords.latitude, position.coords.longitude)
        }, error => {
            console.error('Error getting user location', error);
        });
    }, [setUserLocation]);

    const handleLocationClick = (location) => {
        console.log('Clicked eircode:', location.Eircode);
        setSelectedLocation(location);
            navigate(`/drinks/${location.Eircode}`);
    };

    return (
        <MapContainer center={userLocationState || [53.7523451, -9.0293420]} zoom={20} style={{ height: "100vh", width: "100%"}}>
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map(location => {
                const customIcon = new L.Icon({
                    iconUrl: location.image_url, // Use the image URL from the location data
                    iconSize: [100, 100], // Adjust the size as needed
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
            {userLocationState && (
                <Marker position={userLocationState}>
                    <Popup>Your Location</Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default MapComponent;