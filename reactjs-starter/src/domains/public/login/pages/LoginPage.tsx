import React from 'react';
import { useLoginForm } from '../viewModel/useLoginForm';
import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  const viewModel = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <LoginForm {...viewModel} />
      </div>
    </div>
  );
}
