import {useState, useContext} from 'react'
import {FaSignInAlt} from 'react-icons/fa'
import axios from "axios"
import {useNavigate} from "react-router-dom"

import {AuthChecker} from "../helpers/AuthChecker";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // get the setAuth function in App.js from authCheck
    const {setAuth} = useContext(AuthChecker);

    let navigate = useNavigate();

    const login = () => {

        const data = {
            "email": email,
            "password": password
        }
        axios.post("http://localhost:5000/api/users/login", data).then((response) => {
            if (response.data.error)
            {
                alert(response.data.error);
                console.log("Could not sign in...");
            }
            else
            {
                console.log("Signed in...");
                localStorage.setItem("accessToken", response.data.token);
                setAuth(true);
                
                navigate("/");
            }
        })
    }
    return (
        <div>
            <section className='heading'>
                <h1>
                    <FaSignInAlt/> Login
                </h1>
            </section>
            <input type="text" placeholder="Email" onChange={(event) => {setEmail(event.target.value)}}/>
            <input type="password" placeholder="Password" onChange={(event)=>{setPassword(event.target.value)}}/>
            <button onClick={login}>Login</button>
        </div>
    )
}

export default Login