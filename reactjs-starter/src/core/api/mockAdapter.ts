import MockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios';

// We will import and call domain-specific mock registries here later
import { registerRegistrationMocks } from '../../domains/public/registration/api/mock';
import { registerLoginMocks } from '../../domains/public/login/api/mock';
import { registerMemberHomeMocks } from '../../domains/member/home/api/mock';
import { registerMemberContributionsMocks } from '../../domains/member/contributions/api/mock';
import { registerMemberImpactMocks } from '../../domains/member/impact/api/mock';
import { registerAdminDashboardMocks } from '../../domains/admin/dashboard/api/mock';

export const setupMocks = (client: AxiosInstance) => {
  const mockAdapter = new MockAdapter(client, { delayResponse: 400 });

  // Register domain mocks
  registerRegistrationMocks(mockAdapter);
  registerLoginMocks(mockAdapter);
  
  // Stubs
  registerMemberHomeMocks(mockAdapter);
  registerMemberContributionsMocks(mockAdapter);
  registerMemberImpactMocks(mockAdapter);
  registerAdminDashboardMocks(mockAdapter);

  return mockAdapter;
};
