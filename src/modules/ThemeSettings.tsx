import { useState } from 'react';
import { ChevronDown, Save, Palette } from 'lucide-react';

export function ThemeSettings() {
  const [theme, setTheme] = useState({
    mode: 'light',
    sidebarColor: 'dark',
    accentColor: 'pink',
  });

  const accentColors = [
    { name: 'Pink & Red', value: 'pink', gradient: 'from-pink-500 to-red-500' },
    { name: 'Blue & Cyan', value: 'blue', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Purple & Violet', value: 'purple', gradient: 'from-purple-500 to-violet-500' },
    { name: 'Green & Emerald', value: 'green', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Orange & Amber', value: 'orange', gradient: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between">
        <h2 className="text-gray-800">Theme Settings</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">12:31pm, 2018-12-06</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full overflow-hidden flex items-center justify-center">
              <span className="text-white text-xs font-bold">SA</span>
            </div>
            <span className="text-sm">Hi Sadiq</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-[1000px] mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-pink-500" />
              <h1 className="text-gray-800">Customize Appearance</h1>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-gray-800 mb-4">Display Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme({ ...theme, mode: 'light' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    theme.mode === 'light' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-24 bg-white border border-gray-200 rounded mb-3"></div>
                  <div className="text-sm text-gray-800">Light Mode</div>
                </button>
                <button
                  onClick={() => setTheme({ ...theme, mode: 'dark' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    theme.mode === 'dark' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-24 bg-gray-900 border border-gray-700 rounded mb-3"></div>
                  <div className="text-sm text-gray-800">Dark Mode</div>
                </button>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-gray-800 mb-4">Sidebar Color</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme({ ...theme, sidebarColor: 'dark' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    theme.sidebarColor === 'dark' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-16 bg-gray-900 rounded mb-2"></div>
                  <div className="text-sm text-gray-800">Dark</div>
                </button>
                <button
                  onClick={() => setTheme({ ...theme, sidebarColor: 'light' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    theme.sidebarColor === 'light' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-16 bg-white border border-gray-200 rounded mb-2"></div>
                  <div className="text-sm text-gray-800">Light</div>
                </button>
                <button
                  onClick={() => setTheme({ ...theme, sidebarColor: 'gradient' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    theme.sidebarColor === 'gradient' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded mb-2"></div>
                  <div className="text-sm text-gray-800">Gradient</div>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-800 mb-4">Accent Color</h3>
              <div className="grid grid-cols-2 gap-4">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setTheme({ ...theme, accentColor: color.value })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      theme.accentColor === color.value ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-12 bg-gradient-to-r ${color.gradient} rounded mb-3`}></div>
                    <div className="text-sm text-gray-800">{color.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors shadow-lg">
                <Save className="w-4 h-4" />
                APPLY THEME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
