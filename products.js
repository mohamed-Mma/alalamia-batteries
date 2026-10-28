import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db, firebaseConfigured } from './firebase'

export const demoProducts = [
  { id: 'demo-varta-70', name: 'بطارية فارتا 70 أمبير', brand: 'VARTA', amp: '70 أمبير', price: '', warranty: 'حسب الضمان المعلن', available: true, image: '', featured: true },
  { id: 'demo-bosch-60', name: 'بطارية بوش 60 أمبير', brand: 'BOSCH', amp: '60 أمبير', price: '', warranty: 'حسب الضمان المعلن', available: true, image: '', featured: true },
  { id: 'demo-exide-70', name: 'بطارية إكسايد 70 أمبير', brand: 'EXIDE', amp: '70 أمبير', price: '', warranty: 'حسب الضمان المعلن', available: true, image: '', featured: true },
  { id: 'demo-acdelco-75', name: 'بطارية AC Delco 75 أمبير', brand: 'ACDelco', amp: '75 أمبير', price: '', warranty: 'حسب الضمان المعلن', available: true, image: '', featured: false },
]

export function subscribeProducts(onProducts, onError = () => {}) {
  if (!firebaseConfigured || !db) {
    onProducts(demoProducts)
    return () => {}
  }
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    onProducts(products.length ? products : demoProducts)
  }, onError)
}
