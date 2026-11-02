# BioBrain website

A static website (plain HTML, CSS and JavaScript). No build step and no dependencies.

## Folder structure

```
index.html                    Home (header, hero, four cards, footer)
ai-solutions.html             AI Solutions & Services
scientific-intelligence.html  placeholder, to be written
blog.html                     placeholder, to be written
about.html                    Founder & Expertise
research-summary.html         Summary of the MSc research proposal (linked from About)
review-summary.html           Summary of the narrative review (linked from About)
contact.html                  placeholder (form to be added)
style.css                     all styling; colours and sizes are the tokens at the top
script.js                     mobile menu, reveal on scroll, logo text fit
images/                       logo.png, hero.jpg, card images, research figure
```

## Status (what works and what does not)

| Page / feature | Status |
| --- | --- |
| Home | Working |
| About (Founder & Expertise) | Working |
| AI Solutions | Working |
| Scientific Intelligence | Built (product page with PDF and screenshots) |
| Blog | Placeholder page |
| Contact form | Not built yet. The Contact page only has an email button with a placeholder address |
| Blog system / CMS | Not built yet |
| Sitemap, robots.txt, social-share image | Not added yet (they need the final domain) |

The Scientific Intelligence card on the home page links directly to the app
(https://biobrain-scientific-intelligence.onrender.com/) until an overview page exists.
That address comes from the project brief and has not been checked.

## Change colours and fonts

Open `style.css`. The colours are variables in the `:root` block at the top.
Fonts (Manrope for headings, Inter for text) are loaded in the `<head>` of every page.

## Publish on Netlify

Option 1 (simplest): go to https://app.netlify.com/drop and drag this whole folder onto the page.
Claim the site with a free account so it is not deleted, then connect your domain in the site settings.

Option 2 (Git): put the folder in a GitHub repository and connect it to Netlify.
Build command: leave empty. Publish directory: `.` (the repository root).
`netlify.toml` already contains these settings.

## Notes

- No API keys or secrets are stored in this project. If AI features are added later,
  they need a secure backend (for example serverless functions).
- `contact.html` has a Netlify Forms contact form (`data-netlify`). It only works once deployed on Netlify; after deploying, send a test message and check Netlify > Forms (set email notifications there).

## Changing the application link
Open `script.js` and edit the single line `var BIOBRAIN_APP_URL=...` at the top. Every "Launch BioBrain" button on the site uses it. (The same address also appears as a fallback inside the HTML buttons; the script replaces it.)

## Blog (Decap CMS)
Write posts at `/admin` on the live site (log in with GitHub). Click **New Blog post**, write, then **Publish**. Netlify rebuilds the site automatically and the post appears on the blog page within about a minute.
Posts are stored as files in `content/blog/`; `build.js` turns them into pages in `posts/` and fills the list in `blog.html` and `sitemap.xml`. Do not edit those generated files by hand.
One-time setup: see "Blog login setup" below.

### Blog login setup (once)
1. GitHub: Settings > Developer settings > OAuth Apps > New OAuth App. Homepage URL: your site address. Authorization callback URL: `https://api.netlify.com/auth/done`. Create it and generate a client secret.
2. Netlify: Project configuration > Access & security > OAuth > Install provider > GitHub. Paste the Client ID and Secret.
3. Open `your-site/admin` and log in with GitHub.
