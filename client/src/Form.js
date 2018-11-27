import React from 'react';

export function TextInput(props) {
  return (
    <div className="form-group">
      <label
        htmlFor={idValue(props)}
        className="control-label">{props.label}</label>

      <input
        type={props.type}
        id={idValue(props)}
        name={nameValue(props)}
        className="string form-control"
        onChange={(e) => props.onChange(nameValue(props), e.target.value)} />
    </div>
  );
}

export function Checkbox(props) {
  return (
    <div className="form-group">
      <div className="checkbox">
        <label htmlFor={idValue(props)}>
          <input
            type="checkbox"
            id={idValue(props)}
            name={nameValue(props)}
            onChange={(e) => props.onChange(nameValue(props), e.target.checked)} />

          {props.label}
        </label>
      </div>
    </div>
  );
}

export function SubmitButton(props) {
  return (
    <input
      type="submit"
      className="btn btn-raised btn-primary btn-info"
      value={props.label} />
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

function nameValue(props) {
  return `${props.model}[${props.attribute}]`;
}
