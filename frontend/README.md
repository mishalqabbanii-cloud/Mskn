# Mskn Cloud Frontend (Mock Stage)

واجهة تجريبية لإدارة العقارات والعقود وطلبات الصيانة ضمن مشروع **Mskn Cloud**. هذه المرحلة مخصّصة لاختبار تجربة المستخدم والتدفق العام قبل ربط الواجهة بواجهة برمجية وقاعدة بيانات فعلية.

> **تنبيه**: جميع البيانات مخزنة محلياً داخل الذاكرة (`mock store`) ولا يتم حفظها أو مزامنتها مع خادم أو قاعدة بيانات.

## نظرة عامة على التصميم

- **الإطار**: React + TypeScript + Vite
- **التخزين المؤقت**: `MockDataProvider` باستخدام `useState`
- **الأنماط**: Tailwind CSS
- **التنقل**: React Router
- **الإشعارات**: `ToastProvider` بسيط لإظهار رسائل النجاح
- **التحقق**: التحقق من الحقول الفارغة فقط، بدون أي تحقق من التسجيل المسبق

## دليل البدء السريع

```bash
npm install
npm run dev
```

- افتح المتصفح على `http://localhost:5173`
- لا حاجة لإعداد قاعدة بيانات أو أي تهيئة إضافية

## هيكل المجلدات

- `src/context/MockDataContext.tsx`  
  يحتوي على أنواع البيانات والـ CRUD الخاص بالبيانات التجريبية.
- `src/components/ToastProvider.tsx`  
  نظام تنبيه بسيط لرسائل الحفظ والحذف.
- `src/pages/*Page.tsx`  
  الصفحات الرئيسية (العقارات، المستأجرين، الملاك، العقود، طلبات الصيانة).
- `src/utils/id.ts`  
  مولد معرّفات فريد يعتمد على `crypto.randomUUID`.

## التهيئة والتخصيص

| التهيئة             | الموقع                          | الملاحظات                                  |
|---------------------|---------------------------------|---------------------------------------------|
| قائمة الحالات       | `MockDataContext.tsx`           | يمكن توسيع القوائم (statuses، priorities). |
| البيانات الأولية    | `MockDataContext.tsx`           | عدّل قيم `initial*` لتحديث السيناريوهات.  |
| أنماط Tailwind      | `tailwind.config.js`            | أضف/عدّل الألوان أو الخطوط حسب الحاجة.     |
| نصوص التنبيهات      | صفحات CRUD                      | استخدم `showToast` لتخصيص الرسائل.        |

## الأسرار وبيئة التشغيل

- لا توجد أسرار أو مفاتيح API في هذه المرحلة.
- عند الحاجة لاحقاً، استخدم ملفات `.env` (غير مرفقة هنا) مع متغيرات البيئة، وتجنب كتابة الأسرار داخل الشيفرة.

## الاختبارات والتحقق

- **تحقق يدوي**: جرّب مسارات CRUD لكل صفحة (إضافة، تعديل، حذف).
- **فحص الأنماط**: تأكد من إدخال قيم فارغة للحقول الاختيارية للتأكد من قبولها.
- **تحقق من التوست**: تأكد من ظهور رسالة النجاح بعد كل عملية حفظ أو حذف.
- **أوامر مهيأة**:
  - `npm run build` للتحقق من سلامة TypeScript وتجميع الإنتاج.
  - يمكن إضافة اختبارات وحدات لاحقاً عند بناء طبقة الخدمات الحقيقة.

### اقتراحات لاختبارات مستقبلية

- **وحدات**: تغطية عمليات `MockDataContext` لسلامة التعديلات على الحالة.
- **واجهة**: استخدام Playwright أو Cypress لمحاكاة تدفق المستخدم.
- **أمن**: إضافة فحوصات static analysis عند إدخال مصادر خارجية.

## معايير القبول المقترحة

- تغطية الوظائف الأساسية CRUD على كل صفحة بنسبة 100٪ في الاختبارات اليدوية.
- ظهور رسالة نجاح واضحة عند الحفظ/الحذف.
- عدم حدوث أخطاء JavaScript في وحدة التحكم أثناء الاستخدام الطبيعي.
- سرعة استجابة الواجهة أقل من 200ms للتفاعلات المحلية.

## الترقيات والتراجع

- **الترقية**:
  1. أنشئ فرعاً جديداً وأضف التعديلات.
  2. شغّل `npm run build` للتأكد من سلامة TypeScript.
  3. جرّب التدفقات اليدوية الأساسية قبل الدمج.
- **التراجع**:
  1. استخدم Git لإرجاع الالتزام المسبب للمشكلة.
  2. أعد تشغيل `npm run dev` وتحقق من عودة السلوك الطبيعي.

## خطة التطوير التالية

- ربط الواجهة بواجهة API حقيقية مع حماية مناسبة (JWT، RBAC).
- استبدال `MockDataProvider` بطبقة خدمات تستدعي واجهات REST/GraphQL.
- إضافة إدارة حالة أكثر تقدماً (React Query أو Zustand) عند الحاجة.
- توسيع التحقق (Zod/Yup) بعد تحديد قواعد البيانات والكيانات النهائية.

## سجل التغييرات (مثال)

| التاريخ       | الإصدار | الملخص                                   |
|---------------|---------|------------------------------------------|
| 2025-11-09    | 0.1.0   | إنشاء الهيكل المبدئي ببيانات Mock.      |
| --            | --      | (أضف بنوداً جديدة لكل تحديث لاحق).      |

## دعم وتأهيل الفريق

- اقرأ ملفات الصفحات لمعرفة كيفية بناء التدفقات (من السهل نسخ النمط لصفحات جديدة).
- استخدم `MockDataContext` كمصدر بيانات مشترك أثناء التطوير التجريبي.
- يمكن كتابة ملاحظات إضافية لكل صفحة داخل تعليق أعلى الملف لتسهيل الانضمام للمشروع.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
