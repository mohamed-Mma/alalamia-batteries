import { MessageCircle, Zap } from 'lucide-react'

export default function ProductCard({ product }) {
  const message = `السلام عليكم، عايز أستفسر عن ${product.name}${product.price ? ` بسعر ${product.price} جنيه` : ''}.`
  const wa = `https://wa.me/201221266672?text=${encodeURIComponent(message)}`
  return (
    <article className="product-card">
      <div className="product-image">
        {product.image ? <img src={product.image} alt={product.name} loading="lazy" /> : <div className="battery-placeholder"><Zap size={38} /><span>{product.brand || 'BATTERY'}</span></div>}
        {product.featured && <span className="product-badge">مميز</span>}
        {!product.available && <span className="unavailable-badge">غير متاح حاليًا</span>}
      </div>
      <div className="product-info">
        <span className="product-brand">{product.brand || 'بطاريات سيارات'}</span>
        <h3>{product.name}</h3>
        <p className="product-amp">{product.amp || 'اسألنا عن السعة المناسبة'}</p>
        <div className="product-bottom">
          <strong className="product-price">{product.price ? `${Number(product.price).toLocaleString('ar-EG')} ج.م` : 'السعر عند التواصل'}</strong>
          <a className="small-order" href={wa} target="_blank" rel="noreferrer" aria-label={`اسأل عن ${product.name}`}><MessageCircle size={16} /> اسأل الآن</a>
        </div>
      </div>
    </article>
  )
}
