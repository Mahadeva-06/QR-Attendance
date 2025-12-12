import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AttendanceHub } from './modules/AttendanceHub';
import { AttendanceDashboard } from './modules/AttendanceDashboard';
import { SearchStudent } from './modules/SearchStudent';
import { SearchBatch } from './modules/SearchBatch';
import { MonthlyReport } from './modules/MonthlyReport';
import { SummaryReport } from './modules/SummaryReport';
import { StudentList } from './modules/StudentList';
import { AddStudent } from './modules/AddStudent';
import { EditStudent } from './modules/EditStudent';
import { GeneralSettings } from './modules/GeneralSettings';
import { ThemeSettings } from './modules/ThemeSettings';
import { StudentProfile } from './modules/StudentProfile';
import { UserList } from './modules/UserList';
import { AddUser } from './modules/AddUser';
import { RolesPermissions } from './modules/RolesPermissions';
import { BatchPage } from './modules/BatchPage';
import { CreateBatch } from './modules/CreateBatch';
import { EditBatch } from './modules/EditBatch';
import { BatchAttendanceSummary } from './modules/BatchAttendanceSummary';
import { AttendanceRules } from './modules/AttendanceRules';
import { BackupRestore } from './modules/BackupRestore';
import { AllSemestersReport } from './modules/AllSemestersReport';
import { MonthlyAttendanceReport } from './modules/MonthlyAttendanceReport';
import { MonthlyAttendanceTable } from './modules/MonthlyAttendanceTable';
import SecureBarcodeGenerator from './modules/SecureBarcodeGenerator';
import SimpleBarcodeGenerator from './modules/SimpleBarcodeGenerator';
import SimpleQRCodeGenerator from './modules/SimpleQRCodeGenerator';
import BarcodeScanner from './modules/BarcodeScanner';
import BatchQRGenerator from './modules/BatchQRGenerator';
import { onNavigate } from './utils/navigator';

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('daily-attendance');
  const [selectedStudent, setSelectedStudent] = useState<any | undefined>(undefined);
  const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>(undefined);
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
  const [navPayload, setNavPayload] = useState<any | undefined>(undefined);

  const renderPage = () => {
    switch (activePage) {
      // Enquiry
      case 'search-student':
        return <SearchStudent />;
      case 'search-batch':
        return <SearchBatch />;
      
      // Attendance (UNIFIED HUB - handles all attendance views)
      case 'daily-attendance':
      case 'monthly-report':
      case 'summary-report':
      case 'all-semesters-report':
      case 'monthly-attendance-report':
      case 'monthly-attendance-table':
        return <AttendanceHub />;
      
      // Students
      case 'student-list':
        return <StudentList selectModePayload={navPayload} />;
      case 'add-student':
        return <AddStudent />;
      case 'edit-student':
        return <EditStudent studentId={selectedStudentId} />;
      case 'student-profile':
        return <StudentProfile student={selectedStudent} />;
      
      // Users
      case 'user-list':
        return <UserList />;
      case 'add-user':
        return <AddUser />;
      case 'roles-permissions':
        return <RolesPermissions />;
      
      // Batches
      case 'batch-page':
        return <BatchPage />;
      case 'create-batch':
        return <CreateBatch />;
      case 'edit-batch':
        return selectedBatchId ? <EditBatch batchId={selectedBatchId} /> : <BatchPage />;
      case 'batch-attendance-summary':
        return <BatchAttendanceSummary />;
      
      // Barcode
      case 'barcode-generator':
        return <SecureBarcodeGenerator />;
      case 'barcode-generator-simple':
        return <SimpleBarcodeGenerator />;
      case 'batch-qr-generator':
        return <BatchQRGenerator />;
      case 'qrcode-generator-simple':
        return <SimpleQRCodeGenerator />;
      case 'barcode-scanner':
        return <BarcodeScanner />;
      
      // Admin
      case 'attendance-rules':
        return <AttendanceRules />;
      case 'backup-restore':
        return <BackupRestore />;
      
      // Settings
      case 'general-settings':
        return <GeneralSettings />;
      case 'theme-settings':
        return <ThemeSettings />;
      
      default:
        return <AttendanceDashboard />;
    }
  };

  // Subscribe to navigation events from modules
  useEffect(() => {
    const off = onNavigate((page, payload) => {
      if (page === 'student-profile') {
        setSelectedStudent(payload);
        setActivePage(page);
      } else if (page === 'edit-student') {
        setSelectedStudentId(payload);
        setActivePage(page);
      } else if (page === 'edit-batch') {
        setSelectedBatchId(payload);
        setActivePage(page);
      } else {
        setNavPayload(payload);
        setActivePage(page);
      }
    });
    return off;
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {renderPage()}
      </div>
    </div>
  );
}
