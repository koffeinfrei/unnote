<nav>
  <Logo />

  {#if isLoggedIn}
    <SearchBox />
  {/if}

  <input id="bmenug" type="checkbox" class="show" bind:this={showHamburgerElement} />
  <label for="bmenug" class="burger pseudo button">&#8801;</label>

  <div class="menu">
    {#if isFeatureEnabled('tasks')}
      <a href="/notes" class="button pseudo" use:link use:active={{ path: '/notes/*' }}>All notes</a>
    {/if}
    {#if isFeatureEnabled('tasks')}
      <a href="/task-notes" class="button pseudo" use:link use:active={{ path: '/task-notes/*' }}>Task notes</a>
    {/if}
    {#if isFeatureEnabled('tasks')}
      <a href="/tasks" class="button pseudo" use:link use:active>Tasks</a>
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
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
  import Logo from './Logo.svelte'
  import Logout from './Logout.svelte'
  import SearchBox from './SearchBox.svelte'
  import { isFeatureEnabled } from './feature'
  import CloseIcon from './icons/material/close-24px.svg.svelte'

  export let isLoggedIn

  let showHamburgerElement

  const handleCloseHamburgerClicked = () => {
    showHamburgerElement.checked = false
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
    &.icon
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
