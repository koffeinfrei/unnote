{#if note}
  <div
    style:background-image={`url(${getPreviewImageUrl(note) || defaultNotePicture})`}
    style:background-repeat="no-repeat"
    style:background-size="cover"
    class="list-item-picture"></div>
{/if}

<script>
  import defaultNotePicture from './icons/material/short_text-24px.svg'

  export let note

  const getPreviewImageUrl = (note) => {
    var match = note.content.match(/<img.*? src=['"]([^'"]+)['"].*?>/)
    if (match) {
      return match[1]
    }
    else {
      return null
    }
  }
</script>

<style lang="sass">
  @import './stylesheets/variables'

  /* TODO extract to variables (same as in NoteList */
  $picture-size: 2.5em

  .list-item-picture
    width: $picture-size
    height: $picture-size
    border: $picnic-border
    border-radius: 50%
    margin-right: $picnic-separation * 2
    flex: 0 0 $picture-size
    opacity: 0.5
</style>
