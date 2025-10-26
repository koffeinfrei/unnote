<ActionBar {isSynced} {newClicked}>
  {#snippet left()}

      <button onclick={() => showListClicked()} class="icon big invisible-lg" class:invisible={showList}>
        <ShowListIcon />
      </button>

  {/snippet}
</ActionBar>

<script>
  import ActionBar from './ActionBar.svelte'
  import ShowListIcon from './icons/material/arrow_back_FILL0_wght300_GRAD0_opsz24.svg.svelte'

  let { showList, isSynced, showListClicked, newClicked } = $props();
</script>
