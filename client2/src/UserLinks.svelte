<div>
  <a class="btn btn-info btn-link btn-no-padding" href="/register" use:link use:active={{className: 'hidden'}}>Register</a>
  <a class="btn btn-info btn-link btn-no-padding" href="/login" use:link use:active={{className: 'hidden'}}>Login</a>
</div>

<script>
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
</script>
