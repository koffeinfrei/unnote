<div class="action-bar">
  {#if left}{@render left()}{:else}
    <div class="icon big invisible"></div>
  {/if}

  <SaveStateLabel {isSynced} />

  <button name="new" data-tooltip="Create note" onclick={() => newClicked()} class="icon big tooltip-top-left">
    <NewIcon />
  </button>
</div>

<script>
  import SaveStateLabel from './SaveStateLabel.svelte'
  import NewIcon from './icons/material/add_FILL0_wght300_GRAD0_opsz24.svg.svelte'

  let { isSynced, left, newClicked } = $props();
</script>

<style lang="sass">
  @import './stylesheets/variables'

  .action-bar
    display: flex
    justify-content: space-between
    align-items: center
    padding: 0 $picnic-separation $picnic-separation $picnic-separation
    @include media('lg')
      padding: 0 $picnic-separation $picnic-separation * 2 $picnic-separation
    text-align: center
</style>
