
// i am not making data private. 
// If you change values you are intentionally trying to break my code
export class VariantManager {
    public static variantNum = 0;

    private static variantHolderMap = new Map<string, VariantHolder>();


    public static bindEvents(){

        console.log("binding events")

        Blockbench.on('save_project', (data) => {
            let modelUuid = Project.uuid;
            console.log("bind save project")
        })

        Blockbench.on('load_project', (data) => {
            let modelUuid = Project.uuid;
            console.log("bind load project")
        })

        Blockbench.on('select_project', (data) => {
            VariantManager.getVariantHolder(); 
            // this triggers the default variant to be created
            // but only for Outmoded Templates
        })
    }


    public static loadVariantHolder(project: UUID, json: string){
        this.variantHolderMap.set(project, new VariantHolder("uuid"));
    }

    public static removeVariantHolder(project: UUID){
        this.variantHolderMap.delete(project);
    }
    
    /**
     * uses the current open project
     * @returns VariantHolder | undefined
     */
    public static getVariantHolder(): VariantHolder | undefined {
        let uuid = Project.uuid;

        if (Project.format === undefined)
            return undefined; // this happens when there is no project (main menu)

        // checks if its the correct format (outmoded_template)
        if (Project.format.id !== "outmoded_template"){
            return undefined;
        }

        // creates the variant holder for the current project
        if (!this.variantHolderMap.has(uuid)){

            // adds default variant
            let variantHolder = new VariantHolder(uuid)

            let variant = new Variant();
            variant.isDefault = true;
            variant.generateCubeUvMap();

            variantHolder.variantMap.set("default", variant)
            this.variantHolderMap.set(uuid, variantHolder);
        }

        return this.variantHolderMap.get(uuid);
    }
}

// no this entire file is terrible
export class VariantHolder {
    private project: UUID;
    public variantNum = 0;
    public currentVariant: string = "default"

    public variantMap = new Map<string, Variant>();

    constructor(project: UUID){
        this.project = project;

        let variant = new Variant()


        Cube.all.forEach((cube) => {
            cube

        })

        this.variantMap.set("default", variant)

    }

    public getProject(): UUID { return this.project;}

    public toJson(): string {
        return "";
    }

    public fromJson(json: string){

    }


}

interface CubeUvMap {
    north: Texture | undefined | null | false
    east: Texture | undefined | null | false
    south: Texture | undefined | null | false
    west: Texture | undefined | null | false
    up: Texture | undefined | null | false
    down: Texture | undefined | null | false
}

export class Variant{
    public isDefault = false
    public defaultMap = new Map<UUID, CubeUvMap>()

    private textureMap = new Map<string, string>()// texture : texture
    



    private excludedGroupMap = new Set<UUID>;
    
    public getTextureMap(){
        return this.textureMap;
    }
    
    public getExcludedGroupMap(): Set<UUID>{
        return this.excludedGroupMap
    }

    public generateCubeUvMap(){

        if (this.isDefault === false)
            console.warn("non default variant generated CubeUvMap")

        Cube.all.forEach((cube) => {

            let uvMap: CubeUvMap = {
                    north: cube.faces["north"].getTexture(),
                    east: cube.faces["north"].getTexture(),
                    south: cube.faces["north"].getTexture(),
                    west: cube.faces["north"].getTexture(),
                    up: cube.faces["north"].getTexture(),
                    down: cube.faces["north"].getTexture(),
            }
            
        })


    }
    
}



