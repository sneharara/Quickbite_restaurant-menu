import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#fff", fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <div style={{ width:"100%", maxWidth:480, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:90, height:90, borderRadius:"50%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, boxShadow:`0 0 40px ${ACCENT}66`, fontSize:40 }}>QR</div>
        <h1 style={{ fontSize:48, fontWeight:800, margin:"0 0 8px", color:ACCENT }}>QuickBite</h1>
        <p style={{ color:"#888", fontSize:16, margin:"0 0 48px", letterSpacing:1 }}>Smart Restaurant Ordering</p>
        <div style={{ width:"100%", background:"#141414", border:"1px solid #222", borderRadius:24, padding:"32px 24px", display:"flex", flexDirection:"column", gap:16 }}>
          <p style={{ color:"#888", fontSize:14, textAlign:"center", margin:"0 0 8px", lineHeight:1.6 }}>Scan your table QR code to get started with your personalized dining experience</p>
          <button style={{ width:"100%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:14, padding:"18px", color:"#fff", fontSize:17, fontWeight:700, cursor:"pointer" }} onClick={() => navigate("/tables")}>
            Choose Your Table
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1, height:1, background:"#2a2a2a" }} />
            <span style={{ color:"#555", fontSize:13 }}>or browse as</span>
            <div style={{ flex:1, height:1, background:"#2a2a2a" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <button style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"14px", color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer" }} onClick={() => navigate("/kitchen/login")}>Kitchen</button>
            <button style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"14px", color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer" }} onClick={() => navigate("/admin/login")}>Admin</button>
          </div>
        </div>
        <p style={{ color:"#333", fontSize:12, marginTop:24 }}>Powered by QuickBite Technology</p>
      </div>
    </div>
  )
}