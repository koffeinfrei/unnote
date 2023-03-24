{#if isSynced}
  <div class="save-state saved">Saved</div>
{:else}
  <div class="save-state saving">Saving</div>
{/if}

<script>
  export let isSynced
</script>

<style lang="sass">
  @import './stylesheets/variables'

  .save-state
    font-size: $font-size-sm
    text-transform: uppercase

    &.saved
      color: $picnic-success

    &.saving
      color: $picnic-warning
</style>
