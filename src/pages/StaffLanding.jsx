import { useNavigate } from "react-router-dom"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
export default function StaffLanding() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#fff", fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:420, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, fontSize:32, fontWeight:700, color:"#fff" }}>QB</div>
        <h1 style={{ fontSize:32, fontWeight:800, margin:"0 0 8px", color:ACCENT }}>QuickBite</h1>
        <p style={{ color:"#888", fontSize:15, margin:"0 0 48px" }}>Staff Access Portal</p>
        <div style={{ width:"100%", background:"#141414", border:"1px solid #222", borderRadius:24, padding:"32px 24px", display:"flex", flexDirection:"column", gap:16 }}>
          <p style={{ color:"#888", fontSize:14, textAlign:"center", margin:"0 0 8px" }}>Select your role to continue</p>
          <button style={{ width:"100%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:14, padding:"18px", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer" }}
            onClick={() => navigate("/kitchen/login")}>
            Kitchen Staff Login
          </button>
          <button style={{ width:"100%", background:"#1a1a1a", border:`1px solid ${ACCENT}`, borderRadius:14, padding:"18px", color:ACCENT, fontSize:16, fontWeight:700, cursor:"pointer" }}
            onClick={() => navigate("/admin/login")}>
            Admin Login
          </button>
        </div>
        <p style={{ color:"#333", fontSize:12, marginTop:24 }}>Authorized personnel only</p>
        <a href="/" style={{ color:"#555", fontSize:13, marginTop:8, textDecoration:"none" }}>Back to Customer Menu</a>
      </div>
    </div>
  )
}