
import React from 'react';
import { Briefcase, Settings, Cloud } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-[#3370ff] p-2 rounded-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">HR CV to Lark</h1>
            <p className="text-xs text-gray-500">Chuẩn hóa & Lưu trữ Lark Base</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center text-xs text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <Cloud className="w-3 h-3 mr-1 text-[#3370ff]" />
            Lark Base Sync Active
          </div>
          <button 
            onClick={onOpenSettings}
            className="p-2 text-gray-400 hover:text-[#3370ff] hover:bg-blue-50 rounded-full transition-all"
            title="Cấu hình Lark Base"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
