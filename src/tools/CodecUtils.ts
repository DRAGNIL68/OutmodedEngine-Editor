

export const CodecUtils = class CodecUtils {

    public static groupFlatten(): Map<UUID, Cube[]> {
        let cubeMap = new Map<UUID, Cube[]>();
        
        Cube.all.forEach( (cube: Cube) => {         
            let pr = cube.parent;

            if (!(pr instanceof Group)){
                return;
            }

            let cubes: Cube[] = [];

            if (cubeMap.has(pr.uuid)) {
                cubes = cubeMap.get(pr.uuid)!;
                cubes.push(cube.getUndoCopy());
            }
            else {
                cubes = [cube.getUndoCopy()]
            }

            cubeMap.set(pr.uuid, cubes);

        });

        return cubeMap;
    }



    public static generateResourcePack(): Map<UUID, any> {

        console.log("1")

        let groupCubeMap: Map<UUID, Cube[]> = CodecUtils.groupFlatten();

        let resourceMap = new Map<UUID, any>();

        let textureMap = new Map<string, any>()
        console.log("2")
        groupCubeMap.forEach((cubes, key) => {

            console.log("3-loop")

            let file = {
                format_version: "1.21.11",
                credit: "Made with Blockbench for OutmodedEngine",
                texture_size: [-1, -1],
                textures: {}, // map
                elements: [] as any[] // i think this is bad
            }

            cubes.forEach(cube => {
                if (cube == null){
                    return
                }
                    

                console.log("4-loop")
                let faces = new Map<string, any>();

                for (const [face, data] of Object.entries(cube.faces)) {

                    let txt: false | Texture | null | undefined = data.getTexture();

                    if (txt instanceof Texture){             
                        textureMap.set(txt.id, txt.name);

                        faces.set(face, {
                            uv: data.uv,
                            texture: "#"+txt.id
                        })
                    }
                }

                
                let cubeData = {
                    from: [cube.from[0], cube.from[1], cube.from[2]],
                    to: [cube.to[0], cube.to[1], cube.to[2]],
                    //rotation: {"x": 1, "y": 1, "z": 1, "origin": [1, 1, 1]},
                    rotation: {"x": cube.rotation[0], "y": cube.rotation[1], "z": cube.rotation[2], "origin": [cube.origin[0], cube.origin[1], cube.origin[2]]},
                    faces: Object.fromEntries(faces)
                }

                file.elements.push(cubeData)
                
                
            })

            resourceMap.set(key, file) // maps group uuid as file name to model data

        });

        return resourceMap;
    }


    public static getAllTexturesBase64(): Map<UUID, string>{

        let result = new Map<UUID, string>();

        Texture.all.forEach( (texture) => {
            result.set(texture.uuid, texture.getBase64());
        })

        return result;
    }

    // this public maps groups to their textures
    public static mapGroupTextures(){ //TODO: not needed

        Group.all.forEach(cube => {
            

        } );
    }

}

