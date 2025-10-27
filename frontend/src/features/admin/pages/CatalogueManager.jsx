import React, { useEffect, useState } from "react";
import { AdminService } from "@utils";
import { PageContainer, PageHeader, Card, Button, Select } from "../components";
import VehicleForm from "../components/catalog/VehicleForm.jsx";
import VariantForm from "../components/catalog/VariantForm.jsx";
import ColorManager from "../components/catalog/ColorManager.jsx";

const CatalogueManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const load = async () => {
    const res = await AdminService.getAllVehicles({});
    setVehicles(res?.data || []);
    if (!selectedId && res?.data?.length)
      setSelectedId(res.data[0].id || res.data[0].vehicle_id || "");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="🚗 Quản lý danh mục xe / phiên bản / màu sắc"
        subtitle="Admin, EVM Staff"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg rounded-xl">
          <h3 className="text-white font-semibold text-xl mb-4">Tạo xe mới</h3>
          <VehicleForm onSaved={load} />
        </Card>

        <Card className="col-span-2 bg-gradient-to-r from-green-500 via-green-600 to-green-700 shadow-lg rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-xl">
              Phiên bản & Màu sắc
            </h3>
            <Select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              options={vehicles.map((v) => ({
                value: v.id || v.vehicle_id,
                label: `${v.brand || "Tesla"} ${v.model} (${
                  v.variant || v.category || ""
                })`,
              }))}
              placeholder="Chọn xe"
              className="bg-white rounded-md shadow-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 shadow-lg rounded-xl p-4">
              <h4 className="text-white mb-4">➕ Thêm phiên bản</h4>
              <VariantForm vehicleId={selectedId} onAdded={load} />
            </Card>
            <Card className="bg-gray-800 shadow-lg rounded-xl p-4">
              <h4 className="text-white mb-4">🎨 Quản lý màu sắc</h4>
              <ColorManager vehicleId={selectedId} onSaved={load} />
            </Card>
          </div>
        </Card>
      </div>

      <Card className="mt-8 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 shadow-lg rounded-xl">
        <h3 className="text-white font-semibold text-xl mb-4">Danh sách xe</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(vehicles || []).map((v) => (
            <div
              key={v.id || v.vehicle_id}
              className="bg-gray-800 rounded-lg p-4 shadow-xl hover:scale-105 transform transition duration-300 ease-in-out"
            >
              <div className="text-white font-medium text-lg">
                {v.brand || "Tesla"} {v.model}
              </div>
              <div className="text-gray-400 text-sm mb-2">
                {v.variant || v.category}
              </div>
              <div className="text-gray-300 text-sm mb-4">
                Giá:{" "}
                {Number(v.price || v.base_price || 0).toLocaleString("vi-VN")} đ
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setSelectedId(v.id || v.vehicle_id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Chọn
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};

export default CatalogueManager;
