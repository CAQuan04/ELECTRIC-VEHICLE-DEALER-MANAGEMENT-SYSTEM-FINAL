import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  useEffect(()=>{ api.get('/vehicles').then(r=> setVehicles(r.data)).catch(()=>{}); },[]);
  return (
    <div>
      <h3>Danh mục xe</h3>
      <table>
        <thead><tr><th>Mẫu</th><th>Phiên bản</th><th>Màu</th><th>Giá</th></tr></thead>
        <tbody>
          {vehicles.map(v=> <tr key={v.id}><td>{v.model}</td><td>{v.variant}</td><td>{v.color}</td><td>{v.price?.toLocaleString()}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
};
export default VehicleList;
