---
title: "How to ask Gemini"
nav_label: "Gemini"
---

<!-- MIRROR of gemini.md in the course-site repo (site root, beside rules.md). Edit there. Drafted 20 Sep 2026. -->
<!--
SHOT-LIST (not yet captured — add to assets/img/gemini/ and re-insert as images): 01-gemini-paste.png — Gemini with the block below pasted, cursor on the "My request" line.
           02-gemini-copy.png  — a reply with the Copy button on the code block boxed.
           03-console-red.png  — Launch window + DevTools console, one red line boxed.
-->

# How to ask Gemini

Three rules. They are the whole page.

1. **Start from a script that works.** One of the course scripts. Never a blank chat.
2. **One change per ask.**
3. **You keep only lines you can explain.** Anyone may ask you what any line does — in class, in the crit, in your grade.

---

## 1 · Paste this first, every new chat

Copy the whole block. Replace the last line with what you want.

```
I am making a WebXR scene in PlayCanvas and I write scripts in PlayCanvas's ESM script format.
Here is a script in that format that works. Keep exactly this format in everything you write for me:

[PASTE THE WHOLE SCRIPT HERE — open it in PlayCanvas, Ctrl/Cmd + A, Ctrl/Cmd + C]

Rules:
1. Always `import { Script } from 'playcanvas'` (plus any other names you need, from 'playcanvas' only).
   Always `export class Name extends Script` with `static scriptName = 'name'`.
   Attributes are class fields with a `/** @attribute @type {...} */` comment. The file name ends in .mjs.
2. NEVER use pc.createScript, .attributes.add, prototype.initialize, or `var Name = ...`.
   That is the old format and it will break my project.
3. Change ONLY what I ask for. Keep the class name and the scriptName the same unless I ask.
4. Reply with the WHOLE file, then a list of every line you changed with one plain sentence each
   saying what it does. I am not a programmer; I need to explain each changed line to my teacher.

My request: ___________
```


---

## 2 · Read the reply before you run it

Look for these. All five, or ask again.

| ✓ | |
|---|---|
| `import { Script` … `} from 'playcanvas'` | at the top |
| `export class` … `extends Script` | |
| `static scriptName = '…'` | same name as before |
| `/** @attribute` comments above the sliders | |
| **no** `pc.createScript` anywhere | if you see it: *"You used pc.createScript. Rewrite in the ESM format I showed you."* |


---

## 3 · Put it in

Open the script in PlayCanvas → **Ctrl/Cmd + A** → paste → **Ctrl/Cmd + S** → **Launch** ▶.

---

## 4 · If it breaks

**Launch** ▶ → **F12** (Mac: **Cmd-Option-J**) → **Console** → find the first **red** line → copy it.


Paste into the same chat:

```
When I run it, this appears in the console:
[PASTE THE RED LINE]
Explain in one sentence what it means, then give me the whole corrected file.
```

Three rounds. Then ask a human.

---

## Things Gemini is good at asking for

- *"…the target changes colour instead of switching on."*
- *"…only triggers when I approach from behind the box."*
- *"…counts how many times I've looked, and triggers on the third."*
- *"…also works with the grip button, not just the trigger."*
- *"…explain what line 47 does, in one sentence."* ← use this one a lot
