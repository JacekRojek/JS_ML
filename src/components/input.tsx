import * as React from 'react';

type InputProps = {
  label: string;
  onChange: Function;
  value: string
}

const getID = (label:string) => label.replace(' ', '-')

const Input = ({label, onChange, value}:InputProps) => (
  <div>
  <label htmlFor={getID(label)}>{label}</label>
    <input
      onChange={e => onChange(e.target.value)}
      placeholder="100"
      type="number"
      name={getID(label)}
      id={getID(label)}
      value={value}
      ></input>
  </div>
)

export {Input}