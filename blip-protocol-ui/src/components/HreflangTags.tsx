import { Helmet } from "react-helmet-async";

interface HreflangTagsProps {
  path: string;
}

export function HreflangTags({ path }: HreflangTagsProps) {
  const baseUrl = "https://www.blip.money";

  // Only English is currently served. The previous ar-AE alternate
  // pointing to /ae{path} caused ~60 Soft 404s in Search Console because
  // no /ae/* routes exist. Re-enable hrefLang variants only when actual
  // localized content ships.
  return (
    <Helmet>
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${path}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}${path}`} />
    </Helmet>
  );
}
