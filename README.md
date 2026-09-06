# 3D Immersive Environment — course site

Student-facing materials for VART3447 (3D Immersive Environment), AVA, HKBU.
Published via GitHub Pages at: `kachichan.github.io/vart3447-3d-immersive-environment/`

**This repo is public. Only student-facing material goes here.**
Session run-sheets, planning docs, lecture decks, reading PDFs and anything
with "things that can sink this session" in it live elsewhere (Moodle and
the local course folder).

## Structure

```
_config.yml     site config — you should never need to touch it again
index.md        home page: course intro + semester table (the one URL students bookmark)
rules.md        rules that last all semester
readings.md     reading list, week by week (the PDFs themselves are on Moodle)
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

- Duplicate the newest `weeks/weekNN.md`, rename, rewrite. Keep the
  front matter (`title`, `nav_label`) — the sidebar is built from it.
- Add the row's link in `index.md`'s table (change the topic text into a link).
- Create the week's Are.na channel (*3D Immersive Environment 2026 — Week NN*,
  Open) and add its link to `links.md` and to the week page's links table.
- Update `links.md` if the week has its own demo.

## Fixed things students rely on

- **PlayCanvas template:** project 1594630 (`vart3447-template`), forked by
  students from its overview page. Its published `playcanv.as/p/tbyjAWGl/`
  link is the week 1 demo.
- **Publishing in PlayCanvas is two steps:** Publish, then **Set Primary
  Build** on the new build. The `/p/` link is permanent per project, but a
  new build does not go live until it is set as primary. The handouts say
  this; keep saying it.
- **Are.na:** each student has one Closed channel for the whole course
  (*3D Immersive Environment — Their Name*); the instructor has one Open
  channel per week. Students add their published link as a block to their own
  channel and Connect it to the week channel. Connecting is submitting.

## Conventions

- Handout voice: plain language, numbered steps, a links table at the top,
  a troubleshooting table at the end. Assume no prior 3D or coding knowledge.
- Times in handouts are clock times for a 2:30 pm start, never elapsed times.
- Never paste a PlayCanvas **editor** link anywhere students see —
  the project overview page (for forking) and published `playcanv.as`
  links only.
- Coordinates: the viewer stands at 0, 0, 0. Anything students are told to
  place goes at negative z, in front of them.
- UI wordings (menu labels, button names) rot. When you correct one,
  commit with a message saying what moved — the history is the changelog.
  Last checked against the live Editor: 6 Sep 2026 (*New Entity → 3D → Box*;
  *Publish / Download* → Builds → *Publish*; *⋯ → Set Primary Build*).
