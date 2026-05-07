import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)

export async function summary(_req, res) {
  const [delivered, thisMonth, lastMonth, totalOrders, ordersThisMonth, pendingOrders, totalProducts, totalCustomers, topProducts, recentOrders] = await Promise.all([
    Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, revenue: { $sum: '$total' } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: startOfMonth }, status: 'delivered' } }, { $group: { _id: null, revenue: { $sum: '$total' } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }, status: 'delivered' } }, { $group: { _id: null, revenue: { $sum: '$total' } } }]),
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.countDocuments({ status: 'pending' }),
    Product.countDocuments({ isAvailable: true }),
    User.countDocuments({ role: 'customer' }),
    Product.find({ isAvailable: true }).sort({ orderCount: -1 }).limit(5),
    Order.find().sort({ createdAt: -1 }).limit(5),
  ])
  const totalRevenue = delivered[0]?.revenue || 0
  const revenueThisMonth = thisMonth[0]?.revenue || 0
  const revenueLastMonth = lastMonth[0]?.revenue || 0
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0
  return res.json({
    success: true,
    data: { totalRevenue, revenueThisMonth, revenueLastMonth, totalOrders, ordersThisMonth, pendingOrders, totalProducts, totalCustomers, avgOrderValue, topProducts, recentOrders },
    message: 'Résumé analytics',
  })
}

export async function revenue(req, res) {
  const period = req.query.period || '30d'
  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30
  const from = new Date()
  from.setDate(from.getDate() - days)
  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: from } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orderCount: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])
  return res.json({ success: true, data, message: 'Revenus par période' })
}

export async function ordersByStatus(_req, res) {
  const data = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
  return res.json({ success: true, data, message: 'Répartition des statuts' })
}

export async function topProducts(req, res) {
  const limit = Number(req.query.limit || 10)
  const data = await Product.find({ isAvailable: true }).sort({ orderCount: -1 }).limit(limit)
  return res.json({ success: true, data, message: 'Top produits' })
}

export async function customers(_req, res) {
  const data = await User.find({ role: 'customer' }).sort({ totalSpent: -1 }).limit(50)
  return res.json({ success: true, data, message: 'Insights clients' })
}
