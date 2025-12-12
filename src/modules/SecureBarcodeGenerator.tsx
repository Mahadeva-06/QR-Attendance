import { useState, useEffect, useRef } from 'react';
import { Download, Copy, Printer, AlertCircle, CheckCircle2, Search, Loader2 } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

interface StudentInfo {
  id: string;
  code: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  batchId?: string;
  batch?: {
    id: string;
    code: string;
    name: string;
    year?: number;
    semester?: number;
    course?: string;
  };
}

interface BarcodeResponse {
  success: boolean;
  data?: {
    barcodeId: string;
    qrCodeDataUrl: string;
    barcodeData: string;
    barcodeNumber: string;
    studentCode: string;
    studentName: string;
    status: string;
  };
  error?: string;
  message?: string;
}

export default function SecureBarcodeGenerator() {
  // Refs
  const barcodeRef = useRef<SVGSVGElement>(null);

  // Student Search Form
  const [searchStudentId, setSearchStudentId] = useState('');
  const [studentData, setStudentData] = useState<StudentInfo | null>(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [studentFound, setStudentFound] = useState(false);

  // Barcode Generation
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [barcodeError, setBarcodeError] = useState('');
  const [barcodeSuccess, setBarcodeSuccess] = useState('');
  const [barcodeData, setBarcodeData] = useState<BarcodeResponse['data'] | null>(null);

  // Search for student by ID
  const handleSearchStudent = async () => {
    setSearchError('');
    setBarcodeData(null);
    setBarcodeError('');
    setBarcodeSuccess('');

    if (!searchStudentId.trim()) {
      setSearchError('Please enter Student ID');
      return;
    }

    setSearchLoading(true);
    try {
      // Fetch from students API
      const response = await fetch('http://localhost:3000/api/students');
      const students = await response.json();

      // Search by code or ID
      const found = students.find(
        (s: StudentInfo) =>
          s.code.toLowerCase() === searchStudentId.toLowerCase() ||
          s.id.toLowerCase() === searchStudentId.toLowerCase()
      );

      if (!found) {
        setSearchError(`❌ Student with ID "${searchStudentId}" not found in the system`);
        setStudentData(null);
        setStudentFound(false);
      } else if (!found.batchId && !found.batch?.id) {
        setSearchError(`❌ Student "${found.code}" is not enrolled in any batch. Please enroll student first.`);
        setStudentData(null);
        setStudentFound(false);
      } else {
        setStudentData(found);
        setStudentFound(true);
        setSearchError('');
      }
    } catch (err) {
      setSearchError('Failed to search for student. Please try again.');
      console.error('Search error:', err);
      setStudentData(null);
      setStudentFound(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle Enter key in search field
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && searchStudentId) {
        handleSearchStudent();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchStudentId]);

  // Generate linear barcode when data arrives
  useEffect(() => {
    if (barcodeData?.barcodeNumber && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, barcodeData.barcodeNumber, {
          format: 'CODE128',
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 14,
          margin: 10,
        });
      } catch (err) {
        console.error('Error generating barcode:', err);
      }
    }
  }, [barcodeData?.barcodeNumber]);

  // Generate barcode for verified student
  const handleGenerateBarcode = async () => {
    if (!studentData) {
      setBarcodeError('Please search and verify student first');
      return;
    }

    // Validate batchId exists
    const batchId = studentData.batchId || studentData.batch?.id;
    if (!batchId) {
      setBarcodeError('Student batch information is missing. Please try another student.');
      return;
    }

    setBarcodeError('');
    setBarcodeSuccess('');

    setBarcodeLoading(true);
    try {
      // Call secure barcode API
      // Note: Don't send semesterId if we don't have a valid section ID
      // Backend will skip semester validation if semesterId is not provided
      const requestBody: any = {
        studentId: studentData.id,
        batchId: batchId,
        action: 'generate',
      };

      const response = await fetch('http://localhost:3000/api/barcodes-secure/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        setBarcodeError(
          result.message || result.error || 'Failed to generate barcode. Please try again.'
        );
        setBarcodeData(null);
      } else {
        setBarcodeData(result.data);
        setBarcodeSuccess('✅ Barcode generated successfully!');
      }
    } catch (err) {
      setBarcodeError('Failed to generate barcode. Please try again.');
      console.error('Generation error:', err);
      setBarcodeData(null);
    } finally {
      setBarcodeLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!barcodeData?.qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = barcodeData.qrCodeDataUrl;
    link.download = `barcode-${barcodeData.studentCode}.png`;
    link.click();
  };

  const handleCopy = async () => {
    if (!barcodeData) return;
    await navigator.clipboard.writeText(barcodeData.barcodeData);
  };

  const handlePrint = () => {
    if (!barcodeData) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Student ID Card - ${barcodeData.studentName}</title>
            <style>
              * { margin: 0; padding: 0; }
              body { 
                font-family: 'Arial', sans-serif;
                background: #f0f0f0;
                padding: 20px;
              }
              .card-container {
                width: 400px;
                margin: 0 auto;
                background: white;
                border: 3px solid #1e3a8a;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .card-header {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #1e3a8a;
                padding-bottom: 15px;
              }
              .card-header h2 {
                font-size: 20px;
                color: #1e3a8a;
                margin-bottom: 5px;
              }
              .card-header p {
                font-size: 12px;
                color: #666;
              }
              .student-info {
                margin: 20px 0;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                margin: 12px 0;
                padding: 8px 0;
                border-bottom: 1px dotted #ccc;
              }
              .info-label {
                font-weight: bold;
                color: #333;
                width: 40%;
              }
              .info-value {
                color: #555;
                width: 60%;
                text-align: right;
              }
              .barcode-section {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 5px;
              }
              .barcode-section img {
                max-width: 100%;
                height: auto;
                margin: 15px 0;
              }
              .barcode-text {
                font-size: 14px;
                font-weight: bold;
                letter-spacing: 2px;
                color: #1e3a8a;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 10px;
                color: #999;
              }
              @media print {
                body { background: white; padding: 0; }
                .card-container { box-shadow: none; width: 100%; }
              }
            </style>
          </head>
          <body>
            <div class="card-container">
              <div class="card-header">
                <h2>🎓 STUDENT ID CARD</h2>
                <p>Attendance Pro System</p>
              </div>
              
              <div class="student-info">
                <div class="info-row">
                  <span class="info-label">Student ID:</span>
                  <span class="info-value"><strong>${barcodeData.studentCode}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${barcodeData.studentName}</span>
                </div>
              </div>
              
              <div class="barcode-section">
                <div style="font-size: 12px; color: #666; margin-bottom: 10px;">QR Code</div>
                <img src="${barcodeData.qrCodeDataUrl}" alt="QR Code" style="width: 200px; height: 200px;" />
                <div class="barcode-text">${barcodeData.barcodeNumber}</div>
              </div>
              
              <div class="footer">
                <p>Generated on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                <p>Status: ${barcodeData.status}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🎫 Barcode Generator</h1>
        <p className="text-gray-600 mt-2">Generate QR codes and barcodes for verified student identification</p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Student Search & Form */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">👤 Student Lookup</h2>

            {/* Student Search Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter Student ID (e.g., STU001)"
                    value={searchStudentId}
                    onChange={(e) => setSearchStudentId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearchStudent}
                    disabled={searchLoading || !searchStudentId}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {searchLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Search Error */}
              {searchError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{searchError}</AlertDescription>
                </Alert>
              )}

              {/* Student Details Form (Auto-filled) */}
              {studentFound && studentData && (
                <div className="space-y-3 mt-6 pt-6 border-t-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                      Student ID
                    </label>
                    <div className="bg-gray-50 p-2 rounded border text-sm font-medium text-green-700">
                      ✅ {studentData.code}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                      Full Name
                    </label>
                    <div className="bg-gray-50 p-2 rounded border text-sm">
                      {studentData.firstName} {studentData.lastName || ''}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                      Email
                    </label>
                    <div className="bg-gray-50 p-2 rounded border text-sm text-gray-600">
                      {studentData.email || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                      Phone
                    </label>
                    <div className="bg-gray-50 p-2 rounded border text-sm text-gray-600">
                      {studentData.phone || 'N/A'}
                    </div>
                  </div>

                  {studentData.batch && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                          Batch
                        </label>
                        <div className="bg-gray-50 p-2 rounded border text-sm">
                          {studentData.batch.name}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                          Academic Year
                        </label>
                        <div className="bg-gray-50 p-2 rounded border text-sm">
                          {studentData.batch.year || 'N/A'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                          Course
                        </label>
                        <div className="bg-gray-50 p-2 rounded border text-sm">
                          {studentData.batch.course || 'N/A'}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateBarcode}
                    disabled={barcodeLoading}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {barcodeLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        🎫 Generate Barcode
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Barcode Display & Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barcode Error */}
          {barcodeError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{barcodeError}</AlertDescription>
            </Alert>
          )}

          {/* Barcode Success */}
          {barcodeSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{barcodeSuccess}</AlertDescription>
            </Alert>
          )}

          {/* Barcode Display */}
          {barcodeData && (
            <Card className="p-8 bg-white">
              <div className="text-center space-y-6">
                {/* Card Title */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🎓 Student ID Card</h2>
                  <p className="text-gray-600 mt-1">{barcodeData.studentName}</p>
                  <p className="text-sm text-gray-500">ID: {barcodeData.studentCode}</p>
                </div>

                {/* QR Code Display */}
                <div className="flex justify-center bg-gray-50 p-6 rounded-lg">
                  {barcodeData.qrCodeDataUrl && (
                    <img
                      src={barcodeData.qrCodeDataUrl}
                      alt="QR Code"
                      className="w-64 h-64 object-contain"
                    />
                  )}
                </div>

                {/* Linear Barcode Display */}
                <div className="flex justify-center bg-gray-50 p-6 rounded-lg">
                  <svg ref={barcodeRef}></svg>
                </div>

                {/* Barcode Number */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Barcode Number</p>
                  <p className="text-lg font-bold text-blue-900">{barcodeData.barcodeNumber}</p>
                </div>

                {/* Status Badge */}
                <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                  ✅ Status: {barcodeData.status}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <Button
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={handleCopy}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    onClick={handlePrint}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!barcodeData && studentFound && (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <p className="text-lg font-medium">Enter student details and generate barcode</p>
                <p className="text-sm mt-2">Click "Generate Barcode" button to create QR code for this student</p>
              </div>
            </Card>
          )}

          {!barcodeData && !studentFound && (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <p className="text-lg font-medium">👤 Search for a student</p>
                <p className="text-sm mt-2">Enter a Student ID and click search to get started</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
