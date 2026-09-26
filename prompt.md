# TASK: Create a Complete Pixel-Accurate Local Clone of https://www.skuindia.ac.in/

You are acting as a **senior frontend engineer, web scraping/mirroring specialist, QA engineer, and UI reconstruction expert**.

Your task is to create a **complete local clone of the publicly accessible Shri Krishna University website**:

https://www.skuindia.ac.in/

The finished project must reproduce the original website as accurately as technically possible, including:

* All publicly accessible pages
* Page structure
* Navigation
* Header
* Mega menus/dropdowns
* Footer
* Typography
* Colors
* Spacing
* Borders
* Shadows
* Animations
* Hover states
* Responsive behavior
* Mobile navigation
* Images
* Icons
* Logos
* Background images
* Image galleries
* Carousels/sliders
* Videos where publicly downloadable
* Documents/PDF links
* Notices
* News
* Tables
* Forms visually
* Buttons
* Cards
* Modals/popups
* Floating elements
* Responsive breakpoints
* Internal hyperlinks
* Other static/public multimedia and assets used by the website

The clone must run **completely locally** as far as technically possible.

Do NOT create a loosely inspired redesign.

Do NOT modernize the website.

Do NOT simplify the website.

Do NOT replace the design with your own interpretation.

The original website is the visual and functional source of truth.

---

# PRIMARY OBJECTIVE

When I open the local website and compare it side-by-side with:

https://www.skuindia.ac.in/

they should appear virtually identical at the same viewport size.

Aim for the highest practical visual similarity.

Pixel accuracy matters.

Content accuracy matters.

Responsive accuracy matters.

Navigation accuracy matters.

Do not stop after recreating only the homepage.

---

# IMPORTANT: WORK AUTONOMOUSLY

Do not repeatedly ask me how individual elements should look.

Inspect the original website yourself.

When something is unclear:

1. Inspect the original DOM.
2. Inspect computed CSS.
3. Inspect network requests.
4. Inspect loaded assets.
5. Inspect JavaScript behavior.
6. Test the component in the browser.
7. Compare screenshots.
8. Make the best technical decision.

Continue until the site has been comprehensively cloned.

Do not consider the task complete merely because the application compiles.

---

# PHASE 1 — ANALYZE THE ORIGINAL WEBSITE

Before coding, perform a thorough reconnaissance of:

https://www.skuindia.ac.in/

Use browser/devtools/browser automation if available.

Prefer Playwright or another Chromium-based automation tool for inspection.

Determine:

* Website architecture
* URL structure
* Same-origin pages
* Navigation hierarchy
* Header variants
* Footer structure
* Desktop navigation
* Tablet navigation
* Mobile navigation
* Mega menus
* Dropdowns
* Home page sections
* Inner-page layouts
* Reusable templates
* Breadcrumbs
* Sidebar layouts
* Tables
* Galleries
* Sliders
* Modals
* Notice areas
* Popups
* Forms
* Embedded media
* PDFs/documents
* Third-party integrations
* CSS frameworks/libraries
* JavaScript libraries
* Icon libraries
* Fonts
* Responsive breakpoints
* Animations
* lazy-loading behavior

Create an internal inventory such as:

```text
URL
Page title
Page type/template
Internal links
Images
CSS
JavaScript
Fonts
Videos
Documents
External resources
Special interactions
Clone status
```

Use this inventory to make sure pages are not accidentally omitted.

---

# PHASE 2 — CRAWL THE ENTIRE PUBLIC WEBSITE

Create a crawler capable of recursively discovering the site's publicly accessible same-origin URLs.

Start from:

https://www.skuindia.ac.in/

Also account for redirects such as `/Home/` if encountered.

Extract URLs from:

```text
<a href>
<img src>
<img srcset>
<picture/source
<script src>
<link href>
<video src>
<video poster>
<source src>
<audio>
<iframe>
<object>
<embed>
CSS url(...)
CSS @font-face
inline style background-image
data-src
data-srcset
lazy-load attributes
JavaScript-discovered resources where practical
```

Normalize URLs and prevent duplicate crawling caused by:

* trailing slashes
* fragments
* query-string variations
* HTTP/HTTPS differences
* www/non-www aliases
* redirects

Remain limited to content necessary for reproducing the publicly accessible website.

Do not attempt to circumvent authentication, authorization, CAPTCHAs, access controls, paywalls, or other protections.

