# سياسة الخصوصية · يمينك
# Privacy Policy · Yameenk

**آخر تحديث / Last Updated:** 2026-05-31  
**المطوّر / Developer:** 7SM

---

## العربية

### ما الذي لا تفعله الإضافة؟

إضافة **يمينك** **لا** تفعل أياً من التالي:

- ❌ لا تقرأ ولا تخزّن محتوى الصفحات التي تزورها
- ❌ لا تجمع بيانات الاستخدام أو التصفح
- ❌ لا ترسل أي شيء لأي خادم خارجي
- ❌ لا تستخدم analytics أو tracking من أي نوع
- ❌ لا تخزن سجل تصفحك أو عناوين URL

### ما الذي يُخزَّن محلياً فقط؟

الإعدادات وقائمة المواقع التي أوقفتَ الإصلاح عليها، مُخزَّنة في `browser.storage.local` على جهازك أنت ولا تغادره أبداً.

```json
{
  "example.com": { "enabled": false },
  "yameenk_settings": {
    "lineSpacing": "normal",
    "language": "ar"
  }
}
```

### الصلاحيات المطلوبة وسبب كل منها

| الصلاحية | السبب |
|---|---|
| `storage` | حفظ الإعدادات وحالة المواقع محلياً على جهازك |
| `tabs` | معرفة الصفحة الحالية لتطبيق الإصلاح أو إيقافه عليها |
| Content Scripts | تعمل فقط على مواقع محددة (Claude، ChatGPT، Gemini، DeepSeek، Notion، Perplexity، Copilot، Grok) لإصلاح اتجاه النص العربي |

---

## English

### What does the extension NOT do?

**Yameenk** does **not** do any of the following:

- ❌ Does not read or store the content of pages you visit
- ❌ Does not collect usage or browsing data
- ❌ Does not send anything to any external server
- ❌ Does not use analytics or tracking of any kind
- ❌ Does not store your browsing history or URLs

### What is stored locally?

Only your settings and the list of sites where you've turned the fix off, stored in `browser.storage.local` on your device only. It never leaves your device.

### Required Permissions and Rationale

| Permission | Reason |
|---|---|
| `storage` | Save settings and per-site state locally on your device |
| `tabs` | Identify the current page to apply or disable the fix |
| Content Scripts | Run only on specific sites (Claude, ChatGPT, Gemini, DeepSeek, Notion, Perplexity, Copilot, Grok) to fix Arabic text direction |

### Contact

If you have questions about this policy, please open an Issue on the GitHub repository.
