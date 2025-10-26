<label for={idValue(model, attribute)}>
  <input
    type="checkbox"
    id={idValue(model, attribute)}
    name={nameValue(model, attribute)}
    onchange={(e) => change({ [nameValue(model, attribute)]: e.target.checked })} />

  <span class="checkable">{label}</span>
</label>

<script>
  import { idValue, nameValue } from '../form'

  let { model, attribute, label, change } = $props();
</script>
