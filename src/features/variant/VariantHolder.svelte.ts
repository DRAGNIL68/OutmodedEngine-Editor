import { Variant } from "./Variant";

export class VariantHolder {
    private project: UUID;
    public variantNum = 0;
    currentVariant = $state<string>("default");

    public variantMap = new Map<string, Variant>();

    constructor(project: UUID){
        this.project = project;

        let variant = new Variant(true);


        this.variantMap.set("default", variant);

    }


    getUuid() {
        return this.project;
    }

    addNew(name: string){
        this.variantMap.set(name, new Variant(false))
    }

    addNewA(){
        if (this.variantMap.has(String(this.variantNum+1)))
            return;

        this.variantNum++;
        this.variantMap.set(String(this.variantNum), new Variant(false))
    }

    // applies the normal textures
    // 
    reset(){
        let defaultVariant: Variant | undefined = this.variantMap.get("default");

        if (!(defaultVariant instanceof Variant))
            return

        Cube.all.forEach( (data, key) => {

            let uvList: string[] = ["north", "east", "south", "west", "up", "down"]

            uvList.forEach( i => {

                let texture = data.faces[i].texture

                if (typeof texture !== 'string') 
                    return;

                
                // data.faces[i].texture = defaultVariant.textureMap.get(texture);

            })
        });
        
    }
}