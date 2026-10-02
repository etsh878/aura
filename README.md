# AURA MENU

منيو إلكتروني Mobile-first لكافيه AURA، بهوية خضراء هادئة مستوحاة من اللوجو.

## تجربة العميل
- شاشة دخول متحركة باللوجو واسم AURA MENU.
- روابط Instagram / TikTok / Facebook / Google Maps بأيقونات واضحة.
- تصنيفات المنيو + بحث سريع.
- عرض الأسعار والـ S / D والاختيارات بدون سلة وبدون نظام دفع؛ العميل يتصفح ويقول للويتر طلبه.
- الصفحة العامة لا تحتوي على أي رابط ظاهر للوحة التحكم.

## لوحة التحكم
افتح `admin.html` بشكل مباشر عندما تحتاج تعديل المنيو.

PIN الدخول: `6548944`

من لوحة التحكم تقدر تعدّل:
- أسماء الأصناف.
- الأسعار المفردة أو S / D.
- الاختيارات Options.
- إظهار/إخفاء الصنف.
- إضافة وحذف الأقسام والأصناف.
- تعديل بيانات الكافيه وروابط السوشيال والموقع.
- **حفظ محلي** للمعاينة على نفس الجهاز.
- **تحميل menu.json** لاستخدامه كنسخة البيانات المحدثة داخل المشروع.

## رفع الموقع
ارفع ملفات المشروع كما هي على GitHub Pages، ثم استخدم رابط `index.html`/الموقع الذي تولده المنصة لتسليمه للعميل.

> ملاحظة: لوحة التحكم منفصلة عن الصفحة العامة ولن يظهر رابط لها للعميل.

## معاينة محلية
يمكن فتح `index.html` مباشرة بالنقر المزدوج؛ بيانات المنيو مدمجة داخل `data/menu-data.js` لذلك الـ preview المحلي لا يعتمد على صلاحيات `fetch` للملفات المحلية.


## GitHub Pages upload
For the public customer page, upload the files from the root of this package directly into the repository root (not inside an extra folder). The public `index.html` is self-contained: its menu data and logo are embedded, so it does not require the `assets` or `data` folders just to render the public menu. Keeping those folders is recommended for the admin/editor files and future updates.
