const LogoFull = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <img
      src="/logo.png"
      alt="Aurya Deco"
      style={{
        width: '36px',
        height: '36px',
        objectFit: 'contain',
        display: 'block',
      }}
    />
    <div>
      <div
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: '13px',
          fontWeight: '300',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.92)',
          lineHeight: '1',
        }}
      >
        AURYA DECO
      </div>
      <div
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: '8px',
          fontWeight: '200',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginTop: '3px',
          lineHeight: '1',
        }}
      >
        — INTERIORS —
      </div>
    </div>
  </div>
)

export default LogoFull
