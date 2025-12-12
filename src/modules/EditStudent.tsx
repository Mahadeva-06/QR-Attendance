import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Save, X, Upload, AlertCircle } from 'lucide-react';
import { navigate } from '../utils/navigator';
import { getStudentById, updateStudent, enrollStudentInBatch, getStudentEnrollments } from '../api/students';
import { getBatches, type Batch } from '../api/batches';

// Country codes with phone format info
const COUNTRY_CODES = [
  { code: '+91', country: 'India', digits: 10 },
  { code: '+1', country: 'USA/Canada', digits: 10 },
  { code: '+44', country: 'UK', digits: 10 },
  { code: '+92', country: 'Pakistan', digits: 10 },
  { code: '+86', country: 'China', digits: 11 },
  { code: '+81', country: 'Japan', digits: 10 },
  { code: '+33', country: 'France', digits: 9 },
  { code: '+61', country: 'Australia', digits: 9 },
];

interface EditStudentProps {
  studentId?: string;
}

export function EditStudent(props: EditStudentProps) {
  // Get ID from props or navigate to student list
  const studentId = props.studentId;
  
  if (!studentId) {
    return <div className="p-4 text-red-600">❌ Student ID not provided</div>;
  }

  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const countryMenuRef = useRef<HTMLDivElement>(null);
  const parentCountryMenuRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    parentPhone: '',
    parentEmail: '',
    batchId: '',
    section: '',
    photo: '',
  });

  const [enrollStudent, setEnrollStudent] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [phoneErrors, setPhoneErrors] = useState<{ [key: string]: string }>({});
  const [countryCode, setCountryCode] = useState('+91');
  const [parentCountryCode, setParentCountryCode] = useState('+91');
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [isParentCountryMenuOpen, setIsParentCountryMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Load batches
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const data = await getBatches();
        setBatches(data);
      } catch (err) {
        console.error('Failed to load batches:', err);
      } finally {
        setLoadingBatches(false);
      }
    };
    loadBatches();
  }, []);

  // Load student data
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const student = await getStudentById(studentId);
        // Format date from ISO string to yyyy-MM-dd format
        const dob = student.dob ? new Date(student.dob).toISOString().split('T')[0] : '';
        setFormData({
          code: student.code || '',
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          fatherName: student.fatherName || '',
          motherName: student.motherName || '',
          dob: dob,
          gender: student.gender || '',
          email: student.email || '',
          phone: student.phone || '',
          address: student.address || '',
          parentPhone: student.parentPhone || '',
          parentEmail: student.parentEmail || '',
          batchId: student.batchId || '',
          section: student.section || '',
          photo: student.photo || '',
        });

        if (student.photo) {
          setPhotoPreview(student.photo);
        }

        // Check if student is already enrolled
        const enrollments = await getStudentEnrollments(studentId);
        if (enrollments.length > 0) {
          setIsEnrolled(true);
        }
      } catch (err) {
        console.error('Failed to load student:', err);
        setError('Failed to load student details');
      } finally {
        setLoadingStudent(false);
      }
    };
    loadStudent();
  }, [studentId]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryMenuRef.current && !countryMenuRef.current.contains(e.target as Node)) {
        setIsCountryMenuOpen(false);
      }
      if (parentCountryMenuRef.current && !parentCountryMenuRef.current.contains(e.target as Node)) {
        setIsParentCountryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validatePhoneNumber = (phone: string, countryCode: string) => {
    const country = COUNTRY_CODES.find((c) => c.code === countryCode);
    if (!country) return 'Invalid country code';

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== country.digits) {
      return `Phone must have exactly ${country.digits} digits`;
    }
    return '';
  };

  const handlePhoneBlur = (field: 'phone' | 'parentPhone') => {
    if (field === 'phone' && formData.phone) {
      const error = validatePhoneNumber(formData.phone, countryCode);
      setPhoneErrors((prev) => ({ ...prev, [field]: error }));
    } else if (field === 'parentPhone' && formData.parentPhone) {
      const error = validatePhoneNumber(formData.parentPhone, parentCountryCode);
      setPhoneErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) => ({ ...prev, photo: base64 }));
        setPhotoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateStudent(studentId, {
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        fatherName: formData.fatherName || undefined,
        motherName: formData.motherName || undefined,
        dob: formData.dob || undefined,
        gender: formData.gender || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        parentPhone: formData.parentPhone || undefined,
        parentEmail: formData.parentEmail || undefined,
        batchId: formData.batchId || undefined,
        section: formData.section || undefined,
        photo: formData.photo || undefined,
      });

      // If user checked the "Enroll" checkbox and batch is selected, create enrollment
      if (enrollStudent && formData.batchId && !isEnrolled) {
        try {
          await enrollStudentInBatch(studentId, formData.batchId);
          setIsEnrolled(true);
          console.log('✅ Student enrolled in batch successfully');
        } catch (enrollError: any) {
          const enrollMsg = enrollError.response?.data?.message || 'Failed to enroll student in batch';
          console.warn('⚠️ Enrollment warning:', enrollMsg);
          // Don't fail the whole operation if enrollment fails, just warn
        }
      }

      setSuccess(true);
      alert('✅ Student updated successfully!');
      navigate('student-list');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update student. Please try again.';
      setError(errorMsg);
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('student-list');
  };

  if (loadingStudent) {
    return <div className="p-4 text-center">Loading student details...</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-lg shadow-md max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Student</h1>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-200 rounded-full transition"
          title="Close"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm pb-24">
        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">Student Photo</label>
          <div className="flex gap-4 items-start">
            {photoPreview && (
              <div className="relative">
                <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
              </div>
            )}
            <div className="flex-1">
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 transition">
                <div className="flex flex-col items-center justify-center">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-500">(JPG, PNG, WebP)</span>
                </div>
                <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-gray-800 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Student Code *</label>
              <input
                type="text"
                disabled
                value={formData.code}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                title="Student code cannot be changed"
              />
              <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Father's Name</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Father's name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Mother's Name</label>
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Mother's name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Street address"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-gray-800 mb-4">Academic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Batch / Class (Optional)</label>
              <select
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={loadingBatches}
              >
                <option value="">
                  {loadingBatches ? 'Loading batches...' : 'Select batch (optional)'}
                </option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.code} / {batch.name}
                    {batch.semester ? ` - Sem ${batch.semester}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Section (Optional)</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select section (optional)</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          {/* Enrollment Checkbox */}
          {formData.batchId && !isEnrolled && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  checked={enrollStudent}
                  onChange={(e) => setEnrollStudent(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  ✅ <strong>Enroll this student in selected batch</strong>
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Checking this will automatically enroll the student in the selected batch
              </p>
            </div>
          )}

          {isEnrolled && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                ✅ <strong>Student is already enrolled in a batch</strong>
              </p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-gray-800 mb-4">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="student@example.com"
              />
            </div>
            <div />

            {/* Student Phone with Country Code */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Student Phone</label>

              <div ref={countryMenuRef} className="flex items-stretch border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-pink-500">
                {/* Country code button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryMenuOpen((prev) => !prev)}
                    className="h-full px-3 py-2 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300 flex items-center gap-1 focus:outline-none hover:bg-gray-100"
                  >
                    {countryCode}
                    <ChevronDown size={16} />
                  </button>
                  {isCountryMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto w-48">
                      {COUNTRY_CODES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setCountryCode(country.code);
                            setIsCountryMenuOpen(false);
                            setPhoneErrors((prev) => ({ ...prev, phone: '' }));
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-pink-100 text-gray-700"
                        >
                          {country.code} ({country.country})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone number input */}
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onBlur={() => handlePhoneBlur('phone')}
                  className="flex-1 px-3 py-2 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
              {phoneErrors.phone && <p className="text-xs text-red-600 mt-1">{phoneErrors.phone}</p>}
            </div>

            {/* Parent Phone with Country Code */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Parent Phone</label>

              <div ref={parentCountryMenuRef} className="flex items-stretch border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-pink-500">
                {/* Country code button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsParentCountryMenuOpen((prev) => !prev)}
                    className="h-full px-3 py-2 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300 flex items-center gap-1 focus:outline-none hover:bg-gray-100"
                  >
                    {parentCountryCode}
                    <ChevronDown size={16} />
                  </button>
                  {isParentCountryMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto w-48">
                      {COUNTRY_CODES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setParentCountryCode(country.code);
                            setIsParentCountryMenuOpen(false);
                            setPhoneErrors((prev) => ({ ...prev, parentPhone: '' }));
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-pink-100 text-gray-700"
                        >
                          {country.code} ({country.country})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone number input */}
                <input
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  onBlur={() => handlePhoneBlur('parentPhone')}
                  className="flex-1 px-3 py-2 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
              {phoneErrors.parentPhone && <p className="text-xs text-red-600 mt-1">{phoneErrors.parentPhone}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Parent Email</label>
              <input
                type="email"
                value={formData.parentEmail}
                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="parent@example.com"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 flex gap-3 justify-end shadow-lg">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Updating...' : 'Update Student'}
          </button>
        </div>
      </form>
    </div>
  );
}
