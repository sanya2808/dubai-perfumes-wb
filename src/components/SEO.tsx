import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  path?: string;
}

const SITE_NAME = 'Dubai Perfumes';
const BASE_URL = 'https://dubaiperfumes.in';
const DEFAULT_DESCRIPTION = 'Premium luxury perfumes in Nashik, India. Shop Arabic, Inspired & International fragrances online. Free delivery on all orders.';
const DEFAULT_IMAGE = '/favicon.png';

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'perfumes, dubai perfumes, luxury fragrance, attar, arabic perfume, nashik',
  ogImage = DEFAULT_IMAGE,
  path = '',
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Luxury Perfumes in Nashik`;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
