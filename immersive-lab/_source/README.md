# Immersive Lab guide — source

Jekyll does not publish this folder (its name starts with an underscore).

- `guide.html` — the guide as a standalone page (also published as a private artifact). Edit this.
- `guide-site.css` — styles for the interactive parts when the guide sits inside the course-site layout.
- `build_site_page.py` — turns `guide.html` into `../index.html` (front matter, site layout, site.css for type).

Rebuild after editing, from this folder:

    python3 build_site_page.py guide.html guide-site.css ../index.html
