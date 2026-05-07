import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans CartProvider')
  return ctx
}
