import React, { useEffect, useState } from "react";
import { Car, Upload, Image as ImageIcon } from "lucide-react";
import Modal from "../ui/Modal"; // Import Modal chuẩn
import Button from "../ui/Button"; // Import Button chuẩn
import { FormGroup, Label, Input } from "../ui/FormComponents"; // Import Form Components chuẩn

const VehicleModal = ({ vehicle, onClose, onSave }) => {
  const [form, setForm] = useState({
    vehicleId: null, model: "", brand: "", year: "", basePrice: "",
  });
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
      setPreviewUrl(vehicle.imageUrl || "");
    } else {
      setForm({ vehicleId: null, model: "", brand: "", year: "", basePrice: "" });
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSave({
      ...form,
      year: form.year ? parseInt(form.year, 10) : null,
      basePrice: form.basePrice ? parseFloat(form.basePrice) : null,
      imageFile: selectedFile,
      currentImageUrl: vehicle?.imageUrl 
    });
  };

  return (
    <Modal
        isOpen={true}
        onClose={onClose}
        title={form.vehicleId ? "Chỉnh sửa xe" : "Thêm xe mới"}
        size="lg"
        footer={
            <>
                <Button variant="ghost" onClick={onClose}>Hủy bỏ</Button>
                <Button variant="primary" onClick={handleSubmit}>Lưu thông tin</Button>
            </>
        }
    >
        <div className="space-y-5">
            {/* Image Upload Section - Style đồng bộ */}
            <FormGroup>
                <Label>Hình ảnh xe</Label>
                <div className="flex flex-col items-center justify-center w-full">
                    {previewUrl ? (
                        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-700 group bg-[#0b1622]">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label htmlFor="dropzone-file" className="cursor-pointer px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg font-semibold hover:bg-cyan-500/30 transition flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> Thay đổi ảnh
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer bg-[#1e293b] hover:bg-gray-800 transition hover:border-cyan-500/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="p-3 rounded-full bg-gray-800 mb-3 text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-cyan-400">Click để tải ảnh</span> hoặc kéo thả</p>
                            </div>
                        </label>
                    )}
                    <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
            </FormGroup>

            {/* Input Fields */}
            <FormGroup>
                <Label required>Tên Model</Label>
                <Input name="model" placeholder="VD: VF 9 Plus" value={form.model} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
                <Label required>Hãng xe</Label>
                <Input name="brand" placeholder="VD: VinFast" value={form.brand} onChange={handleChange} />
            </FormGroup>
            <div className="grid grid-cols-2 gap-6">
                <FormGroup>
                    <Label>Năm SX</Label>
                    <Input type="number" name="year" placeholder="2025" value={form.year} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label>Giá cơ bản (VNĐ)</Label>
                    <Input type="number" name="basePrice" placeholder="0" value={form.basePrice} onChange={handleChange} />
                </FormGroup>
            </div>
        </div>
    </Modal>
  );
};

export default VehicleModal;