
import React, { useRef } from 'react';
import Form from '../components/form/Form';
import { useField } from 'formik';
import InputMask from '../utils/InputMask';

// NOTE - normally, <Input> component would be defined in a separate file.
interface InputProps {
  label?: string,
  name: string,
  inputMask?: InputMask,
  placeholder?: string,
}
const Input: React.FC<InputProps> = ({ label, inputMask, placeholder, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const inputRef = useRef(null);

  const onChange = (ev) => {
    let value = ev.target.value;
    if (!inputMask) {
      helpers.setValue(value);
      helpers.setTouched(true);
      return;
    }
    // determine if a char was just deleted
    if (
      inputRef.current &&
      inputRef.current._prevValue &&
      inputRef.current._prevValue.length - ev.target.value.length === 1
    ) {
      value = inputRef.current._prevRawValue.substring(0, inputRef.current._prevRawValue.length - 1);
    }
    const maskedValue = inputMask.mask(value);
    const rawValue = inputMask.unmask(value);
    helpers.setTouched(true);
    helpers.setValue(maskedValue);
    if (!inputRef.current) return;
    inputRef.current._prevValue = maskedValue;
    inputRef.current._prevRawValue = rawValue;
    inputRef.current._prevEventValue = value;
  };

  return (
    <p style={{ marginTop: 0, marginBottom: 20 }}>
      <label style={{ display: 'block', marginBottom: 10 }}>
        <strong>
          {label}
        </strong>
      </label>
      <input
        {...field}
        ref={inputRef}
        onChange={onChange}
        placeholder={(inputMask && inputMask.placeholder) || placeholder}
        style={{ marginBottom: 10 }}
      />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </p>
  );
};

const inputMaskPhone = new InputMask({ mask: '[1 ](000) 000-0000' });
const inputMaskCreditCard = new InputMask({ mask: '0000 0000 0000 0000' });
const inputMaskNumber = new InputMask({ mask: Number });
const inputMaskDate = new InputMask({ mask: Date, datePattern: "mm dd yyyy", delimiter: "-" });

const InputMaskPage = () => {
  const onSubmit = (values) => {
    console.log(values);
  }
  const initialValues = {
    phone: "",
    creditCard: "",
    number: "",
    date: "",
  };
  return (
    <div>
      <h2>Input Masking:</h2>
      <br/>
      <Form onSubmit={onSubmit} initialValues={initialValues}>
        <Input inputMask={inputMaskPhone} label="Phone Number" name="phone" />
        <Input inputMask={inputMaskCreditCard} label="Credit Card" name="creditCard" />
        <Input inputMask={inputMaskNumber} label="Number" name="number" />
        <Input inputMask={inputMaskDate} label="Date" name="date" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};

export default InputMaskPage;
