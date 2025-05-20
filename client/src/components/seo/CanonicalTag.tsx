import { Helmet } from "react-helmet";

interface CanonicalTagProps {
  path?: string;
}

/**
 * A component to ensure consistent canonical URL structure across all pages
 * @param path - Optional path to append to the domain (e.g., "/about", "/services")
 */
export const CanonicalTag = ({ path = "" }: CanonicalTagProps) => {
  // Ensure path starts with a slash if not empty and not already starting with one
  const formattedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  
  // Use the www version consistently throughout the site
  const canonicalUrl = `https://www.hardyswashnwax.com${formattedPath}`;
  
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default CanonicalTag;