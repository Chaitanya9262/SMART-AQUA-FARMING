import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register(){

const navigate = useNavigate();

const [username,setUsername] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");
const [mobile,setMobile] = useState("");

const registerUser = async () => {

    if(password !== confirmPassword){
        alert("Passwords do not match");
        return;
    }

    try {

        await API.post("/auth/register", {
            username,
            email,
            password,
            confirmPassword,
            mobile
        });

        alert("Registered Successfully");
        navigate("/");

    } catch (err) {

        console.log("ERROR:", err.response?.data);
        alert(err.response?.data?.message || "Registration failed");

    }
};

return(

<div className="auth-container">

<div className="auth-card">

<h2>Register</h2>

<input
placeholder="Username"
className="form-control mb-3"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
placeholder="Email"
className="form-control mb-3"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="form-control mb-3"
onChange={(e)=>setPassword(e.target.value)}
/>

<input
type="password"
placeholder="Confirm Password"
className="form-control mb-3"
onChange={(e)=>setConfirmPassword(e.target.value)}
/>

<input
placeholder="Mobile Number"
className="form-control mb-3"
onChange={(e)=>setMobile(e.target.value)}
/>

<button
className="btn btn-success w-100"
onClick={registerUser}
>
Register
</button>

</div>

</div>

);

}

export default Register;