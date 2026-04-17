import React,{useState} from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register(){

const navigate = useNavigate();

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [mobile,setMobile] = useState("");

const registerUser = async ()=>{

await API.post("/auth/register",{
name,
email,
password,
mobile
});

alert("Registered Successfully");

navigate("/");

};

return(

<div className="auth-container">

<div className="auth-card">

<h2>Register</h2>

<input
placeholder="Name"
className="form-control mb-3"
onChange={(e)=>setName(e.target.value)}
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