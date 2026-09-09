    
    // index is cube
    // this should never be wrong
    let scalesXFrom: number[] = [];
    let scalesZFrom: number[] = [];

    let scalesXTo: number[] = [];
    let scalesZTo: number[] = [];

    export const initEdit = (data) => {
        console.log("1")

        scalesXTo = [];
        scalesZTo = [];

        scalesXFrom = [];
        scalesZFrom = [];

        Cube.selected.forEach(cube => {
            scalesXTo.push(cube.to[0]);
            scalesZTo.push(cube.to[2]);

            scalesXFrom.push(cube.from[0]);
            scalesZFrom.push(cube.from[2]);
        });     
    };

    export const updateSelection = (data) => {
        console.log("2")


        // if (scalesXTo === null){
        //     console.log("hitbox.ts line 22: scales were not set")
        //     return
        // }   
        
        Cube.selected.forEach(function(element, index, array){
            let oldToScalesX = scalesXTo[index]
            let oldToScalesZ = scalesZTo[index]

            let oldFromScalesX = scalesXFrom[index]
            let oldFromScalesZ = scalesZFrom[index]

            let oldScalesX = oldToScalesX - oldFromScalesX;
            let oldScalesZ = oldToScalesZ - oldFromScalesZ;

            // Your development logic here (e.g., modifying properties)
            let newScalesX = element.to[0] - element.from[0];
            let newScalesZ = element.to[2] - element.from[2];


            if (newScalesZ !== oldScalesZ){

                console.log("z-diff")
                console.log(newScalesZ-oldScalesZ)

                element.to[0] = element.from[0] + newScalesZ;
                element.to[2] = element.from[2] + newScalesZ;
            }
            else if (newScalesX !== oldScalesX){

                console.log("x-diff")
                console.log(newScalesX-oldScalesX)

                element.to[0] = element.from[0] + newScalesX;
                element.to[2] = element.from[2] + newScalesX;
            }




            // cube.to[0] = cube.from[0] + 4; // X-axis size
            // cube.to[1] = cube.from[1] + 4; // Y-axis size
            // cube.to[2] = cube.from[2] + 4; // Z-axis size
            
            //console.log(element.size()); 
        });      
    };

