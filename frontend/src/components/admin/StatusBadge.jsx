const map = {
  pending:          'bg-[rgba(168,145,64,0.12)] text-[#8a7330]',
  confirmed:        'bg-[rgba(74,144,217,0.12)] text-[#2563a8]',
  preparing:        'bg-[rgba(184,134,11,0.12)] text-[#92690a]',
  out_for_delivery: 'bg-[rgba(107,122,95,0.12)] text-[#4a5c3f]',
  delivered:        'bg-[rgba(46,125,82,0.12)] text-[#1e6b43]',
  cancelled:        'bg-[rgba(192,57,43,0.12)] text-[#9b2d1e]',
}

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 font-josefin text-[7px] uppercase tracking-[0.12em] ${map[status] || map.pending}`}>
    {status?.replaceAll('_', ' ')}
  </span>
)

export default StatusBadge
