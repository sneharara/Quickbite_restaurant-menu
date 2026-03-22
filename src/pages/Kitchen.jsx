import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { LogOut, Clock, ChefHat, RefreshCw } from "lucide-react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
const STATUS_CONFIG = { received:{label:"New Order",color:"#3b82f6",next:"preparing",nextLabel:"Start Cooking"}, preparing:{label:"Cooking",color:AMBER,next:"ready",nextLabel:"Mark Ready"}, ready:{label:"Ready",color:"#4ade80",next:"served",nextLabel:"Mark Served"}, served:{label:"Served",color:"#888",next:null,nextLabel:null} }
export default function Kitchen() {
  const { staff, signOut } = useAuth(); const navigate = useNavigate()
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [filter, setFilter] = useState("active")
  useEffect(() => {
    loadOrders()
    const channel = supabase.channel("kitchen-orders").on("postgres_changes",{event:"*",schema:"public",table:"orders"},()=>loadOrders()).on("postgres_changes",{event:"*",schema:"public",table:"order_items"},()=>loadOrders()).subscribe()
    return () => supabase.removeChannel(channel)
  }, [])
  const loadOrders = async () => { const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at",{ascending:false}).limit(50); setOrders(data||[]); setLoading(false) }
  const updateStatus = async (orderId, newStatus) => { await supabase.from("orders").update({status:newStatus}).eq("id",orderId) }
  const getElapsed = (createdAt) => { const mins = Math.floor((Date.now()-new Date(createdAt))/60000); return mins < 1 ? "Just now" : `${mins}m ago` }
  const filtered = orders.filter(o => { if(filter==="active") return ["received","preparing","ready"].includes(o.status); if(filter==="served") return o.status==="served"; return true })
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 24px", background:"#141414", borderBottom:"1px solid #222" }}>
        <div>
          <div style={{ fontWeight:700, fontSize:20, color:ACCENT }}>QuickBite Kitchen</div>
          <div style={{ color:"#888", fontSize:13 }}>Welcome, {staff?.name}</div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:8, padding:"8px 10px", cursor:"pointer", color:"#888", display:"flex", alignItems:"center" }} onClick={loadOrders}><RefreshCw size={16} /></button>
          <button style={{ display:"flex", alignItems:"center", gap:6, background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:8, padding:"8px 14px", cursor:"pointer", color:"#888", fontSize:13 }} onClick={() => { signOut(); navigate("/kitchen/login") }}><LogOut size={16} /> Logout</button>
        </div>
      </div>
      <div style={{ display:"flex", gap:16, padding:"16px 24px", background:"#111" }}>
        {["received","preparing","ready"].map(s => (
          <div key={s} style={{ flex:1, background:"#1a1a1a", borderRadius:12, padding:"14px", textAlign:"center", border:"1px solid #2a2a2a" }}>
            <div style={{ fontSize:28, fontWeight:700, lineHeight:1, color:STATUS_CONFIG[s].color }}>{orders.filter(o=>o.status===s).length}</div>
            <div style={{ fontSize:12, color:"#888", marginTop:4, textTransform:"uppercase", letterSpacing:0.5 }}>{STATUS_CONFIG[s].label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, padding:"16px 24px" }}>
        {["active","served","all"].map(f => (<button key={f} style={{ background: filter===f ? `linear-gradient(135deg,${ACCENT},${AMBER})` : "#1a1a1a", border: filter===f ? "none" : "1px solid #2a2a2a", borderRadius:20, padding:"8px 20px", cursor:"pointer", color: filter===f ? "#fff" : "#888", fontSize:13, fontWeight:500 }} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>))}
      </div>
      {loading ? <div style={{ textAlign:"center", padding:60, color:"#888" }}>Loading orders...</div> : filtered.length === 0 ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:60 }}><ChefHat size={48} color="#333" /><p style={{ color:"#888" }}>No orders yet</p></div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16, padding:"0 24px 24px" }}>
          {filtered.map(order => {
            const config = STATUS_CONFIG[order.status]; const isUrgent = order.status === "received"
            return (
              <div key={order.id} style={{ background:"#141414", borderRadius:16, padding:18, border:`1px solid ${isUrgent?"#3b82f6":"#2a2a2a"}`, boxShadow: isUrgent ? "0 0 20px #3b82f620" : "none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Table #{order.table_number}</div>
                    <div style={{ fontSize:11, color:"#555", marginTop:2 }}>ID: {order.id.slice(0,8).toUpperCase()}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div style={{ borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:600, background:config.color+"22", color:config.color, border:`1px solid ${config.color}44` }}>{config.label}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={12} color="#666" /><span style={{ color:"#666", fontSize:12 }}>{getElapsed(order.created_at)}</span></div>
                  </div>
                </div>
                <div style={{ marginBottom:12, borderTop:"1px solid #222", paddingTop:12 }}>
                  {order.order_items?.map(item => (<div key={item.id} style={{ display:"flex", gap:8, marginBottom:6 }}><span style={{ color:ACCENT, fontWeight:700, minWidth:24, fontSize:14 }}>x{item.quantity}</span><span style={{ color:"#ccc", fontSize:14 }}>{item.name}</span></div>))}
                </div>
                {order.special_instructions && <div style={{ background:"#1a1200", border:"1px solid #3a2800", borderRadius:8, padding:"8px 12px", fontSize:13, color:"#fbbf24", marginBottom:12 }}>Note: {order.special_instructions}</div>}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #222", paddingTop:12 }}>
                  <span style={{ color:"#888", fontSize:13 }}>Rs. {order.total_amount.toFixed(0)}</span>
                  {config.next && <button style={{ background:config.color, border:"none", borderRadius:10, padding:"8px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }} onClick={()=>updateStatus(order.id,config.next)}>{config.nextLabel}</button>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}