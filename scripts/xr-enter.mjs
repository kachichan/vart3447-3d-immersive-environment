import { Script, Entity, XRTYPE_VR, XRSPACE_LOCALFLOOR, XRSPACE_LOCAL } from 'playcanvas';

/**
 * Starts a WebXR VR session on the first tap or click.
 * Attach to any entity; point `cameraEntity` at the entity that has the Camera component.
 */
export class XrEnter extends Script {
    static scriptName = 'xrEnter';

    /**
     * The camera that will render the XR session.
     * @attribute
     * @type {Entity}
     */
    cameraEntity = null;

    /** True while a session request is in flight, so a double tap can't start two sessions. */
    starting = false;

    initialize() {
        const camera = this.cameraEntity ?? this.entity;

        if (!this.app.xr.supported) {
            console.warn('WebXR is not supported in this browser.');
            return;
        }

        const start = () => {
            if (this.app.xr.active || this.starting) return;
            if (!this.app.xr.isAvailable(XRTYPE_VR)) {
                console.warn('Immersive VR is not available on this device.');
                return;
            }
            this.starting = true;
            const done = (err) => {
                this.starting = false;
                if (err) console.error('Could not start XR:', err);
            };
            // Prefer a floor-anchored space; fall back to LOCAL (eye-level origin) if the device refuses it.
            camera.camera.startXr(XRTYPE_VR, XRSPACE_LOCALFLOOR, {
                optionalFeatures: ['hand-tracking'],   // week 3: lets grab work with a pinch
                callback: (err) => {
                    if (!err) return done();
                    console.warn('local-floor refused, retrying with local:', err);
                    camera.camera.startXr(XRTYPE_VR, XRSPACE_LOCAL, { optionalFeatures: ['hand-tracking'], callback: done });
                }
            });
        };

        // One user-gesture listener. 'click' fires for mouse, touch and Quest controller taps alike.
        this.app.graphicsDevice.canvas.addEventListener('click', start);

        this.app.xr.on('start', () => console.log('XR session started'));
        this.app.xr.on('end', () => console.log('XR session ended. Tap again to re-enter.'));
    }
}
