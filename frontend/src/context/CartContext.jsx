import { createContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { formatPrice } from '../data/products'

export const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem('aurya-cart')
    if (raw) setItems(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('aurya-cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id)
      if (found) return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      return [...prev, { product, quantity: 1 }]
    })
    toast.success('Ajouté au panier')
  }

  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i.product.id !== id))
  const updateQty = (id, qty) => setItems((prev) => (qty <= 0 ? prev.filter((i) => i.product.id !== id) : prev.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i))))
  const clearCart = () => setItems([])
  const isInCart = (id) => items.some((i) => i.product.id === id)

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items])
  const totalPrice = useMemo(() => formatPrice(items.reduce((acc, i) => acc + i.quantity * i.product.price, 0)), [items])

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice, isInCart }}>
      {children}
    </CartContext.Provider>
  )
}
