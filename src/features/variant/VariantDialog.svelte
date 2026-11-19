<script lang="ts">
</script>

<div class="div">
    <div class="div_2">        
    </div>
</div>

<style>
    .div { 
        display: flex; 
        flex-direction: column; /* Stacks the "add" button row and options row vertically */
        align-items: stretch;   /* Ensures child rows span the full width */
        justify-content: flex-start; /* Aligns items to the top instead of spreading them across the 600px height */
        gap: 15px;              /* Adds clean separation between the "add" button and the options div */
        padding: 10px; 
        border: 2px solid rgb(243, 247, 2); 
        margin: 0; 
        height: 600px; 
        background-color: rgb(13, 8, 41); 
    }

    .div_2 {
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
    }
</style>