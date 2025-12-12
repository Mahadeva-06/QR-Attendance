import { useState } from 'react';
import { ChevronDown, Save, Plus, Trash2 } from 'lucide-react';

interface Rule {
  lateThreshold: number;
  minAttendance: number;
  autoGenerateReport: boolean;
}

interface Holiday {
  date: string;
  name: string;
}

export function AttendanceRules() {
  const [rules, setRules] = useState<Rule>({
    lateThreshold: 15,
    minAttendance: 75,
    autoGenerateReport: true,
  });

  const [holidays, setHolidays] = useState<Holiday[]>([
    { date: '2018-12-25', name: 'Christmas' },
    { date: '2019-01-01', name: 'New Year' },
    { date: '2019-01-26', name: 'Republic Day' },
  ]);

  const [newHoliday, setNewHoliday] = useState({ date: '', name: '' });

  const addHoliday = () => {
    if (newHoliday.date && newHoliday.name) {
      setHolidays([...holidays, newHoliday]);
      setNewHoliday({ date: '', name: '' });
    }
  };

  const deleteHoliday = (index: number) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  const handleSaveRules = () => {
    // Handle save logic here
    console.log('Rules saved:', rules);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <h2 className="text-gray-800">Attendance Rules</h2>
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
        <div className="max-w-[1000px] mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Attendance Configuration Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-gray-800 mb-4 font-semibold">Attendance Configuration</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Mark Late if Delayed by (minutes)</label>
                  <input
                    type="number"
                    value={rules.lateThreshold}
                    onChange={(e) => setRules({ ...rules, lateThreshold: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Students arriving after this time will be marked as late</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Minimum Attendance Required (%)</label>
                  <input
                    type="number"
                    value={rules.minAttendance}
                    onChange={(e) => setRules({ ...rules, minAttendance: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Students below this will be flagged</p>
                </div>
              </div>
            </div>

            {/* Automation Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-semibold">Automation</h3>
              </div>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={rules.autoGenerateReport}
                  onChange={(e) => setRules({ ...rules, autoGenerateReport: e.target.checked })}
                  className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <div>
                  <div className="text-sm text-gray-800">Auto-generate Monthly Report</div>
                  <div className="text-xs text-gray-500">Automatically create attendance reports at end of each month</div>
                </div>
              </label>
            </div>

            {/* Holiday List Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-semibold">Holiday List</h3>
                <button
                  onClick={addHoliday}
                  disabled={!newHoliday.date || !newHoliday.name}
                  className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add Holiday
                </button>
              </div>

              {/* New Holiday Input */}
              <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="date"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Select date"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newHoliday.name}
                      onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Holiday name"
                    />
                  </div>
                </div>
              </div>

              {/* Holiday List */}
              <div className="space-y-2">
                {holidays.map((holiday, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="date"
                      value={holiday.date}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      readOnly
                    />
                    <input
                      type="text"
                      value={holiday.name}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      readOnly
                    />
                    <button
                      onClick={() => deleteHoliday(index)}
                      className="p-2 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveRules}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors shadow-lg"
              >
                <Save className="w-4 h-4" />
                SAVE RULES
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
