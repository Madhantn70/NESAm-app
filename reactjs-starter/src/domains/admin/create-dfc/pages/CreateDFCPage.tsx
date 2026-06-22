import React from 'react';
import { useCreateDFC } from '../viewModel/useCreateDFC';
import { CreateDFCView } from '../components/CreateDFCView';

export const CreateDFCPage: React.FC = () => {
  const viewModel = useCreateDFC();

  return <CreateDFCView viewModel={viewModel} />;
};

export default CreateDFCPage;
