import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, Eye, EyeOff, Utensils } from "lucide-react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
export default function LoginPage({ role = "kitchen" }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState("")
  const { signIn } = useAuth(); const navigate = useNavigate()
  const handleSubmit = async () => {
    if (!email || !password) { setError("Please enter email and password"); return }
    setLoading(true); setError("")
    try { await signIn(email, password); navigate(role === "admin" ? "/admin" : "/kitchen") }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  const title = role === "admin" ? "Admin Panel" : "Kitchen Dashboard"
  const subtitle = role === "admin" ? "Menu & QR management access" : "Live orders & kitchen view"
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:24, padding:"40px 36px", width:"100%", maxWidth:420 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
          <Utensils size={28} color={ACCENT} />
          <span style={{ fontSize:22, fontWeight:700, background:`linear-gradient(90deg,${ACCENT},${AMBER})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>QuickBite</span>
        </div>
        <h1 style={{ color:"#fff", fontSize:24, fontWeight:700, margin:"0 0 6px" }}>{title}</h1>
        <p style={{ color:"#888", fontSize:14, margin:"0 0 28px" }}>{subtitle}</p>
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
        <button style={{ width:"100%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:14, padding:"15px", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8 }} onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing in..." : `Sign In to ${title}`}
        </button>
        <p style={{ color:"#555", fontSize:12, textAlign:"center", marginTop:16, marginBottom:4 }}>Authorized personnel only</p>
        <Link to="/" style={{ display:"block", textAlign:"center", color:"#888", fontSize:13, textDecoration:"none", marginTop:8 }}>Back to customer menu</Link>
      </div>
    </div>
  )
}
