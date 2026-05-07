import { env } from '../config/env.js'

export function notifyAdminNewOrder(order) {
  const msg = `
🛋 Nouvelle commande *${order.orderNumber}*
Client: ${order.customer.fullName}
Téléphone: ${order.customer.phone}
Total: ${order.total.toFixed(3)} TND
Produits: ${order.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ')}
Adresse: ${order.customer.address.street}, ${order.customer.address.city}
${order.customer.comments ? `Note: ${order.customer.comments}` : ''}
  `.trim()

  const url = `https://wa.me/${env.WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
  // eslint-disable-next-line no-console
  console.log('📱 WhatsApp notification URL:', url)
  return url
}
