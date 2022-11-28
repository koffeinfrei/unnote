<div>
  <label
    for={idValue(model, attribute)}
    class="control-label">{label}</label>

  <input
    type={type}
    id={idValue(model, attribute)}
    name={nameValue(model, attribute)}
      on:change={(e) => dispatch('change', { [nameValue(model, attribute)]:  e.target.value})} />
</div>

<script>
  import { createEventDispatcher } from 'svelte'
  import { idValue, nameValue } from '../form'

  export let model
  export let attribute
  export let type
  export let label

  const dispatch = createEventDispatcher()
</script>
