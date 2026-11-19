import { mount, unmount } from "svelte";
import type { Variant } from "./Variant";
import type { VariantOptionData } from "./VariantData";
import VariantDialog from "./VariantDialog.svelte";

// gemini said that i have to put this in its own class fuck knows why,
// but if i dont it breaks the reactive state of "variantList"
export class VariantDialogMaker {
    public openVariantDialog(variant: Variant) {
        

        const container = document.createElement('div');
        let app: ReturnType<typeof mount> | undefined;

        const dialog = new Dialog('outmoded_editor_dialog', {
            title: 'OutmodedEngine Editor',
            width: 700,
            lines: [container],
            onClose() {
                if (app) {
                    unmount(app);
                    app = undefined;
                }
                return true;
            },
            onConfirm() {


                if (app) {
                    unmount(app);
                    app = undefined;
                }
            },
        });

        dialog.show();

        app = mount(VariantDialog, {
            target: container,
        });

        return dialog;
    }
}