import { useState } from 'react';
import { ChevronDown, Calendar, TrendingUp } from 'lucide-react';

export function BatchAttendanceSummary() {
  const [selectedBatch, setSelectedBatch] = useState('bhm-2-sem4-b');

  const weeklyData = [85, 88, 92, 89, 91, 87, 90];
  const monthlyData = [
    { month: 'Aug', attendance: 85 },
    { month: 'Sep', attendance: 88 },
    { month: 'Oct', attendance: 90 },
    { month: 'Nov', attendance: 87 },
    { month: 'Dec', attendance: 89 },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <h2 className="text-gray-800">Batch Attendance Summary</h2>
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
              <label className="block text-sm text-gray-600 mb-2">Select Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="bhm-2-sem4-b">BHM / BHM-2 / Semester 4 / B</option>
                <option value="bhm-2-sem4-a">BHM / BHM-2 / Semester 4 / A</option>
                <option value="bhm-1-sem6-a">BHM / BHM-1 / Semester 6 / A</option>
              </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-blue-100 mb-1">Total Students</div>
                <div className="text-2xl">45</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-green-100 mb-1">Avg Attendance</div>
                <div className="text-2xl">88.9%</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-orange-100 mb-1">This Week</div>
                <div className="text-2xl">91.2%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-purple-100 mb-1">This Month</div>
                <div className="text-2xl">89.5%</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              {/* Weekly Chart */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-500" />
                  Weekly Attendance Trend
                </h3>
                <div className="flex items-end justify-between gap-2 h-48">
                  {weeklyData.map((value, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-pink-500 to-red-400 rounded-t"
                        style={{ height: `${value}%` }}
                      ></div>
                      <div className="text-xs text-gray-500">Day {idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Chart */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm text-gray-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-pink-500" />
                  Monthly Attendance Trend
                </h3>
                <div className="flex items-end justify-between gap-2 h-48">
                  {monthlyData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                        style={{ height: `${data.attendance}%` }}
                      ></div>
                      <div className="text-xs text-gray-500">{data.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
