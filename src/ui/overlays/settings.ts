import { exportString, importString, save, wipe } from "../../platform/save";
import { h, setText, show } from "../dom";
import type { Panel } from "../panel";
import type { Store } from "../store";

/** Sound, haptics, contrast, hold length, export/import, start over. A gear in the tab bar. */
export function mountSettings(store: Store): Panel & { trigger: HTMLElement } {
  const trigger = h("button", { class: "tab settings-trigger", type: "button", "aria-label": "Settings", text: "⚙" });
  const toggle = (label: string, key: "sound" | "haptics" | "contrast"): HTMLElement => {
    const box = h("input", { type: "checkbox" });
    box.checked = store.settings[key];
    box.addEventListener("change", () => store.updateSettings({ [key]: box.checked }));
    return h("label", { class: "setting" }, box, h("span", { text: label }));
  };
  const hold = h("input", { type: "range", min: "600", max: "2400", step: "100" });
  hold.value = String(store.settings.holdMs);
  const holdLabel = h("span");
  hold.addEventListener("input", () => {
    store.updateSettings({ holdMs: Number(hold.value) });
    setText(holdLabel, `Hold length: ${(Number(hold.value) / 1000).toFixed(1)}s`);
  });
  const exportBox = h("textarea", { class: "save-text", rows: "3", "aria-label": "Save string", spellcheck: "false" });
  const doExport = h("button", { class: "action", type: "button", text: "Export" });
  const doImport = h("button", { class: "action", type: "button", text: "Import" });
  const reset = h("button", { class: "action quiet", type: "button", text: "Start over" });
  const status = h("span", { class: "hint" });
  doExport.addEventListener("click", () => {
    exportBox.value = exportString(store.state, store.clock.now());
    exportBox.select();
    setText(status, "Copy this somewhere safe.");
  });
  doImport.addEventListener("click", () => {
    const loaded = importString(exportBox.value);
    if (!loaded) return setText(status, "That isn't a save.");
    store.replace(loaded.state);
    save(loaded.state, store.clock.now());
    setText(status, "Loaded.");
  });
  reset.addEventListener("click", () => {
    if (reset.dataset.armed) {
      wipe();
      location.href = location.pathname;
    } else {
      reset.dataset.armed = "1";
      setText(reset, "Tap again to erase everything");
    }
  });
  const close = h("button", { class: "action", type: "button", text: "Close" });
  const el = h(
    "div",
    { class: "modal-backdrop hidden" },
    h(
      "div",
      { class: "modal settings", role: "dialog", "aria-label": "Settings" },
      h("b", { text: "Settings" }),
      toggle("Sound", "sound"),
      toggle("Haptics", "haptics"),
      toggle("High contrast", "contrast"),
      h("label", { class: "setting" }, hold, holdLabel),
      h("div", { class: "save-row" }, exportBox, h("div", { class: "save-actions" }, doExport, doImport), status),
      h("div", { class: "settings-actions" }, reset, close),
    ),
  );
  setText(holdLabel, `Hold length: ${(store.settings.holdMs / 1000).toFixed(1)}s`);
  trigger.addEventListener("click", () => show(el, true));
  close.addEventListener("click", () => show(el, false));
  el.addEventListener("click", (e) => {
    if (e.target === el) show(el, false);
  });
  return { el, trigger, update() {} };
}
