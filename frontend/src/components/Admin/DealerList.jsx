import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const DealerList = () => {
  const [dealers, setDealers] = useState([]);
  useEffect(()=>{ api.get('/dealers').then(r=> setDealers(r.data)).catch(()=>{}); },[]);
  return (
    <div>
      <h3>Đại lý</h3>
      <table>
        <thead><tr><th>Tên</th><th>Khu vực</th><th>Chỉ tiêu</th></tr></thead>
        <tbody>
          {dealers.map(d=> <tr key={d.id}><td>{d.name}</td><td>{d.region}</td><td>{d.target}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
};
export default DealerList;
