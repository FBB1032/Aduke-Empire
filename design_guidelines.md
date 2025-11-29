# Aduke Empire Design Guidelines

## Design Approach
**Reference-Based:** Drawing from high-end e-commerce experiences like Shopify boutiques, Etsy's marketplace clarity, and fashion-forward brands. The design celebrates modest Islamic fashion with elegant restraint, letting product photography dominate while maintaining sophisticated brand presence.

## Typography System
**Brand Identity:** Great Vibes (Google Fonts) for "Aduke's Empire" logo/brand only
**Primary:** Inter or DM Sans (Google Fonts) - clean, modern sans-serif for all UI text
**Hierarchy:**
- Hero Headlines: text-4xl lg:text-6xl, font-light
- Section Titles: text-2xl lg:text-3xl, font-medium
- Product Names: text-lg font-medium
- Prices: text-xl font-semibold (₦ symbol)
- Body/Descriptions: text-base
- Category Labels: text-sm uppercase tracking-wide
- CTAs: text-base font-medium

## Layout System
**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 20, 24 (p-4, gap-6, my-8, py-12, etc.)
**Container Strategy:**
- Max-width: max-w-7xl mx-auto px-4 lg:px-8
- Section padding: py-12 lg:py-20
- Card padding: p-6
- Component gaps: gap-6 lg:gap-8

**Grid Systems:**
- Mobile: grid-cols-2 gap-4
- Tablet: grid-cols-3 gap-6
- Desktop: grid-cols-4 lg:grid-cols-5 gap-8
- Admin panels: Single column forms with max-w-2xl

## Component Library

### Navigation
**Sticky Navbar:**
- Fixed top with subtle shadow on scroll
- Logo (Great Vibes) left-aligned
- Navigation links: Abaya | Scarf | Jallabiya | Admin (horizontal on desktop, hamburger menu on mobile)
- Height: h-16 lg:h-20
- Spacing: px-4 lg:px-8

### Product Cards
**Listing Cards:**
- Image container: aspect-square with object-cover
- Hover effect: subtle scale (scale-105 transition)
- Product name: truncate text with line-clamp-2
- Price: prominent display with ₦ symbol
- Best Seller badge: absolute top-2 right-2, small pill badge
- "Show More Details" link: underline-offset-4 on hover
- Card spacing: p-4 with rounded-lg

### Product Detail Page
**Layout:**
- Two-column on desktop (lg:grid-cols-2)
- Image: aspect-[3/4] with rounded-lg, max height on desktop
- Details panel: sticky top-20
- Price: Large, bold ₦ display (text-3xl)
- Metadata grid: Color, Size in 2-column (grid-cols-2 gap-4)
- WhatsApp CTA: Full-width prominent button, green accent matching WhatsApp brand

### Hero Section (Home)
**Structure:**
- Height: min-h-[60vh] lg:min-h-[75vh]
- Large hero image showcasing elegant modest fashion photography
- Centered content overlay with semi-transparent dark backdrop
- Headline: "Aduke's Empire" in Great Vibes, large scale
- Subheading: "Timeless Modest Fashion" 
- Primary CTA: "Shop Abayas" button with blurred background (backdrop-blur-md bg-white/10)

### Category Showcases (Home)
**Grid Layout:**
- Three equal cards for Abaya, Scarf, Jallabiya
- Image: aspect-[4/5] with overlay gradient
- Category name overlaid on image
- "Explore" CTA button

### Best Sellers Section (Home)
**Grid:** Same as product listing (2-4 columns responsive)
**Badge:** Distinctive "Best Seller" indicator with star icon

### Footer
**Multi-column layout:**
- Brand column (logo + tagline)
- Quick Links (Categories, Admin)
- Contact (WhatsApp number display)
- Social media placeholder icons
- Copyright text
- Padding: py-12 lg:py-16

### Admin Interface
**Login Page:**
- Centered card: max-w-md mx-auto
- Simple email/password form
- Minimal, focused design

**Admin Panel:**
- Sidebar navigation (desktop) / top tabs (mobile)
- Form layouts: max-w-2xl with generous spacing
- Image upload: Drag-drop zone with preview
- Product list: Table on desktop, cards on mobile
- Action buttons: Edit (blue accent), Delete (red accent)

## Images
**Critical Image Placements:**
1. **Hero Image (Home):** Full-width elegant lifestyle shot of model in abaya, soft lighting, professional photography feel, aspect ratio 16:9 on desktop
2. **Category Images:** Three featured images for each category showing signature pieces, aspect 4:5, high quality product photography
3. **Product Images:** Clean white or neutral background product shots, aspect square (1:1) for listings, aspect 3:4 for detail pages
4. **Best Sellers:** Product photography with consistent styling across grid

**Image Treatment:** 
- Subtle rounded corners (rounded-lg)
- Hover state: gentle zoom (scale-105)
- Loading state: skeleton with subtle shimmer
- Fallback: placeholder with elegant pattern

## Interactions
**Minimal Animation Strategy:**
- Smooth transitions on hover (transition-transform duration-300)
- Infinite scroll: subtle fade-in for new items
- Loading states: Simple spinner or skeleton screens
- No parallax, no complex scroll animations
- Focus on performance over flourish

## Accessibility
- Focus rings visible on all interactive elements
- Adequate contrast ratios for all text
- Alt text for all product images
- Form labels clearly associated
- Keyboard navigation fully supported
- Mobile touch targets minimum 44x44px

## Mobile-First Principles
- All touch targets easily tappable (minimum p-3)
- Sticky navbar doesn't obscure content
- Forms adapt to mobile keyboards
- Images optimized for mobile loading
- WhatsApp integration native on mobile browsers