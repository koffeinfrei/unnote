<div class="search vertically-aligned">
  <input
    type="text"
    class="search-input"
    name="search"
    {value}
    on:keyup={handleSearchEnterDebounced}
    on:focus={() => isActive = true}
    on:blur={() => isActive = false}
    bind:this={searchInput}
    />

  {#if value !== ''}
    <button
      type="button"
      class="search-clear"
      on:click={handleSearchCleared}>×</button>
  {/if}

  {#if !isActive && value === ''}
    <div class="search-icon">
      <SearchIcon />
    </div>
  {/if}
</div>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { debounce } from 'throttle-debounce';
  import EventHive from './EventHive';
  import SearchIcon from './icons/material/search_black_24dp.svg.svelte';

  export let value = ''
  export let isActive = false

  const dispatch = createEventDispatcher();

  let searchInput
  let searchSubscription

  onMount(() => {
    subscribeSearch();
  })

  onDestroy(() => {
    unsubscribeSearch();
  })

  // TODO check if ok
  const handleSearchEnter = (e) => {
    value = e.target.value;
    dispatch('searchEnter', value)
    // handleSearchEnterDebounced();
  }
  const handleSearchEnterDebounced = debounce(500, handleSearchEnter);

  // handleSearchEnterDebounced() {
  //   this.props.handleSearchEnter(this.state.value);
  // }

  const handleSearchCleared = (e) => {
    e.target.blur();
    value = '';
    dispatch('searchClear');
  }

  const subscribeSearch = () => {
    searchSubscription = EventHive.subscribe('search.focus', () => {
      searchInput.focus();
    });
  }

  const unsubscribeSearch = () => {
    searchSubscription.remove();
  }
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
