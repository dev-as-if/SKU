# SKU Website Local Clone

Static local mirror of the public Shri Krishna University website.

## Run locally

Requirements: Node.js 18+ and internet access only when crawling.

```powershell
npm install
npm run dev
```

Open http://localhost:5173/.

## Update the mirror

```powershell
npm run crawl
npm run backfill-assets
npm run check-links
```

The crawler saves public HTML routes to `mirror-full/pages` and local resources to `mirror-full/static`. Admin/authenticated routes and third-party services are intentionally excluded. Download failures are recorded in `clone-manifest.json` and `asset-backfill-report.json`.

## GitHub Pages and custom domain

The existing `.github/workflows/pages.yml` builds and deploys the `site` directory, which contains only the homepage, result page, and their local assets.

1. Push the repository to GitHub and confirm the Pages workflow succeeds under **Actions**.
2. In **Settings > Pages**, choose **GitHub Actions** as the source.
3. Add a plain-text file named `CNAME` at the repository root containing only your domain, for example `www.example.com`. The build copies it into `site/CNAME` automatically.
4. In **Settings > Pages**, enter the same custom domain and save it.
5. At your DNS provider, point `www` to `<github-user>.github.io` with a CNAME record. For an apex domain such as `example.com`, use GitHub Pages' A records or your provider's ALIAS/ANAME flattening; GitHub documents the current record values.
6. Wait for DNS and certificate verification, then enable **Enforce HTTPS**. Keep the current Netlify deployment available until the GitHub Pages URL and custom domain both serve the home and result pages correctly.

GitHub Pages does not run `server.js`; the result lookup works because it is implemented as a static client-side page. GitHub Pages hosting is free for public repositories within its usage limits, but requests and bandwidth are not literally zero. The current reported 11.5 GB/month is below GitHub's published 100 GB/month soft bandwidth limit; a scraper or traffic spike can still reach service limits.

## Netlify deployment

1. Push the repository to GitHub.
2. In Netlify, choose **Add new site > Import an existing project** and select the repository.
3. Use build command `npm run build:netlify` and publish directory `site` (this matches `netlify.toml`).
4. Deploy. The build creates the static site, copies the local assets, and generates the result PDF.
5. For a custom domain, open **Domain management > Add a domain**, then add the DNS records Netlify provides.

The result lookup is intentionally static: enrollment `SKU266920325` and DOB `15-02-2002` show the sample marks for Semesters 1–4. Only Semester 4 offers a PDF download. Replace `mirror-full/static/results/SKU266920325-result.pdf` with the final PDF before deploying.

## Status

The source mirror contains 113 captured public pages, but the deployment intentionally publishes only the homepage and result page. Their referenced runtime assets are local; third-party video and background-image requests were removed. External navigation links remain links and only contact their destination if a visitor chooses to follow them.