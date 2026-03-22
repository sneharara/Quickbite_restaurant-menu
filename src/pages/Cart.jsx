import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
export default function Cart() {
  const { tableNumber } = useParams(); const navigate = useNavigate()
  const { items, total, dispatch } = useCart()
  const tax = total * 0.05; const grandTotal = total + tax
  if (items.length === 0) return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
      <ShoppingBag size={64} color="#333" />
      <p style={{ color:"#888", fontSize:18 }}>Your cart is empty</p>
      <button style={{ background:ACCENT, border:"none", borderRadius:12, padding:"14px 32px", color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer" }} onClick={() => navigate(`/table/${tableNumber}/menu`)}>Browse Menu</button>
    </div>
  )
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", background:"#141414", borderBottom:"1px solid #222" }}>
        <button style={{ background:"none", border:"none", cursor:"pointer", padding:8 }} onClick={() => navigate(`/table/${tableNumber}/menu`)}><ArrowLeft size={18} color={ACCENT} /></button>
        <div style={{ textAlign:"center" }}>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0, color:ACCENT }}>Your Cart</h1>
          <p style={{ margin:0, color:"#888", fontSize:13 }}>Table #{tableNumber}</p>
        </div>
        <div style={{ width:34 }} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24, padding:"24px", maxWidth:1100, margin:"0 auto" }}>
        <div>
          {items.map(item => (
            <div key={item.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px", background:"#141414", borderRadius:16, border:"1px solid #222", marginBottom:12 }}>
              {item.image_url && <img src={item.image_url} alt={item.name} style={{ width:80, height:80, borderRadius:12, objectFit:"cover", flexShrink:0 }} onError={e => e.target.style.display="none"} />}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:16, color:"#fff", marginBottom:4 }}>{item.name}</div>
                <div style={{ color:"#888", fontSize:14 }}>Rs. {item.price} each</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <button style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:ACCENT }} onClick={() => dispatch({ type:"UPDATE_QTY", payload:{ id:item.id, qty:item.quantity-1 } })}>
                  {item.quantity === 1 ? <Trash2 size={14} color="#ff4444" /> : <Minus size={14} />}
                </button>
                <span style={{ fontWeight:700, minWidth:28, textAlign:"center", color:"#fff", fontSize:16 }}>{item.quantity}</span>
                <button style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:ACCENT }} onClick={() => dispatch({ type:"UPDATE_QTY", payload:{ id:item.id, qty:item.quantity+1 } })}>
                  <Plus size={14} />
                </button>
              </div>
              <div style={{ fontWeight:700, color:"#fff", fontSize:16, minWidth:70, textAlign:"right" }}>Rs. {(item.price*item.quantity).toFixed(0)}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ background:"#141414", border:"1px solid #222", borderRadius:20, padding:"24px", marginBottom:16 }}>
            <h2 style={{ color:"#fff", fontSize:20, fontWeight:700, margin:"0 0 20px" }}>Order Summary</h2>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, fontSize:15 }}>
              <span style={{ color:"#888" }}>Subtotal</span>
              <span style={{ color:"#fff", fontWeight:500 }}>Rs. {total.toFixed(0)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16, fontSize:15 }}>
              <span style={{ color:"#888" }}>Tax (5%)</span>
              <span style={{ color:"#fff", fontWeight:500 }}>Rs. {tax.toFixed(0)}</span>
            </div>
            <div style={{ height:1, background:"#2a2a2a", marginBottom:16 }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <span style={{ color:"#fff", fontWeight:700, fontSize:18 }}>Total</span>
              <span style={{ fontWeight:700, fontSize:22, color:ACCENT }}>Rs. {grandTotal.toFixed(0)}</span>
            </div>
            <button style={{ width:"100%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:14, padding:"16px", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer" }} onClick={() => navigate(`/table/${tableNumber}/payment`)}>
              Proceed to Payment
            </button>
            <p style={{ color:"#666", fontSize:12, textAlign:"center", marginTop:10, marginBottom:0 }}>Your order will be sent to the kitchen immediately</p>
          </div>
          <div style={{ background:"#141414", border:"1px solid #222", borderRadius:20, padding:"24px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{ fontSize:20 }}>::</span>
              <h3 style={{ color:"#fff", fontSize:16, fontWeight:700, margin:0 }}>Add a Personalized Instruction</h3>
            </div>
            <textarea style={{ width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"14px", color:"#fff", fontSize:14, outline:"none", resize:"none", boxSizing:"border-box", fontFamily:"inherit", lineHeight:1.5 }} placeholder="e.g. Less spicy, No onion, Write Happy Birthday on plate" onChange={e => dispatch({ type:"SET_INSTRUCTIONS", payload:e.target.value })} rows={4} />
            <p style={{ color:"#555", fontSize:12, marginTop:8, marginBottom:0 }}>This message will be sent directly to the kitchen with your order.</p>
          </div>
        </div>
      </div>
    </div>
  )
}