
import React from 'react';
import InputBase, { InputBaseProps, InputProps } from '../../components/form/InputBase';
import { RenderFnc } from '../../_types';

const InputBaseFactory = (render: RenderFnc<InputBaseProps>): React.FC<InputProps> => {
  return (props) => InputBase({ render, ...props });
};

export default InputBaseFactory;
