import { useEffect, useState } from "react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
const QR_URL = "https://quickbite-restaurant-menu.vercel.app/tables"
export default function QRPage() {
  const [qrUrl, setQrUrl] = useState("")
  useEffect(() => {
    const encoded = encodeURIComponent(QR_URL)
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`)
  }, [])
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#fff", fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:420, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <h1 style={{ fontSize:32, fontWeight:800, margin:"0 0 8px", color:ACCENT }}>QuickBite</h1>
        <p style={{ color:"#888", fontSize:14, margin:"0 0 32px" }}>Table QR Code — Print and place on table</p>
        <div style={{ background:"#fff", padding:24, borderRadius:20, marginBottom:24 }}>
          {qrUrl && <img src={qrUrl} alt="QR Code" width={220} height={220} />}
        </div>
        <p style={{ color:"#555", fontSize:13, marginBottom:8, textAlign:"center" }}>When customer scans this QR</p>
        <p style={{ color:ACCENT, fontSize:13, marginBottom:32, textAlign:"center", fontWeight:600 }}>Table selection page opens directly</p>
        <button style={{ background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:12, padding:"12px 28px", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }} onClick={() => window.print()}>
          Print QR Code
        </button>
      </div>
    </div>
  )
}