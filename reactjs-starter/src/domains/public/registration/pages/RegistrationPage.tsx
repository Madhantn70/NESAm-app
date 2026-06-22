import React from 'react';
import { useRegistrationForm } from '../viewModel/useRegistrationForm';
import { RegistrationForm } from '../components/RegistrationForm';

export default function RegistrationPage() {
  const viewModel = useRegistrationForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <RegistrationForm {...viewModel} />
      </div>
    </div>
  );
}