---

# PHASE 3 — CREATE A RAW MIRROR AS REFERENCE

Use an appropriate site mirroring strategy in addition to browser crawling.

You may use tools such as:

* wget
* HTTrack
* Playwright
* Puppeteer
* curl
* custom Node.js crawler
* custom Python crawler

For example, investigate whether a command similar to the following is useful:

```bash
wget \
  --mirror \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --no-parent \
  --span-hosts=off \
  --domains=skuindia.ac.in,www.skuindia.ac.in \
  https://www.skuindia.ac.in/
```

Do NOT blindly rely on this exact command.

Determine the correct options yourself.

The raw mirror should primarily serve as:

* asset source
* HTML reference
* content reference
* URL reference
* backup for reconstruction

If wget misses dynamically loaded content, obtain it using browser automation.

---

# PHASE 4 — DOWNLOAD AND ORGANIZE ASSETS

Store locally all publicly retrievable assets necessary to faithfully reproduce the site.

Use a sensible structure, for example:

```text
public/
  assets/
    images/
    icons/
    fonts/
    css/
    js/
    videos/
    documents/
    gallery/
```

Preserve original filenames when useful, while safely resolving collisions.

Download:

* University logo(s)
* Header images
* Hero/banner images
* Faculty images
* Campus photos
* Gallery photos
* Recruiter/company logos
* Icons
* Background images
* SVGs
* Favicons
* Fonts where publicly supplied by the website
* Videos where they are directly/publicly hosted and permitted
* Public PDFs/documents needed by links
* Other static assets

Do NOT unnecessarily substitute original available images with placeholders.

Do NOT convert every asset to base64.

Use normal local paths.

---

# ASSET URL REWRITING

Rewrite remote same-site asset references to their corresponding local files.

For example:

```text
https://www.skuindia.ac.in/Content/images/example.jpg
```

should ultimately resolve to an appropriate local asset.

Make sure rewriting also works inside:

* HTML
* CSS
* inline CSS
* `srcset`
* lazy-loading attributes
* JavaScript configuration where practical

Detect and report missing assets.

The browser console should not contain hundreds of 404 errors.

---

# PHASE 5 — CHOOSE THE BEST IMPLEMENTATION STRATEGY

First determine whether the existing HTML/CSS/JS can be safely mirrored and run locally with minimal modification.

If YES:

Prefer preserving the original structure and styles because it will provide the greatest visual fidelity.

If the original implementation cannot operate reliably offline:

Reconstruct the site with clean reusable frontend code while preserving the original appearance and behavior.

A good modern fallback is:

```text
React
Vite
TypeScript
CSS
React Router where required
```

However:

**Do not rewrite the entire website into React merely because React is available.**

Choose whichever architecture produces the most accurate and maintainable local replica.

Pixel accuracy takes precedence over framework preference.

---

# PHASE 6 — IDENTIFY REUSABLE SITE COMPONENTS

When reconstruction is necessary, identify reusable pieces such as:

```text
TopUtilityBar
Header
DesktopNavigation
MegaMenu
MobileNavigation
HeroSlider
NoticeBoard
AnnouncementSection
QuickActionCards
SectionHeading
ContentPageLayout
SidebarNavigation
Breadcrumb
Gallery
VideoGallery
RecruiterCarousel
CallToAction
Footer
Modal
Popup
```

Avoid creating one gigantic component.

Also avoid overengineering.

---

# NAVIGATION MUST BE COMPLETE

The live site contains a substantial hierarchical navigation system.

Carefully reproduce categories including the current site's areas such as:

* About
* Faculty
* Academics
* Admissions
* R&D / Research
* Life @ SKU
* Information Corner
* Placement
* NIRF
* Login/Library and utility links where appropriate

Do not rely only on this list.

Discover the **actual current navigation directly from the website** and reproduce it.

The live site currently contains many child links under areas such as faculties, university administration, councils, regulatory information, admission programs, student support, campus life, research, media, galleries and career information.

Crawl and verify them instead of manually guessing the sitemap.

---

# INTERNAL PAGE REPRODUCTION

Do not clone only navigation links while leaving their destinations empty.

For each publicly accessible internal content page:

1. Capture its textual content.
2. Capture images.
3. Capture layout.
4. Capture headings.
5. Capture tables.
6. Capture sidebar/navigation where present.
7. Capture downloadable-document links.
8. Reproduce appropriate responsiveness.
9. Make its corresponding local URL work.

