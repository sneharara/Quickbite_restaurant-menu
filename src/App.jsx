import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import QRPage from "./pages/QRPage"
import Tables from "./pages/Tables"
import Welcome from "./pages/Welcome"
import MoodSelection from "./pages/MoodSelection"
import Menu from "./pages/Menu"
import Cart from "./pages/Cart"
import Payment from "./pages/Payment"
import OrderTracking from "./pages/OrderTracking"
import StaffLanding from "./pages/StaffLanding"
import KitchenLogin from "./pages/KitchenLogin"
import AdminLogin from "./pages/AdminLogin"
import Kitchen from "./pages/Kitchen"
import Admin from "./pages/Admin"
import ProtectedRoute from "./components/ProtectedRoute"
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer routes only */}
            <Route path="/" element={<Welcome />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/qr" element={<QRPage />} />
            <Route path="/table/:tableNumber/mood" element={<MoodSelection />} />
            <Route path="/table/:tableNumber/menu" element={<Menu />} />
            <Route path="/table/:tableNumber/cart" element={<Cart />} />
            <Route path="/table/:tableNumber/payment" element={<Payment />} />
            <Route path="/table/:tableNumber/order/:orderId" element={<OrderTracking />} />
            {/* Staff routes - completely separate */}
            <Route path="/staff" element={<StaffLanding />} />
            <Route path="/kitchen/login" element={<KitchenLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/kitchen" element={<ProtectedRoute><Kitchen /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}