<nav>
  <Logo />

  {#if isLoggedIn}
    <SearchBox on:searchEnter on:searchCleared />
  {/if}

  <input id="bmenug" type="checkbox" class="show" bind:this={showHamburgerElement} />
  <label htmlFor="bmenug" class="burger pseudo button">&#8801;</label>

  <div class="menu">
    {#if isFeatureEnabled('tasks')}
      <NavLink to="/notes" class="button pseudo">All notes</NavLink>
    {/if}
    {#if isFeatureEnabled('tasks')}
      <NavLink to="/task-notes" class="button pseudo">Task notes</NavLink>
    {/if}
    {#if isFeatureEnabled('tasks')}
      <NavLink to="/tasks" class="button pseudo">Tasks</NavLink>
    {/if}

    <button
      class="icon close-hamburger hidden-lg"
      on:click={handleCloseHamburgerClicked}>
      <CloseIcon />
    </button>

    {#if isLoggedIn}
      <Logout />
    {/if}
  </div>
</nav>

<script>
  import Logo from './Logo.svelte';
  import Logout from './Logout.svelte';
  import SearchBox from './SearchBox.svelte';
  import { isFeatureEnabled } from './feature';
  import CloseIcon from './icons/material/close-24px.svg.svelte';

  export let isLoggedIn

  let showHamburgerElement

  const handleCloseHamburgerClicked = () => {
    showHamburgerElement.checked = false;
  }
</script>

<style lang="sass">
  @import './stylesheets/variables'

  // picnic fix to expand buttons in the hamburger menu
  nav .burger ~ .menu > *
    width: 100%

    @include media('lg')
      width: auto

  // make sure that the `.icon` and `.icon-big` defintions from App.sass take
  // precedence over picnic's more specific selector
  nav .burger ~ .menu > *
    &.icon, &.icon-big
      width: auto

  nav
    text-align: center !important
    background: $picnic-primary !important

  .menu
    padding-top: $picnic-separation * 3

    @include media('lg')
      padding-top: 0

  .close-hamburger
    position: absolute
    top: $picnic-separation
    right: $picnic-separation
    display: inline
</style>
