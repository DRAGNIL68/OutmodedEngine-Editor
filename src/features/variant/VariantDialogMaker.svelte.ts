import { mount, unmount } from "svelte";
import type { Variant } from "./Variant";
import type { VariantOptionData } from "./VariantData";
import VariantDialog from "./VariantDialog.svelte";

// gemini said that i have to put this in its own class fuck knows why,
// but if i dont it breaks the reactive state of "variantList"
export class VariantDialogMaker {
    public openVariantDialog(variant: Variant) {
        let variantList = $state<VariantOptionData[]>([...variant.textureMap]);

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
                variant.textureMap.length = 0;

                variantList.forEach(data => {
                    if (data.input1.length === 0 || !data.input1.endsWith(".png")) {
                        return;
                    }
                    if (data.input2.length === 0 || !data.input2.endsWith(".png")) {
                        return;
                    }
                    variant.textureMap.push(data);
                });

                if (app) {
                    unmount(app);
                    app = undefined;
                }
            },
        });

        dialog.show();

        app = mount(VariantDialog, {
            target: container,
            props: {
                get variantData() {
                    return variantList;
                },
                set variantData(value) {
                    variantList = value;
                }
            }
        });

        return dialog;
    }
}