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
  import Spinner from './Spinner.svelte';
  import EventHive from './EventHive';
  import LogoImage from './images/logo.svg.svelte';

  export let showSpinner = false
</script>

<style lang="sass">
  :global
    svg
      height: 100%
</style>
