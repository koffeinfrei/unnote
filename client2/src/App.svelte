<Router {routes} />

<script>
  import Router, { push } from 'svelte-spa-router';
  import {wrap} from 'svelte-spa-router/wrap';
  import { ajax } from './ajax';
  import { isAuthenticated } from './stores';
  import Login from './Login.svelte';
  import NoteEdit from './NoteEdit.svelte';

  const authenticate = async () => {
    if ($isAuthenticated) return true;

    try {
      await ajax('/users/is_authenticated')
      $isAuthenticated = true
      return true
    } catch (e) {
      push('/login')
      return false
    }
  }

  const routes = {
    '/login': wrap({
      component: Login,
      conditions: [
        async () => {
          const isAuthenticated = await authenticate()
          if (isAuthenticated) push('/notes')
          return true
        }
      ]
    }),
    '/notes/:id?': wrap({
      component: NoteEdit,
      props: { collection: 'notes' },
      conditions: [authenticate]
    }),
    '/': wrap({
      asyncComponent: () => {},
      conditions: [() => push('/notes')]
    })
  }
</script>
