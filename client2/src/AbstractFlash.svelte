{#if message}
  <div class="flex center">
    <div class="hidden-sm"></div>

    <div class='full third-1000'>
      <div class={getCssClass()}>
        <footer>
          {@html message}
        </footer>
        <button class="close icon" type="button" on:click={handleClose}>×</button>
      </div>
    </div>

    <div class="hidden-sm"></div>
  </div>
{/if}

<script>
  import { onMount, onDestroy } from 'svelte';
  import { getEventName } from './flash';

  export let name
  export let addtionalCssClass
  export let message

  const getCssClass = () => {
    var cssClasses = ['card', addtionalCssClass];

    return cssClasses.join(' ');
  }

  const handleClose = () => {
    message = null;
  }

  onMount(() => {
    // listen on global event so we can use `NoticeFlash.show('hello')`
    document.addEventListener(getEventName(name), handleEvent, false);
  })

  onDestroy(() => {
    document.removeEventListener(getEventName(name), handleEvent, false);
  })

  const handleEvent = (e) => {
    message = e.detail.message;
  }

  // const show = (message) => {
  //   const e = new CustomEvent(getEventName(), { detail: { message: message } });
  //   document.dispatchEvent(e);
  // }
  //
  // const clear = () => {
  //   const e = new CustomEvent(getEventName(), { detail: { message: null } });
  //   document.dispatchEvent(e);
  // }
</script>
