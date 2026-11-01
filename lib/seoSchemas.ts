/**
 * Structured Data (JSON-LD) Schemas for UpgradeYourResume.com
 */

const BASE_URL = 'https://upgradeyourresume.com';

export interface FAQItem {
  question: string;
  answer: string;
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Upgrade Your Resume',
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    description: 'AI-powered ATS Resume Checker, Builder, and Career Optimization Suite.',
    sameAs: ['https://www.instagram.com/upgradeyourresume'],
  };
}

export function getSoftwareApplicationSchema({
  name = 'AI ATS Resume Checker',
  url = `${BASE_URL}/ats-resume-checker`,
  description = 'Free AI-powered ATS resume checker that analyzes resume keyword gaps and scores compatibility.',
  ratingValue = '4.9',
  ratingCount = '1250',
  price = '0',
  priceCurrency = 'USD',
}: {
  name?: string;
  url?: string;
  description?: string;
  ratingValue?: string;
  ratingCount?: string;
  price?: string;
  priceCurrency?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    url: url,
    description: description,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: priceCurrency,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      ratingCount: ratingCount,
    },
  };
}

export function getFaqSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item.startsWith('http') ? crumb.item : `${BASE_URL}${crumb.item}`,
    })),
  };
}
