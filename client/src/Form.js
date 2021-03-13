import React from 'react';

export function TextInput(props) {
  return (
    <div>
      <label
        htmlFor={idValue(props)}
        className="control-label">{props.label}</label>

      <input
        type={props.type}
        id={idValue(props)}
        name={nameValue(props)}
        onChange={(e) => props.onChange(nameValue(props), e.target.value)} />
    </div>
  );
}

export function Checkbox(props) {
  return (
    <label htmlFor={idValue(props)}>
      <input
        type="checkbox"
        id={idValue(props)}
        name={nameValue(props)}
        onChange={(e) => props.onChange(nameValue(props), e.target.checked)} />

      <span className="checkable">{props.label}</span>
    </label>
  );
}

export function SubmitButton(props) {
  return (
    <input type="submit" value={props.label} />
  );
}

export function Utf8() {
  return (
    <input type="hidden" value="✓" name="utf8" />
  );
}

function idValue(props) {
  return `${props.model}_${props.attribute}`;
}

export function nameValue(props) {
  return `${props.model}[${props.attribute}]`;
}
