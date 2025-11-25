# SEO Transfer Notes (from `carcare-old`)

This document lists the SEO metadata, structured data, and slugs used in `carcare-old` so we can reapply them here.

## Global head items
- Favicon and manifest: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `manifest.json`, `logo.png` (all live in `public/` in the old app). Ensure `<link rel="icon">`, `<link rel="apple-touch-icon">`, and `<link rel="manifest">` are wired in `public/index.html`.
- Social meta pattern (seen on Home): `og:title`, `og:description`, `og:type`, `og:url`; Twitter `summary` card with matching title/description.
- Canonical `<link>` for every route, pointing to `https://www.hardyswashnwax.com{path}`.

## Routes and expected slugs (from old router)
- `/` (home)
- `/blog` (index) and `/blog/:slug` (posts)
- `/about`
- `/contact`
- `/booking`
- `/services`, `/services/interior-detailing`, `/services/exterior-detailing`, `/services/ceramic-coating`, `/services/paint-correction`
- `/services/interior-car-detailing`, `/services/full-service-car-wash`, `/services/car-wash-and-wax`
- Location/SEO pages: `/orange-county`, `/davis-car-detailing`, `/sacramento-car-detailing`, `/elk-grove-car-detailing`, `/roseville-car-detailing`, `/folsom-car-detailing`, `/west-sacramento-car-detailing`, `/woodland-car-detailing`
- Legal: `/privacy-policy`, `/sms-terms`
- (Other pages existed but were not routed in App: `dixon-car-detailing`, `winters-car-detailing`, `card-demo`, `subscriptions`, `admin-dashboard`)

## Page-specific meta & structured data to mirror
- **Home**: Title “Sacramento Mobile Car Detailing | Davis, Woodland, Elk Grove”; description and keywords matching Sacramento-area services; OG/Twitter tags; canonical `/`; JSON-LD `AutoWash` with address (Sacramento), geo, phone, priceRange, openingHours, areaServed, sameAs links.
- **About**: Title “About Hardys Wash N' Wax…”; description/keywords; canonical `/about`; JSON-LD `AboutPage` containing `LocalBusiness` entity (name, image/logo, address, areaServed, offer catalog of services).
- **Contact**: Title/description/keywords for contact; canonical `/contact`; JSON-LD `ContactPage` with `LocalBusiness` data (tel, email, address, openingHours, areaServed).
- **Booking**: Title/description/keywords for booking; canonical `/booking`; JSON-LD `ReservationService` with provider `LocalBusiness`, serviceType “Mobile Car Detailing”, availableAtOrFrom places.
- **Services (generic)**: Title/description and canonical `/services`; OG tags.
- **Service detail pages** (interior/exterior/ceramic/paint correction and SEO-variant service pages): Each page sets its own title/description/keywords, canonical, and JSON-LD `Service` or `AutoWash` (for location pages) with address/areaServed and geo when location-specific.
- **Location pages** (e.g., `/sacramento-car-detailing`): Title/description/keywords, canonical; JSON-LD `AutoWash` with city-specific address, geo coords, areaServed/GeoCircle, sameAs.
- **Blog index**: Title “Car Detailing Tips & Guides | Hardy's Wash N' Wax Blog”; description; JSON-LD `Blog` with publisher org logo.
- **Blog post page**: Per-post title/metaDescription; OG title/description/image; canonical `/blog/{slug}`; JSON-LD `Article` with headline, description, image, datePublished, author org, publisher logo; optional JSON-LD `FAQPage` generated from `faqSchema`.
- **Legal pages** (`/privacy-policy`, `/sms-terms`): Title/description, canonical.

## Data sources to reuse
- Blog posts data (already imported to `src/data/blogPosts.js`): contains `title`, `metaDescription`, `date`, `coverImage`, `faqSchema`, etc. Use these fields to drive per-post meta + JSON-LD.
- Reviews data (now in `src/data/reviews.js`) for social proof; not directly SEO meta, but can be leveraged for structured data later if desired (e.g., `AggregateRating`).

## Implementation gaps in current project
- New routes were added, but React Helmet/head tags have not been reattached. Reintroduce per-route `<Helmet>` (or similar head manager) using the above titles/descriptions/canonicals and JSON-LD payloads.
- Home page currently lacks the `AutoWash` JSON-LD and OG/Twitter tags present in `carcare-old`.
- About/Contact/Booking pages in this project lack their prior meta/structured data blocks.
- Blog index/post pages need their head tags wired from the blog data (as in the legacy components).
- Canonical links are missing across pages; add them with the production domain.

## Quick checklist to finish SEO parity
1) Add Helmet (or `react-helmet-async`) and wire per-route head blocks matching the legacy titles/descriptions/keywords + canonical.  
2) Inject JSON-LD for Home (`AutoWash`), About (`AboutPage` + `LocalBusiness`), Contact (`ContactPage`), Booking (`ReservationService`), location pages (`AutoWash` with city geo), services (`Service`), blog index (`Blog`), and blog posts (`Article` + optional `FAQPage`).  
3) Ensure OG/Twitter tags on all marketing pages mirror title/description; add `og:image` where available (e.g., blog cover images, logo fallback).  
4) Confirm favicon/apple-touch/manifest links are present in `public/index.html` (icons exist in `public/`).  
5) Verify canonical URLs use `https://www.hardyswashnwax.com` with correct slugs.  
6) If deploying SPA, configure sitemap/robots appropriately (legacy `sitemap.xml` and `robots.txt` live in `public/`).  
