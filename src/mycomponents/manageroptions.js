import React from "react";
import { useNavigate } from "react-router-dom";

function ManagerOptions({eircode})
{
    const navigate = useNavigate();

    return (
        <div>
            <h1>Choose from the following options</h1>
            <button onClick={() => navigate(`/manager-mode`)}>Manager Mode</button>
            <button onClick={() => navigate(`/menu/${eircode}`)}>Server Mode</button>
        </div>
    )
}

export default ManagerOptions;