import { useState } from 'react';
import {
  Search,
  ChevronDown,
  Phone,
  Mail,
  User,
  Calendar,
  Percent,
  MapPin,
} from 'lucide-react';
import { navigate } from '../utils/navigator';

interface StudentDetail {
  id: number;
  name: string;
  rollNumber: string;
  class: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  address: string;
  status: 'Active' | 'Inactive';
  attendance: number;
  photo: string;
}

export function SearchStudent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);

  const students: StudentDetail[] = [
    {
      id: 1,
      name: 'Noori El Mansur',
      rollNumber: 'ACAMIS-02-1234-K5',
      class: 'BHM / BHM-2 / Semester 4 / B',
      phone: '+91 98765 43210',
      email: 'noori.mansur@example.com',
      parentName: 'Ahmed El Mansur',
      parentPhone: '+91 98765 43211',
      address: 'Flat 301, Building A, Mumbai, Maharashtra - 400001',
      status: 'Active',
      attendance: 92.5,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Terry Wallace',
      rollNumber: 'ACAMIS-02-1235-K5',
      class: 'BHM / BHM-2 / Semester 4 / B',
      phone: '+91 98765 43220',
      email: 'terry.wallace@example.com',
      parentName: 'Robert Wallace',
      parentPhone: '+91 98765 43221',
      address: 'House No. 45, Sector 12, Delhi - 110012',
      status: 'Active',
      attendance: 88.3,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    {
      id: 3,
      name: 'Joel Knight',
      rollNumber: 'ACAMIS-02-1236-K5',
      class: 'BHM / BHM-2 / Semester 4 / B',
      phone: '+91 98765 43230',
      email: 'joel.knight@example.com',
      parentName: 'Michael Knight',
      parentPhone: '+91 98765 43231',
      address: 'Apartment 12B, Bangalore, Karnataka - 560001',
      status: 'Active',
      attendance: 95.7,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
    {
      id: 4,
      name: 'Zachary Owens',
      rollNumber: 'ACAMIS-02-1237-K5',
      class: 'BHM / BHM-2 / Semester 4 / B',
      phone: '+91 98765 43240',
      email: 'zachary.owens@example.com',
      parentName: 'David Owens',
      parentPhone: '+91 98765 43241',
      address: 'Apartment 5C, Chennai, Tamil Nadu - 600001',
      status: 'Active',
      attendance: 78.2,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    {
      id: 5,
      name: 'Joel Gonzalez',
      rollNumber: 'ACAMIS-02-1238-K5',
      class: 'BHM / BHM-2 / Semester 4 / B',
      phone: '+91 98765 43250',
      email: 'joel.gonzalez@example.com',
      parentName: 'Carlos Gonzalez',
      parentPhone: '+91 98765 43251',
      address: 'House 7, Pune, Maharashtra - 411001',
      status: 'Inactive',
      attendance: 65.4,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    {
      id: 6,
      name: 'Jerome Fisher',
      rollNumber: 'ACAMIS-02-1239-K5',
      class: 'BHM / BHM-2 / Semester 4 / B',
      phone: '+91 98765 43260',
      email: 'jerome.fisher@example.com',
      parentName: 'John Fisher',
      parentPhone: '+91 98765 43261',
      address: 'Apartment 8B, Hyderabad, Telangana - 500001',
      status: 'Active',
      attendance: 91.8,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search by student name or roll number"
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
            <div className="mb-6">
              <h1 className="text-gray-800 mb-1">Search Student</h1>
              <p className="text-sm text-gray-500">Look up student information and details</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Search Results List */}
              <div className="col-span-1 border-r border-gray-200 pr-6">
                <div className="text-sm text-gray-600 mb-4">
                  {filteredStudents.length} students found
                </div>
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => navigate('student-profile', student)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedStudent?.id === student.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              {student.name.split(' ')[0][0]}
                              {student.name.split(' ')[1][0]}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-800 truncate">{student.name}</div>
                          <div className="text-xs text-gray-500 truncate">{student.rollNumber}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Details */}
              <div className="col-span-2">
                {selectedStudent ? (
                  <div>
                    {/* Photo and Basic Info */}
                    <div className="flex items-start gap-6 mb-6 p-6 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
                      <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                        {selectedStudent.photo ? (
                          <img
                            src={selectedStudent.photo}
                            alt={selectedStudent.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-4xl font-bold">
                            {selectedStudent.name.split(' ')[0][0]}
                            {selectedStudent.name.split(' ')[1][0]}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-gray-800 mb-2">{selectedStudent.name}</h2>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-500">Roll Number</div>
                            <div className="text-sm text-gray-800">{selectedStudent.rollNumber}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Class / Batch</div>
                            <div className="text-sm text-gray-800">{selectedStudent.class}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Status</div>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs ${
                                selectedStudent.status === 'Active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {selectedStudent.status}
                            </span>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Attendance</div>
                            <div className="text-sm">
                              <span
                                className={
                                  selectedStudent.attendance >= 75
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }
                              >
                                {selectedStudent.attendance}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-pink-500" />
                          Student Contact
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {selectedStudent.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {selectedStudent.email}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-pink-500" />
                          Parent Details
                        </h3>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-800">{selectedStudent.parentName}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {selectedStudent.parentPhone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="p-4 border border-gray-200 rounded-lg mb-6">
                      <h3 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pink-500" />
                        Address
                      </h3>
                      <div className="text-sm text-gray-600">{selectedStudent.address}</div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-pink-500" />
                        Attendance Summary
                      </h3>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Overall</div>
                          <div className="text-green-600 font-semibold">
                            {selectedStudent.attendance}%
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">This Month</div>
                          <div className="text-blue-600 font-semibold">94.2%</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Last Month</div>
                          <div className="text-yellow-600 font-semibold">89.5%</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">This Semester</div>
                          <div className="text-purple-600 font-semibold">91.8%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>Select a student to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
