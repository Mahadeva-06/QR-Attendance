import { useState } from 'react';
import { ChevronDown, Download, Upload, Database, AlertTriangle } from 'lucide-react';

interface BackupRecord {
  date: string;
  size: string;
  status: 'Success' | 'Failed' | 'Pending';
}

export function BackupRestore() {
  const [backupHistory] = useState<BackupRecord[]>([
    { date: '2018-12-06 12:00', size: '24.5 MB', status: 'Success' },
    { date: '2018-12-05 12:00', size: '24.3 MB', status: 'Success' },
    { date: '2018-12-04 12:00', size: '24.1 MB', status: 'Success' },
    { date: '2018-12-03 12:00', size: '23.9 MB', status: 'Success' },
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    // Simulate backup creation
    setTimeout(() => {
      setIsCreatingBackup(false);
      alert('Backup created successfully!');
    }, 2000);
  };

  const handleRestoreBackup = () => {
    // This would trigger a file upload dialog in a real app
    setIsRestoringBackup(true);
    setTimeout(() => {
      setIsRestoringBackup(false);
      alert('Restore functionality would trigger file upload dialog');
    }, 1000);
  };

  const handleDownloadBackup = (index: number) => {
    alert(`Downloading backup from ${backupHistory[index].date}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <h2 className="text-gray-800">Backup & Restore</h2>
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Warning Alert */}
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-yellow-800 mb-1 font-semibold">Important</div>
                <div className="text-xs text-yellow-700">
                  Always keep regular backups of your data. Restoring from a backup will overwrite all current data.
                </div>
              </div>
            </div>

            {/* Backup & Restore Cards */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Create Backup Card */}
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-300 hover:bg-green-50 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-800 mb-2 font-semibold">Download Backup</h3>
                <p className="text-sm text-gray-600 mb-4">Create and download a full database backup</p>
                <button
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingBackup ? 'Creating...' : 'Create Backup'}
                </button>
              </div>

              {/* Restore Backup Card */}
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-800 mb-2 font-semibold">Restore Backup</h3>
                <p className="text-sm text-gray-600 mb-4">Upload and restore from a backup file</p>
                <button
                  onClick={handleRestoreBackup}
                  disabled={isRestoringBackup}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRestoringBackup ? 'Processing...' : 'Upload Backup'}
                </button>
              </div>
            </div>

            {/* Backup History */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-gray-600" />
                <h3 className="text-gray-800 font-semibold">Backup History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Date & Time</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Size</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase">Status</th>
                      <th className="text-center py-3 px-4 text-xs text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupHistory.map((backup, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-800">{backup.date}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{backup.size}</td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            {backup.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleDownloadBackup(index)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
