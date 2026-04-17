import React,{useEffect,useState} from "react"
import {getSensorData} from "../services/api"
import Charts from "../components/Charts"
import Table from "../components/Table"
import Navbar from "../components/Navbar"

function Dashboard(){

const [data,setData]=useState([])

useEffect(()=>{

loadData()

const interval=setInterval(loadData,2000)

return ()=>clearInterval(interval)

},[])

const loadData=async()=>{

const res=await getSensorData()

setData(res.data)

}

const latest = data.length > 0 ? data[0] : null

return(

<div>

<Navbar/>

<h2 style={{textAlign:"center",marginTop:"20px"}}>
Live Pond Sensor Data
</h2>

{/* Latest Values Section */}

{latest && (

<div style={{
display:"grid",
gridTemplateColumns:"repeat(7,1fr)",
gap:"15px",
padding:"20px"
}}>

<div className="card">pH : {latest.ph}</div>
<div className="card">Temp : {latest.temperature} °C</div>
<div className="card">Salinity : {latest.salinity}</div>
<div className="card">DO : {latest.do_level}</div>
<div className="card">Turbidity : {latest.turbidity}</div>
<div className="card">Ammonia : {latest.ammonia}</div>

<div className="card" style={{
background: latest.disease === "Healthy" ? "#22c55e" : "#ef4444",
color:"white"
}}>
Disease : {latest.disease}
</div>

</div>

)}

<Charts data={data}/>

<Table data={data}/>

</div>

)

}

export default Dashboard