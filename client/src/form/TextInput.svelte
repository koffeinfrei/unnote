<div>
  <label
    for={idValue(model, attribute)}
    class="control-label">{label}</label>

  <input
    type={type}
    id={idValue(model, attribute)}
    name={nameValue(model, attribute)}
      onchange={(e) => change({ [nameValue(model, attribute)]:  e.target.value})} />
</div>

<script>
  import { idValue, nameValue } from '../form'

  let {
    model,
    attribute,
    type,
    label,
    change
  } = $props();
</script>
