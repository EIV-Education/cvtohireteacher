
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import { InputMode, ProcessingStatus, UploadedFile, LarkConfig } from './types';
import { processCV } from './services/geminiService';
import { Settings as SettingsIcon, Save, X, RefreshCcw, Info, Database, FileCode, Play, CheckCircle2 } from 'lucide-react';

const DEFAULT_WEBHOOK_URL = "https://eiveducation.sg.larksuite.com/base/automation/webhook/event/XczYac0jswZYWehHEcXlXJJQgmc";

const INITIAL_TEMPLATE = `TRÍCH XUẤT THÔNG TIN VÀ TRẢ VỀ DẠNG JSON OBJECT:
{
  "full_name": "Nguyễn Văn A",
  "gender": "Male/Female",
  "nationality": "Việt Nam",
  "address": "Quận 1, TP.HCM",
  "birth_year": "1995",
  "email": "nguyenvana@email.com",
  "phone": "0901234567",
  "university": "Bachelor’s Degree, Associate’s Degree, Master’s Degree, Doctorate (PhD)",
  "certificates": "IELTS 7.5, AWS Certified",
  "experience_summary": "5 năm kinh nghiệm lập trình Fullstack, chuyên về React và Node.js.",
  "class_type": "Kindergarten / Preschool, Primary School, Secondary School...."
}
Lưu ý: Nếu thiếu thông tin ghi "N/A"`;

