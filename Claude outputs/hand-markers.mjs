import { Script, Entity, Asset, StandardMaterial, Color, Vec3, BLEND_NORMAL } from 'playcanvas';

// The official WebXR controller models: one folder per kind of controller.
const MODEL_LIBRARY = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles';

/**
 * Shows your controllers and hands, so you can see what you're reaching for.
 *
 * Attach once per scene, to the Rig (or any entity). In the headset each
 * controller appears as a 3D model of itself; each tracked hand gets a
 * dot on the tip of its index finger.
 *
 * Every controller also has a dot, drawn through everything so you can
 * always see it. The dot is exactly the point `grab` measures from. On a
 * controller it sits in the handle, where your palm is — not at the
 * front. To pick something up, put your palm on it.
 *
 * The dot changes colour:
 *   white  — nothing to grab here
 *   yellow — close enough: pull the trigger (or pinch) now
 *   green  — you're holding something
 *
 * The controller models download from the internet the first time. To
 * avoid that, upload left.glb and right.glb into the project and drop
 * them into the two Controller slots.
 *
 * Does nothing in the Launch window: there are no hands there.
 */
export class HandMarkers extends Script {
    static scriptName = 'handMarkers';

    /**
     * Size of the dot, in metres.
     * @attribute
     * @type {number}
     * @range [0.01, 0.08]
     */
    dotSize = 0.03;

    /**
     * Length of the stick shown on a controller while its model loads, in
     * metres. 0 = no stick.
     * @attribute
     * @type {number}
     * @range [0, 0.3]
     */
    stickLength = 0.12;

    /**
     * Show a 3D model of each controller in your hand.
     * @attribute
     * @type {boolean}
     */
    showControllers = true;

    /**
     * Optional. The left controller model (left.glb), uploaded into this
     * project. Empty = download it.
     * @attribute
     * @type {Asset}
     * @resource container
     */
    leftController = null;

    /**
     * Optional. The right controller model (right.glb), uploaded into this
     * project. Empty = download it.
     * @attribute
     * @type {Asset}
     * @resource container
     */
    rightController = null;

    initialize() {
        this._markers = new Map();   // input source -> { root, dot, stick, state }
        this._models = new Map();    // which model -> Promise of the loaded model (or null)
        this._grabbables = [];       // entities that have a grab script
        this._point = new Vec3();    // scratch: where the hand is this frame

        this._materials = {
            idle: this._makeMaterial(0.85, 0.85, 0.85),
            near: this._makeMaterial(1, 0.8, 0.1),
            holding: this._makeMaterial(0.2, 1, 0.4)
        };

        const xr = this.app.xr;
        if (!xr || !xr.input) {
            console.warn('handMarkers: no XR available. Markers only appear in a headset.');
            return;
        }

        xr.input.on('add', this._onAdd, this);
        xr.input.on('remove', this._onRemove, this);
        xr.on('start', this._findGrabbables, this);
        this._findGrabbables();

        this.on('destroy', () => {
            xr.input.off('add', this._onAdd, this);
            xr.input.off('remove', this._onRemove, this);
            xr.off('start', this._findGrabbables, this);
            for (const marker of this._markers.values()) marker.root.destroy();
            this._markers.clear();
            for (const material of Object.values(this._materials)) material.destroy();
        });
    }

    update() {
        for (const [source, marker] of this._markers) {
            // Where is this hand right now? Hide the marker if it isn't tracked.
            if (!this._handPoint(source)) {
                marker.root.enabled = false;
                continue;
            }
            marker.root.enabled = true;
            marker.root.setPosition(this._point);
            if (source.grip) marker.root.setRotation(source.getRotation());

            // Pick the colour: holding beats near, near beats idle.
            let state = 'idle';
            for (const entity of this._grabbables) {
                const grab = entity.script && entity.script.get('grab');
                if (!grab || !entity.enabled) continue;
                if (grab._holder === source) {
                    state = 'holding';
                    break;
                }
                if (this._point.distance(entity.getPosition()) <= grab.radius) {
                    state = 'near';
                }
            }
            if (state !== marker.state) {
                marker.state = state;
                marker.dot.render.material = this._materials[state];
            }
        }
    }

