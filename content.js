/**
 * يمينك — Arabic RTL Fix
 * content.js: يُحقَن في كل صفحة تلقائياً
 */

"use strict";

const STYLE_ID     = "yameenk-rtl-styles";
const BODY_CLASS   = "yameenk-rtl-active";
const LIST_CLASS   = "yameenk-rtl-list";
const RTL_EL_CLASS = "yameenk-rtl-el";
const TABLE_CLASS  = "yameenk-rtl-table";
const SETTINGS_KEY = "yameenk_settings";

// عناصر النص الكتلية التي نفحص محتواها العربي
const BLOCK_SEL = "p, h1, h2, h3, h4, h5, h6, blockquote, dt, dd, figcaption, caption";
const ARABIC_RE = /[؀-ۿ]/;

// ──────────────────────────────────────────────────────────────────────────────
// الإعدادات الافتراضية
// ──────────────────────────────────────────────────────────────────────────────

function defaultSettings() {
  return {
    lineSpacing: "normal",
    language:    "ar"
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// بناء CSS
//
// المبدأ: لا نلمس إلا العناصر التي تحتوي نصاً عربياً (يُعلّمها JS بكلاسات).
//   - direction:rtl يحرّك أرقام/نقاط القوائم لليمين ويضبط محاذاة الكتلة.
//   - unicode-bidi:isolate يفرض الاتجاه RTL مع عزل المقاطع اللاتينية
//     (روابط/مصطلحات/أكواد إنجليزية) فتبقى تُقرأ بترتيب صحيح وملتصقة بالعلامة.
//   - العناصر الإنجليزية وواجهة الموقع (تنقّل، أزرار) لا تُعلَّم فلا تتأثّر.
// ──────────────────────────────────────────────────────────────────────────────

function buildCSS(settings) {
  // "عادي" = لا نغيّر تباعد الأسطر (نترك تباعد الموقع الطبيعي).
  // "مُدمج" يضيّق و"مريح" يوسّع فقط.
  const lhMap  = { compact: "1.5", comfortable: "2.2" };
  const lh     = lhMap[settings.lineSpacing];
  const lhDecl = lh ? `line-height: ${lh} !important;` : "";

  return `
    /* ══════════════════════════════════════════════════════
     * يمينك — RTL Fix CSS
     * جميع القواعد تحت .yameenk-rtl-active
     * ══════════════════════════════════════════════════════ */

    /*
     * فقرات النص العربية فقط (يُعلّمها JS عند احتوائها نصاً عربياً):
     *   direction:rtl       → النص العربي يبدأ ويُحاذى من اليمين
     *   unicode-bidi:isolate → يفرض الاتجاه RTL مع عزل المقاطع اللاتينية
     *                          (روابط/مصطلحات إنجليزية) فتبقى تُقرأ صحيحة
     *   text-align:start    → محاذاة يمين (لأن direction = rtl)
     *
     * العناصر الإنجليزية (مثل عناوين الشريط الجانبي Products / Recents)
     * لا تُعلَّم فلا تتزحزح ولا تتأثّر إطلاقاً.
     */
    .yameenk-rtl-active .${RTL_EL_CLASS} {
      direction: rtl !important;
      unicode-bidi: isolate !important;
      text-align: start !important;
      ${lhDecl}
    }

    /*
     * قوائم المحتوى العربية (مُعلَّمة بـ JS: تحتوي عربياً ولها أرقام/نقاط ظاهرة).
     *   - direction:rtl على القائمة → يحرّك الأرقام/النقاط إلى اليمين.
     *   - direction:rtl + isolate على العناصر → النص يُحاذى يميناً ملتصقاً
     *     بالعلامة، مع عزل المقاطع اللاتينية (Next.js …) فتبقى تُقرأ صحيحة.
     * قوائم التنقّل (بلا أرقام/نقاط أو بلا عربي) لا تُعلَّم فلا تتأثّر.
     */
    .yameenk-rtl-active ul.${LIST_CLASS},
    .yameenk-rtl-active ol.${LIST_CLASS} {
      direction: rtl !important;
    }
    .yameenk-rtl-active ul.${LIST_CLASS} li,
    .yameenk-rtl-active ol.${LIST_CLASS} li {
      direction: rtl !important;
      unicode-bidi: isolate !important;
      text-align: start !important;
      ${lhDecl}
    }

    /*
     * الجداول العربية (مُعلَّمة بـ JS): direction:rtl لترتيب الأعمدة من اليمين،
     * والخلايا تُحاذى يميناً مع عزل المقاطع اللاتينية.
     */
    .yameenk-rtl-active table.${TABLE_CLASS} {
      direction: rtl !important;
    }
    .yameenk-rtl-active table.${TABLE_CLASS} td,
    .yameenk-rtl-active table.${TABLE_CLASS} th {
      unicode-bidi: isolate !important;
      text-align: start !important;
      ${lhDecl}
    }

    /*
     * ملاحظة: لا نضع أي قاعدة على span/a/label المضمّنة.
     * الكتلة الأمّ (isolate + rtl) تتكفّل بترتيب المحتوى المختلط، ووضع
     * قاعدة عزل على المضمّنة كان يبعثر العبارات الإنجليزية متعددة الكلمات
     * (مثل "Google OAuth Platform").
     */

    /* ══ استثناءات صريحة — أكواد فقط، تبقى LTR ══ */

    .yameenk-rtl-active pre,
    .yameenk-rtl-active pre *,
    .yameenk-rtl-active code,
    .yameenk-rtl-active code *,
    .yameenk-rtl-active samp,
    .yameenk-rtl-active samp *,
    .yameenk-rtl-active kbd,
    .yameenk-rtl-active kbd *,
    .yameenk-rtl-active var {
      direction: ltr !important;
      unicode-bidi: isolate !important;
      text-align: start !important;
      box-shadow: none !important;
    }

    /*
     * حقول الإدخال (input / textarea / contenteditable): لا نلمسها إطلاقاً
     * حتى يتكفّل الموقع باتجاهها تلقائياً (RTL للعربي، LTR للأكواد).
     */
  `;
}

// ──────────────────────────────────────────────────────────────────────────────
// تطبيق / إزالة الإصلاح
// ──────────────────────────────────────────────────────────────────────────────

function applyFix(settings) {
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    (document.head || document.documentElement).appendChild(styleEl);
  }
  styleEl.textContent = buildCSS(settings);
  document.body.classList.add(BODY_CLASS);

  tagRtl(document.body);
  startObserving();
}

function removeFix() {
  stopObserving();
  document.body.classList.remove(BODY_CLASS);
  document.querySelectorAll("." + LIST_CLASS + ", ." + RTL_EL_CLASS + ", ." + TABLE_CLASS)
    .forEach(el => el.classList.remove(LIST_CLASS, RTL_EL_CLASS, TABLE_CLASS));
  const el = document.getElementById(STYLE_ID);
  if (el) el.remove();
}

// ──────────────────────────────────────────────────────────────────────────────
// تمييز العناصر العربية فقط (نص كتلي + قوائم محتوى) دون لمس واجهة الموقع
// ──────────────────────────────────────────────────────────────────────────────

// نتجاهل أي عنصر داخل حقل إدخال أو كود حتى لا نتدخّل فيما يكتبه المستخدم
function isExcluded(el) {
  return !!(el.closest &&
    el.closest("[contenteditable], textarea, input, pre, code, kbd, samp, var"));
}

// قائمة محتوى = تحتوي نصاً عربياً + لها أرقام/نقاط ظاهرة (وليست قائمة تنقّل)
function tagOneList(list) {
  try {
    if (isExcluded(list) || !ARABIC_RE.test(list.textContent || "")) return;
    const type = getComputedStyle(list).listStyleType;
    if (type && type !== "none") list.classList.add(LIST_CLASS);
  } catch { /* عنصر غير متاح */ }
}

// فقرة/عنوان عربي = يحتوي نصاً عربياً
function tagOneBlock(el) {
  try {
    if (!isExcluded(el) && ARABIC_RE.test(el.textContent || "")) el.classList.add(RTL_EL_CLASS);
  } catch { /* عنصر غير متاح */ }
}

// جدول عربي = يحتوي نصاً عربياً
function tagOneTable(table) {
  try {
    if (!isExcluded(table) && ARABIC_RE.test(table.textContent || "")) table.classList.add(TABLE_CLASS);
  } catch { /* عنصر غير متاح */ }
}

function tagRtl(root) {
  if (!root || !root.querySelectorAll) return;
  if (root.matches) {
    if (root.matches("ul, ol"))  tagOneList(root);
    if (root.matches("table"))   tagOneTable(root);
    if (root.matches(BLOCK_SEL)) tagOneBlock(root);
  }
  root.querySelectorAll("ul, ol").forEach(tagOneList);
  root.querySelectorAll("table").forEach(tagOneTable);
  root.querySelectorAll(BLOCK_SEL).forEach(tagOneBlock);
}

// مراقبة المحتوى الديناميكي (رسائل المحادثة تُحمَّل تدريجياً)
let observer = null;

function startObserving() {
  if (observer || !document.body) return;
  observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) tagRtl(node);                       // عنصر جديد
        else if (node.nodeType === 3 && node.parentElement)          // نص جديد داخل عنصر قائم
          tagRtl(node.parentElement);
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function stopObserving() {
  if (observer) { observer.disconnect(); observer = null; }
}

// ──────────────────────────────────────────────────────────────────────────────
// التهيئة عند تحميل الصفحة
// ──────────────────────────────────────────────────────────────────────────────

async function init() {
  const hostname = window.location.hostname;
  if (!hostname) return;
  try {
    const data     = await browser.storage.local.get([hostname, SETTINGS_KEY]);
    const siteData = data[hostname] || {};
    const settings = { ...defaultSettings(), ...(data[SETTINGS_KEY] || {}) };
    // المواقع المدعومة تعمل تلقائياً ما لم يوقفها المستخدم صراحةً (enabled === false)
    if (siteData.enabled !== false) applyFix(settings);
  } catch (e) {
    console.warn("[يمينك] init:", e.message);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// معالج الرسائل
// ──────────────────────────────────────────────────────────────────────────────

browser.runtime.onMessage.addListener((msg, _s, sendResponse) => {
  try {
    switch (msg.type) {
      case "APPLY_FIX":
        applyFix(msg.settings || defaultSettings());
        sendResponse({ ok: true });
        break;
      case "REMOVE_FIX":
        removeFix();
        sendResponse({ ok: true });
        break;
      case "UPDATE_SETTINGS":
        if (document.body.classList.contains(BODY_CLASS))
          applyFix(msg.settings || defaultSettings());
        sendResponse({ ok: true });
        break;
      default: sendResponse({ ok: false });
    }
  } catch (e) {
    sendResponse({ ok: false, error: e.message });
  }
  return true;
});

init();
