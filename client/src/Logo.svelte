<a href="/" class="brand">
  <div class="logo">
    {#if showSpinner}
      <Spinner />
    {:else}
      <LogoImage />
    {/if}
  </div>
</a>

<script>
  import { onMount, onDestroy } from 'svelte'
  import Spinner from './Spinner.svelte'
  import EventHive from './EventHive'
  import LogoImage from './images/logo.svg.svelte'

  let showSpinner = $state(false)
  let spinnerSubscription

  onMount(() => {
    spinnerSubscription = EventHive.subscribe('spinner.toggle', (data) => {
      showSpinner = data.show
    })
  })

  onDestroy(() => {
    spinnerSubscription.remove()
  })
</script>

<style lang="sass">
  :global
    svg
      height: 100%
</style>
