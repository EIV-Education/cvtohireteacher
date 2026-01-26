
import React, { useRef, useState } from 'react';
import { Upload, Type, X, File as FileIcon, Check, Send, AlertTriangle, FileText } from 'lucide-react';
import { InputMode, UploadedFile, ProcessingStatus } from '../types';

interface InputSectionProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  cvText: string;
  setCvText: (text: string) => void;
  cvFile: UploadedFile | null;
  setCvFile: (file: UploadedFile | null) => void;
  onProcess: () => void;
  isProcessing: boolean;
  status: ProcessingStatus;
}

const InputSection: React.FC<InputSectionProps> = ({
  inputMode,
  setInputMode,
  cvText,
  setCvText,
  cvFile,
  setCvFile,
  onProcess,
  isProcessing,
  status,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > 10 * 1024 * 1024) {
      alert("File quá lớn (tối đa 10MB).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCvFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        data: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-50 bg-[#f9fafb] flex justify-between items-center">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#3370ff]" />
          Hồ sơ ứng viên
        </h2>
        {status === ProcessingStatus.ERROR && (
           <div className="flex items-center text-red-500 text-[11px] font-bold bg-red-50 px-3 py-1 rounded-full animate-pulse">
             <AlertTriangle className="w-3 h-3 mr-1" /> Lỗi phân tích
           </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-full">
          <button
            onClick={() => setInputMode(InputMode.FILE)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm rounded-lg transition-all ${
              inputMode === InputMode.FILE 
                ? 'bg-white text-[#3370ff] shadow-sm font-bold' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Tải File CV</span>
          </button>
          <button
            onClick={() => setInputMode(InputMode.TEXT)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm rounded-lg transition-all ${
              inputMode === InputMode.TEXT 
                ? 'bg-white text-[#3370ff] shadow-sm font-bold' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Dán nội dung</span>
          </button>
        </div>

        {inputMode === InputMode.FILE ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
            className={`group border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col justify-center items-center h-64 ${
              isDragging 
                ? 'border-[#3370ff] bg-blue-50 scale-[0.98]' 
                : 'border-gray-200 hover:border-[#3370ff] hover:bg-gray-50'
            }`}
          >
            {cvFile ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-100 p-4 rounded-2xl mb-3 mx-auto w-fit">
                  <FileIcon className="w-10 h-10 text-[#3370ff]" />
                </div>
                <p className="text-sm font-bold text-gray-800 truncate max-w-[200px] mb-1">{cvFile.name}</p>
                <p className="text-xs text-green-600 font-medium flex items-center justify-center">
                  <Check className="w-3 h-3 mr-1" /> Sẵn sàng xử lý
                </p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                  className="mt-4 text-xs text-red-500 hover:underline"
                >
                  Gỡ bỏ file
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gray-100 p-4 rounded-2xl mb-4 group-hover:bg-blue-100 transition-colors">
                  <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-[#3370ff]' : 'text-gray-400 group-hover:text-[#3370ff]'}`} />
                </div>
                <p className="text-sm font-bold text-gray-700">Kéo thả hoặc Click để tải CV</p>
                <p className="text-xs text-gray-400 mt-2">PDF, DOCX, PNG, JPG (Max 10MB)</p>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </div>
        ) : (
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Dán toàn bộ văn bản từ hồ sơ của ứng viên vào đây..."
            className="w-full h-64 p-5 text-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-[#3370ff] outline-none resize-none transition-all shadow-inner bg-gray-50/30"
          />
        )}
      </div>

      <div className="p-6 bg-[#f9fafb] border-t border-gray-100">
        <button
          onClick={onProcess}
          disabled={isProcessing || (!cvFile && !cvText.trim())}
          className={`w-full py-4 rounded-xl flex items-center justify-center space-x-3 text-base font-bold transition-all shadow-lg active:scale-95
            ${(isProcessing || (!cvFile && !cvText.trim()))
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              : status === ProcessingStatus.SUCCESS 
                ? 'bg-green-600 text-white'
                : 'bg-[#3370ff] hover:bg-[#2858cc] text-white'
            }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AI đang đọc & Lưu Lark...</span>
            </>
          ) : status === ProcessingStatus.SUCCESS ? (
             <>
                <Check className="w-6 h-6" />
                <span>Hoàn tất! Tiếp tục CV khác</span>
             </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Chuẩn hóa & Gửi Lark Base</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
