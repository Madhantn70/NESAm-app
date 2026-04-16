import React from 'react';
import { useMemberImpact } from '../viewModel/useMemberImpact';
import { MemberImpactView } from '../components/MemberImpactView';

export default function MemberImpactPage() {
  const viewModel = useMemberImpact();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">MemberImpact</h1>
      <MemberImpactView {...viewModel} />
    </div>
  );
}
