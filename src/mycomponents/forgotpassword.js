import {useState} from "react";
import axios from 'axios';


function ForgotPassword()
{
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://192.168.1.1:4000/api/forgot-password', {email})
        .then((res) => {
            setMessage(res.data.message);
        })
        .catch((err) => {
            setMessage("Error: "+ err.response.data.message);
        });
    };

    return (
        <div>
            <h1>Forgot password</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <br></br>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
export default ForgotPassword;