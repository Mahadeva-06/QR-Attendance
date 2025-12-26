# 📚 Attendance Pro - Student Attendance Management System

A modern, modular React + TypeScript application for managing student attendance. Built from Figma design using shadcn/ui components.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to project directory
cd AttendancePro

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

---

## 📂 Project Structure

```
src/
├── modules/              # Individual page modules (can be developed separately)
│   ├── AttendanceDashboard.tsx    # MAIN PAGE - Mark daily attendance
│   ├── MonthlyReport.tsx          # Monthly attendance statistics
│   ├── StudentList.tsx            # View all students
│   ├── AddStudent.tsx             # Register new students
│   └── ... other modules
├── components/           # Reusable components
│   └── Sidebar.tsx      # Navigation menu
├── styles/              # Global styles and theme
├── App.tsx              # Main app with routing logic
└── main.tsx             # Entry point
```

---

## 🎯 How to Execute Individual Modules

### **Step 1: Start the Server**
```bash
npm run dev
```

### **Step 2: Navigate Using Sidebar**
- Click menu items in the left sidebar to switch between modules
- Current module displays in the main content are

## 📋 Available Modules

| Module | Path | Purpose |
|--------|------|---------|
| **Attendance Dashboard** | `modules/AttendanceDashboard.tsx` | ⭐ MAIN PAGE - Mark student attendance |
| Monthly Report | `modules/MonthlyReport.tsx` | View monthly statistics |
| Summary Report | `modules/SummaryReport.tsx` | Overall attendance summary |
| Search Student | `modules/SearchStudent.tsx` | Find students |
| Student List | `modules/StudentList.tsx` | View all students |
| Add Student | `modules/AddStudent.tsx` | Register new student |
| Settings | `modules/GeneralSettings.tsx` | Configure system |
| Theme Settings | `modules/ThemeSettings.tsx` | Dark/Light mode |

---

## 🛠️ Building & Deployment

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📚 Technologies Used

- **React 18** - UI Framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library
- **shadcn/ui** - Pre-built accessible components

---

## 🎨 Styling

All components use Tailwind CSS. Theme colors are defined in `tailwind.config.js`:
- **Primary**: Blue-600
- **Secondary**: Purple-600
- **Success**: Green
- **Warning**: Yellow
- **Danger**: Red

---

## 📝 Adding a New Module

1. Create a new file in `src/modules/MyModule.tsx`
2. Export a component:
   ```tsx
   export function MyModule() {
     return (
       <div className="flex-1 flex items-center justify-center bg-gray-50">
         <h2>My Module</h2>
       </div>
     );
   }
   ```
3. Import it in `App.tsx`
4. Add routing logic in the `renderPage()` function
5. Add menu item in `components/Sidebar.tsx`

---

## 🤝 Contributing

To work on different modules without affecting others:
1. Create a branch: `git checkout -b feature/module-name`
2. Develop your module in isolation
3. Test with other modules
4. Submit a pull request

---

## 📞 Support

For issues or questions, refer to:
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev

**Happy Coding! 🚀**
