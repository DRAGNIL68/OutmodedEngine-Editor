
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



    
}

