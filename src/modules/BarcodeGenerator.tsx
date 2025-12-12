import { useState } from 'react';
import { generateQRCode, generateBarcode, generateBothFormats } from '../api/barcodes';
import { Download, Copy, Printer, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BarcodeData {
  type: 'QR_CODE' | 'BARCODE' | 'BOTH';
  studentId: string;
  studentName: string;
  barcodeData: string;
  qrCode?: {
    dataUrl: string;
  };
  barcode?: {
    data: string;
  };
}

export default function BarcodeGenerator() {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [barcodeType, setBarcodeType] = useState<'qr' | 'barcode' | 'both'>('both');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [barcodeData, setBarcodeData] = useState<BarcodeData | null>(null);

  const handleGenerate = async () => {
    setError('');
    setSuccess('');

    if (!studentId.trim()) {
      setError('Please enter Student ID');
      return;
    }

    if (!studentName.trim()) {
      setError('Please enter Student Name');
      return;
    }

    setLoading(true);

    try {
      let data;

      if (barcodeType === 'qr') {
        data = await generateQRCode(studentId, studentName);
      } else if (barcodeType === 'barcode') {
        data = await generateBarcode(studentId, studentName);
      } else {
        data = await generateBothFormats(studentId, studentName);
      }

      setBarcodeData(data);
      setSuccess(`${barcodeType.toUpperCase()} code generated successfully!`);
    } catch (err) {
      setError('Failed to generate barcode. Please try again.');
      console.error('Barcode generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!barcodeData) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Barcode - Print</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px;
                background: white;
              }
              .barcode-card {
                border: 2px solid #333;
                padding: 30px;
                width: 300px;
                margin: 0 auto;
                text-align: center;
                background: white;
              }
              .barcode-card h3 { margin: 10px 0; font-size: 14px; }
              .barcode-card p { margin: 5px 0; font-size: 12px; }
              svg { margin: 20px 0; }
              img { max-width: 100%; margin: 20px 0; }
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="barcode-card">
              <h3>STUDENT ID CARD</h3>
              <p><strong>${barcodeData.studentName}</strong></p>
              <p>ID: ${barcodeData.studentId}</p>
              ${
                barcodeData.qrCode
                  ? `<img src="${barcodeData.qrCode.dataUrl}" alt="QR Code" width="200" height="200">`
                  : ''
              }
              ${barcodeData.barcodeData ? `<p style="font-size: 16px; font-weight: bold;">${barcodeData.barcodeData}</p>` : ''}
              <svg id="barcode" style="margin: 20px auto; display: block;"></svg>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
            <script>
              JsBarcode("#barcode", "${barcodeData.barcodeData}", {
                format: "CODE128",
                width: 2,
                height: 80,
                displayValue: true
              });
              window.print();
            <\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownloadQR = () => {
    if (!barcodeData?.qrCode?.dataUrl) return;

    const link = document.createElement('a');
    link.href = barcodeData.qrCode.dataUrl;
    link.download = `${barcodeData.studentId}-qr-code.png`;
    link.click();
  };

  const handleCopyBarcode = () => {
    if (!barcodeData?.barcodeData) return;
    navigator.clipboard.writeText(barcodeData.barcodeData);
    setSuccess('Barcode copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📸 Barcode Generator</h1>
          <p className="text-gray-600">Generate QR codes and barcodes for student identification</p>
        </div>

        {/* Input Section */}
        <div className="p-6 mb-6 shadow-lg rounded-lg bg-white">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                placeholder="Enter student ID (e.g., STU001)"
                value={studentId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
              <input
                type="text"
                placeholder="Enter student name (e.g., John Doe)"
                value={studentName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Barcode Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="qr"
                    checked={barcodeType === 'qr'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBarcodeType(e.target.value as 'qr' | 'barcode' | 'both')}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">QR Code</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="barcode"
                    checked={barcodeType === 'barcode'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBarcodeType(e.target.value as 'qr' | 'barcode' | 'both')}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Barcode (CODE128)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="both"
                    checked={barcodeType === 'both'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBarcodeType(e.target.value as 'qr' | 'barcode' | 'both')}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Both</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : '🎯 Generate Barcode'}
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Barcode Display */}
        {barcodeData && (
          <div className="p-8 shadow-lg bg-white rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Student ID Card</h2>
              <p className="text-lg font-semibold text-gray-700">{barcodeData.studentName}</p>
              <p className="text-sm text-gray-500">ID: {barcodeData.studentId}</p>
            </div>

            {/* QR Code Display */}
            {(barcodeData.type === 'QR_CODE' || barcodeData.type === 'BOTH') && barcodeData.qrCode && (
              <div className="mb-8 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📱 QR Code</h3>
                <div className="border-2 border-blue-200 p-4 rounded-lg bg-white inline-block">
                  <img
                    src={barcodeData.qrCode.dataUrl}
                    alt="QR Code"
                    width="300"
                    height="300"
                    className="border-2 border-gray-300 rounded"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3">Data: STUD-{barcodeData.studentId}</p>
                <button
                  onClick={handleDownloadQR}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download size={18} /> Download QR Code
                </button>
              </div>
            )}

            {/* Barcode Display */}
            {(barcodeData.type === 'BARCODE' || barcodeData.type === 'BOTH') && (
              <div className="mb-8 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Barcode (CODE128)</h3>
                <div className="border-2 border-blue-200 p-6 rounded-lg bg-white inline-block">
                  <svg id="barcodeDisplay" style={{ margin: '20px auto', display: 'block' }}></svg>
                </div>
                <p className="text-sm text-gray-600 mt-3 font-mono text-lg">{barcodeData.barcodeData}</p>
                <button
                  onClick={handleCopyBarcode}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Copy size={18} /> Copy Barcode Data
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-8 flex-wrap">
              <button
                onClick={handlePrint}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Printer size={18} /> Print Sticker
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-gray-700">
                <strong>💡 How to use:</strong>
              </p>
              <ul className="text-sm text-gray-700 list-disc list-inside mt-2">
                <li>Generate the barcode/QR code</li>
                <li>Print the sticker (4x6 or custom size)</li>
                <li>Stick on student ID card</li>
                <li>Ready to scan during attendance</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Load jsbarcode script and render barcode */}
      {barcodeData && (barcodeData.type === 'BARCODE' || barcodeData.type === 'BOTH') && (
        <>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            {`
              setTimeout(() => {
                const jsbarcodeWindow = window as any;
                if (jsbarcodeWindow.JsBarcode) {
                  jsbarcodeWindow.JsBarcode("#barcodeDisplay", "${barcodeData.barcodeData}", {
                    format: "CODE128",
                    width: 2,
                    height: 100,
                    displayValue: true,
                    margin: 10
                  });
                }
              }, 100);
            `}
          </script>
        </>
      )}
    </div>
  );
}
