import { FiInstagram, FiFacebook, FiArrowRight, FiPhone } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-sage-dark px-6 py-20 md:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-2 lg:grid-cols-6">

        {/* Brand */}
        <div className="lg:col-span-2">
          <p className="font-cormorant text-[26px] italic font-light text-cream/90">Aurya</p>
          <span className="mt-3 block h-px w-8 bg-bark/40" />
          <p className="mt-5 max-w-[260px] text-[13px] leading-7 text-nude/55">
            Mobilier et décoration haut de gamme, imaginés pour les intérieurs tunisiens les plus exigeants.
          </p>
          <a
            href="tel:+21693091290"
            className="mt-5 flex items-center gap-2.5 text-nude/70 transition-colors hover:text-cream"
          >
            <FiPhone size={14} className="text-bark" />
            <span className="font-josefin text-[12px] tracking-wide">+216 93 091 290</span>
          </a>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/40 transition-colors hover:border-cream/50 hover:text-cream/90">
              <FiInstagram size={15} />
            </a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/40 transition-colors hover:border-cream/50 hover:text-cream/90">
              <FiFacebook size={15} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <p className="font-josefin text-[9px] uppercase tracking-[0.24em] text-nude/45">Shop</p>
          <ul className="mt-5 space-y-3 text-[13px] text-nude/60">
            {['Mobilier', 'Luminaires', 'Décoration', 'Pièces de caractère', 'Nouveautés'].map((x) => (
              <li key={x}>
                <Link to="/collections" className="transition-colors hover:text-cream/90">{x}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="font-josefin text-[9px] uppercase tracking-[0.24em] text-nude/45">Entreprise</p>
          <ul className="mt-5 space-y-3 text-[13px] text-nude/60">
            <li><Link to="/a-propos" className="transition-colors hover:text-cream/90">À propos</Link></li>
            {['Nos Matériaux', 'Durabilité', 'Carrières', 'Presse'].map((x) => (
              <li key={x}><span className="cursor-pointer transition-colors hover:text-cream/90">{x}</span></li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <p className="font-josefin text-[9px] uppercase tracking-[0.24em] text-nude/45">Service client</p>
          <ul className="mt-5 space-y-3 text-[13px] text-nude/60">
            <li><Link to="/contact" className="transition-colors hover:text-cream/90">Contact</Link></li>
            {['Livraison', 'Retours', 'FAQ'].map((x) => (
              <li key={x}><span className="cursor-pointer transition-colors hover:text-cream/90">{x}</span></li>
            ))}
            <li><Link to="/suivi" className="transition-colors hover:text-cream/90">Suivi commande</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="font-josefin text-[9px] uppercase tracking-[0.24em] text-nude/45">Newsletter</p>
          <p className="mt-4 text-[13px] leading-6 text-nude/55">Restez inspirés.</p>
          <form className="mt-4 flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Votre email"
              className="min-w-0 flex-1 border border-cream/15 bg-cream/[0.07] px-3 py-2.5 text-[13px] text-cream placeholder:text-cream/30 outline-none focus:border-cream/30"
            />
            <button
              type="submit"
              aria-label="S'inscrire"
              className="grid place-items-center bg-bark px-3 text-cream transition-colors hover:bg-bark-light"
            >
              <FiArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1280px] flex-col gap-4 border-t border-cream/[0.08] pt-8 md:flex-row md:items-center md:justify-between">
        <p className="font-josefin text-[9px] uppercase tracking-[0.16em] text-nude/35">© 2025 Aurya Deco. Tous droits réservés.</p>
        <p className="font-josefin text-[9px] uppercase tracking-[0.12em] text-nude/35">
          <span className="cursor-pointer transition-colors hover:text-nude/70">Confidentialité</span>
          <span className="mx-3">·</span>
          <span className="cursor-pointer transition-colors hover:text-nude/70">Conditions</span>
          <span className="mx-3">·</span>
          <span className="cursor-pointer transition-colors hover:text-nude/70">Accessibilité</span>
        </p>
      </div>
    </footer>
  )
}
