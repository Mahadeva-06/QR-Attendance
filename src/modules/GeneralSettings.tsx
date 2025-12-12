import { useState } from 'react';
import { ChevronDown, Save, Upload } from 'lucide-react';

export function GeneralSettings() {
  const [settings, setSettings] = useState({
    schoolName: 'ACAMIS - Academy Management System',
    address: 'Mumbai, Maharashtra, India',
    phone: '+91 98765 43210',
    email: 'info@acamis.edu',
    academicYear: '2018-2019',
    timezone: 'Asia/Kolkata',
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <h2 className="text-gray-800">General Settings</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">12:31pm, 2018-12-06</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full overflow-hidden flex items-center justify-center">
              <span className="text-white text-xs font-bold">SA</span>
            </div>
            <span className="text-sm">Hi Sadiq</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-[1000px] mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-gray-800 mb-6">System Configuration</h1>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-gray-800 mb-4">School Logo</h3>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <span className="text-3xl">★</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">School Name</label>
                <input
                  type="text"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Phone</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Academic Year</label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-2">Address</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors shadow-lg">
                <Save className="w-4 h-4" />
                SAVE SETTINGS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
