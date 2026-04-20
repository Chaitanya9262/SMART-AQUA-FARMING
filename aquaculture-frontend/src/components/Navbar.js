import { Link } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";
function Navbar() {
  return (
    <div className="navbar">
      <h2
  style={{
    textAlign: "center",
    width: "100%",
    fontSize: "32px",          // 🔥 increase size
    padding: "15px 20px",      // 🔥 increase height
    color: "#ffffff",          // text color
    fontWeight: "700",         // bold

    // background: "rgba(0,0,0,0.5)",  // glass background
    backdropFilter: "blur(10px)",

    borderRadius: "12px",
    margin: "20px auto",

    letterSpacing: "1px",      // spacing between letters
    textShadow: "0 0 10px rgba(0,0,0,0.8)" // glow for visibility
  }}
>
  🦐 SHRIMP MONITORING
</h2>

      <div>
        <Link to="/home">Home</Link> |{" "}
        <Link to="/graphs">Graphs</Link> |{" "}
        <Link to="/database">Database</Link>
      </div>
       <ProfileMenu />
    </div>
    
  );
}
 

export default Navbar;