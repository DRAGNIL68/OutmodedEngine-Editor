'use strict';

// rollup src/main.js -o bundle.js -f cjs

    new ModelFormat({
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

(function() {
    let my_action;


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
            // This gets automatically applied by Blockbench, we don't need to do anything with it
    },

        onunload() {
            // Cleans up memory and UI when disabled
            my_action.delete();
            console.log("My Plugin unloaded.");
        }
    });
})();
