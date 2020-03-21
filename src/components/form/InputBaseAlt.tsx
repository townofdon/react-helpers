
import React from 'react';
import { AnyComponent } from '../../_types';

type ErrorProps = {
  error?: string;
}
type LabelProps = ErrorProps & {
  label?: string;
}
type ContainerProps = {
  children: React.ReactChildren | React.ReactChildren[] | React.ReactChild | React.ReactChild[];
}
type InputBaseProps = LabelProps & {
  name: string;
  label?: string;
  value?: string | number;
  innerRef?: any;
};

export type InputProps = InputBaseProps & ErrorProps;

const DefaultLabel: React.FC<LabelProps> = ({ label }) => (
  !!label ? (
    <p>
      <label>
        {label}
      </label>
    </p>
  ) : null
);

const DefaultInput: React.FC<InputBaseProps> = ({ name, innerRef }) => (
  <p>
    <input name={name} ref={innerRef} />
  </p>
);

const DefaultError: React.FC<ErrorProps> = ({ error }) => (
  !!error ? (
    <p style={{ color: 'red' }}>
      {error}
    </p>
  ) : null
);

const DefaultContainer: React.FC<ContainerProps> = ({ children }) => (
  <div>
    {children}
  </div>
);

class ConfigInputBase {
  private componentLabel = DefaultLabel;
  private componentInput = DefaultInput;
  private componentError = DefaultError;
  private componentContainer = DefaultContainer;
  
  public setLabelComponent(component: AnyComponent<LabelProps>): void {
    this.componentLabel = component;
  }
  public setInputComponent(component: AnyComponent<InputProps>): void {
    this.componentInput = component;
  }
  public setErrorComponent(component: AnyComponent<ErrorProps>): void {
    this.componentError = component;
  }
  public setContainerComponent(component: AnyComponent<ContainerProps>): void {
    this.componentContainer = component;
  }
  public _getLabelComponent(): AnyComponent<LabelProps> {
    return this.componentLabel;
  }
  public _getInputComponent(): AnyComponent<InputProps> {
    return this.componentInput;
  }
  public _getErrorComponent(): AnyComponent<ErrorProps> {
    return this.componentError;
  }
  public _getContainerComponent(): AnyComponent<ContainerProps> {
    return this.componentContainer;
  }
}

const config = new ConfigInputBase();

const InputBase: React.FC<InputProps> = ({
  name,
  label,
  value,
  error,
  innerRef,
}) => {
  const Label = config._getLabelComponent();
  const Input = config._getInputComponent();
  const Error = config._getErrorComponent();
  const Container = config._getContainerComponent();

  return (
    <Container>
      <Label
        label={label}
        error={error}
      />
      <Input
        name={name}
        label={label}
        innerRef={innerRef}
        value={value}
        error={error}
      />
      <Error
        error={error}
      />
    </Container>
  );
};

export const configInputBase = config;
export default InputBase;
