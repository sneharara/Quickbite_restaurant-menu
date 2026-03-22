import { createContext, useContext, useState } from "react"
const AuthContext = createContext(null)
const VALID_STAFF = [
  { email: "sneha.cs27@iilm.edu", password: "welcometoquickbite", role: "admin", name: "Sneha" },
  { email: "bhavya.luthra.cs27@iilm.edu", password: "welcometoquickbite", role: "admin", name: "Bhavya" },
]
export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(() => { const s = localStorage.getItem("qb_staff"); return s ? JSON.parse(s) : null })
  const signIn = async (email, password) => {
    const found = VALID_STAFF.find(s => s.email === email.toLowerCase().trim() && s.password === password)
    if (!found) throw new Error("Invalid email or password")
    const staffData = { email: found.email, role: found.role, name: found.name }
    localStorage.setItem("qb_staff", JSON.stringify(staffData))
    setStaff(staffData)
    return staffData
  }
  const signOut = () => { localStorage.removeItem("qb_staff"); setStaff(null) }
  return <AuthContext.Provider value={{ staff, signIn, signOut, isAuthenticated: !!staff }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
