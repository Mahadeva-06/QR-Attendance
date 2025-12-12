import { ChevronDown, Shield, Check } from 'lucide-react';

interface RolePermissions {
  [key: string]: boolean;
}

interface Role {
  name: string;
  description: string;
  permissions: RolePermissions;
}

export function RolesPermissions() {
  const roles: Role[] = [
    {
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: {
        'View Attendance': true,
        'Edit Attendance': true,
        'Export Reports': true,
        'Manage Students': true,
        'Manage Batches': true,
        'Manage Users': true,
        'System Settings': true,
        'Backup & Restore': true,
      },
    },
    {
      name: 'Teacher',
      description: 'Can view and manage attendance for assigned classes',
      permissions: {
        'View Attendance': true,
        'Edit Attendance': true,
        'Export Reports': true,
        'Manage Students': false,
        'Manage Batches': false,
        'Manage Users': false,
        'System Settings': false,
        'Backup & Restore': false,
      },
    },
    {
      name: 'Staff',
      description: 'Limited access for viewing reports only',
      permissions: {
        'View Attendance': true,
        'Edit Attendance': false,
        'Export Reports': false,
        'Manage Students': false,
        'Manage Batches': false,
        'Manage Users': false,
        'System Settings': false,
        'Backup & Restore': false,
      },
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <h2 className="text-gray-800">Roles & Permissions</h2>
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
        <div className="max-w-[1200px] mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <h1 className="text-gray-800 mb-1">Manage Roles & Permissions</h1>
              <p className="text-sm text-gray-500">Define what each role can access in the system</p>
            </div>

            {/* Roles Grid */}
            <div className="space-y-6">
              {roles.map((role, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Role Header */}
                  <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-gray-800 font-semibold">{role.name}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Permissions Grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-3">
                      {Object.entries(role.permissions).map(([permission, granted]) => (
                        <div
                          key={permission}
                          className={`p-3 rounded-lg border-2 ${
                            granted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-gray-700">{permission}</span>
                            {granted && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
