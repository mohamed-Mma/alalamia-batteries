import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { X, LogIn, Plus, Trash2, LogOut, Save } from 'lucide-react'
import { auth, db, firebaseConfigured } from '../lib/firebase'

const blank = { name: '', brand: '', amp: '', price: '', warranty: '', image: '', available: true, featured: false }

export default function AdminPanel({ open, onClose, user, products }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { if (!open) { setError(''); setEditingId(''); setForm(blank) } }, [open])
  if (!open) return null

  async function login(e) {
    e.preventDefault(); setError('')
    if (!firebaseConfigured) { setError('لازم تضيف إعدادات Firebase في ملف .env.local أولًا.'); return }
    try { await signInWithEmailAndPassword(auth, email, password) }
    catch { setError('تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور وأن Email/Password مفعّل في Firebase.') }
  }
  async function saveProduct(e) {
    e.preventDefault(); setError('')
    if (!db || !user) { setError('سجّل الدخول بعد إعداد Firebase أولًا.'); return }
    if (!form.name.trim()) { setError('اكتب اسم البطارية.'); return }
    setBusy(true)
    try {
      const data = { ...form, price: form.price === '' ? '' : Number(form.price), updatedAt: serverTimestamp() }
      if (editingId) await updateDoc(doc(db, 'products', editingId), data)
      else await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
      setForm(blank); setEditingId('')
    } catch (err) { setError('لم يتم الحفظ. راجع إعدادات Firestore وقواعد الأمان.') }
    finally { setBusy(false) }
  }
  async function removeProduct(id) {
    if (!db || !user || !confirm('متأكد إنك عايز تحذف المنتج؟')) return
    try { await deleteDoc(doc(db, 'products', id)) } catch { setError('تعذر حذف المنتج.') }
  }
  function editProduct(p) {
    setEditingId(p.id)
    setForm({ name: p.name || '', brand: p.brand || '', amp: p.amp || '', price: p.price ?? '', warranty: p.warranty || '', image: p.image || '', available: p.available !== false, featured: Boolean(p.featured) })
  }
  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <section className="admin-modal" role="dialog" aria-modal="true" aria-label="لوحة الإدارة">
        <div className="modal-heading"><div><span className="eyebrow">إدارة الموقع</span><h2>لوحة تحكم العالمية</h2></div><button className="icon-button" onClick={onClose} aria-label="إغلاق"><X /></button></div>
        {!user ? <form className="admin-login" onSubmit={login}>
          <p>سجّل الدخول بحساب الإدارة الذي أنشأته في Firebase Authentication.</p>
          <label>البريد الإلكتروني<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username" /></label>
          <label>كلمة المرور<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button full-width" type="submit"><LogIn size={17}/> تسجيل الدخول</button>
          {!firebaseConfigured && <small className="setup-note">الموقع يعمل كعرض تجريبي حتى إضافة إعدادات Firebase.</small>}
        </form> : <>
          <div className="admin-user"><span>تم تسجيل الدخول: {user.email}</span><button className="outline-button" onClick={() => signOut(auth)}><LogOut size={16}/> خروج</button></div>
          <form className="product-form" onSubmit={saveProduct}>
            <h3>{editingId ? 'تعديل منتج' : 'إضافة بطارية جديدة'}</h3>
            <div className="form-grid">
              <label>اسم البطارية *<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></label>
              <label>الماركة<input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} placeholder="VARTA / BOSCH" /></label>
              <label>السعة<input value={form.amp} onChange={e=>setForm({...form,amp:e.target.value})} placeholder="70 أمبير" /></label>
              <label>السعر بالجنيه<input type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></label>
              <label className="wide-field">رابط صورة المنتج<input type="url" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..." /></label>
              <label className="wide-field">الضمان<input value={form.warranty} onChange={e=>setForm({...form,warranty:e.target.value})} placeholder="مدة الضمان حسب المنتج" /></label>
            </div>
            <div className="check-row"><label><input type="checkbox" checked={form.available} onChange={e=>setForm({...form,available:e.target.checked})}/> متاح</label><label><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> منتج مميز</label></div>
            {error && <p className="form-error">{error}</p>}
            <div className="form-actions"><button className="primary-button" disabled={busy} type="submit"><Save size={16}/>{busy ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>{editingId && <button className="outline-button" type="button" onClick={()=>{setEditingId('');setForm(blank)}}>إلغاء التعديل</button>}</div>
          </form>
          <div className="admin-products"><h3>المنتجات الحالية ({products.length})</h3>{products.map(p=><div className="admin-product-row" key={p.id}><div><strong>{p.name}</strong><small>{p.price ? `${p.price} ج.م` : 'بدون سعر محدد'}</small></div><button className="outline-button" onClick={()=>editProduct(p)}>تعديل</button><button className="danger-icon" onClick={()=>removeProduct(p.id)} aria-label="حذف"><Trash2 size={17}/></button></div>)}</div>
        </>}
      </section>
    </div>
  )
}
