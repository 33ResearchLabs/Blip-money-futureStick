export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isPhantomInstalled(): boolean {
  return !!(window as any).phantom?.solana;
}

export function getPhantomDeepLink(url?: string): string {
  const targetUrl = url || window.location.href;
  return `https://phantom.app/ul/browse/${encodeURIComponent(targetUrl)}?ref=${encodeURIComponent(window.location.origin)}`;
}
