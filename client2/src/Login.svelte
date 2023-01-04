<UserForm>
  <form on:submit={submit}>
    <Utf8 />

    <div class="flex one">
      <TextInput
        type="email"
        model="user"
        attribute="email"
        label="Email"
        on:change={setValue} />

      <TextInput
        type="password"
        model="user"
        attribute="password"
        label="Password"
        on:change={setValue} />

      {#if !alwaysRememberMe}
        <Checkbox model="user" attribute="remember_me" label="Remember me"
          on:change={setValue} />
      {/if}
   </div>

    <SubmitButton label="Log in" />
  </form>
</UserForm>

<script>
  import { push } from 'svelte-spa-router'
  import { ajax } from './ajax'
  import { scrollToTop } from './scroll'
  import { show, clear } from './flash'
  import { isAuthenticated } from './stores'
  import Flash from './Flash.svelte'
  import Navbar from './Navbar.svelte'
  import UserForm from './UserForm.svelte'
  import Utf8 from './form/Utf8.svelte'
  import TextInput from './form/TextInput.svelte'
  import Checkbox from './form/Checkbox.svelte'
  import SubmitButton from './form/SubmitButton.svelte'

  export let alwaysRememberMe

  let values

  const setValue = event => {
    values = { ...values, ...event.detail }
  }

  const submit = event => {
    event.preventDefault()

    ajax('/users/sign_in', 'POST', values)
      .then((data) => {
        clear('alert')
        $isAuthenticated = true
        push('/notes')
      })
      .catch(() => {
        show('alert', 'Sorry, that did not work. Did you enter a wrong username or a wrong password?')
      })
      .finally(scrollToTop)
  }
</script>
