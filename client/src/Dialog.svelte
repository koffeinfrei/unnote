<div class="modal">
  <input id={id} type="checkbox" checked={show} />
  <label for={id} class="overlay"></label>
  <article>
    <header>
      <h3>{title}</h3>
      <label for={id} class="close" onclick={handleCancelButtonClick}>&times;</label>
    </header>
    <section class="content">
      {@html text}
    </section>
    <footer>
      {#if showButtons}
        <button class="button" onclick={handleOkButtonClick}>Ok</button>
        <label for={id} class="button dangerous" onclick={handleCancelButtonClick}>
          Cancel
        </label>
      {/if}
    </footer>
  </article>
</div>

<script>
  import { createEventDispatcher } from 'svelte'
  import Mousetrap from 'mousetrap'

  let {
    title,
    text,
    show,
    showButtons = true
  } = $props();

  const id = Math.random().toString(16).slice(-12)

  const dispatch = createEventDispatcher()

  const handleOkButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch('confirm', true)
  }

  const handleCancelButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch('confirm', false)
  }

  $effect(() => {
    if (show) {
      Mousetrap.bind('enter', (e) => {
        e.preventDefault()
        dispatch('confirm', true)
      })

      Mousetrap.bind('esc', () => {
        dispatch('confirm', false)
      })
    }
    else {
      Mousetrap.unbind('enter')
      Mousetrap.unbind('esc')
    }
  });
</script>
