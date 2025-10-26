{#if showLoadMoreButton && !showSpinner}
  <button name="load-more" class='icon big center tooltip-top-left' data-tooltip="Load more notes" onclick={handleLoadMoreClick}>
    <MoreIcon />
  </button>
{/if}

{#if showSpinner}
  <div class="icon big center">
    <Spinner />
  </div>
{/if}

<script>
  import MoreIcon from './icons/material/expand_more_FILL0_wght300_GRAD0_opsz24.svg.svelte'
  import Spinner from './Spinner.svelte'

  let { showSpinner, showLoadMoreButton, loadMore } = $props();

  const handleLoadMoreClick = (e) => {
    e.preventDefault()
    e.currentTarget.blur()

    loadMore()
  }
</script>

<style lang="sass">
  .center
    display: block
    margin: auto
</style>
