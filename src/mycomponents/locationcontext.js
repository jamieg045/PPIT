import React, {createContext, useState} from "react";

export const LocationContext = createContext();

export const LocationProvider = ({children}) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    return (
        <LocationContext.Provider value={{selectedLocation, setSelectedLocation, userLocation, setUserLocation}}>
            {children}
        </LocationContext.Provider>
    )
}