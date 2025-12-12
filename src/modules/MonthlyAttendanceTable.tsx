import { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface AttendanceData {
  [key: string]: 'P' | 'A' | 'L' | 'H' | 'WO';
}

interface Person {
  id: string;
  name: string;
  code: string;
  type: 'Student' | 'Lecturer';
  batch: string;
  attendance: AttendanceData;
}

const mockData: Person[] = [
  {
    id: 'STU-001',
    name: 'Noori El Mansur',
    code: 'ACAMIS-02-1234-K5',
    type: 'Student',
    batch: 'BHM-2',
    attendance: {
      '1': 'A', '2': 'A', '3': 'A', '4': 'A', '5': 'P', '6': 'P', '7': 'P',
      '8': 'P', '9': 'P', '10': 'P', '11': 'P', '12': 'P', '13': 'P', '14': 'P',
      '15': 'P', '16': 'P', '17': 'P', '18': 'P', '19': 'P', '20': 'P', '21': 'P',
      '22': 'P', '23': 'P', '24': 'P', '25': 'P', '26': 'P', '27': 'P', '28': 'P',
      '29': 'P', '30': 'P', '31': 'P'
    }
  },
  {
    id: 'LEC-001',
    name: 'Dr. Samuel Johnson',
    code: 'LECTURER-001',
    type: 'Lecturer',
    batch: 'BHM-2',
    attendance: {
      '1': 'P', '2': 'P', '3': 'WO', '4': 'P', '5': 'P', '6': 'P', '7': 'P',
      '8': 'P', '9': 'P', '10': 'WO', '11': 'P', '12': 'P', '13': 'P', '14': 'P',
      '15': 'P', '16': 'P', '17': 'WO', '18': 'P', '19': 'P', '20': 'P', '21': 'P',
      '22': 'P', '23': 'P', '24': 'WO', '25': 'P', '26': 'P', '27': 'P', '28': 'P',
      '29': 'P', '30': 'P', '31': 'WO'
    }
  },
  {
    id: 'STU-002',
    name: 'Terry Wallace',
    code: 'ACAMIS-02-1235-K5',
    type: 'Student',
    batch: 'BHM-2',
    attendance: {
      '1': 'P', '2': 'P', '3': 'L', '4': 'P', '5': 'P', '6': 'P', '7': 'P',
      '8': 'P', '9': 'P', '10': 'A', '11': 'P', '12': 'P', '13': 'P', '14': 'P',
      '15': 'P', '16': 'P', '17': 'P', '18': 'P', '19': 'P', '20': 'P', '21': 'P',
      '22': 'P', '23': 'P', '24': 'A', '25': 'P', '26': 'P', '27': 'L', '28': 'P',
      '29': 'P', '30': 'P', '31': 'P'
    }
  },
  {
    id: 'LEC-002',
    name: 'Prof. Maria Garcia',
    code: 'LECTURER-002',
    type: 'Lecturer',
    batch: 'BHM-3',
    attendance: {
      '1': 'P', '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P',
      '8': 'P', '9': 'P', '10': 'P', '11': 'P', '12': 'P', '13': 'P', '14': 'P',
      '15': 'P', '16': 'P', '17': 'H', '18': 'P', '19': 'P', '20': 'P', '21': 'P',
      '22': 'P', '23': 'P', '24': 'P', '25': 'P', '26': 'P', '27': 'P', '28': 'P',
      '29': 'P', '30': 'P', '31': 'P'
    }
  }
];

export function MonthlyAttendanceTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const itemsPerPage = 5;

  const filteredData = mockData.filter(person => {
    const matchesBatch = selectedBatch === 'all' || person.batch === selectedBatch;
    const matchesType = selectedType === 'all' || person.type === selectedType;
    return matchesBatch && matchesType;
  });

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const batches = ['all', ...new Set(mockData.map(p => p.batch))];

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'P':
        return 'bg-emerald-500';
      case 'A':
        return 'bg-red-500';
      case 'L':
        return 'bg-orange-500';
      case 'H':
        return 'bg-blue-500';
      case 'WO':
        return 'bg-purple-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const calculateStats = (attendance: AttendanceData) => {
    const total = Object.keys(attendance).length;
    const present = Object.values(attendance).filter(v => v === 'P').length;
    const absent = Object.values(attendance).filter(v => v === 'A').length;
    const late = Object.values(attendance).filter(v => v === 'L').length;
    const holiday = Object.values(attendance).filter(v => v === 'H').length;
    const weekOff = Object.values(attendance).filter(v => v === 'WO').length;

    return {
      total,
      present,
      absent,
      late,
      holiday,
      weekOff,
      percentage: ((present / (total - weekOff)) * 100).toFixed(1)
    };
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Monthly Attendance Details</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {batches.map(batch => (
                  <option key={batch} value={batch}>
                    {batch === 'all' ? 'All Batches' : `Batch: ${batch}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All</option>
                <option value="Student">Students</option>
                <option value="Lecturer">Lecturers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Batch</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Present</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Absent</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Late</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Holiday</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Attendance %</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Daily Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((person, idx) => {
                  const stats = calculateStats(person.attendance);
                  return (
                    <tr key={person.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{person.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{person.code}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(person.type)}`}>
                          {person.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{person.batch}</td>
                      <td className="px-6 py-4 text-center font-semibold text-emerald-600">{stats.present}</td>
                      <td className="px-6 py-4 text-center font-semibold text-red-600">{stats.absent}</td>
                      <td className="px-6 py-4 text-center font-semibold text-orange-600">{stats.late}</td>
                      <td className="px-6 py-4 text-center font-semibold text-blue-600">{stats.holiday}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-lg text-indigo-600">{stats.percentage}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-0.5 justify-center">
                          {Array.from({ length: 31 }).map((_, i) => {
                            const day = i + 1;
                            const status = person.attendance[day.toString()] || '';
                            return (
                              <div
                                key={day}
                                className={`w-5 h-5 rounded text-xs flex items-center justify-center text-white font-bold ${getStatusBgColor(status)} cursor-help`}
                                title={`${day}: ${status}`}
                              >
                                {status}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {paginatedData.length > 0 ? currentPage * itemsPerPage + 1 : 0} to{' '}
            {Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} of {filteredData.length} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-8 h-8 rounded-lg font-medium transition ${
                    currentPage === i
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
