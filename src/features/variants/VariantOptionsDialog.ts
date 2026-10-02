import { CodecUtils } from "../../tools/CodecUtils";

export class VariantDialogOptionsUtil{
    static getGroups(){

        let html = $('.select-options');
        html.empty();
        CodecUtils.groupFlatten().forEach( (value, string) => {
            html.append(`
            </div>
                <div class="option"> 
                <input type="checkbox" name="${value}" id="option4" />
                <label for="option4">Option 1</label>
            </div>
                `);
        })
    }



}


export const variantOptionsDialog = new Dialog({
    id: 'test1',
    title: 'Texture Variant Options',
    width: 600,
    
    onOpen(){
        variantOptionsDialog.object.innerHTML = `
        <div>
            <h1 style="font-size: 20px;">Texture variant options</h1>

            <h1 style="font-size: 20px;">variant id</h1>
            <input width: 100%; type="text"; id="fname"; name="fname;">
        </div>

        <div class="select-list">
            <div class="title">Configure Table</div>
            <div class="select-options">
        </div>

        <div>
            <button>confirm</button>
            <button>cancel</button>
        </div>
        
        
        `
    },

    onConfirm(formResult, event) {
        
        //const initialData = this.component.id
        console.log(this.component);
    },


    
});
