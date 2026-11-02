---
title: "Week 9 · The Room That Performs"
nav_label: "The Room That Performs"
---

<!--
Drafted 2 Nov 2026. Times from Kachi (2 Nov): upload to the class Drive folder by 4:30, meet at AVA121 at 5:15.
The Drive upload link is on Moodle only: the folder is "anyone with the link can edit".
TO VERIFY at the lab before class: lab-2d slots stretch their input (half-size files rely on it);
Movie File In loops a 60 s clip without being cut by the timeline.
-->

# Week 9 · The Room That Performs

**Tuesday 3 November.** Part B starts. Two places today: we make at **CVA**, then show it in the **Immersive Lab** at Kai Tak.

| | |
|---|---|
| **2:30** | CVA, our usual room: lecture, then the 2D template |
| **by 4:30** | Your files uploaded to the **class Drive folder** (link on Moodle) |
| **5:15** | **AVA121, Immersive Lab**, HKBU Kai Tak campus, 51 Kwun Tong Road, Ngau Tau Kok. Meet at the lab door |

Teams of **3–4**, fixed until week 13. The [final project](../final-project.md) starts today.

---

## The brief

**The room performs on its own, for no one in particular.**

1. **60 seconds** that loop.
2. **No input. No sound.**
3. Use **only what you shoot, draw or record today**: phone video and photos from around CVA, or screen recordings of your own Part A rooms.
4. **The floor must take part.**

If that's easy: make one thing cross a corner, from one wall to the next.

---

## Your five files

One video (or picture) per surface, named exactly like this, all **exactly 60 seconds**:

| File | Surface | Size this week |
|---|---|---|
| `floor.mp4` | Floor | 1920 × 1080 |
| `front.mp4` | Front wall | 1920 × 640 |
| `back.mp4` | Back wall | 1920 × 640 |
| `left.mp4` | Left wall (the door is in it) | 960 × 540 |
| `right.mp4` | Right wall | 960 × 540 |

Half size this week, so uploads are fast. Front and back are **3 : 1**: the [Immersive Lab guide](../immersive-lab/#canvas) explains why.

---

## Put them in the 2D template

1. Download [lab-2d.zip](../immersive-lab/templates/lab-2d.zip) and unzip it. Rename the `.toe` after your team, like `G3_title.toe`. Make a `media` folder next to it.
2. Put your five files in `media`.
3. In TouchDesigner press **Tab → TOP → Movie File In**. Pick `media/front.mp4`.
4. Drag a wire into the orange **Front** slot. Do the same for the other four.
5. Rename your folder and open the `.toe` again. Nothing red? **Zip the folder** and upload it to the class Drive folder by **4:30**, named like `G3_title.zip`.

Also bring the folder on a **USB drive** in case the Wi-Fi is slow.

More detail: [Your first scene](../immersive-lab/#first) in the guide.

---

## In the lab

- **Shoes off. No food or drink.** Keep the door shut.
- First we walk the room together. Then every team's loop plays, and we all watch it from the door, where your audience first sees it.
- **Publish:** film your loop from the door with your phone. Post it in the Padlet **Week 9** column before you leave.

---

## Read for next week

- Myron Krueger, "Responsive Environments" (excerpt, on Moodle)
- Jun'ichirō Tanizaki, *In Praise of Shadows* (excerpt, on Moodle)

Next week the tutorials start. See the [final project](../final-project.md) page.

---

## If it goes wrong

| Problem | Fix |
|---|---|
| The image is on the wrong wall | It's wired into the wrong slot. The slots are named Floor, Front, Back, Left, Right. |
| A slot still shows the demo picture | Your wire didn't connect. Drag it again, right onto the orange slot. |
| Red error flag after renaming the folder | A file was loaded from outside the folder (Downloads, Desktop). Copy it into `media` and pick it again. |
| The video stops or jumps before 60 s | Check the file is exactly 60 s. Tell your teacher if it still cuts. |
| The front wall looks stretched tall | Make front and back 3 : 1 (1920 × 640). |
| The upload is too slow | Bring the folder on USB instead. |
| TouchDesigner says the resolution is limited | That's the free licence on your laptop. Your file should still play at full size on the lab computer: tell your teacher if it doesn't. |
