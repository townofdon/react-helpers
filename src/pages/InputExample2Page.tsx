
import React from 'react';
import InputBaseAlt, { configInputBase } from '../components/form/InputBaseAlt';

const Input = InputBaseAlt;

//
// SOMEWHERE IN PROJECT CONFIG OR PROJECT ROOT, SET DEFAULTS FOR INPUT COMPONENT
//

configInputBase.setLabelComponent(({ label }) => {
  if (!label) return null;
  return (
    <p>
      {label}
    </p>
  );
});
configInputBase.setInputComponent(({ name, label }) => {
  const input = (
    <input
      name={name}
      style={{ marginTop: 20, marginBottom: 20 }}
    />
  );
  return (
    label ? (
      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ padding: 20 }}>
          {label}
        </span>
        &nbsp;
        {input}
      </label>
    ) : (
      input
    )
  );
});
configInputBase.setContainerComponent(({ children }) => {
  return (
    <p>{children}</p>
  );
})

const InputExample2Page = () => {
  return (
    <div>
      <h2>Modified Input Components:</h2>
      <Input label="Four" name="four" />
      <Input label="Five" name="five" />
      <Input label="Six" name="six" />
    </div>
  );
};

export default InputExample2Page;
