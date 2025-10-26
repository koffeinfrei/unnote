{#if note}
  <div
    style:background-image={`url(${noteImage || defaultImage})`}
    class="list-item-picture"
    class:with-default={!noteImage}
    class:with-image={noteImage}
    ></div>
{/if}

<script>
  import noteDefault from './icons/material/notes_FILL0_wght300_GRAD0_opsz24.svg'
  import taskDefault from './icons/material/checklist_FILL0_wght300_GRAD0_opsz24.svg'

  let { note } = $props();

  let noteImage = $state()
  let defaultImage = $state()

  const getPreviewImageUrl = (note) => {
    var match = note.content.match(/<img.*? src=['"]([^'"]+)['"].*?>/)
    if (match) {
      return match[1]
    }
    else {
      return null
    }
  }
  $effect(() => {
    if (note) {
      noteImage = getPreviewImageUrl(note)

      if (!noteImage) {
        defaultImage = note.hasTasks() ? taskDefault : noteDefault
      }
    }
  });
</script>

<style lang="sass">
  @import './stylesheets/variables'

  $picture-size: 2.5em

  .list-item-picture
    width: $picture-size
    height: $picture-size
    border: $picnic-border
    border-radius: 50%
    margin-right: $picnic-separation * 2
    flex: 0 0 $picture-size
    opacity: 0.5

  .with-default
    background-repeat: no-repeat
    background-position: center

  .with-image
    background-repeat: no-repeat
    background-size: cover
</style>
