# Spatial Media — course site

Student-facing materials for VART3447 (3D Immersive Environment), AVA, HKBU.
Published via GitHub Pages at: `https://<your-username>.github.io/spatialmedia/`

**This repo is public. Only student-facing material goes here.**
Session run-sheets, planning docs, and anything with "things that can sink
this session" in it live elsewhere (a separate private repo).

## Structure

```
_config.yml     site config — you should never need to touch it again
index.md        home page: course intro + semester table (the one URL students bookmark)
rules.md        rules that last all semester
readings.md     reading list, week by week
links.md        live links: template project, demo, Are.na channels
weeks/
  week01.md     week 1 handout ("A Room You Remember")
  week02.md …   added as each week is finalised, ideally the Monday before
```

## Publishing

1. Repo Settings → Pages → Source: **Deploy from a branch** → `main`, `/ (root)`.
2. Wait ~1 minute. The site appears at the URL above.
3. Every commit to `main` republishes automatically. Edit files in the
   browser (pencil icon → commit); no local tooling needed.

## Weekly routine

- Duplicate the newest `weeks/weekNN.md`, rename, rewrite.
- Add the row's link in `index.md`'s table (change the topic text into a link).
- Update `links.md` if the week has its own demo or channel link.

## Conventions

- Handout voice: plain language, numbered steps, troubleshooting table at
  the end. Assume no prior 3D or coding knowledge.
- Never paste a PlayCanvas **editor** link anywhere students see —
  published `playcanv.as` short links only.
- UI wordings (menu labels, button names) rot. When you correct one,
  commit with a message saying what moved — the history is the changelog.
