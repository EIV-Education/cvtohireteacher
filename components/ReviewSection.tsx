
import React from 'react';
import { 
  Save, X, User, MapPin, Mail, Phone, GraduationCap, 
  Award, Briefcase, Users, Trash2, CheckCircle2, 
  Info, Calendar, Share2, Building2, Check
} from 'lucide-react';

interface ReviewSectionProps {
  data: any;
  setData: (data: any) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSending: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ data, setData, onConfirm, onCancel, isSending }) => {
  const handleChange = (key: string, value: string) => {
    setData({ ...data, [key]: value });
  };

  const sections = [
    {
      title: "Thông tin cá nhân & Quản lý",
      icon: <User className="w-4 h-4 text-[#f58220]" />,
      fields: ['full_name', 'gender', 'birth_year', 'nationality', 'email', 'phone', 'address', 'branch', 'cv_source']
    },
    {
      title: "Chuyên môn & Bằng cấp",
      icon: <GraduationCap className="w-4 h-4 text-[#f58220]" />,
      fields: ['university', 'certificates', 'class_type']
    }
  ];

  const fieldLabels: Record<string, string> = {
    full_name: "Họ và tên",
    gender: "Giới tính",
    nationality: "Quốc tịch",
    address: "Địa chỉ hiện tại",
    birth_year: "Năm sinh",
    email: "Địa chỉ Email",
    phone: "Số điện thoại",
    university: "Trường Đại học/Học vấn",
    certificates: "Bằng cấp & Chứng chỉ",
    experience_summary: "Tóm tắt kinh nghiệm chuyên môn",
    class_type: "Môi trường dạy (Class Type)",
    branch: "Chi nhánh tiếp nhận (Chọn nhiều)",
    cv_source: "Nguồn hồ sơ (Source - Chọn nhiều)"
    candidate_type: "Loại Ứng Viên (Candidate Type)"
  };

  const BRANCH_OPTIONS = ["HO CHI MINH", "HA NOI", "DA NANG"];
  const SOURCE_OPTIONS = ["Facebook", "LinkedIn", "Website", "Vietnamteachingjobs", "Outsource", "Refferal from a friend", "Group Zalo", "Other"];
  const CANDIDATE_TYPE_OPTIONS = [
    "School during daytime (full-time)",
    "Private classes/Centers during evenings and weekends (part-time)"
  ];

  const toggleOption = (key: string, option: string) => {
    const currentValue = data[key] || '';
    const selectedOptions = currentValue.split(',').map((s: string) => s.trim()).filter((s: string) => s && s !== 'N/A');
    
    let newValue;
    if (selectedOptions.includes(option)) {
      newValue = selectedOptions.filter((s: string) => s !== option).join(', ');
    } else {
      newValue = [...selectedOptions, option].join(', ');
    }
    
    handleChange(key, newValue || 'N/A');
  };

  const renderField = (key: string) => {
    const value = data[key] || '';
    
    if (key === 'gender') {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f58220]/20 focus:border-[#f58220] outline-none transition-all bg-gray-50/50 cursor-pointer"
        >
          <option value="N/A">Chọn giới tính</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      );
    }

    if (key === 'class_type') {
      const options = ["Kindergarten / Preschool", "Primary School", "Secondary School", "High School", "Language Center", "Online"];
      return (
        <select
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f58220]/20 focus:border-[#f58220] outline-none transition-all bg-gray-50/50 cursor-pointer"
        >
          <option value="N/A">Chọn phân loại</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (key === 'branch' || key === 'cv_source') {
      const options = key === 'branch' ? BRANCH_OPTIONS : SOURCE_OPTIONS;
      const selected = value.split(',').map((s: string) => s.trim());
      
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => toggleOption(key, opt)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border flex items-center gap-1 ${
                  selected.includes(opt)
                    ? 'bg-[#f58220] text-white border-[#f58220] shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#f58220] hover:text-[#f58220]'
                }`}
              >
                {selected.includes(opt) && <Check className="w-3 h-3" />}
                {opt}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Hoặc nhập khác..."
            value={value === 'N/A' ? '' : value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full p-2 text-[11px] border border-gray-100 rounded-lg focus:outline-none focus:border-[#f58220] bg-gray-50/30"
          />
        </div>
      );
    }

    if (key === 'experience_summary' || key === 'certificates') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          rows={key === 'experience_summary' ? 10 : 3}
          className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f58220]/20 focus:border-[#f58220] outline-none transition-all bg-gray-50/50 resize-y"
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f58220]/20 focus:border-[#f58220] outline-none transition-all bg-gray-50/50"
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[85vh]">
      <div className="p-6 border-b border-gray-100 bg-[#fdf2e9]/50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-2 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-tight">Phân tích CV Thành công</h2>
            <p className="text-sm text-gray-500 font-medium">Vui lòng kiểm tra và sửa thông tin trước khi lưu</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>
      
<div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                  {section.icon}
                  <h3 className="font-bold text-sm text-gray-800 uppercase tracking-tight">{section.title}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.fields.map((key) => (
                    <div key={key} className={['address', 'certificates', 'branch', 'cv_source', 'candidate_type'].includes(key) ? 'sm:col-span-2' : ''}>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 ml-1">{fieldLabels[key]}</label>
                      {renderField(key)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>


          <div className="flex flex-col">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                  <Briefcase className="w-4 h-4 text-[#f58220]" />
                  <h3 className="font-bold text-sm text-gray-800 uppercase tracking-tight">Kinh nghiệm & Tóm tắt</h3>
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 ml-1">{fieldLabels['experience_summary']}</label>
                  {renderField('experience_summary')}
                </div>
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex gap-3 mt-4">
                  <Info className="w-5 h-5 text-[#f58220] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-orange-800 leading-relaxed">
                    Trường <strong>Loại Ứng Viên</strong> mới được bổ sung để giúp bộ phận HR phân loại giáo viên theo khung thời gian làm việc (Full-time/Part-time).
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
          <Calendar className="w-4 h-4" />
          Ngày tạo: {new Date().toLocaleDateString('vi-VN')}
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-8 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isSending}
            className="px-10 py-3.5 bg-[#f58220] hover:bg-[#e67300] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#f58220]/20 active:scale-95 min-w-[240px]"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSending ? 'Đang lưu...' : 'Xác nhận & Lưu Lark'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
