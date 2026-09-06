---
title: "Week 1 · A Room You Remember"
nav_label: "A Room You Remember"
---

# Week 1 · A Room You Remember

**This week's rule:** Boxes only. Real size. Nothing moves.
**By the end of today:** your room is on the web, at full size, and
someone else has stood inside it.

Links for today — template, demo, Week 01 channel — are on the
[links page](../links.md) and on the projector.

---

## Before you touch a computer

1. Think of a room you knew well as a child that you can't go back to.
2. On paper, draw it from above (a plan).
3. Put in the things you're sure about. Leave out what you're not sure about.
4. Mark with an **X** one thing in that room you remember touching. Write
   your guess of its height off the floor, in metres. (A table is about
   0.75 m. A door handle is about 1 m.)
5. Write your guess of the length of the longest wall, in metres.

Keep this drawing. You will build it.

---

## Part 1 · Try the headset

6. Pick up your Quest 2. Put it on and adjust the strap until the picture
   is sharp.
7. If it asks you to draw a boundary, choose **Stationary** (the one
   where you stand still).
8. Open the **Browser** app (the globe icon).
9. Type the demo link from the projector, exactly as written.
10. When the page loads, tap the scene once. Say **Allow** if it asks.
11. You are in a grey room with a tall box and a small box. Do three
    things — **without walking**:
    - Crouch. Is the small box at chair height?
    - Reach out. Where is the tall box's shoulder?
    - Look down at your feet.
12. Take the headset off. Leave it on your desk.

