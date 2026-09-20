import { Script, Entity, Vec3 } from 'playcanvas';

/**
 * Something happens when you look at this.
 *
 * Attach to the thing that wants to be looked at. Drop the thing that
 * should change into the `target` slot. When the centre of your view is
 * within `angle` degrees of this entity, and you are closer than
 * `maxDistance`, and you keep looking for `dwellSeconds`, the target
 * switches on. Look away and it switches off (or stays — see
 * `holdSeconds` and `once`).
 *
 * `dwellSeconds` is the difference between a glance and a look. Keep it
 * above zero or the room will flicker every time you turn your head.
 *
 * "Switches on" means the target entity is enabled. Tick `switchOff` for
 * the opposite: the target is there until you look at it.
 */
export class LookAt extends Script {
    static scriptName = 'lookAt';

    /**
     * The thing that changes. Required.
     * @attribute
     * @type {Entity}
     */
    target = null;

    /**
     * How close to the centre of your view this entity has to be, in
     * degrees. Small = you have to look straight at it. 10 is a look;
     * 30 is "roughly that way".
     * @attribute
     * @type {number}
     * @range [2, 45]
     */
    angle = 10;

    /**
     * Ignore looks from further away than this, in metres.
     * @attribute
     * @type {number}
     * @range [0.5, 30]
     */
    maxDistance = 6;

    /**
     * Seconds you have to keep looking before it counts.
     * @attribute
     * @type {number}
     * @range [0, 5]
     */
    dwellSeconds = 0.5;

    /**
     * Seconds the change stays after you look away. 0 = it goes back at once.
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
     * If on, the target starts ON and switches OFF when you look.
     * @attribute
     * @type {boolean}
     */
    switchOff = false;

    initialize() {
        if (!this.target) {
            console.warn('lookAt: drop an entity into the Target slot.');
        }
        this._triggered = false;
        this._looking = 0;   // seconds of continuous looking
        this._timer = 0;     // hold countdown
        this._toThis = new Vec3();
        this._apply(false);
    }

    update(dt) {
        if (!this.target) return;
        if (this.once && this._triggered) return;

        const head = this._head();
        if (!head) return;

        // Direction from the head to this entity, and how far.
        this._toThis.sub2(this.entity.getPosition(), head.getPosition());
        const distance = this._toThis.length();
        let looking = false;

        if (distance > 0.001 && distance <= this.maxDistance) {
            this._toThis.normalize();
            // Cosine of the angle between where the head points and where this is.
            const cos = head.forward.dot(this._toThis);
            const limit = Math.cos(this.angle * Math.PI / 180);
            looking = cos >= limit;
        }

        if (looking) {
            this._looking += dt;
            this._timer = this.holdSeconds;
            if (!this._triggered && this._looking >= this.dwellSeconds) {
                this._triggered = true;
                this._apply(true);
            }
        } else {
            this._looking = 0;
            if (this._triggered) {
                this._timer -= dt;
                if (this._timer <= 0 && !this.once) {
                    this._triggered = false;
                    this._apply(false);
                }
            }
        }
    }

    // The entity whose view counts as "you": the headset in XR, the camera otherwise.
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
