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
            this.variantHolderMap.set(uuid, new VariantHolder(uuid));
        }

        return this.variantHolderMap.get(uuid);
    }
    
}

// no this entire file is terrible
export class VariantHolder {
    private project: UUID;
    public variantNum = 0;

    public variantMap = new Map<string, Variant>();

    constructor(project: UUID){
        this.project = project;

    }

    public getProject(): UUID { return this.project;}

    public toJson(): string {
        return "";
    }

    public fromJson(json: string){

    }


}

export class Variant{
    // name is id in map

    private textureMap = new Map<string, string>()// texture.name : texture.name
    private excludedGroupMap = new Set<Group>;
    
    public getTextureMap(): Map<string, string>{
        return this.textureMap;
    }
    
    public getExcludedGroupMap(): Set<Group>{
        return this.excludedGroupMap
    }
    
}



