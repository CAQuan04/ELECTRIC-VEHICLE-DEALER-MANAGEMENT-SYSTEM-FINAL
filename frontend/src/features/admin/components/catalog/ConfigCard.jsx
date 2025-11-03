import React from "react";

const ConfigCard = ({ label, value }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex justify-between items-center">
    <span className="text-slate-300">{label}</span>
    <span className="font-semibold text-cyan-400">{value}</span>
  </div>
);

export default ConfigCard;
