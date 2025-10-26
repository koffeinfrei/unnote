<ActionBar {isSynced} on:newClicked>
  {#snippet left()}
  
      <button onclick={() => dispatch('showListClicked')} class="icon big invisible-lg" class:invisible={showList}>
        <ShowListIcon />
      </button>
    
  {/snippet}
</ActionBar>

<script>
  import { createEventDispatcher } from 'svelte'
  import ActionBar from './ActionBar.svelte'
  import ShowListIcon from './icons/material/arrow_back_FILL0_wght300_GRAD0_opsz24.svg.svelte'

  let { showList, isSynced } = $props();

  const dispatch = createEventDispatcher()
</script>
