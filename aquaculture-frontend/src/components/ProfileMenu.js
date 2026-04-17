import React, { useState, useRef, useEffect } from "react";

function ProfileMenu() {

const [open, setOpen] = useState(false);
const [edit, setEdit] = useState(false);

const user = JSON.parse(localStorage.getItem("user"));

const [name, setName] = useState(user?.name);
const [email, setEmail] = useState(user?.email);
const [image, setImage] = useState(user?.image);
const [mobile,setMobile] = useState(user?.mobile);

const menuRef = useRef();

// Close dropdown when clicking outside
useEffect(() => {
const handleClickOutside = (e) => {
if (menuRef.current && !menuRef.current.contains(e.target)) {
setOpen(false);
}
};
document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

// Handle image upload
const handleImage = (e) => {
const file = e.target.files[0];
const reader = new FileReader();

reader.onloadend = () => {
setImage(reader.result);
};

reader.readAsDataURL(file);
};

// Save profile
const saveProfile = () => {

const updatedUser = { ...user, name, email, mobile, image };

localStorage.setItem("user", JSON.stringify(updatedUser));

window.location.reload();
};

// Logout
const logout = () => {
localStorage.removeItem("user");
window.location = "/";
};

return (

<div className="profile-container" ref={menuRef}>

{/* SMALL PROFILE ICON */}
<img
src={image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
alt="profile"
className="profile-img"
onClick={() => setOpen(!open)}
/>

{/* DROPDOWN */}
{open && (
<div className="profile-dropdown">

<p><b>{user?.name}</b></p>
<p style={{fontSize:"14px",color:"gray"}}>{user?.email}</p>

<hr />

<button onClick={()=>setEdit(true)} className="btn btn-primary w-100 mb-2">
Edit Profile
</button>

<button onClick={logout} className="btn btn-danger w-100">
Logout
</button>

</div>
)}

{/* EDIT MODAL */}
{edit && (
<div className="modal-overlay">

<div className="modal-box">

<h4>Edit Profile</h4>

<input
className="form-control"
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Name"
/>

<input
className="form-control"
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Email"
/>

<input
type="file"
className="form-control"
onChange={handleImage}
/>

<input
className="form-control"
value={mobile}
onChange={(e)=>setMobile(e.target.value)}
placeholder="Mobile"
/>

<button onClick={saveProfile} className="btn btn-success">
Save
</button>

<button onClick={()=>setEdit(false)} className="btn btn-secondary">
Cancel
</button>

</div>

</div>
)}

</div>

);

}

export default ProfileMenu;