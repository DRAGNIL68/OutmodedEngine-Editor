import { VariantHolder } from "./VariantHolder";

export class VariantManager{

    private static variantHolderMap = new Map<string, VariantHolder>();
    private static currentVariantHolder: VariantHolder | undefined = undefined

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

    }

    public static setCurrentVariant(id: string){
        this.currentVariantHolder = this.variantHolderMap.get(id);
    }

    // this may be undefined
    public static getCurrentVariantHolder(): VariantHolder | undefined {
        return this.currentVariantHolder;
    }

}  