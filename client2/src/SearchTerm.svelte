{#if searchTerm}
  <div class="search-term">Showing results for "{searchTerm}"</div>
{/if}

<script>
  export let searchTerm
</script>

<style lang="sass">
  @import './stylesheets/variables'

  .search-term
    font-size: $font-size-md
    color: $gray
    margin-bottom: $picnic-separation
</style>
