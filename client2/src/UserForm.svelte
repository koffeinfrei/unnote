<div class="flex center">
  <div class="hidden-sm"></div>

  <div class="full third-1000">
    {#if intro}
      <div class="card">
        <footer>
          {intro}
        </footer>
      </div>
    {/if}

    <slot></slot>

    <UserLinks />
  </div>

  <div class="hidden-sm"></div>
</div>

<script>
  import UserLinks from './UserLinks.svelte';

  export let intro
</script>
