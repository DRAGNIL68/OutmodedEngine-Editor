// rollup src/main.js -o bundle.js -f cjs

    export const customFormat = new ModelFormat({
        id: 'my_custom_type',
        name: 'Outmoded Model',
        description: 'A brand new custom model type for Blockbench',
        icon: 'star', // Material Icon or custom SVG
        category: 'minecraft',
        target: 'My Application / Game',
        bone_rig: true, // Enable if your format uses hierarchical bones/groups
        box_uv: true,   // Enable if it uses standard box UV mapping
        cardinal_rotations: true,
        animation_mode: true,
        locators: true,
        // Add export, import, and parsing functions here
        parse(file_content, path) {
            // Code to load/parse your custom file format
        },
        export() {
            // Code to serialize model data into your custom file format
        }
    });