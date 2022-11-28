<NoticeFlash />
<AlertFlash />

<script>
  import NoticeFlash from './NoticeFlash.svelte';
  import AlertFlash from './AlertFlash.svelte';
</script>
<style lang="sass">
  @import './stylesheets/variables'

  .card.warning
    padding-right: $picnic-separation * 2
    border-color: $picnic-warning
    background: transparentize($picnic-warning, 0.9)

  .card.success
    padding-right: $picnic-separation * 2
    border-color: $picnic-success
    background: transparentize($picnic-success, 0.9)
</style>
