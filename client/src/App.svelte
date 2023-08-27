<Navbar isLoggedIn={$isAuthenticated} isApp={$location !== '/www'} />
<main>
  {#if !isPwa()}
    <MultipleTabs />
  {/if}
  <Flash />
  <Router {routes} />
</main>

<script>
  import Router, { push, location } from 'svelte-spa-router'
  import { wrap } from 'svelte-spa-router/wrap'
  import { ajax } from './ajax'
  import { isAuthenticated } from './stores'
  import LandingPage from './LandingPage.svelte'
  import Login from './Login.svelte'
  import Register from './Register.svelte'
  import NoteEdit from './NoteEdit.svelte'
  import TaskEdit from './TaskEdit.svelte'
  import Flash from './Flash.svelte'
  import Navbar from './Navbar.svelte'
  import MultipleTabs from './MultipleTabs.svelte'
  import { isPwa } from './capabilities'

  $: console.log('location', $location)

  const authenticate = async () => {
    if ($isAuthenticated === true) return true
    if ($isAuthenticated === false) return false

    try {
      await ajax('/users/is_authenticated')
      $isAuthenticated = true
      return true
    } catch (e) {
      $isAuthenticated = false
      return false
    }
  }

  const authenticateOrRedirect = async () => {
    const isAuthenticated = await authenticate()
    if (!isAuthenticated) push('/login')
    return isAuthenticated
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
    '/register': wrap({
      component: Register,
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
      conditions: [authenticateOrRedirect]
    }),
    '/task-notes/:id?': wrap({
      component: NoteEdit,
      props: { collection: 'task_notes' },
      conditions: [authenticateOrRedirect]
    }),
    '/tasks/:id?': wrap({
      component: TaskEdit,
      conditions: [authenticateOrRedirect]
    }),
    '/': wrap({
      asyncComponent: () => {},
      conditions: [() => push('/notes')]
    }),
    '/www': wrap({
      component: LandingPage,
      conditions: [
        async () => {
          // don't `await` so the landing page is shown directly. the UI
          // regarding auth status will update async later.
          authenticate()
          return true
        }
      ]
    })
  }
</script>
