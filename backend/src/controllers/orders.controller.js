import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { notifyAdminNewOrder } from '../utils/whatsapp.utils.js'

const maskPhone = (phone = '') => phone.replace(/(\d{3})\d+(\d{2})/, '$1****$2')

export async function createOrder(req, res) {
  const { items = [], customer, notes, source } = req.body
  if (!items.length) return res.status(400).json({ success: false, message: 'Panier vide' })
  const ids = items.map((i) => i.productId)
  const products = await Product.find({ _id: { $in: ids }, isAvailable: true })
  const mapped = items.map((i) => {
    const p = products.find((x) => String(x._id) === String(i.productId))
    if (!p) throw new Error('Produit invalide')
    return {
      product: p._id,
      productName: p.name,
      productBgLabel: p.bgLabel,
      quantity: i.quantity,
      price: p.price,
    }
  })
  const order = await Order.create({
    user: req.user?.id || null,
    customer,
    items: mapped,
    notes,
    source: source || 'website',
  })
  order.whatsappUrl = notifyAdminNewOrder(order)
  await Promise.all(mapped.map((m) => Product.findByIdAndUpdate(m.product, { $inc: { orderCount: m.quantity } })))
  if (req.user?.id) {
    await User.findByIdAndUpdate(req.user.id, { $inc: { orderCount: 1, totalSpent: order.total } })
  }
  return res.status(201).json({ success: true, data: { order }, message: 'Commande créée' })
}

export async function trackOrder(req, res) {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber })
  if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable' })
  return res.json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      statusHistory: order.statusHistory,
      items: order.items,
      customer: { fullName: order.customer.fullName, maskedPhone: maskPhone(order.customer.phone) },
    },
    message: 'Suivi chargé',
  })
}

export async function myOrders(req, res) {
  const { page = 1, limit = 10 } = req.query
  const q = { user: req.user.id }
  const total = await Order.countDocuments(q)
  const orders = await Order.find(q).sort({ createdAt: -1 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit))
  return res.json({ success: true, data: { orders, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) }, message: 'Historique commandes' })
}
