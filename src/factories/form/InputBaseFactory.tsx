
import React from 'react';
import InputBase, { InputBaseProps } from '../../components/form/InputBase';
import { RenderFnc } from '../../_types';

const InputBaseFactory = (render: RenderFnc<InputBaseProps>): React.FC<InputBaseProps> => {
  return (props) => InputBase({ render, ...props });
};

export default InputBaseFactory;
