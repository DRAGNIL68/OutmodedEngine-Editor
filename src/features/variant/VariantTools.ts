import { CodecUtils } from "../../CodecUtils";
import { Variant, type CubeUvMap } from "./Variant";
import { VariantManager } from "./VariantManager.svelte.ts";



// i need to add interfaces so this code does not become unreadable
export const VariantTools = class VariantTools {
    static namespace: string = "outmoded_engine"


    public static generateAllVariants(): Map<string, any> {
        // DO NOT CHANGE DATA YOU WILL BREAK THINGS.
        // This is why we make data private kids.
        let variantMap = VariantManager.getCurrentVariantHolder()?.variantMap

        let variantDataMap: Map<string, any> = new Map<UUID, any>();
        
        variantMap?.forEach( (data, key) => { // why on gods grean earth does javascript use '=>' and not '->' for lambdas?
            // I just read the kotlin guide on higher-order functions and you can do some really wacky things with it
            // I may make my own annotation based system for java to do some odd stuff using bytebuddy code gen

            let variant = Object.fromEntries(this.generateVariantResource(key)) 
            variantDataMap.set(key, variant);
        })

        return variantDataMap;
    }

    public static generateVariantResource(variantId: string): Map<UUID, any> {
        let variant: Variant | undefined = VariantManager.getCurrentVariantHolder()?.variantMap.get(variantId)

        if (variant == undefined)
            return new Map<UUID, any>();

        let groupCubeMap: Map<UUID, Cube[]> = CodecUtils.groupFlatten();
        let resourceMap = new Map<UUID, any>();

        groupCubeMap.forEach((cubes, key) => {
            let num = 0;
            let textureMap = new Map<string, string>() // id : texture name

            let file = {
                format_version: "1.21.11",
                texture_size: [-1, -1],
                textures: {}, // map
                data: {
                    elements: [] as any[] // I think this is bad
                }

            }

            cubes.forEach(cube => {
                if (cube == null){
                    return
                }
                    
                let faces = new Map<string, any>();

                let uvMap = variant.defaultMap.get(cube.uuid);

                if (uvMap === undefined) {
                    return;
                }
                
                // this is very lazy

                let facesList: (keyof CubeUvMap)[] = ['north', 'east', 'south', 'west', 'up', 'down']
                
                facesList.forEach( i => {
                    if (typeof uvMap[i] === "string"){           
                        
                        let textName: string | undefined = VariantManager.uuidToNameMap.get(uvMap[i]);

                        if (textName !== undefined){
                            textureMap.set(textName, num.toString())
                            num++;
                        }
                    }
                });


                for (const [face, data] of Object.entries(cube.faces)) {
                    let txt: false | Texture | null | undefined = data.getTexture();
                }
                
                console.log(textureMap)

                
                facesList.forEach( i => {
                    const uuid = uvMap[i];

                    

                    if (typeof uuid === "string"){
                        let texName = VariantManager.uuidToNameMap.get(uuid);

                        if (texName === undefined)
                            return;

                        faces.set(i, {
                            uv: cube.faces[i].uv,
                            texture: typeof uvMap.north === "string" ? "#"+textureMap.get(texName) : "ERROR"
                        })
                    }
                });

                

                let cubeData = {
                    from: [cube.from[0], cube.from[1], cube.from[2]],
                    to: [cube.to[0], cube.to[1], cube.to[2]],
                    rotation: {"x": cube.rotation[0], "y": cube.rotation[1], "z": cube.rotation[2], "origin": [cube.origin[0], cube.origin[1], cube.origin[2]]},
                    faces: Object.fromEntries(faces)
                }
                
                
                let invertedTextureMap = new Map<string, string>() // id : texture name

                textureMap.forEach( (data, key) => {
                    invertedTextureMap.set(data, key);
                })

                file.textures = Object.fromEntries(invertedTextureMap);
                file.data.elements.push(cubeData);
            })

            resourceMap.set(key, file) // maps group uuid as file name to model data

        });

        return resourceMap;
    }


    public static getAllTexturesBase64(): Map<string, string>{

        let result = new Map<string, string>();

        Texture.all.forEach( (texture) => {
            result.set(texture.name, texture.getBase64());
        })

        return result;
    }

}