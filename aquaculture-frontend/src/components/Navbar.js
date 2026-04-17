import React from "react";

function Navbar(){

const logout=()=>{
localStorage.removeItem("user");
window.location="/";
};

return(

<div className="navbar">

<h2>🦐 Shrimp Monitoring</h2>

<button className="logoutBtn" onClick={logout}>
Logout
</button>

</div>

);

}

export default Navbar;