Where many pages use one common template, create a reusable template and populate it with page-specific content rather than duplicating code.

---

# URL MAPPING

Create a mapping between original URLs and local URLs.

For example:

```text
Original URL                         Local URL
/About/...                           /about/...
/Faculty/...                         /faculty/...
/Admission/...                       /admission/...
```

Preserve paths when practical because that minimizes link-rewriting errors.

Every same-origin internal link should point to the local clone.

Run an automated internal-link checker after implementation.

There should be no accidental navigation back to the live site for pages intended to be cloned.

---

# EXTERNAL LINKS

Some links on the university site lead to separate websites/services.

Examples may include:

* external library systems
* journals
* Google Forms
* 360° tour providers
* third-party portals
* other university-associated domains

Do NOT scrape unrelated third-party websites recursively just because they are linked.

For those resources:

* preserve the original external link,
* clearly treat it as external,
* or create a local informational placeholder if offline operation requires it.

Do not attempt to circumvent third-party restrictions.

---

# LOGIN / AUTHENTICATED SYSTEMS

Public login pages may be visually reproduced if part of the public website, but:

Do NOT attempt to copy:

* private databases
* credentials
* authenticated user information
* server-side administrative functionality
* restricted APIs
* authentication secrets
* private university data

If a server-side operation cannot be reproduced locally, reproduce its public UI faithfully and make it clear in code that backend functionality is unavailable.

---

# FORMS

Reproduce the visual design and frontend interactions of public forms.

Do NOT unintentionally submit local test data to production university endpoints.

Replace production form submissions with safe local behavior unless genuine connectivity is explicitly necessary.

The local clone must never accidentally:

* register students,
* submit applications,
* make payments,
* send university enquiries,
* modify university data.

---

# DYNAMIC FEATURES

Inspect and reproduce frontend-visible behavior including, wherever applicable:

* hero sliders
* image carousels
* recruiter sliders
* notice sliders/tickers
* dropdown navigation
* mega menus
* mobile drawer
* accordions
* tabs
* popup notifications
* modal windows
* sticky navigation
* scrolling behavior
* gallery lightboxes
* animation
* hover states
* active navigation states
* embedded video displays
* button transitions

Do not simply show static screenshots of dynamic controls.

---

# RESPONSIVENESS IS CRITICAL

The local clone must behave like the original across screen sizes.

Test at minimum:

```text
375 × 812
390 × 844
430 × 932

768 × 1024
820 × 1180

1024 × 768
1280 × 720
1366 × 768
1440 × 900
1536 × 864
1920 × 1080
```

Also test intermediate widths.

Do not merely add:

```css
@media (max-width: 768px)
```

and call the site responsive.

Inspect how the real site changes at different widths and reproduce those transitions.

Pay particular attention to:

* navigation
* mega menus
* hamburger menu
* typography
* hero height
* cards
* columns
* images
* content padding
* tables
* footer
* modals
* gallery layouts

There must be no unexplained horizontal overflow.

---

# VISUAL VALIDATION — MANDATORY

This is one of the most important requirements.

Use Playwright or equivalent browser automation to capture screenshots of BOTH:

1. original website
2. local website

at identical viewport dimensions.

Example:

```text
Original:
https://www.skuindia.ac.in/

Clone:
http://localhost:5173/
```

Capture desktop, tablet and mobile screenshots.

Perform side-by-side comparisons.

If possible, also implement automated image-difference analysis.

Compare:

* element positions
* width
* height
* margins
* padding
* fonts
* font sizes
* line heights
* font weights
* colors
* borders
* border radius
* shadows
* image crop
* object positioning
* alignment
* section heights
* responsive transitions

Iteratively fix meaningful discrepancies.

Do not declare completion immediately after the first working implementation.

---

# COMPUTED STYLE INSPECTION

When something doesn't visually match, use the browser's computed styles from the original site.

Determine properties such as:

```text
font-family
font-size
font-weight
line-height
letter-spacing
color
background
margin
padding
width
height
max-width
display
grid
flex
gap
position
border
border-radius
box-shadow
object-fit
object-position
z-index
```

Do not approximate properties that can be inspected directly.

---

# FONT ACCURACY

Determine which fonts the live site uses.

If fonts are provided as publicly downloadable web assets and local reuse is permitted, store and reference them locally.

