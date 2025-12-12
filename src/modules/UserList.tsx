import { useState } from 'react';
import { Search, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';
import { navigate } from '../utils/navigator';

interface User {
  id: number;
  name: string;
  role: 'Admin' | 'Teacher' | 'Staff';
  email: string;
  phone: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
}

export function UserList() {
  const [searchQuery, setSearchQuery] = useState('');

  const users: User[] = [
    { id: 1, name: 'Sadiq Ahmed', role: 'Admin', email: 'sadiq@acamis.edu', phone: '+91 98765 43210', lastLogin: '2018-12-06 12:30', status: 'Active' },
    { id: 2, name: 'Dr. Rajesh Kumar', role: 'Teacher', email: 'rajesh@acamis.edu', phone: '+91 98765 43211', lastLogin: '2018-12-06 10:15', status: 'Active' },
    { id: 3, name: 'Prof. Anjali Sharma', role: 'Teacher', email: 'anjali@acamis.edu', phone: '+91 98765 43212', lastLogin: '2018-12-05 16:45', status: 'Active' },
    { id: 4, name: 'Rahul Verma', role: 'Staff', email: 'rahul@acamis.edu', phone: '+91 98765 43213', lastLogin: '2018-12-06 09:20', status: 'Active' },
    { id: 5, name: 'Priya Patel', role: 'Staff', email: 'priya@acamis.edu', phone: '+91 98765 43214', lastLogin: '2018-12-04 14:30', status: 'Inactive' },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">12:31pm, 2018-12-06</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full overflow-hidden flex items-center justify-center">
              <span className="text-white text-xs font-bold">SA</span>
            </div>
            <span className="text-sm">Hi Sadiq</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-gray-800 mb-1">User Management</h1>
                <p className="text-sm text-gray-500">Manage system users and access</p>
              </div>
              <button
                onClick={() => navigate('add-user')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                ADD USER
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-blue-100 mb-1">Total Users</div>
                <div className="text-2xl">{users.length}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-green-100 mb-1">Active Users</div>
                <div className="text-2xl">{users.filter((u) => u.status === 'Active').length}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-purple-100 mb-1">Admins</div>
                <div className="text-2xl">{users.filter((u) => u.role === 'Admin').length}</div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Name</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Role</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Phone</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Last Login</th>
                    <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Status</th>
                    <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-800">{user.name}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs ${
                            user.role === 'Admin'
                              ? 'bg-red-100 text-red-700'
                              : user.role === 'Teacher'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{user.phone}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{user.lastLogin}</td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs ${
                            user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
