import { createContext, useContext, useReducer } from "react"
const CartContext = createContext(null)
const initialState = { items: [], tableNumber: null, mood: null, specialInstructions: "" }
function cartReducer(state, action) {
  switch (action.type) {
    case "SET_TABLE": return { ...state, tableNumber: action.payload }
    case "SET_MOOD": return { ...state, mood: action.payload }
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i) }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case "REMOVE_ITEM": return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case "UPDATE_QTY": return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: Math.max(0, action.payload.qty) } : i).filter(i => i.quantity > 0) }
    case "SET_INSTRUCTIONS": return { ...state, specialInstructions: action.payload }
    case "CLEAR_CART": return { ...initialState }
    default: return state
  }
}
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  return <CartContext.Provider value={{ ...state, total, itemCount, dispatch }}>{children}</CartContext.Provider>
}
export const useCart = () => useContext(CartContext)
