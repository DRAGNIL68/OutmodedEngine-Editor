import { Variant, VariantHolder, VariantManager } from "./VariantManager";
import { VariantPanel } from "./VariantPanel";

export class VariantOptionsDialog {

    static textureMap = new Map<string, string>();
    static counter = "1";
    static createTextureMapHTML(){
        
        $('#texture_map_container').empty(); // clear all elements

        let panel = $('#texture_map_container');

        // from -> to
        // textures will always include .png
        //TODO: add check to stop players from
        this.textureMap.forEach( (toFrom, uuid) => {
            let sFrom = "";
            let sTo = "";
            if (toFrom !== " "){

                let split = toFrom.split(":");
                sFrom = split[0];
                sTo = split[1];
            }
            panel.append(`
                <div class="texture-map", id="texture_map_box"> 
                    <button class="texture-map-box">delete</button> 
                    <input class="texture-map-box" type="text" value="${sFrom}" id="texture_map_box_input_from">
                    
                    <span style="color: aliceblue; font-weight: bold;">&gt;</span>

                    <input class="texture-map-box" type="text" value="${sTo}" id="texture_map_box_input_to">
                </div> 
            `)


        })
    }

    open() {


        let variantHolder = VariantManager.getVariantHolder();

        if (variantHolder === undefined)
            return; // this should never happen

        let panel = $('#texture_map_container');

        let variant = variantHolder.variantMap.get(variantHolder.currentVariant);
        
        if (variant == undefined)
            return;

        VariantOptionsDialog.textureMap.clear()
        variant.getTextureMap().forEach( (to, from) => {
            VariantOptionsDialog.textureMap.set(from, to);
        })
        
        VariantOptionsDialog.textureMap.set("example", "from:to");

        const variantOptionsDialog = new Dialog({
            id: 'test1',
            title: 'Texture Variant Options',
            width: 600,
            
            onOpen(){
                let variantId: string = VariantManager.editVariant;

                variantOptionsDialog.object.innerHTML = `
                <style> 

                .variant_input {
                    width: 100%;
                }

                .container { 
                    display: flex; 
                    gap: 5px; 
                    margin-top: 5px;
                } 

                .scrollable-box { 
                    height: 200px; 
                    overflow-y: auto; 
                    background-color: #252629; 
                    padding: 10px; 
                    flex: 1; 
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                } 

                /* Changed fixed height to min-height to give elements vertical breathing room */
                .texture-map { 
                    background-color: #021347; 
                    min-height: 36px; 
                    padding: 6px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    gap: 5px;
                } 

                /* Removed rigid height so items fit neatly inside the flex layout */
                .texture-map-box { 
                    background-color: #4d4d4d; 
                    align-self: stretch;
                    width: 100px; 
                    color: #ffffff; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    border: none;
                    font-size: 13px;
                    cursor: pointer;
                } 

                input.texture-map-box {
                    background-color: #4d4d4d;
                    color: #ffffff;
                }

                .btn-new {
                    background-color: #4d4d4d; 
                    color: #ffffff;
                    padding: 6px 12px;
                    border: none;
                    cursor: pointer;
                    font-size: 13px;
                    margin-bottom: 5px;
                }
                </style> 

                <div> 
                    <h1 style="font-size: 20px;">Texture variant options</h1> 
                    <h1 style="font-size: 20px;">Variant id</h1> 
                    <input class="variant_input" value="${variantId}" type="text" id="fname" name="fname"> 
                </div> 

                <div class="select-list"> 
                    <div class="title">Variant options</div> 
                </div>

                <h1>Texture maps</h1> 
                <button class="btn-new">new mapping</button> 

                <div class="container"> 
                    <div class="scrollable-box" id="texture_map_container"> 

                    </div>
                </div> 

                <h1>Excluded groups</h1> 
                <div class="container"> 
                    <div class="scrollable-box"> 

                        <div class="texture-map"> 
                            <button class="texture-map-box">remove</button> 
                            <div class="texture-map-box">group3</div> 
                        </div> 

                        <div class="texture-map"> 
                            <button class="texture-map-box">remove</button> 
                            <div class="texture-map-box">group4</div> 
                        </div>
                    </div> 

                    <div class="scrollable-box"> 
                        <div class="texture-map"> 
                            <button class="texture-map-box">add</button> 
                            <div class="texture-map-box">group1</div> 
                        </div> 

                        <div class="texture-map"> 
                            <button class="texture-map-box">add</button> 
                            <div class="texture-map-box">group2</div> 
                        </div> 
                    </div>
                </div>

                <div> 
                    <button class="confirm">confirm</button> 
                    <button class="cancel">cancel</button> 
                </div> 
                `

                VariantOptionsDialog.createTextureMapHTML()


                $('#confirm').on('click', () => {
                    var inputValue: string =  String($('.variant_input').val());

                    if (inputValue.length === 0){
                        Blockbench.showQuickMessage('Cannot set variant id to nothing', 1000);
                        return;
                    }
                        
                                        
                    let variantHolder: VariantHolder | undefined = VariantManager.getVariantHolder()
                    if (variantHolder === undefined)
                        return;
                    
                    let variant = variantHolder.variantMap.get(variantId);

                    if (variant === undefined)
                        return;
                    
                    if (variantHolder.variantMap.has(inputValue)){ // checks if your trying to do someting stupid and set an exising variant to something else
                        if (inputValue !== variantId){
                            Blockbench.showQuickMessage('Variant id already used', 1000);
                            return;
                        }
                    }
                });

                $('.cancel').on('click', () => {

                    variantOptionsDialog.close();
                });

                $('.btn-new').on('click', () => {
                    

                    let variantHolder = VariantManager.getVariantHolder();

                    if (variantHolder === undefined)
                        return; // this should never happen

                    let variant = variantHolder.variantMap.get(variantHolder.currentVariant);
                    
                    if (variant == undefined)
                        return;

                    VariantOptionsDialog.textureMap.set(crypto.randomUUID(), "from:to"); // uses a random uuid in the plaen to represent the ui comp 
                    // ui element -> from:to

                    VariantOptionsDialog.createTextureMapHTML();
                    
                });
            },      
        }); 


        variantOptionsDialog.show();
    }
}
