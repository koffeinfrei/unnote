<label for={idValue(model, attribute)}>
  <input
    type="checkbox"
    id={idValue(model, attribute)}
    name={nameValue(model, attribute)}
    on:change={(e) => dispatch('change', { [nameValue(model, attribute)]: e.target.checked })} />

  <span class="checkable">{label}</span>
</label>

<script>
  import { createEventDispatcher } from 'svelte'
  import { idValue, nameValue } from '../form'

  export let model
  export let attribute
  export let label

  const dispatch = createEventDispatcher()
</script>
