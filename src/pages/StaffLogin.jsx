import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, Eye, EyeOff, Utensils, ChefHat, Settings } from "lucide-react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
export default function StaffLogin() {
  const [role, setRole] = useState(null)
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState("")
  const { signIn } = useAuth(); const navigate = useNavigate()
  const handleSubmit = async () => {
    if (!email || !password) { setError("Please enter email and password"); return }
    setLoading(true); setError("")
    try {
      await signIn(email, password)
      navigate(role === "admin" ? "/admin" : "/kitchen")
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  if (!role) return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <Utensils size={28} color={ACCENT} />
        <span style={{ fontSize:28, fontWeight:700, color:ACCENT }}>QuickBite</span>
      </div>
      <p style={{ color:"#888", fontSize:14, marginBottom:40 }}>Staff Access Portal</p>
      <div style={{ width:"100%", maxWidth:420 }}>
        <h2 style={{ color:"#fff", fontSize:22, fontWeight:700, textAlign:"center", marginBottom:24 }}>Who are you?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <button style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:20, padding:"32px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:12, cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.transform="translateY(-4px)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#2a2a2a"; e.currentTarget.style.transform="translateY(0)" }}
            onClick={() => setRole("kitchen")}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#1a0a00", border:`2px solid ${ACCENT}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ChefHat size={32} color={ACCENT} />
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Kitchen</div>
              <div style={{ color:"#888", fontSize:12, marginTop:4 }}>View and manage orders</div>
            </div>
          </button>
          <button style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:20, padding:"32px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:12, cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=AMBER; e.currentTarget.style.transform="translateY(-4px)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#2a2a2a"; e.currentTarget.style.transform="translateY(0)" }}
            onClick={() => setRole("admin")}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#1a1000", border:`2px solid ${AMBER}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Settings size={32} color={AMBER} />
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Admin</div>
              <div style={{ color:"#888", fontSize:12, marginTop:4 }}>Manage menu and settings</div>
            </div>
          </button>
        </div>
        <p style={{ color:"#555", fontSize:12, textAlign:"center", marginTop:24 }}>Select your role to continue</p>
      </div>
    </div>
  )
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:24, padding:"40px 36px", width:"100%", maxWidth:420 }}>
        <button style={{ background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:13, marginBottom:20, display:"flex", alignItems:"center", gap:6 }} onClick={() => { setRole(null); setError("") }}>Back</button>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
          {role === "kitchen" ? <ChefHat size={28} color={ACCENT} /> : <Settings size={28} color={AMBER} />}
          <span style={{ fontSize:22, fontWeight:700, color: role === "kitchen" ? ACCENT : AMBER }}>{role === "kitchen" ? "Kitchen Login" : "Admin Login"}</span>
        </div>
        <p style={{ color:"#888", fontSize:14, margin:"0 0 28px" }}>{role === "kitchen" ? "Live orders and kitchen view" : "Menu and settings management"}</p>
        {error && <div style={{ background:"#2a1a1a", border:"1px solid #ff444444", borderRadius:10, padding:"12px 14px", color:"#ff8888", fontSize:14, marginBottom:20 }}>{error}</div>}
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", fontSize:13, color:"#ccc", fontWeight:500, marginBottom:8 }}>Email Address</label>
          <div style={{ position:"relative" }}>
            <Mail size={16} color={ACCENT} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }} />
            <input style={{ width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"13px 14px 13px 42px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} type="email" placeholder="your@iilm.edu" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", fontSize:13, color:"#ccc", fontWeight:500, marginBottom:8 }}>Password</label>
          <div style={{ position:"relative" }}>
            <Lock size={16} color={ACCENT} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }} />
            <input style={{ width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"13px 44px 13px 42px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} type={showPw ? "text" : "password"} placeholder="••••••••••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            <button style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center" }} onClick={() => setShowPw(s => !s)}>
              {showPw ? <EyeOff size={16} color="#888" /> : <Eye size={16} color="#888" />}
            </button>
          </div>
        </div>
        <button style={{ width:"100%", background:`linear-gradient(135deg,${role === "kitchen" ? ACCENT : AMBER},${AMBER})`, border:"none", borderRadius:14, padding:"15px", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8 }} onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing in..." : `Sign In as ${role === "kitchen" ? "Kitchen Staff" : "Admin"}`}
        </button>
        <p style={{ color:"#555", fontSize:12, textAlign:"center", marginTop:16 }}>Authorized personnel only</p>
      </div>
    </div>
  )
}