<button name="logout" on:click={handleClicked} class="icon-lg big pseudo logout tooltip-left" data-tooltip="Logout">
  <LogoutIcon />
  <span class="icon-lg-text">Logout</span>
</button>

<script>
  import { ajax } from './ajax'
  import { show } from './flash'
  import { scrollToTop } from './scroll'
  import LogoutIcon from './icons/material/logout_FILL0_wght300_GRAD0_opsz24_custom_color.svg.svelte'

  const handleClicked = (e) => {
    e.preventDefault()

    ajax('/users/sign_out', 'DELETE')
      .then(() => {
        window.location.reload()
      })
      .catch(() => {
        show('alert', 'Apologies, logging out did not happen.')
      })
      .finally(scrollToTop)
  }
</script>

<style lang="sass">
  @import './stylesheets/variables'

  .logout
    color: $picnic-white !important
</style>
