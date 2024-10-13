import {useState} from "react";
import axios from 'axios';
import {useParams, useNavigate} from "react-router-dom";

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const {token} = useParams();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(password !== confirmPassword)
        {
            setMessage("Passwords do not match");
            return;
        }

        axios.post(`http://192.168.1.1:4000/api/reset-password/${token}`, { password })
            .then((res) => {
                setMessage(res.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            })
            .catch((err) => {
                setMessage("Error: "+ err.response.data.message);
            });
        };

        return (
            <div>
                <h1>Reset Password</h1>
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>New Password: </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />                      
                    </div>
                    <div>
                        <label>Confirm Password: </label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        )
    }
    
    export default ResetPassword;