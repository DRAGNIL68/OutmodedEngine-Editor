
    import { CodecUtils } from "../tools/CodecUtils";
    import { VariantTools } from "../tools/VariantTools"
    export const exportCodec = new Codec('outmoded_template_codec', {
        name: 'Outmoded Template',
        extension: 'json',
        remember: true,
        compile() {

            console.log("compiling cubes")
            let nodeStructure = new Map<UUID, any>();

            let map: Map<UUID, Cube[]> = CodecUtils.groupFlatten();
            console.log("map", CodecUtils.groupFlatten())
            
            
            for (const group of Group.all){ // replace this with groups 
                
                let data = {
                    type: "group",
                    name: group.name,
                    transform: {
                        position: group.origin,
                        left_rotation: group.rotation,
                        scale: [1,1,1] // temp
                    },
                    properties: {},
                    user_properties: {} // this stores user defined data

                }
                
                nodeStructure.set(group.uuid, data)
            }

            for (const boundingBox of BoundingBox.all){

                if (!(boundingBox instanceof BoundingBox)){
                    return;
                }

                let data = {
                    type: "bounding_box",
                    name: boundingBox.name,
                    transform: {
                        position: boundingBox.origin,
                        left_rotation: [0,0,0], // this is not really needed
                        scale: boundingBox.size()
                    },
                    properties: {},
                    user_properties: {} // this stores user defined data
                }
                
                nodeStructure.set(boundingBox.uuid, data)
            }

            
            let variants = new Map<string, any>();

            variants.set("default", {
                name: "default", // name/id of variant
                textures: {}, // stores the uuids of the textures used
                excluded_nodes: {} // stores nodes that will not get updated
            })

            let data = {
                options: {

                    namespacedId: "n/a",
                    credit: "insert model credit", // from filed in bb
                    user_properties: {} // another place to put data
                },

                textures: Object.fromEntries(VariantTools.getAllTexturesBase64()),
                structure: Object.fromEntries(nodeStructure),
                animations: "data",
                texture_variants: VariantTools.generateVariantData("default", {}),
            }

            return JSON.stringify(data, null, 4);
        }
    });