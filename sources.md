---
title: "Where to find things"
nav_label: "Sources"
---

<!--
Drafted 6 Oct 2026. Licences checked on each site's own licence page, 6 Oct 2026:
Poly Haven CC0 · ambientCG CC0 · Kenney CC0 · Quaternius Asset License v1.0 (free, no credit, no reselling the files)
· Smithsonian Open Access CC0 · NASA media guidelines (not copyrighted, credit NASA, no logo, no endorsement)
· Pixabay Content License (no credit needed) · Freesound: CC0 / CC BY / CC BY-NC (+ old Sampling+), account needed to download
· NPS Sound Gallery "public domain ... please give the appropriate credit".
NOT CHECKED: Poly Pizza's per-model licence labels (site FAQ 404'd); NOAA page has no licence statement
(US federal work, so public domain by default); xeno-canto terms page refused access (licences shown per recording).
Left out on purpose: BBC Sound Effects (RemArc licence is personal/educational/research; couldn't confirm
a public PlayCanvas publish fits it; their site was unreachable to check).
TO VERIFY in the Editor: dragging a .glb into Assets gives a template you drag into the Hierarchy;
Diffuse/Normal map slot names on the Material inspector.
The 200 MB is per account (all projects, forks included): verify against the current PlayCanvas plans page.
-->

# Where to find things

Models, textures, skies and sounds you didn't make yourself.

**Three rules first.**

1. **Your own comes first.** A scan, a recording, a box. The best source in this course is still your phone.
2. **Found things are material, not the subject.** A downloaded octopus is a *picture* of an octopus. Your project is what it's like to *be* one.
3. **Check the licence before you download, and credit everything you didn't make.** Your projects are public.

---

## Licences in one table

| It says | Can you use it? | What you must do |
|---|---|---|
| **CC0** / **public domain** | Yes | Nothing. Credit it anyway. |
| **CC BY** | Yes | Credit it. |
| **CC BY-NC** | Yes, for class work | Credit it. It can't go into anything you sell or are paid for later. |
| **CC BY-SA** | Yes | Credit it. Anything you make from it carries the same licence. |
| **ND** (No Derivatives) | **No** | Trimming or changing it breaks the licence. Skip it. |
| No licence shown, or "free download" with nothing else | **No** | Find another one. |

### Credits: required

Every found thing goes in a credits list. Put it in three places: your **Padlet post**, the **end of your video**, and the **last slide** of your presentation.

One line each:

```
"Title" by Author, from Site, Licence
"Rain on a tin roof" by someone123, from Freesound, CC BY 4.0
```

---

## Keep it small

The Quest 2 is a phone strapped to your face. And **200 MB is your whole PlayCanvas account**: every project, every fork.

| What | Aim for | Why |
|---|---|---|
| A model | **GLB**, under **5 MB**, under **50,000 triangles** | Big scans make the headset stutter |
| A texture | **1K** (1024 px), **JPG** | A 4K texture takes 16 times the memory of a 1K one |
| A sky (HDRI) | **1K** | See the note below the tables |
| A sound | **MP3** or **M4A**. WAV only for short sounds | A minute of WAV is about 10 MB |
| Your whole project | under **30 MB** | So next week's fork still fits |

Most sites show the triangle count or file size before you download. Look first.

---

## 3D models

