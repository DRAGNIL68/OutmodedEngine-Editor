import type { VariantOptionData } from "./VariantData"
import type { VariantHolder } from "./VariantHolder.svelte"
import { VariantManager } from "./VariantManager.svelte"

export interface CubeUvMap {
    north: string | false | undefined
    east: string  | false | undefined
    south: string | false | undefined
    west: string | false | undefined
    up: string | false | undefined
    down: string | false | undefined
}



export class Variant{
    public isDefault = false // this should never be true unless this is "default"
    public defaultMap = new Map<UUID, CubeUvMap>() // only for default variant
    

    public excludedGroupMap = new Set<UUID>;
    
    constructor(isDefault: boolean) {

        if (!isDefault) {
            let variantHolder: VariantHolder | undefined = VariantManager.getCurrentVariantHolder();

            if (variantHolder === undefined){
                return; // error
            }

            let variant: Variant | undefined = variantHolder.variantMap.get("default");

            if (variant === undefined){
                return; // error
            }

            variant.defaultMap.forEach( (uvMap, uuid) => {

                let newUvMap: CubeUvMap = {
                    north: uvMap.north,
                    east: uvMap.east,
                    south: uvMap.south,
                    west: uvMap.west,
                    up: uvMap.up,
                    down: uvMap.down,
                }

                this.defaultMap.set(uuid, newUvMap)
            })

        }
        // if its default there will be no cubes when its created
    }

    
    public getExcludedGroupMap(): Set<UUID>{
        return this.excludedGroupMap
    }

    public toJson(): string {
        return "";
    }

    public fromJson(json: string){

    }


    // applies the variant
    public apply(){

        Cube.all.forEach( (cube) => {
            
            let uvmap: CubeUvMap | undefined = this.defaultMap.get(cube.uuid);

            if (uvmap === undefined) {
                return; // if it does not exist dont run it
            }

            cube.faces["north"].texture = uvmap.north,
            cube.faces["east"].texture = uvmap.east,
            cube.faces["south"].texture = uvmap.south,
            cube.faces["west"].texture = uvmap.west,
            cube.faces["up"].texture = uvmap.up,
            cube.faces["down"].texture = uvmap.down
            console.log("applied")
        });


        Canvas.updateView({
            elements: Cube.all,
            element_aspects: {
                faces: true,
                uv: true,
                geometry: true
            }
        });
    }

}