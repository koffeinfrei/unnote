<div class="action-bar">
  <slot name="left">
    <div class="icon big invisible"></div>
  </slot>

  <SaveStateLabel {isSynced} />

  <button name="new" data-tooltip="Create note" on:click={() => dispatch('newClicked')} class="icon big tooltip-top-left">
    <NewIcon />
  </button>
</div>

<script>
  import { createEventDispatcher } from 'svelte'
  import SaveStateLabel from './SaveStateLabel.svelte'
  import NewIcon from './icons/material/add_FILL0_wght300_GRAD0_opsz24.svg.svelte'

  export let isSynced

  const dispatch = createEventDispatcher()
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
