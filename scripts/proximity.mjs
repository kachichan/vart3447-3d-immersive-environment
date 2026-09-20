import { Script, Entity } from 'playcanvas';

/**
 * Something happens when you come close.
 *
 * Attach to the thing you want to walk up to — a box, a lamp, an empty
 * entity standing in for a spot on the floor. Drop the thing that should
 * change into the `target` slot. When your head comes within `radius`
 * metres of this entity, the target switches on. Step away and it
 * switches off again (or stays, if you set `holdSeconds` or `once`).
 *
 * "Switches on" means the target entity is enabled: a lamp lights, a box
 * appears, a whole group of things appears if the target is their parent.
 * Tick `switchOff` for the opposite: the target starts on and goes away
 * when you come close.
 *
 * In the headset "you" is the headset. In the Launch window it is the
 * camera, so use the arrow keys / WASD (the `deskWalk` script) to test.
 */
export class Proximity extends Script {
    static scriptName = 'proximity';

    /**
     * The thing that changes. Required.
     * @attribute
     * @type {Entity}
     */
    target = null;

    /**
     * How close you have to come, in metres, measured across the floor
     * from this entity to where you are standing. Height is ignored.
     * @attribute
     * @type {number}
     * @range [0.2, 10]
     */
    radius = 1;

    /**
     * Seconds the change stays after you step away. 0 = it goes back at once.
     * @attribute
     * @type {number}
     * @range [0, 60]
     */
    holdSeconds = 0;

    /**
     * If on, it happens once and never goes back.
     * @attribute
     * @type {boolean}
     */
    once = false;

    /**
     * If on, the target starts ON and switches OFF when you come close.
     * @attribute
     * @type {boolean}
     */
    switchOff = false;

    initialize() {
        if (!this.target) {
            console.warn('proximity: drop an entity into the Target slot.');
        }
        this._triggered = false;
        this._timer = 0;
        this._apply(false);
    }

    update(dt) {
        if (!this.target) return;
        if (this.once && this._triggered) return;

        const head = this._head();
        if (!head) return;

        // Distance across the floor, ignoring height: your head is 1.6 m up,
        // and a spot on the floor should still count when you stand on it.
        const headPosition = head.getPosition();
        const here = this.entity.getPosition();
        const dx = headPosition.x - here.x;
        const dz = headPosition.z - here.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        const near = distance <= this.radius;

        if (near) {
            this._timer = this.holdSeconds;
            if (!this._triggered) {
                this._triggered = true;
                this._apply(true);
            }
        } else if (this._triggered) {
            this._timer -= dt;
            if (this._timer <= 0 && !this.once) {
                this._triggered = false;
                this._apply(false);
            }
        }
    }

    // The entity whose position counts as "you": the headset in XR, the camera otherwise.
    _head() {
        const xr = this.app.xr;
        if (xr && xr.active && xr.camera) return xr.camera;
        const cameras = this.app.systems.camera.cameras;
        return cameras.length > 0 ? cameras[0].entity : null;
    }

    // Turn the target on or off. `switchOff` flips what "on" means.
    _apply(active) {
        if (!this.target) return;
        this.target.enabled = this.switchOff ? !active : active;
    }
}
