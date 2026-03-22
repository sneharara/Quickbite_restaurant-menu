import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { LogOut, Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react"
const ACCENT = "#FF6B35"; const AMBER = "#F7931E"
const BLANK = { name:"", description:"", price:"", calories:"", is_vegetarian:false, is_available:true, image_url:"", category_id:"" }
export default function Admin() {
  const { staff, signOut } = useAuth(); const navigate = useNavigate()
  const [categories, setCategories] = useState([]); const [menuItems, setMenuItems] = useState([])
  const [expanded, setExpanded] = useState({}); const [editing, setEditing] = useState(null); const [adding, setAdding] = useState(null)
  const [form, setForm] = useState(BLANK); const [saving, setSaving] = useState(false)
  useEffect(() => { loadData() }, [])
  const loadData = async () => { const [{ data: cats },{ data: items }] = await Promise.all([supabase.from("categories").select("*").order("display_order"), supabase.from("menu_items").select("*").order("display_order")]); setCategories(cats||[]); setMenuItems(items||[]) }
  const itemsByCat = (catId) => menuItems.filter(i => i.category_id === catId)
  const startEdit = (item) => { setEditing(item.id); setAdding(null); setForm({...item,price:String(item.price),calories:String(item.calories||"")}) }
  const startAdd = (catId) => { setAdding(catId); setEditing(null); setForm({...BLANK,category_id:catId}); setExpanded(e=>({...e,[catId]:true})) }
  const cancelForm = () => { setEditing(null); setAdding(null); setForm(BLANK) }
  const saveItem = async () => { setSaving(true); const payload={...form,price:parseFloat(form.price),calories:form.calories?parseInt(form.calories):null}; if(editing){await supabase.from("menu_items").update(payload).eq("id",editing)}else{await supabase.from("menu_items").insert(payload)}; await loadData(); cancelForm(); setSaving(false) }
  const deleteItem = async (id) => { if(!window.confirm("Delete this item?")) return; await supabase.from("menu_items").delete().eq("id",id); await loadData() }
  const toggleAvail = async (item) => { await supabase.from("menu_items").update({is_available:!item.is_available}).eq("id",item.id); await loadData() }
  const F = (field, val) => setForm(prev => ({...prev,[field]:val}))
  const inputStyle = { width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }
  const labelStyle = { display:"block", fontSize:12, color:"#888", marginBottom:6 }
  const ItemForm = ({ isNew }) => (
    <div style={{ background:"#0d0d0d", border:"1px solid #333", borderRadius:12, padding:20, margin: isNew ? "0 20px 12px" : "8px 20px" }}>
      <h4 style={{ color:"#fff", margin:"0 0 16px", fontSize:15 }}>{isNew ? "Add New Item" : "Edit Item"}</h4>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div><label style={labelStyle}>Name</label><input style={inputStyle} value={form.name} onChange={e=>F("name",e.target.value)} placeholder="Item name" /></div>
        <div><label style={labelStyle}>Price</label><input style={inputStyle} type="number" value={form.price} onChange={e=>F("price",e.target.value)} placeholder="299" /></div>
      </div>
      <div style={{ marginBottom:12 }}><label style={labelStyle}>Description</label><input style={inputStyle} value={form.description} onChange={e=>F("description",e.target.value)} placeholder="Short description" /></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div><label style={labelStyle}>Calories</label><input style={inputStyle} type="number" value={form.calories} onChange={e=>F("calories",e.target.value)} placeholder="350" /></div>
        <div><label style={labelStyle}>Image URL</label><input style={inputStyle} value={form.image_url} onChange={e=>F("image_url",e.target.value)} placeholder="https://..." /></div>
      </div>
      <div style={{ display:"flex", gap:20, marginBottom:16 }}>
        <label style={{ display:"flex", alignItems:"center", gap:8, color:"#ccc", fontSize:14, cursor:"pointer" }}><input type="checkbox" checked={form.is_vegetarian} onChange={e=>F("is_vegetarian",e.target.checked)} /> Vegetarian</label>
        <label style={{ display:"flex", alignItems:"center", gap:8, color:"#ccc", fontSize:14, cursor:"pointer" }}><input type="checkbox" checked={form.is_available} onChange={e=>F("is_available",e.target.checked)} /> Available</label>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <button style={{ display:"flex", alignItems:"center", gap:6, background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:10, padding:"8px 18px", color:"#888", cursor:"pointer", fontSize:14 }} onClick={cancelForm}><X size={14} /> Cancel</button>
        <button style={{ display:"flex", alignItems:"center", gap:6, background:`linear-gradient(135deg,${ACCENT},${AMBER})`, border:"none", borderRadius:10, padding:"8px 20px", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:600 }} onClick={saveItem} disabled={saving||!form.name||!form.price}><Save size={14} /> {saving?"Saving...":"Save"}</button>
      </div>
    </div>
  )
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 24px", background:"#141414", borderBottom:"1px solid #222" }}>
        <div>
          <div style={{ fontWeight:700, fontSize:20, color:ACCENT }}>QuickBite Admin</div>
          <div style={{ color:"#888", fontSize:13 }}>{staff?.name} - {staff?.email}</div>
        </div>
        <button style={{ display:"flex", alignItems:"center", gap:6, background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:8, padding:"8px 14px", cursor:"pointer", color:"#888", fontSize:13 }} onClick={()=>{signOut();navigate("/admin/login")}}><LogOut size={16} /> Logout</button>
      </div>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px" }}>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:700, margin:"0 0 4px" }}>Menu Management</h2>
        <p style={{ color:"#888", marginBottom:24, fontSize:14 }}>{menuItems.length} items across {categories.length} categories</p>
        {categories.map(cat => {
          const items = itemsByCat(cat.id); const isExp = expanded[cat.id] !== false
          return (
            <div key={cat.id} style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:16, marginBottom:16, overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", cursor:"pointer", userSelect:"none" }} onClick={()=>setExpanded(e=>({...e,[cat.id]:!e[cat.id]}))}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span>{cat.icon}</span>
                  <span style={{ fontWeight:700, fontSize:17, color:"#fff" }}>{cat.name}</span>
                  <span style={{ background:"#2a2a2a", color:"#888", borderRadius:10, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{items.length}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <button style={{ display:"flex", alignItems:"center", gap:6, background:ACCENT, border:"none", borderRadius:8, padding:"6px 14px", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }} onClick={e=>{e.stopPropagation();startAdd(cat.id)}}><Plus size={14} /> Add Item</button>
                  {isExp ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
                </div>
              </div>
              {adding === cat.id && isExp && <ItemForm isNew={true} />}
              {isExp && (
                <div style={{ borderTop:"1px solid #1e1e1e" }}>
                  {items.length===0 && adding!==cat.id && <p style={{ color:"#555", fontSize:14, padding:"12px 20px" }}>No items yet.</p>}
                  {items.map(item => (
                    <div key={item.id}>
                      {editing===item.id ? <ItemForm isNew={false} /> : (
                        <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px", borderBottom:"1px solid #1e1e1e" }}>
                          {item.image_url && <img src={item.image_url} alt={item.name} style={{ width:56, height:56, borderRadius:10, objectFit:"cover", flexShrink:0 }} onError={e=>e.target.style.display="none"} />}
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontWeight:600, fontSize:15, color:"#fff", display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                              {item.name}
                              {item.is_vegetarian && <span style={{ background:"#1a3a1a", color:"#4ade80", borderRadius:6, padding:"1px 6px", fontSize:11 }}>Veg</span>}
                            </div>
                            <div style={{ color:"#888", fontSize:13, marginBottom:4 }}>{item.description}</div>
                            <div style={{ display:"flex", gap:10 }}>
                              <span style={{ fontWeight:700, color:ACCENT, fontSize:15 }}>Rs. {item.price}</span>
                              {item.calories && <span style={{ color:"#666", fontSize:12, background:"#1e1e1e", borderRadius:6, padding:"1px 8px" }}>{item.calories} kcal</span>}
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                            <button style={{ borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:600, cursor:"pointer", background:item.is_available?"#1a2a1a":"#2a1a1a", color:item.is_available?"#4ade80":"#f87171", border:`1px solid ${item.is_available?"#4ade8033":"#f8717133"}` }} onClick={()=>toggleAvail(item)}>{item.is_available?"Available":"Unavailable"}</button>
                            <button style={{ background:"#1a1a2a", border:"1px solid #2a2a4a", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#6b8eff", display:"flex", alignItems:"center" }} onClick={()=>startEdit(item)}><Edit2 size={14} /></button>
                            <button style={{ background:"#2a1a1a", border:"1px solid #4a2a2a", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#f87171", display:"flex", alignItems:"center" }} onClick={()=>deleteItem(item.id)}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}