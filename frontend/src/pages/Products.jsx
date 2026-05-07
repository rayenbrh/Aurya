import { useMemo, useState } from 'react'
import PageTransition from '../components/ui/PageTransition'
import ProductCard from '../components/ui/ProductCard'
import ProductModal from '../components/ui/ProductModal'
import { categories } from '../data/categories'
import { products } from '../data/products'
import { useCart } from '../hooks/useCart'

const Products = () => {
  const [category, setCategory] = useState('tout')
  const [sort, setSort] = useState('pertinence')
  const [selected, setSelected] = useState(null)
  const { addToCart } = useCart()
  const list = useMemo(() => {
    let out = category === 'tout' ? [...products] : products.filter((p) => p.category === category)
    if (sort === 'croissant') out.sort((a, b) => a.price - b.price)
    if (sort === 'decroissant') out.sort((a, b) => b.price - a.price)
    if (sort === 'nouveau') out.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)))
    return out
  }, [category, sort])
  return (
    <PageTransition>
      <main className="pt-[58px] md:pt-[68px]">
        <section className="grid-pattern grid h-[200px] place-items-center border-b border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 md:h-[300px]">
          <div className="text-center"><p className="eyebrow justify-center">{category === 'tout' ? 'Toutes les collections' : categories.find((c) => c.slug === category)?.name}</p><h1 className="font-cormorant text-5xl font-light md:text-7xl">Collections</h1><p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-gold">{list.length} pièces</p></div>
        </section>
        <section className="sticky top-[58px] z-30 border-b border-[0.5px] border-[rgba(201,168,76,0.22)] bg-[rgba(17,17,17,0.96)] px-5 py-3 backdrop-blur md:top-[68px] md:px-16">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">{['tout', ...categories.map((c) => c.slug)].map((c) => <button key={c} onClick={() => setCategory(c)} className={`border border-[0.5px] px-3 py-2 font-josefin text-[8px] uppercase tracking-[0.15em] ${category === c ? 'border-gold bg-gold text-black' : 'border-[rgba(255,255,255,0.10)] text-[rgba(255,255,255,0.45)]'}`}>{c === 'tout' ? 'Tout' : categories.find((x) => x.slug === c)?.name}</button>)}</div>
            <div className="flex items-center gap-2">
              <span className="hidden font-josefin text-[8px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.35)] md:inline">Trier par</span>
              <select
                aria-label="Trier les produits"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundColor: '#111111',
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23C9A84C' stroke-width='1' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '10px 6px',
                  border: '0.5px solid rgba(201,168,76,0.35)',
                  borderRadius: '0px',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '10px 36px 10px 14px',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '160px',
                }}
              >
                <option style={{ backgroundColor: '#181818', color: 'rgba(255,255,255,0.85)', fontFamily: "'Josefin Sans', sans-serif", fontSize: '9px', letterSpacing: '0.15em' }} value="pertinence">PERTINENCE</option>
                <option style={{ backgroundColor: '#181818', color: 'rgba(255,255,255,0.85)', fontFamily: "'Josefin Sans', sans-serif", fontSize: '9px', letterSpacing: '0.15em' }} value="croissant">PRIX CROISSANT</option>
                <option style={{ backgroundColor: '#181818', color: 'rgba(255,255,255,0.85)', fontFamily: "'Josefin Sans', sans-serif", fontSize: '9px', letterSpacing: '0.15em' }} value="decroissant">PRIX DÉCROISSANT</option>
                <option style={{ backgroundColor: '#181818', color: 'rgba(255,255,255,0.85)', fontFamily: "'Josefin Sans', sans-serif", fontSize: '9px', letterSpacing: '0.15em' }} value="nouveau">NOUVEAUTÉS</option>
              </select>
            </div>
          </div>
        </section>
        <section className="px-5 py-10 md:px-16">
          <div className="grid w-full grid-cols-1 gap-[1px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <div key={p.id} className="[&>article]:w-full">
                <ProductCard product={p} onOpen={setSelected} onAdd={addToCart} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <ProductModal product={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </PageTransition>
  )
}

export default Products
