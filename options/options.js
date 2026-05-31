/**
 * يمينك — options.js
 */

"use strict";

const SETTINGS_KEY = "yameenk_settings";

const STRINGS = {
  ar: {
    appName:         "يمينك",
    settings:        "الإعدادات المتقدمة",
    livePreview:     "معاينة مباشرة",
    lineSpacing:     "تباعد الأسطر",
    lineSpacingDesc: "يتحكم في المسافة بين أسطر النص العربي",
    compact:         "مُدمج",
    normal:          "عادي",
    comfortable:     "مريح",
    shortcuts:       "اختصارات لوحة المفاتيح",
    toggleShortcut:  "تفعيل / إلغاء الإصلاح",
    popupShortcut:   "فتح نافذة يمينك",
    privacyNote:     "لا تُجمع أي بيانات",
    saved:           "تم الحفظ ✓"
  },
  en: {
    appName:         "Yameenk",
    settings:        "Advanced Settings",
    livePreview:     "Live Preview",
    lineSpacing:     "Line Spacing",
    lineSpacingDesc: "Controls the space between Arabic text lines",
    compact:         "Compact",
    normal:          "Normal",
    comfortable:     "Comfortable",
    shortcuts:       "Keyboard Shortcuts",
    toggleShortcut:  "Toggle RTL Fix",
    popupShortcut:   "Open Yameenk popup",
    privacyNote:     "No data is collected",
    saved:           "Saved ✓"
  }
};

let settings = {
  lineSpacing: "normal",
  language:    "ar"
};

let lang = "ar";

// ── تهيئة ──────────────────────────────────────────────────────────────────────

async function init() {
  const data = await browser.storage.local.get(SETTINGS_KEY);
  settings = { ...settings, ...(data[SETTINGS_KEY] || {}) };

  applyLanguage(lang);
  renderSettings(settings);
  updatePreview();
  bindEvents();
}

// ── ترجمة ──────────────────────────────────────────────────────────────────────

function applyLanguage(l) {
  const s = STRINGS[l] || STRINGS.ar;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (s[key] !== undefined) el.textContent = s[key];
  });
  document.documentElement.dir  = l === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = l;
}

// ── عرض الإعدادات ──────────────────────────────────────────────────────────────

function renderSettings(s) {
  document.querySelectorAll('[data-setting="lineSpacing"]').forEach(btn =>
    btn.classList.toggle("active", btn.dataset.value === s.lineSpacing)
  );
}

// ── معاينة ─────────────────────────────────────────────────────────────────────

function updatePreview() {
  // "عادي" يترك التباعد الطبيعي (لا قيمة)، مثل buildCSS في content.js
  const lhMap = { compact: "1.5", comfortable: "2.2" };
  const lh    = lhMap[settings.lineSpacing] || "";
  const box   = document.getElementById("previewBox");

  box.querySelectorAll(".preview-arabic").forEach(el => {
    el.style.lineHeight  = lh;
    el.style.direction   = "rtl";
    el.style.unicodeBidi = "plaintext";
    el.style.textAlign   = "start";
  });
}

// ── حفظ ────────────────────────────────────────────────────────────────────────

async function save() {
  await browser.storage.local.set({ [SETTINGS_KEY]: settings });

  const all  = await browser.storage.local.get(null);
  const tabs = await browser.tabs.query({});
  tabs.forEach(tab => {
    try {
      const hn = new URL(tab.url).hostname;
      // المواقع المدعومة مُفعّلة افتراضياً؛ لا نتجاهل إلا ما أوقفه المستخدم صراحةً.
      // content.js يتجاهل الرسالة إن لم يكن الإصلاح مُطبّقاً، وغير المدعومة تتجاهلها تلقائياً.
      if (all[hn]?.enabled !== false)
        browser.tabs.sendMessage(tab.id, { type: "UPDATE_SETTINGS", settings }).catch(() => {});
    } catch { /* URL غير صالح */ }
  });

  showToast();
}

function showToast() {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = STRINGS[lang].saved;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2000);
}

// ── أحداث ──────────────────────────────────────────────────────────────────────

function bindEvents() {
  document.querySelectorAll('[data-setting="lineSpacing"]').forEach(btn =>
    btn.addEventListener("click", () => {
      settings.lineSpacing = btn.dataset.value;
      document.querySelectorAll('[data-setting="lineSpacing"]').forEach(b =>
        b.classList.toggle("active", b === btn)
      );
      updatePreview();
      save();
    })
  );
}

document.addEventListener("DOMContentLoaded", init);
