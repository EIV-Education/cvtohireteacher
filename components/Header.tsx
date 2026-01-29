import React from 'react';
import { Settings, Cloud, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-1">
            <img 
              src="/assets/logo-eiv.png" 
              alt="EIV Education Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://eiv.edu.vn/wp-content/uploads/2020/03/logo-eiv-color.png';
              }}
            />
          </div>
          <div className="border-l border-gray-200 pl-3 h-8 flex flex-col justify-center">
            <h1 className="text-lg font-bold text-gray-900 leading-none">HireTeacher EIV</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">Native Teacher Recruitment</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a 
            href="https://eiveducation.sg.larksuite.com/base/CPTAb8I0NavH4nsoRLFlWEx6g3g?table=tblsTSCYwiXVi3Nn&view=vewk1bTlvu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-xs font-bold text-[#3370ff] hover:text-white hover:bg-[#3370ff] px-4 py-2 rounded-full border border-[#3370ff] transition-all shadow-sm"
          >
            <ExternalLink className="w-3 h-3 mr-1.5" />
            HireTeacher
          </a>
          
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
