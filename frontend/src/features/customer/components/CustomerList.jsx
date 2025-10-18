import React, { useEffect, useState } from 'react';
import api from '@utils';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  useEffect(()=>{ api.get('/customers').then(r=> setCustomers(r.data)).catch(()=>{}); },[]);
  return (
    <div>
      <h3>Khách hàng</h3>
      <ul>
        {customers.map(c=> <li key={c.id}>{c.name} - {c.phone}</li>)}
      </ul>
    </div>
  );
};
export default CustomerList;
