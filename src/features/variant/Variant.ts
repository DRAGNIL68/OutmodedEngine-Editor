
export interface CubeUvMap {
    north: Texture | undefined | null | false
    east: Texture | undefined | null | false
    south: Texture | undefined | null | false
    west: Texture | undefined | null | false
    up: Texture | undefined | null | false
    down: Texture | undefined | null | false
}

export class Variant{
    public isDefault = false // this should never be true unless this is "default"
    public defaultMap = new Map<UUID, CubeUvMap>() // only for default variant
    
    public textureMap = new Map<Texture, Texture>() // texture : texture
    public excludedGroupMap = new Set<UUID>;
    
    public getTextureMap(){
        return this.textureMap;
    }
    
    public getExcludedGroupMap(): Set<UUID>{
        return this.excludedGroupMap
    }

    public toJson(): string {
        return "";
    }

    public fromJson(json: string){

    }

    // NEVER USED.
    // dont know why i made it
    public generateCubeUvMap(){

        if (this.isDefault === false)
            console.warn("non default variant generated CubeUvMap")

        Cube.all.forEach((cube) => {

            let uvMap: CubeUvMap = {
                    north: cube.faces["north"].getTexture(),
                    east: cube.faces["east"].getTexture(),
                    south: cube.faces["south"].getTexture(),
                    west: cube.faces["west"].getTexture(),
                    up: cube.faces["up"].getTexture(),
                    down: cube.faces["down"].getTexture(),
            }


        })
    }

    // applies the variant
    public apply(){
        Cube.all.forEach( (data, key) => {

            let uvMap: CubeUvMap = {
                north: data.faces["north"].getTexture(),
                east: data.faces["east"].getTexture(),
                south: data.faces["south"].getTexture(),
                west: data.faces["west"].getTexture(),
                up: data.faces["up"].getTexture(),
                down: data.faces["down"].getTexture(),
            }
            let texture = data.faces["north"].getTexture()

            if (texture instanceof Texture){
                // apply texture 
                texture.set
                data.faces["north"].
            }

            

        });


        


        
    }
}