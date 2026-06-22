import { useState } from 'react';
import { CreateDFCFormState, CreateDFCViewModel } from '../model/CreateDFC';

export const useCreateDFC = (): CreateDFCViewModel => {
  const [state, setState] = useState<CreateDFCFormState>({
    alumniName: '',
    batchYear: '',
    dueDate: '',
    description: '',
    photo: null,
  });

  const updateField = (field: keyof CreateDFCFormState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const submitForm = () => {
    console.log('Form submitted:', state);
  };

  const cancel = () => {
    console.log('Form cancelled');
  };

  return {
    state,
    actions: { updateField, submitForm, cancel },
  };
};
