import React from 'react';
import { useMemberHome } from '../viewModel/useMemberHome';
import { MemberHomeView } from '../components/MemberHomeView';

export default function MemberHomePage() {
  const viewModel = useMemberHome();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">MemberHome</h1>
      <MemberHomeView {...viewModel} />
    </div>
  );
}
