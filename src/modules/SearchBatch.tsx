import { useState } from 'react';
import {
  Search,
  ChevronDown,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  User,
} from 'lucide-react';

interface BatchDetail {
  id: number;
  name: string;
  code: string;
  year: string;
  strength: number;
  activeStudents: number;
  classTeacher: string;
  coordinator: string;
  sections: string[];
  avgAttendance: number;
  monthlyAttendance: number[];
  topPerformers: string[];
  lowPerformers: string[];
}

export function SearchBatch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<BatchDetail | null>(null);

  const batches: BatchDetail[] = [
    {
      id: 1,
      name: 'BHM Batch 2',
      code: 'BHM-2-2018',
      year: '2018-2022',
      strength: 124,
      activeStudents: 118,
      classTeacher: 'Dr. Rajesh Kumar',
      coordinator: 'Prof. Anjali Sharma',
      sections: ['A', 'B', 'C'],
      avgAttendance: 87.5,
      monthlyAttendance: [85, 88, 90, 87, 89, 86, 88, 87],
      topPerformers: ['Noori El Mansur', 'Joel Knight', 'Jerome Fisher'],
      lowPerformers: ['Joel Gonzalez', 'Ernest Reese'],
    },
    {
      id: 2,
      name: 'BHM Batch 1',
      code: 'BHM-1-2017',
      year: '2017-2021',
      strength: 98,
      activeStudents: 95,
      classTeacher: 'Prof. Anjali Sharma',
      coordinator: 'Dr. Vikram Singh',
      sections: ['A', 'B'],
      avgAttendance: 92.3,
      monthlyAttendance: [90, 92, 93, 91, 94, 92, 93, 92],
      topPerformers: ['Student A', 'Student B', 'Student C'],
      lowPerformers: ['Student X', 'Student Y'],
    },
    {
      id: 3,
      name: 'BHM Batch 3',
      code: 'BHM-3-2019',
      year: '2019-2023',
      strength: 156,
      activeStudents: 152,
      classTeacher: 'Dr. Vikram Singh',
      coordinator: 'Prof. Meera Patel',
      sections: ['A', 'B', 'C', 'D'],
      avgAttendance: 85.1,
      monthlyAttendance: [82, 84, 86, 85, 87, 84, 86, 85],
      topPerformers: ['Student P', 'Student Q', 'Student R'],
      lowPerformers: ['Student M', 'Student N'],
    },
  ];

  const filteredBatches = batches.filter(
    (batch) =>
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.code.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search by batch name or code"
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
              <h1 className="text-gray-800 mb-1">Search Batch</h1>
              <p className="text-sm text-gray-500">Look up batch information and statistics</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Search Results List */}
              <div className="col-span-1 border-r border-gray-200 pr-6">
                <div className="text-sm text-gray-600 mb-4">
                  {filteredBatches.length} batches found
                </div>
                <div className="space-y-2">
                  {filteredBatches.map((batch) => (
                    <button
                      key={batch.id}
                      onClick={() => setSelectedBatch(batch)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedBatch?.id === batch.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-sm text-gray-800">{batch.name}</div>
                      <div className="text-xs text-gray-500">{batch.code}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {batch.strength} Students
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Batch Details */}
              <div className="col-span-2">
                {selectedBatch ? (
                  <div>
                    {/* Header Info */}
                    <div className="p-6 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg mb-6">
                      <h2 className="text-gray-800 mb-4">{selectedBatch.name}</h2>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Batch Code</div>
                          <div className="text-sm text-gray-800">{selectedBatch.code}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Academic Year</div>
                          <div className="text-sm text-gray-800">{selectedBatch.year}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Total Strength</div>
                          <div className="text-sm text-gray-800">
                            {selectedBatch.strength} Students
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          <span className="text-xs text-gray-600">Active Students</span>
                        </div>
                        <div className="text-blue-600 font-semibold">
                          {selectedBatch.activeStudents}
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          <span className="text-xs text-gray-600">Avg. Attendance</span>
                        </div>
                        <div className="text-green-600 font-semibold">
                          {selectedBatch.avgAttendance}%
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-5 h-5 text-purple-500" />
                          <span className="text-xs text-gray-600">Sections</span>
                        </div>
                        <div className="flex gap-1">
                          {selectedBatch.sections.map((section, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-200 text-purple-700 rounded text-xs"
                            >
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Faculty Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-pink-500" />
                          Class Teacher
                        </h3>
                        <div className="text-sm text-gray-800">{selectedBatch.classTeacher}</div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-pink-500" />
                          Coordinator
                        </h3>
                        <div className="text-sm text-gray-800">{selectedBatch.coordinator}</div>
                      </div>
                    </div>

                    {/* Attendance Stats */}
                    <div className="p-4 border border-gray-200 rounded-lg mb-6">
                      <h3 className="text-sm text-gray-700 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pink-500" />
                        Monthly Attendance Trend
                      </h3>
                      <div className="flex items-end gap-2 h-32">
                        {selectedBatch.monthlyAttendance.map((value, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full bg-gradient-to-t from-pink-500 to-red-400 rounded-t"
                              style={{ height: `${value}%` }}
                            ></div>
                            <div className="text-xs text-gray-500">M{idx + 1}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top and Low Performers */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-sm text-gray-700 mb-3">Top Performers</h3>
                        <ul className="space-y-2">
                          {selectedBatch.topPerformers.map((student, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">
                                {idx + 1}
                              </span>
                              {student}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-sm text-gray-700 mb-3">Needs Attention</h3>
                        <ul className="space-y-2">
                          {selectedBatch.lowPerformers.map((student, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-semibold">
                                !
                              </span>
                              {student}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>Select a batch to view details</p>
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
