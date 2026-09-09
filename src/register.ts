import { customFormat } from "./ModelFormat.js";


import { initEdit } from "./hitbox.ts";
import { updateSelection } from "./hitbox.ts";


(function() {
    let button: Action;


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

                click: function() {
                    Undo.initEdit({elements: Cube.selected});
                    Cube.selected.forEach(cube => {
                        cube.to[1] = cube.from[0] + Math.floor(Math.random()*8);
                    });
                    Canvas.updateView({
                        elements: Cube.selected,
                        element_aspects: {geometry: true},
                        selection: true
                    });
                    Undo.finishEdit('Randomize cube height');
                }
            });



            Blockbench.on('init_edit', initEdit);

            Blockbench.on('update_selection', updateSelection)

            MenuBar.menus.tools.addAction(button);
        },

        onunload() {
            // Cleans up memory and UI when disabled
            button.delete();
            console.log("My Plugin unloaded.");
            Blockbench.removeListener('init_edit', initEdit)
            Blockbench.removeListener('update_selection', updateSelection)
        }
    }); 
})();
