import { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { DailyAttendanceScanner } from './DailyAttendanceScanner';
import { AttendanceDashboard } from './AttendanceDashboard';
import { MonthlyReport } from './MonthlyReport';
import { AllSemestersReport } from './AllSemestersReport';
import { getBatches, type Batch } from '../api/batches';

type AttendanceView = 'daily' | 'weekly' | 'monthly' | 'semester';

interface Semester {
  id: string;
  name: string;
}

export function AttendanceHub() {
  const [activeView, setActiveView] = useState<AttendanceView>('daily');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load batches
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const data = await getBatches();
        setBatches(data);
        
        // Set default batch (first one or MCA Batch)
        const defaultBatch = data.find(b => b.code === 'MCA') || data[0];
        if (defaultBatch) {
          setSelectedBatch(defaultBatch);
          
          // Extract unique semesters from batches
          const uniqueSemesters = Array.from(
            new Map(
              data
                .filter(b => b.semester)
                .map(b => [b.semester, { id: b.id, name: `Semester ${b.semester}` }])
            ).values()
          );
          setSemesters(uniqueSemesters);
        }
      } catch (err) {
        console.error('Failed to load batches:', err);
      } finally {
        setLoadingBatches(false);
      }
    };
    
    loadBatches();
  }, []);

  const getBatchDisplayName = (batch: Batch | null) => {
    if (!batch) return 'Select Batch';
    return `${batch.code} / ${batch.name}${batch.semester ? ` / Semester ${batch.semester}` : ''}${batch.sections ? ` / ${batch.sections}` : ''}`;
  };

  const renderContent = () => {
    switch (activeView) {
      case 'daily':
        return <DailyAttendanceScanner searchQuery={searchQuery} selectedBatch={selectedBatch} />;
      case 'weekly':
        return <AttendanceDashboard searchQuery={searchQuery} selectedBatch={selectedBatch} />;
      case 'monthly':
        return <MonthlyReport searchQuery={searchQuery} selectedBatch={selectedBatch} />;
      case 'semester':
        return <AllSemestersReport searchQuery={searchQuery} selectedBatch={selectedBatch} />;
      default:
        return <DailyAttendanceScanner searchQuery={searchQuery} selectedBatch={selectedBatch} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Header with View Buttons */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="🔍 Search student, roll number, or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* View Selection Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveView('daily')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeView === 'daily'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📅 Daily Attendance
          </button>
          
          <button
            onClick={() => setActiveView('weekly')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeView === 'weekly'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 Weekly Report
          </button>
          
          <button
            onClick={() => setActiveView('monthly')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeView === 'monthly'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📈 Monthly Report
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeView === 'semester'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📚 Semesters
              <ChevronDown size={18} className={`transition-transform ${isSemesterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSemesterDropdownOpen && semesters.length > 0 && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 min-w-[200px]">
                {semesters.map((sem) => (
                  <button
                    key={sem.id}
                    onClick={() => {
                      setActiveView('semester');
                      setIsSemesterDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-100 text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {sem.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Batch Selector Dropdown */}
        <div className="relative max-w-xs">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📍 Select Batch
          </label>
          <div className="relative">
            <button
              onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
              disabled={loadingBatches}
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-left font-medium text-gray-700 hover:border-pink-500 focus:outline-none focus:border-pink-500 transition-colors flex items-center justify-between"
            >
              <span>{loadingBatches ? 'Loading...' : getBatchDisplayName(selectedBatch)}</span>
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${isBatchDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isBatchDropdownOpen && !loadingBatches && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 w-full max-h-64 overflow-y-auto">
                {batches.length > 0 ? (
                  batches.map((batch) => (
                    <button
                      key={batch.id}
                      onClick={() => {
                        setSelectedBatch(batch);
                        setIsBatchDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 border-b border-gray-100 hover:bg-pink-100 transition-colors ${
                        selectedBatch?.id === batch.id ? 'bg-pink-50 font-semibold text-pink-600' : 'text-gray-700'
                      }`}
                    >
                      {getBatchDisplayName(batch)}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-center">No batches available</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
