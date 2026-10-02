(function () {
    'use strict';

    // rollup src/main.js -o bundle.js -f cjs
    new ModelFormat("outmoded_template", {
        id: 'outmoded_template',
        name: 'Outmoded Template',
        description: 'Model Templates for OutmodedEngine',
        icon: 'star', // Material Icon or custom SVG
        category: 'papermc',
        target: 'OutmodedEngine/Animated-Skript',
        animated_textures: true,
        animation_files: true,
        texture_mcmeta: true, // "Enable mcmeta files for animated texture files" i would imagine this generates mcmeta files?
        animation_mode: true,
        bone_binding_expression: true, // bindings?
        bone_rig: true,
        box_uv: false, // i hate box uvs
        centered_grid: true, // this is just logical
        display_mode: false,
        edit_mode: true,
        integer_size: false,
        java_face_properties: true,
        locators: true,
        meshes: false,
        model_identifier: false, // this needs turing on at some point 
        optional_box_uv: true,
        paint_mode: true,
        parent_model_id: false,
        pose_mode: false,
        render_sides: 'front',
        rotate_cubes: true,
        rotation_limit: false,
        select_texture_for_particles: false,
        single_texture: false, // this is just stupid
        texture_folder: false, // dont think java supports this
        texture_meshes: false, // dont think java supports this
        bounding_boxes: true, // Enable bounding box elements. NOTE: they do not work quite as normal hitboxes do
        uv_rotation: true, // Allows cube UVs to be rotated
        vertex_color_ambient_occlusion: true, // Adds a toggle in the project settings to enable project wide vertex color ambient occlusion
        java_cube_shading_properties: true, // Enables properties for Minecraft Java block/item models related to block shading (shading option and light emission value)
        box_uv_float_size: false, // If true, cube sizes will not be floored to calculate UV sizes with box UV. This can result in UVs not aligning with pixel edges
        cullfaces: true, // Enables cullfaces, the ability on faces in Minecraft block models to set a direction, that, if covered by another block, will cause the face to unrender
        rotation_snap: false
    });

    const cubeCache = new Map();
    function updateCache() {
        console.log("Update Cache");
        cubeCache.clear();
        BoundingBox.selected.forEach((cube) => {
            cubeCache.set(cube.uuid, cube.getUndoCopy());
        });
    }
    const initEdit = () => {
        if (runLock) {
            console.log("isLOCKED");
            return;
        }
        updateCache();
    };
    const finishEdit = () => {
        if (runLock) {
            console.log("isLOCKED");
            return;
        }
        cubeCache.clear();
    };
    let runLock = false; // locks the code from recursively calling itself
    const updateSelection = () => {
        applyEdit();
    };
    function applyEdit() {
        if (runLock) {
            console.log("isLOCKED");
            return;
        }
        let renderUpdate = false; // used as a way to redraw the cubes
        if (BoundingBox.selected.length == 0) {
            return;
        }
        BoundingBox.selected.forEach((newCube) => {
            if (!(newCube instanceof BoundingBox)) {
                return;
            } // why do i need this????
            if (!cubeCache.has(newCube.uuid)) {
                return;
            }
            const oldCube = cubeCache.get(newCube.uuid);
            if (oldCube === undefined) {
                return;
            }
            oldCube.to[0] - oldCube.from[0]; // old diff
            let oldScalesZ = oldCube.to[2] - oldCube.from[2];
            newCube.to[0] - newCube.from[0]; // this is besically the with
            let newScalesZ = newCube.to[2] - newCube.from[2];
            if (newScalesZ !== oldScalesZ) {
                {
                    console.log("old");
                    console.log("from.x", oldCube.from[0], "to.x", oldCube.to[0]);
                    console.log("from.z", oldCube.from[2], "to.z", oldCube.to[2]);
                }
                // locks code to resize
                runLock = true;
                runLock = false; // unlock
                {
                    console.log("new");
                    console.log("from.x", newCube.from[0], "to.x", newCube.to[0]);
                    console.log("from.z", newCube.from[2], "to.z", newCube.to[2]);
                }
                renderUpdate = true; //redraw call
            }
        });
        if (renderUpdate) {
            runLock = true;
            { // runlock
                Canvas.updateView({
                    elements: BoundingBox.selected,
                    element_aspects: { geometry: true },
                    selection: true
                });
            }
            runLock = false;
        }
    }

    const CodecUtils = class CodecUtils {
        static groupFlatten() {
            let cubeMap = new Map();
            Cube.all.forEach((cube) => {
                let pr = cube.parent;
                if (!(pr instanceof Group)) {
                    return;
                }
                let cubes = [];
                if (cubeMap.has(pr.uuid)) {
                    cubes = cubeMap.get(pr.uuid);
                    cubes.push(cube.getUndoCopy());
                }
                else {
                    cubes = [cube.getUndoCopy()];
                }
                cubeMap.set(pr.uuid, cubes);
            });
            return cubeMap;
        }
    };

    // i need to add interfaces so this code does not become unreadable
    const VariantTools = class VariantTools {
        static namespace = "outmoded_engine";
        static generateVariantData(variantId, textureMap) {
            let variant = {
                name: variantId, // name/id of variant
                textureMap: textureMap, // stores what textures map to what
                rp_data: {}
            };
            let groupCubeMap = CodecUtils.groupFlatten();
            let resourceMap = new Map();
            groupCubeMap.forEach((cubes, key) => {
                resourceMap.set(key, VariantTools.generateGroupFile(cubes)); // maps group uuid as file name to model data
            });
            variant.rp_data = Object.fromEntries(resourceMap);
            return variant;
        }
        static generateGroupFile(cubes) {
            let textureMap = new Map(); // id : texture name
            let file = {
                format_version: "1.21.11",
                texture_size: [-1, -1],
                textures: {}, // map
                elements: [] // I think this is bad
            };
            cubes.forEach(cube => {
                if (cube == null) {
                    return;
                }
                let faces = new Map();
                for (const [face, data] of Object.entries(cube.faces)) {
                    let txt = data.getTexture();
                    if (txt instanceof Texture) {
                        textureMap.set(txt.id, VariantTools.namespace + ":" + txt.name);
                        faces.set(face, {
                            uv: data.uv,
                            texture: "#" + txt.id
                        });
                    }
                }
                let cubeData = {
                    from: [cube.from[0], cube.from[1], cube.from[2]],
                    to: [cube.to[0], cube.to[1], cube.to[2]],
                    rotation: { "x": cube.rotation[0], "y": cube.rotation[1], "z": cube.rotation[2], "origin": [cube.origin[0], cube.origin[1], cube.origin[2]] },
                    faces: Object.fromEntries(faces)
                };
                file.textures = Object.fromEntries(textureMap);
                file.elements.push(cubeData);
            });
            return file;
        }
        static generateResourcePack() {
            let groupCubeMap = CodecUtils.groupFlatten();
            let resourceMap = new Map();
            let textureMap = new Map(); // id : texture name
            groupCubeMap.forEach((cubes, key) => {
                let file = {
                    format_version: "1.21.11",
                    texture_size: [-1, -1],
                    textures: {}, // map
                    data: {
                        elements: [] // I think this is bad
                    }
                };
                cubes.forEach(cube => {
                    if (cube == null) {
                        return;
                    }
                    let faces = new Map();
                    for (const [face, data] of Object.entries(cube.faces)) {
                        let txt = data.getTexture();
                        if (txt instanceof Texture) {
                            textureMap.set(txt.id, txt.name);
                            faces.set(face, {
                                uv: data.uv,
                                texture: "#" + txt.id
                            });
                        }
                    }
                    let cubeData = {
                        from: [cube.from[0], cube.from[1], cube.from[2]],
                        to: [cube.to[0], cube.to[1], cube.to[2]],
                        rotation: { "x": cube.rotation[0], "y": cube.rotation[1], "z": cube.rotation[2], "origin": [cube.origin[0], cube.origin[1], cube.origin[2]] },
                        faces: Object.fromEntries(faces)
                    };
                    file.textures = Object.fromEntries(textureMap);
                    file.data.elements.push(cubeData);
                });
                resourceMap.set(key, file); // maps group uuid as file name to model data
            });
            return resourceMap;
        }
        static getAllTexturesBase64() {
            let result = new Map();
            Texture.all.forEach((texture) => {
                result.set(texture.name, texture.getBase64());
            });
            return result;
        }
    };

    const exportCodec = new Codec('outmoded_template_codec', {
        name: 'Outmoded Template',
        extension: 'json',
        remember: true,
        compile() {
            console.log("compiling cubes");
            let nodeStructure = new Map();
            CodecUtils.groupFlatten();
            console.log("map", CodecUtils.groupFlatten());
            for (const group of Group.all) { // replace this with groups 
                let data = {
                    type: "group",
                    name: group.name,
                    transform: {
                        position: group.origin,
                        left_rotation: group.rotation,
                        scale: [1, 1, 1] // temp
                    },
                    properties: {},
                    user_properties: {} // this stores user defined data
                };
                nodeStructure.set(group.uuid, data);
            }
            for (const boundingBox of BoundingBox.all) {
                if (!(boundingBox instanceof BoundingBox)) {
                    return;
                }
                let data = {
                    type: "bounding_box",
                    name: boundingBox.name,
                    transform: {
                        position: boundingBox.origin,
                        left_rotation: [0, 0, 0], // this is not really needed
                        scale: boundingBox.size()
                    },
                    properties: {},
                    user_properties: {} // this stores user defined data
                };
                nodeStructure.set(boundingBox.uuid, data);
            }
            let variants = new Map();
            variants.set("default", {
                name: "default", // name/id of variant
                textures: {}, // stores the uuids of the textures used
                excluded_nodes: {} // stores nodes that will not get updated
            });
            console.log("credit", Project.credit);
            console.log("namesapcedid", Project.namespacedId);
            let data = {
                options: {
                    namespacedId: Project.namespacedId,
                    credit: Project.credit,
                    user_properties: {} // another place to put data
                },
                textures: Object.fromEntries(VariantTools.getAllTexturesBase64()),
                structure: Object.fromEntries(nodeStructure),
                animations: "data",
                texture_variants: VariantTools.generateVariantData("default", {}),
            };
            console.log("test", Project.uuid);
            return JSON.stringify(data, null, 4);
        }
    });

    // i am not making data private. 
    // If you change values you are intentionally trying to break my code
    class VariantManager {
        static variantNum = 0;
        static variantHolderMap = new Map();
        static bindEvents() {
            console.log("binding events");
            Blockbench.on('save_project', (data) => {
                Project.uuid;
                console.log("bind save project");
            });
            Blockbench.on('load_project', (data) => {
                Project.uuid;
                console.log("bind load project");
            });
            Blockbench.on('select_project', (data) => {
                VariantManager.getVariantHolder();
                // this triggers the default variant to be created
                // but only for Outmoded Templates
            });
        }
        static loadVariantHolder(project, json) {
            this.variantHolderMap.set(project, new VariantHolder("uuid"));
        }
        static removeVariantHolder(project) {
            this.variantHolderMap.delete(project);
        }
        /**
         * uses the current open project
         * @returns VariantHolder | undefined
         */
        static getVariantHolder() {
            let uuid = Project.uuid;
            if (Project.format === undefined)
                return undefined; // this happens when there is no project (main menu)
            // checks if its the correct format (outmoded_template)
            if (Project.format.id !== "outmoded_template") {
                return undefined;
            }
            // creates the variant holder for the current project
            if (!this.variantHolderMap.has(uuid)) {
                // adds default variant
                let variantHolder = new VariantHolder(uuid);
                let variant = new Variant();
                variant.isDefault = true;
                variant.generateCubeUvMap();
                variantHolder.variantMap.set("default", variant);
                this.variantHolderMap.set(uuid, variantHolder);
            }
            return this.variantHolderMap.get(uuid);
        }
    }
    // no this entire file is terrible
    class VariantHolder {
        project;
        variantNum = 0;
        currentVariant = "default";
        variantMap = new Map();
        constructor(project) {
            this.project = project;
            let variant = new Variant();
            Cube.all.forEach((cube) => {
            });
            this.variantMap.set("default", variant);
        }
        getProject() { return this.project; }
        toJson() {
            return "";
        }
        fromJson(json) {
        }
    }
    class Variant {
        isDefault = false;
        defaultMap = new Map();
        textureMap = new Map(); // texture : texture
        excludedGroupMap = new Set;
        getTextureMap() {
            return this.textureMap;
        }
        getExcludedGroupMap() {
            return this.excludedGroupMap;
        }
        generateCubeUvMap() {
            if (this.isDefault === false)
                console.warn("non default variant generated CubeUvMap");
            Cube.all.forEach((cube) => {
                ({
                    north: cube.faces["north"].getTexture(),
                    east: cube.faces["north"].getTexture(),
                    south: cube.faces["north"].getTexture(),
                    west: cube.faces["north"].getTexture(),
                    up: cube.faces["north"].getTexture(),
                    down: cube.faces["north"].getTexture(),
                });
            });
        }
    }

    class VariantDialogOptionsUtil {
        static getGroups() {
            let html = $('.select-options');
            html.empty();
            CodecUtils.groupFlatten().forEach((value, string) => {
                html.append(`
            </div>
                <div class="option"> 
                <input type="checkbox" name="${value}" id="option4" />
                <label for="option4">Option 1</label>
            </div>
                `);
            });
        }
    }
    const variantOptionsDialog = new Dialog({
        id: 'test1',
        title: 'Texture Variant Options',
        width: 600,
        onOpen() {
            variantOptionsDialog.object.innerHTML = `
        <div>
            <h1 style="font-size: 20px;">Texture variant options</h1>

            <h1 style="font-size: 20px;">variant id</h1>
            <input width: 100%; type="text"; id="fname"; name="fname;">
        </div>

        <div class="select-list">
            <div class="title">Configure Table</div>
            <div class="select-options">
        </div>

        <div>
            <button>confirm</button>
            <button>cancel</button>
        </div>
        
        
        `;
        },
        onConfirm(formResult, event) {
            //const initialData = this.component.id
            console.log(this.component);
        },
    });

    //TODO: the most of the css and html is written with ai
    // i am sorry but i am no web dev
    // yes the typescript is human code
    class VariantPanel {
        rebuildPanel() {
            $('.button-panel').empty(); // clear all elements
            let variantHolder = VariantManager.getVariantHolder();
            if (variantHolder === undefined)
                return; // this should never happen
            let panel = $('.button-panel');
            variantHolder.variantMap.forEach((data, key) => {
                panel.append(`<div style="margin-top: 5px; margin-bottom: 5px; display: flex; flex-direction: row; height: 30px; border-style: solid; border-width: thin; background-color: black; align-items: center; ">
                        <h1 style="font-size: 15px; margin: 0; padding-left: 8px;">${key}</h1>
                        <i class="icon material-icons" style="color: #ffcc00;">star</i>
                        <button class="variant_edit"; id="${key}"; style="margin-left: auto !important; margin-right: 0 !important; font-size: 15px; background: none; border: none; font-family: inherit; color: inherit; cursor: pointer; outline: none; padding: 0; height: 100%;display: inline-flex; align-items: center; justify-content: center;">edit</button>
                        <button class="variant_select"; id="${key}"; style="margin-left: auto !important; margin-right: 0 !important; font-size: 15px; background: none; border: none; font-family: inherit; color: inherit; cursor: pointer; outline: none; padding: 0; height: 100%;display: inline-flex; align-items: center; justify-content: center;">select</button>
                        <button class="variant_delete"; id="${key}"
                            style=" margin-right: 0 !important; font-size: 15px; background: none; border: none; font-family: inherit; color: inherit; cursor: pointer; outline: none; padding: 0; height: 100%; display: inline-flex; align-items: center; justify-content: center;"
                            onmouseover="document.getElementById('icon_${key}').style.color='#d3d3d3'"
                            onmouseout="document.getElementById('icon_${key}').style.color='#808080'">
                            <i id="icon_${key}" class="icon material-icons" style="transition: color 0.2s; color: #808080">delete</i>
                        </button>
                    </div>`);
            });
        }
        register() {
            const myCustomPanel = new Panel('texture_variants', {
                name: 'Texture Variants',
                icon: 'star',
                condition: () => Format.id === "outmoded_template",
                menu: [
                    new Action('panel_refresh_btn', {
                        name: 'Refresh Panel Data',
                        icon: 'refresh',
                        click: function () {
                        }
                    })
                ],
            });
            myCustomPanel.node.innerHTML = `
                <div class="variant-panel" style="height: auto; max-height: 150px; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden;">
                    
                    <button class="add_button" id="add_button";
                        style="margin-left: auto !important; margin-right: 0 !important; font-size: 15px; background: none; border: none; font-family: inherit; color: inherit; cursor: pointer; outline: none; padding: 0; height: 100%; width: 50px; display: inline-flex; align-items: center; justify-content: center;"
                        onmouseover="document.getElementById('btn-icon').style.color='#d3d3d3'"
                        onmouseout="document.getElementById('btn-icon').style.color='#808080'">
                        <i id="btn-icon" class="icon material-icons" style="transition: color 0.2s; color: #808080">add</i>
                    </button>

                    <div class="button-panel";</div>

                </div>
            `;
            $('.add_button').on('click', () => {
                let variantHolder = VariantManager.getVariantHolder();
                if (variantHolder === undefined)
                    return; // this should never happen
                let variantNum = VariantManager.variantNum;
                VariantManager.variantNum = VariantManager.variantNum + 1;
                let variantId = "variant_" + variantNum;
                variantHolder.variantMap.set(variantId, new Variant());
                this.rebuildPanel(); // reloads html
            });
            $('.button-panel').on('click', '.variant_delete', (event) => {
                let buttonId = $(event.currentTarget).attr('id');
                if (typeof buttonId !== "string") {
                    console.log("data", buttonId);
                    return;
                }
                let variantHolder = VariantManager.getVariantHolder();
                if (variantHolder === undefined)
                    return; // this should never happen
                if (buttonId === "default") {
                    Blockbench.showQuickMessage('Cannot delete default variant', 1000);
                    return;
                }
                variantHolder.variantMap.delete(buttonId);
                this.rebuildPanel();
            });
            $('.button-panel').on('click', '.variant_edit', (event) => {
                let buttonId = $(event.currentTarget).attr('id');
                if (buttonId === "default") {
                    Blockbench.showQuickMessage('Cannot edit default variant', 1000);
                    return;
                }
                variantOptionsDialog.show();
                VariantDialogOptionsUtil.getGroups(); // adds to menu
                console.log("adadada3333");
            });
            $('.button-panel').on('click', '.variant_select', (event) => {
                let buttonId = $(event.currentTarget).attr('id');
                Blockbench.showQuickMessage('Texture variant ' + buttonId + ' selected', 1000);
                //VariantManager.
            });
            Blockbench.on('select_project', (event) => {
                console.log("switich project, reloading variants... uuid", event.project.uuid);
                this.rebuildPanel();
            });
        }
        unregister() {
        }
    }

    const UiRegister = class UiRegister {
        static register() {
            new VariantPanel().register();
        }
    };

    (function () {
        let action1 = new Action("export_outmoded_template", {
            name: "Export Outmoded Template",
            icon: "archive",
            description: "Export this model as a template",
            category: "file",
            condition: () => Format.id === 'outmoded_template',
            click: function () {
                exportCodec.export();
            },
        });
        MenuBar.addAction(action1, 'file.export');
        BBPlugin.register('bundle', {
            title: 'OutmodedEngine Editor',
            author: 'DRAGNIL68',
            description: 'powerful tools for the OutmodedEngine',
            icon: 'star',
            version: '1.0.0',
            variant: 'desktop', // Options: 'desktop', 'web', or 'both'
            min_version: '5.0.0',
            tags: ['Minecraft', 'OutmodedEngine'], // Max 3 tags
            onload() {
                console.log("frog");
                Language.addTranslations('en', {
                    'format_category.papermc': 'PaperMC',
                    'dialog.project.geoname': 'Namespaced Id'
                });
                Blockbench.on('init_edit', initEdit);
                Blockbench.on('finish_edit', finishEdit); // this does the same thing
                Blockbench.on('update_selection', updateSelection);
                //let prop = new Property(OutlinerElement, "string", "frog", {exposed: true, default: "frog", options: {}})
                new Property(ModelProject, "string", "credit", {
                    condition: () => Format.id === "outmoded_template",
                    exposed: true, default: "Made with BlockBench",
                    label: "Credit"
                });
                new Property(ModelProject, "string", "namespacedId", {
                    condition: () => Format.id === "outmoded_template",
                    exposed: true,
                    default: "",
                    label: "NamespacedId (optional)"
                });
                console.log("loading outmoded editor");
                VariantManager.bindEvents();
                UiRegister.register(); // registers ui
            },
            onunload() {
                // Cleans up memory and UI when disabled
                console.log("My Plugin unloaded.");
                Blockbench.removeListener('init_edit', initEdit);
                Blockbench.removeListener('finish_edit', finishEdit);
                Blockbench.removeListener('update_selection', updateSelection);
            }
        });
    })();

})();
