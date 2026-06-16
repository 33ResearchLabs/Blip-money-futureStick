import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSEO } from "@/data/seo";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  image?: string;
  type?: string;
  twitterCard?: string;
}

export default function SEO({
  title: titleProp,
  description: descProp,
  canonical: canonicalProp,
  keywords: keywordsProp,
  image = "https://www.blip.money/blip-icon.png",
  type = "website",
  twitterCard = "summary_large_image",
}: SEOProps) {
  const { pathname } = useLocation();
  const seoData = getSEO(pathname);

  const title = titleProp ?? seoData.title;
  const description = descProp ?? seoData.description;
  const keywords = keywordsProp ?? seoData.keywords;
  const canonical = canonicalProp ?? `https://www.blip.money${pathname}`;

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Blip Money" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@BlipMoney" />
    </Helmet>
  );
}
