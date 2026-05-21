let cached = null

function apiBase() {
  const url = import.meta.env.VITE_API_URL || '/api'
  return url.replace(/\/+$/, '')
}

/** Charge /api/config pour résoudre les URLs /uploads quand le front est sur un autre domaine. */
export async function loadPublicConfig() {
  if (cached) return cached
  try {
    const res = await fetch(`${apiBase()}/config`, { credentials: 'include' })
    const json = await res.json()
    const uploadsBase = json?.data?.uploadsBase || ''
    const origin = uploadsBase.replace(/\/uploads\/?$/i, '').replace(/\/+$/, '')
    cached = { uploadsOrigin: origin, apiBase: json?.data?.apiBase || apiBase() }
  } catch {
    cached = { uploadsOrigin: '', apiBase: apiBase() }
  }
  return cached
}

export function getUploadsOrigin() {
  return cached?.uploadsOrigin || ''
}
