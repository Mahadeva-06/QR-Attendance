import { useState } from 'react';
import {
  Search,
  ChevronDown,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
} from 'lucide-react';

export function SummaryReport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2018-12-06');

  const batchSummary = [
    {
      batch: 'BHM / BHM-2 / Semester 4 / A',
      totalStudents: 42,
      presentToday: 38,
      absentToday: 4,
      avgAttendance: 90.5,
      trend: 'up' as const,
    },
    {
      batch: 'BHM / BHM-2 / Semester 4 / B',
      totalStudents: 45,
      presentToday: 40,
      absentToday: 5,
      avgAttendance: 88.9,
      trend: 'down' as const,
    },
    {
      batch: 'BHM / BHM-2 / Semester 4 / C',
      totalStudents: 37,
      presentToday: 35,
      absentToday: 2,
      avgAttendance: 94.6,
      trend: 'up' as const,
    },
    {
      batch: 'BHM / BHM-1 / Semester 6 / A',
      totalStudents: 48,
      presentToday: 45,
      absentToday: 3,
      avgAttendance: 93.8,
      trend: 'up' as const,
    },
    {
      batch: 'BHM / BHM-1 / Semester 6 / B',
      totalStudents: 50,
      presentToday: 42,
      absentToday: 8,
      avgAttendance: 84.0,
      trend: 'down' as const,
    },
  ];

  const topAbsentStudents = [
    {
      name: 'Joel Gonzalez',
      code: 'ACAMIS-02-1238-K5',
      batch: 'BHM-2/Sem 4/B',
      absentDays: 12,
      percentage: 61.2,
    },
    {
      name: 'Ernest Reese',
      code: 'ACAMIS-02-1240-K5',
      batch: 'BHM-2/Sem 4/C',
      absentDays: 10,
      percentage: 67.7,
    },
    {
      name: 'Bradley Barker',
      code: 'ACAMIS-02-1241-K5',
      batch: 'BHM-2/Sem 4/B',
      absentDays: 9,
      percentage: 70.9,
    },
    {
      name: 'Marcus Reed',
      code: 'ACAMIS-02-1242-K5',
      batch: 'BHM-1/Sem 6/B',
      absentDays: 8,
      percentage: 74.2,
    },
    {
      name: 'David Chen',
      code: 'ACAMIS-02-1243-K5',
      batch: 'BHM-1/Sem 6/A',
      absentDays: 7,
      percentage: 77.4,
    },
  ];

  const topPresentStudents = [
    {
      name: 'Joel Knight',
      code: 'ACAMIS-02-1236-K5',
      batch: 'BHM-2/Sem 4/B',
      presentDays: 31,
      percentage: 100,
    },
    {
      name: 'Noori El Mansur',
      code: 'ACAMIS-02-1234-K5',
      batch: 'BHM-2/Sem 4/B',
      presentDays: 30,
      percentage: 96.8,
    },
    {
      name: 'Jerome Fisher',
      code: 'ACAMIS-02-1239-K5',
      batch: 'BHM-2/Sem 4/B',
      presentDays: 30,
      percentage: 96.8,
    },
    {
      name: 'Terry Wallace',
      code: 'ACAMIS-02-1235-K5',
      batch: 'BHM-2/Sem 4/B',
      presentDays: 29,
      percentage: 93.5,
    },
    {
      name: 'Sarah Johnson',
      code: 'ACAMIS-02-1244-K5',
      batch: 'BHM-1/Sem 6/A',
      presentDays: 29,
      percentage: 93.5,
    },
  ];

  const monthlyData = [
    { month: 'Aug', present: 85, absent: 15 },
    { month: 'Sep', present: 88, absent: 12 },
    { month: 'Oct', present: 90, absent: 10 },
    { month: 'Nov', present: 87, absent: 13 },
    { month: 'Dec', present: 89, absent: 11 },
  ];

  const totalPresent = batchSummary.reduce((sum, batch) => sum + batch.presentToday, 0);
  const totalAbsent = batchSummary.reduce((sum, batch) => sum + batch.absentToday, 0);
  const totalStudents = batchSummary.reduce((sum, batch) => sum + batch.totalStudents, 0);
  const overallPercentage = ((totalPresent / totalStudents) * 100).toFixed(1);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search batch or student"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-gray-800 mb-1">Summary Report</h1>
                <p className="text-sm text-gray-500">
                  High-level attendance overview and insights
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-600">Date</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border-none bg-transparent text-sm focus:outline-none"
                  />
                  <Calendar className="w-4 h-4 text-pink-500" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">EXPORT REPORT</span>
                </button>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-blue-100 mb-1">Total Students</div>
                <div className="text-2xl">{totalStudents}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-green-100 mb-1">Present Today</div>
                <div className="text-2xl">{totalPresent}</div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-red-100 mb-1">Absent Today</div>
                <div className="text-2xl">{totalAbsent}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-sm text-purple-100 mb-1">Attendance %</div>
                <div className="text-2xl">{overallPercentage}%</div>
              </div>
            </div>

            {/* Batch-wise Summary */}
            <div className="mb-6">
              <h2 className="text-gray-800 mb-4">Batch-wise Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">
                        Batch / Class
                      </th>
                      <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">
                        Total Students
                      </th>
                      <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">
                        Present Today
                      </th>
                      <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">
                        Absent Today
                      </th>
                      <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">
                        Avg Attendance %
                      </th>
                      <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchSummary.map((batch, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-gray-800">{batch.batch}</td>
                        <td className="py-4 px-4 text-center text-gray-700">
                          {batch.totalStudents}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                            {batch.presentToday}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
                            {batch.absentToday}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded text-sm ${
                              batch.avgAttendance >= 75
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {batch.avgAttendance}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {batch.trend === 'up' ? (
                            <TrendingUp className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts and Top/Bottom Lists */}
            <div className="grid grid-cols-3 gap-6">
              {/* Month-wise Chart */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm text-gray-700 mb-4">Month-wise Attendance</h3>
                <div className="flex items-end justify-between gap-2 h-48">
                  {monthlyData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col gap-0.5">
                        <div
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                          style={{ height: `${data.present * 1.5}px` }}
                        ></div>
                        <div
                          className="w-full bg-gradient-to-t from-red-500 to-red-400"
                          style={{ height: `${data.absent * 3}px` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{data.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Absent Students */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm text-gray-700 mb-4">Top 5 Most Absent</h3>
                <div className="space-y-3">
                  {topAbsentStudents.map((student, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-800 truncate">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.batch}</div>
                      </div>
                      <div className="text-xs text-red-600">{student.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Present Students */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm text-gray-700 mb-4">Top 5 Most Present</h3>
                <div className="space-y-3">
                  {topPresentStudents.map((student, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-800 truncate">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.batch}</div>
                      </div>
                      <div className="text-xs text-green-600">{student.percentage}%</div>
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
