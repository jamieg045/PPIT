import React from "react";
import { Link } from "react-router-dom";

function ManagerMode()
{
    return (
        <div>
            <h1>Manager Dashboard</h1>
                    <button><Link to="/manage-menu">Menu Settings</Link></button>
                    <br></br>
                    <button><Link to="/manage-employees">Employee Settings</Link></button>
                    <br></br>
                    <button><Link to="/table-plan">Table Plan Settings</Link></button>
                    <br></br>
                    <button><Link to="/location-settings">Location Settings</Link></button>
                    <br></br>
                    <button><Link to="/reports">View Reports</Link></button>
        </div>
    );
}

export default ManagerMode;