If anything went wrong, look at the [table at the end of this
page](#troubleshooting), then put your hand up.

---

## Part 2 · Make one wall and publish it

13. On your computer, go to **playcanvas.com** and sign in.
14. Open the template link from the projector. Click **Fork** (this makes
    your own copy).
15. Name your copy `vart3447-w01-yourname`. Open it in the **Editor**.
16. You'll see four areas. You only need these today:

    | Area | Where | What it is |
    |---|---|---|
    | **Hierarchy** | Left | A list of everything in the scene |
    | **Viewport** | Middle | The scene itself, in 3D |
    | **Inspector** | Right | The numbers for whatever you have selected |
    | **Assets** | Bottom | The folder of colours (materials) you can use |

17. In the Hierarchy, click the thing called **1.7m person — delete me**.
    Look at its **Scale** in the Inspector: 0.4, 1.7, 0.4.
    **One unit is one metre.** Everything today is in metres.
18. Press **Delete** to remove the person.
19. Right-click in the Hierarchy → **Add Entity** → **Box**. A 1 m cube
    appears.
20. In the Inspector, set its **Scale** to: *your wall length*, **2.5**,
    **0.1**. (For example: 4, 2.5, 0.1.)
21. Set its **Position** to **0, 1.25, 0**. (Half its height, so it
    stands on the floor instead of sinking into it.)
22. Drag a colour from the **Assets** area onto the box.
23. Click **Publish** (top of the Editor) → **Publish to PlayCanvas** →
    **Publish**. Wait until it finishes.
24. Copy the link it gives you. It looks like `playcanv.as/p/xxxxxx/`.
25. Open your Are.na channel (*3D Immersive Environment — Your Name* — you made this
    before class). Paste your `playcanv.as` link into the box at the top
    of the channel and press Enter. It becomes a **block** — one card in
    your channel. Then hover over the block, click **Connect →**, and
    choose the class channel **Week 01**. Your link is now in your
    channel *and* on the class channel on the projector.

You have published. This is the first of thirteen.

---

## Part 3 · Build the room

26. Look at your drawing. Build it out of boxes, following these rules:
    - **Walls and floor first.** Then the things you were sure about.
    - **Real size.** Use the guesses on your drawing. Don't measure
      anything.
    - **The thing you touched must be there**, at the height you wrote
      down.
    - **Nothing moves, nothing responds, no text.**
27. To make a new box: right-click Hierarchy → Add Entity → Box. To copy
    one you've already made: select it, **Ctrl/Cmd + D**.
28. To rename a box, double-click its name in the Hierarchy. Name things
    ("bed", "window", "the shelf"). It helps later.
29. If you get lost in the viewport: select something in the Hierarchy
    and press **F** to fly to it. **Ctrl/Cmd + Z** undoes.
30. **At 2:30, publish again** (step 23) whether you're finished or not,
    and make sure the newest link is the block in your channel.

A tip for making things stand on the floor: a box's Position is its
*centre*. A box that is 0.8 m tall needs Position y = 0.4 to sit on the
floor.

---

## Part 4 · Stand in it

31. Headset on. Browser. Type **your own** link (the block in your
    channel).
32. Same three things: crouch, reach, look down. Then a fourth: **find
    the thing you touched and put your hand where it is.**
33. What's wrong? Say it out loud to the person next to you. Don't take
    the headset off yet.
34. Headset off. Fix the two worst things. Publish again. Reload the page
    in the headset (pull down or tap the refresh arrow).

This loop — edit, publish, reload — is how you'll work for the next five
weeks.

---

## Part 5 · Stand in someone else's

35. From the **Week 01** channel, pick two rooms that aren't yours. Stand
    in each.
36. Back at your computer, leave a **comment** on the owner's block:
    **the thing I'd have got wrong if you'd only described this room to
    me.**
37. Comment on your own block: **what was wrong about the scale when you
    stood in it.**

---

## Reading for next week (both short)

- Gaston Bachelard, *The Poetics of Space*, Chapter 1, "The House. From
  Cellar to Garret" — the first ten pages.
- Ivan Sutherland, "The Ultimate Display" (1965) — two pages. Read the
  last paragraph twice.

The full semester's list is on the [readings page](../readings.md).
The [rules that last all semester](../rules.md) started today.

---

## Troubleshooting

| What you see | Likely cause | Try this |
|---|---|---|
| Browser on the Quest won't load any page / shows a login screen | WiFi captive portal, or not connected | Settings → WiFi → check the lab network. If a login page appears, tell the instructor — this needs IT. |
| Page loads but tapping does nothing / no VR | Not a WebXR browser, or tap didn't register | Make sure you're in the Quest **Browser** app, not another app. Tap directly on the scene. Reload and try once more. |
| "WebXR not supported" | You're on a phone or laptop, not the headset | Expected. Only the headset shows the VR view. Laptop shows the flat preview, which is fine for building. |
| The floor is at the wrong height / I'm floating or buried | Guardian floor level not set | Take the headset off and on. If it asks to set the boundary, re-set the floor by touching the real floor with the controller. |
| Everything is huge / I'm tiny | Your boxes are the wrong size, not you | Check Scale of your boxes. 1 = 1 metre. A door is about 2 m tall, 0.9 m wide. |
| Everything is dark | No light, or you're standing inside a box | Check the **Light** entity is still in the Hierarchy. Check the camera isn't inside a wall. |
| Boxes half-sunk into the floor | Position y is 0 | Position is the box's centre. Set y to half the box's height. |
| I changed something and the headset shows the old version | You didn't republish, or the old page is cached | Publish again (step 23). Then reload in the headset. |
| Publish button is greyed out / fails | Project storage or not saved | Wait a few seconds and try again. If it keeps failing, put your hand up. |
| Guardian boundary keeps appearing | You're moving outside the stationary boundary | Stand still at your desk. Turn, crouch, reach — don't walk. |
| Fork button isn't there | Not signed in, or account not verified | Sign in. If your email isn't verified, ask for the spare login for today. |
| I can't see the scene in the Editor viewport | You dragged the view away | Select something in the Hierarchy and press **F**. |
| Testing on my iPhone doesn't work | iOS has no WebXR | It never will. Use the headset. |
| I can't add a block on Are.na | Not signed in, or no channel yet | Sign in at are.na. On your profile, make a **new channel** named *3D Immersive Environment — Your Name*, set to **Closed** (everyone can see it; only you can add to it). If the account itself is the problem, tell the instructor — your link goes on the class channel for you today. |
