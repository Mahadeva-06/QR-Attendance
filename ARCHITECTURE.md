# 📊 Attendance Pro - Architecture & Flow

## 🏗️ **Application Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                       BROWSER                                │
│                  http://localhost:5173                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       App.tsx (Router)                       │
│   Switches between modules based on activePage state        │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴────────────────────┐
        ↓                                         ↓
┌──────────────────────┐              ┌──────────────────────┐
│  Sidebar Component   │              │  Active Module Page  │
│  (Navigation Menu)   │              │                      │
│                      │              │  AttendanceDashboard │
│  - ENQUIRY           │              │  StudentList         │
│  - ATTENDANCE        │  triggers    │  AddStudent          │
│  - STUDENTS          │  onNavigate  │  MonthlyReport       │
│  - SETTINGS          │  ────────→   │  ... etc             │
│                      │              │                      │
└──────────────────────┘              └──────────────────────┘
```

---

## 📁 **File Structure with Responsibilities**

```
src/
├── App.tsx ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   Purpose: Main router
│   Handles:
│   • State for sidebar collapse (isSidebarCollapsed)
│   • State for active page (activePage)
│   • Renders Sidebar + current module
│   • renderPage() switch statement routes pages
│
├── main.tsx ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   Purpose: React entry point
│   Renders: <App /> into #root element
│
├── components/
│   └── Sidebar.tsx ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│       Purpose: Navigation menu
│       Features:
│       • Collapsible menu (isSidebarCollapsed prop)
│       • Menu items with expandable submenus
│       • Highlights active page
│       • Shows/hides submenu on click
│
├── modules/ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   Purpose: Individual page components
│   Each module is INDEPENDENT with its own:
│   • State management (useState hooks)
│   • UI components
│   • Business logic
│   • Styling
│
│   ├── AttendanceDashboard.tsx ⭐ MAIN PAGE
│   │   Features:
│   │   ✓ Search students
│   │   ✓ Date picker
│   │   ✓ Live statistics
│   │   ✓ Attendance table
│   │   ✓ Status buttons (Present/Absent/Late)
│   │   ✓ Previous days history
│   │
│   ├── StudentList.tsx
│   │   Status: Template ready
│   │
│   ├── AddStudent.tsx
│   │   Status: Template ready
│   │
│   ├── MonthlyReport.tsx
│   │   Status: Template ready
│   │
│   ├── SummaryReport.tsx
│   │   Status: Template ready
│   │
│   ├── SearchStudent.tsx
│   │   Status: Template ready
│   │
│   ├── SearchBatch.tsx
│   │   Status: Template ready
│   │
│   ├── GeneralSettings.tsx
│   │   Status: Template ready
│   │
│   └── ThemeSettings.tsx
│       Status: Template ready
│
├── styles/
│   └── globals.css ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│       Purpose: Global Tailwind CSS setup
│       Contains:
│       • @tailwind directives
│       • Base layer styles
│       • Utility classes
│       • Custom shadows
│
├── index.html ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   Purpose: HTML entry point
│   Contains:
│   • <div id="root"> where React renders
│
├── package.json ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   Dependencies installed:
│   • react 18.3.1
│   • react-dom 18.3.1
│   • typescript 5.2.2
│   • tailwindcss 3.4.1
│   • vite 5.0.8
│   • lucide-react 0.408.0
│
├── vite.config.ts ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   Purpose: Build configuration
│   Settings:
│   • React plugin enabled
│   • Dev server port: 5173
│
├── tailwind.config.js ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   Purpose: Tailwind CSS configuration
│   Defines:
│   • Color palette
│   • Theme extensions
│
├── tsconfig.json ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   Purpose: TypeScript configuration
│   Settings:
│   • Strict mode enabled
│   • ESM module support
│   • JSX as React
│
├── postcss.config.js ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   Purpose: PostCSS configuration
│   Processes:
│   • Tailwind CSS
│   • Autoprefixer
│
└── node_modules/ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Purpose: Installed dependencies (361 packages)
```

---

## 🔄 **Data Flow & State Management**

```
User Interaction (Sidebar Click)
  ↓
