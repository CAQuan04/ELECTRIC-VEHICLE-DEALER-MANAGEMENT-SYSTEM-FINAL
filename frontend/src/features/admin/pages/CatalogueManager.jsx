import React, { useEffect, useMemo, useState } from "react";
import { AuthService } from "@utils";
import { PageContainer, PageHeader, Card } from "../components";
import VehicleForm from "../components/catalog/VehicleForm";
import VariantForm from "../components/catalog/VariantForm";
import ColorManager from "../components/catalog/ColorManager";
import { initialColors, initialVehicles } from "../components/catalog/mockData";

const CatalogueManager = () => {
  const user = AuthService.getCurrentUser?.() || { name: "System", role: "Admin" };
  const role = user?.role || "Admin";
  const isAdmin = role === "Admin";
  const isStaff = role === "Staff";

  const [colors, setColors] = useState(initialColors);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicles[0]?.vehicle_id || "");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const uid = (prefix = "") => prefix + Math.random().toString(36).slice(2, 9).toUpperCase();
  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  const findColor = (id) => colors.find((c) => c.color_id === id) || null;

  /* ===== VEHICLE CRUD ===== */
  const createVehicle = (data) => {
    const newVehicle = { ...data, vehicle_id: data.vehicle_id || uid("V"), variants: [] };
    setVehicles((prev) => [newVehicle, ...prev]);
    setSelectedVehicleId(newVehicle.vehicle_id);
  };

  const updateVehicle = (vid, data) => {
    setVehicles((prev) => prev.map((v) => (v.vehicle_id === vid ? { ...v, ...data } : v)));
  };

  const deleteVehicle = (vid) => {
    if (!isAdmin) return alert("Chỉ Admin mới được xoá xe.");
    if (!confirm("Xoá xe sẽ xoá cả phiên bản liên quan. Tiếp tục?")) return;
    setVehicles((prev) => prev.filter((v) => v.vehicle_id !== vid));
    setSelectedVehicleId("");
  };

  /* ===== VARIANT CRUD ===== */
  const addVariant = (vehicleId, variant) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.vehicle_id !== vehicleId
          ? v
          : {
              ...v,
              variants: [
                ...(v.variants || []).filter((x) => x.variant_id !== variant.variant_id),
                { ...variant, variant_id: variant.variant_id || uid("VT") },
              ],
            }
      )
    );
  };

  const removeVariant = (vehicleId, variantId) => {
    if (!confirm("Xoá phiên bản này?")) return;
    setVehicles((prev) =>
      prev.map((v) =>
        v.vehicle_id !== vehicleId
          ? v
          : { ...v, variants: (v.variants || []).filter((x) => x.variant_id !== variantId) }
      )
    );
    setSelectedVariant(null);
  };

  /* ===== COLOR CRUD ===== */
  const saveColor = (color, mode = "create") => {
    setColors((prev) =>
      mode === "update"
        ? prev.map((c) => (c.color_id === color.color_id ? color : c))
        : [color, ...prev]
    );
  };

  const deleteColor = (color) => {
    if (!confirm(`Xoá màu ${color.name}?`)) return;
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        variants: (v.variants || []).map((va) => ({
          ...va,
          color_options: (va.color_options || []).filter((cid) => cid !== color.color_id),
        })),
      }))
    );
    setColors((prev) => prev.filter((c) => c.color_id !== color.color_id));
  };

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.vehicle_id === selectedVehicleId) || null,
    [vehicles, selectedVehicleId]
  );

  const onVehicleSaved = (v) => {
    if (v.vehicle_id && vehicles.some((x) => x.vehicle_id === v.vehicle_id)) {
      updateVehicle(v.vehicle_id, v);
      setEditingVehicle(null);
    } else createVehicle(v);
  };

  const onVariantSaved = (variant) => {
    if (!selectedVehicleId) return alert("Chọn xe trước");
    addVariant(selectedVehicleId, variant);
    setSelectedVariant(null);
  };

  const onColorSaved = (color, mode) => saveColor(color, mode);

  return (
    <PageContainer className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen text-slate-100">
      <PageHeader
        title="🚗 Quản lý Danh Mục Xe"
        subtitle={`Quyền hiện tại: ${role}`}
        className="text-white"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT - Vehicle Form */}
        <Card className="col-span-1 bg-[#1e293b]/90 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-xl mb-4">
            {editingVehicle ? "Chỉnh sửa xe" : "Tạo xe mới"}
          </h3>
          <VehicleForm
            initial={editingVehicle}
            canDelete={!!editingVehicle && isAdmin}
            onSaved={onVehicleSaved}
            onDelete={(v) => deleteVehicle(v.vehicle_id)}
          />
        </Card>

        {/* RIGHT - Variants + Colors */}
        <Card className="col-span-1 lg:col-span-2 bg-[#1e293b]/90 border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between mb-4 items-center">
            <h3 className="text-white font-semibold text-xl">Phiên bản & Màu sắc</h3>
            <select
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                setSelectedVariant(null);
                setEditingVehicle(null);
              }}
              className="rounded-xl bg-[#0f172a]/70 border border-slate-700 px-3 py-2 text-slate-200"
            >
              <option value="">-- Chọn xe --</option>
              {vehicles.map((v) => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.brand} {v.model} ({v.version})
                </option>
              ))}
            </select>
          </div>

          {!selectedVehicle ? (
            <div className="text-slate-300">Chưa có xe nào được chọn.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Variants */}
              <div className="space-y-4">
                <h4 className="text-sky-400 font-semibold">Danh sách phiên bản</h4>

                {(selectedVehicle.variants || []).map((vt) => (
                  <div
                    key={vt.variant_id}
                    className="p-3 rounded-xl border border-slate-700 bg-[#0f172a]/70"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-slate-100 font-medium">
                          {vt.trim} — {vt.battery_kwh} kWh
                        </div>
                        <div className="text-slate-400 text-sm mt-1">
                          Tính năng: {(vt.features || []).join(", ") || "—"}
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {(vt.color_options || []).map((cid) => {
                            const c = findColor(cid);
                            return (
                              c && (
                                <div
                                  key={cid}
                                  className="w-6 h-6 rounded-full border border-slate-500"
                                  style={{ backgroundColor: c.hex_code }}
                                  title={c.name}
                                />
                              )
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            setSelectedVariant({ ...vt, vehicle_id: selectedVehicle.vehicle_id })
                          }
                          className="px-3 py-1 rounded bg-sky-600/30 text-white text-xs"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => removeVariant(selectedVehicle.vehicle_id, vt.variant_id)}
                          className="px-3 py-1 rounded bg-rose-600/30 text-rose-200 text-xs"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-3 rounded-xl border border-slate-700 bg-[#0f172a]/70">
                  <h5 className="text-slate-100 font-semibold mb-2">
                    {selectedVariant ? "Sửa phiên bản" : "Thêm phiên bản"}
                  </h5>
                  <VariantForm
                    vehicleId={selectedVehicle.vehicle_id}
                    colors={colors}
                    initial={selectedVariant}
                    onSaved={onVariantSaved}
                    onDeleted={(vt) => removeVariant(selectedVehicle.vehicle_id, vt.variant_id)}
                    canEdit={isAdmin || isStaff}
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <div className="p-3 rounded-xl border border-slate-700 bg-[#0f172a]/70">
                  <h5 className="text-slate-100 font-semibold mb-2">Quản lý màu</h5>
                  <ColorManager
                    colors={colors}
                    onSaved={onColorSaved}
                    onDeleted={deleteColor}
                    canEdit={isAdmin || isStaff}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* VEHICLE LIST */}
      <Card className="mt-8 bg-[#1e293b]/90 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-xl mb-4">Danh sách xe</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.vehicle_id}
              className="bg-[#0f172a]/70 border border-slate-700 rounded-xl p-4 hover:bg-[#1e293b]/70 transition"
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-white font-semibold">
                    {v.brand} {v.model}
                  </div>
                  <div className="text-slate-400 text-sm">{v.version}</div>
                  <div className="text-slate-300 mt-1">{formatCurrency(v.base_price)}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSelectedVehicleId(v.vehicle_id);
                      setEditingVehicle(v);
                    }}
                    className="px-3 py-1 rounded bg-sky-600/30 text-white text-xs"
                  >
                    Chọn
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => deleteVehicle(v.vehicle_id)}
                      className="px-3 py-1 rounded bg-rose-600/30 text-rose-200 text-xs"
                    >
                      Xoá
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 text-slate-400 text-xs">
                {v.variants?.length || 0} phiên bản • {(v.features || []).join(", ") || "—"}
              </div>

              <div className="flex gap-2 mt-3 flex-wrap">
                {(v.variants || []).slice(0, 3).map((sv) => (
                  <div
                    key={sv.variant_id}
                    className="px-2 py-1 rounded bg-slate-800/50 text-xs text-slate-200"
                  >
                    {sv.trim}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {(v.variants || [])
                  .flatMap((x) => x.color_options || [])
                  .map((cid) => findColor(cid))
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((c) => (
                    <div
                      key={c.color_id}
                      className="w-6 h-6 rounded-full border border-slate-500"
                      style={{ backgroundColor: c.hex_code }}
                      title={c.name}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};

export default CatalogueManager;
