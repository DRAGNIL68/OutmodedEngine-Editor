'use strict';

// rollup src/main.js -o bundle.js -f cjs

    new ModelFormat({
        id: 'my_custom_type',
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
        model_identifier: false,
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

        splines: true,
        
        

        
    });

// index is cube
// this should never be wrong
let scalesXFrom = [];
let scalesZFrom = [];
let scalesXTo = [];
let scalesZTo = [];
const initEdit = (data) => {
    console.log("1");
    scalesXTo = [];
    scalesZTo = [];
    scalesXFrom = [];
    scalesZFrom = [];
    Cube.selected.forEach(cube => {
        scalesXTo.push(cube.to[0]);
        scalesZTo.push(cube.to[2]);
        scalesXFrom.push(cube.from[0]);
        scalesZFrom.push(cube.from[2]);
    });
};
const updateSelection = (data) => {
    console.log("2");
    // if (scalesXTo === null){
    //     console.log("hitbox.ts line 22: scales were not set")
    //     return
    // }   
    Cube.selected.forEach(function (element, index, array) {
        let oldToScalesX = scalesXTo[index];
        let oldToScalesZ = scalesZTo[index];
        let oldFromScalesX = scalesXFrom[index];
        let oldFromScalesZ = scalesZFrom[index];
        let oldScalesX = oldToScalesX - oldFromScalesX;
        let oldScalesZ = oldToScalesZ - oldFromScalesZ;
        // Your development logic here (e.g., modifying properties)
        let newScalesX = element.to[0] - element.from[0];
        let newScalesZ = element.to[2] - element.from[2];
        if (newScalesZ !== oldScalesZ) {
            console.log("z-diff");
            console.log(newScalesZ - oldScalesZ);
            element.to[0] = element.from[0] + newScalesZ;
            element.to[2] = element.from[2] + newScalesZ;
        }
        else if (newScalesX !== oldScalesX) {
            console.log("x-diff");
            console.log(newScalesX - oldScalesX);
            element.to[0] = element.from[0] + newScalesX;
            element.to[2] = element.from[2] + newScalesX;
        }
        // cube.to[0] = cube.from[0] + 4; // X-axis size
        // cube.to[1] = cube.from[1] + 4; // Y-axis size
        // cube.to[2] = cube.from[2] + 4; // Z-axis size
        //console.log(element.size()); 
    });
};

(function () {
    let button;
    BBPlugin.register('bundle', {
        title: 'OutmodedEngine Editor',
        author: 'DRAGNIL68',
        description: 'Adds powerful tools for the OutmodedEngine and its many additions',
        icon: 'star', // Uses Blockbench icon strings or material icons
        version: '1.0.1',
        variant: 'desktop', // Options: 'desktop', 'web', or 'both'
        min_version: '5.0.0',
        tags: ['Minecraft', 'OutmodedEngine'], // Max 3 tags
        onload() {
            console.log("frog");
            Language.addTranslations('en', {
                'format_category.papermc': 'PaperMC'
            });
            button = new Action('randomize_height', {
                name: 'Randomize Height',
                description: 'Randomize the height of all selected elements',
                icon: 'bar_chart',
                click: function () {
                    Undo.initEdit({ elements: Cube.selected });
                    Cube.selected.forEach(cube => {
                        cube.to[1] = cube.from[0] + Math.floor(Math.random() * 8);
                    });
                    Canvas.updateView({
                        elements: Cube.selected,
                        element_aspects: { geometry: true },
                        selection: true
                    });
                    Undo.finishEdit('Randomize cube height');
                }
            });
            Blockbench.on('init_edit', initEdit);
            Blockbench.on('update_selection', updateSelection);
            MenuBar.menus.tools.addAction(button);
        },
        onunload() {
            // Cleans up memory and UI when disabled
            button.delete();
            console.log("My Plugin unloaded.");
            Blockbench.removeListener('init_edit', initEdit);
            Blockbench.removeListener('update_selection', updateSelection);
        }
    });
})();
