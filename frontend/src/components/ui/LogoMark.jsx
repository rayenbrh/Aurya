const LogoMark = ({ size = 40, variant = 'gold' }) => {
  return (
    <img
      src="/logo.png"
      alt="Aurya Deco"
      width={size}
      height={size}
      style={{
        objectFit: 'contain',
        display: 'block',
        filter: variant === 'dark' ? 'invert(1)' : 'none',
      }}
    />
  )
}

export default LogoMark
