import { customFormat } from "./format/ModelFormat.js";

import { finishEdit } from "./features/Hitbox.ts";
import { initEdit } from "./features/Hitbox.ts";
import { updateSelection } from "./features/Hitbox.ts";
import clearHitboxCache from "./features/Hitbox.ts"

import { exportCodec } from "./format/Codecs.ts";
import { UiRegister } from "./ui/UiRegister.ts";
import { Variant, VariantManager } from "./features/variants/VariantManager.ts";


(function() {

    let action1 = new Action("export_outmoded_template", {
        name: "Export Outmoded Template",
        icon: "archive",
        description: "Export this model as a template",
        category: "file",
        condition: () => Format.id === 'outmoded_template',
        click: function () {
            exportCodec.export();
        },
    })
    MenuBar.addAction(action1,'file.export');

    

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

            Blockbench.on('init_edit', initEdit)
            Blockbench.on('finish_edit', finishEdit) // this does the same thing
            Blockbench.on('update_selection', updateSelection)

            //let prop = new Property(OutlinerElement, "string", "frog", {exposed: true, default: "frog", options: {}})
    
            new Property(ModelProject, "string", "credit", {
                condition: () => Format.id === "outmoded_template",
                exposed: true, default: "Made with BlockBench", 
                label: "Credit"})

            new Property(ModelProject, "string", "namespacedId", {
                condition: () => Format.id === "outmoded_template",
                exposed: true, 
                default: "", 
                label: "NamespacedId (optional)"})



            console.log("loading outmoded editor")
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
