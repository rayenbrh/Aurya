import LogoFull from '../ui/LogoFull'

const Footer = () => (
  <footer className="border-t border-[0.5px] border-[rgba(201,168,76,0.2)] bg-obsidian px-5 pb-8 pt-14 md:px-16 md:pb-12 md:pt-20">
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
      <div><LogoFull /><p className="mt-5 max-w-xs font-cormorant text-[15px] italic text-[rgba(255,255,255,0.45)]">Chaque espace mérite d'être une oeuvre d'art.</p></div>
      <div><p className="mb-5 font-josefin text-[8px] uppercase tracking-[0.3em] text-gold">Collections</p>{['Salons', 'Chambres', 'Salle à manger', 'Luminaires', 'Tapis', 'Accessoires'].map((i) => <p key={i} className="mb-2 text-sm text-[rgba(255,255,255,0.45)]">{i}</p>)}</div>
      <div><p className="mb-5 font-josefin text-[8px] uppercase tracking-[0.3em] text-gold">Services</p>{['Conseil design', 'Livraison', 'Installation', 'Garantie', 'Sur mesure'].map((i) => <p key={i} className="mb-2 text-sm text-[rgba(255,255,255,0.45)]">{i}</p>)}</div>
      <div><p className="mb-5 font-josefin text-[8px] uppercase tracking-[0.3em] text-gold">Nous trouver</p>{['Tunis, Tunisie', '+216 XX XXX XXX', 'Lun–Sam: 9h–19h', 'contact@auryadeco.tn'].map((i) => <p key={i} className="mb-2 text-sm text-[rgba(255,255,255,0.45)]">{i}</p>)}</div>
    </div>
    <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[0.5px] border-[rgba(255,255,255,0.07)] pt-6 text-xs text-[rgba(255,255,255,0.45)] md:flex-row">
      <p>© 2025 Aurya Deco · Tous droits réservés</p>
      <p className="font-josefin uppercase tracking-[0.22em] text-gold">LUXE · EXCELLENCE · TUNISIE</p>
    </div>
  </footer>
)

export default Footer
