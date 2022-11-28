<Router {routes} />

<script>
  import Router, {push} from 'svelte-spa-router';
  import {wrap} from 'svelte-spa-router/wrap';
  import { ajax } from './ajax';
  import { isAuthenticated } from './stores';
  import Login from './Login.svelte';
  import NoteEdit from './NoteEdit.svelte';

  const routes = {
    '/login': Login,
    '/notes/:id': wrap({
      component: NoteEdit,
      props: { collection: 'notes' }
    }),
    '/notes/':  wrap({
      component: NoteEdit,
      props: { collection: 'notes' }
    }),
  }

  // TODO: remove
  // window.API_HOST = 'http://mykonote.local:3001'

  const authenticate = () => {
    ajax('/users/is_authenticated')
    .then(() => {
      $isAuthenticated = true
    })
    .catch(() => push('/login'));
  }

  $: if ($isAuthenticated === undefined) authenticate()
  $: if ($isAuthenticated) push('/notes')
</script>

<style>
</style>
