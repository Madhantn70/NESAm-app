export interface CreateDFCFormState {
  alumniName: string;
  batchYear: string;
  dueDate: string;
  description: string;
  photo: string | null;
}

export interface CreateDFCActions {
  updateField: (field: keyof CreateDFCFormState, value: string) => void;
  submitForm: () => void;
  cancel: () => void;
}

export interface CreateDFCViewModel {
  state: CreateDFCFormState;
  actions: CreateDFCActions;
}
