import { Script, Entity, StandardMaterial, Color, Vec3 } from 'playcanvas';

/**
 * Point at the floor and go there.
 *
 * Attach to the Rig (the entity the Camera sits inside), next to
 * `deskWalk`. In the headset, hold the trigger: a ring appears on the
 * floor where you're pointing. Let go and you are standing there. Point
 * somewhere impossible — the sky, past `maxDistance` — and the ring turns
 * red; let go and nothing happens.
 *
 * You arrive facing the same way you were facing. Teleport doesn't turn
 * you: turn your own body.
 *
 * Needs a controller. Tracked hands have no aim, so they can't teleport
 * (they can still `grab`). Does nothing in the Launch window — use
 * `deskWalk` there.
 *
 * Works alongside `grab`. If there is something grabbable within reach
 * when you pull the trigger, that pull is a grab and no teleport happens,
 * so picking things up never throws you across the room.
 *
 * The floor here is flat: an invisible level surface at `floorHeight`.
 * It doesn't know about your walls, so you can point through them unless
 * you keep `maxDistance` inside your room.
 */
export class Teleport extends Script {
    static scriptName = 'teleport';

    /**
     * Height of the floor you land on, in metres. 0 is the floor you
     * built the room on.
     * @attribute
     * @type {number}
     * @range [-10, 10]
     */
    floorHeight = 0;

    /**
     * How far you can go in one jump, in metres. Keep this inside your
     * room so nobody lands in a wall.
     * @attribute
     * @type {number}
     * @range [0.5, 30]
     */
    maxDistance = 6;

    /**
     * Size of the ring on the floor, in metres.
     * @attribute
     * @type {number}
     * @range [0.1, 1]
     */
    markerSize = 0.35;

    initialize() {
        const cameraComponent = this.entity.findComponent('camera');
        this._camera = cameraComponent ? cameraComponent.entity : null;
        if (!this._camera) {
            console.warn('teleport: attach this to the Rig, the entity that contains the Camera.');
        }

        this._aiming = null;         // the controller holding its trigger, or null
        this._grabbing = false;      // true if this trigger pull is a grab, not a teleport
        this._target = new Vec3();   // where the ring is
        this._valid = false;         // is that a place you can go?
        this._offset = new Vec3();   // scratch: where you stand inside the play space
        this._grabbables = [];

        this._materials = {
            valid: this._makeMaterial(0.2, 1, 0.4),
            invalid: this._makeMaterial(1, 0.3, 0.2)
        };

        // The ring: a thin cylinder lying on the floor. Hidden until you aim.
        this._marker = new Entity('teleport-marker');
        this._marker.addComponent('render', { type: 'cylinder', castShadows: false, receiveShadows: false });
        this._marker.render.material = this._materials.valid;
        this._marker.enabled = false;
        this.app.root.addChild(this._marker);

        const input = this.app.xr && this.app.xr.input;
        if (!input) {
            console.warn('teleport: no XR available. This script only works in a headset.');
            return;
        }

        input.on('selectstart', this._onSelectStart, this);
        input.on('selectend', this._onSelectEnd, this);
        this.app.xr.on('start', this._findGrabbables, this);
        this._findGrabbables();

        this.on('destroy', () => {
            input.off('selectstart', this._onSelectStart, this);
            input.off('selectend', this._onSelectEnd, this);
            this.app.xr.off('start', this._findGrabbables, this);
            this._marker.destroy();
            for (const material of Object.values(this._materials)) material.destroy();
        });
    }

    update() {
        if (!this._aiming || this._grabbing) {
            this._marker.enabled = false;
            return;
        }

        this._valid = this._aimAtFloor(this._aiming);
        this._marker.enabled = this._valid || this._pointingDown(this._aiming);
        if (!this._marker.enabled) return;

        this._marker.setPosition(this._target.x, this.floorHeight + 0.01, this._target.z);
        this._marker.setLocalScale(this.markerSize, 0.01, this.markerSize);
        this._marker.render.material = this._valid ? this._materials.valid : this._materials.invalid;
    }

    _onSelectStart(source) {
        if (this._aiming || source.hand) return;   // one aim at a time; hands have no ray

        // If something grabbable is in reach, this pull belongs to grab.
        this._grabbing = this._grabInReach(source);
        this._aiming = source;
    }

    _onSelectEnd(source) {
        if (source !== this._aiming) return;
        const go = this._valid && !this._grabbing;
        this._aiming = null;
        this._grabbing = false;
        this._marker.enabled = false;
        this._valid = false;
        if (go) this._moveTo(this._target);
    }

    // Move the Rig so that you — not the Rig's origin — end up on the ring.
    // Your head is somewhere inside the play space; that offset has to come off,
    // or you land a step away from where you aimed.
    _moveTo(target) {
        const rig = this.entity.getPosition();
        if (this._camera) {
            const head = this._camera.getPosition();
            this._offset.set(head.x - rig.x, 0, head.z - rig.z);
        } else {
            this._offset.set(0, 0, 0);
        }
        this.entity.setPosition(
            target.x - this._offset.x,
            this.floorHeight,
            target.z - this._offset.z
        );
    }

    // Where does this controller's ray cross the floor? Puts it in _target.
    // False if it points up, past maxDistance, or almost flat along the floor.
    _aimAtFloor(source) {
        if (!this._pointingDown(source)) return false;

        const origin = source.getOrigin();
        const direction = source.getDirection();
        const drop = origin.y - this.floorHeight;
        const distance = drop / -direction.y;   // steps along the ray until it reaches the floor

        this._target.set(
            origin.x + direction.x * distance,
            this.floorHeight,
            origin.z + direction.z * distance
        );

        // Measure the jump across the floor, ignoring how high you're holding the controller.
        const dx = this._target.x - origin.x;
        const dz = this._target.z - origin.z;
        return Math.sqrt(dx * dx + dz * dz) <= this.maxDistance;
    }

    // Is the ray heading downwards at all? Flat or upward never meets the floor.
    _pointingDown(source) {
        const origin = source.getOrigin();
        const direction = source.getDirection();
        if (!origin || !direction) return false;
        if (origin.y <= this.floorHeight) return false;
        return direction.y < -0.05;
    }

    // Is there something grabbable close enough that this trigger pull is a grab?
    // Same measurement grab itself makes, so the two scripts agree.
    _grabInReach(source) {
        const position = source.getPosition();
        if (!position) return false;
        for (const entity of this._grabbables) {
            const grab = entity.script && entity.script.get('grab');
            if (!grab || !entity.enabled) continue;
            if (position.distance(entity.getPosition()) <= grab.radius) return true;
        }
        return false;
    }

    _findGrabbables() {
        this._grabbables = this.app.root.find(e => e.script && e.script.has('grab'));
    }

    _makeMaterial(r, g, b) {
        const material = new StandardMaterial();
        material.diffuse = new Color(0, 0, 0);
        material.emissive = new Color(r, g, b);
        material.useLighting = false;
        material.update();
        return material;
    }
}
