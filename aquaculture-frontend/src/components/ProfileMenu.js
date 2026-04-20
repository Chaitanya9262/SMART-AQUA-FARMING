import React, { useState, useRef, useEffect } from "react";

function ProfileMenu() {

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [image, setImage] = useState(user?.image || "");
  const [mobile, setMobile] = useState(user?.mobile || "");

  const menuRef = useRef();

  // ✅ CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ IMAGE UPLOAD
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ SAVE PROFILE
  const saveProfile = () => {
    const updatedUser = { ...user, name, email, mobile, image };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setEdit(false);
    setOpen(false);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="profile-container" ref={menuRef}>

      {/* PROFILE ICON */}
      <img
        src={image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        alt="profile"
        className="profile-img"
        onClick={() => setOpen(!open)}
      />

      {/* DROPDOWN */}
      {open && (
        <div className="profile-dropdown">
          <p><b>{name || "User"}</b></p>
          <p style={{ fontSize: "14px", color: "#ccc" }}>{email}</p>

          <hr />

          <button onClick={() => setEdit(true)} className="btn btn-primary w-100 mb-2">
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
              className="form-control mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />

            <input
              className="form-control mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <input
              type="file"
              className="form-control mb-2"
              onChange={handleImage}
            />

            <input
              className="form-control mb-3"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile"
            />

            <button onClick={saveProfile} className="btn btn-success w-100 mb-2">
              Save
            </button>

            <button onClick={() => setEdit(false)} className="btn btn-secondary w-100">
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default ProfileMenu;