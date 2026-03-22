import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { supabase } from "../lib/supabase"
import { CheckCircle } from "lucide-react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID
export default function Payment() {
  const { tableNumber } = useParams(); const navigate = useNavigate()
  const { items, total, specialInstructions, mood, dispatch } = useCart()
  const [loading, setLoading] = useState(false); const [status, setStatus] = useState("idle")
  const [orderId, setOrderId] = useState(null); const [errorMsg, setErrorMsg] = useState("")
  const tax = total * 0.05; const grandTotal = total + tax
  useEffect(() => {
    const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.async = true; document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])
  const placeOrder = async (paymentStatus, razorpayPaymentId) => {
    const { data: order, error } = await supabase.from("orders").insert({ table_number: parseInt(tableNumber), total_amount: grandTotal, special_instructions: specialInstructions, customer_mood: mood, status: "received", payment_status: paymentStatus, razorpay_payment_id: razorpayPaymentId || null }).select().single()
    if (error) throw error
    const orderItems = items.map(item => ({ order_id: order.id, menu_item_id: item.id, name: item.name, price: item.price, quantity: item.quantity }))
    await supabase.from("order_items").insert(orderItems)
    return order
  }
  const handlePay = async () => {
    setLoading(true); setStatus("paying")
    try {
      if (!RAZORPAY_KEY || RAZORPAY_KEY === "rzp_test_YOUR_KEY_HERE") {
        const order = await placeOrder("paid", null)
        setOrderId(order.id); setStatus("success"); dispatch({ type:"CLEAR_CART" }); return
      }
      const rzp = new window.Razorpay({ key: RAZORPAY_KEY, amount: Math.round(grandTotal * 100), currency: "INR", name: "QuickBite", description: `Table ${tableNumber} Order`, theme: { color: ACCENT },
        handler: async (response) => { const order = await placeOrder("paid", response.razorpay_payment_id); setOrderId(order.id); setStatus("success"); dispatch({ type:"CLEAR_CART" }) },
        modal: { ondismiss: () => { setStatus("idle"); setLoading(false) } }
      }); rzp.open()
    } catch (err) { setErrorMsg(err.message); setStatus("error") }
    finally { setLoading(false) }
  }
  if (status === "success") return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24, textAlign:"center", padding:40 }}>
      <CheckCircle size={72} color="#4ade80" />
      <h1 style={{ color:"#fff", fontSize:28, margin:0 }}>Order Placed!</h1>
      <p style={{ color:"#888", fontSize:16 }}>Your order has been sent to the kitchen</p>
      <button style={{ background:ACCENT, border:"none", borderRadius:12, padding:"14px 32px", color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer" }} onClick={() => navigate(`/table/${tableNumber}/order/${orderId}`)}>Track My Order</button>
    </div>
  )
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", background:"#141414", borderBottom:"1px solid #222" }}>
        <h1 style={{ fontSize:20, fontWeight:700, margin:0, color:"#fff" }}>Payment</h1>
        <div style={{ background:"#1a1a1a", border:`1px solid ${ACCENT}`, color:ACCENT, borderRadius:12, padding:"4px 12px", fontSize:12, fontWeight:600 }}>Table {tableNumber}</div>
      </div>
      <div style={{ padding:20, maxWidth:500, margin:"0 auto" }}>
        <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, padding:20, marginBottom:16 }}>
          <h3 style={{ color:"#fff", fontSize:16, fontWeight:600, marginBottom:16, marginTop:0 }}>Order Summary</h3>
          {items.map(item => (<div key={item.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:15 }}><span style={{ color:"#ccc" }}>{item.name} x{item.quantity}</span><span style={{ color:"#fff", fontWeight:500 }}>Rs. {(item.price*item.quantity).toFixed(0)}</span></div>))}
          <div style={{ height:1, background:"#2a2a2a", margin:"12px 0" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}><span style={{ color:"#888" }}>Subtotal</span><span style={{ color:"#fff" }}>Rs. {total.toFixed(0)}</span></div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}><span style={{ color:"#888" }}>GST (5%)</span><span style={{ color:"#fff" }}>Rs. {tax.toFixed(0)}</span></div>
          <div style={{ height:1, background:"#2a2a2a", margin:"12px 0" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:"#fff", fontWeight:700, fontSize:18 }}>Total</span>
            <span style={{ fontWeight:700, fontSize:20, color:ACCENT }}>Rs. {grandTotal.toFixed(0)}</span>
          </div>
        </div>
        {status === "error" && <div style={{ background:"#2a1a1a", border:"1px solid #ff4444", borderRadius:12, padding:14, color:"#ff8888", fontSize:14, marginBottom:16 }}>{errorMsg}</div>}
        <button style={{ width:"100%", background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:16, padding:18, color:"#fff", fontSize:17, fontWeight:700, cursor:"pointer" }} onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : `Pay Rs. ${grandTotal.toFixed(0)}`}
        </button>
        <p style={{ color:"#555", fontSize:12, textAlign:"center", marginTop:12 }}>
          {!RAZORPAY_KEY || RAZORPAY_KEY === "rzp_test_YOUR_KEY_HERE" ? "Demo mode - no real payment" : "Secured by Razorpay"}
        </p>
      </div>
    </div>
  )
}