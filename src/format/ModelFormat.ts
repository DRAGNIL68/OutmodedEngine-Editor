// rollup src/main.js -o bundle.js -f cjs

    export const customFormat = new ModelFormat("outmoded_template", {
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
    

    