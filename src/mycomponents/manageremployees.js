const { axios } = require("axios");
const { useEffect, useState } = require("react");

function ManagerEmployees({eircode})
{
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get(`http://192.168.1.1:4000/api/employees/${eircode}`)
        .then(response => setEmployees(response.data))
        .catch(err => console.error('Error fetching employees:', err));
    }, [eircode]);

    const deleteEmployee = (id) => {
        axios.delete(`http://192.168.1.1:4000/api/employees/${id}`)
        .then(() => {
            setEmployees(prev => prev.filter(emp => emp.id !== id));
        })
        .catch(err => console.error('Error deleting employee:', err));
    };

    return (
        <div>
            <h2>Employee Settings</h2>
            <ul>
                {employees.map(emp => (
                    <li key={emp.id}>
                        {emp.name} - {emp.role}
                        <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ManagerEmployees;