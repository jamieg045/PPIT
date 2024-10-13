import { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { IonInfiniteScroll } from "@ionic/react";

function Log()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedin = JSON.parse(sessionStorage.getItem('user'));
        if (isLoggedin && isLoggedin.username)
        {
            const { role, eircode } = isLoggedin;

            if (role === 'customer' || role === 'admin') {
                console.log("User is logged in:", isLoggedin.username);
                navigate('/map');
            } else if (role === 'employee' || role === 'supervisor' || role === 'manager') {
                console.log("User is logged in:", isLoggedin.username);
                navigate(`/drinks/${eircode}`);
            }
        } else {
            console.log("User is not logged in");
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const userData =
        {
            username:username,
            password:password,
        }

        axios.post('http://192.168.1.1:4000/api/login', userData)
        .then((res) => {
            if(res.data.success) {
                sessionStorage.setItem('user', JSON.stringify({
                username: res.data.username,
                role: res.data.role,
                eircode: res.data.eircode
            }));

            // Redirect based on role
            const { role, eircode } = res.data;
            if (role === 'customer' || role === 'admin') {
                window.location.reload();
                navigate('/map');
            } else if (role === 'employee' || role === 'supervisor' || role === 'manager') {
                window.location.reload();
                navigate(`/menu/${eircode}`);
            }
        } else {
            setError(res.data.message);
        }
    })

    .catch((err) => {
        if (err.response) {
            // The request was made and the server responded with a status code
            setError(err.response.data.message || "An unknown error occurred.");
        } else if (err.request) {
            // The request was made but no response was received
            setError("No response from server. Please check your network connection.");
        } else {
            // Something happened in setting up the request that triggered an Error
            setError("Error setting up login request: " + err.message);
        }
    });
}

    

    

    return (
        <div className="mainContainer">
            <h1>Login</h1>
            {error && <div className="errorLabel" style={{color: 'red'}}>{error}</div>}
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
                <div>
                    <Link to="/register">Not a user? Register here.</Link>
                    <br></br>
                    <Link to="/forgot-password">Forgot password? </Link>
                </div>
            </form>

        </div>
    )
}

export default Log;