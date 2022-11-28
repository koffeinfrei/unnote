<a href="/" class="brand">
  {#if showSpinner}
    <div class="logo">
      <Spinner />
    </div>
  {:else}
    <LogoImage class="logo" />
  {/if}
</a>

<script>
  import Spinner from './Spinner.svelte';
  import EventHive from './EventHive';
  import LogoImage from './images/logo.svg.svelte';

  export let showSpinner = false
</script>
