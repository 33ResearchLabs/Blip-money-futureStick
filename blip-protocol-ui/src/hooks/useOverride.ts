import { useCallback, useEffect, useState } from "react";

// Generic localStorage-backed override hook.
// Every editable text or image on the site goes through this so defaults
// stay in code (nothing breaks) and overrides layer on top.

const KEY_PREFIX = "blip:override:";
const EVENT = "blip:override-changed";

function storageKey(id: string) {
  return `${KEY_PREFIX}${id}`;
}

function readOverride<T>(id: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = window.localStorage.getItem(storageKey(id));
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function useOverride<T = string>(id: string, defaultValue: T): [T, (next: T | undefined) => void] {
  const [value, setValueState] = useState<T>(() => readOverride<T>(id) ?? defaultValue);

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (detail?.id === id) {
        const next = readOverride<T>(id);
        setValueState(next ?? defaultValue);
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey(id)) {
        const next = readOverride<T>(id);
        setValueState(next ?? defaultValue);
      }
    };
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [id, defaultValue]);

  const setValue = useCallback(
    (next: T | undefined) => {
      const key = storageKey(id);
      if (next === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(next));
      }
      window.dispatchEvent(new CustomEvent(EVENT, { detail: { id } }));
      setValueState(next ?? defaultValue);
    },
    [id, defaultValue],
  );

  return [value, setValue];
}

// Bulk helpers used by the dashboard
export function listAllOverrides(): { id: string; value: unknown }[] {
  const out: { id: string; value: unknown }[] = [];
  if (typeof window === "undefined") return out;
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(KEY_PREFIX)) {
      try {
        out.push({ id: k.slice(KEY_PREFIX.length), value: JSON.parse(window.localStorage.getItem(k) ?? "null") });
      } catch {
        // ignore
      }
    }
  }
  return out;
}

export function clearAllOverrides() {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(KEY_PREFIX)) keys.push(k);
  }
  keys.forEach((k) => {
    window.localStorage.removeItem(k);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { id: k.slice(KEY_PREFIX.length) } }));
  });
}

export function clearOverride(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(id));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { id } }));
}
