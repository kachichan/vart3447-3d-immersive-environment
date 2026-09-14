import { Script, Color } from 'playcanvas';

/**
 * A surface whose colour drifts.
 *
 * Attach to any box (or other entity with a Render component). Its colour
 * moves slowly from A to B. Only this entity changes — the material is
 * copied for it, so other boxes using the same colour are left alone.
 *
 * Tick `glow` to drift the emissive (self-lit) colour instead, for a
 * window, a screen, or a thing that is its own light.
 */
export class ColourDrift extends Script {
    static scriptName = 'colourDrift';

    /**
     * Starting colour.
     * @attribute
     * @type {Color}
     */
    colourA = new Color(0.9, 0.85, 0.7);

    /**
     * Colour to drift towards.
     * @attribute
     * @type {Color}
     */
    colourB = new Color(0.2, 0.25, 0.4);

    /**
     * Seconds to get from A to B.
     * @attribute
     * @type {number}
     * @range [1, 600]
     */
    period = 30;

    /**
     * If on, drifts back from B to A afterwards and repeats. If off, jumps
     * back to A and starts again.
     * @attribute
     * @type {boolean}
     */
    backAndForth = true;

    /**
     * Drift the emissive (glowing) colour instead of the surface colour.
     * @attribute
     * @type {boolean}
     */
    glow = false;

    initialize() {
        this._time = 0;
        this._colour = new Color();
        this._materials = null;
    }

    _setup() {
        const render = this.entity.render;
        if (!render || !render.meshInstances || render.meshInstances.length === 0) return false;
        // Clone so only this entity changes colour, not everything sharing the material.
        this._materials = render.meshInstances.map((mi) => {
            const copy = mi.material.clone();
            mi.material = copy;
            return copy;
        });
        return true;
    }

    update(dt) {
        if (!this._materials && !this._setup()) return;

        this._time += dt;

        let t;
        if (this.backAndForth) {
            const cycle = (this._time / this.period) % 2;   // 0..2
            t = cycle <= 1 ? cycle : 2 - cycle;              // 0→1→0
        } else {
            t = (this._time / this.period) % 1;              // 0→1, jump
        }

        this._colour.lerp(this.colourA, this.colourB, t);

        for (const material of this._materials) {
            if (this.glow) {
                material.emissive.copy(this._colour);
            } else {
                material.diffuse.copy(this._colour);
            }
            material.update();
        }
    }
}
