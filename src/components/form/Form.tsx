
import React from 'react';
import {Form as FormikForm, Formik, FormikProps, FormikValues, FormikHelpers} from 'formik';

type Props = FormikProps<FormikValues> & {
  children: React.ReactChild;
  onSubmit: (values: FormikValues, formikBag: FormikHelpers<FormikValues>) => void;
};

const Form: React.FC<Props> = ({ children, onSubmit, ...props }) => {
  return (
    <Formik
      onSubmit={onSubmit}
      {...props}
    >
      <FormikForm>
        {children}
      </FormikForm>
    </Formik>
  );
};

export default Form;
