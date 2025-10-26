<div class="flex center">
  <div class="hidden-sm"></div>

  <div class="full third-1000">
    {#if intro}
      <div class="card">
        <footer>
          {@render intro?.()}
        </footer>
      </div>
    {/if}

    {@render children?.()}

    <UserLinks />
  </div>

  <div class="hidden-sm"></div>
</div>

<script>
  import UserLinks from './UserLinks.svelte'
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [intro]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { intro, children } = $props();
</script>
