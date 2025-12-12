import { useState, useEffect } from 'react';
import { Calendar, Check, X, Clock, ArrowLeft, FileText } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  code: string;
  status: 'present' | 'absent' | 'late';
  time?: string;
}

interface DailyAttendanceScannerProps {
  searchQuery?: string;
  selectedBatch?: { name: string; code: string; id: string } | null;
}

export function DailyAttendanceScanner({ 
  searchQuery = '', 
  selectedBatch 
}: DailyAttendanceScannerProps = {}) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);

  const fetchAttendance = async () => {
    try {
      const dateParam = selectedDate;
      const batchId = selectedBatch?.id || '';
      const url = `http://localhost:3000/api/attendance?date=${encodeURIComponent(dateParam)}&batchId=${encodeURIComponent(batchId)}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        console.warn('Failed to fetch attendance', resp.status);
        setStudents([]);
        return;
      }
      const body = await resp.json();
      if (body && body.success && Array.isArray(body.data)) {
        const map = new Map<string, Student>();
        body.data.forEach((r: any) => {
          const student: Student = {
            id: Number(r.studentId || r.id || 0),
            name: r.studentName || r.name,
            code: r.studentCode || r.code,
            status: (r.status as 'present' | 'absent' | 'late') || 'present',
            time: r.time || undefined,
          };
          map.set(student.code, student);
        });
        setStudents(Array.from(map.values()));
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const handler = (e: any) => {
      const detail = e?.detail || {};
      if (!selectedBatch || !detail.batchId || detail.batchId === selectedBatch.id) {
        if (!detail.date || detail.date === selectedDate) fetchAttendance();
      }
    };
    window.addEventListener('attendance:updated', handler as EventListener);
    return () => window.removeEventListener('attendance:updated', handler as EventListener);
  }, [selectedDate, selectedBatch]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.code.includes(searchQuery)
  );

  const updateAttendance = async (id: number, status: 'present' | 'absent' | 'late') => {
    try {
      const body = { studentId: id, batchId: selectedBatch?.id || '', date: selectedDate, status };
      const resp = await fetch('http://localhost:3000/api/attendance/mark-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await resp.json();
      if (resp.ok && result.success) {
        setStudents((prev) => prev.map(s => s.id === id ? { ...s, status, time: result.data.markedAt } : s));
        try {
          window.dispatchEvent(new CustomEvent('attendance:updated', { detail: { studentCode: result.data.studentCode, date: selectedDate, batchId: selectedBatch?.id || '' } }));
        } catch (e) {}
      } else {
        console.warn('Failed to update attendance manually', result);
      }
    } catch (err) {
      console.error('Error updating attendance', err);
    }
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

  // no previous-days view required for daily panel

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
                  Daily Attendance: <span className="text-gray-600">{selectedBatch ? selectedBatch.name : 'All Batches'}</span>
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

            {/* Attendance Table (Daily view) */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">#</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Student Name</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Student ID</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Time</th>
                    <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.code ?? idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-600">{idx + 1}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-gray-800">{student.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{student.code}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {student.time ? (
                          <span className="font-medium">{student.time}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusBadge(student.status)}
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateAttendance(student.id, 'present')}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs uppercase bg-green-50 text-green-600 hover:bg-green-100 transition"
                            >
                              <Check className="w-3 h-3" />
                              Present
                            </button>
                            <button
                              onClick={() => updateAttendance(student.id, 'absent')}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs uppercase bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                              <X className="w-3 h-3" />
                              Absent
                            </button>
                            <button
                              onClick={() => updateAttendance(student.id, 'late')}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs uppercase bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition"
                            >
                              <Clock className="w-3 h-3" />
                              Late
                            </button>
                          </div>
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
    </div>
  );
}
