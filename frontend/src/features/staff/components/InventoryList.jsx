import React, { useEffect, useState } from 'react';
import api from '../../../shared/utils/api';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  useEffect(()=>{ api.get('/inventory').then(r=> setItems(r.data)).catch(()=>{}); },[]);
  return (
    <div>
      <h3>Tồn kho</h3>
      <table>
        <thead><tr><th>Xe</th><th>Đại lý</th><th>Số lượng</th></tr></thead>
        <tbody>
          {items.map(i=> <tr key={i.id}><td>{i.vehicleModel}</td><td>{i.dealerName}</td><td>{i.quantity}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
};
export default InventoryList;
