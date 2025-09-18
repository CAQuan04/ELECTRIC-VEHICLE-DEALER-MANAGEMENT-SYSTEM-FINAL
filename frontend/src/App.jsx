import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar.jsx';
import Navbar from './components/Layout/Navbar.jsx';
import VehicleList from './components/Catalog/VehicleList.jsx';
import OrderList from './components/Sales/OrderList.jsx';
import CustomerList from './components/Customers/CustomerList.jsx';
import InventoryList from './components/Inventory/InventoryList.jsx';
import ReportDashboard from './components/Reports/ReportDashboard.jsx';
import DealerList from './components/Admin/DealerList.jsx';
import DealerDashboard from './pages/DealerDashboard.jsx';
import EvmDashboard from './pages/EvmDashboard.jsx';
import Landing from './pages/Landing.jsx';
const AppLayout = ({children}) => (
  <div style={{display:'flex'}}>
    <Sidebar />
    <div style={{marginLeft:220, flex:1}}>
      <Navbar />
      <main style={{padding:'1rem'}}>{children}</main>
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dealer" element={<AppLayout><DealerDashboard /></AppLayout>} />
      <Route path="/evm" element={<AppLayout><EvmDashboard /></AppLayout>} />
      <Route path="/catalog" element={<AppLayout><VehicleList /></AppLayout>} />
      <Route path="/sales/orders" element={<AppLayout><OrderList /></AppLayout>} />
      <Route path="/customers" element={<AppLayout><CustomerList /></AppLayout>} />
      <Route path="/inventory" element={<AppLayout><InventoryList /></AppLayout>} />
      <Route path="/reports" element={<AppLayout><ReportDashboard /></AppLayout>} />
      <Route path="/admin/dealers" element={<AppLayout><DealerList /></AppLayout>} />
    </Routes>
  );
};
export default App;