| Site | What's there | Licence |
|---|---|---|
| [Poly Pizza](https://poly.pizza) | Thousands of small, low-poly objects and animals. Light; good for the Quest | CC0 or CC BY. It's shown on each model |
| [Kenney](https://kenney.nl/assets) | Low-poly kits: furniture, nature, city, space | CC0 |
| [Quaternius](https://quaternius.com) | Low-poly packs, including animals and fish | Free, no credit needed. Don't re-share the files themselves |
| [Poly Haven: models](https://polyhaven.com/models) | Realistic props: rocks, furniture, plants | CC0. Download **1K** |
| [Smithsonian 3D](https://3d.si.edu) | Scanned museum objects: fossils, skulls, specimens, artefacts | CC0 where marked. Often heavy: check the size |
| [NASA 3D Resources](https://science.nasa.gov/3d-resources/) | Spacecraft, planets, asteroids | Free. Credit NASA. Don't use the NASA logo |
| [Sketchfab](https://sketchfab.com/3d-models?features=downloadable) | Everything | **Different for every model.** Read it. Scans here are often 500,000+ triangles: too big |

## Textures and materials

| Site | What's there | Licence |
|---|---|---|
| [ambientCG](https://ambientcg.com) | Surfaces: concrete, rust, skin, bark, tiles | CC0. Download **1K-JPG** |
| [Poly Haven: textures](https://polyhaven.com/textures) | The same idea, fewer and finer | CC0. Download **1K** |

## Skies (HDRI)

| Site | What's there | Licence |
|---|---|---|
| [Poly Haven: HDRIs](https://polyhaven.com/hdris) | 360° skies and interiors | CC0. Download **1K** |

An HDRI has to be converted before PlayCanvas can use it as a sky. **Not worth it before the mid-term.** Ask in class if your piece depends on it. A plain sky colour and fog often do more.

## Sounds

| Site | What's there | Licence |
|---|---|---|
| [Freesound](https://freesound.org) | Everything: field recordings, textures, machines, rooms | CC0, CC BY or CC BY-NC. It's shown on each sound. Free account needed |
| [Pixabay: sound effects](https://pixabay.com/sound-effects/) | Effects and ambiences | Free, no credit needed. Credit it anyway |
| [NPS Sound Gallery](https://www.nps.gov/subjects/sound/gallery.htm) | Animals, weather, geysers, recorded in US national parks | Public domain. Credit "US National Park Service" |
| [NOAA: Sounds in the Sea](https://oceanexplorer.noaa.gov/gallery/sound/sound.html) | Whales, earthquakes, ice, ships, heard underwater | US government. Credit NOAA |
| [xeno-canto](https://xeno-canto.org) | Birds, frogs, insects, **bats** | Shown on each recording. Mostly CC BY-NC-SA. **Skip anything marked ND** |

Bat calls are too high for people to hear. Recordings you *can* hear have been slowed down or pitched down. That is already a translation, which is your project's problem too.

---

## Getting it into PlayCanvas

| What | How |
|---|---|
| **A model (.glb)** | 1. Make an empty entity called **Holder**. 2. Drag the .glb into **Assets**, **once**. 3. Drag the model from **Assets** onto **Holder** in the **Hierarchy**. 4. Add **fitScan** to Holder, and set **height** to its real size in metres. Downloaded models arrive at any size; fitScan fixes that, as in [week 4](weeks/week04.md). |
| **A model in another format** | Look for **GLB** or **glTF** on the same page first. FBX imports, but more slowly and less reliably. |
| **A texture** | Drag the 1K JPG into **Assets**. Select your **material** → **Diffuse** → drop the **Color** file in the map slot. For bumps, put the **NormalGL** file in **Normal** (not NormalDX). |
| **A sound** | As in [week 5](weeks/week05.md): a **Sound** inside the thing, **Positional** ticked, **Max Distance** set. |
| **An animated model** | It arrives standing still. Making it move needs extra setup. **Ask before you build your piece around it.** |

**Part B:** the same sites work for TouchDesigner. Textures and HDRIs go into a **Movie File In** TOP, sounds into an **Audio File In** CHOP. The licences don't change.

---

## If it goes wrong

| Problem | Fix |
|---|---|
| The model is the size of a building, or a grain of rice | It's on **Holder** with **fitScan**? Set **height**. |
| The model is there but invisible | Click it in the Hierarchy and press **F**. If it's still not there, look at the console for an import error. |
| There are two of everything | You dragged the file in twice. Delete one from the Hierarchy, and the extra from **Assets**. |
| "Storage limit" / upload refused | Delete unused assets, and old forks you don't need. Look for 4K textures and WAVs first. |
| The headset stutters when you look at the model | Too many triangles. Find a lighter one, or ask if it can be reduced. |
| The texture looks blurry up close | Fine. 1K is the price of the headset. |
| The sound is everywhere | **Max Distance** is still at the default. Set it to `4`. |
| You can't find a licence | Then you can't use it. |
