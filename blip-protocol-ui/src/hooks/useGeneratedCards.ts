import { useCallback, useEffect, useState } from "react";

export type GeneratedCard = {
  filename: string;
  path: string;        // e.g. "/illustrations/foo.png"
  prompt: string;
  bytes: number;
  createdAt: number;   // epoch ms
};

const KEY = "blip:generated-cards";
const EVENT = "blip:generated-cards-changed";

function read(): GeneratedCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(cards: GeneratedCard[]) {
  window.localStorage.setItem(KEY, JSON.stringify(cards));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useGeneratedCards() {
  const [cards, setCards] = useState<GeneratedCard[]>(read);

  useEffect(() => {
    const onChange = () => setCards(read());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", (e) => {
      if (e.key === KEY) onChange();
    });
    return () => {
      window.removeEventListener(EVENT, onChange);
    };
  }, []);

  const add = useCallback((card: GeneratedCard) => {
    const next = [card, ...read().filter((c) => c.filename !== card.filename)];
    write(next);
    setCards(next);
  }, []);

  const remove = useCallback((filename: string) => {
    const next = read().filter((c) => c.filename !== filename);
    write(next);
    setCards(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setCards([]);
  }, []);

  return { cards, add, remove, clear };
}
