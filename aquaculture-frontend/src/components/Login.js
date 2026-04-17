import React,{useState} from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login(){

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const login = async ()=>{

const res = await API.post("/auth/login",{
email,
password
});

if(res.data.user){

localStorage.setItem("user",JSON.stringify(res.data.user));

navigate("/dashboard");

}else{

alert("Invalid login");

}

};

return(

<div className="auth-container">

<div className="auth-card">

<h2>Aquaculture Monitoring</h2>

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

<button
className="btn btn-primary w-100 mb-2"
onClick={login}
>
Login
</button>

<button
className="btn btn-outline-secondary w-100"
onClick={()=>navigate("/register")}
>
Register
</button>

</div>

</div>

);

}

export default Login;