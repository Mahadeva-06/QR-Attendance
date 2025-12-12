import { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  ArrowLeft, 
  ChevronDown,
  Check,
  X,
  Clock
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  code: string;
  status: 'present' | 'absent' | 'late';
  previousDays: ('present' | 'absent' | 'late' | 'holiday')[];
  absentDays: number;
}

interface AttendanceDashboardProps {
  searchQuery?: string;
  selectedBatch?: { name: string; code: string } | null;
}

export function AttendanceDashboard({ searchQuery = '', selectedBatch }: AttendanceDashboardProps = {}) {
  const [selectedDate, setSelectedDate] = useState('2025-12-02');
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Noori El Mansur',
      code: 'ACAMIS-02-1234-K5',
      status: 'present',
      previousDays: ['present', 'absent', 'absent', 'holiday', 'holiday', 'absent', 'present'],
      absentDays: 2
    },
    {
      id: 2,
      name: 'Terry Wallace',
      code: 'ACAMIS-02-1234-K5',
      status: 'present',
      previousDays: ['present', 'present', 'present', 'absent', 'absent', 'absent', 'present'],
      absentDays: 0
    },
    {
      id: 3,
      name: 'Joel Knight',
      code: 'ACAMIS-02-1234-K5',
      status: 'present',
      previousDays: ['present', 'absent', 'absent', 'holiday', 'holiday', 'absent', 'present'],
      absentDays: 2
    },
    {
      id: 4,
      name: 'Zachary Owens',
      code: 'ACAMIS-02-1234-K5',
      status: 'present',
      previousDays: ['present', 'absent', 'absent', 'absent', 'absent', 'absent', 'present'],
      absentDays: 0
    },
    {
      id: 5,
      name: 'Joel Gonzalez',
      code: 'ACAMIS-02-1234-K5',
      status: 'present',
      previousDays: ['present', 'present', 'present', 'absent', 'absent', 'absent', 'present'],
      absentDays: 0
    },
    {
      id: 6,
      name: 'Jerome Fisher',
      code: 'ACAMIS-02-1234-K5',
      status: 'present',
      previousDays: ['present', 'present', 'present', 'holiday', 'holiday', 'absent', 'present'],
      absentDays: 0
    },
    {
      id: 7,
      name: 'Ernest Reese',
      code: 'ACAMIS-02-1234-K5',
      status: 'present',
      previousDays: ['present', 'present', 'present', 'absent', 'absent', 'absent', 'present'],
      absentDays: 3
    },
    {
      id: 8,
      name: 'Bradley Barker',
      code: 'ACAMIS-02-1234-K5',
      status: 'present',
      previousDays: ['present', 'absent', 'absent', 'holiday', 'holiday', 'absent', 'present'],
      absentDays: 2
    }
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.code.includes(searchQuery)
  );

  const updateAttendance = (id: number, status: 'present' | 'absent' | 'late') => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const getStatusBadge = (status: 'present' | 'absent' | 'late') => {
    const styles = {
      present: 'bg-green-500 text-white',
      absent: 'bg-red-500 text-white',
      late: 'bg-gray-300 text-gray-700'
    };

    const icons = {
      present: <Check className="w-3 h-3" />,
      absent: <X className="w-3 h-3" />,
      late: <Clock className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs uppercase ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const getDayIcon = (status: 'present' | 'absent' | 'late' | 'holiday') => {
    if (status === 'present') {
      return <Check className="w-4 h-4 text-green-500" />;
    } else if (status === 'absent') {
      return <X className="w-4 h-4 text-red-500" />;
    } else if (status === 'late') {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    } else {
      return <span className="text-xs text-yellow-500 font-bold">H</span>;
    }
  };

  const getPreviousDayColor = (day: string) => {
    switch(day) {
      case 'present': return 'bg-green-400';
      case 'absent': return 'bg-red-400';
      case 'late': return 'bg-yellow-400';
      case 'holiday': return 'bg-gray-300';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-6">
          {/* Page Title and Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-gray-800 mb-1">
                  Daily Attendance: <span className="text-gray-600">{selectedBatch ? `${selectedBatch.name}` : 'No batch selected'}</span>
                </h1>
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
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">GO BACK</span>
                </button>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">#</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Student Name</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Status</th>
                    <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Previous 7 Days Status</th>
                    <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Absent Days</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-600">{student.id}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-gray-800">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.code}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {getStatusBadge(student.status)}
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs uppercase bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition" onClick={() => updateAttendance(student.id, 'absent')}>
                            <X className="w-3 h-3" />
                            ABSENT
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs uppercase bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition" onClick={() => updateAttendance(student.id, 'late')}>
                            <Clock className="w-3 h-3" />
                            LATE
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-3">
                          {student.previousDays.map((day, index) => (
                            <div key={index} className="flex flex-col items-center gap-1">
                              <span className="text-xs text-gray-500">
                                {String(5 + index).padStart(2, '0')}
                              </span>
                              {getDayIcon(day)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-800">
                        {student.absentDays > 0 ? student.absentDays : '—'}
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
