---
title: "Week 6 · Mid-term: What Is It Like to Be a ___?"
nav_label: "Mid-term"
---

<!--
Drafted 6 Oct 2026. Brief text adapted from the Moodle brief (Moodle is the record for submission).
buzz.mjs: tested against a mocked XR input in Node (pulse rhythm, onlyOnEnter, useHead, no-gamepad);
NOT yet run on a Quest 2. Quest Browser implements GamepadHapticActuator.pulse() (Meta's Rik Cabanier,
W3C gamepad thread, Oct 2022).
TO VERIFY on a lab Quest 2 before Thursday: buzz on both controllers; the record-video menu wording;
that system recording captures an immersive WebXR session with sound; uploading from the headset
to Google Drive in Quest Browser; casting the lab headsets to the projector computer (each headset
has its own Meta account; campus Wi-Fi may block casting).
-->

# Week 6 · Mid-term
## What Is It Like to Be a ___?

Thomas Nagel: you can know everything about how a bat's sonar works and still not know what it's like to *be* a bat.

**Your mid-term:** a short VR experience from inside something that isn't you. An animal (a deep-sea octopus), an object (a vinyl record being played), a system (a neuron firing), an idea (a forgotten memory). Turn the way it senses into something someone else can stand inside.

| | |
|---|---|
| **Before class** | Link + slides PDF on the Padlet, **Week 6 (Mid-term)** column, by **Tue 13 Oct, 12:00 noon** |
| **Presentation** | **Tuesday 13 October**, in class: showcase, then **5 minutes per group** |
| **Video** | **Sunday 18 October, 23:59**, on **Moodle** |
| Brief, and where to submit | **Moodle** (same brief as this page) |
| New script | [buzz.mjs](../scripts/buzz.mjs): the controller vibrates |
| Models, textures, sounds | [Where to find things](../sources.md) |
| Class board | [padlet.com/chankachi/vart3447](https://padlet.com/chankachi/vart3447): **Week 6 (Mid-term)** column |

---

## Think about

- **Body.** How does it feel to *be* this thing? Use scale, movement and the senses.
  A fly is small. A building is slow.
- **Senses beyond sight.** Sound in space (week 5). Vibration in the hand (**buzz**, below).
  What does it *not* sense?
- **Interaction.** What can the visitor do? It should come from what this thing *is*, not from a menu.
- **The real room.** Not required to build, but say it in your presentation:
  what physical object, space or interface would make it stronger?
- **Intent.** What should someone leave with? Empathy, disorientation, calm, critique?

Everything from weeks 1–5 is allowed: boxes, scans, recordings, all the scripts.

---

## Grading

| Weight | What |
|---|---|
| **30%** | **Concept and creativity**: how original and deep your answer to "what is it like to be…?" is |
| **30%** | **Immersion and the senses**: presence, a different body, more than sight |
| **20%** | **Technical**: it works, it's stable, it's finished |
| **20%** | **Presentation and video**: how clearly you communicate it |

The mid-term is the **30% Creative Studio Experiments** part of the course grade.

---

## Buzz · the controller vibrates

Attach it to a thing. Bring a controller close, and the controller shakes.

1. Click the thing. **Add Component** → **Script** → **+ Add Script** → **buzz**.
   *(Not in the list? Copy `buzz.mjs` from the template's **Scripts** folder. Or open [buzz.mjs](../scripts/buzz.mjs), copy it all, and paste it into a new script called `buzz.mjs`.)*
2. **Publish, and Set Primary Build.** Test it **in the headset, with controllers**. It does nothing in the Launch window.

| Setting | What it does |
|---|---|
| **radius** | how close, in metres |
| **useHead** | ticked: your **head** coming close counts, and **both** controllers buzz |
| **strength** | `0` nothing, `1` full |
| **pulseMs** | how long each pulse lasts |
| **gapMs** | silence between pulses. `0` = one long hum |
| **closerIsStronger** | ticked: faint at the edge, strong at the centre |
| **onlyOnEnter** | ticked: one bump when you arrive, then nothing |

Some rhythms to start from:

| Feels like | pulseMs | gapMs | Other |
|---|---|---|---|
| A heartbeat | `60` | `900` | |
| Clicking, feeling the way in the dark | `20` | `120` | strength `0.3` |
| A hum that grows | `100` | `0` | **closerIsStronger** |
| Bumping into something | `80` | | **onlyOnEnter**, strength `1` |

**Hands, not controllers?** Tracked hands can't vibrate. Buzz needs controllers.

---

## Presentation day

### Before class: post to the Padlet

In the **Week 6 (Mid-term)** column, by **Tuesday 13 October, 12:00 noon**. Subject: `Week 06 — Your Names`.

1. Your published **`playcanv.as/p/…` link**. Publish, **Set Primary Build**, then test it in a headset.
2. Your slides as a **PDF**. **5 slides at most.**

That post is what runs on the day: your piece on the stage headset, your PDF on the class computer.
**The running order goes up on Monday 12 October. Check your slot. Missing it is missing the assessment.**

### In class

1. **Showcase.** Put your piece on your headset at your station. One of you stays with it. Visit as many others as you can. Your teacher visits every piece.
2. **Presentations**, in the running order. When the group before you starts, wait at the side.

### Your 5 minutes

- **5 minutes, timed. You will be stopped at 5:00.**
- One of you demos on the **stage headset** (cast to the projector) while another talks:
  1. The idea, in a sentence or two.
  2. **The live demo.**
  3. How you made it: one creative decision, one technical one.
- Then **one challenging question** from your teacher. Come ready to defend your choices. It might be *"explain this line of your code."*
- **Don't read** from a phone, screen or paper. Notes are reminders only.
- **No feedback during your slot.** Written feedback comes after.
- **No logins on the day.** Nobody signs into Google, PlayCanvas or anything else on the stage headset or the class computer.
- Bring a **30-second backup clip** on a **USB drive or your own laptop**, not in the cloud. If the demo fails, it plays instead.
- Your credits list (see [Sources](../sources.md#credits-required)) goes on your **last slide**.

---

## The video · 3 minutes maximum

**First-person.** It has to show what the visitor sees and does. A walkthrough ("gameplay") or a trailer: your choice.

**Two ways to film. Use both.**

| | How | Good for |
|---|---|---|
| **In the headset** | **Meta** button (right controller) → **Camera** → **Record video**. Same again to stop. | The real thing: head movement, hands, interaction |
| **On your computer** | Screen-record the **Launch** window. Walk with the arrow keys. | Clean, sharp, wide shots |

**Getting it out of the headset:**

1. In the headset, open **Quest Browser** → **drive.google.com** → sign in.
2. **New** → **File upload** → your video.
3. **Sign out of Google before you take the headset off.** It's a shared headset.

Or ask the TA for the cable.

**Submitting:**

- On **Moodle**, by **Sunday 18 Oct, 23:59**.
- An MP4/MOV called `StudentNumber_StudentName_Title.mp4`, or a YouTube/Vimeo link (unlisted is fine).
- End the video with your credits.

---

## If it goes wrong

| Problem | Fix |
|---|---|
| buzz does nothing | Controllers, not hands? In the headset, not the Launch window? **strength** above 0? Published and Set Primary? |
| buzz never stops | You're inside **radius**: make it smaller. **gapMs** `0` means one long hum. |
| buzz is on, but I don't notice it | **strength** up, **pulseMs** longer (`100`+). |
| The recording is square | That's the Quest default. Crop it in your editor, or use Launch-window footage for wide shots. |
| The recording is silent | Turn the headset volume up before you record. Your room's sounds are part of the piece. |
| Upload in the headset is slow | Record short clips, not one long one. |
| The video file is too big for Moodle | Upload to YouTube as **unlisted** and submit the link. |
| My slides aren't on the class computer | They come from your Padlet post. Posted after noon, or not a PDF? Tell the TA before the presentations start. |
| The live demo won't load | It opens from your Padlet post: is that the `/p/` link, and did you **Set Primary Build**? Otherwise play your 30-second clip. |
| It ran smoothly last week and stutters now | Too much stuff. See the size limits on [Sources](../sources.md#keep-it-small). |
| I pasted Gemini's code and now nothing works | Look for `pc.createScript`: that's the other language. Use the [preamble](../gemini.md). |
