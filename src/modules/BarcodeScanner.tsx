import { useState, useEffect, useRef } from 'react';
import Quagga from '@ericblade/quagga2';
import { Play, Square, AlertCircle, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

interface AttendanceRecord {
  studentCode: string;
  studentName: string;
  timestamp: string;
  status: 'present' | 'error';
  message?: string;
}

export default function BarcodeScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<AttendanceRecord[]>([]);
  const [scanError, setScanError] = useState('');
  const [scanSuccess, setScanSuccess] = useState('');
  const [pauseMessage, setPauseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('c38a5b08-bbf9-49a1-bd42-ad928794bbcb');
  const [batches, setBatches] = useState<any[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [scanStartTime, setScanStartTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
  const [scanEndTime, setScanEndTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
  const [lateTime, setLateTime] = useState('10:30');
  
  const videoRef = useRef<HTMLDivElement>(null);
  const lastScannedRef = useRef<string | null>(null);
  const scanCooldownRef = useRef<number>(0);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchBatches();
    
    // Update date/time every second
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now);
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setScanStartTime(timeStr);
      setScanEndTime(timeStr);
      
      // Auto-update date if it changed
      const today = now.toISOString().split('T')[0];
      if (selectedDate !== today) {
        setSelectedDate(today);
      }
    }, 1000);
    
    return () => {
      clearInterval(interval);
      // Cleanup on unmount
      Quagga.stop();
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [selectedDate]);

  const fetchBatches = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/batches');
      if (!response.ok) {
        console.error('Error fetching batches:', response.status, response.statusText);
        setBatches([]);
        return;
      }
      const data = await response.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setBatches([]);
    }
  };

  // Initialize scanner with Quagga2
  const startScanning = async () => {
    setScanError('');
    setScanSuccess('');
    
    try {
      console.log('🎬 Starting Quagga2 scanner...');
      
      if (!videoRef.current) {
        throw new Error('Video container not found');
      }

      // Initialize Quagga with a promise wrapper
      const initPromise = new Promise((resolve, reject) => {
        Quagga.init({
          inputStream: {
            type: 'LiveStream',
            target: videoRef.current as HTMLElement,
            constraints: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'environment'
            }
          },
          decoder: {
            readers: ['code_128_reader', 'code_39_reader', 'code_93_reader', 'ean_reader'],
          },
          locate: true,
          numOfWorkers: navigator.hardwareConcurrency || 1,
          frequency: 10
        }, (err: any) => {
          if (err) {
            console.error('Quagga init error:', err);
            reject(err);
          } else {
            console.log('✅ Quagga initialized');
            resolve(null);
          }
        });
      });

      await initPromise;

      // Set up detection handler BEFORE starting
      Quagga.onDetected((result: any) => {
        if (result && result.codeResult) {
          const barcode = result.codeResult.code;
          console.log('🎯 Quagga - Barcode detected:', barcode);
          console.log('   Format:', result.codeResult.format);
          handleBarcodeDetected(barcode);
        }
      });

      // NOW start the scanner
      Quagga.start();
      setIsScanning(true);
      setScanSuccess('✅ Scanner activated! Point camera at barcode');
      setTimeout(() => setScanSuccess(''), 2000);
      
      console.log('✅ Quagga scanner started successfully');
    } catch (error: any) {
      console.error('Failed to start scanner:', error);
      setScanError(`❌ ${error?.message || 'Failed to start scanner'}`);
      setIsScanning(false);
    }
  };

  // Handle scanned barcode
  const handleBarcodeDetected = async (barcode: string) => {
    // VALIDATION: Ignore garbage/incomplete barcodes
    // Valid barcodes must:
    // 1. Start with "STUD" and have at least 7 characters (STUD + min 3 char code)
    // 2. OR be only alphanumeric after STUD prefix (no special chars except numbers)
    const isValidBarcode = barcode.startsWith('STUD') && 
                          barcode.length >= 7 && 
                          /^STUD[A-Z0-9]+$/.test(barcode);
    
    if (!isValidBarcode) {
      console.log('❌ Invalid barcode format (garbage data), ignoring:', barcode);
      return; // Silently ignore garbage barcodes
    }

    // Prevent rapid duplicate scans (cooldown: 1 second)
    const now = Date.now();
    if (lastScannedRef.current === barcode && now - scanCooldownRef.current < 1000) {
      console.log('⏸️ Duplicate scan ignored (cooldown):', barcode);
      return;
    }

    lastScannedRef.current = barcode;
    scanCooldownRef.current = now;

    console.log('✅ Processing barcode...');
    setIsLoading(true);
    setScanError('');
    setScanSuccess('');

    try {
      console.log('🔍 Barcode value:', barcode);
      
      // Extract student code from barcode format: STUD{studentCode}
      // e.g., "STUDSTU888" -> extract "STU888"
      let studentCode = '';
      
      if (barcode.startsWith('STUD') && barcode.length > 4) {
        // Remove the "STUD" prefix to get the student code
        studentCode = barcode.substring(4);
      } else {
        // If it doesn't start with STUD, use the whole barcode as student code
        studentCode = barcode;
      }

      console.log('📤 Extracted student code:', studentCode);
      console.log('📤 Sending to backend:', { barcodeNumber: barcode, studentCode, batchId: selectedBatch });

      // Get current scan time for late time comparison
      const now = new Date();
      const scanTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      
      // Query backend to mark attendance
      const response = await fetch('http://localhost:3000/api/attendance/mark-by-barcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barcodeNumber: barcode,
          batchId: selectedBatch,
          studentCode: studentCode,
          scanTime: scanTime,
          scanStartTime: scanStartTime,
          scanEndTime: scanEndTime,
          lateTime: lateTime,
        }),
      });

      const result = await response.json();
      console.log('📥 Backend response:', result);

      // ALWAYS pause scanner after processing (whether success or error)
      console.log('⏸️ Stopping scanner...');
      Quagga.stop();
      setIsScanning(false);

      if (response.ok && result.success) {
        const record: AttendanceRecord = {
          studentCode: result.data.studentCode,
          studentName: result.data.studentName,
          timestamp: new Date().toLocaleTimeString(),
          status: result.data.status === 'late' ? 'error' : 'present',
          message: result.data.status === 'late' ? '⏰ Marked LATE' : '✅ Attendance marked',
        };

        setScannedBarcodes((prev) => [record, ...prev]);
        const statusMsg = result.data.status === 'late' ? 'marked LATE' : 'marked present';
        setScanSuccess(`✅ ${result.data.studentName} ${statusMsg}! Scanner stopped.`);
        // Notify other parts of the app (DailyAttendance) to refresh
        try {
          const eventDetail = {
            studentCode: result.data.studentCode,
            date: new Date().toISOString().split('T')[0],
            batchId: selectedBatch,
          };
          window.dispatchEvent(new CustomEvent('attendance:updated', { detail: eventDetail }));
        } catch (e) {
          console.warn('Could not dispatch attendance event', e);
        }
        setPauseMessage('');
      } else {
        // Handle different error codes
        let errorMessage = result.message || result.error || 'Failed to mark attendance';
        
        if (response.status === 409) {
          errorMessage = `⚠️ ${result.message || 'Already marked present today'} (Duplicate attendance prevented)`;
        }
        
        const errorRecord: AttendanceRecord = {
          studentCode: studentCode,
          studentName: result.data?.studentName || 'Unknown',
          timestamp: new Date().toLocaleTimeString(),
          status: 'error',
          message: errorMessage,
        };

        setScannedBarcodes((prev) => [errorRecord, ...prev]);
        setScanError(`❌ ${errorMessage}. Scanner stopped.`);
        setPauseMessage('');
      }

      // Clear any existing timeout
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    } catch (err: any) {
      console.error('❌ Error processing barcode:', err);
      setScanError(`Failed to process barcode: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop scanning
  const stopScanning = async () => {
    try {
      Quagga.stop();
      setIsScanning(false);
      console.log('✅ Scanner stopped');
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  };

  // Reset records
  const resetRecords = () => {
    setScannedBarcodes([]);
    setScanError('');
    setScanSuccess('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Date/Time */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📱 Barcode Scanner</h1>
          <p className="text-gray-600 mt-2">Scan student barcodes to mark attendance automatically</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
          <div className="text-sm text-gray-600">📅 Date & Time</div>
          <div className="text-xl font-bold text-blue-900">
            {currentDateTime.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
          <div className="text-lg text-blue-700 font-semibold">{currentDateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Scanner Controls */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">⚙️ Scanner Settings</h2>

            {/* Batch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                disabled={isScanning}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name} ({batch.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Attendance Date
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={isScanning}
                  className="hidden"
                />
                <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-semibold">
                  {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={isScanning}
                  className="w-12 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  title="Click to change date"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Auto-updates daily</p>
            </div>

            {/* Scan Start Time & Scan End Time (Side-by-side) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⏱️ Scan Start Time
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-semibold text-sm">
                  {scanStartTime}
                </div>
                <p className="text-xs text-gray-500 mt-1">Session start</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⏳ Scan End Time
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-semibold text-sm">
                  {scanEndTime}
                </div>
                <p className="text-xs text-gray-500 mt-1">Session end</p>
              </div>
            </div>

            {/* Late Time Threshold - Teacher Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏰ Late Time Threshold (Teacher Input)
              </label>
              <input
                type="time"
                value={lateTime}
                onChange={(e) => setLateTime(e.target.value)}
                disabled={isScanning}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Students marked 'late' if scanned after this time</p>
            </div>

            {/* Scanning Status */}
            <div className={`p-3 rounded-lg ${isScanning ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50 border-2 border-gray-300'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className={isScanning ? 'text-green-700 font-semibold' : 'text-gray-700'}>
                  {isScanning ? 'Scanning Active' : 'Scanner Inactive'}
                </span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-2">
              {!isScanning ? (
                <Button
                  onClick={startScanning}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Scanner
                </Button>
              ) : (
                <Button
                  onClick={stopScanning}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Scanner
                </Button>
              )}

              <Button
                onClick={resetRecords}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Records
              </Button>
            </div>

            {/* Statistics */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-900">Total Scanned:</span> {scannedBarcodes.length}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold text-green-700">Present:</span>{' '}
                {scannedBarcodes.filter((r) => r.status === 'present').length}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold text-red-700">Errors:</span>{' '}
                {scannedBarcodes.filter((r) => r.status === 'error').length}
              </p>
            </div>
          </Card>
        </div>

        {/* Right: Scanner Display & Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Display */}
          <Card className={`p-6 ${!isScanning ? 'hidden' : ''}`}>
            <h3 className="text-lg font-bold mb-4 text-gray-900">📹 Camera Feed</h3>
            <div
              ref={videoRef}
              className="rounded-lg overflow-hidden bg-black"
              style={{ minHeight: '400px', position: 'relative' }}
            />
          </Card>

          {/* Messages */}
          {pauseMessage && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 font-semibold">{pauseMessage}</AlertDescription>
            </Alert>
          )}

          {scanError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{scanError}</AlertDescription>
            </Alert>
          )}

          {scanSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{scanSuccess}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <Alert className="border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-800">Processing barcode...</AlertDescription>
            </Alert>
          )}

          {/* Scanned Records */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">📋 Attendance Records</h3>

            {scannedBarcodes.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No barcodes scanned yet. Start scanning to mark attendance.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {scannedBarcodes.map((record, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      record.status === 'present'
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{record.studentName}</p>
                        <p className="text-sm text-gray-600">{record.studentCode}</p>
                        {record.message && (
                          <p className={`text-sm font-semibold mt-1 ${record.status === 'present' ? 'text-green-700' : 'text-red-700'}`}>
                            {record.message}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{record.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