Otherwise use the closest legitimate fallback.

Do not silently substitute a noticeably different font.

---

# CONTENT ACCURACY

Do not use:

```text
Lorem ipsum
Sample notice
Example event
Placeholder university
Example image
```

when the corresponding public content exists on the source website.

Use the actual publicly visible website content needed for the clone.

Preserve:

* spelling
* capitalization
* ordering
* titles
* labels
* menu text
* captions
* button labels

unless a technical reason requires modification.

---

# IMAGE ACCURACY

Images should have:

* correct aspect ratio
* correct crop
* correct `object-fit`
* correct positioning
* correct dimensions
* correct responsive behavior

A correct image displayed with the wrong crop still counts as an inaccurate clone.

---

# PDF / DOCUMENT HANDLING

Discover public document links such as:

```text
.pdf
.doc
.docx
.xls
.xlsx
```

When they belong to the university site and are needed for faithful offline browsing, download them into:

```text
/public/assets/documents/
```

Rewrite appropriate internal document links to local versions.

Do not attempt to bypass restricted document access.

---

# VIDEO HANDLING

For directly hosted public video files needed by the page, download them if practical and allowed.

For services such as YouTube or an external 360° tour:

do not attempt to illegally extract or circumvent provider restrictions.

Preserve external embeds/links or provide an appropriate online-only treatment.

---

# BROKEN RESOURCE DETECTION

Implement a validation process that detects:

```text
404 resources
failed images
failed stylesheets
failed scripts
missing fonts
broken local links
console errors
uncaught JavaScript errors
mixed local/production paths
```

Fix all material issues.

---

# CRAWLER SAFETY

The crawler should:

* use sensible concurrency
* avoid overwhelming the server
* respect clear access restrictions
* avoid infinite URL loops
* deduplicate pages
* avoid authenticated/private areas
* avoid destructive requests
* use GET/HEAD only for discovery whenever possible
* cache already downloaded resources

Do not perform aggressive or abusive crawling.

---

# OFFLINE MODE

After the clone has been created, perform an offline-oriented test.

Where reasonable:

1. Start the local server.
2. Block requests to `skuindia.ac.in`.
3. Browse the clone.
4. Verify which pages/assets still work.
5. Identify unavoidable third-party dependencies.

For the portions intended to be locally mirrored, normal rendering should not depend on production assets.

---

# DO NOT HOTLINK LOCALIZED ASSETS

If an image belongs to content we have deliberately mirrored locally, do not leave:

```html
<img src="https://www.skuindia.ac.in/...">
```

Use the downloaded local version.

The same applies to mirrored CSS, JS, fonts and appropriate media.

---

# KEEP A CLONE MANIFEST

Generate:

```text
clone-manifest.json
```

containing useful information such as:

```json
{
  "source": "https://www.skuindia.ac.in/",
  "pagesDiscovered": 0,
  "pagesCloned": 0,
  "imagesDownloaded": 0,
  "documentsDownloaded": 0,
  "videosDownloaded": 0,
  "externalLinks": [],
  "failedResources": [],
  "skippedRestrictedResources": []
}
```

Populate it with real values at the end.

---

# CREATE A QA REPORT

Generate:

```text
CLONE_QA.md
```

including:

```text
Pages discovered
Pages successfully cloned
Pages skipped and why
Assets downloaded
Broken resources
External dependencies
Responsive tests performed
Desktop screenshots checked
Tablet screenshots checked
Mobile screenshots checked
Known visual differences
Known functional limitations
```

Do not hide failures.

---

# PROJECT DOCUMENTATION

Create a useful README containing:

```text
# SKU Website Local Clone

Requirements
Installation
Running locally
Building production version
Architecture
Crawler/mirroring approach
Asset storage strategy
URL mapping
How to rerun crawl
How to run visual tests
Known limitations
```

The project should be runnable with a small number of commands.

For example:

```bash
npm install
npm run dev
```

and, if implemented:

```bash
npm run crawl
npm run validate
npm run test:visual
npm run check-links
```

---

# IMPORTANT ENGINEERING RULES

Do not:

* randomly redesign components
* invent content
* leave placeholder sections
* ignore mobile
* clone only the homepage
* replace everything with screenshots
* hotlink mirrored assets
* leave hundreds of broken URLs
* disable navigation to hide unfinished pages
* unnecessarily rewrite existing working CSS
* use random substitute images
* ignore console errors
* assume that compilation means completion

