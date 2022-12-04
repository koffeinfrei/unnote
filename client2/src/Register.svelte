<Navbar isLoggedIn={false} />
<main>
  <Flash />
  <UserForm>
    <form on:submit={handleFormSubmit}>
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

        <TextInput
          type="password"
          model="user"
          attribute="password_confirmation"
          label="Confirm password"
          on:change={setValue} />
      </div>

      <SubmitButton label="Register" />
    </form>

    <svelte:fragment slot="intro">
      <p>
        You can register for a <strong>free account</strong> which <strong>limits</strong> you to <strong>100 notes</strong>.
        <br/>
        This free hosting service is sponsored by <a href="https://www.panter.ch">Panter AG</a>.
      </p>
      <p>
        Alternatively you may <a href="https://github.com/panter/mykonote">get the source code from
        GitHub</a> and install it on a server on your own.
      </p>
    </svelte:fragment>
  </UserForm>
</main>

<script>
  import { ajax } from './ajax';
  import { show, clear } from './flash';
  import { scrollToTop } from './scroll';
  import { isAuthenticated } from './stores';
  import TextInput from './form/TextInput.svelte';
  import SubmitButton from './form/SubmitButton.svelte';
  import Utf8 from './form/Utf8.svelte';
  import Navbar from './Navbar.svelte';
  import Flash from './Flash.svelte';
  import UserForm from './UserForm.svelte';

  let values

  const setValue = event => {
    values = { ...values, ...event.detail };
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    ajax('/users', 'POST', values)
      .then((data) => {
        clear('alert');
        $isAuthenticated = true
        push('/notes')
        show('notice',
          'Great! Glad you made it!<br>' +
            'You have been subscribed to the <strong>free plan</strong> which ' +
            '<strong>limits</strong> you to have <strong>100 notes</strong>.'
        )
      })
      .catch((error) => {
        const errors = error.responseJson.errors.join('<br>');

        show('alert', 'Sorry, that did not work. You need to fix your inputs:<br>' + errors);
      })
      .finally(scrollToTop);
  }
</script>
