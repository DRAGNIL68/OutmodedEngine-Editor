import type { UiInterface } from "../../ui/UiInterface";
import { Variant, VariantHolder, VariantManager } from "./VariantManager";
import {VariantDialogOptionsUtil, variantOptionsDialog } from "./VariantOptionsDialog";



//TODO: the most of the css and html is written with ai
// i am sorry but i am no web dev
// yes the typescript is human code


export class VariantPanel implements UiInterface{


    public rebuildPanel(){

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
                    </div>`)
        })

    }

    public register(): void {
        
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
                VariantManager.variantNum = VariantManager.variantNum+1;

                let variantId = "variant_"+variantNum;

                variantHolder.variantMap.set(variantId, new Variant())

                this.rebuildPanel(); // reloads html
                
            })

            $('.button-panel').on('click', '.variant_delete', (event) => {
                let buttonId = $(event.currentTarget).attr('id');

                if (typeof buttonId !== "string") {
                    console.log("data", buttonId)
                    return;

                }

                let variantHolder = VariantManager.getVariantHolder();

                if (variantHolder === undefined)
                    return; // this should never happen
                
                if (buttonId === "default"){
                    Blockbench.showQuickMessage('Cannot delete default variant', 1000);
                    return;
                }

                variantHolder.variantMap.delete(buttonId);

                this.rebuildPanel();
            })

            $('.button-panel').on('click', '.variant_edit', (event) => {
                let buttonId = $(event.currentTarget).attr('id'); 

                if (buttonId === "default"){
                    Blockbench.showQuickMessage('Cannot edit default variant', 1000);
                    return;
                }
                    

                variantOptionsDialog.show();
                
                VariantDialogOptionsUtil.getGroups(); // adds to menu
            })

            $('.button-panel').on('click', '.variant_select', (event) => {
                let buttonId = $(event.currentTarget).attr('id');
                Blockbench.showQuickMessage('Texture variant '+buttonId+' selected', 1000);
                //VariantManager.

            })


            Blockbench.on('select_project', (event) => {
                console.log("switich project, reloading variants... uuid", event.project.uuid)
                this.rebuildPanel();
            })

            

    }

    public unregister(): void {
        
    }


}