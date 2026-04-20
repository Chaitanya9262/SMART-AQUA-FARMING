import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

const navigate = useNavigate();

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const login = async () => {

try {

const res = await API.post("/auth/login", {
    username,
    password
});

if (res.data.user) {

localStorage.setItem("user", JSON.stringify(res.data.user));

navigate("/home");

} else {

alert("Invalid login");

}

} catch (err) {
alert("Login failed");
}

};

return (

<div className="auth-container">

<div className="auth-card">

<h2>Aquaculture Monitoring</h2>

<input
placeholder="Username"
className="form-control mb-3"
onChange={(e)=>setUsername(e.target.value)}
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