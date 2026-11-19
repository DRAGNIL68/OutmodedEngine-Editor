import { VariantHolder } from "./VariantHolder.svelte.ts";
import { mount, unmount } from 'svelte';
import VariantPanel from "./VariantPanel.svelte";
import { Variant, type CubeUvMap } from "./Variant";

let list: string[] = $state([]); // used as a handy way to update variant gui

export class VariantManager{
    //TODO: block user texture changes in variants
    private static variantHolderMap = new Map<string, VariantHolder>();
    private static currentVariantHolder: VariantHolder | undefined = undefined
    
    public static nameToUuidMap = new Map<string, UUID>();


    public static generateNameToUuidMap(){
        this.nameToUuidMap.clear();
        Texture.all.forEach( texture => {
            this.nameToUuidMap.set(texture.name, texture.uuid);
        })
    }


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

            let varinatHolder = this.variantHolderMap.get(Project.uuid)

            if (varinatHolder === undefined){ // this is for new projects that are created
                varinatHolder = new VariantHolder(Project.uuid);
                this.variantHolderMap.set(Project.uuid, varinatHolder);
                console.log("Project "+Project.uuid+" has been added to VariantManager")
            }

            this.currentVariantHolder = varinatHolder;
            this.generateNameToUuidMap()
            this.generateVariantGui(); 
        })

        Blockbench.on("close_project", event => {
            this.variantHolderMap.delete(event.project.uuid)
            console.log("Project "+event.project.uuid+" has been removed to VariantManager")
        })

        Blockbench.on("finish_edit", event => { // add
            
            let variant: Variant | undefined = this.currentVariantHolder?.variantMap.get(this.currentVariantHolder?.currentVariant);

            if (variant === undefined){
                return;
            }

            event.aspects.elements?.forEach( element => {

                if (!(element instanceof Cube)){
                    return;
                }

                let uvMap: CubeUvMap = {
                    north: element.faces["north"].texture,
                    east: element.faces["east"].texture,
                    south: element.faces["south"].texture,
                    west: element.faces["west"].texture,
                    up: element.faces["up"].texture,
                    down: element.faces["down"].texture,
                }

                variant.defaultMap.set(element.uuid, uvMap);
            })

            console.log("something has been finish_edit");
            this.checkCubes("add");
        })

        Blockbench.on("undo", event => { // remove
            console.log("something has been undo");
            this.checkCubes("remove");
        })

        Blockbench.on("redo", event => { // add
            console.log("something has been redo");
            this.checkCubes("add");
        })

        VariantManager.initVariantPanel()

        
    }

    // adds new cubes to the default variant
    private static checkCubes(flag: string){
        let variant: Variant | undefined = this.currentVariantHolder?.variantMap.get("default")

        if (variant === undefined){
            return; // error
        }
        
        Cube.all.forEach( cube => {
            if (flag === "add"){
                console.log("cube update")
                if (variant.defaultMap.has(cube.uuid)){
                    return
                }

                let uvMap: CubeUvMap = {
                    north: cube.faces["north"].texture,
                    east: cube.faces["east"].texture,
                    south: cube.faces["south"].texture,
                    west: cube.faces["west"].texture,
                    up: cube.faces["up"].texture,
                    down: cube.faces["down"].texture,
                }

                variant.defaultMap.set(cube.uuid, uvMap)
                console.log("added new cube")
            }
            else if (flag === "remove") {
                variant.defaultMap.delete(cube.uuid)
                console.log("removed new cube")
            }
        })
    }

    public static setCurrentVariant(id: string){
        this.currentVariantHolder = this.variantHolderMap.get(id);
    }

    // this may be undefined
    public static getCurrentVariantHolder(): VariantHolder | undefined {
        return this.currentVariantHolder;
    } 
    
    public static initVariantPanel() { 
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

        // Create and display the dialog
}  