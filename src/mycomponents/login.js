import { useState } from "react";
import axios from 'axios';

function Login()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [role_id, setRoleId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log( "Username:"+ username+"Role"+ role+"Role ID"+ role_id);

        const users =
        {
            username:username,
            password:password,
            role: role,
            role_id: role_id
        }

        axios.post('http://localhost:4000/api/users', users)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.data));
    }

    return (
        <div>
            <h1>Insert Username</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username: </label>
                    <input type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value)}}
                    />
                </div>
                <div className="form-group">
                    <label>User Password: </label>
                    <input type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    />
                </div>
                <div className="form-group">
                    <label>User Role: </label>
                    <input type="text"
                    className="form-control"
                    value={role}
                    onChange={(e) => {setRole(e.target.value)}}
                    />
                </div>
                <div className="form-group">
                    <label>User Role ID: </label>
                    <input type="text"
                    className="form-control"
                    value={role_id}
                    onChange={(e) => {setRoleId(e.target.value)}}
                    />
                </div>
                <input type="submit" value="Add User"></input>
            </form>

        </div>
    )
}

export default Login;