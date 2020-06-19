
import React from 'react';
import InputBaseFactory from '../factories/form/InputBaseFactory';
import InputBase from '../components/form/InputBase';

//
// UPON PROJECT START, DEFINE A COMPONENT AS A CLONE OF THE BASE COMPONENT.
// THEN, IF NEED BE, THE COMPONENT CAN BE MODIFIED LATER.
//
const InputOriginal = InputBase;


//
// THIS FACTORY ALLOWS US TO DEFINE A ONE-TIME OVERRIDE OF THE BASE COMPONENT'S RENDER METHOD
//
const Input = InputBaseFactory(({ name, label, error }) => {
  const input = (
    <input
      name={name}
      style={{ marginTop: 20, marginBottom: 20 }}
    />
  );
  return (
    <div>
      <p>
        {label ? (
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ padding: 20 }}>
              {label}
            </span>
            &nbsp;
            {input}
          </label>
        ) : (
          input
        )}
      </p>
      {!!error && (
        <p style={{ color: 'cyan' }}>{error}</p>
      )}
    </div>
  );
});


const InputExamplePage = () => {
  return (
    <div>
      <h2>Vanilla Input Components:</h2>
      <InputOriginal name="one" label="one" />
      <InputOriginal name="two" label="two" />
      <InputOriginal name="three" label="three" error="Error on three" />

      <h2>Modified Input Components:</h2>
      <Input name="four" label="four" />
      <Input name="five" label="five" />
      <Input name="six" label="six" error="Error on six" />
    </div>
  );
};

export default InputExamplePage;
