// src/features/admin/components/catalog/mockData.js
export const initialColors = [
  { color_id: "C01", name: "Pearl White", hex_code: "#ffffff" },
  { color_id: "C02", name: "Midnight Black", hex_code: "#0b0b0b" },
  { color_id: "C03", name: "Sky Blue", hex_code: "#38bdf8" },
  { color_id: "C04", name: "Crimson Red", hex_code: "#ef4444" },
  { color_id: "C05", name: "Titanium Silver", hex_code: "#9ca3af" },
];

export const initialVehicles = [
  {
    vehicle_id: "V001",
    brand: "Tesla",
    model: "Model 3",
    version: "Long Range",
    year: 2024,
    base_price: 1350000000,
    status: "active",
    features: ["Autopilot", "Fast Charge", "Wireless Update"],
    variants: [
      {
        variant_id: "VT001",
        trim: "Dual Motor",
        battery_kwh: 75,
        color_options: ["C01", "C02", "C03"],
        features: ["Autopilot", "Heated Seats"],
      },
    ],
  },
  {
    vehicle_id: "V002",
    brand: "VinFast",
    model: "VF8",
    version: "Plus",
    year: 2025,
    base_price: 1100000000,
    status: "active",
    features: ["V2L", "Smart Service", "Auto Park"],
    variants: [
      {
        variant_id: "VT002",
        trim: "Eco",
        battery_kwh: 82,
        color_options: ["C02", "C04"],
        features: ["Fast Charging"],
      },
    ],
  },
  {
    vehicle_id: "V003",
    brand: "BYD",
    model: "Atto 3",
    version: "Standard",
    year: 2025,
    base_price: 890000000,
    status: "active",
    features: ["e-Platform 3.0", "LFP Battery"],
    variants: [
      {
        variant_id: "VT003",
        trim: "Extended Range",
        battery_kwh: 60,
        color_options: ["C03", "C05"],
        features: ["Android Auto", "Apple CarPlay"],
      },
    ],
  },
  {
    vehicle_id: "V004",
    brand: "MG",
    model: "MG4 Electric",
    version: "Lux",
    year: 2024,
    base_price: 750000000,
    status: "active",
    features: ["Rear-Wheel Drive", "MG Pilot Assist"],
    variants: [
      {
        variant_id: "VT004",
        trim: "Standard",
        battery_kwh: 51,
        color_options: ["C01", "C03"],
        features: ["Cruise Control"],
      },
    ],
  },
  {
    vehicle_id: "V005",
    brand: "Hyundai",
    model: "Ioniq 5",
    version: "Ultimate",
    year: 2023,
    base_price: 1200000000,
    status: "active",
    features: ["Vehicle-to-Load", "Ultra-fast charging"],
    variants: [
      {
        variant_id: "VT005",
        trim: "AWD",
        battery_kwh: 72,
        color_options: ["C01", "C04", "C05"],
        features: ["HUD", "Heated Seats"],
      },
    ],
  },
];
