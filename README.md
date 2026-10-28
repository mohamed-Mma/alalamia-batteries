# العالمية للبطاريات | Alalamia Batteries

موقع إلكتروني احترافي ومتكامل لمتجر بطاريات السيارات.

**الرابط المنشور المتوقع:** https://mohamed-mma.github.io/alalamia-batteries/

## سبب الشاشة البيضاء السابق وإصلاحه

المشكلة الرئيسية كانت غياب إعداد `base` في Vite:

```js
base: '/alalamia-batteries/'
```

بدون هذا الإعداد، مسارات ملفات JS وCSS والصور تنكسر بعد النشر على GitHub Pages داخل مجلد فرعي، فتظهر شاشة بيضاء.

تم إصلاح ذلك في `vite.config.js`، وإضافة Error Boundary لعرض رسائل خطأ واضحة بدل الشاشة البيضاء، وتحسين التعامل مع غياب إعدادات Firebase.

## التقنيات

- React 18 + Vite
- Firebase (Authentication + Cloud Firestore)
- Lucide React للأيقونات
- خط Cairo العربي
- تصميم RTL كامل ومتجاوب

## هيكل المشروع

```
alalamia-batteries/
├── .github/workflows/deploy.yml   # نشر تلقائي على GitHub Pages
├── public/assets/                 # الشعار والصور المرجعية
├── src/
│   ├── components/
│   │   ├── AdminPanel.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Header.jsx
│   │   └── ProductCard.jsx
│   ├── lib/
│   │   ├── firebase.js
│   │   └── products.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── firestore.rules
├── firebase.json
├── vite.config.js
├── index.html
├── package.json
└── .env.example
```

## التشغيل المحلي

1. ثبت Node.js LTS من https://nodejs.org/
2. افتح الطرفية داخل مجلد المشروع:

```bash
npm install
```

3. انسخ ملف البيئة:

```bash
cp .env.example .env.local
```

4. املأ بيانات Firebase في `.env.local` من:
   Firebase Console → Project settings → Your apps → Web app

5. شغّل:

```bash
npm run dev
```

## إعداد Firebase (ضروري للمنتجات ولوحة التحكم)

1. أنشئ مشروع Firebase (أو استخدم موجود).
2. أضف تطبيق Web وانسخ الإعدادات إلى `.env.local`.
3. Authentication → Sign-in method → فعّل **Email/Password**.
4. Authentication → Users → أضف حساب المسؤول يدويًا (لا تفتح التسجيل العام).
5. أنشئ قاعدة بيانات **Cloud Firestore** في وضع الإنتاج.
6. انشر قواعد الأمان من ملف `firestore.rules`:
   - من Console: Firestore → Rules → الصق المحتوى → Publish
   - أو باستخدام Firebase CLI: `firebase deploy --only firestore:rules`
7. (اختياري) فعّل Storage لرفع صور المنتجات لاحقًا.

**مهم للأمان:**
- قواعد Firestore الحالية تسمح لأي مستخدم مسجّل بتعديل المنتجات.
- قبل الإطلاق العام: قيّد الكتابة بحسابات الإدارة فقط (Custom Claims أو قائمة UID).
- لا تضع مفاتيح سرية أو Access Tokens داخل الكود أو GitHub.
- متغيرات `VITE_*` تظهر في المتصفح؛ الحماية الحقيقية من قواعد الأمان.

## إدارة المنتجات

- افتح الموقع → زر «لوحة الإدارة» في الهيدر.
- سجّل الدخول بحساب Firebase الذي أنشأته.
- أضف / عدّل / احذف المنتجات.
- التحديثات تظهر فورًا في الواجهة بفضل الاستماع الحي لـ Firestore.

كل منتج يحتوي على: الاسم، الشركة، الصورة، السعر، السعر قبل الخصم، السعة، الوصف، التوفر، التصنيف، الظهور.

## التواصل عبر واتساب

الأزرار تستخدم روابط واتساب الرسمية:

```
https://wa.me/201221266672?text=...
```

عند الضغط على منتج، تُفتح محادثة برسالة تحتوي اسم المنتج.

الأرقام الحالية قابلة للتعديل من الكود (أو لاحقًا من إعدادات Firestore).

## فيسبوك

القسم الحالي يعرض رابط الصفحة الرسمية.

عرض المنشورات تلقائيًا داخل الموقع يحتاج:
- Meta App + Page Access Token
- عادة Backend أو Cloud Function (لأن التوكن لا يُوضع في كود المتصفح)

لم يتم تفعيل الجلب التلقائي بعد. عند توفر الرابط والصلاحيات يمكن إضافته بطريقة آمنة.

## النشر على GitHub Pages

### الطريقة الموصى بها (GitHub Actions)

1. ارفع المشروع إلى مستودع GitHub (مثلاً `mohamed-mma/alalamia-batteries`).
2. من Settings → Pages → Source اختر **GitHub Actions**.
3. أضف Secrets في Settings → Secrets and variables → Actions:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - (اختياري) `VITE_FACEBOOK_PAGE_URL`
4. ادفع إلى الفرع `main` أو `master`. سيتم البناء والنشر تلقائيًا.

### يدويًا

```bash
npm run build
```

ارفع محتويات مجلد `dist` إلى فرع `gh-pages` أو استخدم أي أداة نشر.

**تأكد** أن `vite.config.js` يحتوي:

```js
base: '/alalamia-batteries/'
```

## اختبار البناء

```bash
npm install
npm run build
```

يجب أن ينجح البناء ويُنشئ مجلد `dist` يحتوي `index.html` وملفات assets.

## ملاحظات مهمة

- لا ترفع ملف `.env.local` أبدًا (مستثنى في `.gitignore`).
- الموقع يعمل حتى لو لم تُعد Firebase بعد (يعرض رسالة تحميل/خطأ واضحة ولا ينهار).
- لا تضع أسعارًا أو بيانات غير مؤكدة.
- الشعار والصور الأصلية موجودة في `public/assets`.

## ما تم تنفيذه بالكامل

- صفحة رئيسية كاملة (Hero، مميزات، منتجات، عروض، من نحن، تواصل، Footer)
- تصميم RTL احترافي بألوان الأحمر والأسود والأبيض
- إدارة منتجات عبر Firestore
- لوحة تحكم مع تسجيل دخول Firebase
- أزرار واتساب ذكية للمنتجات
- Error Boundary ورسائل خطأ واضحة
- إعداد صحيح لـ GitHub Pages + GitHub Actions
- قواعد أمان Firestore أساسية

## ما يحتاج إعداد إضافي منك

1. إنشاء مشروع Firebase وملء `.env.local` / Secrets
2. إضافة حساب المسؤول
3. نشر قواعد Firestore
4. تأكيد أرقام الهاتف والعنوان ورابط فيسبوك
5. إضافة المنتجات الحقيقية
6. (اختياري) تفعيل Meta Graph API لعرض منشورات فيسبوك

بعد رفع المشروع وتشغيل GitHub Actions، سيكون الموقع جاهزًا على الرابط النهائي.
