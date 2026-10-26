# Patricia Nicole Santos — Portfolio

A responsive, single-page portfolio built with semantic HTML, CSS, JavaScript, and jQuery. It is a static site with no build step and can be hosted on GitHub Pages.

The hero uses `assets/images/cloudvid.mp4` as a muted, looping background video. The static `assets/images/og-placeholder.svg` remains the social-sharing image because Open Graph image previews do not support MP4 video.

## Run locally

Open `index.html` directly in a browser, or serve this folder with any local static-file server. The contact form uses your default email application. Google Fonts and the small jQuery CDN dependency require an internet connection; the rest of the page is local static content.

## Personalization checklist

- [ ] Update the page title and meta description in `index.html`.
- [ ] Replace the favicon and Open Graph preview image in `assets/images/`.
- [ ] Add your portrait and update its image path / alt text in the About section.
- [ ] Add `assets/resume.pdf` for the Download Resume button.
- [ ] Replace each project GitHub URL and live-site placeholder URL.
- [ ] Replace the HydroDeck gallery SVG paths with `assets/images/hydrodeck/screenshot-1.png` through `screenshot-4.png` and edit their alt text/captions.
- [ ] Replace the RedMarket and Vibe thumbnail image paths with your project thumbnails.
- [ ] Add credential links or certificate images for each certification.
- [ ] Replace the GitHub and LinkedIn profile placeholders.
- [ ] If you choose Formspree, replace the contact form's `mailto:` action with your endpoint.

The `assets/images/` folders currently contain SVG placeholders so the layout is complete before you add your own files. Replace the marked SVG paths with your requested PNGs when you have them; until then, every image shown is a working local placeholder.

## Add a project card

1. In `index.html`, copy a complete block between `PROJECT CARD START` and `PROJECT CARD END` comments.
2. Keep the card's `article` element and its `data-category` value (`web`, `iot`, and/or `mobile`) so the filter bar continues to work.
3. Update the title, year, school, description, tags, image path and descriptive alt text, and project links.
4. For a normal thumbnail card, keep the `project-visual` and `project-body` structure. For a screenshot carousel, copy the HydroDeck gallery markup and update its slide list.
5. Put replacement images under `assets/images/` and retain the fallback SVG or add a matching fallback path.

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository's default branch.
2. Add your resume and replace the project/image placeholders before publishing.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select the default branch and `/ (root)`, then save.
5. Wait for GitHub Pages to publish and open the URL shown in the Pages settings.

All assets are referenced with relative paths, so the site works from a GitHub Pages project subpath as well as from a domain root.
