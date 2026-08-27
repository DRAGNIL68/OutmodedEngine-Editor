import { customFormat } from "./ModelFormat";
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
