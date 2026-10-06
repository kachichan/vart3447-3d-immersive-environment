import { Script } from 'playcanvas';

/**
 * The controller shakes in your hand.
 *
 * Attach to a thing. When a controller comes within `radius` metres of
 * it, that controller vibrates. Tick `useHead` and it is your head that
 * counts instead: walk up to the spot and both controllers vibrate.
 *
 * A buzz is a rhythm of pulses: `pulseMs` on, `gapMs` off, again and
 * again for as long as you stay close. `gapMs` 0 is one long hum.
 * 60 on / 900 off is a heartbeat. 20 on / 120 off is a clicking, like
 * something feeling its way in the dark.
 *
 * Tick `onlyOnEnter` for a single bump when you arrive, and nothing
 * after. Tick `closerIsStronger` and it grows as you get closer.
 *
 * Needs a headset AND controllers. Nothing happens in the Launch window,
 * and tracked hands (no controllers) can't vibrate.
 */
export class Buzz extends Script {
    static scriptName = 'buzz';

    /**
     * How close, in metres. Hands: measured to this entity's centre.
     * Head: measured across the floor, height ignored.
     * @attribute
     * @type {number}
     * @range [0.05, 5]
     */
    radius = 0.3;

    /**
     * If on, your head coming close counts, not your hands,
     * and both controllers buzz.
     * @attribute
     * @type {boolean}
     */
    useHead = false;

    /**
     * How strong. 0 = nothing, 1 = as strong as the controller goes.
     * @attribute
     * @type {number}
     * @range [0, 1]
     */
    strength = 0.5;

    /**
     * How long each pulse lasts, in milliseconds.
     * @attribute
     * @type {number}
     * @range [10, 1000]
     */
    pulseMs = 60;

    /**
     * Silence between pulses, in milliseconds. 0 = one long hum.
     * @attribute
     * @type {number}
     * @range [0, 3000]
     */
    gapMs = 900;

    /**
     * If on, the buzz gets stronger the closer you come:
     * faint at the edge of `radius`, full `strength` at the centre.
     * @attribute
     * @type {boolean}
     */
    closerIsStronger = false;

    /**
     * If on, one pulse when you arrive, then nothing until you
     * step away and come back.
     * @attribute
     * @type {boolean}
     */
    onlyOnEnter = false;

    initialize() {
        // For each controller: is it near right now, and how long until its next pulse.
        this._state = new Map();
        this._warned = false;

        console.log('buzz: ' + (this.useHead ? 'stand' : 'bring a controller') + ' within ' + this.radius +
            ' m of "' + this.entity.name + '": ' + this.pulseMs + ' ms on, ' +
            (this.gapMs > 0 ? this.gapMs + ' ms off' : 'no gap') +
            (this.onlyOnEnter ? ', once on arrival.' : ', for as long as you stay.'));

        if (!this.app.xr) {
            console.warn('buzz: no XR available. This only works in a headset, with controllers.');
        }
    }

    update(dt) {
        const xr = this.app.xr;
        if (!xr || !xr.active) return;

        // How close is "you" right now? Only needed once a frame for the head.
        let headCloseness = null;
        if (this.useHead) {
            headCloseness = this._closeness(xr.camera, false);
        }

        for (const inputSource of xr.input.inputSources) {
            if (!inputSource.gamepad) continue;  // tracked hands have no gamepad: nothing to shake

            // 1 at the centre, 0 at the edge of radius, null if outside.
            const closeness = this.useHead ? headCloseness : this._closeness(inputSource, true);

            let state = this._state.get(inputSource);
            if (!state) {
                state = { near: false, wait: 0 };
                this._state.set(inputSource, state);
            }

            if (closeness === null) {
                state.near = false;
                continue;
            }

            const arriving = !state.near;
            state.near = true;

            if (this.onlyOnEnter) {
                if (arriving) this._pulse(inputSource, closeness);
                continue;
            }

            // Count down to the next pulse. Arriving pulses at once.
            state.wait = arriving ? 0 : state.wait - dt * 1000;
            if (state.wait <= 0) {
                this._pulse(inputSource, closeness);
                state.wait = this.pulseMs + this.gapMs;
            }
        }
    }

    // How close something is: 1 at the centre, 0 at the edge, null if outside radius.
    // Hands are measured straight to the centre; the head across the floor.
    _closeness(thing, straight) {
        if (!thing) return null;
        const there = thing.getPosition();
        if (!there) return null;
        const here = this.entity.getPosition();
        const dx = there.x - here.x;
        const dy = straight ? there.y - here.y : 0;
        const dz = there.z - here.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance > this.radius) return null;
        return 1 - distance / this.radius;
    }

    // Shake one controller for pulseMs.
    _pulse(inputSource, closeness) {
        const actuators = inputSource.gamepad.hapticActuators;
        const motor = actuators && actuators[0];
        if (!motor || !motor.pulse) {
            if (!this._warned) {
                console.warn('buzz: this controller has no vibration this browser can use.');
                this._warned = true;
            }
            return;
        }
        // closerIsStronger: never quite zero at the edge, or the edge is silent.
        const amount = this.closerIsStronger ? Math.max(0.1, closeness) : 1;
        motor.pulse(Math.min(1, this.strength * amount), this.pulseMs);
    }
}
