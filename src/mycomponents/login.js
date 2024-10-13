import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    //const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        //console.log("Username:" + username + "Role" + role);

        const users =
        {
            username: username,
            email: email,
            password: password,
            role: 'customer',
        }

        axios.post('http://192.168.1.1:4000/api/users', users)
            .then((res) => {
                if (res.data.success) {
                    setSuccess('Registration successful. Please check your email for confirmation.');
                    setError('');
                    navigate('/');
                } else {
                    setError(res.data.message);
                }
            })
            .catch((err) => {
                if (err.response) {
                    setError(err.response.data.message || "An Unknown Error occured");
                } else if (err.request) {
                    setError("No response from server. Please check your network connection");
                } else {
                    setError("Error setting up request:" + err.message);
                }
            })
    }

    return (
        <div className="mainContainer">
            <h1>Registration</h1>
            {error && <div className="errorLabel" style={{ color: 'red' }}>{error}</div>}
            {success && <div className="successLabel" style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className={'inputContainer'}>
                    <label>Username: </label>
                    <input type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                    />
                </div>
                <div className="inputContainer">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={'inputContainer'}>
                    <label>User Password: </label>
                    <input type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                </div>
                <div className="inputContainer">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
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