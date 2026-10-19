# Our Little Pond

A lightweight, responsive storybook website made as a personal gift for Hagar. It uses plain HTML, CSS, and JavaScript modules; there is no build step, framework, backend, tracking, or autoplay.

## Run locally

From this folder, start a static HTTP server:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). Opening `index.html` directly may block JavaScript modules in some browsers, so use the local server.

## Personalize before sharing

- `js/chapters.js` contains the chapter text and notes.
- `js/memories.js` lists all 18 photos in `assets/` and three empty future-photo cards. Update titles, optional dates, captions, and descriptive `alt` text there. Each story chapter also displays three photos from the collection.
- `js/reasons.js` contains the appreciation notes.
- `app.js` contains the final letter and its signature/reveal behavior. Update the letter to sound like you.
- `assets/chopin-nocturne-op9-no2.ogg` is the optional romantic piano track. It is loaded only after pressing the play button.
- `assets/art-nouveau-dragonfly.svg` is a locally stored decorative artwork from 1909, marked public domain on Wikimedia Commons.
- The Pond Post Office lets visitors write up to six short wishes into paper boats. Wishes stay in memory only for the current page visit and are never saved or sent.
- The message composer opens a prefilled WhatsApp chat to Hagar only after the visitor writes a note and clicks its link. WhatsApp uses the sender's signed-in account and still requires them to review and send it; the website does not transmit or store messages.

The gallery uses the photos already in `assets/`; the three future cards are intentionally empty. Missing or empty photos show a graceful placeholder.

## Photos and privacy

Files committed to a public GitHub repository are publicly accessible. The photos in `assets/` appear on the site, so do not publish the repository unless everyone pictured is comfortable with those photos being public. Resize and compress photos before adding them. A private GitHub repository is not a private photo-hosting service once the site itself is published on GitHub Pages.

The WhatsApp recipient number is present in the client-side `app.js` so the click-to-chat link can work. Anyone who can access the public website can inspect that number; only publish the site with the recipient's consent. Message text is placed in a WhatsApp link only after the visitor chooses to open it and is not stored by this site.

## GitHub Pages

**Live website:** [https://islamalsohby-1.github.io/For_Hagar/](https://islamalsohby-1.github.io/For_Hagar/)

This project is published in [`Islamalsohby-1/For_Hagar`](https://github.com/Islamalsohby-1/For_Hagar). To get a local copy, run:

```powershell
git clone https://github.com/Islamalsohby-1/For_Hagar.git
```

To publish future changes from a local clone, stage the site files, commit, and push them to `main`. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save. Wait for the deployment to finish and verify the story, photos, audio toggle, message composer, and game. Asset URLs are relative, so they work under the repository subpath.

The GitHub Pages URL uses a GitHub subdomain and is free. A custom `.com` domain must normally be registered separately. Social-preview metadata is included, but each messaging platform decides whether and how to show link previews; many require an absolute image URL and may not use a relative SVG preview.

## Accessibility and behavior

- The story panel supports the left and right arrow keys while it has keyboard focus.
- The gallery lightbox supports Escape, arrow keys, touch swipes, a position counter, focus return, and tab trapping. Chapter photos open in the same viewer.
- The game supports keyboard, mouse, and touch input.
- Paper-boat wishes are keyboard-accessible, remain only in the current page session, and can be cleared at any time.
- The message preview updates locally as text is written. The WhatsApp link stays disabled until there is a non-empty message, opens a prefilled chat in a new tab, and never sends automatically.
- Motion is reduced when the system requests reduced motion.
- Romantic piano music is optional, loops at a gentle volume, and starts only after the user activates its control. The site remains usable if audio is unavailable.
- Music credit: Frédéric Chopin, *Nocturne No. 2 in E-flat major, Op. 9*; piano performance by Peter Johnston. The recording is marked CC0 on Wikimedia Commons: [source and license](https://commons.wikimedia.org/wiki/File:Chopin_Nocturne_No._2_in_E_Flat_Major,_Op._9.ogg).
- Dragonfly artwork: anonymous, from *Annuaire graphique* (1909), public domain; [Wikimedia Commons file and source](https://commons.wikimedia.org/wiki/File:Art_Nouveau_dragonfly_cache-blanc.svg).
- No personal data is collected or uploaded.
