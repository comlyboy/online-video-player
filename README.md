# Online Video Player

A dark, modern web app built with Next.js (App Router, static export), Tailwind CSS and Zustand.

It does two things:

1. **Streaming platforms** - quick-access cards that open external streaming websites (currently Goojara and MovieBox HD) in a new tab, so you watch directly on their own site.
2. **Play from a URL** - paste a direct video link (MP4, WebM, Ogg, and more with plugins) and it plays right in the app using [ArtPlayer](https://artplayer.org/), with fullscreen, Picture-in-Picture, playback speed and more.

---

## Tech stack

- **Framework:** Next.js (App Router), built as a static export (`output: "export"`)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand, with the `persist` middleware for saved preferences
- **Player:** ArtPlayer.js

---

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server (runs on port 4200, not 3000):

```bash
npm run dev
```

Open [http://localhost:4200](http://localhost:4200).

---

## Build

Produce a static export:

```bash
npm run build
```

The static site is written to `out/`. Preview it locally with:

```bash
npm run start
```

Because this is a static export, there is no Node.js server at runtime. Deploy the `out/` directory to any static host (Vercel, Netlify, S3 + CloudFront, GitHub Pages, etc.).

---

## Project structure

```
src/
├── app/                 # Routes (App Router)
│   ├── page.tsx         # Home: hero, streaming platforms, features
│   └── play/page.tsx    # Play-from-URL page
├── components/          # UI components (each named *Component)
├── data/                # Static data, e.g. the streaming platform list
├── lib/                 # Small framework-free helper functions
├── store/               # Zustand stores
└── types/                # Shared TypeScript types
```

---

## Notes on the streaming platform cards

The platform cards link out to third-party websites in a new tab; the app does not embed, proxy, or rehost their content. Playback of those platforms happens entirely on their own site.

---

## Video URL requirements (Play from a URL)

Supports publicly accessible, direct media file links.

Works:

```
https://example.com/movie.mp4
```

Does not work:

```
https://youtube.com/watch?v=xxxx
https://vimeo.com/xxxx
Local video files
```

---

## License

MIT
