import { useState } from 'react';
import { ChevronDown, FileText, Download, AlertTriangle } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  code: string;
  batch: string;
  semesters: Array<{
    semester: number;
    attendance: number;
    status: 'pass' | 'fail';
  }>;
  overall: number;
}

interface AllSemestersReportProps {
  searchQuery?: string;
  selectedBatch?: { name: string; code: string } | null;
}

export function AllSemestersReport({ searchQuery = '' }: AllSemestersReportProps = {}) {
  const [internalSelectedBatch, setInternalSelectedBatch] = useState('all');

  const students: Student[] = [
    {
      id: 1,
      name: 'Noori El Mansur',
      code: 'ACAMIS-02-1234-K5',
      batch: 'BHM-2',
      semesters: [
        { semester: 1, attendance: 94.5, status: 'pass' },
        { semester: 2, attendance: 91.2, status: 'pass' },
        { semester: 3, attendance: 89.8, status: 'pass' },
        { semester: 4, attendance: 92.5, status: 'pass' }
      ],
      overall: 92.0
    },
    {
      id: 2,
      name: 'Terry Wallace',
      code: 'ACAMIS-02-1235-K5',
      batch: 'BHM-2',
      semesters: [
        { semester: 1, attendance: 88.3, status: 'pass' },
        { semester: 2, attendance: 85.7, status: 'pass' },
        { semester: 3, attendance: 87.1, status: 'pass' },
        { semester: 4, attendance: 88.3, status: 'pass' }
      ],
      overall: 87.4
    },
    {
      id: 3,
      name: 'Joel Knight',
      code: 'ACAMIS-02-1236-K5',
      batch: 'BHM-2',
      semesters: [
        { semester: 1, attendance: 96.2, status: 'pass' },
        { semester: 2, attendance: 94.8, status: 'pass' },
        { semester: 3, attendance: 95.5, status: 'pass' },
        { semester: 4, attendance: 95.7, status: 'pass' }
      ],
      overall: 95.6
    },
    {
      id: 4,
      name: 'Joel Gonzalez',
      code: 'ACAMIS-02-1238-K5',
      batch: 'BHM-3',
      semesters: [
        { semester: 1, attendance: 92.1, status: 'pass' },
        { semester: 2, attendance: 90.5, status: 'pass' },
        { semester: 3, attendance: 91.3, status: 'pass' },
        { semester: 4, attendance: 93.2, status: 'pass' }
      ],
      overall: 91.8
    },
    {
      id: 5,
      name: 'Maria Santos',
      code: 'ACAMIS-02-1239-K5',
      batch: 'BHM-3',
      semesters: [
        { semester: 1, attendance: 75.4, status: 'fail' },
        { semester: 2, attendance: 78.9, status: 'pass' },
        { semester: 3, attendance: 80.2, status: 'pass' },
        { semester: 4, attendance: 82.1, status: 'pass' }
      ],
      overall: 79.2
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = internalSelectedBatch === 'all' || student.batch === internalSelectedBatch;
    return matchesSearch && matchesBatch;
  });

  const batches = ['all', ...new Set(students.map(s => s.batch))];

  const getStatusColor = (status: string) => {
    return status === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-emerald-600';
    if (attendance >= 80) return 'text-blue-600';
    if (attendance >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">All Semesters Report</h1>
              <p className="text-white/80">Student attendance tracking across all semesters</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Batch Filter */}
            <div className="relative">
              <select
                value={internalSelectedBatch}
                onChange={(e) => setInternalSelectedBatch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {batches.map(batch => (
                  <option key={batch} value={batch}>
                    {batch === 'all' ? 'All Batches' : `Batch: ${batch}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Total Students</div>
            <div className="text-3xl font-bold text-gray-900">{filteredStudents.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Avg Overall Attendance</div>
            <div className="text-3xl font-bold text-emerald-600">
              {(filteredStudents.reduce((sum, s) => sum + s.overall, 0) / filteredStudents.length).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Pass Rate</div>
            <div className="text-3xl font-bold text-blue-600">
              {(filteredStudents.filter(s => s.overall >= 80).length / filteredStudents.length * 100).toFixed(0)}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">At Risk</div>
            <div className="text-3xl font-bold text-orange-600">
              {filteredStudents.filter(s => s.overall < 80).length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Batch</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Sem 1</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Sem 2</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Sem 3</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Sem 4</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Overall</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr key={student.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.batch}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${getAttendanceColor(student.semesters[0].attendance)}`}>
                        {student.semesters[0].attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${getAttendanceColor(student.semesters[1].attendance)}`}>
                        {student.semesters[1].attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${getAttendanceColor(student.semesters[2].attendance)}`}>
                        {student.semesters[2].attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${getAttendanceColor(student.semesters[3].attendance)}`}>
                        {student.semesters[3].attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-lg ${getAttendanceColor(student.overall)}`}>
                        {student.overall}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.overall >= 80 ? 'pass' : 'fail')}`}>
                        {student.overall >= 80 ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {filteredStudents.length === 0 && (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No students found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
