// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// interface SEOProps {
//   title?: string;
//   description?: string;
//   keywords?: string;
//   image?: string;
//   url?: string;
//   type?: string;
// }

// const SEO = ({
//   title = 'Blip Money - Fast, Secure, and Simple Payment Solutions',
//   description = 'Experience seamless payment processing with Blip Money. Fast transactions, secure payments, and simple integration for businesses of all sizes.',
//   keywords = 'blip money, payment processing, secure payments, online transactions, payment gateway, fintech',
//   image = 'https://blip.money/public/logo.png',
//   url,
//   type = 'website',
// }: SEOProps) => {
//   const location = useLocation();
//   const currentUrl = url || `https://blip.money${location.pathname}`;

//   useEffect(() => {
//     // Update document title
//     document.title = title;

//     // Update meta tags
//     const updateMetaTag = (property: string, content: string, isProperty = false) => {
//       const attribute = isProperty ? 'property' : 'name';
//       let element = document.querySelector(`meta[${attribute}="${property}"]`);

//       if (!element) {
//         element = document.createElement('meta');
//         element.setAttribute(attribute, property);
//         document.head.appendChild(element);
//       }

//       element.setAttribute('content', content);
//     };

//     // Standard meta tags
//     updateMetaTag('description', description);
//     updateMetaTag('keywords', keywords);

//     // Open Graph tags
//     updateMetaTag('og:title', title, true);
//     updateMetaTag('og:description', description, true);
//     updateMetaTag('og:image', image, true);
//     updateMetaTag('og:url', currentUrl, true);
//     updateMetaTag('og:type', type, true);

//     // Twitter tags
//     updateMetaTag('twitter:title', title);
//     updateMetaTag('twitter:description', description);
//     updateMetaTag('twitter:image', image);
//     updateMetaTag('twitter:url', currentUrl);

//     // Update canonical link
//     let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
//     if (!canonical) {
//       canonical = document.createElement('link');
//       canonical.setAttribute('rel', 'canonical');
//       document.head.appendChild(canonical);
//     }
//     canonical.href = currentUrl;
//   }, [title, description, keywords, image, currentUrl, type]);

//   return null;
// };

// export default SEO;



import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  image?: string;
  type?: string;
  twitterCard?: string;
}

export default function SEO({
  title,
  description,
  canonical,
  keywords,
  image = "https://blip.money/logo.png",
  type = "website",
  twitterCard = "summary_large_image",
}: SEOProps) {
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
