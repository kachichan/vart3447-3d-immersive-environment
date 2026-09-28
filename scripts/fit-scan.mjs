import { Script, Vec3, BoundingBox } from 'playcanvas';

/**
 * Puts a scanned object where you dropped it.
 *
 * Works with splat scans (.sog / .ply) and mesh scans (.glb).
 *
 * A scan often arrives with its centre point (pivot) far from the object itself,
 * so the mesh can sit metres away from the entity that holds it — and last week's
 * scripts (proximity, lookAt, grab) all measure from the entity, not from the mesh.
 *
 * Use: make an EMPTY entity (call it Holder), put the scan inside it, attach this
 * to the Holder. When the room starts, the scan is moved so its lowest point sits
 * on the Holder's origin, centred. From then on the Holder IS the object: move it,
 * turn it, put proximity on it.
 */
export class FitScan extends Script {
    static scriptName = 'fitScan';

    /**
     * Height of the object in metres. 0 keeps the size the scan came with — which is
     * real size, if the phone tracked well. Set it only if the scan is obviously wrong.
     * @attribute
     * @type {number}
     * @range [0, 3]
     */
    height = 0;

    /**
     * Sit the lowest point of the scan on the Holder's origin (the floor, if the Holder is at y = 0).
     * @attribute
     * @type {boolean}
     */
    restOnFloor = true;

    /**
     * Centre the scan on the Holder left–right and front–back.
     * @attribute
     * @type {boolean}
     */
    centre = true;

    _done = false;
    _tries = 0;

    initialize() {
        this._fit();
    }

    update() {
        // The mesh may load a few frames after the room starts; keep trying for ~5 s.
        if (this._done) return;
        if (++this._tries > 300) {
            this._done = true;
            console.warn(`fitScan on "${this.entity.name}": no scan found inside it. Is the scan inside the Holder?`);
            return;
        }
        this._fit();
    }

    // World-space box around every mesh inside the Holder, or null if nothing has loaded yet.
    _bounds() {
        let box = null;
        // 'render' is how mesh scans import today; 'model' is the older import (Import Hierarchy off).
        const parts = [...this.entity.findComponents('render'), ...this.entity.findComponents('model')];
        for (const part of parts) {
            for (const mi of part.meshInstances ?? []) {
                if (!box) {
                    box = new BoundingBox();
                    box.copy(mi.aabb);
                } else {
                    box.add(mi.aabb);
                }
            }
        }
        // Splats have no meshes: use the splat's own box, turned into room (world) space.
        for (const gs of this.entity.findComponents('gsplat')) {
            const local = gs.customAabb;
            if (!local) continue;
            const world = new BoundingBox();
            world.setFromTransformedAabb(local, gs.entity.getWorldTransform());
            if (!box) {
                box = world;
            } else {
                box.add(world);
            }
        }
        return box;
    }

    _fit() {
        if (this.entity.children.length === 0) {
            this._done = true;
            console.warn(`fitScan on "${this.entity.name}": put the scan inside this entity, not beside it.`);
            return;
        }

        let box = this._bounds();
        if (!box) return; // not loaded yet — update() will try again

        // 1. Scale, if asked for. Scale the children, not the Holder, so the Holder stays 1:1.
        if (this.height > 0) {
            const current = box.halfExtents.y * 2;
            if (current > 0) {
                const s = this.height / current;
                for (const child of this.entity.children) {
                    const ls = child.getLocalScale();
                    child.setLocalScale(ls.x * s, ls.y * s, ls.z * s);
                }
                box = this._bounds();
            }
        }

        // 2. Move the children so the box's bottom-centre lands on the Holder's origin.
        const origin = this.entity.getPosition();
        const bottom = new Vec3(box.center.x, box.center.y - box.halfExtents.y, box.center.z);
        const shiftWorld = new Vec3(
            this.centre ? origin.x - bottom.x : 0,
            this.restOnFloor ? origin.y - bottom.y : 0,
            this.centre ? origin.z - bottom.z : 0
        );

        // The Holder may be turned or scaled, so express that shift in the Holder's own space.
        const toLocal = this.entity.getWorldTransform().clone().invert();
        const shiftLocal = toLocal.transformVector(shiftWorld, new Vec3());

        for (const child of this.entity.children) {
            child.setLocalPosition(child.getLocalPosition().add(shiftLocal));
        }

        this._done = true;
        // Height is the number to check against a tape measure. Footprint is measured
        // along the room's axes, so it grows a little if the Holder is turned.
        const size = box.halfExtents.clone().mulScalar(2);
        console.log(`fitScan: "${this.entity.name}" is ${size.y.toFixed(2)} m tall (footprint ${size.x.toFixed(2)} × ${size.z.toFixed(2)} m).`);
    }
}