    // A controller or hand has appeared: build its marker.
    // Every source gets one. Don't check `grip` here: a controller only reports
    // `grip` after its first tracked frame, so at this moment it is still false.
    // Anything that never gets a position (e.g. a gaze pointer) stays hidden in update().
    _onAdd(source) {
        const root = new Entity('hand-marker');

        const dot = new Entity('dot');
        dot.addComponent('render', { type: 'sphere', castShadows: false, receiveShadows: false });
        dot.render.material = this._materials.idle;
        dot.setLocalScale(this.dotSize, this.dotSize, this.dotSize);
        root.addChild(dot);

        // Controllers get a stick pointing forward until their model arrives.
        let stick = null;
        if (!source.hand && this.stickLength > 0) {
            stick = new Entity('stick');
            stick.addComponent('render', { type: 'box', castShadows: false, receiveShadows: false });
            stick.render.material = this._materials.idle;
            stick.setLocalScale(0.008, 0.008, this.stickLength);
            stick.setLocalPosition(0, 0, -this.stickLength / 2); // forward is -Z
            root.addChild(stick);
        }

        this.app.root.addChild(root);
        this._markers.set(source, { root, dot, stick, state: 'idle' });

        if (!source.hand && this.showControllers) this._attachModel(source);
    }

    // A controller or hand has gone (put down, or switched to hands): remove its marker.
    _onRemove(source) {
        const marker = this._markers.get(source);
        if (!marker) return;
        marker.root.destroy();
        this._markers.delete(source);
    }

    // Put a 3D model of the controller into its marker, once the model has loaded.
    async _attachModel(source) {
        const model = await this._controllerModel(source);
        const marker = this._markers.get(source);
        if (!model || !marker) return; // no model, or the controller went away while it loaded

        const entity = model.instantiateRenderEntity();
        for (const render of entity.findComponents('render')) render.castShadows = false;
        marker.root.addChild(entity);
        if (marker.stick) marker.stick.enabled = false; // the model shows which way it points
    }

    // The model for this controller: the uploaded one if there is one, otherwise download it.
    // Each model loads once, however many times the controller disappears and comes back.
    _controllerModel(source) {
        const side = source.handedness === 'left' || source.handedness === 'right' ? source.handedness : 'none';
        const uploaded = side === 'left' ? this.leftController : side === 'right' ? this.rightController : null;
        const key = uploaded ? `asset ${uploaded.id}` : `web ${source.profiles.join(' ')} ${side}`;

        if (!this._models.has(key)) {
            this._models.set(key, uploaded ? this._loadAsset(uploaded) : this._download(source.profiles, side));
        }
        return this._models.get(key);
    }

    // Load a model that was uploaded into the project.
    _loadAsset(asset) {
        return new Promise((resolve) => {
            asset.once('error', () => resolve(null));
            asset.ready(loaded => resolve(loaded.resource));
            this.app.assets.load(asset);
        });
    }

    // Download a model from the WebXR library. The headset lists what kind of
    // controller it has, most exact first ('meta-quest-touch-plus' on a Quest 3);
    // try each in turn, then a generic controller.
    async _download(profiles, side) {
        for (const profile of [...profiles, 'generic-trigger-squeeze-thumbstick']) {
            try {
                const response = await fetch(`${MODEL_LIBRARY}/${profile}/profile.json`);
                if (!response.ok) continue;
                const layout = (await response.json()).layouts[side];
                if (!layout || !layout.assetPath) continue;
                const model = await this._loadUrl(`${MODEL_LIBRARY}/${profile}/${layout.assetPath}`);
                if (model) return model;
            } catch (err) {
                // Offline, or the network blocks it: try the next one.
            }
        }
        console.warn('handMarkers: could not download a controller model. Showing the dot only.');
        return null;
    }

    _loadUrl(url) {
        return new Promise((resolve) => {
            this.app.assets.loadFromUrl(url, 'container', (err, asset) => resolve(err ? null : asset.resource));
        });
    }

    // Everything in the scene with a grab script on it.
    _findGrabbables() {
        this._grabbables = this.app.root.find(e => e.script && e.script.has('grab'));
    }

    // Put the hand's position into _point, using the same point grab uses.
    // Returns false if the hand isn't being tracked right now.
    _handPoint(source) {
        if (source.hand) {
            if (!source.hand.tracking) return false;
            const joint = source.hand.getJointById('index-finger-tip') || source.hand.wrist;
            if (!joint) return false;
            this._point.copy(joint.getPosition());
            return true;
        }
        const position = source.getPosition();
        if (!position) return false;
        this._point.copy(position);
        return true;
    }

    // A flat colour that ignores the room's lighting and is drawn on top of
    // everything, so the dot shows through the controller model and the box.
    _makeMaterial(r, g, b) {
        const material = new StandardMaterial();
        material.diffuse = new Color(0, 0, 0);
        material.emissive = new Color(r, g, b);
        material.useLighting = false;
        material.depthTest = false;         // don't hide it behind anything...
        material.depthWrite = false;
        material.blendType = BLEND_NORMAL;  // ...and draw it after everything solid
        material.opacity = 0.9;
        material.update();
        return material;
    }
}
