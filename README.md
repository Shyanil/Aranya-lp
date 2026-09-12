# Aranya Landing Page (SSR)

Official landing page for **Aranya by Rang Homes** (Aerocity, Dharapur, Guwahati).

## Architecture: Server-Side Rendering (SSR) & SEO Optimization

This application has been converted from client-side rendering (CSR) to **full Server-Side Rendering (SSR)** for search engine visibility (SEO) and performance:

1. **Full SSR HTML Pre-rendering**:
   - Web crawlers (Googlebot, Bingbot, social media crawlers) immediately receive the full 120KB+ semantic HTML inside `<div id="root">` with headings, copy, image alt tags, floor plans, and amenities.
   - Zero empty white screen on load.
   - Near-instant First Contentful Paint (FCP) and Largest Contentful Paint (LCP).

2. **Full Client Hydration**:
   - The browser hydrates the server-rendered DOM via `ReactDOM.hydrateRoot()` in [src/entry-client.jsx](file:///src/entry-client.jsx).
   - Interactive features (2BHK/3BHK floor plan tabs, lead enquiry modal, gallery lightbox, FAQ accordion, cursor animations) work seamlessly.

3. **Production Optimization**:
   - Replaced heavy in-browser `@babel/standalone` (~2.5 MB) and development scripts with a pre-compiled, minified client bundle built with `esbuild`.
   - Node server serves with `gzip` compression and HTTP cache headers for static assets.

4. **SEO Enhancements**:
   - Primary Meta Tags (`title`, `description`, `keywords`, `robots`).
   - Open Graph (OG) tags for Facebook, LinkedIn, WhatsApp link previews.
   - Twitter Card tags.
   - Schema.org JSON-LD Structured Data: `ApartmentComplex`, `RealEstateListing`, and `FAQPage` rich snippets for Google search results.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production (SSR & Hydration Bundle)
```bash
npm run build
```
This bundles the client hydration script into `dist/client.js`, compiles the server renderer into `dist/entry-server.cjs`, and generates pre-rendered SSR HTML in `index.html`.

### 3. Run the SSR Server
```bash
npm start
```
The server will start at `http://localhost:3000/`:
- **Coming Soon Page**: `http://localhost:3000/coming-soon` (or `/coming-soon.html`)
- **Full Landing Page**: `http://localhost:3000/` (or `/index.html`)

---

## Coming Soon Page Structure

The **Coming Soon** page (`/coming-soon`) is a streamlined pre-launch experience with:
1. **Hero / Coming Soon**:
   - Brand: ARANYA by Rang Homes
   - Taglines: *"A different way to live in Guwahati"* & *"Premium nature-led living in Dharapur"*
   - Strong architectural visual with ambient forest lighting and "Get Early Access" CTA
2. **Three Proof Points** (The 3 Core Proof Blocks):
   - **Green**: 70% green open space* (native tree canopy, aroma gardens, zero-surface vehicles)
   - **Wellness**: Holistic wellness & senses (yoga pavilion, swimming oasis, fresh air channels)
   - **Club**: Club Aranya, 16,000+ sq. ft.* (private gymnasium, gaming lounge, banquet hall)
3. **Early Access / Lead Form**:
   - Header: *"Be First in Line"*
   - Description: *"Register for Early Access to receive launch updates, configuration details and first access to project information before the wider launch communication."*
   - Interactive priority registration form with instant PDF brochure download and direct WhatsApp desk connect.
4. **Footer**:
   - Clean luxury footer with RERA disclaimer, project credentials, and developer info.