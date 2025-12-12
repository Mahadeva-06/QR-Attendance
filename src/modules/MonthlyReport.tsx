import { useState } from 'react';
import {
  Search,
  Calendar,
  FileText,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface MonthlyReportProps {
  searchQuery?: string;
  selectedBatch?: { name: string; code: string } | null;
}

export function MonthlyReport({ searchQuery = '', selectedBatch: _selectedBatch }: MonthlyReportProps = {}) {
  const [selectedMonth, setSelectedMonth] = useState('2018-12');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const daysInMonth = 31;
  const students = [
    { id: 1, name: 'Noori El Mansur', code: 'ACAMIS-02-1234-K5' },
    { id: 2, name: 'Terry Wallace', code: 'ACAMIS-02-1234-K5' },
    { id: 3, name: 'Joel Knight', code: 'ACAMIS-02-1234-K5' },
    { id: 4, name: 'Zachary Owens', code: 'ACAMIS-02-1234-K5' },
    { id: 5, name: 'Joel Gonzalez', code: 'ACAMIS-02-1234-K5' },
    { id: 6, name: 'Jerome Fisher', code: 'ACAMIS-02-1234-K5' },
    { id: 7, name: 'Ernest Reese', code: 'ACAMIS-02-1234-K5' },
    { id: 8, name: 'Bradley Barker', code: 'ACAMIS-02-1234-K5' },
  ];

  // Generate random attendance data for demo
  const generateAttendance = (studentId: number) => {
    const statuses = ['P', 'A', 'L', 'H'];
    // Use student ID as seed for consistent data
    const seed = studentId * 12345;
    return Array.from({ length: daysInMonth }, (_, i) =>
      statuses[(seed + i) % statuses.length]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'P':
        return 'bg-green-500 text-white';
      case 'A':
        return 'bg-red-500 text-white';
      case 'L':
        return 'bg-yellow-500 text-white';
      case 'H':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  const calculateStats = (attendance: string[]) => {
    return {
      present: attendance.filter((s) => s === 'P').length,
      absent: attendance.filter((s) => s === 'A').length,
      late: attendance.filter((s) => s === 'L').length,
      percentage: (
        (attendance.filter((s) => s === 'P').length / attendance.length) *
        100
      ).toFixed(1),
    };
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      student.code.toLowerCase().includes(localSearchQuery.toLowerCase())
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
              placeholder="Search students by name or code"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
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
        <div className="max-w-[1600px] mx-auto p-6">
          {/* Page Title and Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-gray-800 mb-1">
                  Monthly Attendance Report:{' '}
                  <span className="text-gray-600">BHM / BHM-2 / Semester 4 / B</span>
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <button className="hover:text-pink-500">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">Month</span>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border-none bg-transparent text-sm focus:outline-none"
                  />
                  <button className="hover:text-pink-500">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <Calendar className="w-4 h-4 text-pink-500" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">EXPORT REPORT</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">GO BACK</span>
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                  P
                </div>
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs">
                  A
                </div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs">
                  L
                </div>
                <span className="text-sm text-gray-600">Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
                  H
                </div>
                <span className="text-sm text-gray-600">Holiday</span>
              </div>
            </div>

            {/* Monthly Calendar Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-xs text-gray-500 uppercase sticky left-0 bg-white z-10">
                      Student Name
                    </th>
                    {Array.from({ length: daysInMonth }, (_, i) => (
                      <th key={i} className="text-center py-3 px-1 text-xs text-gray-500">
                        {i + 1}
                      </th>
                    ))}
                    <th className="text-center py-3 px-3 text-xs text-gray-500 uppercase">P</th>
                    <th className="text-center py-3 px-3 text-xs text-gray-500 uppercase">A</th>
                    <th className="text-center py-3 px-3 text-xs text-gray-500 uppercase">L</th>
                    <th className="text-center py-3 px-3 text-xs text-gray-500 uppercase">%</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const attendance = generateAttendance(student.id);
                    const stats = calculateStats(attendance);

                    return (
                      <tr
                        key={student.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-2 sticky left-0 bg-white z-10">
                          <div>
                            <div className="text-gray-800 text-sm">{student.name}</div>
                            <div className="text-xs text-gray-500">{student.code}</div>
                          </div>
                        </td>
                        {attendance.map((status, index) => (
                          <td key={index} className="py-3 px-1 text-center">
                            <div
                              className={`w-6 h-6 rounded flex items-center justify-center mx-auto ${getStatusColor(
                                status
                              )}`}
                            >
                              {status}
                            </div>
                          </td>
                        ))}
                        <td className="py-3 px-3 text-center text-green-600 font-semibold">
                          {stats.present}
                        </td>
                        <td className="py-3 px-3 text-center text-red-600 font-semibold">
                          {stats.absent}
                        </td>
                        <td className="py-3 px-3 text-center text-yellow-600 font-semibold">
                          {stats.late}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded ${
                              parseFloat(stats.percentage) >= 75
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {stats.percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
