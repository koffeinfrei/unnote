<div class="modal">
  <input id={id} type="checkbox" checked={show} onChange={() => {}} />
  <label htmlFor={id} class="overlay"></label>
  <article>
    <header>
      <h3>{title}</h3>
      <label htmlFor={id} class="close" on:click={handleCancelButtonClick}>&times;</label>
    </header>
    <section class="content">
      {@html text}
    </section>
    <footer>
      <button class="button" on:click={handleOkButtonClick}>Ok</button>
      <label htmlFor={id} class="button dangerous" on:click={handleCancelButtonClick}>
        Cancel
      </label>
    </footer>
  </article>
</div>

<script>
  import { createEventDispatcher } from 'svelte';
  import Mousetrap from 'mousetrap'

  export let title
  export let text
  export let show

  const id = Math.random().toString(16).slice(-12);

  const dispatch = createEventDispatcher();

  const handleOkButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch('confirm', true);
  }

  const handleCancelButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch('confirm', false);
  }

  $: {
    if (show) {
      Mousetrap.bind('enter', (e) => {
        e.preventDefault();
        dispatch('confirm', true);
      });

      Mousetrap.bind('esc', () => {
        dispatch('confirm', false);
      });
    }
    else {
      Mousetrap.unbind('enter');
      Mousetrap.unbind('esc');
    }
  }
</script>
