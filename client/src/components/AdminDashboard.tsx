import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Download, 
  Users, 
  Database,
  LogOut,
  Calendar
} from 'lucide-react';
import type { IcUser } from '@shared/schema';
import { getAuthHeaders } from '@/lib/supabase';

interface AdminDashboardProps {
  authToken: string | null;
  onExportCSV: () => void;
  onLogout: () => void;
}

export default function AdminDashboard({ authToken, onExportCSV, onLogout }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<IcUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchUsers = async (search?: string) => {
    if (!authToken) return;
    
    const loadingState = search !== undefined ? setSearchLoading : setIsLoading;
    loadingState(true);
    
    try {
      const url = search ? `/api/admin/users?search=${encodeURIComponent(search)}` : '/api/admin/users';
      const response = await fetch(url, {
        headers: getAuthHeaders(authToken),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      loadingState(false);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [authToken]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchUsers(searchTerm);
      } else {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredUsers = users;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExportCSV = () => {
    console.log('Export CSV triggered');
    onExportCSV();
  };

  const handleLogout = () => {
    console.log('Logout triggered');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold" data-testid="text-admin-title">
                IC Registration Admin
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Registrations
                  </p>
                  <p className="text-2xl font-bold" data-testid="text-total-users">
                    {users.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Filtered Results
                  </p>
                  <p className="text-2xl font-bold" data-testid="text-filtered-users">
                    {filteredUsers.length}
                  </p>
                </div>
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Latest Registration
                  </p>
                  <p className="text-sm font-medium" data-testid="text-latest-registration">
                    {users.length > 0 
                      ? formatDate(users[users.length - 1]?.createdAt || '')
                      : 'No registrations'
                    }
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Export */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Registered Users</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by full name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-users"
                  />
                </div>
                <Button 
                  onClick={handleExportCSV}
                  disabled={users.length === 0}
                  data-testid="button-export-csv"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {(isLoading || searchLoading) ? (
              <div className="text-center py-8" data-testid="div-loading">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">{searchLoading ? 'Searching...' : 'Loading...'}</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8" data-testid="div-no-results">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No users match your search.' : 'No registered users yet.'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table data-testid="table-users">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Hash IC</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead className="text-right">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow key={user.id} data-testid={`row-user-${index}`}>
                        <TableCell className="font-mono text-sm">
                          <Badge variant="outline" data-testid={`badge-id-${index}`}>
                            {user.id.slice(0, 8)}...
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs" data-testid={`text-hash-${index}`}>
                          {user.hashIc.slice(0, 16)}...
                        </TableCell>
                        <TableCell className="font-medium" data-testid={`text-name-${index}`}>
                          {user.fullName}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground" data-testid={`text-date-${index}`}>
                          {formatDate(user.createdAt || '')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Security Notice */}
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 dark:text-amber-400">
                ⚠️
              </div>
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Admin Security Notice</p>
                <p>
                  Hash IC values are one-way encrypted and cannot be reversed to obtain original IC numbers. 
                  This ensures user privacy while maintaining system integrity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}