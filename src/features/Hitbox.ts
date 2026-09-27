


const debug: boolean = true


const cubeCache: Map<UUID, BoundingBox> = new Map();

export default clearHitboxCache
    
function clearHitboxCache() {
    cubeCache.clear();
    runLock = false;
}

function updateCache() {
    console.log("Update Cache")

    cubeCache.clear();

    BoundingBox.selected.forEach( (cube) => { 
        cubeCache.set(cube.uuid, cube.getUndoCopy())
    });

}

export const initEdit = () => {
    if (runLock) {
        console.log("isLOCKED")
        return}; // run lock
    updateCache();
}

export const finishEdit = () => {
    if (runLock) {
        console.log("isLOCKED")
        return}; // run lock
    cubeCache.clear();
}

let runLock: boolean = false; // locks the code from recursively calling itself
export const updateSelection = () => {
    applyEdit()
};

function applyEdit(){
    
    if (runLock) {
        console.log("isLOCKED")
        return}; // run lock

    let renderUpdate: boolean = false; // used as a way to redraw the cubes

    if (BoundingBox.selected.length == 0) { return; }
    
    BoundingBox.selected.forEach( (newCube: OutlinerElement) => { 

        if (!(newCube instanceof BoundingBox)){ return; } // why do i need this????


        if (!cubeCache.has(newCube.uuid)){ return; }

        const oldCube: BoundingBox | undefined = cubeCache.get(newCube.uuid)

        if (oldCube === undefined) { return; } 

        let oldScalesX = oldCube.to[0] - oldCube.from[0]; // old diff
        let oldScalesZ = oldCube.to[2] - oldCube.from[2]; 

        let newScalesX = newCube.to[0] - newCube.from[0]; // this is besically the with
        let newScalesZ = newCube.to[2] - newCube.from[2];


        if (newScalesZ !== oldScalesZ) {
            

            if (debug) {
                console.log("old");
                console.log("from.x", oldCube.from[0], "to.x", oldCube.to[0])
                console.log("from.z", oldCube.from[2], "to.z", oldCube.to[2])
            }
            
            // locks code to resize
            runLock = true; 
            {   
            
                // newCube.resize(newScalesZ-oldScalesZ, 2 ,false, false, true) // fucking resize triggers update_selection
                // newCube.resize(newScalesZ-oldScalesZ, 0 ,false, false, true)

            }
            runLock = false; // unlock
            
            if (debug) {
                console.log("new");
                console.log("from.x", newCube.from[0], "to.x", newCube.to[0])
                console.log("from.z", newCube.from[2], "to.z", newCube.to[2])
            }

            renderUpdate = true; //redraw call
        }
    });

    if (renderUpdate){
        runLock = true; { // runlock
            Canvas.updateView({
                elements: BoundingBox.selected,
                element_aspects: {geometry: true},
                selection: true
            });
        }
        runLock = false;

    }


}
