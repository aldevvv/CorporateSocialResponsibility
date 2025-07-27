// app/dashboard/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog as Dialog,
  AlertDialogContent as DialogContent,
  AlertDialogHeader as DialogHeader,
  AlertDialogTitle as DialogTitle,
  AlertDialogTrigger as DialogTrigger,
  AlertDialogFooter as DialogFooter
} from '@/components/ui/alert-dialog';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  UserPlus,
  Shield,
  User,
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  UserCheck
} from 'lucide-react';

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchUsers();
        setIsCreateDialogOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'USER' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          ...(formData.password && { password: formData.password })
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        setFormData({ name: '', email: '', password: '', role: 'USER' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Open edit dialog
  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      password: '',
      role: user.role
    });
    setIsEditDialogOpen(true);
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    return role === 'ADMIN' ? 'default' : 'secondary';
  };

  const getRoleIcon = (role: string) => {
    return role === 'ADMIN' ? Shield : User;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center animate-pulse">
            <Users className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-900">Memuat data users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manajemen Users</h1>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Kelola pengguna sistem PLN UIP Kota Makassar
                  </p>
                </div>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Tambah User</span>
                    <span className="sm:hidden">Tambah</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Tambah User Baru
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama user"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Masukkan email user"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Masukkan password"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={(value: 'ADMIN' | 'USER') => setFormData({ ...formData, role: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700">
                      Simpan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admin Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'ADMIN').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Regular Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'USER').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari user berdasarkan nama atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={roleFilter} onValueChange={(value: 'ALL' | 'ADMIN' | 'USER') => setRoleFilter(value)}>
                  <SelectTrigger className="border-0 bg-gray-50/50 focus:bg-white">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Role</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Users className="h-5 w-5" />
              Daftar Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-900">User</TableHead>
                    <TableHead className="font-semibold text-gray-900 hidden sm:table-cell">Email</TableHead>
                    <TableHead className="font-semibold text-gray-900">Role</TableHead>
                    <TableHead className="font-semibold text-gray-900 hidden md:table-cell">Dibuat</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name || 'N/A'}</p>
                              <p className="text-sm text-gray-500 sm:hidden">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getRoleBadgeVariant(user.role)} 
                            className="flex items-center gap-1 w-fit"
                          >
                            <RoleIcon className="h-3 w-3" />
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada user ditemukan</h3>
                <p className="text-gray-500">
                  {searchTerm || roleFilter !== 'ALL' 
                    ? 'Coba ubah filter atau kata kunci pencarian'
                    : 'Belum ada user yang terdaftar'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit User
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nama</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama user"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Masukkan email user"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-password">Password (kosongkan jika tidak ingin mengubah)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password baru"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value: 'ADMIN' | 'USER') => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleUpdateUser} className="bg-blue-600 hover:bg-blue-700">
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}