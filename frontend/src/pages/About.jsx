import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import PageTransition from '../components/ui/PageTransition'
import SectionReveal from '../components/ui/SectionReveal'

const stats = [
  { num: '2015', label: 'Fondée à Tunis' },
  { num: '200+', label: 'Pièces Curatées' },
  { num: '18',   label: 'Artisans Partenaires' },
  { num: '100%', label: 'Matériaux Premium' },
]

const pillars = [
  {
    title: 'Artisanat local',
    body: 'Nous travaillons avec des artisans tunisiens de renom pour allier savoir-faire ancestral et design contemporain.',
  },
  {
    title: 'Standards mondiaux',
    body: "Chaque pièce répond aux standards internationaux de qualité — sélectionnée pour sa durabilité, son esthétique et son âme.",
  },
  {
    title: 'Design intemporel',
    body: "Nos collections transcendent les tendances éphémères pour créer des espaces qui s'améliorent avec le temps.",
  },
]

export default function About() {
  const reduce = useReducedMotion()

  return (
    <PageTransition>
      <main className="bg-cream pt-[60px] md:pt-[72px]">

        {/* Hero split */}
        <section className="grid grid-cols-1 md:grid-cols-[52%_48%] min-h-[80vh]">
          <div className="flex flex-col justify-center px-6 py-16 md:px-16 md:py-24 lg:px-24 order-2 md:order-1">
            <SectionReveal>
              <p className="eyebrow mb-5">Notre histoire</p>
              <h1
                className="font-cormorant font-light leading-[1.04] text-ink"
                style={{ fontSize: 'clamp(44px, 5.5vw, 80px)' }}
              >
                Nés de la passion{' '}
                <em className="italic text-bark">du beau</em>
              </h1>
              <span className="warm-rule my-6" />
              <p className="max-w-lg text-[14px] leading-8 text-stone">
                Aurya Deco est née à Tunis d&apos;une obsession simple : composer des intérieurs nobles, précis et intemporels. Notre équipe marie artisanat local et standards internationaux pour livrer des espaces d&apos;exception.
              </p>
              <div className="mt-8 flex gap-3">
                <Link to="/collections" className="btn-bark inline-flex items-center gap-2">
                  Nos collections <FiArrowRight size={13} />
                </Link>
                <Link to="/contact" className="btn-outline-bark">
                  Nous contacter
                </Link>
              </div>
            </SectionReveal>
          </div>

          {/* Image placeholder */}
          <div className="relative order-1 md:order-2 min-h-[320px] bg-parchment overflow-hidden">
            <div className="absolute inset-0 warm-pattern" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <img
                src="/logo2.png"
                alt=""
                aria-hidden="true"
                className="w-40 md:w-56 opacity-[0.07]"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="absolute inset-0 flex items-end justify-center pb-10">
              <p className="font-cormorant text-[80px] md:text-[120px] italic font-light text-bark/[0.05] leading-none select-none">
                Univers
              </p>
            </div>
            <span className="absolute left-6 top-6 h-8 w-8 border-l-[1.5px] border-t-[1.5px] border-bark/20" />
            <span className="absolute right-6 bottom-6 h-8 w-8 border-r-[1.5px] border-b-[1.5px] border-bark/20" />
          </div>
        </section>

        {/* Stats band */}
        <section className="border-y border-nude/50 bg-parchment px-5 py-10 md:px-16">
          <div className="mx-auto max-w-[1440px] grid grid-cols-2 gap-px md:grid-cols-4">
            {stats.map(({ num, label }, i) => (
              <motion.div
                key={label}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="px-6 py-8 text-center"
              >
                <p className="font-cormorant text-[44px] font-light text-bark leading-none">{num}</p>
                <p className="mt-2 font-josefin text-[8px] uppercase tracking-[0.24em] text-stone">{label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pillars */}
        <section className="px-5 py-16 md:px-16 md:py-24">
          <SectionReveal>
            <p className="eyebrow mb-4">Nos valeurs</p>
            <h2 className="font-cormorant font-light text-ink mb-12" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
              Ce qui nous <em className="italic text-bark">définit</em>
            </h2>
          </SectionReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map(({ title, body }, i) => (
              <motion.div
                key={title}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="rounded-card border border-nude/50 bg-parchment p-8 transition-shadow hover:shadow-card"
              >
                <span className="font-cormorant text-4xl font-light text-bark/30">0{i + 1}</span>
                <h3 className="mt-4 font-cormorant text-2xl font-light text-ink">{title}</h3>
                <span className="warm-rule my-4" />
                <p className="text-[13px] leading-7 text-stone">{body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mx-5 mb-16 md:mx-16 md:mb-24 rounded-card overflow-hidden bg-sage-dark px-8 py-14 md:px-16 md:py-20 text-center">
          <SectionReveal>
            <p className="font-josefin text-[8px] uppercase tracking-[0.34em] text-nude/60 mb-4">
              Commençons ensemble
            </p>
            <h2 className="font-cormorant font-light text-cream" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Votre espace <em className="italic text-nude">mérite l&apos;excellence</em>
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 bg-cream px-7 py-3 font-josefin text-[9px] uppercase tracking-[0.22em] text-bark transition-colors hover:bg-nude"
              >
                Découvrir les collections <FiArrowRight size={12} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-cream/25 px-7 py-3 font-josefin text-[9px] uppercase tracking-[0.22em] text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                Nous contacter <FiArrowRight size={12} />
              </Link>
            </div>
          </SectionReveal>
        </section>

      </main>
    </PageTransition>
  )
}
