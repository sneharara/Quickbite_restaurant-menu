import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { CheckCircle, ChefHat, Bell } from "lucide-react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
const STEPS = [
  { key:"received",  label:"Order Received",  Icon:CheckCircle, desc:"Your order is confirmed" },
  { key:"preparing", label:"Chef is Cooking",  Icon:ChefHat,     desc:"Your food is being prepared" },
  { key:"ready",     label:"Ready to Serve",   Icon:Bell,        desc:"Your food is ready!" },
  { key:"served",    label:"Served",           Icon:CheckCircle, desc:"Enjoy your meal!" },
]
const STATUS_INDEX = { received:0, preparing:1, ready:2, served:3 }
export default function OrderTracking() {
  const { tableNumber, orderId } = useParams()
  const [order, setOrder] = useState(null); const [orderItems, setOrderItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("")
  useEffect(() => {
    loadOrder()
    const channel = supabase.channel(`order-${orderId}`).on("postgres_changes", { event:"UPDATE", schema:"public", table:"orders", filter:`id=eq.${orderId}` }, (payload) => setOrder(prev => ({ ...prev, ...payload.new }))).subscribe()
    return () => supabase.removeChannel(channel)
  }, [orderId])
  const loadOrder = async () => {
    setLoading(true)
    const { data: ord, error: e1 } = await supabase.from("orders").select("*").eq("id", orderId).single()
    if (e1 || !ord) { setError("Order not found"); setLoading(false); return }
    if (ord.table_number !== parseInt(tableNumber)) { setError("Access denied"); setLoading(false); return }
    const { data: items } = await supabase.from("order_items").select("*").eq("order_id", orderId)
    setOrder(ord); setOrderItems(items || []); setLoading(false)
  }
  if (loading) return <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ width:40, height:40, border:"3px solid #2a2a2a", borderTop:`3px solid ${ACCENT}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} /></div>
  if (error) return <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ color:"#ff8888" }}>{error}</p></div>
  const currentStep = STATUS_INDEX[order.status] ?? 0
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", background:"#141414", borderBottom:"1px solid #222" }}>
        <div style={{ fontWeight:700, fontSize:18, color:ACCENT }}>QuickBite</div>
        <div style={{ background:"#1a1a1a", border:`1px solid ${ACCENT}`, color:ACCENT, borderRadius:12, padding:"4px 12px", fontSize:12, fontWeight:600 }}>Table {tableNumber}</div>
      </div>
      <div style={{ padding:20, maxWidth:500, margin:"0 auto" }}>
        {order.status === "ready" && <div style={{ background:"linear-gradient(135deg,#1a3a1a,#0d2a0d)", border:"1px solid #4ade80", borderRadius:12, padding:"14px 16px", color:"#4ade80", fontSize:14, fontWeight:600, marginBottom:20, textAlign:"center" }}>Your food is ready! A server will bring it to your table.</div>}
        <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:20, marginBottom:16 }}>
          <h2 style={{ color:"#fff", fontSize:16, fontWeight:600, marginBottom:20, marginTop:0 }}>Order Status</h2>
          {STEPS.map((step, i) => {
            const { Icon } = step; const done = i <= currentStep; const active = i === currentStep
            return (
              <div key={step.key} style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:4 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background: done ? `linear-gradient(135deg,${ACCENT},${AMBER})` : "#2a2a2a", boxShadow: active ? `0 0 16px ${ACCENT}66` : "none", transition:"all 0.4s ease" }}>
                    <Icon size={16} color={done ? "#fff" : "#555"} />
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width:2, height:32, background: i < currentStep ? ACCENT : "#2a2a2a", transition:"background 0.4s ease" }} />}
                </div>
                <div style={{ paddingTop:8, flex:1, paddingBottom:8, opacity: done ? 1 : 0.4 }}>
                  <div style={{ fontWeight: active ? 700 : 500, color: active ? "#fff" : "#aaa", fontSize:15 }}>{step.label}</div>
                  {active && <div style={{ color:"#888", fontSize:13, marginTop:2 }}>{step.desc}</div>}
                </div>
                {active && <div style={{ width:8, height:8, borderRadius:"50%", background:ACCENT, marginTop:14, animation:"pulse 1.5s ease-in-out infinite" }} />}
              </div>
            )
          })}
        </div>
        <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:20, marginBottom:16 }}>
          <h3 style={{ color:"#fff", fontSize:16, fontWeight:600, marginBottom:16, marginTop:0 }}>Your Items</h3>
          {orderItems.map(item => (<div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, fontSize:15 }}><span style={{ color:"#ccc" }}>{item.name}</span><span style={{ color:"#888" }}>x{item.quantity}</span><span style={{ color:"#fff", fontWeight:600 }}>Rs. {(item.price*item.quantity).toFixed(0)}</span></div>))}
          <div style={{ height:1, background:"#2a2a2a", margin:"12px 0" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:700, color:"#fff" }}>Total Paid</span>
            <span style={{ fontWeight:700, fontSize:18, color:ACCENT }}>Rs. {order.total_amount.toFixed(0)}</span>
          </div>
        </div>
        <p style={{ color:"#555", fontSize:12, textAlign:"center" }}>Order ID: {order.id.slice(0,8).toUpperCase()} - Updates automatically</p>
      </div>
    </div>
  )
}