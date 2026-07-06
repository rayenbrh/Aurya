import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowLeft, FiShoppingBag, FiStar, FiPhone, FiZap } from 'react-icons/fi'
import { productsService } from '../services/products.service'
import { normalizeProduct, resolveImageUrl } from '../utils/catalog'
import { useCart } from '../context/CartContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../data/products'

function StarRating({ rating = 5, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          size={size}
          className={s <= Math.round(rating) ? 'fill-olive stroke-olive' : 'stroke-stone/30'}
        />
      ))}
    </div>
  )
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="p-0.5"
          aria-label={`${s} étoile${s > 1 ? 's' : ''}`}
        >
          <FiStar
            size={22}
            className={s <= (hovered || value) ? 'fill-olive stroke-olive' : 'stroke-stone/30'}
          />
        </button>
      ))}
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ authorName: '', rating: 0, comment: '' })
  const [reviewSending, setReviewSending] = useState(false)
  const [reviewSent, setReviewSent] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    productsService.getProduct(slug)
      .then(({ data }) => {
        const p = normalizeProduct(data.data)
        if (!p) { navigate('/collections', { replace: true }); return }
        setProduct(p)
        setActiveImage(p.imageUrl)
        if (p.variants?.length) setSelectedVariant(p.variants[0])
      })
      .catch(() => navigate('/collections', { replace: true }))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!product?._id) return
    api.get('/reviews', { params: { product: product._id } })
      .then(({ data }) => setReviews(data.data || []))
      .catch(() => {})
  }, [product?._id])

  const handleVariantSelect = (v) => {
    setSelectedVariant(v)
    if (v.photo) setActiveImage(v.photo)
  }

  const currentPrice = selectedVariant?.price ?? product?.price ?? 0

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, selectedVariant || null)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/commande')
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!reviewForm.rating) { toast.error('Veuillez sélectionner une note.'); return }
    if (!reviewForm.authorName.trim() || !reviewForm.comment.trim()) {
      toast.error('Nom et commentaire obligatoires.')
      return
    }
    setReviewSending(true)
    try {
      await api.post('/reviews', {
        productId: product._id,
        authorName: reviewForm.authorName.trim(),
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      })
      toast.success('Avis soumis ! Il sera affiché après validation.')
      setReviewSent(true)
      setReviewForm({ authorName: '', rating: 0, comment: '' })
    } catch {
      toast.error('Impossible d\'envoyer l\'avis. Réessayez.')
    } finally {
      setReviewSending(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center pt-[72px]">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="font-cormorant text-3xl italic text-bark"
        >
          Chargement…
        </motion.p>
      </main>
    )
  }

  if (!product) return null

  const allImages = product.images?.length ? product.images : (product.imageUrl ? [product.imageUrl] : [])

  return (
    <>
      <main className="bg-cream pt-[72px] pb-32 md:pb-0">
        {/* Breadcrumb */}
        <div className="px-5 py-4 md:px-16">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50 hover:text-bark transition-colors"
          >
            <FiArrowLeft size={12} /> Retour
          </button>
        </div>

        <div className="mx-auto max-w-[1280px] px-5 md:px-16">
          <div className="grid gap-10 lg:grid-cols-[55%_45%]">

            {/* ── Image gallery ── */}
            <div>
              <motion.div
                className="overflow-hidden rounded-card-lg"
                style={{ backgroundColor: product.bgColor || '#EDE8E0', aspectRatio: '4/3' }}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="font-cormorant text-7xl font-light text-bark/[0.12] italic select-none">
                      {product.name?.split(' ')[0]}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`flex-shrink-0 h-16 w-16 overflow-hidden rounded-card border-2 transition-colors ${activeImage === img ? 'border-bark' : 'border-nude/60'}`}
                      style={{ backgroundColor: product.bgColor || '#EDE8E0' }}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product info ── */}
            <div className="flex flex-col gap-6">
              {/* Category + Name */}
              <div>
                {product.categoryName && (
                  <p className="font-josefin text-[8px] uppercase tracking-[0.26em] text-stone/50 mb-2">{product.categoryName}</p>
                )}
                <h1 className="font-cormorant font-light text-ink" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>
                  {product.name}
                </h1>
                {product.isNew && (
                  <span className="mt-2 inline-block rounded-pill bg-olive px-2.5 py-1 font-josefin text-[7px] uppercase tracking-[0.2em] text-cream">
                    Nouveau
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-josefin text-[28px] font-semibold tabular-nums text-olive">
                  {formatPrice(currentPrice)}
                </span>
                {product.comparePrice > currentPrice && (
                  <span className="font-josefin text-[16px] tabular-nums text-stone/40 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div>
                  <p className="mb-2 font-josefin text-[8px] uppercase tracking-[0.22em] text-stone/50">
                    {product.variants[0].title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => handleVariantSelect(v)}
                        className={`group relative flex flex-col items-center gap-1.5 rounded-card border-2 p-1 transition-colors ${
                          selectedVariant?.name === v.name
                            ? 'border-bark'
                            : 'border-nude/60 hover:border-bark/40'
                        }`}
                      >
                        {v.photo ? (
                          <div className="h-14 w-14 overflow-hidden rounded-card" style={{ backgroundColor: product.bgColor || '#EDE8E0' }}>
                            <img src={v.photo} alt={v.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-card bg-parchment">
                            <span className="font-josefin text-[7px] text-stone/50">{v.name[0]}</span>
                          </div>
                        )}
                        <span className="font-josefin text-[8px] text-stone leading-tight max-w-[64px] text-center">{v.name}</span>
                        <span className="font-josefin text-[8px] tabular-nums text-olive">{formatPrice(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-[14px] leading-8 text-stone">{product.description}</p>
              )}

              {/* Details */}
              {(product.dimensions || product.material) && (
                <div className="border-t border-nude/50 pt-4 space-y-2">
                  {product.dimensions && (
                    <p className="flex gap-3 font-josefin text-[9px]">
                      <span className="uppercase tracking-[0.18em] text-stone/40 w-24 shrink-0">Dimensions</span>
                      <span className="text-stone">{product.dimensions}</span>
                    </p>
                  )}
                  {product.material && (
                    <p className="flex gap-3 font-josefin text-[9px]">
                      <span className="uppercase tracking-[0.18em] text-stone/40 w-24 shrink-0">Matériaux</span>
                      <span className="text-stone">{product.material}</span>
                    </p>
                  )}
                </div>
              )}

              {/* CTA — desktop only (mobile gets sticky bar) */}
              <div className="hidden md:flex flex-col gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="btn-bark h-12 flex items-center justify-center gap-2 w-full"
                >
                  <FiShoppingBag size={15} /> Ajouter au panier
                </button>
                <button
                  onClick={handleBuyNow}
                  className="h-12 flex items-center justify-center gap-2 w-full border border-bark/30 font-josefin text-[9px] uppercase tracking-[0.22em] text-bark hover:bg-bark hover:text-cream transition-colors"
                >
                  <FiZap size={14} /> Commander maintenant
                </button>
                <a
                  href="tel:+21693091290"
                  className="flex items-center justify-center gap-2 font-josefin text-[9px] uppercase tracking-[0.18em] text-stone/50 hover:text-bark transition-colors py-2"
                >
                  <FiPhone size={12} /> +216 93 091 290 — Support
                </a>
              </div>
            </div>
          </div>

          {/* ── Reviews section ── */}
          <div className="mt-20 border-t border-nude/50 pt-16">
            <h2 className="font-cormorant font-light text-ink mb-8" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>
              Avis clients
            </h2>

            {reviews.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-card border border-nude/60 bg-parchment p-5">
                    <StarRating rating={r.rating} />
                    <p className="mt-3 text-[13px] leading-7 text-stone italic">"{r.comment}"</p>
                    <p className="mt-3 font-josefin text-[8px] uppercase tracking-[0.18em] text-stone/50">— {r.authorName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-10 text-[13px] text-stone/50 italic">
                Aucun avis pour ce produit. Soyez le premier à partager votre expérience.
              </p>
            )}

            {/* Submit review form */}
            <div className="max-w-[560px]">
              <h3 className="font-cormorant text-2xl font-light text-ink mb-6">Laisser un avis</h3>
              {reviewSent ? (
                <div className="rounded-card border border-olive/30 bg-olive/5 px-5 py-4">
                  <p className="font-josefin text-[10px] uppercase tracking-[0.18em] text-olive">
                    Merci ! Votre avis sera publié après validation.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitReview} className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Votre nom *</span>
                    <input
                      required
                      className="w-full border-b border-nude/80 bg-transparent pb-2.5 font-josefin text-[11px] text-ink outline-none focus:border-bark"
                      value={reviewForm.authorName}
                      onChange={(e) => setReviewForm((f) => ({ ...f, authorName: e.target.value }))}
                    />
                  </label>
                  <div>
                    <span className="mb-2 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Note *</span>
                    <StarPicker value={reviewForm.rating} onChange={(r) => setReviewForm((f) => ({ ...f, rating: r }))} />
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Commentaire *</span>
                    <textarea
                      required
                      rows={4}
                      className="w-full resize-none border-b border-nude/80 bg-transparent pb-2.5 font-josefin text-[11px] text-ink outline-none focus:border-bark"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={reviewSending}
                    className="btn-bark h-11 px-8 disabled:opacity-60"
                  >
                    {reviewSending ? 'Envoi…' : 'Soumettre l\'avis'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Sticky mobile CTA bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-cream/95 backdrop-blur-md border-t border-nude/60 px-4 py-3 flex items-center gap-3 shadow-float">
        <div className="min-w-0">
          <p className="font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Prix</p>
          <p className="font-josefin text-[20px] font-semibold tabular-nums text-olive leading-none">
            {formatPrice(currentPrice)}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <button
            onClick={handleAddToCart}
            className="btn-bark h-10 flex-1 flex items-center justify-center gap-1.5 text-[8px]"
          >
            <FiShoppingBag size={13} /> Ajouter au panier
          </button>
          <button
            onClick={handleBuyNow}
            className="h-10 flex-1 flex items-center justify-center gap-1.5 border border-bark/30 font-josefin text-[8px] uppercase tracking-[0.16em] text-bark hover:bg-bark hover:text-cream transition-colors"
          >
            <FiZap size={12} /> Commander
          </button>
        </div>
        <a
          href="tel:+21693091290"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-bark/30 text-bark"
          aria-label="Appeler le support"
        >
          <FiPhone size={16} />
        </a>
      </div>
    </>
  )
}
