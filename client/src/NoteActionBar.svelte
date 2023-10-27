<ActionBar {isSynced} on:newClicked>
  <svelte:fragment slot="left">
    <button on:click={() => dispatch('showListClicked')} class="icon big invisible-lg" class:invisible={showList}>
      <ShowListIcon />
    </button>
  </svelte:fragment>
</ActionBar>

<script>
  import { createEventDispatcher } from 'svelte'
  import ActionBar from './ActionBar.svelte'
  import ShowListIcon from './icons/material/arrow_back_FILL0_wght300_GRAD0_opsz24.svg.svelte'

  export let showList
  export let isSynced

  const dispatch = createEventDispatcher()
</script>
