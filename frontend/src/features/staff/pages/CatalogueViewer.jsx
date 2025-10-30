import React, { useState } from "react";
import { initialVehicles, initialColors } from "../../admin/components/catalog/mockData";

const CatalogueViewer = () => {
  const [vehicles] = useState(initialVehicles);
  const [colors] = useState(initialColors);

  const findColor = (id) => colors.find((c) => c.color_id === id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-bold text-sky-400 mb-6">Catalogue sản phẩm</h1>

      {vehicles.length === 0 ? (
        <p className="text-slate-400">Chưa có dữ liệu xe nào được cấu hình.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.vehicle_id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/70 transition"
            >
              <div className="text-xl font-semibold text-white">
                {v.brand} {v.model}
              </div>
              <div className="text-slate-400 text-sm mb-1">
                {v.version} — {v.year || "2024"}
              </div>
              <div className="text-slate-300 text-sm mb-2">
                {(v.features || []).join(", ") || "Không có tính năng"}
              </div>

              <div className="mt-3 space-y-2">
                {(v.variants || []).map((vt) => (
                  <div
                    key={vt.variant_id}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sky-400">{vt.trim}</span>
                      <span className="text-sm text-slate-400">{vt.battery_kwh} kWh</span>
                    </div>

                    <div className="flex gap-2 flex-wrap mt-2">
                      {(vt.color_options || []).map((cid) => {
                        const c = findColor(cid);
                        return (
                          <div
                            key={cid}
                            className="w-6 h-6 rounded-full border border-slate-600"
                            style={{ backgroundColor: c?.hex_code }}
                            title={c?.name}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogueViewer;
