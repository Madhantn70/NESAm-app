import React from 'react';
import { useMemberContributions } from '../viewModel/useMemberContributions';
import { MemberContributionsView } from '../components/MemberContributionsView';

export default function MemberContributionsPage() {
  const viewModel = useMemberContributions();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">MemberContributions</h1>
      <MemberContributionsView {...viewModel} />
    </div>
  );
}
