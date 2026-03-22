import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
export default function Tables() {
  const navigate = useNavigate(); const { dispatch } = useCart()
  const selectTable = (num) => { dispatch({ type: "SET_TABLE", payload: num }); navigate(`/table/${num}/mood`) }
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif", paddingBottom:40 }}>
      <div style={{ textAlign:"center", padding:"40px 24px 28px", background:"linear-gradient(180deg,#1a1a1a 0%,#0d0d0d 100%)", borderBottom:"1px solid #222" }}>
        <h1 style={{ fontSize:24, fontWeight:700, margin:"0 0 8px", background:`linear-gradient(90deg,${ACCENT},${AMBER})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Choose Your Table</h1>
        <p style={{ color:"#888", fontSize:14, margin:0 }}>Select your table number to begin ordering</p>
      </div>
      <div style={{ maxWidth:700, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:16 }}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <button key={num} style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:16, padding:"20px 12px", display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", transition:"all 0.2s ease", color:"#fff" }}
              onClick={() => selectTable(num)}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.boxShadow=`0 8px 24px ${ACCENT}33` }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="#2a2a2a"; e.currentTarget.style.boxShadow="none" }}>
              <svg width="32" height="32" viewBox="0 0 44 44" fill="none" style={{ marginBottom:8 }}>
                <rect x="4" y="4" width="14" height="14" rx="2" fill={ACCENT}/>
                <rect x="4" y="20" width="6" height="6" rx="1" fill={ACCENT}/>
                <rect x="4" y="28" width="14" height="12" rx="2" fill={ACCENT}/>
                <rect x="20" y="4" width="6" height="14" rx="1" fill={ACCENT}/>
                <rect x="28" y="4" width="12" height="14" rx="2" fill={ACCENT}/>
                <rect x="20" y="20" width="6" height="6" rx="1" fill={ACCENT}/>
                <rect x="28" y="20" width="6" height="12" rx="1" fill={ACCENT}/>
                <rect x="36" y="20" width="4" height="6" rx="1" fill={ACCENT}/>
                <rect x="20" y="28" width="12" height="6" rx="1" fill={ACCENT}/>
                <rect x="36" y="36" width="4" height="4" rx="1" fill={ACCENT}/>
              </svg>
              <span style={{ fontSize:11, color:"#888", letterSpacing:1, textTransform:"uppercase" }}>Table</span>
              <span style={{ fontSize:28, fontWeight:700, background:`linear-gradient(135deg,${ACCENT},${AMBER})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.2 }}>{num}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}