import { useState } from 'react';
import AdminDashboard from '../AdminDashboard';
import type { IcUser } from '@shared/schema';

// TODO: remove mock functionality
const mockUsers: IcUser[] = [
  {
    id: 'uuid-1',
    hashIc: 'a1b2c3d4e5f6789012345678901234567890abcdef123456789012345678901234',
    fullName: 'AHMAD BIN ALI',
    createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
  },
  {
    id: 'uuid-2', 
    hashIc: 'b2c3d4e5f6789012345678901234567890abcdef123456789012345678901234a',
    fullName: 'SITI BINTI HASSAN',
    createdAt: new Date('2024-01-16T14:45:00Z').toISOString(),
  },
  {
    id: 'uuid-3',
    hashIc: 'c3d4e5f6789012345678901234567890abcdef123456789012345678901234ab',
    fullName: 'LIM WEI MING',
    createdAt: new Date('2024-01-17T09:15:00Z').toISOString(),
  },
];

export default function AdminDashboardExample() {
  const [users] = useState<IcUser[]>(mockUsers);
  const [isLoading] = useState(false);

  const handleExportCSV = () => {
    console.log('Exporting CSV with', users.length, 'users');
    // Mock CSV export
    const csvContent = [
      'ID,Hash IC,Full Name,Created At',
      ...users.map(user => 
        `${user.id},${user.hashIc},${user.fullName},${user.createdAt}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ic-registrations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    console.log('Admin logout triggered');
  };

  return (
    <AdminDashboard 
      users={users}
      onExportCSV={handleExportCSV}
      onLogout={handleLogout}
      isLoading={isLoading}
    />
  );
}