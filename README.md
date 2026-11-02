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

## Adding a blog post
1. Copy `post-template.html` to `post-your-title.html` and write the post (also delete the `noindex` line in its head).
2. Open `blog.html`, copy the commented card example into `<div class="posts">`, fill it in (newest first). The "first posts are on their way" message hides itself once a card exists.
3. Re-upload the site.
