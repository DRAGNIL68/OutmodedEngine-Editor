<script lang="ts">

    let {variant}: {variant: string} = $props();

</script>

<div class="div">
    <h1 class=text>
        {variant}
    </h1>
    <div class="div_2">
        <button class=text_right>edit</button>

        <button class=text_right>delete</button>
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
        color: white;
        
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