function App() {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.FILE);
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  
  // Settings States
  const [larkConfig, setLarkConfig] = useState<LarkConfig>(() => {
    const saved = localStorage.getItem('lark_config');
    return saved ? JSON.parse(saved) : { webhookUrl: DEFAULT_WEBHOOK_URL, enabled: true };
  });

  const [extractionTemplate, setExtractionTemplate] = useState<string>(() => {
    const saved = localStorage.getItem('extraction_template');
    return saved || INITIAL_TEMPLATE;
  });

  useEffect(() => {
    localStorage.setItem('lark_config', JSON.stringify(larkConfig));
  }, [larkConfig]);

  useEffect(() => {
    localStorage.setItem('extraction_template', extractionTemplate);
  }, [extractionTemplate]);

  const handleResetTemplate = () => {
    if (confirm("Bạn có chắc chắn muốn khôi phục mẫu trích xuất về mặc định?")) {
      setExtractionTemplate(INITIAL_TEMPLATE);
    }
  };

  const sendToLark = async (data: any, file: UploadedFile | null, isTest: boolean = false) => {
    if (!larkConfig.webhookUrl) return;

    // Chuẩn bị các trường dữ liệu, bao gồm cả thông tin file
    const fieldsWithFile = {
      ...data,
      "file_attachment_name": file ? file.name : (isTest ? "Sample_CV.pdf" : "N/A"),
      "upload_time": new Date().toLocaleString('vi-VN')
    };

    // Lark payload construction
    const payload = {
      msg_type: "text",
      content: {
        text: JSON.stringify({
          source: "HR CV Formatter",
          is_test: isTest,
          extracted_data: fieldsWithFile,
          timestamp: new Date().toLocaleString('vi-VN')
        }, null, 2)
      },
      // Record for Bitable Integration - mapped fields
      record: {
        fields: fieldsWithFile 
      }
    };

    try {
      await fetch(larkConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
      return true;
    } catch (err) {
      console.error("Lark Storage Error:", err);
      return false;
    }
  };

  const handleSendSample = async () => {
    if (!larkConfig.webhookUrl) {
      alert("Vui lòng nhập Webhook URL trước.");
      return;
    }

    setIsTestingWebhook(true);
    setTestSuccess(false);

    try {
      // Extract structure from template to send as sample
      let sampleData = {};
      try {
        const jsonMatch = extractionTemplate.match(/\{[\s\S]*\}/);
        sampleData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      } catch (e) {
        sampleData = { "info": "Mẫu không hợp lệ, đang gửi dữ liệu test mặc định", "full_name": "Nguyễn Văn Test", "gender": "Nam" };
      }

      await sendToLark(sampleData, null, true);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    } catch (error) {
      alert("Lỗi khi gửi mẫu thử.");
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleProcess = async () => {
    if (!larkConfig.webhookUrl) {
      alert("Vui lòng cấu hình Webhook Lark Base trong phần Cài đặt.");
      setIsSettingsOpen(true);
      return;
    }

    setStatus(ProcessingStatus.PROCESSING);
    
    try {
      const result = await processCV(extractionTemplate, cvText, cvFile);
      
      let parsedData;
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch (e) {
        throw new Error("AI không thể tạo đúng cấu hình mẫu công ty. Hãy kiểm tra lại phần 'Yêu cầu mẫu' trong Cài đặt.");
      }

      if (!parsedData) throw new Error("Không thể trích xuất dữ liệu từ CV.");

      await sendToLark(parsedData, cvFile);
      setStatus(ProcessingStatus.SUCCESS);
      
      setTimeout(() => {
          setCvFile(null);
          setCvText('');
          setStatus(ProcessingStatus.IDLE);
      }, 3000);

    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setStatus(ProcessingStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fe] text-gray-900 font-['Inter']">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="flex-1 w-full mx-auto px-4 py-12 flex justify-center items-start">
        <div className="w-full max-w-xl">
            <InputSection 
              inputMode={inputMode}
              setInputMode={setInputMode}
              cvText={cvText}
              setCvText={setCvText}
              cvFile={cvFile}
              setCvFile={setCvFile}
              onProcess={handleProcess}
              isProcessing={status === ProcessingStatus.PROCESSING}
              status={status}
            />
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2 flex items-center gap-2">
                  <Database className="w-3 h-3 text-[#3370ff]" />
                  Lark Sync
                </h3>
                <p className="text-xs font-medium text-gray-600 truncate">
                  {larkConfig.webhookUrl ? "Đã kết nối Webhook" : "Chưa cấu hình"}
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2 flex items-center gap-2">
                  <FileCode className="w-3 h-3 text-[#3370ff]" />
                  Mẫu hiện tại
                </h3>
                <p className="text-xs font-medium text-gray-600">
                  {Object.keys(JSON.parse(extractionTemplate.match(/\{[\s\S]*\}/)?.[0] || '{}')).length} trường thông tin
                </p>
              </div>
            </div>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f9fafb]">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-[#3370ff]" />
                Cấu hình HR Formatter
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Lark Webhook Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg text-[#3370ff]">
                      <Database className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-800">Kết nối Lark Base (Bitable)</h3>
                  </div>
                  
                  {larkConfig.webhookUrl && (
                    <button 
                      onClick={handleSendSample}
                      disabled={isTestingWebhook}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        testSuccess 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-50 text-[#3370ff] hover:bg-blue-100 active:scale-95'
                      }`}
                    >
                      {isTestingWebhook ? (
                        <div className="w-3 h-3 border-2 border-[#3370ff] border-t-transparent rounded-full animate-spin"></div>
                      ) : testSuccess ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                      {testSuccess ? 'ĐÃ GỬI MẪU!' : 'GỬI MẪU THỬ LÊN LARK'}
                    </button>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Webhook URL</label>
                  <input 
                    type="text" 
                    value={larkConfig.webhookUrl}
                    onChange={(e) => setLarkConfig({...larkConfig, webhookUrl: e.target.value})}
                    placeholder="https://open.larksuite.com/..."
                    className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                  <div className="mt-2 flex items-start gap-2 text-[10px] text-gray-400">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Sau khi nhấn "Gửi mẫu thử", hãy quay lại Lark Flow để nhấn "Tạo" từ dữ liệu mẫu nhận được.</span>
                  </div>
                </div>
              </section>

              {/* Extraction Template Section */}
              <section>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg text-[#3370ff]">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-800">Mẫu trích xuất (AI Prompt)</h3>
                  </div>
                  <button 
                    onClick={handleResetTemplate}
                    className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-[#3370ff] transition-colors"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    KHÔI PHỤC MẶC ĐỊNH
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-3 bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <strong>Mẹo:</strong> Đã thêm trường <code>gender</code> và tự động gửi tên file. Bạn có thể đổi tên Key trong JSON để khớp với cột trong Lark.
                  </p>
                  <textarea 
                    value={extractionTemplate}
                    onChange={(e) => setExtractionTemplate(e.target.value)}
                    className="w-full h-64 p-4 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none resize-none shadow-inner"
                  />
                </div>
              </section>
            </div>

            <div className="p-6 bg-[#f9fafb] border-t border-gray-100">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-4 bg-[#3370ff] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#2858cc] transition-all shadow-xl active:scale-95"
              >
                <Save className="w-5 h-5" />
                Lưu toàn bộ thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
