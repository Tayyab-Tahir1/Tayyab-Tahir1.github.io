# Tayyab Tahir: research portfolio

Source for <https://tayyab-tahir1.github.io>. Built with [Astro](https://astro.build) as a static site and
deployed to GitHub Pages by a GitHub Action on every push to `main`.

Most updates are edits to one text file. You only touch code to change the design.

## Where things live

| What | File |
|---|---|
| Name, tagline, bio, links, education, experience, certifications | `src/data/profile.yaml` |
| Papers (journal, conference, in preparation, thesis) | `src/data/publications.yaml` |
| One file per project | `src/content/projects/<slug>.md` |
| Project images (figures, thumbnails, video posters) | `src/assets/projects/<slug>/` |
| Hero images and the research map | `src/assets/hero/` |
| Certification badge images | `src/assets/badges/` |
| CV and publication list PDFs | `public/cv/` |
| Colours, fonts, spacing | `src/styles/global.css` (tokens at the top) |
| Page templates | `src/pages/` and `src/layouts/Base.astro` |
| Design proposal from Codex that the layout follows | `docs/codex-design.md` |

## Run it locally

You need Node.js 22 or newer.

```bash
npm install        # once
npm run dev        # live preview at http://localhost:4321
npm run build      # production build into dist/
npm run preview    # serve the built dist/ folder
npm run check      # type-check pages and data
```

A typo in a YAML or Markdown file fails `npm run build` with a message naming the file and field, so run the
build before pushing.

## Add a project

1. Make a folder for its images: `src/assets/projects/my-project/`. Put the thumbnail, the video poster
   (`thumb.jpg`, 1280x720) and the figures there. PNG or JPG is fine; the build converts them to WebP and
   resizes them.
2. Copy an existing file, for example `src/content/projects/glassml.md`, to `src/content/projects/my-project.md`.
3. Edit the frontmatter (the block between the `---` lines):

   | Field | Meaning |
   |---|---|
   | `title` | Project name |
   | `slug` | URL part: the page is `/projects/<slug>/`. Use lowercase and hyphens, and match the file name |
   | `order` | Position in the list on the home page (1 is first) |
   | `tier` | `main` (full row with thumbnail on the home page), `compact` (short row: title, result, status) or `also` (one-line mention) |
   | `year`, `status` | Shown in the project details, for example `"2026"` and `Working prototype` |
   | `summary` | One sentence under the title |
   | `result` | One qualified result line for the home page. Wrap the key number in `**...**` to bold it |
   | `role`, `tools` | Your role, and a list of tools |
   | `question`, `contribution`, `findings`, `limitation` | The sections of the project page. Leave one out and that section disappears |
   | `youtube` | Empty `""` until the video is online (see below) |
   | `thumbnail`, `thumbnailAlt` | Image for the home-page row and its description for screen readers |
   | `poster` | Video poster, shown right under the summary. Leave it out if the project has no video |
   | `figures` | List of `src`, `caption`, `kind` (`method` or `result`) and optional `plate: false` for screenshots |
   | `links` | `code`, `paper`, and `other` (a list of `label` and `url`) |

   Image paths are relative to the Markdown file, so they start with `../../assets/projects/...`.
4. Write the "Method" text as normal Markdown below the closing `---`.
5. Run `npm run dev` and check the page.

## Paste a YouTube link

Open the project file, for example `src/content/projects/virtual-power-plant.md`, and fill in `youtube`:

```yaml
youtube: "https://youtu.be/AbCdEfGhIjK"
```

Any normal YouTube link works (`youtu.be/...`, `youtube.com/watch?v=...`, `/shorts/...`, or the bare
11-character ID). Until then the page shows the poster with "Video coming soon". With a link, the page shows the
poster with a play button; YouTube (privacy-enhanced `youtube-nocookie.com`) loads only after a click. The
label under the video comes from `videoLabel` (default `45-second demo`); without a link it reads
"45-second demo, coming soon".

The MP4 files are not in this repository on purpose: GitHub Pages is not meant for large video files.

Clicking a figure opens the original image file at full size.

## Add a paper

Open `src/data/publications.yaml` and copy one entry in the right list (`journal`, `conference`,
`inPreparation` or `thesis`):

```yaml
  - authors: A. Author, T. Tahir, B. Author
    title: Paper title
    venue: Journal name
    details: vol. 1, art. no. 123
    year: 2027
    doi: 10.xxxx/xxxxx
```

Write your name as `T. Tahir` and it is bolded automatically. Numbering on the page follows the order in the
file. Also update the counts and the Scholar numbers under `metrics` in `src/data/profile.yaml`.

## Replace the CV

Overwrite `public/cv/Tayyab_Tahir_CV.pdf` (and `public/cv/Tayyab_Tahir_Publications.pdf` for the publication
list), keeping the file names. The CV page shows the file size automatically. Change `updated` in
`src/data/profile.yaml`.

The public CV here is a web version: it has no phone number and says "References available on request"
instead of referee names and emails. Keep it that way when you replace it.

## Deploy

Deployment is automatic:

1. One-time setup: create the repository `Tayyab-Tahir1/Tayyab-Tahir1.github.io` on GitHub, push this folder
   to it, then in the repository go to Settings > Pages and set Source to "GitHub Actions".
2. After that, every `git push` to `main` runs `.github/workflows/deploy.yml`, which builds the site and
   publishes it to <https://tayyab-tahir1.github.io>. Progress shows in the Actions tab.

```bash
git add -A
git commit -m "docs: update publications"
git push
```

## Design notes

- Colour tokens are defined once at the top of `src/styles/global.css` for light and dark mode. The site follows
  the system theme, and the toggle in the header saves a choice in the browser.
- Figures sit on white plates in both themes, because the plots and diagrams have white backgrounds.
- Fonts are self-hosted (Newsreader for headings, Public Sans for text), so no request goes to Google Fonts.
