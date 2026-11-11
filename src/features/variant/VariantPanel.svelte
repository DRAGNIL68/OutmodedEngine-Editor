<script lang="ts">
    import Button from "./VariantButton.svelte"
  import { VariantHolder } from "./VariantHolder";
  import { VariantManager } from "./VariantManager.svelte";

    
    let {variantList}: {variantList: string[]} = $props();

    function handleClick() {
        let holder: VariantHolder | undefined = VariantManager.getCurrentVariantHolder();
        
        if (holder === undefined)
            return;
        
        console.log("frog");
        
        holder.addNewA();
        VariantManager.generateVariantGui();

    }

</script>

<div class="div">
    <div class="div_2">
        <button class="text_right" onclick={handleClick}>Add</button>
    </div>
    
    {#each variantList as item}
        <div class="button-wrapper">
            <Button variant={item}></Button>
        </div>
    {/each}
</div>

<style>
    .div_2{
        display: flex; 
        align-items: center; 
    }
    .div { 
        align-items: center; 
        justify-content: space-between;
        padding: 10px; 
        border: 2px solid rgb(243, 247, 2); 
        height: 300px; 
        background-color: rgb(13, 8, 41); 

    } 

    .text_right { 
        font: 2em sans-serif; 
        line-height: 0.4;
        padding-left: 10px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.1s ease;
        padding: 10px;
        background-color: rgb(32, 20, 102); 
        color: white;
        
    }

    .text_right:hover {
		background-color: #d81d1d;
		transform: translateY(-2px);
	}

    .button-wrapper {
        padding: 8px 0; /* Adds 8px of padding to the top and bottom */
    }
    
</style>