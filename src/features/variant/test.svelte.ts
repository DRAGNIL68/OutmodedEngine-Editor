import { mount, unmount } from 'svelte';
import VariantPanel from './VariantPanel.svelte';
    
    export function openSvelteDialog1() { 
        const container = document.createElement('div'); 
        let app: ReturnType<typeof mount> | undefined; 

        const myCustomPanel = new Panel('texture_variants', { 
            name: 'Texture Variants', 
            icon: 'star', 
            condition: () => Format.id === "outmoded_template", 
            menu: [ 
                new Action('panel_refresh_btn', { 
                    name: 'Refresh Panel Data', 
                    icon: 'refresh', 
                    click: function () { } 
                }) 
            ], 
        }); 
        let list = $state([]); 
        // Add the missing props property here
        app = mount(VariantPanel, { 
            target: container,
            props: {variantList: list} 
        }); 

        return myCustomPanel; 
    }