import { requireAuth } from './auth.middleware.js'

export function adminOnly(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé' })
    }
    return next()
  })
}
