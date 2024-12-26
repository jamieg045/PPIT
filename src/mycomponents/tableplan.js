import { useState, useEffect } from "react";
import axios from "axios";

function TablePlan({ eircode }) {
    const [tablePlan, setTablePlan] = useState([]);

    useEffect(() => {
        axios.get(`http://192.168.1.1:4000/api/table-plan/${eircode}`)
            .then(response => setTablePlan(response.data))
            .catch(err => console.error('Error fetching table plan:', err));
    }, [eircode]);

    const saveTablePlan = () => {
        axios.post(`http://192.168.1.1:4000/api/table-plan`, { eircode, tablePlan })
            .then(() => alert('Table plan saved'))
            .catch(err => console.error('Error saving table plan:', err));
    };

    return (
        <div>
            <h2>Table Plan</h2>
            {/* Display table plan configuration here */}
            <button onClick={saveTablePlan}>Save</button>
        </div>
    );
}

export default TablePlan;