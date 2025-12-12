import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { navigate } from '../utils/navigator';
import jsQR from 'jsqr';

export default function BatchQRGenerator() {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | undefined>(undefined);
  // Expiry removed for testing QR scanning without time limits
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [expiryMinutes, setExpiryMinutes] = useState<number>(1);
  const [tick, setTick] = useState<number>(0); // used to refresh countdowns every second
  const [showScanner, setShowScanner] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [cameraError, setCameraError] = useState<string>('');
  const [batchStudents, setBatchStudents] = useState<any[]>([]);
  const [presentStudentIds, setPresentStudentIds] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchBatchStudents(selectedBatch);
    }
  }, [selectedBatch]);

  useEffect(() => {
    // listen for attendance updates (dispatched after mark-by-qr) and refresh present list
    const handler = (_e: any) => {
      if (selectedBatch) fetchAttendanceForBatch(selectedBatch);
    };
    window.addEventListener('attendance:updated', handler as EventListener);
    return () => window.removeEventListener('attendance:updated', handler as EventListener);
  }, [selectedBatch]);

  const fetchAttendanceForBatch = async (batchId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`http://localhost:3000/api/attendance?date=${today}&batchId=${batchId}`);
      if (!res.ok) {
        setPresentStudentIds(new Set());
        return;
      }
      const json = await res.json();
      const ids = new Set<string>((json.data || []).map((r: any) => r.studentId));
      setPresentStudentIds(ids);
    } catch (e) {
      console.error('Error fetching attendance for batch', e);
      setPresentStudentIds(new Set());
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/batches');
      if (!res.ok) {
        console.error('Failed fetching batches, status:', res.status);
        setBatches([]);
        return;
      }
      const data = await res.json();
      setBatches(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) setSelectedBatch(data[0].id);
    } catch (err) {
      console.error('Error fetching batches', err);
      setBatches([]);
    }
  };

  const fetchBatchStudents = async (batchId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/batches/${batchId}/students`);
      if (!res.ok) {
        console.error('Failed fetching batch students, status:', res.status);
        setBatchStudents([]);
        return;
      }
      const data = await res.json();
      setBatchStudents(Array.isArray(data) ? data : []);
      // also refresh attendance status for this batch
      fetchAttendanceForBatch(batchId);
    } catch (err) {
      console.error('Error fetching batch students', err);
      setBatchStudents([]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedBatch) return;
    setIsLoading(true);
    setResults(null);
    try {
      const res = await fetch('http://localhost:3000/api/attendance/generate-batch-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: selectedBatch, expiryMinutes }),
      });
      const json = await res.json();
      setResults(json.data || []);
      fetchAttendanceForBatch(selectedBatch);
    } catch (err) {
      console.error('Generate error', err);
      setResults([{ error: String(err) }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRemaining = (expiresAtStr: string | undefined) => {
    if (!expiresAtStr) return 'N/A';
    const expires = new Date(expiresAtStr);
    const diff = Math.max(0, expires.getTime() - Date.now());
    const sec = Math.floor(diff / 1000);
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const regenerateForStudent = async (studentId: string) => {
    if (!selectedBatch) return;
    try {
      const res = await fetch('http://localhost:3000/api/attendance/regenerate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: selectedBatch, studentId, expiryMinutes }),
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.data) && json.data.length > 0) {
        // Update results for this student
        const updated = (results || []).map((r: any) => r.studentId === studentId ? { ...r, ...json.data.find((d: any) => d.studentId === studentId) } : r);
        setResults(updated);
        fetchAttendanceForBatch(selectedBatch);
      } else {
        alert('Failed to regenerate QR');
      }
    } catch (e) {
      console.error('Regenerate error', e);
      alert('Failed to regenerate QR');
    }
  };

  const regenerateAll = async () => {
    if (!selectedBatch) return;
    try {
      const res = await fetch('http://localhost:3000/api/attendance/regenerate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: selectedBatch, expiryMinutes }),
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        setResults(json.data);
        fetchAttendanceForBatch(selectedBatch);
      } else {
        alert('Failed to regenerate all QRs');
      }
    } catch (e) {
      console.error('Regenerate all error', e);
      alert('Failed to regenerate all QRs');
    }
  };

  const startScanner = async () => {
    setShowScanner(true);
    setScannerActive(true);
    setScannedData('');
    setCameraError('');

    // Wait for video element to be mounted
    setTimeout(async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported in this browser');
        }

        console.log('📹 Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('✅ Camera stream acquired');
          
          // Start scanning after video plays
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            console.log('▶️ Video playing');
            startFrameScanning();
          };
        }
      } catch (err: any) {
        console.error('❌ Camera error:', err);
        const errorMsg = err.message || 'Unable to access camera';
        setCameraError(errorMsg);
        alert(`Camera Error: ${errorMsg}\n\nMake sure:\n1. You allowed camera permission\n2. Another app isn't using the camera\n3. Your browser has camera access enabled`);
        setScannerActive(false);
        setShowScanner(false);
      }
    }, 100);
  };

  const startFrameScanning = () => {
    let scanInterval: NodeJS.Timeout;
    let lastScannedCode = '';
    
    const scan = () => {
      if (canvasRef.current && videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0);
            
            // Get image data and decode QR
            const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (qrCode && qrCode.data) {
              const code = qrCode.data;
              // Only process if it's a new code (prevent duplicate scans)
              if (code !== lastScannedCode) {
                lastScannedCode = code;
                console.log('✅ QR Code Detected:', code);
                setScannedData(code);
                clearInterval(scanInterval);
                handleQRScanned(code);
              }
            }
          }
        } catch (e) {
          // Silently ignore errors during scanning
        }
      }
    };

    scanInterval = setInterval(scan, 300);
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setScannerActive(false);
    setShowScanner(false);
  };

  const handleQRScanned = async (qrToken: string) => {
    if (!selectedBatch) return;
    
    try {
      // If the scanned data is a full URL (contains ?token=...), extract the token param.
      let tokenValue = qrToken;
      try {
        if (typeof qrToken === 'string' && (qrToken.startsWith('http://') || qrToken.startsWith('https://'))) {
          const parsed = new URL(qrToken);
          const t = parsed.searchParams.get('token');
          if (t) tokenValue = t;
        } else if (qrToken.includes('token=')) {
          // fallback: extract after token=
          const m = qrToken.match(/token=([^&\s]+)/);
          if (m && m[1]) tokenValue = decodeURIComponent(m[1]);
        }
      } catch (e) {
        // ignore parsing errors and send raw scanned string
      }

      const res = await fetch('http://localhost:3000/api/attendance/mark-by-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: tokenValue,
          batchId: selectedBatch,
          scanTime: new Date().toISOString(),
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`✅ Attendance marked for ${data.data?.student?.firstName || data.data?.studentCode || 'student'}`);
        try {
          const markedDate = new Date().toISOString().split('T')[0];
          window.dispatchEvent(new CustomEvent('attendance:updated', { detail: { studentCode: data.data?.studentCode || data.data?.student?.code, date: markedDate, batchId: selectedBatch } }));
        } catch (e) {
          // ignore dispatch errors
        }
        setScannedData('');
      } else {
        const errData = await res.json();
        alert(`❌ Error: ${errData.message || 'Failed to mark attendance'}`);
      }
    } catch (err) {
      console.error('QR scan error:', err);
      alert('❌ Error processing QR code');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Batch QR Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full px-3 py-2 border rounded">
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
            ))}
          </select>

          {/* Expiry removed for testing — tokens generated without expiry enforcement */}

          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Expire in</label>
              <div className="flex items-center rounded bg-white border px-2">
                <button className={`px-2 py-1 text-xs ${expiryMinutes===1 ? 'bg-blue-600 text-white rounded' : ''}`} onClick={() => setExpiryMinutes(1)}>1m</button>
                <button className={`px-2 py-1 text-xs ml-1 ${expiryMinutes===2 ? 'bg-blue-600 text-white rounded' : ''}`} onClick={() => setExpiryMinutes(2)}>2m</button>
                <input type="number" min={1} max={60} value={expiryMinutes} onChange={(e) => setExpiryMinutes(Number(e.target.value)||1)} className="w-12 text-xs ml-2 p-1 border rounded" />
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm" onClick={handleGenerate} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Batch QR codes'}</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded text-sm" onClick={scannerActive ? stopScanner : startScanner}>{scannerActive ? 'Stop Scanner' : 'Start Scanner'}</button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded text-sm" onClick={regenerateAll}>Regenerate All</button>
          </div>

          <p className="mt-2 text-xs text-gray-500">QR codes will be emailed to all students in this batch for scanner testing (no expiry enforced).</p>
        </Card>

        <div className="lg:col-span-2">
          <Card className="p-4">
            {showScanner && scannerActive ? (
              <div>
                <h3 className="font-semibold mb-2">QR Code Scanner</h3>
                {cameraError ? (
                  <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3">
                    <p className="font-semibold">Camera Error:</p>
                    <p className="text-sm">{cameraError}</p>
                  </div>
                ) : (
                  <div style={{ position: 'relative', width: '100%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                    <video 
                      ref={videoRef} 
                      style={{ width: '100%', display: 'block', maxHeight: '400px' }}
                      playsInline
                      autoPlay
                      muted
                    ></video>
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                  </div>
                )}
                <div className="mt-3 text-center text-sm text-gray-600">Point camera at QR code...</div>
                {scannedData && <div className="mt-2 text-sm text-green-600 font-semibold">✅ Scanned: {scannedData}</div>}
                <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded text-sm w-full" onClick={stopScanner}>Close Scanner</button>
              </div>
            ) : (
              <>
                <h3 className="font-semibold mb-4">📋 Batch Students</h3>
                {batchStudents.length > 0 ? (
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-semibold text-sm text-gray-700">Total Students: <span className="text-blue-600">{batchStudents.length}</span></div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {batchStudents.map((student, idx) => (
                        <div key={idx} className="p-2 bg-white border border-gray-200 rounded flex justify-between items-center text-sm">
                          <div>
                            <div className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                              {presentStudentIds.has(student.id) && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Present</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">{student.email}</div>
                          </div>
                          <div className="text-xs text-gray-500 font-mono">{student.id}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    No students found in this batch
                  </div>
                )}

                <h3 className="font-semibold mb-2">🎯 Generation Results</h3>
                {results === null && <div className="text-sm text-gray-500">No generation yet</div>}

                {Array.isArray(results) && results.length > 0 && (
                  <>
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="font-semibold text-sm text-blue-900 mb-2">📊 Students Involved in QR Generation</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Students:</span>
                          <span className="font-bold text-lg ml-2">{results.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Successfully Generated:</span>
                          <span className="font-bold text-lg ml-2 text-green-600">{results.filter(r => r.sent).length}</span>
                        </div>
                        {results.filter(r => !r.sent).length > 0 && (
                          <div className="col-span-2">
                            <span className="text-gray-600">Failed:</span>
                            <span className="font-bold text-lg ml-2 text-red-600">{results.filter(r => !r.sent).length}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {results.map((r, idx) => (
                        <div key={idx} className={`p-3 border rounded ${r.sent ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{r.email || 'Unknown Student'}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                ID: <span className="font-mono">{r.studentId}</span>
                              </div>
                              {r.firstName && r.lastName && (
                                <div className="text-xs text-gray-600 mt-1">
                                  Name: <span className="font-medium">{r.firstName} {r.lastName}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className={`text-xs font-semibold px-2 py-1 rounded ${r.sent ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {r.sent ? '✓ Sent' : '✗ Failed'}
                              </div>
                              {!r.sent && (
                                <div className="text-xs text-red-600 mt-1">{r.reason || r.error || 'Unknown error'}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            Expires in: <span className="font-medium">{formatRemaining(r.expiresAt)}</span>
                            {r.expiresAt && (
                              <div className="text-xs text-gray-500">Time left: <span className="font-semibold">{formatRemaining(r.expiresAt)}</span></div>
                            )}
                          </div>
                          {presentStudentIds.has(r.studentId) && (
                            <div className="text-xs text-green-700 font-semibold mb-2">Attendance taken (Present)</div>
                          )}
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs" onClick={() => regenerateForStudent(r.studentId)}>Regenerate</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
