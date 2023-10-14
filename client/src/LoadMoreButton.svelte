{#if showLoadMoreButton && !showSpinner}
  <button name="load-more" class='icon big center tooltip-top-left' data-tooltip="Load more notes" on:click={handleLoadMoreClick}>
    <MoreIcon />
  </button>
{/if}

{#if showSpinner}
  <div class="icon big center">
    <Spinner />
  </div>
{/if}

<script>
  import { createEventDispatcher } from 'svelte'
  import MoreIcon from './icons/material/expand_more-24px.svg.svelte'
  import Spinner from './Spinner.svelte'

  export let showSpinner
  export let showLoadMoreButton

  const dispatch = createEventDispatcher()

  const handleLoadMoreClick = (e) => {
    e.preventDefault()
    e.currentTarget.blur()

    dispatch('loadMore')
  }
</script>

<style lang="sass">
  .center
    display: block
    margin: auto
</style>
