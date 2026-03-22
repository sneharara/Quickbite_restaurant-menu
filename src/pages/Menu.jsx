import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useCart } from "../context/CartContext"
import { ShoppingCart, Plus, Minus, Search, ArrowLeft } from "lucide-react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
const MOOD_CATS = { "feel-good":["main-course","burgers-sandwiches","desserts"], "energy":["beverages","starters"], "adventurous":["pasta-pizza","main-course"], "light":["starters","beverages"], "cozy":["main-course","rice-biryani","beverages"], "all":null }
export default function Menu() {
  const { tableNumber } = useParams(); const navigate = useNavigate(); const [searchParams] = useSearchParams()
  const mood = searchParams.get("mood") || "all"
  const { items: cartItems, itemCount, total, dispatch } = useCart()
  const [categories, setCategories] = useState([]); const [menuItems, setMenuItems] = useState([])
  const [activeCategory, setActiveCategory] = useState("all"); const [search, setSearch] = useState(""); const [loading, setLoading] = useState(true)
  useEffect(() => { loadMenu() }, [])
  const loadMenu = async () => {
    setLoading(true)
    const [{ data: cats }, { data: items }] = await Promise.all([supabase.from("categories").select("*").eq("is_active", true).order("display_order"), supabase.from("menu_items").select("*, categories(name,slug)").eq("is_available", true)])
    setCategories(cats || [])
    const moodFilter = MOOD_CATS[mood]
    setMenuItems(moodFilter ? (items || []).filter(i => moodFilter.includes(i.categories?.slug)) : (items || []))
    setLoading(false)
  }
  const displayed = menuItems.filter(item => { const mc = activeCategory === "all" || item.categories?.slug === activeCategory; const ms = item.name.toLowerCase().includes(search.toLowerCase()); return mc && ms })
  const getQty = (id) => cartItems.find(i => i.id === id)?.quantity || 0
  const addItem = (item) => dispatch({ type:"ADD_ITEM", payload:{ id:item.id, name:item.name, price:item.price, image_url:item.image_url, calories:item.calories } })
  const updateQty = (id, qty) => dispatch({ type:"UPDATE_QTY", payload:{ id, qty } })
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif", paddingBottom:80 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", background:"#141414", borderBottom:"1px solid #222", position:"sticky", top:0, zIndex:100 }}>
        <button style={{ background:"none", border:"none", cursor:"pointer", padding:8 }} onClick={() => navigate(`/table/${tableNumber}/mood`)}><ArrowLeft size={18} color={ACCENT} /></button>
        <div>
          <div style={{ fontWeight:700, fontSize:18, background:`linear-gradient(90deg,${ACCENT},${AMBER})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>QuickBite</div>
          <div style={{ fontSize:11, color:"#888", marginTop:2 }}>Table {tableNumber}</div>
        </div>
        <button style={{ position:"relative", background:ACCENT, border:"none", borderRadius:12, padding:"10px 14px", cursor:"pointer" }} onClick={() => navigate(`/table/${tableNumber}/cart`)}>
          <ShoppingCart size={20} color="#fff" />
          {itemCount > 0 && <span style={{ position:"absolute", top:-6, right:-6, background:AMBER, color:"#000", borderRadius:"50%", width:18, height:18, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{itemCount}</span>}
        </button>
      </div>
      <div style={{ position:"relative", margin:"16px 20px 0" }}>
        <Search size={16} color="#888" style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }} />
        <input style={{ width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"12px 12px 12px 40px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} placeholder="Search dishes..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ display:"flex", gap:8, padding:"16px 20px", overflowX:"auto", scrollbarWidth:"none" }}>
        <button style={{ whiteSpace:"nowrap", background: activeCategory==="all" ? `linear-gradient(135deg,${ACCENT},${AMBER})` : "#1a1a1a", border: activeCategory==="all" ? "none" : "1px solid #2a2a2a", borderRadius:20, padding:"8px 16px", color: activeCategory==="all" ? "#fff" : ACCENT, fontSize:13, fontWeight:500, cursor:"pointer" }} onClick={() => setActiveCategory("all")}>All</button>
        {categories.map(cat => (<button key={cat.slug} style={{ whiteSpace:"nowrap", background: activeCategory===cat.slug ? `linear-gradient(135deg,${ACCENT},${AMBER})` : "#1a1a1a", border: activeCategory===cat.slug ? "none" : "1px solid #2a2a2a", borderRadius:20, padding:"8px 16px", color: activeCategory===cat.slug ? "#fff" : ACCENT, fontSize:13, fontWeight:500, cursor:"pointer" }} onClick={() => setActiveCategory(cat.slug)}>{cat.name}</button>))}
      </div>
      {loading ? <div style={{ textAlign:"center", padding:60, color:"#888" }}>Loading menu...</div> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16, padding:"0 20px 20px" }}>
          {displayed.map(item => {
            const qty = getQty(item.id)
            return (
              <div key={item.id} style={{ background:"#1a1a1a", borderRadius:16, overflow:"hidden", border:"1px solid #2a2a2a" }}>
                <div style={{ position:"relative", height:160 }}>
                  <img src={item.image_url} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex" }} />
                  <div style={{ display:"none", width:"100%", height:"100%", background:"#222", alignItems:"center", justifyContent:"center", fontSize:40 }}>food</div>
                  {item.is_vegetarian && <span style={{ position:"absolute", top:8, left:8, background:"#1a1a1a", borderRadius:8, padding:"2px 8px", fontSize:11, color:"#4ade80", border:"1px solid #4ade8033" }}>VEG</span>}
                </div>
                <div style={{ padding:"14px 16px" }}>
                  <div style={{ fontWeight:600, fontSize:16, marginBottom:4, color:"#fff" }}>{item.name}</div>
                  <div style={{ color:"#888", fontSize:13, lineHeight:1.4, marginBottom:8 }}>{item.description}</div>
                  {item.calories && <span style={{ fontSize:12, color:"#666", background:"#222", borderRadius:8, padding:"2px 8px" }}>{item.calories} kcal</span>}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
                    <span style={{ fontSize:20, fontWeight:700, color:ACCENT }}>Rs. {item.price}</span>
                    {qty === 0 ? (
                      <button style={{ display:"flex", alignItems:"center", gap:6, background:ACCENT, border:"none", borderRadius:10, padding:"8px 16px", color:"#fff", fontWeight:600, cursor:"pointer", fontSize:14 }} onClick={() => addItem(item)}><Plus size={16} /> Add</button>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", gap:12, background:"#222", borderRadius:10, padding:"6px 10px" }}>
                        <button style={{ background:"none", border:"none", cursor:"pointer", color:ACCENT, display:"flex", alignItems:"center", padding:2 }} onClick={() => updateQty(item.id, qty-1)}><Minus size={14} /></button>
                        <span style={{ fontWeight:700, minWidth:20, textAlign:"center", color:"#fff" }}>{qty}</span>
                        <button style={{ background:"none", border:"none", cursor:"pointer", color:ACCENT, display:"flex", alignItems:"center", padding:2 }} onClick={() => updateQty(item.id, qty+1)}><Plus size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {itemCount > 0 && (
        <div style={{ position:"fixed", bottom:20, left:20, right:20, background:`linear-gradient(135deg,${ACCENT},${AMBER})`, borderRadius:16, padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", fontSize:15, color:"#fff", boxShadow:`0 8px 32px rgba(255,107,53,0.4)`, zIndex:200 }} onClick={() => navigate(`/table/${tableNumber}/cart`)}>
          <span>{itemCount} {itemCount===1?"item":"items"} added</span>
          <span style={{ fontWeight:700 }}>View Cart - Rs. {total.toFixed(0)}</span>
        </div>
      )}
    </div>
  )
}