Sidebar.onNavigate(page) triggers
  ↓
App.setActivePage(page) updates state
  ↓
App.renderPage() reads activePage
  ↓
Correct module component renders
  ↓
Module manages its own state (useState)
  ↓
User sees page with interactive features
  ↓
Module state updates on user action
  ↓
Browser updates automatically (Hot Reload)
```

---

## 🎯 **Module Development Pattern**

All modules follow this structure:

```tsx
import { useState } from 'react';
import { SomeIcon } from 'lucide-react';

// 1. Define data types
interface Student {
  id: number;
  name: string;
  // ... more fields
}

// 2. Export main component
export function ModuleName() {
  // 3. Local state management
  const [students, setStudents] = useState<Student[]>([...]);
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Helper functions
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 5. Render UI
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-card p-6">
        <h2 className="text-2xl font-bold">Module Title</h2>
        {/* ... inputs, filters, etc */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Tables, lists, cards, etc */}
      </div>
    </div>
  );
}
```

---

## 🚀 **How Pages Load**

```
1. npm run dev starts Vite server
                ↓
2. Browser opens http://localhost:5173
                ↓
3. Vite serves index.html
                ↓
4. React mounts App.tsx into #root
                ↓
5. App renders Sidebar + AttendanceDashboard (default)
                ↓
6. User clicks sidebar item
                ↓
7. Sidebar calls onNavigate('page-name')
                ↓
8. App.setActivePage() updates state
                ↓
9. App re-renders with new module
                ↓
10. Hot Reload updates browser instantly
```

---

## 📊 **Component Hierarchy**

```
App (Main)
├── Sidebar
│   ├── MenuItems
│   │   ├── Enquiry submenu
│   │   ├── Attendance submenu
│   │   ├── Students submenu
│   │   └── Settings submenu
│   └── Footer
│
└── Current Module (switches based on state)
    ├── AttendanceDashboard
    ├── StudentList
    ├── AddStudent
    ├── MonthlyReport
    ├── SearchStudent
    ├── SearchBatch
    ├── GeneralSettings
    └── ThemeSettings
```

---

## 🎨 **Styling Architecture**

```
Global Styles (globals.css)
├── Tailwind CSS directives
│   ├── @tailwind base;
│   ├── @tailwind components;
│   └── @tailwind utilities;
│
├── Base layer
│   ├── Default element styles
│   ├── Typography rules
│   └── Border/outline defaults
│
└── Utility layer
    ├── Custom shadows (shadow-soft, shadow-card, shadow-elevated)
    ├── Color classes (via tailwind.config.js)
    └── Responsive breakpoints (md:, lg:, etc)

Component Styles (via classNames in JSX)
├── Utility classes (flex, p-4, bg-blue-500, etc)
├── Responsive classes (md:grid-cols-2, etc)
└── Tailwind directives (@apply in globals.css)
```

---

## 🔌 **Adding a New Module**

```
1. Create file: src/modules/NewModule.tsx
2. Write component (follow pattern above)
3. Import in App.tsx
4. Add case to renderPage() switch
5. Add menu item to Sidebar.tsx
6. Save → See it in sidebar!
```

---

## 🧮 **Technology Stack Roles**

```
┌────────────────────────────────────────────────────┐
│  Vite          →  Build tool, Dev server           │
│  React 18      →  UI rendering & state management  │
│  TypeScript    →  Type safety & IDE help           │
│  Tailwind CSS  →  Styling with utility classes     │
│  Lucide Icons  →  200+ beautiful icons             │
└────────────────────────────────────────────────────┘
```

---

**This architecture makes it easy to:**
✅ Work on modules independently  
✅ Add new pages quickly  
✅ Share components  
✅ Scale to large applications  
✅ Test modules in isolation
