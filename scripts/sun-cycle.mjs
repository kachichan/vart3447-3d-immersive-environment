import { Script, Entity, Color } from 'playcanvas';

/**
 * A sun that crosses the room.
 *
 * Attach to the directional Light. The light rises at one horizon, passes
 * overhead, sets at the opposite horizon, waits out a night, and repeats.
 * Colour and brightness follow the height of the sun. If you drop the
 * Camera into the `skyCamera` slot, the background colour follows too.
 *
 * You only need the first three attributes. The rest have sensible defaults.
 */
export class SunCycle extends Script {
    static scriptName = 'sunCycle';

    /**
     * Seconds from sunrise to sunset.
     * @attribute
     * @type {number}
     * @range [5, 600]
     */
    dayLength = 60;

    /**
     * Seconds of night between sunset and the next sunrise. 0 = no night.
     * @attribute
     * @type {number}
     * @range [0, 600]
     */
    nightLength = 10;

    /**
     * Where in the day the scene starts. 0 = sunrise, 0.5 = noon, 1 = sunset.
     * @attribute
     * @type {number}
     * @range [0, 1]
     */
    startAt = 0.3;

    /**
     * Compass direction the sun travels along, in degrees. Turn this to move
     * where the sun rises relative to your walls.
     * @attribute
     * @type {number}
     * @range [0, 360]
     */
    azimuth = 30;

    /**
     * Light colour at noon.
     * @attribute
     * @type {Color}
     */
    colourNoon = new Color(1, 0.98, 0.92);

    /**
     * Light colour at sunrise and sunset.
     * @attribute
     * @type {Color}
     */
    colourHorizon = new Color(1, 0.55, 0.25);

    /**
     * Brightness at noon.
     * @attribute
     * @type {number}
     * @range [0, 5]
     */
    intensityNoon = 1.5;

    /**
     * Brightness at the horizon.
     * @attribute
     * @type {number}
     * @range [0, 5]
     */
    intensityHorizon = 0.4;

    /**
     * Brightness in the middle of the night.
     * @attribute
     * @type {number}
     * @range [0, 5]
     */
    intensityNight = 0.05;

    /**
     * Optional. The Camera whose background colour should follow the sky.
     * Leave empty to keep the background fixed.
     * @attribute
     * @type {Entity}
     */
    skyCamera = null;

    /**
     * Background colour at noon (only used if skyCamera is set).
     * @attribute
     * @type {Color}
     */
    skyNoon = new Color(0.62, 0.76, 0.95);

    /**
     * Background colour at sunrise and sunset (only used if skyCamera is set).
     * @attribute
     * @type {Color}
     */
    skyHorizon = new Color(0.45, 0.28, 0.38);

    initialize() {
        if (!this.entity.light) {
            console.warn('sunCycle: attach this script to an entity with a Light component.');
        }
        this._time = this.startAt * this.dayLength;
        this._colour = new Color();
        this._sky = new Color();
        this._skyNight = new Color();
    }

    update(dt) {
        const light = this.entity.light;
        if (!light) return;

        const cycle = this.dayLength + this.nightLength;
        this._time = (this._time + dt) % cycle;

        let elevation;   // degrees: -90 sunrise, 0 noon, +90 sunset, 180 midnight
        let height;      // 0 at the horizon, 1 at noon
        let night;       // 0 by day, rises to 1 at midnight

        if (this._time < this.dayLength) {
            const t = this._time / this.dayLength;
            elevation = -90 + 180 * t;
            height = Math.sin(Math.PI * t);
            night = 0;
        } else {
            const n = (this._time - this.dayLength) / this.nightLength;
            elevation = 90 + 180 * n;
            height = 0;
            // fade in over the first 15% of the night and out over the last 15%
            night = Math.min(1, n / 0.15, (1 - n) / 0.15);
        }

        this.entity.setLocalEulerAngles(elevation, this.azimuth, 0);

        this._colour.lerp(this.colourHorizon, this.colourNoon, height);
        light.color = this._colour;

        const dayIntensity = this.intensityHorizon + (this.intensityNoon - this.intensityHorizon) * height;
        light.intensity = dayIntensity + (this.intensityNight - dayIntensity) * night;

        if (this.skyCamera && this.skyCamera.camera) {
            this._sky.lerp(this.skyHorizon, this.skyNoon, height);
            this._skyNight.set(this.skyHorizon.r * 0.25, this.skyHorizon.g * 0.25, this.skyHorizon.b * 0.25);
            this._sky.lerp(this._sky, this._skyNight, night);
            this.skyCamera.camera.clearColor = this._sky;
        }
    }
}
