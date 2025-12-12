import { useState, useEffect } from 'react';
import { ChevronDown, Save, X, AlertCircle, Loader } from 'lucide-react';
import { navigate } from '../utils/navigator';
import { getBatchById, updateBatch, CreateBatchPayload } from '../api/batches';

export function EditBatch({ batchId }: { batchId: string }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    course: 'MCA',
    year: '',
    semester: '',
    coordinator: '',
    section: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadBatch = async () => {
      try {
        setLoading(true);
        const batch = await getBatchById(batchId);
        
        setFormData({
          code: batch.code || '',
          name: batch.name || '',
          course: batch.course || 'MCA',
          year: batch.year ? batch.year.toString() : '',
          semester: batch.semester ? batch.semester.toString() : '',
          coordinator: batch.coordinator || '',
          section: batch.sections?.[0]?.name || '',
          description: batch.description || '',
          startDate: batch.startDate ? batch.startDate.split('T')[0] : '',
          endDate: batch.endDate ? batch.endDate.split('T')[0] : '',
        });
      } catch (err: any) {
        setError('Failed to load batch details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBatch();
  }, [batchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.code || !formData.name) {
        setError('Batch code and name are required');
        setSubmitLoading(false);
        return;
      }

      const payload: CreateBatchPayload = {
        code: formData.code,
        name: formData.name,
        course: formData.course || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        semester: formData.semester ? parseInt(formData.semester) : undefined,
        coordinator: formData.coordinator || undefined,
        section: formData.section || undefined,
        description: formData.description || undefined,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        status: 'active',
      };

      await updateBatch(batchId, payload);
      setSuccess(true);
      alert('✅ Batch updated successfully!');
      
      setTimeout(() => {
        navigate('batch-page');
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update batch. Please try again.';
      setError(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('batch-page');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <h2 className="text-gray-800">Edit Batch</h2>
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
        <div className="max-w-[1000px] mx-auto p-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                ✅ Batch updated successfully!
              </div>
            )}

            {/* Batch Information */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Batch Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., MCA-S1-2026"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Batch Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., MCA Semester 1 - 2026"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Course</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., MCA"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Section</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., A or B"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value ? (parseInt(e.target.value) as any) : '' })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Academic Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value ? (parseInt(e.target.value) as any) : '' })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select Year</option>
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Coordinator</label>
                <input
                  type="text"
                  value={formData.coordinator}
                  onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Dr. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Add batch description..."
                rows={3}
              />
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">CANCEL</span>
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors shadow-lg disabled:opacity-50"
              >
                {submitLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">UPDATING...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="text-sm">UPDATE BATCH</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
