import { Script } from 'playcanvas';

/**
 * A place where the room goes quiet.
 *
 * Attach to a spot: an empty entity on the floor, a chair, your Holder.
 * When you stand within `radius` metres of it, every other sound in the
 * room fades down to `level` over `fadeSeconds`. Step away and they all
 * come back.
 *
 * Sounds ON this entity, or inside it, are not hushed. They are what you
 * hear in the silence. Put a quiet sound here with a small Max Distance,
 * and it only exists when everything else has stopped.
 *
 * `level` 0 is silence. 0.3 is "the room holds its breath".
 *
 * hush is an interaction: if you use it, it is your one interaction.
 *
 * In the headset "you" is the headset. In the Launch window it is the
 * camera: walk with the arrow keys (deskWalk) to test.
 */
export class Hush extends Script {
    static scriptName = 'hush';

    /**
     * How close you have to stand, in metres, measured across the floor.
     * Height is ignored.
     * @attribute
     * @type {number}
     * @range [0.2, 10]
     */
    radius = 1;

    /**
     * How loud everything else stays while you are here.
     * 0 = silence, 1 = no change.
     * @attribute
     * @type {number}
     * @range [0, 1]
     */
    level = 0;

    /**
     * Seconds the fade takes, down and back up. 0 = a cut.
     * @attribute
     * @type {number}
     * @range [0, 10]
     */
    fadeSeconds = 2;

    initialize() {
        this._shared = sharedFor(this.app);
        this._shared.hushes.add(this);
        this._current = 1;   // 1 = not hushing; `level` = fully hushed

        const others = this._shared.sounds.filter(sound => !this._owns(sound)).length;
        const own = this._shared.sounds.length - others;
        console.log('hush: stand within ' + this.radius + ' m of "' + this.entity.name + '" and ' +
            others + ' other sound' + (others === 1 ? '' : 's') + ' fade to ' + Math.round(this.level * 100) + '%' +
            (own ? ' (' + own + ' sound' + (own === 1 ? '' : 's') + ' here keep playing).' : '.'));
        if (others === 0) {
            console.warn('hush: there are no other sounds to hush. Add Component → Audio → Sound somewhere else in the room first.');
        }

        // Switched off mid-fade: let the room come back at once, not stay half-hushed.
        this.on('disable', () => {
            this._current = 1;
            applyVolumes(this._shared);
        });
        this.on('destroy', () => {
            this._shared.hushes.delete(this);
            applyVolumes(this._shared);
        });
    }

    update(dt) {
        const head = this._head();
        if (!head) return;

        // Distance across the floor, ignoring height, as in proximity.
        const headPosition = head.getPosition();
        const here = this.entity.getPosition();
        const dx = headPosition.x - here.x;
        const dz = headPosition.z - here.z;
        const near = Math.sqrt(dx * dx + dz * dz) <= this.radius;

        // Move towards `level` when near, back to 1 when not, at a steady pace.
        const goal = near ? this.level : 1;
        if (this.fadeSeconds <= 0) {
            this._current = goal;
        } else {
            const step = dt / this.fadeSeconds;
            if (this._current < goal) this._current = Math.min(goal, this._current + step);
            else this._current = Math.max(goal, this._current - step);
        }

        applyVolumes(this._shared);
    }

    // Is this sound on this entity, or inside it?
    _owns(sound) {
        for (let e = sound.entity; e; e = e.parent) {
            if (e === this.entity) return true;
        }
        return false;
    }

    // The entity whose position counts as "you": the headset in XR, the camera otherwise.
    _head() {
        const xr = this.app.xr;
        if (xr && xr.active && xr.camera) return xr.camera;
        const cameras = this.app.systems.camera.cameras;
        return cameras.length > 0 ? cameras[0].entity : null;
    }
}

// One record per app, shared by every hush in the room, so two hush spots
// don't fight: each sound's volume is the volume you set in the Editor,
// times every hush that doesn't own it.
const registry = new WeakMap();

function sharedFor(app) {
    let shared = registry.get(app);
    if (!shared) {
        const sounds = app.root.findComponents('sound');
        shared = {
            hushes: new Set(),
            sounds,
            base: new Map(sounds.map(sound => [sound, sound.volume])),
            applied: new Map()
        };
        registry.set(app, shared);
    }
    return shared;
}

function applyVolumes(shared) {
    for (const sound of shared.sounds) {
        let factor = 1;
        for (const hush of shared.hushes) {
            if (!hush._owns(sound)) factor *= hush._current;
        }
        const volume = shared.base.get(sound) * factor;
        if (shared.applied.get(sound) !== volume) {
            sound.volume = volume;
            shared.applied.set(sound, volume);
        }
    }
}
