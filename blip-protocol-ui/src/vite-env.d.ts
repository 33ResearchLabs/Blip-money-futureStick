/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_CHAT_ID: string
  readonly VITE_TELEGRAM_BOT_TOKEN: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}
