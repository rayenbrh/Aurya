const map = {
  pending: 'bg-[rgba(201,168,76,0.15)] text-gold',
  confirmed: 'bg-[rgba(74,144,217,0.15)] text-[#4A90D9]',
  preparing: 'bg-[rgba(184,134,11,0.15)] text-[#B8860B]',
  out_for_delivery: 'bg-[rgba(123,104,238,0.15)] text-[#7B68EE]',
  delivered: 'bg-[rgba(46,125,82,0.15)] text-[#2E7D52]',
  cancelled: 'bg-[rgba(192,57,43,0.15)] text-[#C0392B]',
}

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 font-josefin text-[7px] uppercase tracking-[0.12em] ${map[status] || map.pending}`}>
    {status?.replaceAll('_', ' ')}
  </span>
)

export default StatusBadge
