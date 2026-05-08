import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/connexion" replace />

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`

  return (
    <main className="min-h-screen bg-blush-soft px-5 py-12 pt-[96px] md:px-12 md:py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 rounded-[20px] bg-white p-8 shadow-soft lg:w-[260px]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/30 bg-rust/10 font-cormorant text-[22px] text-gold lg:mx-0">
            {initials}
          </div>
          <p className="mt-6 text-center font-dm text-lg font-medium text-espresso lg:text-left">
            {user.firstName} {user.lastName}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-rust/10 pt-8">
            <div>
              <p className="font-cormorant text-[28px] text-gold">0</p>
              <p className="font-dm text-[11px] text-espresso/45">Commandes</p>
            </div>
            <div>
              <p className="font-cormorant text-[28px] text-gold">0</p>
              <p className="font-dm text-[11px] text-espresso/45">Favoris</p>
            </div>
          </div>
          <nav className="mt-8 space-y-1 border-t border-rust/10 pt-8">
            <p className="rounded-[8px] border-l-2 border-gold bg-rust/[0.06] py-2 pl-3 font-dm text-sm font-medium text-rust">Profil</p>
            <p className="cursor-pointer rounded-[8px] py-2 pl-3 font-dm text-sm text-espresso/55 hover:text-espresso">Commandes</p>
          </nav>
        </aside>

        <section className="flex-1 rounded-[20px] bg-white p-8 shadow-soft md:p-10">
          <h1 className="font-cormorant text-4xl font-light text-espresso">Bonjour {user.firstName}</h1>
          <p className="mt-3 font-dm text-sm text-espresso/55">{user.email}</p>
          <p className="mt-10 font-dm text-sm leading-relaxed text-espresso/50">
            Votre espace client évolue : historique des commandes, listes d&apos;envies et suivi en temps réel arrivent très bientôt.
          </p>
        </section>
      </div>
    </main>
  )
}
