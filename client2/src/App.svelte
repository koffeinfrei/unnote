<Router {routes} />

<script>
  import Router, { push } from 'svelte-spa-router';
  import {wrap} from 'svelte-spa-router/wrap';
  import { ajax } from './ajax';
  import { isAuthenticated } from './stores';
  import Login from './Login.svelte';
  import NoteEdit from './NoteEdit.svelte';

  const routes = {
    '/login': Login,
    '/notes/:id?': wrap({
      component: NoteEdit,
      props: { collection: 'notes' }
    }),
    '/': wrap({
      asyncComponent: () => {},
      conditions: [() => push('/notes')]
    })
  }

  const authenticate = () => {
    ajax('/users/is_authenticated')
    .then(() => {
      $isAuthenticated = true
    })
    .catch(() => push('/login'));
  }

  $: if ($isAuthenticated === undefined) authenticate()
</script>

<style>
</style>
