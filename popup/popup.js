/**
 * يمينك — popup.js
 */

"use strict";

const SETTINGS_KEY = "yameenk_settings";

let currentTab = null;
let hostname   = "";
let isActive   = false;

function defaultSettings() {
  return {
    lineSpacing: "normal",
    language:    "ar"
  };
}

// ── تهيئة ──────────────────────────────────────────────────────────────────────

async function init() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  currentTab = tabs[0];

  if (!currentTab || !isHttp(currentTab.url)) {
    document.getElementById("siteName").textContent = "—";
    return;
  }

  hostname = new URL(currentTab.url).hostname;
  document.getElementById("siteName").textContent = hostname;

  const data = await browser.storage.local.get([hostname, SETTINGS_KEY]);
  // افتراضياً مُفعّلة على المواقع المدعومة ما لم يوقفها المستخدم صراحةً
  isActive   = data[hostname]?.enabled !== false;

  renderToggle(isActive);
  bindEvents();
}

// ── أحداث ──────────────────────────────────────────────────────────────────────

function bindEvents() {
  const card = document.getElementById("toggleCard");
  card.addEventListener("click",   () => doToggle());
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doToggle(); }
  });

  document.getElementById("rtlToggle").addEventListener("change", (e) => {
    e.stopPropagation(); doToggle();
  });

  document.getElementById("settingsBtn").addEventListener("click", () => {
    browser.runtime.openOptionsPage(); window.close();
  });
}

// ── تبديل ──────────────────────────────────────────────────────────────────────

async function doToggle() {
  isActive = !isActive;

  const data = await browser.storage.local.get([hostname, SETTINGS_KEY]);
  await browser.storage.local.set({
    [hostname]: { ...(data[hostname] || {}), enabled: isActive }
  });

  const settings = { ...defaultSettings(), ...(data[SETTINGS_KEY] || {}) };

  try {
    await browser.tabs.sendMessage(currentTab.id, {
      type: isActive ? "APPLY_FIX" : "REMOVE_FIX",
      settings
    });
  } catch { /* الصفحة لا تقبل رسائل */ }

  renderToggle(isActive);
}

// ── رسم الواجهة ────────────────────────────────────────────────────────────────

function renderToggle(active) {
  document.getElementById("rtlToggle").checked = active;
  const status = document.getElementById("toggleStatus");
  status.textContent = active ? "مفعّلة ✓" : "معطّلة";
  status.className   = "toggle-status" + (active ? " on" : "");
  document.getElementById("toggleCard").className =
    "card toggle-card" + (active ? " is-active" : "");
}

function isHttp(url) {
  return typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://"));
}

document.addEventListener("DOMContentLoaded", init);
