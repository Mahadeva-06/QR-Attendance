import { useState } from 'react';
import { Download, Printer, AlertCircle, CheckCircle2, Search, Loader2 } from 'lucide-react';
import * as QRCode from 'qrcode';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

interface StudentInfo {
  id: string;
  code: string;
  firstName: string;
  lastName?: string;
  batchId?: string;
  batch?: {
    id: string;
    code: string;
    name: string;
  };
}

export default function SimpleQRCodeGenerator() {
  const [searchStudentId, setSearchStudentId] = useState('');
  const [studentData, setStudentData] = useState<StudentInfo | null>(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [qrError, setQRError] = useState('');
  const [qrSuccess, setQRSuccess] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [qrValue, setQRValue] = useState<string>('');

  // Search student
  const handleSearchStudent = async () => {
    setSearchError('');
    setQRError('');
    setQRSuccess('');
    setGeneratedQR(null);

    if (!searchStudentId.trim()) {
      setSearchError('Please enter Student Code');
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/students');
      const students = await response.json();

      const found = students.find(
        (s: StudentInfo) =>
          s.code.toLowerCase() === searchStudentId.toLowerCase() ||
          s.id.toLowerCase() === searchStudentId.toLowerCase()
      );

      if (!found) {
        setSearchError(`Student "${searchStudentId}" not found`);
        setStudentData(null);
      } else if (!found.batchId && !found.batch?.id) {
        setSearchError(`Student "${found.code}" is not enrolled in any batch`);
        setStudentData(null);
      } else {
        setStudentData(found);
        setSearchError('');
        setQRSuccess('✅ Student found! Generate QR code below.');
        setTimeout(() => setQRSuccess(''), 3000);
      }
    } catch (err) {
      setSearchError('Failed to fetch students');
      console.error('Error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Generate QR code
  const generateQRCode = async () => {
    if (!studentData) return;

    try {
      setQRError('');
      const qrData = `STUD-${studentData.code}-${Date.now()}`;
      setQRValue(qrData);

      // Generate QR code
      const qrUrl = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 400,
        margin: 0,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setGeneratedQR(qrUrl);
    } catch (error: any) {
      setQRError(`Failed to generate QR code: ${error.message}`);
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.href = generatedQR;
    link.download = `qrcode-${studentData?.code}-${Date.now()}.png`;
    link.click();
  };

  // Print QR code
  const printQRCode = () => {
    if (!generatedQR) return;

    const printWindow = window.open('', '', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${studentData?.code}</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; border: 2px solid #ccc; }
            </style>
          </head>
          <body>
            <img src="${generatedQR}" alt="QR Code" />
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📱 QR Code Generator</h1>
        <p className="text-gray-600 mt-2">Generate clean QR codes for student ID cards - No text, just QR code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Student Search */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">🔍 Find Student</h2>

          <div className="space-y-3">
            <Input
              placeholder="Enter Student Code (e.g., STU001)"
              value={searchStudentId}
              onChange={(e) => setSearchStudentId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchStudent()}
            />
            <Button
              onClick={handleSearchStudent}
              disabled={searchLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {searchLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Student
                </>
              )}
            </Button>
          </div>

          {searchError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{searchError}</AlertDescription>
            </Alert>
          )}

          {qrSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{qrSuccess}</AlertDescription>
            </Alert>
          )}

          {studentData && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-gray-900">{studentData.firstName} {studentData.lastName}</p>
              <p className="text-sm text-gray-600">Code: <span className="font-mono">{studentData.code}</span></p>
              {studentData.batch && (
                <p className="text-sm text-gray-600">Batch: {studentData.batch.name}</p>
              )}
            </div>
          )}

          {studentData && !generatedQR && (
            <Button
              onClick={generateQRCode}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Generate QR Code
            </Button>
          )}
        </Card>

        {/* Right: QR Code Display */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">📊 QR Code Preview</h2>

          {qrError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{qrError}</AlertDescription>
            </Alert>
          )}

          {generatedQR && (
            <div className="space-y-4">
              {/* QR Code Display - ONLY QR CODE */}
              <div className="flex justify-center p-4 bg-white border-2 border-gray-300 rounded-lg">
                <img
                  src={generatedQR}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>

              {/* Info */}
              <div className="text-center bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600 font-mono break-all">{qrValue}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={downloadQRCode}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code (PNG)
                </Button>
                <Button
                  onClick={printQRCode}
                  variant="outline"
                  className="w-full"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print QR Code
                </Button>
              </div>

              {/* Reset */}
              <Button
                onClick={() => {
                  setGeneratedQR(null);
                  setStudentData(null);
                  setSearchStudentId('');
                  setQRValue('');
                }}
                variant="ghost"
                className="w-full text-gray-600"
              >
                Generate Another
              </Button>
            </div>
          )}

          {!generatedQR && !studentData && (
            <div className="text-center py-12 text-gray-500">
              <p>Search for a student to generate QR code</p>
            </div>
          )}

          {!generatedQR && studentData && (
            <div className="text-center py-8 text-gray-500">
              <p>Click "Generate QR Code" to create QR code</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
