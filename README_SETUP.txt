RK CASHEW PANRUTI — READY TO DEPLOY

Website: https://rk-cashew-panruti.globalcashewco.workers.dev/

This package is arranged with the website files at the ROOT level.
Do not put index.html inside another folder when deploying.

ROOT FILES
- index.html
- sitemap.xml
- robots.txt
- google7de4791e693f3079.html
   /google6cea2babc08bf47b.html
- images/ (product photos)
- site-image-*.png

GOOGLE SEARCH CONSOLE
1. Ownership verification file is included.
2. Sitemap URL:
   https://rk-cashew-panruti.globalcashewco.workers.dev/sitemap.xml
3. After deployment, open the sitemap URL in a browser and confirm XML appears.
4. In Google Search Console > Sitemaps, submit: sitemap.xml
5. Use URL Inspection on the homepage and choose Request indexing.

CLOUDFLARE
If using Cloudflare Pages Direct Upload, upload the CONTENTS of this folder as the site assets.
The important requirement is that index.html, sitemap.xml, robots.txt and google7de4791e693f3079.html
   /google6cea2babc08bf47b.html are at the published site's root.

If using a Cloudflare Worker with static assets, configure the Worker to serve these files as assets. The same root paths must work:
/ 
/sitemap.xml
/robots.txt
/google7de4791e693f3079.html
   /google6cea2babc08bf47b.html

IMPORTANT
- Keep the images folder beside index.html.
- Do not rename sitemap.xml or robots.txt.
- Do not place the whole folder inside another folder during upload.
