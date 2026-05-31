/**
 * يمينك — Arabic RTL Fix
 * background.js
 */

"use strict";

const SETTINGS_KEY = "yameenk_settings";

function defaultSettings() {
  return {
    lineSpacing: "normal",
    language:    "ar"
  };
}

// ── Alt+G ──────────────────────────────────────────────────────────────────────

browser.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-rtl") return;
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab || !isHttp(tab.url)) return;
  await toggleForTab(tab);
});

// ── تحديث الشارة عند تبديل التبويب ────────────────────────────────────────────

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab  = await browser.tabs.get(tabId);
    if (!isHttp(tab.url)) { clearBadge(tabId); return; }
    const data = await browser.storage.local.get(getHostname(tab.url));
    setBadge(tabId, data[getHostname(tab.url)]?.enabled !== false);
  } catch { /* التبويب مغلق */ }
});

// ── إعادة التطبيق عند تحميل صفحة ─────────────────────────────────────────────

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!isHttp(tab.url)) { clearBadge(tabId); return; }

  const hostname = getHostname(tab.url);
  const data     = await browser.storage.local.get([hostname, SETTINGS_KEY]);
  const isActive = data[hostname]?.enabled !== false;

  setBadge(tabId, isActive);

  if (isActive) {
    const settings = { ...defaultSettings(), ...(data[SETTINGS_KEY] || {}) };
    browser.tabs.sendMessage(tabId, { type: "APPLY_FIX", settings }).catch(() => {});
  }
});

// ── تبديل حالة موقع ───────────────────────────────────────────────────────────

async function toggleForTab(tab) {
  const hostname  = getHostname(tab.url);
  const data      = await browser.storage.local.get([hostname, SETTINGS_KEY]);
  const nowActive = !(data[hostname]?.enabled !== false);

  await browser.storage.local.set({
    [hostname]: { ...(data[hostname] || {}), enabled: nowActive }
  });

  setBadge(tab.id, nowActive);

  const settings = { ...defaultSettings(), ...(data[SETTINGS_KEY] || {}) };
  browser.tabs.sendMessage(tab.id, {
    type: nowActive ? "APPLY_FIX" : "REMOVE_FIX",
    settings
  }).catch(() => {});
}

// ── helpers ────────────────────────────────────────────────────────────────────

function setBadge(tabId, _active) {
  browser.action.setBadgeText({ tabId, text: "" });
}
function clearBadge(tabId) {
  browser.action.setBadgeText({ tabId, text: "" });
}
function isHttp(url) {
  return typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://"));
}
function getHostname(url) {
  try { return new URL(url).hostname; } catch { return ""; }
}
