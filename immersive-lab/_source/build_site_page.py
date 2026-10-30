"""Build the course-site version of the Immersive Lab guide from the artifact source.

The artifact (standalone page) stays the single source of the markup and script.
This turns it into a Jekyll page that uses _layouts/default.html: front matter,
no own header/footer chrome, site.css for type, guide-site.css for the interactive parts.

usage: python3 build_site_page.py <artifact.html> <guide-site.css> <out.html>
"""
import re
import sys

src_path, css_path, out_path = sys.argv[1:4]
src = open(src_path, encoding='utf-8').read()
css = open(css_path, encoding='utf-8').read()

# markup: from the header to just before the footer
start = src.index('<header class="top col">')
end = src.index('<footer')
markup = src[start:end]

# header: drop the eyebrow and the h1 dot; the site h1 + first p already style the lede
markup = re.sub(r'\s*<div class="eyebrow">.*?</div>', '', markup, count=1, flags=re.S)
markup = markup.replace('<span class="dot">.</span>', '')
markup = markup.replace('<header class="top col">', '<header>', 1)
# the sweet-spot group labels used class="lab", which clashes with the page wrapper
markup = markup.replace('class="lab" id="lab-obj"', 'class="lab-label" id="lab-obj"')
markup = markup.replace('class="lab" id="lab-you"', 'class="lab-label" id="lab-you"')

# footer text becomes a closing credit line (the layout adds the site footer)
foot = re.search(r'<footer[^>]*>(.*?)</footer>', src, flags=re.S).group(1).strip()
credit = '<p class="credit">' + foot + '</p>'

# scripts: everything after the footer
scripts = src[src.index('</footer>') + len('</footer>'):].strip()

page = (
    '---\n'
    'title: Immersive Lab\n'
    '---\n'
    '{% raw %}\n'
    '<!-- Generated from the artifact source by build_site_page.py. Edit the source, then rebuild. -->\n'
    '<style>\n' + css + '\n</style>\n'
    '<div class="lab">\n' + markup.strip() + '\n' + credit + '\n</div>\n'
    + scripts + '\n'
    '{% endraw %}\n'
)
open(out_path, 'w', encoding='utf-8').write(page)
print(len(page.encode()), 'bytes;',
      'class="lab" spans left:', page.count('class="lab"') - 1,
      '| liquid markers inside raw:', len(re.findall(r'\{\{|\{%', page)) - 2)
