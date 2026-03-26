import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { supabase } from "../lib/supabase"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
const PAYMENT_METHODS = [
  { id:"upi", label:"UPI", desc:"GPay, PhonePe, Paytm, BHIM", icon:"U" },
  { id:"card", label:"Debit / Credit Card", desc:"Visa, Mastercard, Rupay", icon:"C" },
  { id:"netbanking", label:"Net Banking", desc:"All major banks supported", icon:"N" },
  { id:"wallet", label:"Wallet", desc:"Paytm, Amazon Pay, Mobikwik", icon:"W" },
]
export default function Payment() {
  const { tableNumber } = useParams(); const navigate = useNavigate()
  const { items, total, specialInstructions, mood, dispatch } = useCart()
  const [selectedMethod, setSelectedMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("idle")
  const [orderId, setOrderId] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const tax = total * 0.05; const grandTotal = total + tax
  const placeOrder = async () => {
    const { data: order, error } = await supabase.from("orders").insert({ table_number: parseInt(tableNumber), total_amount: grandTotal, special_instructions: specialInstructions, customer_mood: mood, status: "received", payment_status: "paid" }).select().single()
    if (error) throw error
    const orderItems = items.map(item => ({ order_id: order.id, menu_item_id: item.id, name: item.name, price: item.price, quantity: item.quantity }))
    await supabase.from("order_items").insert(orderItems)
    return order
  }
  const handlePay = async () => {
    if (selectedMethod === "upi" && !upiId) { setErrorMsg("Please enter your UPI ID"); return }
    setLoading(true); setErrorMsg("")
    try { const order = await placeOrder(); setOrderId(order.id); setStatus("success"); dispatch({ type:"CLEAR_CART" }) }
    catch (err) { setErrorMsg(err.message); setLoading(false) }
  }
  if (status === "success") return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"#0a2a0a", border:"2px solid #4ade80", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, fontSize:36 }}>✓</div>
      <h1 style={{ color:"#4ade80", fontSize:28, fontWeight:700, margin:"0 0 8px" }}>Payment Successful!</h1>
      <p style={{ color:"#888", fontSize:16, marginBottom:8 }}>Your order has been placed</p>
      <p style={{ color:"#555", fontSize:14, marginBottom:32 }}>Table #{tableNumber}</p>
      <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:"16px 32px", marginBottom:32, textAlign:"center" }}>
        <p style={{ color:"#888", fontSize:13, margin:"0 0 4px" }}>Amount Paid</p>
        <p style={{ color:ACCENT, fontSize:28, fontWeight:700, margin:0 }}>Rs. {grandTotal.toFixed(0)}</p>
      </div>
      <button style={{ background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:14, padding:"14px 32px", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }} onClick={() => navigate(`/table/${tableNumber}/order/${orderId}`)}>Track My Order</button>
    </div>
  )
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ background:"#141414", borderBottom:"1px solid #222", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button style={{ background:"none", border:"none", color:ACCENT, cursor:"pointer", fontSize:14, fontWeight:600 }} onClick={() => navigate(-1)}>Back</button>
        <h1 style={{ margin:0, fontSize:18, fontWeight:700, color:"#fff" }}>Checkout</h1>
        <div style={{ background:"#1a1a1a", border:`1px solid ${ACCENT}`, color:ACCENT, borderRadius:10, padding:"4px 12px", fontSize:12, fontWeight:600 }}>Table {tableNumber}</div>
      </div>
      <div style={{ maxWidth:500, margin:"0 auto", padding:"20px" }}>
        <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:20, marginBottom:16 }}>
          <h3 style={{ color:"#fff", fontSize:15, fontWeight:700, margin:"0 0 14px" }}>Order Summary</h3>
          {items.map(item => (<div key={item.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ color:"#ccc", fontSize:14 }}>{item.name} x{item.quantity}</span><span style={{ color:"#fff", fontSize:14, fontWeight:500 }}>Rs. {(item.price*item.quantity).toFixed(0)}</span></div>))}
          <div style={{ height:1, background:"#2a2a2a", margin:"12px 0" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:"#888" }}>Subtotal</span><span style={{ color:"#fff" }}>Rs. {total.toFixed(0)}</span></div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}><span style={{ color:"#888" }}>GST (5%)</span><span style={{ color:"#fff" }}>Rs. {tax.toFixed(0)}</span></div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ color:"#fff", fontWeight:700, fontSize:17 }}>Total</span><span style={{ color:ACCENT, fontWeight:700, fontSize:22 }}>Rs. {grandTotal.toFixed(0)}</span></div>
        </div>
        <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:20, marginBottom:16 }}>
          <h3 style={{ color:"#fff", fontSize:15, fontWeight:700, margin:"0 0 14px" }}>Select Payment Method</h3>
          {PAYMENT_METHODS.map(method => (
            <div key={method.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px", borderRadius:12, border:`1px solid ${selectedMethod===method.id?ACCENT:"#2a2a2a"}`, background:selectedMethod===method.id?"#1a0a00":"#1a1a1a", marginBottom:10, cursor:"pointer" }} onClick={() => setSelectedMethod(method.id)}>
              <div style={{ width:42, height:42, borderRadius:10, background:selectedMethod===method.id?ACCENT:"#2a2a2a", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:16, color:"#fff", flexShrink:0 }}>{method.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14, color:"#fff" }}>{method.label}</div>
                <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{method.desc}</div>
              </div>
              <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${selectedMethod===method.id?ACCENT:"#444"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {selectedMethod===method.id && <div style={{ width:8, height:8, borderRadius:"50%", background:ACCENT }} />}
              </div>
            </div>
          ))}
        </div>
        {selectedMethod==="upi" && (
          <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:20, marginBottom:16 }}>
            <label style={{ display:"block", fontSize:13, color:"#888", marginBottom:8 }}>Enter UPI ID</label>
            <input style={{ width:"100%", background:"#1a1a1a", border:`1px solid ${upiId?ACCENT:"#2a2a2a"}`, borderRadius:12, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
            <p style={{ color:"#555", fontSize:12, marginTop:8, marginBottom:0 }}>Example: sneha@okaxis, 9876543210@ybl</p>
          </div>
        )}
        {selectedMethod==="card" && (
          <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:20, marginBottom:16 }}>
            <div style={{ marginBottom:12 }}>
              <label style={{ display:"block", fontSize:13, color:"#888", marginBottom:8 }}>Card Number</label>
              <input style={{ width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} placeholder="1234 5678 9012 3456" maxLength={19} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div><label style={{ display:"block", fontSize:13, color:"#888", marginBottom:8 }}>Expiry Date</label><input style={{ width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} placeholder="MM/YY" maxLength={5} /></div>
              <div><label style={{ display:"block", fontSize:13, color:"#888", marginBottom:8 }}>CVV</label><input style={{ width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} placeholder="123" maxLength={3} type="password" /></div>
            </div>
          </div>
        )}
        {selectedMethod==="netbanking" && (
          <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:20, marginBottom:16 }}>
            <label style={{ display:"block", fontSize:13, color:"#888", marginBottom:8 }}>Select Bank</label>
            <select style={{ width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }}>
              <option value="">-- Select your bank --</option>
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra Bank</option>
              <option>Punjab National Bank</option>
              <option>Bank of Baroda</option>
              <option>Canara Bank</option>
            </select>
          </div>
        )}
        {selectedMethod==="wallet" && (
          <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:20, marginBottom:16 }}>
            <label style={{ display:"block", fontSize:13, color:"#888", marginBottom:8 }}>Select Wallet</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {["Paytm","Amazon Pay","Mobikwik","Freecharge"].map(w => (<div key={w} style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:10, padding:"12px", textAlign:"center", cursor:"pointer", color:"#ccc", fontSize:14 }}>{w}</div>))}
            </div>
          </div>
        )}
        {errorMsg && <div style={{ background:"#2a1a1a", border:"1px solid #ff4444", borderRadius:12, padding:14, color:"#ff8888", fontSize:14, marginBottom:16 }}>{errorMsg}</div>}
        <div style={{ background:"#0a0a1a", border:"1px solid #1a1a3a", borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ color:"#6b8eff", fontSize:18 }}>i</span>
          <p style={{ color:"#6b8eff", fontSize:12, margin:0 }}>This payment page will be connected to Razorpay gateway for live transactions. Currently processing in demo mode.</p>
        </div>
        <button style={{ width:"100%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:16, padding:"18px", color:"#fff", fontSize:17, fontWeight:700, cursor:"pointer", opacity:loading?0.7:1 }} onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : `Pay Rs. ${grandTotal.toFixed(0)}`}
        </button>
        <p style={{ color:"#444", fontSize:12, textAlign:"center", marginTop:12 }}>Secured payment - will be powered by Razorpay</p>
      </div>
    </div>
  )
}