import {
    Script, Vec3,
    KEY_W, KEY_A, KEY_S, KEY_D, KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT,
    MOUSEBUTTON_LEFT
} from 'playcanvas';

/**
 * Walk around in the Launch window, so you can test proximity and lookAt
 * at your desk before putting the headset on.
 *
 * Attach to the Rig (the entity the Camera sits inside). Arrow keys or
 * WASD walk; drag with the mouse to look around. Does nothing once the
 * headset takes over — in XR your body is the controller.
 */
export class DeskWalk extends Script {
    static scriptName = 'deskWalk';

    /**
     * Walking speed in metres per second.
     * @attribute
     * @type {number}
     * @range [0.2, 5]
     */
    speed = 1.5;

    /**
     * How fast the view turns when you drag.
     * @attribute
     * @type {number}
     * @range [0.05, 1]
     */
    lookSpeed = 0.2;

    initialize() {
        const cameraComponent = this.entity.findComponent('camera');
        this._camera = cameraComponent ? cameraComponent.entity : null;
        if (!this._camera) {
            console.warn('deskWalk: attach this to the Rig, the entity that contains the Camera.');
        }
        this._yaw = this.entity.getLocalEulerAngles().y;
        this._pitch = this._camera ? this._camera.getLocalEulerAngles().x : 0;
        this._move = new Vec3();
        this._forward = new Vec3();
        this._right = new Vec3();

        this.app.mouse?.on('mousemove', this._onMouseMove, this);
        this.on('destroy', () => this.app.mouse?.off('mousemove', this._onMouseMove, this));
    }

    _onMouseMove(event) {
        if (this._inXr()) return;
        if (!event.buttons[MOUSEBUTTON_LEFT]) return;
        this._yaw -= event.dx * this.lookSpeed;
        this._pitch = Math.max(-80, Math.min(80, this._pitch - event.dy * this.lookSpeed));
        this.entity.setLocalEulerAngles(0, this._yaw, 0);
        if (this._camera) this._camera.setLocalEulerAngles(this._pitch, 0, 0);
    }

    update(dt) {
        if (this._inXr()) return;
        const keyboard = this.app.keyboard;
        if (!keyboard) return;

        let ahead = 0;
        let side = 0;
        if (keyboard.isPressed(KEY_W) || keyboard.isPressed(KEY_UP)) ahead += 1;
        if (keyboard.isPressed(KEY_S) || keyboard.isPressed(KEY_DOWN)) ahead -= 1;
        if (keyboard.isPressed(KEY_D) || keyboard.isPressed(KEY_RIGHT)) side += 1;
        if (keyboard.isPressed(KEY_A) || keyboard.isPressed(KEY_LEFT)) side -= 1;
        if (ahead === 0 && side === 0) return;

        // Walk along the floor in the direction the rig faces (ignore any pitch).
        this._forward.copy(this.entity.forward);
        this._forward.y = 0;
        this._forward.normalize();
        this._right.copy(this.entity.right);
        this._right.y = 0;
        this._right.normalize();

        this._move.set(0, 0, 0);
        this._move.add(this._forward.mulScalar(ahead));
        this._move.add(this._right.mulScalar(side));
        if (this._move.length() > 0) this._move.normalize().mulScalar(this.speed * dt);
        this.entity.translate(this._move);
    }

    _inXr() {
        return !!(this.app.xr && this.app.xr.active);
    }
}
