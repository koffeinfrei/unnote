<Dialog
  title='Multiple tabs'
  text='You currently have unnote open in multiple tabs. Please close all but one of them.<br>Keeping multiple tabs active will likely lead to edit conflicts.'
  show={showDialog}
  showButtons={false}
  on:confirm={() => showDialog = false} />

<script>
  import { create, read, erase } from './cookie'
  import Dialog from './Dialog.svelte'

  let tabs = parseInt(read('dont-do-tabs') || 0)
  tabs += 1

  create('dont-do-tabs', tabs)

  window.addEventListener('beforeunload', () => {
    tabs = parseInt(read('dont-do-tabs') || 0)
    tabs -= 1

    if (tabs <= 0) {
      erase('dont-do-tabs')
    }
    else {
      create('dont-do-tabs', tabs)
    }
  })

  $: showDialog = tabs > 1
</script>
