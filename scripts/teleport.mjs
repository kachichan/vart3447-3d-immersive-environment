import { Script, Entity, StandardMaterial, Color, Vec3, BLEND_NORMAL } from 'playcanvas';

/**
 * Point at the floor and go there.
 *
 * Attach to the Rig (the entity the Camera sits inside), next to
 * `deskWalk`. In the headset, hold the trigger: a line comes out of the
 * controller and a ring appears on the floor where it lands. Let go and
 * you are standing on the ring.
 *
 *   green — you can go there
 *   red   — you can't: too far, or not pointing at the floor
 *
 * The line and ring are drawn through everything, so a thick floor or a
 * wall can't hide them.
 *
 * You arrive facing the same way you were facing. Teleport doesn't turn
 * you: turn your own body.
 *
 * Needs a controller. Tracked hands have no aim, so they can't teleport
 * (they can still `grab`). Does nothing in the Launch window — use
 * `deskWalk` there.
 *
 * Works alongside `grab`. If there is something grabbable within reach
 * when you pull the trigger, that pull is a grab: no line, no teleport.
 * Step back from it and aim again.
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
     * @range [0, 10]
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
        this._origin = new Vec3();   // copies of the controller's ray, taken once per frame
        this._direction = new Vec3();
        this._end = new Vec3();      // where the line stops
        this._offset = new Vec3();   // scratch: where you stand inside the play space
        this._grabbables = [];

        this._materials = {
            valid: this._makeMaterial(0.2, 1, 0.4),
            invalid: this._makeMaterial(1, 0.3, 0.2)
        };

        // The ring: a thin cylinder lying on the floor.
        this._marker = this._makeShape('teleport-ring', 'cylinder');
        // The line: a long thin box from the controller to the ring.
        this._line = this._makeShape('teleport-line', 'box');

        const xr = this.app.xr;
        if (!xr || !xr.input) {
            console.warn('teleport: no XR available. This script only works in a headset.');
            return;
        }

        xr.input.on('selectstart', this._onSelectStart, this);
        xr.input.on('selectend', this._onSelectEnd, this);
        xr.input.on('remove', this._onRemove, this);
        xr.on('start', this._onXrStart, this);
        this._findGrabbables();

        this.on('destroy', () => {
            xr.input.off('selectstart', this._onSelectStart, this);
            xr.input.off('selectend', this._onSelectEnd, this);
            xr.input.off('remove', this._onRemove, this);
            xr.off('start', this._onXrStart, this);
            this._marker.destroy();
            this._line.destroy();
            for (const material of Object.values(this._materials)) material.destroy();
        });
    }

    update() {
        if (!this._aiming || this._grabbing || !this._readRay(this._aiming)) {
            this._marker.enabled = false;
            this._line.enabled = false;
            return;
        }

        this._valid = this._aimAtFloor();
        const material = this._valid ? this._materials.valid : this._materials.invalid;

        // Where the line stops: the floor if it reaches it, otherwise 3 m out.
        const hitsFloor = this._direction.y < -0.05 && this._origin.y > this.floorHeight;
        if (hitsFloor) {
            this._end.set(this._target.x, this.floorHeight, this._target.z);
        } else {
            this._end.copy(this._direction).mulScalar(3).add(this._origin);
        }
        this._placeLine(this._origin, this._end, material);

        // The ring only when the line actually reaches the floor.
        this._marker.enabled = hitsFloor;
        if (hitsFloor) {
            this._marker.setPosition(this._target.x, this.floorHeight + 0.01, this._target.z);
            this._marker.setLocalScale(this.markerSize, 0.01, this.markerSize);
            this._marker.render.material = material;
        }
    }

    _onXrStart() {
        this._findGrabbables();
        console.log('teleport: ready. Hold the trigger and point at the floor.');
    }

    _onSelectStart(source) {
        if (this._aiming || source.hand) return;   // one aim at a time; hands have no ray

        // If something grabbable is in reach, this pull belongs to grab.
        this._grabbing = this._grabInReach(source);
        if (this._grabbing) console.log('teleport: something grabbable is in reach, so that pull is a grab.');
        this._aiming = source;
    }

    _onSelectEnd(source) {
        if (source !== this._aiming) return;
        const go = this._valid && !this._grabbing;
        this._stopAiming();
        if (go) this._moveTo(this._target);
    }

    // A controller put down mid-aim never sends selectend: don't stay stuck aiming.
    _onRemove(source) {
        if (source === this._aiming) this._stopAiming();
    }

    _stopAiming() {
        this._aiming = null;
        this._grabbing = false;
        this._valid = false;
        this._marker.enabled = false;
        this._line.enabled = false;
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

    // Copy the controller's ray into _origin / _direction. The engine reuses
    // its own vectors between calls, so take copies straight away.
    _readRay(source) {
        const origin = source.getOrigin();
        if (!origin) return false;
        this._origin.copy(origin);
        const direction = source.getDirection();
        if (!direction) return false;
        this._direction.copy(direction);
        return true;
    }

    // Where does the ray cross the floor? Puts it in _target.
    // False if it points up or flat, or lands past maxDistance.
    _aimAtFloor() {
        if (this._origin.y <= this.floorHeight) return false;
        if (this._direction.y >= -0.05) return false;

        const distance = (this._origin.y - this.floorHeight) / -this._direction.y;
        this._target.set(
            this._origin.x + this._direction.x * distance,
            this.floorHeight,
            this._origin.z + this._direction.z * distance
        );

        // Measure the jump across the floor, ignoring how high you're holding the controller.
        const dx = this._target.x - this._origin.x;
        const dz = this._target.z - this._origin.z;
        return Math.sqrt(dx * dx + dz * dz) <= this.maxDistance;
    }

    // Stretch the line between two points.
    _placeLine(from, to, material) {
        const length = from.distance(to);
        if (length < 0.001) {
            this._line.enabled = false;
            return;
        }
        this._line.enabled = true;
        this._line.setPosition((from.x + to.x) / 2, (from.y + to.y) / 2, (from.z + to.z) / 2);
        this._line.lookAt(to);
        this._line.setLocalScale(0.006, 0.006, length);
        this._line.render.material = material;
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

    // A hidden shape with no shadows, added to the scene.
    _makeShape(name, type) {
        const entity = new Entity(name);
        entity.addComponent('render', { type, castShadows: false, receiveShadows: false });
        entity.render.material = this._materials.valid;
        entity.enabled = false;
        this.app.root.addChild(entity);
        return entity;
    }

    // A flat colour that ignores the room's lighting and is drawn on top of
    // everything, so a thick floor or a wall can't hide it.
    _makeMaterial(r, g, b) {
        const material = new StandardMaterial();
        material.diffuse = new Color(0, 0, 0);
        material.emissive = new Color(r, g, b);
        material.useLighting = false;
        material.depthTest = false;
        material.depthWrite = false;
        material.blendType = BLEND_NORMAL;
        material.opacity = 0.9;
        material.update();
        return material;
    }
}
