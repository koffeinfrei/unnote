<nav>
  <Logo />

  {#if isLoggedIn && isApp}
    <SearchBox />
  {/if}

  <input id="bmenug" type="checkbox" class="show" bind:this={showHamburgerElement} />
  <label for="bmenug" class="burger pseudo button">&#8801;</label>

  <div class="menu">
    {#if isFeatureEnabled('tasks') && isApp}
      <a href="/notes" class="button pseudo menu-button" use:link use:active={{ path: /\/notes\/*.*/ }}>All notes</a>
    {/if}
    {#if isFeatureEnabled('tasks') && isApp}
      <a href="/task-notes" class="button pseudo menu-button" use:link use:active={{ path: /\/task-notes\/*.*/ }}>Task notes</a>
    {/if}
    {#if isFeatureEnabled('tasks') && isApp}
      <a href="/tasks" class="button pseudo menu-button" use:link use:active>Tasks</a>
    {/if}

    <button
      class="icon close-hamburger hidden-lg"
      on:click={handleCloseHamburgerClicked}>
      <CloseIcon />
    </button>

    {#if !isApp}
      {#if import.meta.env.VITE_APP_URL}
        <a href={import.meta.env.VITE_APP_URL} class="button pseudo menu-button">Go to app</a>
      {:else}
        <a href="/" class="button pseudo menu-button">Go to app</a>
      {/if}
    {/if}

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
  import CloseIcon from './icons/material/close_FILL0_wght300_GRAD0_opsz24_custom_color.svg.svelte'

  export let isLoggedIn
  export let isApp

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

  .burger
    color: $picnic-white

  nav
    text-align: center !important
    background: $picnic-primary !important

  .menu
    padding-top: $picnic-separation * 3
    background: $picnic-primary

    @include media('lg')
      padding-top: 0

  .menu-button
    color: $picnic-white

  .close-hamburger
    color: $picnic-white
    position: absolute
    top: $picnic-separation
    right: $picnic-separation
    display: inline
</style>
