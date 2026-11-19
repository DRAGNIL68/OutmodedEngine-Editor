<script lang="ts">
  import type { Variant } from "./Variant";
  import { VariantManager } from "./VariantManager.svelte";


    let {variant}: {variant: string} = $props();

    function onEdit(){
        

        let holder = VariantManager.getCurrentVariantHolder();

        if (holder === undefined){
            return;
        }
            
        let variantClass: Variant | undefined = holder.variantMap.get(variant);

        if (variantClass === undefined){
            return
        }
        
        holder.variantMap.get("default")?.apply();
        variantClass.apply();
        holder.currentVariant = variant;
        VariantManager.generateVariantGui();
        // new VariantDialogMaker().openVariantDialog(variantClass);
        
    }

    function onDelete(){
        let holder = VariantManager.getCurrentVariantHolder();

        if (holder === undefined)
            return;

        if (variant === "default"){
            Blockbench.showQuickMessage('Cannot delete default variant', 500);
            return
        }

        holder.variantMap.delete(variant);
        VariantManager.generateVariantGui();
    }

</script>

<div class="div">
    <h1 class=text style:color={VariantManager.getCurrentVariantHolder()?.currentVariant === variant  ? "yellow" : "white"}>
        {variant}
    </h1>
    <div class="div_2">
        <button class=text_right onclick={onEdit}>select</button>

        <button class=text_right onclick={onDelete}>delete</button>
    </div>

</div>

<style>
    .div_2{
        display: flex; 
        align-items: center; 
    
    }
    .div { 
        display: flex; 
        align-items: center; 
        justify-content: space-between;
        padding: 10px; 
        border: 2px solid rgb(243, 247, 2); 
        margin: 0; 
        height: 30px; 
        background-color: rgb(13, 8, 41); 
        
    } 

    .text { 
        font: 2em sans-serif; 
        line-height: 0.4;
        
    }
    .text_right { 
        font: 2em sans-serif; 
        line-height: 0.4;
        padding-left: 10px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.1s ease;
        padding: 10px; 
        color: white;

        background-color: rgb(32, 20, 102); 
        
    }

    .text_right:hover {
		background-color: #d81d1d;
		transform: translateY(-2px);
	}
</style>