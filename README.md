# Sylvain Bonniol

Personal portfolio site: a static project list with individual project pages, editable through a web-based admin UI.

**Production URL:** [https://sylvainbonniol.netlify.app](https://sylvainbonniol.netlify.app)

---

## Architecture

The site is a **static site** built at deploy time. There is no application server at runtime—only HTML, CSS, and assets served from Netlify.

```
┌─────────────────┐     build (Eleventy)      ┌──────────────┐
│  src/           │ ────────────────────────► │  _site/      │
│  (source)       │                           │  (output)    │
└─────────────────┘                           └──────────────┘
        ▲                                              │
        │ git commit (text)                     Netlify CDN
        │                                              │
┌───────┴─────────┐                                    ▼
│  Decap CMS      │                          https://sylvainbonniol.netlify.app
│  /admin/        │
└────────┬────────┘
         │ image uploads
         ▼
┌─────────────────┐
│  Cloudinary     │  res.cloudinary.com/... URLs in Markdown
│  (bonniols/)    │
└─────────────────┘
```

### Build pipeline

1. **Eleventy** reads templates and Markdown from `src/` and generates static HTML into `_site/`.
2. **Tailwind CSS** is compiled from `src/assets/css/main.css` via PostCSS before each build (and on each dev-server rebuild).
3. **cssnano** minifies the compiled CSS.
4. **Netlify** runs `npm run build` and publishes the `_site/` folder.

### Key config files

| File | Brick | What it does |
|------|-------|--------------|
| `eleventy.config.js` | **Build** | Eleventy entry point: `src` → `_site`, Liquid templates, `projectsSorted` collection (order → title), Tailwind compile + minify before each build, passthrough for `admin/config.yml` and `assets/img`. |
| `src/admin/config.yml` | **Admin** | Decap CMS: Git Gateway on branch `v1`, French UI, Cloudinary media picker, **Projects** collection schema (fields → `src/projects/*.md`). Copied to `/admin/config.yml` at build. |

### Content model

| Type                    | Location                                                   | Notes                                                                               |
| ----------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Home page               | `src/index.liquid`                                         | Lists all projects, sorted by `order` then title                                    |
| Project pages           | `src/projects/*.md`                                        | Markdown with front matter; URL `/projects/<slug>/`                                 |
| Shared project defaults | `src/projects/projects.json`                               | Layout, tags, permalink pattern                                                     |
| Layouts                 | `src/_includes/layouts/`                                   | Liquid templates (`base.liquid`, `project.liquid`)                                  |
| Styles                  | `src/assets/css/main.css`                                  | Tailwind entry point                                                                |
| Images                  | [Cloudinary](https://cloudinary.com/) (`bonniols/` folder) | Uploaded via Decap CMS; stored as `https://res.cloudinary.com/...` URLs in Markdown |
| Admin UI                | `src/admin/`                                               | Decap CMS frontend + `config.yml`                                                   |

Projects are tagged `projects` and collected into `collections.projectsSorted`, which sorts by the numeric `order` field (lower first), then alphabetically by title.

---

## Libraries & tools

| Package                                                                                      | Role                                                                    |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [@11ty/eleventy](https://www.11ty.dev/)                                                      | Static site generator                                                   |
| [Liquid](https://shopify.github.io/liquid/)                                                  | Template engine (via Eleventy)                                          |
| [Tailwind CSS](https://tailwindcss.com/) v4                                                  | Utility-first CSS                                                       |
| [@tailwindcss/postcss](https://tailwindcss.com/docs/installation/using-postcss)              | Tailwind PostCSS plugin                                                 |
| [PostCSS](https://postcss.org/)                                                              | CSS processing pipeline                                                 |
| [cssnano](https://cssnano.co/)                                                               | CSS minification                                                        |
| [Decap CMS](https://decapcms.org/) (v3)                                                      | Git-based content admin at `/admin/`                                    |
| [Netlify Identity](https://docs.netlify.com/security/secure-access-to-sites/identity/)       | Authentication for the admin in production                              |
| [Netlify Git Gateway](https://docs.netlify.com/security/secure-access-to-sites/git-gateway/) | Lets Decap commit content to the repo without direct GitHub credentials |
| [Cloudinary](https://cloudinary.com/)                                                        | Media library for Decap CMS image uploads and picker                    |

Decap CMS and Netlify Identity are loaded from CDN in `src/admin/index.html`; they are not npm dependencies. Cloudinary is configured as Decap’s `media_library` in `src/admin/config.yml`.

---

## Project structure

```
bonniols/
├── eleventy.config.js      # Build: Eleventy + Tailwind + collections
├── netlify.toml            # Netlify build settings
├── package.json
├── src/
│   ├── index.liquid        # Home page
│   ├── _includes/layouts/  # Liquid layouts
│   ├── assets/css/         # Tailwind source CSS
│   ├── assets/img/         # Legacy/local passthrough (images use Cloudinary)
│   ├── admin/
│   │   ├── index.html      # Decap CMS shell + preview templates
│   │   └── config.yml      # Admin: Decap backend, fields, Cloudinary
│   └── projects/           # Project Markdown files
└── _site/                  # Build output (gitignored)
```

---

## Local development

### Prerequisites

- Node.js (LTS recommended)
- npm

### Setup

```bash
git clone git@github.com:OIIOIIOI/bonniols.git
cd bonniols
git checkout v1
npm install
```

### Run the dev server

```bash
npm run serve
```

Eleventy serves the site with live reload. By default:

- **Site:** [http://localhost:8080](http://localhost:8080)
- **Admin:** [http://localhost:8080/admin/](http://localhost:8080/admin/)

### Build for production locally

```bash
npm run build
```

Output is written to `_site/`.

---

## Deployment

The site is deployed on **Netlify**, connected to the GitHub repository `OIIOIIOI/bonniols`.

| Setting           | Value                                                                    |
| ----------------- | ------------------------------------------------------------------------ |
| Build command     | `npm run build`                                                          |
| Publish directory | `_site`                                                                  |
| Deploy branch     | `v1` (used by Decap CMS Git Gateway)                                     |
| Production URL    | [https://sylvainbonniol.netlify.app](https://sylvainbonniol.netlify.app) |

Configuration lives in `netlify.toml`:

```toml
[build]
  publish = "_site"
  command = "npm run build"
```

Pushing to the connected branch triggers a Netlify build. Content edited through the admin UI is committed to `v1` via Git Gateway, which also triggers a rebuild.

---

## Admin: editing content

Content is managed with **Decap CMS** at `/admin/`.

| Environment | Admin URL                                                                              |
| ----------- | -------------------------------------------------------------------------------------- |
| Production  | [https://sylvainbonniol.netlify.app/admin/](https://sylvainbonniol.netlify.app/admin/) |
| Local       | [http://localhost:8080/admin/](http://localhost:8080/admin/)                           |

Decap is driven by `src/admin/config.yml`: **git-gateway** + branch `v1` in production; `local_backend: true` for local edits; `site_url` for preview/live links; Cloudinary for uploads; **Projets** collection maps to `src/projects/`.

### Production admin (Netlify)

1. Open [https://sylvainbonniol.netlify.app/admin/](https://sylvainbonniol.netlify.app/admin/).
2. Click **Login with Netlify Identity** and sign in with an invited account.
3. Use the **Projects** collection to create, edit, reorder, or delete project entries.

**Netlify prerequisites** (one-time setup in the Netlify dashboard):

- **Identity** enabled for the site
- **Git Gateway** enabled under Identity → Services
- At least one user **invited** under Identity → Invite users

Changes are saved as Git commits on branch `v1`. Netlify rebuilds the site automatically after each save.

### Local admin (no Netlify login)

`local_backend: true` in `config.yml` allows editing against the local filesystem without Netlify Identity.

1. Start the Decap local proxy (separate terminal):

   ```bash
   npx decap-server
   ```

   Default proxy URL: `http://localhost:8081/api/v1`.

2. Start the Eleventy dev server:

   ```bash
   npm run serve
   ```

3. Open [http://localhost:8080/admin/](http://localhost:8080/admin/) and edit content.

Local saves write directly to Markdown files under `src/projects/`. Commit and push when ready.

**Note:** `local_backend: true` only affects Git-backed content. Image uploads still go through **Cloudinary** in both local and production admin.

### Images (Cloudinary)

Decap CMS uses Cloudinary as its media library. When inserting an image in the Markdown body, the editor opens the Cloudinary picker—a Cloudinary login is expected and required by the integration.

Configuration in `src/admin/config.yml`:

```yaml
media_library:
  name: cloudinary
  config:
    cloud_name: <cloud-name>
    api_key: <api-key>
    multiple: true
```

`cloud_name` and `api_key` are public (served via `/admin/config.yml`). Do **not** commit the Cloudinary **API secret**; uploads use an **unsigned** preset so no secret is needed in the frontend.

Upload destination is configured in the **Cloudinary console**, not in `config.yml`:

1. Create an unsigned upload preset (e.g. `bonniols-cms`) with asset folder `bonniols`.
2. Set it as the default **Media Library** upload preset.
3. New uploads from Decap land in the `bonniols/` folder. The picker opens at the account root—navigate to `bonniols/` to browse project assets.

Inserted images are saved in Markdown as absolute Cloudinary URLs, for example:

```markdown
![](https://res.cloudinary.com/<cloud-name>/image/upload/.../bonniols/...)
```

Images are served directly from Cloudinary at runtime; they are not copied into `_site/` during the Eleventy build.

For full setup steps (Netlify, Decap, Cloudinary wiring), see [`docs/handoff-wiring.md`](docs/handoff-wiring.md).

### What you can edit

The **Projects** collection exposes:

| Field | Purpose                                        |
| ----- | ---------------------------------------------- |
| Title | Display name and page heading                  |
| Order | Sort position on the home page (lower = first) |
| Body  | Markdown content for the project page          |

New projects create a Markdown file in `src/projects/`. The URL slug is derived from the title. Images uploaded in the editor are hosted on Cloudinary and referenced by URL in the Markdown body.

The admin preview uses the same CSS as the live site and mirrors the `project.liquid` layout.

---

## Repository

- **GitHub:** [github.com/OIIOIIOI/bonniols](https://github.com/OIIOIIOI/bonniols)
- **Active branch:** `v1` (content + deployment)
