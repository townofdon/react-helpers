
import React from 'react';

enum ButtonType {
  button,
  submit,
  reset,
}

interface Props {
  type: keyof typeof ButtonType;
};

const ButtonBase: React.FC<Props> = ({
  children,
  type,
}) => {
  return (
    <button
      type={type}
    >
      {children}
    </button>
  );
};

export default ButtonBase;
