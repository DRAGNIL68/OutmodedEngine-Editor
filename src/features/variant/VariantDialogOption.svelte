<script lang="ts">
  import type { VariantOptionData } from "./VariantData";

  let { variantData = $bindable() }: { variantData: VariantOptionData } = $props();

  function input1Updated(newValue: string) {
    variantData.input1 = newValue;
    console.log("Function called with:", newValue);
  }

  function input2Updated(newValue: string) {
    variantData.input2 = newValue;
    console.log("Function called with:", newValue);
  }
//I FUCKING HATE JAVASCRIPT 
</script>

<div class="div">
  <input type="text" bind:value={() => variantData.input1, input1Updated} />
  <h1>➡️</h1>
  <input type="text" bind:value={() => variantData.input2, input2Updated} />
</div>

<style>
    .div { 
        display: flex; 
        width: 100%;
        align-items: center; 
        justify-content: space-between;
        padding: 10px; 
        border: 2px solid rgb(243, 247, 2); 
        margin: 0; 
        height: 30px; 
        background-color: rgb(13, 8, 41); 
    } 
</style>