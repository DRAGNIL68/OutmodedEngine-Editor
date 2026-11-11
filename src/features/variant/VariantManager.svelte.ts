import { VariantHolder } from "./VariantHolder";
import { mount, unmount } from 'svelte';
import VariantPanel from "./VariantPanel.svelte";

let list: string[] = $state([]); // used as a handy way to update variant gui

export class VariantManager{

    private static variantHolderMap = new Map<string, VariantHolder>();
    private static currentVariantHolder: VariantHolder | undefined = undefined
    


    public static generateVariantGui(){
        if (this.currentVariantHolder === undefined)
            return;

        list.empty();
        this.currentVariantHolder.variantMap.forEach( (data, key) => {
            list.push(key)
        });

    }

    public static bindEvents(){
        Blockbench.on("select_project", event => {
            
            if (event.project.format.id !== "outmoded_template")
                return;

            let varinatHolder = this.variantHolderMap.get(event.project.uuid)

            if (varinatHolder === undefined){ // this is for new projects that are created
                this.variantHolderMap.set(event.project.uuid, new VariantHolder(event.project.uuid));
                console.log("Project "+event.project.uuid+" has been added to VariantManager")
            }
            
            this.currentVariantHolder = varinatHolder;
            
        })

        Blockbench.on("close_project", event => {
            this.variantHolderMap.delete(event.project.uuid)
            console.log("Project "+event.project.uuid+" has been removed to VariantManager")
        })

        VariantManager.openSvelteDialog1()

    }

    public static setCurrentVariant(id: string){
        this.currentVariantHolder = this.variantHolderMap.get(id);
    }

    // this may be undefined
    public static getCurrentVariantHolder(): VariantHolder | undefined {
        return this.currentVariantHolder;
    }
    
    public static openSvelteDialog1() { 
        console.log("added custom panel1")
        const container = document.createElement('div'); 
        let app: ReturnType<typeof mount> | undefined; 

        const myCustomPanel = new Panel('texture_variants', { 
            name: 'Texture Variants', 
            icon: 'star', 
            condition: () => Format.id === "outmoded_template", 
            menu: [ 
                new Action('panel_refresh_btn', { 
                    name: 'Refresh Panel Data', 
                    icon: 'refresh', 
                    click: function () { } 
                }) 
            ], 
        }); 

        this.generateVariantGui();

        myCustomPanel.node.appendChild(container);
        // Add the missing props property here
        app = mount(VariantPanel, { 
            target: container,
            props: {variantList: list} 
        }); 
        console.log("added custom panel")
        return myCustomPanel; 
    }

}  