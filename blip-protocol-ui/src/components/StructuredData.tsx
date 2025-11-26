import { useEffect } from 'react';

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    '@type': string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}

interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  publisher: {
    '@type': string;
    name: string;
  };
}

const defaultOrganizationSchema: OrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Blip Money',
  url: 'https://blip.money',
  logo: 'https://blip.money/public/logo.png',
  description: 'Fast, secure, and simple payment processing solutions for businesses of all sizes.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@blip.money',
  },
  sameAs: [
    // Add your social media profiles here
    // 'https://twitter.com/blipmoney',
    // 'https://www.facebook.com/blipmoney',
    // 'https://www.linkedin.com/company/blipmoney',
  ],
};

const defaultWebsiteSchema: WebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Blip Money',
  url: 'https://blip.money',
  description: 'Fast, secure, and simple payment processing solutions.',
  publisher: {
    '@type': 'Organization',
    name: 'Blip Money',
  },
};

interface StructuredDataProps {
  schema?: OrganizationSchema | WebsiteSchema | Record<string, unknown>;
  type?: 'organization' | 'website' | 'custom';
}

/**
 * StructuredData component adds JSON-LD structured data to the page
 * This helps search engines understand your content better
 */
const StructuredData = ({ schema, type = 'organization' }: StructuredDataProps) => {
  useEffect(() => {
    const scriptId = `structured-data-${type}`;

    // Remove existing script if present
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Determine which schema to use
    let schemaData;
    if (schema) {
      schemaData = schema;
    } else if (type === 'organization') {
      schemaData = defaultOrganizationSchema;
    } else if (type === 'website') {
      schemaData = defaultWebsiteSchema;
    }

    if (!schemaData) return;

    // Create and inject script tag
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema, type]);

  return null;
};

export default StructuredData;

// Export helper functions for creating common schemas
export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const createArticleSchema = (article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.headline,
  description: article.description,
  image: article.image,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    '@type': 'Person',
    name: article.author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Blip Money',
    logo: {
      '@type': 'ImageObject',
      url: 'https://blip.money/public/logo.png',
    },
  },
});

export const createProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  availability?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: product.currency,
    availability: product.availability || 'https://schema.org/InStock',
  },
});
