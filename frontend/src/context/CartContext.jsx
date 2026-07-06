import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { formatPrice } from '../data/products'

export const CartContext = createContext(null)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

function cartKey(productId, variant) {
  return variant ? `${productId}__${variant.name}` : `${productId}__`
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem('aurya-cart')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        // Migrate old cart items that don't have _key
        const migrated = parsed.map((item) => ({
          ...item,
          _key: item._key || `${item.product?.id || item.product?._id}__`,
          variant: item.variant || null,
        }))
        setItems(migrated)
      } catch {
        localStorage.removeItem('aurya-cart')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('aurya-cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product, variant = null) => {
    const key = cartKey(product.id, variant)
    setItems((prev) => {
      const found = prev.find((i) => i._key === key)
      if (found) return prev.map((i) => i._key === key ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { _key: key, product, quantity: 1, variant: variant || null }]
    })
    toast.success(variant ? `${variant.name} ajouté au panier` : 'Ajouté au panier')
  }

  const removeFromCart = (key) => setItems((prev) => prev.filter((i) => i._key !== key))

  const updateQty = (key, qty) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i._key !== key)
        : prev.map((i) => (i._key === key ? { ...i, quantity: qty } : i)),
    )

  const clearCart = () => setItems([])

  const isInCart = (id) => items.some((i) => i.product.id === id)

  const getItemPrice = (item) => item.variant?.price ?? item.product.price

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items])
  const totalPrice = useMemo(
    () => formatPrice(items.reduce((acc, i) => acc + i.quantity * getItemPrice(i), 0)),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalItems,
      totalPrice,
      isInCart,
      getItemPrice,
    }),
    [items, totalItems, totalPrice],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