Do:

* inspect
* crawl
* download
* reconstruct only where necessary
* validate
* compare
* fix
* repeat

---

# VISUAL QUALITY TARGET

Use the original website as ground truth.

Target:

**95%+ practical visual similarity for important public pages and shared templates.**

For the homepage and major navigation templates, aim even higher.

If screenshot-diff tooling is practical, use it to quantify differences while understanding that dynamic content may introduce noise.

---

# PRIORITY ORDER

When deciding what to work on, use:

1. Complete resource/page discovery
2. Shared header/navigation
3. Homepage
4. Shared footer
5. Common internal-page template
6. Main navigation destinations
7. Images/assets
8. Galleries/media
9. Responsive behavior
10. Dynamic UI behavior
11. Remaining public pages
12. Offline asset resolution
13. Link validation
14. Screenshot comparison
15. Final visual polish

---

# RECOMMENDED WORKFLOW

Execute approximately this process:

```text
Step 1
Crawl live website and construct sitemap.

Step 2
Inventory HTML/CSS/JS/images/fonts/media/documents.

Step 3
Create raw website mirror/reference.

Step 4
Inspect desktop and mobile behavior with Chromium.

Step 5
Determine whether raw mirror can be repaired or whether components must be reconstructed.

Step 6
Set up local project.

Step 7
Reproduce shared layout.

Step 8
Build/reproduce homepage.

Step 9
Build common inner-page templates.

Step 10
Populate discovered pages.

Step 11
Download/rewrite assets.

Step 12
Repair navigation and URLs.

Step 13
Reproduce interactive components.

Step 14
Test responsiveness.

Step 15
Run link/resource checker.

Step 16
Take live-vs-local screenshots.

Step 17
Perform image comparison.

Step 18
Fix discrepancies.

Step 19
Repeat screenshot comparison.

Step 20
Run final QA and create CLONE_QA.md.
```

---

# PLAYWRIGHT VISUAL TESTING

If Playwright is available, use it heavily.

Create scripts that can:

* visit every important URL
* wait for page completion
* dismiss predictable popups where necessary
* capture desktop screenshots
* capture mobile screenshots
* detect console errors
* detect failed network resources
* validate links

Maintain screenshot directories such as:

```text
tests/screenshots/live/
tests/screenshots/local/
tests/screenshots/diff/
```

Use deterministic filenames derived from routes.

---

# DISCOVER RESPONSIVE BEHAVIOR, DON'T GUESS

For important components, automatically inspect the live page at several widths.

For example:

```text
1920
1440
1366
1024
820
768
430
390
375
```

Determine exactly where:

* desktop navigation disappears
* mobile navigation activates
* columns stack
* text scales
* cards change width
* galleries reflow
* footer columns collapse

Implement equivalent behavior.

---

# COMPLETION CRITERIA

You may declare the project finished only when all of the following are true:

[ ] Homepage closely matches original

[ ] Header closely matches original

[ ] Desktop navigation works

[ ] Mega menus/dropdowns work

[ ] Mobile navigation works

[ ] Footer closely matches original

[ ] Major internal pages have been cloned

[ ] Public textual content is populated

[ ] Images render from appropriate local assets

[ ] Gallery/media pages are addressed

[ ] Public documents are addressed

[ ] Responsive layouts have been tested

[ ] Main hover/click interactions work

[ ] No major browser console errors

[ ] No major same-site internal broken links

[ ] No significant unintended production hotlinks for mirrored assets

[ ] Visual screenshot comparison has been performed

[ ] Desktop visual QA has been performed

[ ] Mobile visual QA has been performed

[ ] `clone-manifest.json` exists

[ ] `CLONE_QA.md` exists

[ ] `README.md` contains working setup instructions

---

# FINAL INSTRUCTION

Start by examining:

https://www.skuindia.ac.in/

Do not immediately start writing generic React components.

First understand and crawl the source site.

Use a combination of:

**browser inspection + recursive crawler + asset downloader + source analysis + local reconstruction + Playwright visual regression testing**

rather than depending exclusively on one technique such as wget.

Make reasonable decisions autonomously.

Continue working through discovered pages and problems rather than stopping after producing a prototype.

The goal is a **high-fidelity, responsive, locally runnable reproduction of the publicly accessible website**, not merely a website that looks vaguely similar.
