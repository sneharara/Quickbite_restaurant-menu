import { useEffect, useState } from "react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
const LANDING_URL = "https://quickbite-restaurant-menu.vercel.app"
export default function QRPage() {
  const [qrUrl, setQrUrl] = useState("")
  useEffect(() => {
    const encoded = encodeURIComponent(LANDING_URL)
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`)
  }, [])
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <h1 style={{ fontSize:32, fontWeight:800, color:ACCENT, marginBottom:8 }}>QuickBite</h1>
      <p style={{ color:"#888", fontSize:15, marginBottom:40 }}>Scan to access the restaurant system</p>
      <div style={{ background:"#fff", padding:24, borderRadius:20, marginBottom:32 }}>
        {qrUrl && <img src={qrUrl} alt="QR Code" width={220} height={220} />}
      </div>
      <div style={{ background:"#141414", border:"1px solid #222", borderRadius:16, padding:"20px 32px", textAlign:"center", marginBottom:16 }}>
        <p style={{ color:"#888", fontSize:13, margin:"0 0 12px" }}>This QR gives access to:</p>
        <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
          <span style={{ background:"#1a1a1a", border:`1px solid ${ACCENT}`, color:ACCENT, borderRadius:10, padding:"6px 16px", fontSize:13, fontWeight:600 }}>Customer</span>
          <span style={{ background:"#1a1a1a", border:`1px solid ${ACCENT}`, color:ACCENT, borderRadius:10, padding:"6px 16px", fontSize:13, fontWeight:600 }}>Kitchen</span>
          <span style={{ background:"#1a1a1a", border:`1px solid ${ACCENT}`, color:ACCENT, borderRadius:10, padding:"6px 16px", fontSize:13, fontWeight:600 }}>Admin</span>
        </div>
      </div>
      <p style={{ color:"#555", fontSize:12, marginBottom:16 }}>Scan with your phone camera</p>
      <button style={{ background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:12, padding:"12px 28px", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }} onClick={() => window.print()}>
        Print QR Code
      </button>
    </div>
  )
}