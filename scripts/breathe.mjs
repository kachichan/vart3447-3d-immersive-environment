import { Script } from 'playcanvas';

/**
 * A light that breathes.
 *
 * Attach to any entity that has a Light component (a lamp, a window, a
 * screen). Its brightness rises and falls smoothly between two values.
 * Two lamps with different `offset` values breathe out of step.
 */
export class Breathe extends Script {
    static scriptName = 'breathe';

    /**
     * Seconds for one full breath in and out.
     * @attribute
     * @type {number}
     * @range [0.5, 60]
     */
    period = 4;

    /**
     * Dimmest brightness.
     * @attribute
     * @type {number}
     * @range [0, 10]
     */
    intensityMin = 0.2;

    /**
     * Brightest brightness.
     * @attribute
     * @type {number}
     * @range [0, 10]
     */
    intensityMax = 2;

    /**
     * Where in the breath to start, 0 to 1. Give two lights different
     * offsets so they don't move together.
     * @attribute
     * @type {number}
     * @range [0, 1]
     */
    offset = 0;

    initialize() {
        if (!this.entity.light) {
            console.warn('breathe: attach this script to an entity with a Light component.');
        }
        this._time = this.offset * this.period;
    }

    update(dt) {
        const light = this.entity.light;
        if (!light) return;

        this._time += dt;
        // 0 → 1 → 0, smoothly, once per period
        const phase = (1 - Math.cos((this._time / this.period) * Math.PI * 2)) / 2;
        light.intensity = this.intensityMin + (this.intensityMax - this.intensityMin) * phase;
    }
}
