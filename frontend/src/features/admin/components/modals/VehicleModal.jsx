// File: src/features/admin/components/modals/VehicleModal.jsx
import React, { useEffect, useState } from "react";
import { Save, X, Car, Upload, Image as ImageIcon } from "lucide-react";

const VehicleModal = ({ vehicle, onClose, onSave }) => {
  // State form dữ liệu text
  const [form, setForm] = useState({
    vehicleId: null,
    model: "",
    brand: "",
    year: "",
    basePrice: "",
  });

  // State quản lý file ảnh và ảnh xem trước
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (vehicle) {
      setForm({
        vehicleId: vehicle.vehicleId,
        model: vehicle.model || "",
        brand: vehicle.brand || "",
        year: vehicle.year || "",
        basePrice: vehicle.basePrice || "",
      });
      // Nếu đang sửa và đã có ảnh cũ (URL từ server), hiển thị nó
      setPreviewUrl(vehicle.imageUrl || "");
    } else {
      setForm({ vehicleId: null, model: "", brand: "", year: "", basePrice: "" });
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Hàm xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Tạo URL tạm thời để xem trước ảnh
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi cả thông tin text và file (nếu có) ra ngoài
    const dataToSave = {
      ...form,
      year: form.year ? parseInt(form.year, 10) : null,
      basePrice: form.basePrice ? parseFloat(form.basePrice) : null,
      imageFile: selectedFile, // File mới upload
      currentImageUrl: vehicle?.imageUrl // URL ảnh cũ (để backend biết nếu không đổi ảnh)
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0b1622] p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/20">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold text-slate-100">
              {form.vehicleId ? "Chỉnh sửa xe" : "Thêm xe mới"}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition">
            <X className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* --- KHU VỰC UPLOAD ẢNH --- */}
            <div>
              <label className="block text-base font-medium text-slate-400 mb-2">Hình ảnh xe</label>
              <div className="flex flex-col items-center justify-center w-full">
                {previewUrl ? (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-700 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain bg-[#0f1b2e]" />
                    {/* Overlay để thay đổi ảnh */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <label htmlFor="dropzone-file" className="cursor-pointer px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-xl font-semibold hover:bg-cyan-500/30 transition flex items-center gap-2">
                          <Upload className="w-5 h-5" /> Thay đổi ảnh
                       </label>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-700 border-dashed rounded-2xl cursor-pointer bg-[#0f1b2e] hover:bg-slate-800 transition hover:border-cyan-500/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 rounded-full bg-slate-800 mb-3 text-slate-400">
                         <ImageIcon className="w-8 h-8" />
                      </div>
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold text-cyan-400">Click để tải ảnh</span> hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-slate-500">SVG, PNG, JPG hoặc WEBP</p>
                    </div>
                  </label>
                )}
                <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
            {/* --- HẾT KHU VỰC UPLOAD --- */}

            <div>
               <label className="block text-base font-medium text-slate-400 mb-2">Tên Model</label>
               <input name="model" placeholder="VD: VF 9 Plus" className="w-full px-5 py-3.5 rounded-2xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition" value={form.model} onChange={handleChange} required />
            </div>
            <div>
               <label className="block text-base font-medium text-slate-400 mb-2">Hãng xe</label>
               <input name="brand" placeholder="VD: VinFast" className="w-full px-5 py-3.5 rounded-2xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition" value={form.brand} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-base font-medium text-slate-400 mb-2">Năm SX</label>
                   <input type="number" name="year" placeholder="2025" className="w-full px-5 py-3.5 rounded-2xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition" value={form.year} onChange={handleChange} />
                </div>
                <div>
                   <label className="block text-base font-medium text-slate-400 mb-2">Giá cơ bản</label>
                   <input type="number" name="basePrice" placeholder="VNĐ" className="w-full px-5 py-3.5 rounded-2xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition" value={form.basePrice} onChange={handleChange} />
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-slate-700/50">
            <button type="button" onClick={onClose} className="px-7 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition text-lg font-semibold">
              Hủy
            </button>
            <button type="submit" className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 transition text-lg">
              <Save className="w-6 h-6" /> Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;