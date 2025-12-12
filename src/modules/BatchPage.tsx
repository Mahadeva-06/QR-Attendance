import { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { navigate } from '../utils/navigator';
import { getBatches, deleteBatch, Batch } from '../api/batches';

export function BatchPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch batches on mount
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBatches();
      setBatches(data);
    } catch (err: any) {
      setError('Failed to load batches. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await deleteBatch(id);
        setBatches(batches.filter((b) => b.id !== id));
        alert('✅ Batch deleted successfully!');
      } catch (err) {
        alert('❌ Failed to delete batch');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || batch.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBatches = batches.length;
  const activeBatches = batches.filter((b) => b.status === 'active').length;
  const totalStudents = batches.reduce((sum, b) => sum + (b.students?.length || 0), 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search batches by name or code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">12:31pm, 2018-12-06</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full overflow-hidden flex items-center justify-center">
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-gray-800 mb-1">Batch Management</h1>
                <p className="text-sm text-gray-500">Manage all academic batches and programs</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">FILTERS</span>
                </button>
                <button
                  onClick={() => navigate('create-batch')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">CREATE BATCH</span>
                </button>
              </div>
            </div>

            {/* Filters Section */}
            {showFilters && (
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Course</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="all">All Courses</option>
                    <option value="bhm">BHM</option>
                    <option value="bca">BCA</option>
                    <option value="bba">BBA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Year</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="all">All Years</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                  </select>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-8 h-8 text-blue-100" />
                </div>
                <div className="text-2xl mb-1">{totalBatches}</div>
                <div className="text-xs text-blue-100">Total Batches</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-green-100" />
                </div>
                <div className="text-2xl mb-1">{totalStudents}</div>
                <div className="text-xs text-green-100">Total Students</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-orange-100" />
                </div>
                <div className="text-2xl mb-1">{activeBatches}</div>
                <div className="text-xs text-orange-100">Active Batches</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 text-purple-100" />
                </div>
                <div className="text-2xl mb-1">—</div>
                <div className="text-xs text-purple-100">Avg. Attendance</div>
              </div>
            </div>

            {/* Batches Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Batch Name</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Course</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Semester</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Sections</th>
                    <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Students</th>
                    <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Attendance</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Coordinator</th>
                    <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Status</th>
                    <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        Loading batches...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : filteredBatches.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No batches found
                      </td>
                    </tr>
                  ) : (
                    filteredBatches.map((batch) => (
                      <tr key={batch.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-gray-800">{batch.name}</div>
                            <div className="text-xs text-gray-500">{batch.code}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-700">{batch.course || '—'}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-700">{batch.semester ? `Sem ${batch.semester}` : '—'}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-1">
                            {batch.sections && batch.sections.length > 0 ? (
                              batch.sections.map((section: any, idx: number) => (
                                <span key={idx} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                  {section.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="text-sm text-gray-700">
                            {batch.students?.length || 0} students
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-gray-400 text-xs">—</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-700">{batch.coordinator || '—'}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded text-xs uppercase ${getStatusColor(batch.status)}`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => navigate('edit-batch', batch.id)} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button onClick={() => handleDelete(batch.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Duration Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg border border-pink-200">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-pink-500" />
                <span>Academic Year: 2018-2019 | Current Semester: December 2018</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
