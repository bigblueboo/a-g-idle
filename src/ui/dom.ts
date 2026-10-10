// Small DOM helpers and the render-if-changed seam. Panels build their nodes once and
// update text in place, so a tap never lands on a node that was replaced mid-tick.

type Child = Node | string | null | undefined | false;

/** Every button is a spring key unless it asks to be flat (a toggle, a module plate). */
const FLAT = "flat";

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string | number | boolean> = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (tag === "button") el.classList.add("key");
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false) continue;
    if (k === "class") {
      const classes = String(v).split(/\s+/).filter(Boolean);
      if (tag === "button" && !classes.includes(FLAT)) classes.push("key");
      el.className = classes.join(" ");
    }
    else if (k === "text") el.textContent = String(v);
    else el.setAttribute(k, String(v));
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    el.append(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return el;
}

/** Set textContent only when it changed. */
export function setText(el: Element, text: string): void {
  if (el.textContent !== text) el.textContent = text;
}

export function setClass(el: Element, cls: string, on: boolean): void {
  if (el.classList.contains(cls) !== on) el.classList.toggle(cls, on);
}

export function setDisabled(el: HTMLButtonElement, disabled: boolean): void {
  if (el.disabled !== disabled) el.disabled = disabled;
}

export function setStyle(el: HTMLElement, prop: string, value: string): void {
  if (el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
}

export function show(el: HTMLElement, visible: boolean): void {
  setClass(el, "hidden", !visible);
}

/**
 * A list of DOM rows keyed by id. `create` runs once per new key; `update` runs each
 * render on the existing row. Rows whose keys vanish are removed. Order follows `items`.
 */
interface KeyedList<T> {
  update(items: readonly T[]): void;
}

export function keyedList<T, R extends { el: HTMLElement }>(
  container: HTMLElement,
  key: (item: T) => string,
  create: (item: T) => R,
  update: (row: R, item: T) => void,
): KeyedList<T> {
  const rows = new Map<string, R>();
  return {
    update(items) {
      const seen = new Set<string>();
      let cursor: ChildNode | null = container.firstChild;
      for (const item of items) {
        const k = key(item);
        seen.add(k);
        let row = rows.get(k);
        if (!row) {
          row = create(item);
          rows.set(k, row);
        }
        if (row.el !== cursor) container.insertBefore(row.el, cursor);
        else cursor = cursor.nextSibling;
        update(row, item);
      }
      for (const [k, row] of rows) {
        if (!seen.has(k)) {
          row.el.remove();
          rows.delete(k);
        }
      }
    },
  };
}
