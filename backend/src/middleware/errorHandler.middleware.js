export function errorHandler(err, _req, res, _next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Validation error', errors: Object.values(err.errors).map((e) => e.message) })
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Valeur déjà utilisée' })
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Identifiant invalide' })
  }
  return res.status(500).json({ success: false, message: err.message || 'Erreur serveur' })
}
