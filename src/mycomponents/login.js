import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log( "Username:"+ username+"Role"+ role);

        const users =
        {
            username:username,
            password:password,
            role: role,
        }

        axios.post('http://192.168.1.1:4000/api/users', users)
        .then((res) => {
        console.log(res.data);
        navigate('/');
    })
        .catch((err) => console.log(err.data));
    }

    return (
        <div className="mainContainer">
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <div className={'inputContainer'}>
                    <label>Username: </label>
                    <input type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value)}}
                    />
                </div>
                <div className={'inputContainer'}>
                    <label>User Password: </label>
                    <input type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    />
                </div>
                <div className={'inputContainer'}>
                    <label>User Role: </label>
                    <label>Customer, Employee, Supervisor, Manager, Admin</label>
                    <input type="text"
                    className="form-control"
                    value={role}
                    onChange={(e) => {setRole(e.target.value)}}
                    />
                </div>
                <div className="inputContainer">
                <input className={'inputButton'} type="submit" value="Add User"></input>
                </div>
            </form>

        </div>
    )
}

export default Login;