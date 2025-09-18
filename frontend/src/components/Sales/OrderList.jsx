import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  useEffect(()=>{ api.get('/orders').then(r=> setOrders(r.data)).catch(()=>{}); },[]);
  return (
    <div>
      <h3>Đơn hàng</h3>
      <table>
        <thead><tr><th>Mã</th><th>Khách hàng</th><th>Xe</th><th>Trạng thái</th></tr></thead>
        <tbody>
          {orders.map(o=> <tr key={o.id}><td>{o.code}</td><td>{o.customerName}</td><td>{o.vehicleModel}</td><td>{o.status}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
};
export default OrderList;
