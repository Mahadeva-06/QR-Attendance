import { useState } from 'react';
import { Calendar, Download, ChevronDown } from 'lucide-react';

interface StudentAttendance {
  id: number;
  name: string;
  code: string;
  batch: string;
  type: 'Student' | 'Lecturer';
  attendance: {
    [day: number]: 'P' | 'A' | 'L' | 'H' | 'WO';
  };
}

export function MonthlyAttendanceReport() {
  const [selectedMonth, setSelectedMonth] = useState('december-2025');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const records: StudentAttendance[] = [
    {
      id: 1,
      name: 'Noori El Mansur',
      code: 'ACAMIS-02-1234-K5',
      batch: 'BHM-2',
      type: 'Student',
      attendance: {
        1: 'P', 2: 'P', 3: 'A', 4: 'P', 5: 'P', 6: 'P', 7: 'L',
        8: 'P', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'P',
        15: 'P', 16: 'A', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'P',
        22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'P',
        29: 'P', 30: 'P', 31: 'P'
      }
    },
    {
      id: 2,
      name: 'Dr. Samuel Johnson',
      code: 'LEC-001',
      batch: 'BHM-2',
      type: 'Lecturer',
      attendance: {
        1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'H', 7: 'P',
        8: 'P', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'P',
        15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'P',
        22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'P',
        29: 'P', 30: 'P', 31: 'P'
      }
    },
    {
      id: 3,
      name: 'Terry Wallace',
      code: 'ACAMIS-02-1235-K5',
      batch: 'BHM-2',
      type: 'Student',
      attendance: {
        1: 'P', 2: 'A', 3: 'A', 4: 'P', 5: 'P', 6: 'P', 7: 'P',
        8: 'P', 9: 'L', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'P',
        15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'P',
        22: 'A', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'P',
        29: 'P', 30: 'P', 31: 'P'
      }
    },
    {
      id: 4,
      name: 'Prof. Maria Garcia',
      code: 'LEC-002',
      batch: 'BHM-3',
      type: 'Lecturer',
      attendance: {
        1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P',
        8: 'P', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'P',
        15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'H', 21: 'P',
        22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'P',
        29: 'P', 30: 'P', 31: 'P'
      }
    }
  ];

  const months = [
    { value: 'december-2025', label: 'December 2025' },
    { value: 'november-2025', label: 'November 2025' },
    { value: 'october-2025', label: 'October 2025' },
    { value: 'september-2025', label: 'September 2025' }
  ];

  const batches = ['all', ...new Set(records.map(r => r.batch))];

  const statusLegend = [
    { key: 'P', label: 'Present', color: 'bg-emerald-500' },
    { key: 'A', label: 'Absent', color: 'bg-red-500' },
    { key: 'L', label: 'Late', color: 'bg-orange-500' },
    { key: 'H', label: 'Holiday', color: 'bg-blue-500' },
    { key: 'WO', label: 'Week Off', color: 'bg-purple-500' }
  ];

  const filteredRecords = records.filter(record => {
    const matchesBatch = selectedBatch === 'all' || record.batch === selectedBatch;
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesBatch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'P':
        return 'bg-emerald-100 text-emerald-800';
      case 'A':
        return 'bg-red-100 text-red-800';
      case 'L':
        return 'bg-orange-100 text-orange-800';
      case 'H':
        return 'bg-blue-100 text-blue-800';
      case 'WO':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateAttendance = (attendance: { [day: number]: string }) => {
    const present = Object.values(attendance).filter(v => v === 'P').length;
    const total = Object.values(attendance).length;
    return ((present / total) * 100).toFixed(1);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Monthly Attendance Report</h1>
              <p className="text-white/80">Student and Lecturer daily attendance tracking</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Status Legend */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="text-sm font-semibold text-gray-700 mb-4">Status Legend</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statusLegend.map(legend => (
              <div key={legend.key} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded ${legend.color}`}></div>
                <span className="text-sm text-gray-700">{legend.label} ({legend.key})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Month */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Batch */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {batches.map(batch => (
                  <option key={batch} value={batch}>
                    {batch === 'all' ? 'All Batches' : `Batch: ${batch}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Type */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="all">All</option>
                <option value="Student">Students</option>
                <option value="Lecturer">Lecturers</option>
              </select>
              <ChevronDown className="absolute right-3 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Total Records</div>
            <div className="text-3xl font-bold text-gray-900">{filteredRecords.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Students</div>
            <div className="text-3xl font-bold text-blue-600">{filteredRecords.filter(r => r.type === 'Student').length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Lecturers</div>
            <div className="text-3xl font-bold text-purple-600">{filteredRecords.filter(r => r.type === 'Lecturer').length}</div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Batch</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Attendance %</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Daily Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, idx) => (
                  <tr key={record.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{record.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.code}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${record.type === 'Student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.batch}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-emerald-600">{calculateAttendance(record.attendance)}%</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: 31 }).map((_, i) => {
                          const day = i + 1;
                          const status = record.attendance[day] || '';
                          return (
                            <div
                              key={day}
                              className={`w-6 h-6 rounded text-xs font-semibold flex items-center justify-center ${getStatusColor(status)} cursor-help` }
                              title={`${day}: ${status}`}
                            >
                              {status}
                            </div>
                          );
                        })}
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
  );
}
