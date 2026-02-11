import { Helmet } from "react-helmet-async";

interface HreflangTagsProps {
  path: string;
}

export function HreflangTags({ path }: HreflangTagsProps) {
  const baseUrl = "https://blip.money";

  return (
    <Helmet>
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${path}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}${path}`} />
      <link rel="alternate" hrefLang="ar-AE" href={`${baseUrl}/ae${path}`} />
    </Helmet>
  );
}
