import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Save, X, Upload, AlertCircle } from 'lucide-react';
import { createStudent, enrollStudentInBatch } from '../api/students';
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

export function AddStudent() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
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
  const [phoneErrors, setPhoneErrors] = useState<{ [key: string]: string }>({});
  const [countryCode, setCountryCode] = useState('+91');
  const [parentCountryCode, setParentCountryCode] = useState('+91');
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [isParentCountryMenuOpen, setIsParentCountryMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Get digit requirement for selected country code
  const getDigitRequirement = (code: string) => {
    return COUNTRY_CODES.find(c => c.code === code)?.digits || 10;
  };

  // Validate phone number
  const validatePhone = (phone: string, code: string) => {
    const digitRequirement = getDigitRequirement(code);
    const errors: { [key: string]: string } = {};
    
    if (phone && phone.length !== digitRequirement) {
      errors['phone'] = `Must be exactly ${digitRequirement} digits (${code} format)`;
    }
    return errors;
  };

  const validateParentPhone = (phone: string, code: string) => {
    const digitRequirement = getDigitRequirement(code);
    const errors: { [key: string]: string } = {};
    
    if (phone && phone.length !== digitRequirement) {
      errors['parentPhone'] = `Must be exactly ${digitRequirement} digits (${code} format)`;
    }
    return errors;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setFormData({ ...formData, phone: value });
    
    if (value) {
      setPhoneErrors(validatePhone(value, countryCode));
    } else {
      setPhoneErrors({});
    }
  };

  const handleParentPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setFormData({ ...formData, parentPhone: value });
    
    if (value) {
      setPhoneErrors(validateParentPhone(value, parentCountryCode));
    } else {
      setPhoneErrors({});
    }
  };

  // Fetch batches on component mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoadingBatches(true);
        const data = await getBatches();
        setBatches(data);
      } catch (err) {
        console.error('Failed to load batches:', err);
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchBatches();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryMenuRef.current && !countryMenuRef.current.contains(event.target as Node)) {
        setIsCountryMenuOpen(false);
      }
      if (parentCountryMenuRef.current && !parentCountryMenuRef.current.contains(event.target as Node)) {
        setIsParentCountryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size - limit to 5MB for image
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image using canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if image is too large
          const maxWidth = 800;
          const maxHeight = 600;
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with lower quality
          const compressedPhoto = canvas.toDataURL('image/jpeg', 0.7);
          setPhotoPreview(compressedPhoto);
          setFormData({ ...formData, photo: compressedPhoto });
        };
        img.src = reader.result as string;
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
      const createdStudent = await createStudent({
        code: formData.code,
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
        status: 'active',
      });

      // If user checked the "Enroll" checkbox and batch is selected, create enrollment
      if (enrollStudent && formData.batchId) {
        try {
          await enrollStudentInBatch(createdStudent.id, formData.batchId);
          console.log('✅ Student enrolled in batch successfully');
        } catch (enrollError: any) {
          const enrollMsg = enrollError.response?.data?.message || 'Failed to enroll student in batch';
          console.warn('⚠️ Enrollment warning:', enrollMsg);
          // Don't fail the whole operation if enrollment fails, just warn
        }
      }

      setSuccess(true);
      alert('✅ Student added successfully!');
      handleCancel();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to add student. Please try again.';
      setError(errorMsg);
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
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
    setPhotoPreview(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-gray-800">Add New Student</h2>
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
        <div className="max-w-[1000px] mx-auto p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ Student added successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
            {/* Photo Upload */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <label className="block text-sm text-gray-700 mb-3">Student Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="photo-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm cursor-pointer inline-block"
                  >
                    Upload Photo
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>
            </div>

            {/* Student Code & Basic Info */}
            <div className="mb-6">
              <h3 className="text-gray-800 mb-4">Student Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Student Code/ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., STU001"
                  />
                </div>
                <div />
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Father's Name</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter father's name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Mother's Name</label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter mother's name"
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
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
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
              {formData.batchId && (
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
                    
                    {/* LEFT: custom country code button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCountryMenuOpen((prev) => !prev)}
                        className="h-full px-3 py-2 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300 flex items-center gap-1 focus:outline-none hover:bg-gray-100"
                      >
                        <span>{countryCode}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>

                      {/* DROPDOWN MENU */}
                      {isCountryMenuOpen && (
                        <div className="absolute z-20 top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {COUNTRY_CODES.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setCountryCode(c.code);
                                setIsCountryMenuOpen(false);
                                if (formData.phone) {
                                  setPhoneErrors(validatePhone(formData.phone, c.code));
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                            >
                              <span>{c.country}</span>
                              <span className="font-mono text-gray-700">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* RIGHT: phone number input */}
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength={getDigitRequirement(countryCode)}
                      className={`flex-1 px-3 py-2 focus:outline-none ${
                        phoneErrors['phone'] ? 'bg-red-50' : ''
                      }`}
                      placeholder="9876543210"
                    />
                  </div>

                  {phoneErrors['phone'] && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {phoneErrors['phone']}
                    </div>
                  )}
                  {formData.phone && !phoneErrors['phone'] && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {countryCode} {formData.phone}
                    </p>
                  )}
                </div>

                {/* Parent Phone with Country Code */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Parent Phone</label>

                  <div ref={parentCountryMenuRef} className="flex items-stretch border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-pink-500">
                    
                    {/* LEFT: custom country code button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsParentCountryMenuOpen((prev) => !prev)}
                        className="h-full px-3 py-2 bg-gray-50 font-semibold text-gray-700 border-r border-gray-300 flex items-center gap-1 focus:outline-none hover:bg-gray-100"
                      >
                        <span>{parentCountryCode}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>

                      {/* DROPDOWN MENU */}
                      {isParentCountryMenuOpen && (
                        <div className="absolute z-20 top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {COUNTRY_CODES.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setParentCountryCode(c.code);
                                setIsParentCountryMenuOpen(false);
                                if (formData.parentPhone) {
                                  setPhoneErrors(validateParentPhone(formData.parentPhone, c.code));
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                            >
                              <span>{c.country}</span>
                              <span className="font-mono text-gray-700">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* RIGHT: phone number input */}
                    <input
                      type="text"
                      value={formData.parentPhone}
                      onChange={handleParentPhoneChange}
                      maxLength={getDigitRequirement(parentCountryCode)}
                      className={`flex-1 px-3 py-2 focus:outline-none ${
                        phoneErrors['parentPhone'] ? 'bg-red-50' : ''
                      }`}
                      placeholder="9876543210"
                    />
                  </div>

                  {phoneErrors['parentPhone'] && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {phoneErrors['parentPhone']}
                    </div>
                  )}
                  {formData.parentPhone && !phoneErrors['parentPhone'] && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {parentCountryCode} {formData.parentPhone}
                    </p>
                  )}
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
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={3}
                    placeholder="Enter complete address"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">CANCEL</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm">{loading ? 'SAVING...' : 'SAVE STUDENT'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
