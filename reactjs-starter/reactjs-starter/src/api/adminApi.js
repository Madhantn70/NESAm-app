import axios from 'axios';

const ADMIN_API_BASE = 'http://localhost:5000';

/**
 * Fetch admin dashboard data from the backend.
 * Reads JWT from localStorage and sends it as Bearer token.
 */
export async function fetchAdminDashboard() {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${ADMIN_API_BASE}/api/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}
