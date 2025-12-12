import { useState } from 'react';
import { ChevronDown, User, BookOpen, GraduationCap, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { navigate } from '../utils/navigator';

interface Student {
  id?: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  code?: string;
  batch?: string;
  section?: string;
  phone?: string;
  email?: string;
  address?: string;
  photo?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  gender?: string;
  parentPhone?: string;
  parentEmail?: string;
  batchId?: string;
  status?: string;
}

export function StudentProfile({ student }: { student?: Student }) {
  const [activeTab, setActiveTab] = useState('attendance');

  // Use student data if provided, otherwise show mock data
  const s = student && student.code ? student : null;
  
  // If no valid student, show a message
  if (!s) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('student-list')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Students"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-gray-800">Student Profile</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No student selected</p>
            <button
              onClick={() => navigate('student-list')}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Go Back to Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Construct full name from firstName and lastName
  const fullName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student';

  const attendanceData = [
    { month: 'August', present: 26, absent: 4, percentage: 86.7 },
    { month: 'September', present: 27, absent: 3, percentage: 90.0 },
    { month: 'October', present: 28, absent: 3, percentage: 90.3 },
    { month: 'November', present: 25, absent: 5, percentage: 83.3 },
    { month: 'December', present: 20, absent: 2, percentage: 90.9 },
  ];

  const academicHistory = [
    { semester: 'Semester 1', grade: 'A', percentage: 88.5, status: 'Passed' },
    { semester: 'Semester 2', grade: 'A-', percentage: 85.2, status: 'Passed' },
    { semester: 'Semester 3', grade: 'B+', percentage: 82.8, status: 'Passed' },
    { semester: 'Semester 4', grade: 'In Progress', percentage: 0, status: 'Ongoing' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('student-list')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Students"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-gray-800">Student Profile</h2>
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
        <div className="max-w-[1200px] mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden shadow-xl border-4 border-white bg-gray-100">
                  <img
                    src={s.photo}
                    alt={fullName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-white mb-2">{fullName}</h2>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-pink-100 text-xs mb-1">Roll Number</div>
                      <div>{s.code}</div>
                    </div>
                    <div>
                      <div className="text-pink-100 text-xs mb-1">Batch / Section</div>
                      <div>{s.section || 'Not assigned'}</div>
                    </div>
                    <div>
                      <div className="text-pink-100 text-xs mb-1">Status</div>
                      <span className="inline-block px-2 py-1 bg-white text-green-600 rounded text-xs capitalize">{s.status || 'active'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-6 px-6">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`py-3 px-4 text-sm transition-colors border-b-2 ${
                    activeTab === 'attendance' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Attendance
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`py-3 px-4 text-sm transition-colors border-b-2 ${
                    activeTab === 'personal' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Details
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('academic')}
                  className={`py-3 px-4 text-sm transition-colors border-b-2 ${
                    activeTab === 'academic' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Academic History
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'attendance' && (
                <div>
                  <h3 className="text-gray-800 mb-4">Attendance Record</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Month</th>
                          <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Present Days</th>
                          <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Absent Days</th>
                          <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.map((record, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 text-gray-800">{record.month}</td>
                            <td className="py-4 px-4 text-center">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-sm">{record.present}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded text-sm">{record.absent}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded text-sm ${record.percentage >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.percentage}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'personal' && (
                <div>
                  <h3 className="text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Father's Name</div>
                      <div className="text-sm text-gray-800">{s.fatherName}</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Mother's Name</div>
                      <div className="text-sm text-gray-800">{s.motherName}</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Date of Birth</div>
                      <div className="text-sm text-gray-800">{s.dob}</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Gender</div>
                      <div className="text-sm text-gray-800">{s.gender}</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        Student Phone
                      </div>
                      <div className="text-sm text-gray-800">{s.phone}</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        Student Email
                      </div>
                      <div className="text-sm text-gray-800">{s.email}</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        Parent Phone
                      </div>
                      <div className="text-sm text-gray-800">{s.parentPhone}</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg col-span-2">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        Address
                      </div>
                      <div className="text-sm text-gray-800">{s.address}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academic' && (
                <div>
                  <h3 className="text-gray-800 mb-4">Academic History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Semester</th>
                          <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Grade</th>
                          <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Percentage</th>
                          <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academicHistory.map((record, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 text-gray-800">{record.semester}</td>
                            <td className="py-4 px-4 text-center text-gray-700">{record.grade}</td>
                            <td className="py-4 px-4 text-center text-gray-700">
                              {record.percentage > 0 ? `${record.percentage}%` : '—'}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded text-xs ${record.status === 'Passed' ? 'bg-green-100 text-green-700' : record.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
