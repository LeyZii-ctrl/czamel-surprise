# For Czamel 💗 — pink surprise website

Files: `index.html`, `style.css`, `script.js`, `czamel-liit.jpg` (her photo). No build step, no dependencies,
no email service, no accounts or keys needed.

## Get a public link (Netlify Drop, free, ~1 minute)
1. Go to https://app.netlify.com/drop and sign up / log in (needed so the link doesn't expire after about an hour).
2. Drag the whole `czamel-surprise` folder onto the page.
3. Copy the link (e.g. https://random-name.netlify.app) and send it to her. She doesn't need an account.
   Tip: Site configuration -> Change site name for a cuter link.
To update later: Deploys -> drag the edited folder again. The link stays the same.

## Edit things
- Opening and YES text: `index.html`
- Reasons list, NO-button teasing lines: top of the extras section / `TEASES` and `REASONS` in `script.js`
- Flower and envelope notes: the `data-note="..."` attributes in `index.html`
- Photo: replace `czamel-liit.jpg` with another image of the same name (about 720px wide keeps it fast)

- Cards, scratch secret and wishes: `data-note` on the cards in `index.html`, `WISHES` in `script.js`. Smile meter fills as she explores (8 steps).
- Fonts: Dancing Script (headings) + Quicksand (text), loaded from Google Fonts.
