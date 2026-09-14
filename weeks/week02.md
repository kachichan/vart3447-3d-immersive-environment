---
title: "Week 2 · Light and Time"
nav_label: "Light and Time"
---

# Week 2 · Light and Time

**This week's rule:** Same room. One thing changes over time. Nothing
responds to you.
**By the end of today:** your room has a time of day, and someone else
has stood in it long enough to say what time it is.

**Today's links** (also on the projector, big):

| | |
|---|---|
| Template (only if you have no room from last week) | [playcanvas.com/project/1594630/overview/vart3447template](https://playcanvas.com/project/1594630/overview/vart3447template) |
| The three scripts, as text | [sun-cycle.mjs](../scripts/sun-cycle.mjs) · [breathe.mjs](../scripts/breathe.mjs) · [colour-drift.mjs](../scripts/colour-drift.mjs) |
| Class board | [padlet.com/chankachi/vart3447](https://padlet.com/chankachi/vart3447) — the **Week 02** column |

---

## Before you touch a computer

Answer this in one sentence, out loud when asked: **what time of day is
it, always, in the room you built last week?** Not what time it could
be — what time it *is*, in your memory of it.

That sentence is your brief for today.

---

## Part 1 · Make this week's copy

1. On **playcanvas.com**, open your week-1 project (`vart3447-w01-yourname`).
   On its overview page click **Fork**. Name the copy
   `vart3447-w02-yourname`. Click **Editor**.

   *Why a copy:* every week gets its own project and its own link, so
   the class board shows the room changing week by week. Don't edit
   last week's project again.

   *If you have no room from last week:* fork the **template** instead
   (link above), and build a smaller room while the others do Part 2.
   Ask the TA.

---

## Part 2 · Relight the room (no scripts yet)

2. In the Hierarchy, click **Light**. In the Inspector:
   - **Color** — click the swatch and choose. Warm, cold, whatever the
     memory says.
   - **Intensity** — 1 is normal daylight. Try 0.3 and 3.
   - **Cast Shadows** — turn it **on**. Set **Shadow Resolution** to
     1024 and **Shadow Distance** to a bit more than your longest wall.
3. With the Light selected, drag its **Rotation** numbers in the
   Inspector and watch the shadows move in the viewport. This is what
   time looks like.
4. Add a lamp: right-click **Root** → **New Entity** → **Light** →
   **Omni**. Move it to where a lamp, a window, or a screen was. Set its
   **Range** to about 3 and pick a colour. **Leave Cast Shadows off** on
   this one — shadows from a lamp cost six times what shadows from the
   sun cost, and the headset will notice.
5. Give the room an outside. Click the **Settings** gear (bottom left)
   → **Rendering** → **Fog**: choose **Linear**, pick a **Fog Color**,
   set **Start** to about 2 and **End** to about 12. Then click
   **Camera** in the Hierarchy and set its **Clear Color** to the same
   colour as the fog.
6. Materials do more than colour. Click any colour in the **Assets**
   folder and look at the Inspector: **Diffuse** is the colour;
   **Emissive** makes a thing glow as if it were lit from inside (a
   window, a screen, a night light); **Opacity** makes it see-through (a
   curtain). Use these if the memory needs them.
7. **At 4:00 pm, publish:** **Publish / Download** → **Publish** →
   orange **Publish**, then **⋯ → Set Primary Build** on the new build.
   Copy the new `playcanv.as/p/…` link — it's a **new link**, because
   this is a new project. On the [class board](https://padlet.com/chankachi/vart3447), click the **+** at
   the bottom of the **Week 02** column, write `Week 02 — Your Name` as
   the subject, paste the link in the body, **Publish**.

---

## Part 3 · Get the three scripts into your project

There are three behaviours, written for this course. Each one changes
one thing over time. You attach them and move sliders; you don't need
to read them (next week you will).

| Script | Put it on | What it does |
|---|---|---|
| `sunCycle` | the **Light** (the sun) | The sun rises, crosses, sets, waits out a night, and repeats. Colour and brightness follow. Can move the sky colour too. |
| `breathe` | a **lamp** (an Omni light) | The lamp gets brighter and dimmer, slowly, forever. |
| `colourDrift` | a **box** | The box's colour drifts from one colour to another and back. Tick **glow** to make it a screen or a window. |

8. Open the template's Editor in a **second browser tab**
   (link above → **Editor**). In its **Assets** panel, open the
   **Scripts** folder, click `sun-cycle.mjs`, then shift-click
   `colour-drift.mjs` so all three are selected. Press **Ctrl/Cmd + C**.
9. Switch to **your** project's Editor tab. Click in the Assets panel,
   press **Ctrl/Cmd + V**. The three scripts appear.

   *If copying doesn't work:* in your Assets panel click **+** →
   **Script**, and name it exactly `sun-cycle.mjs` (the `.mjs` matters).
   Double-click it to open, select everything, delete it, and paste the
   text from the [sun-cycle.mjs](../scripts/sun-cycle.mjs) link above.
   Save (Ctrl/Cmd + S). Repeat for the other two.

---

## Part 4 · One change over time

10. Choose **one** of the three. One. The one that is the time of day in
    your sentence.
11. Select the thing it goes on (see the table). In the Inspector:
    **Add Component** → **Script** → **Add Script** → choose the script.
    Sliders appear under it.
12. Move the sliders. For `sunCycle` you only need the first three:
    **Day Length** (seconds, sunrise to sunset), **Night Length**, and
    **Start At** (0 is sunrise, 0.5 is noon). If you want the sky to
    follow the sun, drag the **Camera** from the Hierarchy into the
    **Sky Camera** slot.
13. Rules:
    - **One change.** If you attached two scripts, remove one.
    - The change must be visible **in under two minutes** in the
      headset. Day Length between 20 and 90 today. (A four-hour day is a
      fine idea for the final version. Nobody can crit it.)
    - **Nothing responds to you.** If you're wondering whether something
      counts as interaction, it does.
14. Click **Launch** (the play icon at the top of the viewport) to watch
    the change on your screen before publishing.
15. **At 5:15 pm, publish again** and **Set Primary Build**. The link in
    your post stays the same.

---

## Part 5 · Stay for a cycle

16. Headset on. Browser. Type your **week 2** link (the one in your
    Week 02 post, not last week's).
17. This week's rule in the headset: **stand still for a whole cycle.**
    One full day, or five breaths, or A-to-B-and-back. Don't edit before
    it completes.
18. Does the change alter what the room *is*, or only what it looks
    like? Say it to your neighbour without taking the headset off.
19. Headset off. Fix one thing — usually the speed. Publish, Set Primary
    Build, reload in the headset.

---

## Part 6 · What time is it in here?

20. From the [**Week 02** column](https://padlet.com/chankachi/vart3447) on the class board, pick two
    rooms that aren't yours. Stay in each for a full cycle.
21. Leave a **comment** on the owner's post, signed with your name:
    **what time is it in this room, and what told you.**
22. Comment on your own post: **which change you chose, and which one
    you didn't.**

---

## Reading for next week

- Jorge Luis Borges, "The Garden of Forking Paths" (1941) — twelve
  pages. It's a spy story wrapped around a labyrinth that is also a
  book that is also time. Don't worry about the spy story.

The full semester's list is on the [readings page](../readings.md).

---

## Troubleshooting

| What you see | Likely cause | Try this |
|---|---|---|
| I attached the script but no sliders appear | The script isn't parsed, or the file isn't `.mjs` | Check the asset name ends in `.mjs`. Click the script asset and look for a **Parse** button in the Inspector; click it. Then re-add the script to the entity. |
| The script is attached but nothing changes when I Launch | It's on the wrong kind of thing | `sunCycle` and `breathe` need an entity with a **Light** component; `colourDrift` needs a box. Check the table in Part 3. |
| The sun makes everything orange but there are no shadows | Cast Shadows is off | Select the Light → **Cast Shadows** on. Check **Shadow Distance** is bigger than your room. |
| The sun lights the wrong wall / comes through the wrong window | Wrong direction | Change **Azimuth** on the `sunCycle` script, not the wall. |
| The room goes completely black for a while | That's night | Raise **Intensity Night**, shorten **Night Length**, or add a lamp — what lit the room at night in the memory? |
| My walls disappear into the fog | Fog End is shorter than the room | Settings → Rendering → raise **End**. |
| Every box of the same colour drifts, not just the one | You attached `colourDrift` to the material, not a box | The script goes on an entity. It copies the colour for that box only. |
| The lamp flickers like a strobe | Period is too short | **Period** below 1 second is a strobe, not a breath. Try 3–8. |
| It's slow / stuttery in the headset | Too many lights with shadows | Cast Shadows on the **sun only**. Turn it off on every Omni light. |
| Headset shows last week's room | Wrong link, or didn't Set Primary Build | Week 2 is a **new project** with a **new link**. Check you typed the one in your Week 02 post. Then Builds panel → top build says **PRIMARY**? |
| I can't post on the class board | Wrong column, or the board hasn't loaded | Reload. Click the **+** in the **Week 02** column. If it still won't post, tell the instructor — your link goes on the board for you today. |
| I edited my week-1 project by mistake | Forgot to fork | Not lost: your old build is still in **Build history**. Fork the project now, name it `w02`, and carry on there. |
| Copy-paste between projects doesn't work | The template's Editor is read-only for you, or the paste went to the wrong panel | Click inside the Assets panel before pasting. If it still fails, use the "if copying doesn't work" route in Part 3. |
| Guardian boundary keeps appearing | Moving outside the stationary boundary | Stand still. This week you're supposed to. |
| Testing on my iPhone doesn't work | iOS has no WebXR | It never will. Use the headset. |
