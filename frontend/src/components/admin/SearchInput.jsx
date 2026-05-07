const SearchInput = ({ value, onChange, placeholder = 'Rechercher...' }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="auth-input w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-2 font-josefin text-[9px] uppercase tracking-[0.12em]"
  />
)

export default SearchInput
