import { useState, useEffect } from 'react';
import { Search, ChevronDown, Edit, Trash2, Plus, Phone, Mail, Filter, UserCircle, Loader } from 'lucide-react';
import { navigate } from '../utils/navigator';
import { getStudents, deleteStudent, Student } from '../api/students';

interface StudentListProps {
  selectModePayload?: any;
}

export function StudentList({ selectModePayload }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selectedForBatchId, setSelectedForBatchId] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

  // Fetch students on mount and respond to selection-mode navigation payload
  useEffect(() => {
    loadStudents();

    // If navigation provided payload for selecting students for a batch
    if (selectModePayload && selectModePayload.selectForBatch) {
      setSelectionMode(true);
      setSelectedForBatchId(selectModePayload.selectForBatch);
    } else {
      // when payload becomes undefined, exit selection mode
      setSelectionMode(false);
      setSelectedForBatchId(null);
    }
  }, [selectModePayload]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudents();
      setStudents(data);
    } catch (err: any) {
      setError('Failed to load students. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        setStudents(students.filter((s) => s.id !== id));
        alert('✅ Student deleted successfully!');
      } catch (err) {
        alert('❌ Failed to delete student');
        console.error(err);
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || student.batchId === selectedBatch;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesBatch && matchesStatus;
  });

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const inactiveStudents = students.filter((s) => s.status === 'inactive').length;

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSelectedToBatch = async () => {
    if (!selectedForBatchId) return alert('No batch selected');
    if (selectedStudentIds.size === 0) return alert('No students selected');

    const ids = Array.from(selectedStudentIds);
    const results: any[] = [];

    for (const sid of ids) {
      try {
        const res = await fetch('http://localhost:3000/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: sid, batchId: selectedForBatchId }),
        });
        if (!res.ok) {
          let reason = res.statusText;
          try {
            const js = await res.json();
            reason = js?.message || JSON.stringify(js);
          } catch (e) {
            try {
              const txt = await res.text();
              reason = txt;
            } catch (e2) {
              // ignore
            }
          }

          // If student is already enrolled, treat as success (idempotent)
          if (typeof reason === 'string' && reason.toLowerCase().includes('already enrolled')) {
            results.push({ studentId: sid, success: true, note: 'already enrolled' });
          } else {
            results.push({ studentId: sid, success: false, reason });
          }
        } else {
          results.push({ studentId: sid, success: true });
        }
      } catch (err: any) {
        results.push({ studentId: sid, success: false, reason: err.message || String(err) });
      }
    }

    const failed = results.filter(r => !r.success);

    // Persist successful student objects to sessionStorage so BatchQRGenerator can show them
    const successIds = results.filter(r => r.success).map(r => r.studentId);
    const successfulStudents = students.filter(s => successIds.includes(s.id));
    if (selectedForBatchId && successfulStudents.length > 0) {
      try {
        const key = `batchqr:selected:${selectedForBatchId}`;
        const existingRaw = sessionStorage.getItem(key);
        let combined = successfulStudents;
        if (existingRaw) {
          const existing = JSON.parse(existingRaw);
          // merge by id to avoid duplicates
          const map: Record<string, any> = {};
          for (const s of existing) map[s.id] = s;
          for (const s of successfulStudents) map[s.id] = s;
          combined = Object.values(map);
        }
        sessionStorage.setItem(key, JSON.stringify(combined));
      } catch (e) {
        console.error('Failed to persist selected students for batch QR', e);
      }
    }

    if (failed.length > 0) {
      alert(`Some enrollments failed: ${failed.map(f => f.studentId).join(', ')}`);
    } else {
      alert('Students enrolled successfully');
      // reset selection and go back
      setSelectedStudentIds(new Set());
      setSelectionMode(false);
      setSelectedForBatchId(null);
      // Optionally navigate back to batch QR generator
      navigate('batch-qr-generator');
    }
    // reload students to reflect batch changes
    loadStudents();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, code or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">12:31pm, 2018-12-06</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
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
          {selectionMode && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Selection mode: Add students to batch</div>
                  <div className="text-xs text-gray-600">Adding students to batch ID: <span className="font-mono">{selectedForBatchId}</span></div>
                </div>
                <div>
                  <button onClick={() => { setSelectionMode(false); setSelectedStudentIds(new Set()); navigate('batch-qr-generator'); }} className="px-3 py-1 bg-gray-200 rounded text-sm">Cancel</button>
                </div>
              </div>
            </div>
          )}
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              ❌ {error}
            </div>
          )}

          {/* Page Title and Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-gray-800 mb-1">Student Management</h1>
                <p className="text-sm text-gray-500">Manage all student records and information</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">FILTERS</span>
                </button>
                {!selectionMode && (
                  <button
                    onClick={() => navigate('add-student')}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">ADD STUDENT</span>
                  </button>
                )}
                {selectionMode && (
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">Adding to:</div>
                    <div className="px-3 py-2 bg-gray-100 rounded text-sm">{selectedForBatchId}</div>
                    <button onClick={handleAddSelectedToBatch} className="px-3 py-2 bg-green-600 text-white rounded text-sm">Add Selected to Batch</button>
                    <button onClick={() => { setSelectionMode(false); setSelectedStudentIds(new Set()); navigate('batch-qr-generator'); }} className="px-3 py-2 bg-gray-200 rounded text-sm">Cancel</button>
                  </div>
                )}
              </div>
            </div>

            {/* Filters Section */}
            {showFilters && (
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Batch</label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="all">All Batches</option>
                    <option value="batch-1">BHM-1</option>
                    <option value="batch-2">BHM-2</option>
                    <option value="batch-3">BHM-3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-2xl mb-1">{totalStudents}</div>
                <div className="text-xs text-blue-100">Total Students</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-2xl mb-1">{activeStudents}</div>
                <div className="text-xs text-green-100">Active Students</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-2xl mb-1">{inactiveStudents}</div>
                <div className="text-xs text-yellow-100">Inactive Students</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
                <div className="text-2xl mb-1">{filteredStudents.length}</div>
                <div className="text-xs text-purple-100">Filtered Results</div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-pink-500 animate-spin" />
                <span className="ml-2 text-gray-600">Loading students...</span>
              </div>
            )}

            {/* Students Grid */}
            {!loading && filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No students found</p>
                <button
                  onClick={() => navigate('add-student')}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Student
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`text-left border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${selectionMode ? '' : 'cursor-pointer'}`}
                    onClick={() => {
                      if (selectionMode) toggleSelectStudent(student.id);
                      else navigate('student-profile', student);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        {selectionMode && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedStudentIds.has(student.id)}
                              onChange={(e) => { e.stopPropagation(); toggleSelectStudent(student.id); }}
                              className="w-4 h-4 mr-2"
                            />
                          </div>
                        )}
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.firstName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircle className="w-7 h-7" />
                          )}
                        </div>
                        <div>
                          <div className="text-gray-800">{student.firstName} {student.lastName}</div>
                          <div className="text-xs text-gray-500">{student.code}</div>
                          <div className="mt-1">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs ${
                                student.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {student.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('edit-student', student.id);
                          }}
                          className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                          title="Edit student"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(student.id);
                          }}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs">{student.email}</span>
                      </div>
                      {student.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-xs">{student.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {student.batchId || 'No Batch Assigned'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
