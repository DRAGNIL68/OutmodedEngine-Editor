import { CodecUtils } from "../../tools/CodecUtils";
import { Variant, VariantManager } from "./VariantManager";


// i need to add interfaces so this code does not become unreadable
export const VariantTools = class VariantTools {
    static namespace: string = "outmoded_engine"

    public static generateVariantData(variantId: string, textureMap: any){

        let variant = {
            name: variantId, // name/id of variant
            textureMap: textureMap, // stores what textures map to what
            rp_data: {}
        }

        let groupCubeMap: Map<UUID, Cube[]> = CodecUtils.groupFlatten();
        let resourceMap = new Map<UUID, any>();
        
        groupCubeMap.forEach((cubes, key) => {
            resourceMap.set(key, VariantTools.generateGroupFile(cubes)) // maps group uuid as file name to model data
        });

        variant.rp_data = Object.fromEntries(resourceMap);

        return variant;
    }

    public static generateGroupFile(cubes: Cube[]){
        let textureMap = new Map<string, any>() // id : texture name

        let file = {
            format_version: "1.21.11",
            texture_size: [-1, -1],
            textures: {}, // map
            elements: [] as any[] // I think this is bad
            
        }

        cubes.forEach(cube => {
            if (cube == null){
                return;
            }
                    
            let faces = new Map<string, any>();

            for (const [face, data] of Object.entries(cube.faces)) {

                let txt: false | Texture | null | undefined = data.getTexture();

                if (txt instanceof Texture){             
                    textureMap.set(txt.id, VariantTools.namespace+":"+txt.name);

                    faces.set(face, {
                        uv: data.uv,
                        texture: "#"+txt.id
                    })
                }
            }

            let cubeData = {
                from: [cube.from[0], cube.from[1], cube.from[2]],
                to: [cube.to[0], cube.to[1], cube.to[2]],
                rotation: {"x": cube.rotation[0], "y": cube.rotation[1], "z": cube.rotation[2], "origin": [cube.origin[0], cube.origin[1], cube.origin[2]]},
                faces: Object.fromEntries(faces)
            }
            
            file.textures = Object.fromEntries(textureMap);
            file.elements.push(cubeData);
                
        })

        return file;
    }

    public static generateAllVariants(): Map<string, any> {
        // DO NOT CHANGE DATA YOU WILL BREAK THINGS.
        // This is why we make data private kids.
        let variantMap = VariantManager.getVariantHolder()?.variantMap

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

        let variant: Variant | undefined = VariantManager.getVariantHolder()?.variantMap.get(variantId)

        if (variant == undefined)
            return new Map<UUID, any>();

        
        let groupCubeMap: Map<UUID, Cube[]> = CodecUtils.groupFlatten();
        let textureToTextureMap: Map<string, string> = variant.getTextureMap()

        let resourceMap = new Map<UUID, any>();

        groupCubeMap.forEach((cubes, key) => {

            let textureMap = new Map<string, any>() // id : texture name

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

                for (const [face, data] of Object.entries(cube.faces)) {

                    let txt: false | Texture | null | undefined = data.getTexture();

                    if (txt instanceof Texture){           
                        
                        let textName: string = txt.name;

                        if (textureToTextureMap.has(txt.name)){ // replaces the default texture with a new and shiny one from a variant
                            textName = textureToTextureMap.get(txt.name) ?? "UNDEFINED" // if for some reason the variant texture is null replace with a string
                        }

                        textureMap.set(txt.id, textName);

                        faces.set(face, {
                            uv: data.uv,
                            texture: "#"+txt.id
                        })
                    }
                }

                let cubeData = {
                    from: [cube.from[0], cube.from[1], cube.from[2]],
                    to: [cube.to[0], cube.to[1], cube.to[2]],
                    rotation: {"x": cube.rotation[0], "y": cube.rotation[1], "z": cube.rotation[2], "origin": [cube.origin[0], cube.origin[1], cube.origin[2]]},
                    faces: Object.fromEntries(faces)
                }
                
                file.textures = Object.fromEntries(textureMap);
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