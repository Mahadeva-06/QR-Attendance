import { useState } from 'react';
import { 
  Menu, 
  Search,
  Calendar,
  BookOpen, 
  Users, 
  UserCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers,
  Lock,
  Barcode,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse, activePage, onNavigate }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string>('attendance');

  const menuItems = [
    {
      id: 'enquiry',
      label: 'ENQUIRY',
      icon: Search,
      subItems: [
        { label: 'Search Student', page: 'search-student' },
        { label: 'Search Batch', page: 'search-batch' }
      ]
    },
    {
      id: 'attendance',
      label: 'ATTENDANCE',
      icon: Calendar,
      subItems: [] // No submenu - will handle all in main Attendance page
    },
    {
      id: 'students',
      label: 'STUDENTS',
      icon: Users,
      subItems: [
        { label: 'Student List', page: 'student-list' },
        { label: 'Add Student', page: 'add-student' }
      ]
    },
    {
      id: 'batch',
      label: 'BATCH',
      icon: Layers,
      subItems: [
        { label: 'Batch List', page: 'batch-page' },
        { label: 'Create Batch', page: 'create-batch' },
        { label: 'Batch Attendance Summary', page: 'batch-attendance-summary' }
      ]
    },
    {
      id: 'barcode',
      label: 'BARCODE',
      icon: Barcode,
      subItems: [
        { label: 'Generate Barcode (Full)', page: 'barcode-generator' },
        { label: 'Barcode Generator', page: 'barcode-generator-simple' },
        { label: 'Batch QR Generator', page: 'batch-qr-generator' },
        { label: 'QR Code Generator', page: 'qrcode-generator-simple' },
        { label: 'Scan Attendance', page: 'barcode-scanner' }
      ]
    },
    {
      id: 'users',
      label: 'USERS',
      icon: UserCircle,
      subItems: [
        { label: 'User List', page: 'user-list' },
        { label: 'Add User', page: 'add-user' },
        { label: 'Roles & Permissions', page: 'roles-permissions' }
      ]
    },
    {
      id: 'settings',
      label: 'SETTINGS',
      icon: Settings,
      subItems: [
        { label: 'General Settings', page: 'general-settings' },
        { label: 'Attendance Rules', page: 'attendance-rules' },
        { label: 'Backup & Restore', page: 'backup-restore' },
        { label: 'Theme Settings', page: 'theme-settings' }
      ]
    }
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? '' : menuId);
  };

  const isMenuActive = (menuId: string) => {
    const menu = menuItems.find(m => m.id === menuId);
    if (menu?.subItems) {
      return menu.subItems.some(sub => sub.page === activePage);
    }
    return false;
  };

  return (
    <div className="w-[240px] bg-gray-900 text-white flex flex-col shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 flex items-center justify-between">
        <button onClick={onToggleCollapse} className="text-white">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <span className="text-red-500">✓</span>
          </div>
          <span className="tracking-[0.1em] font-bold text-sm">Attendance Pro</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedMenu === item.id;
          const hasSubItems = item.subItems.length > 0;
          const isActive = isMenuActive(item.id);

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleMenu(item.id);
                  } else {
                    // For items without subItems, navigate directly
                    const defaultPages: Record<string, string> = {
                      'attendance': 'daily-attendance',
                      'enquiry': 'search-student',
                    };
                    const page = defaultPages[item.id] || item.id;
                    onNavigate(page);
                  }
                }}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors group relative"
              >
                {isActive && (
                  <div className="w-1 h-6 bg-red-500 rounded-r absolute left-0"></div>
                )}
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                <span className="flex-1 text-left text-sm text-gray-300 group-hover:text-white">
                  {item.label}
                </span>
                {hasSubItems && (
                  isExpanded ? 
                    <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Sub Items */}
              {hasSubItems && isExpanded && (
                <div className="bg-gray-800 py-2">
                  {item.subItems.map((subItem, index) => (
                    <button
                      key={index}
                      onClick={() => onNavigate(subItem.page)}
                      className={`w-full px-12 py-2 text-left text-sm transition-colors ${
                        activePage === subItem.page
                          ? 'text-white bg-gray-700' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
