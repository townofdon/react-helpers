
import React from 'react';
import { RenderFnc } from '../../_types';

export type InputBaseProps = {
  name: string;
  label?: string;
  error?: string;
}

export type InputProps = InputBaseProps & {
  render?: RenderFnc<InputBaseProps>,
};

const InputBase: React.FC<InputProps> = ({
  name,
  label,
  error,
  render,
}) => {

  if (render) return render({
    name,
    label,
    error,
  });

  return (
    <div>
      {!!label && (
        <p>
          <label>
            {label}
          </label>
        </p>
      )}
      <input
        name={name}
      />
      {!!error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default InputBase;
