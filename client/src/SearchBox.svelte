<div class="search vertically-aligned">
  <input
    type="text"
    class="search-input"
    name="search"
    value={$searchTerm}
    on:keyup={handleSearchEnterDebounced}
    on:focus={() => isActive = true}
    on:blur={() => isActive = false}
    bind:this={searchInput}
    />

  {#if $searchTerm}
    <button
      type="button"
      class="search-clear"
      on:click={handleSearchCleared}>×</button>
  {/if}

  {#if !isActive && !$searchTerm}
    <div class="search-icon">
      <SearchIcon />
    </div>
  {/if}
</div>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { debounce } from 'throttle-debounce'
  import { searchTerm } from './stores'
  import EventHive from './EventHive'
  import SearchIcon from './icons/material/search_FILL0_wght300_GRAD0_opsz24.svg.svelte'

  export let isActive = false

  const dispatch = createEventDispatcher()

  let searchInput
  let searchSubscription

  const handleSearchEnter = (e) => {
    $searchTerm = e.target.value
  }
  const handleSearchEnterDebounced = debounce(500, handleSearchEnter)

  const handleSearchCleared = (e) => {
    e.target.blur()
    $searchTerm = ''
  }

  const subscribeSearch = () => {
    searchSubscription = EventHive.subscribe('search.focus', () => {
      searchInput.focus()
    })
  }

  const unsubscribeSearch = () => {
    searchSubscription.remove()
  }

  onMount(subscribeSearch)

  onDestroy(unsubscribeSearch)
</script>

<style lang="sass">
  @import './stylesheets/variables'

  .search
    display: inline-block
    width: 65%
    max-width: 400px
    font-size: 0.9em

    @include media('lg')
      position: absolute !important
      left: calc(50% - (400px / 2))

    .search-input
      padding-right: $picnic-separation * 3
      border: none

    .search-clear
      position: absolute
      right: 0
      margin: 0
      background: transparent
      color: $picnic-black

      &:hover
        background: transparent

    .search-icon
      position: absolute
      height: $icon-size-lg
      width: $icon-size-lg
      left: $picnic-separation
      top: calc(50% - (#{$icon-size-lg}) / 2)
      opacity: 0.5
</style>
