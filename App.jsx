import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { ArrowLeft, BatteryCharging, CheckCircle2, Clock3, MapPin, MessageCircle, ShieldCheck, Truck, Wrench, Facebook, Phone, ChevronLeft, Sparkles } from 'lucide-react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import AdminPanel from './components/AdminPanel'
import { auth, firebaseConfigured } from './lib/firebase'
import { subscribeProducts } from './lib/products'

const FACEBOOK = import.meta.env.VITE_FACEBOOK_PAGE_URL || 'https://www.facebook.com/AlalamiaBatteries/'
const PHONE_1 = '201221266672'
const PHONE_2 = '201011740705'

function App() {
  const [products, setProducts] = useState([])
  const [adminOpen, setAdminOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [filter, setFilter] = useState('الكل')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => subscribeProducts(setProducts, () => setNotice('تعذر تحميل المنتجات من قاعدة البيانات.')), [])
  useEffect(() => {
    if (!firebaseConfigured || !auth) return
    return onAuthStateChanged(auth, setUser)
  }, [])
  const brands = ['الكل', ...new Set(products.map(p => p.brand).filter(Boolean))]
  const shown = products.filter(p => (filter === 'الكل' || p.brand === filter) && `${p.name} ${p.brand} ${p.amp}`.toLowerCase().includes(query.toLowerCase()))
  const whatsapp = (text = 'السلام عليكم، عايز أستفسر عن بطاريات السيارات وخدمة التوصيل.') => `https://wa.me/${PHONE_1}?text=${encodeURIComponent(text)}`

  return <div className="app-shell">
    <Header onAdmin={() => setAdminOpen(true)} />
    <main>
      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <span className="hero-kicker"><span className="pulse-dot"></span> اختيار موثوق لبطارية عربيتك</span>
          <h1>العالمية <span>للبطاريات</span></h1>
          <p className="hero-subtitle">بطاريات سيارات</p>
          <p className="hero-description">خبرة أكثر من ثلاثين عامًا في مجال البطاريات، ومساعدة في اختيار البطارية المناسبة لسيارتك.</p>
          <div className="hero-points"><span><CheckCircle2 size={17}/> ماركات متنوعة</span><span><CheckCircle2 size={17}/> ضمان حسب المنتج</span><span><CheckCircle2 size={17}/> تواصل مباشر</span></div>
          <div className="hero-actions"><a className="primary-button" href={whatsapp()} target="_blank" rel="noreferrer"><MessageCircle size={18}/> تواصل عبر واتساب</a><a className="secondary-button" href="#products">تصفح المنتجات <ArrowLeft size={17}/></a></div>
          <div className="hero-contact"><Phone size={16}/><a href={`tel:+${PHONE_1}`}>01221266672</a><span className="contact-divider">|</span><a href={`tel:+${PHONE_2}`}>01011740705</a></div>
        </div>
        <div className="hero-visual" aria-label="بطارية سيارة">
          <div className="hero-glow"></div><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
          <div className="hero-battery"><div className="battery-top"><i></i><i></i></div><div className="battery-label"><span className="battery-brand">VARTA</span><strong>POWER</strong><small>CAR BATTERY</small></div><div className="battery-side"></div></div>
          <div className="floating-tag"><ShieldCheck size={20}/><span><strong>اختيار مناسب</strong><small>بمساعدة فريقنا</small></span></div>
          <div className="visual-caption"><span className="red-line"></span> طاقة تبدأ من هنا</div>
        </div>
        <div className="hero-bottom-line"></div>
      </section>

      <section className="benefits section-wrap" aria-label="مميزات الخدمة">
        <div className="benefit"><span className="benefit-icon"><Truck/></span><div><strong>خدمة توصيل</strong><small>استفسر عن المناطق المتاحة</small></div></div>
        <div className="benefit"><span className="benefit-icon"><ShieldCheck/></span><div><strong>ضمان موضح</strong><small>تفاصيل الضمان حسب البطارية</small></div></div>
        <div className="benefit"><span className="benefit-icon"><BatteryCharging/></span><div><strong>ماركات متنوعة</strong><small>اختيارات تناسب احتياجك</small></div></div>
        <div className="benefit"><span className="benefit-icon"><Clock3/></span><div><strong>تواصل سريع</strong><small>اسألنا عن المتاح والأسعار</small></div></div>
      </section>

      <section className="section-wrap products-section" id="products">
        <div className="section-heading"><div><span className="eyebrow">كتالوج المنتجات</span><h2>اختار بطاريتك <span>بسهولة</span></h2><p>الأسعار والتوفر يتم تأكيدهما عند التواصل مع المحل.</p></div><a className="text-link" href={whatsapp('السلام عليكم، محتاج مساعدة في اختيار بطارية مناسبة لعربيتي.')} target="_blank" rel="noreferrer">ساعدني أختار <ChevronLeft size={18}/></a></div>
        <div className="product-toolbar"><div className="brand-filters">{brands.map(b=><button key={b} className={filter===b?'filter-chip active':'filter-chip'} onClick={()=>setFilter(b)}>{b}</button>)}</div><input className="product-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن بطارية أو ماركة..." aria-label="البحث عن المنتجات"/></div>
        {notice && <p className="inline-notice">{notice}</p>}
        <div className="product-grid">{shown.map(p=><ProductCard key={p.id} product={p}/>)}</div>
        <p className="demo-note">ملاحظة: المنتجات الظاهرة مبدئية للعرض، ولا تمثل تأكيدًا لتوفر المخزون أو الأسعار. يمكن للإدارة استبدالها بالمنتجات الحقيقية من لوحة التحكم بعد إعداد Firebase.</p>
      </section>

      <section className="offer-banner section-wrap" id="offers">
        <div className="offer-art"><div className="offer-ring"></div><BatteryCharging size={100}/></div>
        <div className="offer-copy"><span className="eyebrow"><Sparkles size={14}/> عروض وخدمات</span><h2>مش متأكد تختار أنهي بطارية؟</h2><p>ابعتلنا نوع العربية والموديل، وهنساعدك تستفسر عن الاختيارات المناسبة والمتاحة.</p></div>
        <a className="primary-button" href={whatsapp('السلام عليكم، محتاج مساعدة في اختيار بطارية مناسبة.')} target="_blank" rel="noreferrer">اسألنا الآن <ArrowLeft size={17}/></a>
      </section>

      <section className="about-section section-wrap" id="about">
        <div className="about-visual"><img src="/assets/brand-banner-reference.png" alt="الهوية البصرية للعالمية للبطاريات" loading="lazy"/><div className="about-stamp"><span>30+</span><small>عامًا من الخبرة</small></div></div>
        <div className="about-copy"><span className="eyebrow">من نحن</span><h2>العالمية للبطاريات</h2><p>نساعدك في الاستفسار عن بطاريات السيارات واختيار المنتج المناسب، مع توضيح السعر والتوفر والضمان قبل إتمام الطلب.</p><ul><li><CheckCircle2/> تواصل مباشر وواضح</li><li><CheckCircle2/> تفاصيل المنتج قبل الشراء</li><li><CheckCircle2/> استفسر عن خدمة التوصيل</li></ul><a className="secondary-button" href={FACEBOOK} target="_blank" rel="noreferrer"><Facebook size={17}/> تابع صفحتنا على فيسبوك</a></div>
      </section>

      <section className="social-section section-wrap" id="facebook">
        <div className="section-heading"><div><span className="eyebrow">تابع آخر أخبارنا</span><h2>من صفحة <span>فيسبوك</span></h2><p>شوف أحدث المنشورات والعروض من صفحتنا الرسمية.</p></div><a className="secondary-button" href={FACEBOOK} target="_blank" rel="noreferrer"><Facebook size={17}/> فتح صفحة فيسبوك</a></div>
        <div className="facebook-panel"><div className="facebook-brand"><span className="fb-icon"><Facebook/></span><div><strong>العالمية للبطاريات</strong><small>تابع المنشورات والعروض على فيسبوك</small></div></div><p>يمكنك مشاهدة المنشورات والتحديثات الجديدة من الصفحة الرسمية. عرض المنشورات داخل الموقع يعتمد على إعدادات التضمين المتاحة من فيسبوك.</p><a className="primary-button" href={FACEBOOK} target="_blank" rel="noreferrer">شاهد أحدث المنشورات <ArrowLeft size={17}/></a></div>
      </section>

      <section className="contact-section section-wrap" id="contact">
        <div className="contact-copy"><span className="eyebrow">نحن هنا لمساعدتك</span><h2>تواصل معانا</h2><p>اتصل أو ابعت رسالة عشان تستفسر عن الأسعار والتوفر وخدمة التوصيل.</p><div className="contact-methods"><a href={`tel:+${PHONE_1}`}><Phone/><span><small>اتصل بنا</small><strong>01221266672</strong></span></a><a href={`tel:+${PHONE_2}`}><Phone/><span><small>رقم إضافي</small><strong>01011740705</strong></span></a><a href={whatsapp()} target="_blank" rel="noreferrer"><MessageCircle/><span><small>واتساب</small><strong>راسلنا مباشرة</strong></span></a></div></div>
        <div className="location-card"><span className="location-icon"><MapPin/></span><h3>موقعنا</h3><p>شارع شركات البترول، أمام مخزن الأنابيب — حسب بيانات المحل المرسلة.</p><a className="secondary-button" href="https://www.google.com/maps/search/?api=1&query=شارع+شركات+البترول+الشروق" target="_blank" rel="noreferrer">افتح الموقع على خرائط جوجل <ArrowLeft size={16}/></a></div>
      </section>
    </main>
    <footer className="site-footer"><div className="footer-brand"><span className="footer-mark"><img src="/assets/logo-mark.png" alt=""/></span><div><strong>العالمية للبطاريات</strong><small>بطاريات سيارات</small></div></div><p>بطاريات سيارات • تواصل مباشر • استفسر عن التوصيل</p><div className="footer-social"><a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="فيسبوك"><Facebook/></a><a href={whatsapp()} target="_blank" rel="noreferrer" aria-label="واتساب"><MessageCircle/></a></div><small className="copyright">© {new Date().getFullYear()} العالمية للبطاريات — جميع الحقوق محفوظة</small></footer>
    <a className="floating-whatsapp" href={whatsapp()} target="_blank" rel="noreferrer" aria-label="تواصل عبر واتساب"><MessageCircle size={24}/></a>
    <AdminPanel open={adminOpen} onClose={()=>setAdminOpen(false)} user={user} products={products}/>
  </div>
}

export default App
