import { verifyAccessToken } from '../utils/jwt.utils.js'

export function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ success: false, message: 'Non autorisé' })
    req.user = verifyAccessToken(token)
    return next()
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalide' })
  }
}

export function optionalAuth(req, _res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) req.user = verifyAccessToken(token)
  } catch {
    req.user = null
  }
  next()
}
