import PageTransition from '../components/ui/PageTransition'
import GoldCorner from '../components/ui/GoldCorner'

const About = () => (
  <PageTransition>
    <main className="pt-[58px] md:pt-[68px]">
      <section className="grid grid-cols-1 md:grid-cols-[52%_48%]">
        <div className="px-5 py-16 md:px-16 md:py-24">
          <p className="eyebrow">Notre histoire</p>
          <h1 className="mt-6 font-cormorant text-5xl font-light md:text-7xl">Nés de la passion <em className="text-gold">du beau</em></h1>
          <p className="mt-8 max-w-lg text-sm leading-8 text-[rgba(255,255,255,0.45)]">Aurya Deco est née à Tunis d'une obsession simple: composer des intérieurs nobles, précis et intemporels. Notre équipe marie artisanat local et standards internationaux pour livrer des espaces d'exception.</p>
        </div>
        <div className="grid-pattern relative min-h-[280px] bg-dark2 md:min-h-[540px]"><div className="absolute inset-[6%] grid place-items-center border border-[0.5px] border-[rgba(201,168,76,0.2)] bg-dark3"><GoldCorner className="absolute left-0 top-0" /><GoldCorner className="absolute bottom-0 right-0 rotate-180" /><p className="font-cormorant text-6xl text-[rgba(201,168,76,0.07)]">Univers</p></div></div>
      </section>
    </main>
  </PageTransition>
)

export default About
