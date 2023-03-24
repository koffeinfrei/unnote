<div class="flex center">
  <div class="hidden-sm"></div>

  <div class="full third-1000">
    {#if $$slots.intro}
      <div class="card">
        <footer>
          <slot name="intro"></slot>
        </footer>
      </div>
    {/if}

    <slot></slot>

    <UserLinks />
  </div>

  <div class="hidden-sm"></div>
</div>

<script>
  import UserLinks from './UserLinks.svelte'
</script>
