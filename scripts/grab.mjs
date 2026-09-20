import { Script, Vec3, Quat } from 'playcanvas';

/**
 * Pick this up and move it.
 *
 * Attach to the thing you want to be able to hold. Bring a controller (or
 * a tracked hand) within `radius` metres of it and pull the trigger (or
 * pinch). It follows your hand until you let go. Where you let go is
 * where it stays — unless `returnHome` is on, in which case it drifts
 * back to where it started over `returnSeconds`.
 *
 * Needs a headset: there is nothing to grab with in the Launch window.
 * Works with Quest controllers (trigger) and with hand tracking (pinch)
 * if `xrEnter` asked for the 'hand-tracking' feature.
 */
export class Grab extends Script {
    static scriptName = 'grab';

    /**
     * How close your hand has to be, in metres, measured to this
     * entity's centre. Big things need a bigger radius.
     * @attribute
     * @type {number}
     * @range [0.05, 1]
     */
    radius = 0.25;

    /**
     * If on, the thing goes back to where it started when you let go.
     * @attribute
     * @type {boolean}
     */
    returnHome = false;

    /**
     * Seconds it takes to drift home. 0 = snaps back.
     * @attribute
     * @type {number}
     * @range [0, 10]
     */
    returnSeconds = 1;

    initialize() {
        // Remember where it started, for returnHome.
        this._homePosition = this.entity.getPosition().clone();
        this._homeRotation = this.entity.getRotation().clone();

        this._holder = null;             // the input source holding it, or null
        this._offsetPosition = new Vec3(); // where the thing sits relative to the hand
        this._offsetRotation = new Quat();
        this._returning = 0;             // seconds left of the drift home

        // Scratch values, reused every frame so nothing is allocated in update().
        this._handPosition = new Vec3();
        this._handRotation = new Quat();
        this._inverse = new Quat();
        this._position = new Vec3();
        this._rotation = new Quat();
        this._fromPosition = new Vec3();
        this._fromRotation = new Quat();

        const input = this.app.xr && this.app.xr.input;
        if (!input) {
            console.warn('grab: no XR available. This script only works in a headset.');
            return;
        }
        input.on('selectstart', this._onSelectStart, this);
        input.on('selectend', this._onSelectEnd, this);
        this.on('destroy', () => {
            input.off('selectstart', this._onSelectStart, this);
            input.off('selectend', this._onSelectEnd, this);
        });
    }

    update(dt) {
        if (this._holder) {
            // Follow the hand, keeping the offset we had when we grabbed.
            if (!this._hand(this._holder)) return;
            this._handRotation.transformVector(this._offsetPosition, this._position);
            this._position.add(this._handPosition);
            this._rotation.mul2(this._handRotation, this._offsetRotation);
            this.entity.setPosition(this._position);
            this.entity.setRotation(this._rotation);
        } else if (this._returning > 0) {
            // Drift home.
            this._returning = Math.max(0, this._returning - dt);
            const t = 1 - this._returning / this.returnSeconds;
            this._position.lerp(this._fromPosition, this._homePosition, t);
            this._rotation.slerp(this._fromRotation, this._homeRotation, t);
            this.entity.setPosition(this._position);
            this.entity.setRotation(this._rotation);
        }
    }

    _onSelectStart(inputSource) {
        if (this._holder) return;
        if (!this._hand(inputSource)) return;

        const distance = this._handPosition.distance(this.entity.getPosition());
        if (distance > this.radius) return;

        // Work out where the thing is relative to the hand, so it doesn't jump into the palm.
        this._holder = inputSource;
        this._returning = 0;
        this._inverse.copy(this._handRotation).invert();
        this._offsetPosition.sub2(this.entity.getPosition(), this._handPosition);
        this._inverse.transformVector(this._offsetPosition, this._offsetPosition);
        this._offsetRotation.mul2(this._inverse, this.entity.getRotation());
    }

    _onSelectEnd(inputSource) {
        if (inputSource !== this._holder) return;
        this._holder = null;

        if (this.returnHome) {
            if (this.returnSeconds <= 0) {
                this.entity.setPosition(this._homePosition);
                this.entity.setRotation(this._homeRotation);
            } else {
                this._fromPosition.copy(this.entity.getPosition());
                this._fromRotation.copy(this.entity.getRotation());
                this._returning = this.returnSeconds;
            }
        }
    }

    // Fill _handPosition / _handRotation from an input source. Returns false if it has no position yet.
    // A controller reports its grip; a tracked hand reports its index fingertip.
    _hand(inputSource) {
        if (inputSource.hand) {
            const joint = inputSource.hand.getJointById('index-finger-tip') || inputSource.hand.wrist;
            if (!joint) return false;
            this._handPosition.copy(joint.getPosition());
            this._handRotation.copy(joint.getRotation());
            return true;
        }
        const position = inputSource.getPosition();
        const rotation = inputSource.getRotation();
        if (!position || !rotation) return false;
        this._handPosition.copy(position);
        this._handRotation.copy(rotation);
        return true;
    }
}
