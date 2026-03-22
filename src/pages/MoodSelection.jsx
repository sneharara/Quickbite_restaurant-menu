import { useNavigate, useParams } from "react-router-dom"
import { useCart } from "../context/CartContext"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
const MOODS = [
  { key:"feel-good", icon:"(*)", label:"Feel-Good Favorites", desc:"Our most loved comfort dishes", bg:"linear-gradient(135deg,#2a1500,#1a0d00)", accent:"#FF6B35" },
  { key:"energy", icon:"(z)", label:"Energy Boosters", desc:"Fresh and energizing meals", bg:"linear-gradient(135deg,#001a2a,#000d1a)", accent:"#3b82f6" },
  { key:"adventurous", icon:"(*)", label:"Try Something New", desc:"Discover exciting flavors", bg:"linear-gradient(135deg,#1a002a,#0d0015)", accent:"#a855f7" },
  { key:"light", icon:"(~)", label:"Light & Fresh", desc:"Healthy and refreshing choices", bg:"linear-gradient(135deg,#001a00,#000d00)", accent:"#4ade80" },
  { key:"cozy", icon:"(o)", label:"Cozy Classics", desc:"Warm homestyle comfort food", bg:"linear-gradient(135deg,#2a1a00,#1a0d00)", accent:"#f59e0b" },
  { key:"all", icon:"(+)", label:"Browse Everything", desc:"See the full menu", bg:"linear-gradient(135deg,#1a1a2a,#0d0d1a)", accent:"#FF6B35" },
]
const FOOD_ICONS = {
  "feel-good": ["Pizza", "Burger", "Brownie"],
  "energy": ["Juice", "Salad", "Wrap"],
  "adventurous": ["Sushi", "Tacos", "Ramen"],
  "light": ["Salad", "Bowl", "Lemon"],
  "cozy": ["Soup", "Chai", "Rice"],
  "all": ["Biryani", "Cake", "Drinks"],
}
export default function MoodSelection() {
  const { tableNumber } = useParams(); const navigate = useNavigate(); const { dispatch } = useCart()
  const selectMood = (mood) => { dispatch({ type:"SET_MOOD", payload:mood.key }); navigate(`/table/${tableNumber}/menu?mood=${mood.key}`) }
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif", padding:"32px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ display:"inline-block", background:"#1a1a1a", border:`1px solid ${ACCENT}`, color:ACCENT, borderRadius:20, padding:"6px 20px", fontSize:13, fontWeight:600, marginBottom:16, letterSpacing:1, textTransform:"uppercase" }}>Table {tableNumber}</div>
        <h1 style={{ fontSize:28, fontWeight:700, margin:"0 0 8px", color:"#fff" }}>How are you feeling today?</h1>
        <p style={{ color:"#888", fontSize:15, margin:0 }}>We will recommend dishes just for you</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, maxWidth:800, margin:"0 auto" }}>
        {MOODS.map(mood => (
          <button key={mood.key} style={{ background:"#1a1a1a", border:`1px solid #2a2a2a`, borderRadius:20, overflow:"hidden", display:"flex", flexDirection:"column", cursor:"pointer", transition:"all 0.2s ease", color:"#fff", padding:0, textAlign:"center" }}
            onClick={() => selectMood(mood)}
            onMouseEnter={e => { e.currentTarget.style.borderColor=mood.accent; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${mood.accent}44` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#2a2a2a"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none" }}>
            <div style={{ background:mood.bg, padding:"24px 16px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:mood.accent+"33", border:`2px solid ${mood.accent}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:28, fontWeight:900, color:mood.accent, lineHeight:1 }}>
                  {mood.key === "feel-good" && ":-)" }
                  {mood.key === "energy" && ">>>" }
                  {mood.key === "adventurous" && "!!!" }
                  {mood.key === "light" && "^^^" }
                  {mood.key === "cozy" && "~~~" }
                  {mood.key === "all" && "***" }
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
                {FOOD_ICONS[mood.key].map(f => (
                  <span key={f} style={{ background:mood.accent+"22", border:`1px solid ${mood.accent}44`, borderRadius:8, padding:"3px 8px", fontSize:11, color:mood.accent, fontWeight:600 }}>{f}</span>
                ))}
              </div>
            </div>
            <div style={{ padding:"14px 14px 18px", background:"#1a1a1a" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:4 }}>{mood.label}</div>
              <div style={{ fontSize:12, color:"#888", lineHeight:1.4 }}>{mood.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}