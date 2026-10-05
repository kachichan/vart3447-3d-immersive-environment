import { Script, Entity, StandardMaterial, Color, BLEND_NORMAL, CULLFACE_NONE, DISTANCE_LINEAR } from 'playcanvas';

/**
 * Your ears. Put this on the Camera.
 *
 * It does three things:
 *
 * 1. It puts a listener on the Camera, so every sound is heard from
 *    where your head is: in the headset, and in the Launch window.
 *
 * 2. It switches every sound in the room to `spatial` hearing (the
 *    browser calls it HRTF). Without it you only hear left and right.
 *    With it you can also hear in front, behind, above and below.
 *    Untick `spatial` to hear the difference.
 *
 * 3. When you press Launch, it writes one line per sound in the
 *    console: how close you must be for full volume, and how far away
 *    it goes silent. It warns you if a sound reaches everywhere.
 *
 * Tick `showReach` to see two pale bubbles round every sound. Inside the
 * small one it is at full volume; outside the big one it is silent (or
 * as quiet as it gets). Untick it before you publish.
 */
export class Ears extends Script {
    static scriptName = 'ears';

    /**
     * Hear in front, behind, above and below, not only left and right.
     * @attribute
     * @type {boolean}
     */
    spatial = true;

    /**
     * Show a bubble round every sound: where you can hear it.
     * For testing only. Untick before you publish.
     * @attribute
     * @type {boolean}
     */
    showReach = false;

    initialize() {
        if (!this.entity.camera) {
            console.warn('ears: put this on the Camera (the entity inside the Rig), not on "' + this.entity.name + '".');
        }

        // The listener is what hears. It must move with your head.
        if (!this.entity.audiolistener) {
            this.entity.addComponent('audiolistener');
        }

        this._sounds = this.app.root.findComponents('sound');
        this._bubbles = [];   // { sound, outer, inner }

        this._materials = {
            outer: this._makeMaterial(0.3, 0.6, 1, 0.16),
            inner: this._makeMaterial(0.3, 0.6, 1, 0.3)
        };

        this._report();
        this._makeBubbles();

        this.on('destroy', () => {
            for (const bubble of this._bubbles) {
                bubble.outer.destroy();
                bubble.inner.destroy();
            }
            for (const material of Object.values(this._materials)) material.destroy();
        });
    }

    update() {
        // Every playing sound gets the hearing you chose. A sound that
        // starts later (a proximity target switching on) is caught here too.
        const model = this.spatial ? 'HRTF' : 'equalpower';
        for (const sound of this._sounds) {
            for (const slot of Object.values(sound.slots)) {
                for (const instance of slot.instances) {
                    const panner = instance.panner;
                    if (panner && panner.panningModel !== model) panner.panningModel = model;
                }
            }
        }

        // Bubbles follow their sounds, and vanish when a sound is switched off.
        for (const bubble of this._bubbles) {
            const on = this.showReach && bubble.sound.enabled && bubble.sound.entity.enabled;
            bubble.outer.enabled = on;
            bubble.inner.enabled = on;
            if (on) {
                const position = bubble.sound.entity.getPosition();
                bubble.outer.setPosition(position);
                bubble.inner.setPosition(position);
            }
        }
    }

    // One console line per sound, in plain words.
    _report() {
        if (this._sounds.length === 0) {
            console.log('ears: no sounds in this room yet. Add Component → Audio → Sound on the thing that makes the sound.');
            return;
        }
        for (const sound of this._sounds) {
            const name = '"' + sound.entity.name + '"';
            const slots = Object.values(sound.slots);
            const empty = slots.length === 0 || slots.every(slot => !this.app.assets.get(slot.asset));
            if (empty) {
                console.warn('ears: ' + name + ' has a Sound component with no sound in it. Drag your audio file into the slot\'s Asset.');
                continue;
            }
            if (!slots.some(slot => slot.autoPlay)) {
                console.log('ears: ' + name + ' has Auto Play off, so it only plays when a script plays it.');
            }
            if (!sound.positional) {
                console.log('ears: ' + name + ' is not Positional: you hear it the same everywhere, coming from nowhere.');
                continue;
            }
            const reach = this._reach(sound);
            const near = this._metres(sound.refDistance);
            if (reach.everywhere) {
                console.warn('ears: ' + name + ' reaches everywhere (Max Distance ' + sound.maxDistance + '). Set Max Distance to how far away it should go silent, in metres.');
            } else if (reach.silent) {
                console.log('ears: ' + name + ' is full volume within ' + near + ', silent beyond ' + this._metres(reach.distance) + '.');
            } else {
                console.log('ears: ' + name + ' is full volume within ' + near + ', and never silent: from ' + this._metres(reach.distance) + ' on it stays at ' + Math.round(reach.floor * 100) + '%.');
            }
        }
    }

    // How far a positional sound reaches, following the browser's own rules.
    _reach(sound) {
        const ref = Math.max(0.0001, sound.refDistance);
        const max = Math.max(ref, sound.maxDistance);
        const rolloff = Math.max(0, sound.rollOffFactor);
        const everywhere = max >= 100;
        if (sound.distanceModel === DISTANCE_LINEAR) {
            // Linear: the browser treats a roll-off above 1 as 1.
            const r = Math.min(1, rolloff);
            return { everywhere, silent: r >= 1, distance: max, floor: 1 - r };
        }
        // Inverse and exponential never reach silence; they stop getting quieter at Max Distance.
        const floor = sound.distanceModel === 'inverse' ?
            ref / (ref + rolloff * (max - ref)) :
            Math.pow(max / ref, -rolloff);
        return { everywhere, silent: false, distance: max, floor };
    }

    _metres(value) {
        return (Math.round(value * 10) / 10) + ' m';
    }

    // Two see-through spheres per positional sound: full volume (inner) and reach (outer).
    _makeBubbles() {
        for (const sound of this._sounds) {
            if (!sound.positional) continue;
            const reach = this._reach(sound);
            if (reach.everywhere) continue;   // a bubble the size of the world helps nobody
            const outer = this._makeSphere('ears-reach-' + sound.entity.name, reach.distance, this._materials.outer);
            const inner = this._makeSphere('ears-full-' + sound.entity.name, sound.refDistance, this._materials.inner);
            this._bubbles.push({ sound, outer, inner });
        }
    }

    _makeSphere(name, radius, material) {
        const entity = new Entity(name);
        entity.addComponent('render', { type: 'sphere', castShadows: false, receiveShadows: false });
        entity.render.material = material;
        entity.setLocalScale(radius * 2, radius * 2, radius * 2);   // the sphere is 1 m across
        entity.enabled = false;
        this.app.root.addChild(entity);
        return entity;
    }

    // A faint colour that ignores the lights and can be seen from inside.
    _makeMaterial(r, g, b, opacity) {
        const material = new StandardMaterial();
        material.diffuse = new Color(0, 0, 0);
        material.emissive = new Color(r, g, b);
        material.useLighting = false;
        material.blendType = BLEND_NORMAL;
        material.opacity = opacity;
        material.depthWrite = false;
        material.cull = CULLFACE_NONE;
        material.update();
        return material;
    }
}
