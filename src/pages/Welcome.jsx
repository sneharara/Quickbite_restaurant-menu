import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#fff", fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:420, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, fontSize:22, fontWeight:700, color:"#fff" }}>QB</div>
        <h1 style={{ fontSize:36, fontWeight:800, margin:"0 0 8px", color:ACCENT }}>QuickBite</h1>
        <p style={{ color:"#888", fontSize:15, margin:"0 0 40px", letterSpacing:1 }}>Smart Restaurant Ordering</p>
        <div style={{ width:"100%", background:"#141414", border:"1px solid #222", borderRadius:24, padding:"28px 24px", display:"flex", flexDirection:"column", gap:16 }}>
          <p style={{ color:"#888", fontSize:14, textAlign:"center", margin:"0 0 4px", lineHeight:1.6 }}>Welcome! Select your table to start ordering</p>
          <button style={{ width:"100%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:14, padding:"18px", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer" }}
            onClick={() => navigate("/tables")}>
            Choose Your Table
          </button>
        </div>
        <p style={{ color:"#222", fontSize:12, marginTop:24 }}>Powered by QuickBite Technology</p>
      </div>
    </div>
  )
}