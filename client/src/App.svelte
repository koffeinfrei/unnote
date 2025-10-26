<Navbar isLoggedIn={$isAuthenticated} {isApp} />
<main>
  {#if !isPwa() && isApp && $isAuthenticated}
    <MultipleTabs />
  {/if}
  <Flash />
  <Router {routes} />
</main>

<script>
  import Router, { push, replace, location } from 'svelte-spa-router'
  import { wrap } from 'svelte-spa-router/wrap'
  import { ajax } from './ajax'
  import { isAuthenticated } from './stores'
  import Login from './Login.svelte'
  import Register from './Register.svelte'
  import NoteEdit from './NoteEdit.svelte'
  import TaskEdit from './TaskEdit.svelte'
  import Flash from './Flash.svelte'
  import Navbar from './Navbar.svelte'
  import MultipleTabs from './MultipleTabs.svelte'
  import { isPwa } from './capabilities'

  let isApp = $derived(!window.IS_LANDING_PAGE)

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
      asyncComponent: () => import('./LandingPage.svelte'),
        conditions: [
          async () => {
            if (isApp) {
              replace('/notes')
            } else {
              authenticate()
              return true
            }
          }
        ]
    })
  }
</script>
