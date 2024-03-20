import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Log()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const userData =
        {
            username:username,
            password:password,
        }

        axios.post('http://localhost:4000/api/login', userData)
        .then((res) => {
            if(res.data.success) {
                navigate('/menu');
            } else{
                setError(res.data.message);
            }
    })
        .catch((err) => console.log(err.data));
        setError('An error occured while logging in. Please try again.');
    }

    return (
        <div className="mainContainer">
            <h1>Login</h1>
            {error && <div className="errorLabel">{error}</div>}
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
                <div className="inputContainer">
                <input className={'inputButton'} type="submit" value="Log in"></input>
                </div>
            </form>

        </div>
    )
}

export default Log;