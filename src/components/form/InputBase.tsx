
import React from 'react';
import { RenderFnc } from '../../_types';

interface LabelProps {
  label?: string;
}

interface ErrorProps {
  error?: string;
}

export type InputBaseProps = ErrorProps & ErrorProps & {
  name: string;
  label?: string;
  innerRef?: React.Ref<React.ReactElement>;
}

interface InputRefProps {
  labelJsx?: React.ReactElement;
  inputJsx?: React.ReactElement;
  errorJsx?: React.ReactElement;
};

export type InputProps = InputBaseProps & {
  render?: RenderFnc<InputBaseProps & InputRefProps>;
  renderLabel?: RenderFnc<LabelProps>;
  renderInput?: RenderFnc<InputBaseProps>;
  renderError?: RenderFnc<ErrorProps>;
};

const InputBase: React.FC<InputProps> = ({
  name,
  label,
  error,
  render,
  renderLabel,
  renderInput,
  renderError,
  innerRef,
}) => {

  const labelJsx = renderLabel
    ? renderLabel({ label })
    : (
      !!label ? (
        <p>
          <label>
            {label}
          </label>
        </p>
      ) : null
    );

  const inputJsx = renderInput
    ? renderInput({ name, label, innerRef })
    : (
      <p>
        <input name={name} />
      </p>
    );
  
  const errorJsx = renderError
    ? renderError({ error })
    : (
      !!error ? (
        <p style={{ color: "red" }}>
          {error}
        </p>
      ) : null
    );

  if (render) return render({
    name,
    label,
    innerRef,
    labelJsx,
    inputJsx,
    errorJsx,
  });

  return (
    <div>
      {labelJsx}
      {inputJsx}
      {errorJsx}
    </div>
  );
};

export default InputBase;
