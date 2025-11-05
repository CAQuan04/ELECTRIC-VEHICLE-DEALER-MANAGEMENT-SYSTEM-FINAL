import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { notifications } from '@utils/notifications';

// Import Lucide icons
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Briefcase,
  ShoppingCart,
  Car,
  Clock,
  FileText,
  Edit,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Building2
} from 'lucide-react';

// Import enhanced components
import {
  DetailHeader,
  InfoSection,
  InfoRow,
  TabPanel,
  StatusTimeline,
  ActionBar,
  QuickStats,
  Button,
  Badge
} from '../../components';

const CustomerDetail = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadCustomerDetail();
  }, [customerId]);

  const loadCustomerDetail = async () => {
    try {
      startLoading('Đang tải thông tin khách hàng...');
      const response = await dealerAPI.getCustomerById(customerId);
      if (response.success) {
        setCustomer(response.data);
      } else {
        notifications.error('Lỗi', response.message);
        navigate('/dealer/customers');
      }
    } catch (error) {
      console.error('Error loading customer:', error);
      notifications.error('Lỗi', error.response?.data?.message || error.message);
      navigate('/dealer/customers');
    } finally {
      stopLoading();
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Đã mua':
        return 'success';
      case 'Tiềm năng':
        return 'info';
      case 'Đang tư vấn':
        return 'warning';
      default:
        return 'gray';
    }
  };

  if (!customer) return null;

  // Prepare tabs
  const tabs = [
    { 
      id: 'overview', 
      label: 'Tổng quan', 
      icon: <User className="w-5 h-5" /> 
    },
    { 
      id: 'history', 
      label: 'Lịch sử Mua hàng', 
      icon: <ShoppingCart className="w-5 h-5" /> 
    },
    { 
      id: 'drives', 
      label: 'Lịch sử Lái thử', 
      icon: <Car className="w-5 h-5" /> 
    },
    { 
      id: 'timeline', 
      label: 'Dòng thời gian', 
      icon: <Clock className="w-5 h-5" /> 
    },
    { 
      id: 'notes', 
      label: 'Ghi chú', 
      icon: <FileText className="w-5 h-5" /> 
    }
  ];

  // Prepare timeline events
  const timelineEvents = [
    {
      date: customer.createdDate,
      title: 'Tạo hồ sơ khách hàng',
      description: 'Khách hàng được thêm vào hệ thống',
      status: 'info'
    },
    ...(customer.testDrives || []).map(drive => ({
      date: drive.date,
      title: `Lái thử ${drive.vehicle}`,
      description: drive.status,
      status: 'warning'
    })),
    ...(customer.purchaseHistory || []).map(purchase => ({
      date: purchase.date,
      title: `Mua xe ${purchase.vehicle}`,
      description: `Giá trị: ${(purchase.amount / 1000000).toLocaleString('vi-VN')} triệu VNĐ`,
      status: 'success'
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Quick stats with Lucide icons
  const quickStats = [
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      label: 'Tổng mua hàng',
      value: customer.purchaseHistory?.length || 0,
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: <Car className="w-8 h-8" />,
      label: 'Lái thử',
      value: customer.testDrives?.length || 0,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      label: 'Tổng chi tiêu',
      value: `${((customer.purchaseHistory || []).reduce((sum, p) => sum + p.amount, 0) / 1000000000).toFixed(1)}B`,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      label: 'Liên hệ gần nhất',
      value: customer.lastContact || 'N/A',
      color: 'text-gray-600 dark:text-gray-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <DetailHeader
          title={customer.name}
          subtitle={`ID: ${customer.id} • ${customer.email}`}
          onBack={() => navigate('/dealer/customers')}
          badge={
            <Badge variant={getStatusVariant(customer.status)}>
              {customer.status}
            </Badge>
          }
          actions={
            <>
              <Button
                variant="primary"
                icon={<Edit className="w-5 h-5" />}
                onClick={() => navigate(`/dealer/customers/${customerId}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <a href={`tel:${customer.phone}`}>
                <Button variant="secondary" icon={<Phone className="w-5 h-5" />}>
                  Gọi ngay
                </Button>
              </a>
            </>
          }
        />

        {/* Quick Stats */}
        <QuickStats stats={quickStats} />

        {/* Tabs */}
        <TabPanel
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfoSection title="Thông tin liên hệ" icon={<Mail className="w-6 h-6" />}>
                <InfoRow 
                  label="Email" 
                  value={customer.email} 
                  icon={<Mail className="w-5 h-5" />} 
                />
                <InfoRow 
                  label="Số điện thoại" 
                  value={customer.phone} 
                  icon={<Phone className="w-5 h-5" />} 
                />
                <InfoRow 
                  label="Địa chỉ" 
                  value={customer.address} 
                  icon={<MapPin className="w-5 h-5" />} 
                />
                <InfoRow 
                  label="Thành phố" 
                  value={customer.city} 
                  icon={<Building2 className="w-5 h-5" />} 
                />
              </InfoSection>

              <InfoSection title="Thông tin hệ thống" icon={<Briefcase className="w-6 h-6" />}>
                <InfoRow 
                  label="Mã khách hàng" 
                  value={customer.id} 
                  icon={<Tag className="w-5 h-5" />} 
                />
                <InfoRow 
                  label="Ngày tạo hồ sơ" 
                  value={customer.createdDate} 
                  icon={<Calendar className="w-5 h-5" />} 
                />
                <InfoRow 
                  label="Trạng thái" 
                  value={customer.status} 
                  icon={<TrendingUp className="w-5 h-5" />} 
                />
                <InfoRow 
                  label="Tổng giao dịch" 
                  value={`${(customer.purchaseHistory || []).length} lần`} 
                  icon={<Briefcase className="w-5 h-5" />} 
                />
              </InfoSection>
            </div>
          )}

          {/* Purchase History Tab */}
          {activeTab === 'history' && (
            <InfoSection title="Lịch sử mua hàng" icon={<ShoppingCart className="w-6 h-6" />}>
              {customer.purchaseHistory && customer.purchaseHistory.length > 0 ? (
                <div className="space-y-4">
                  {customer.purchaseHistory.map((purchase, index) => (
                    <div
                      key={purchase.id}
                      className="group flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-500/10 dark:to-transparent border-l-4 border-emerald-500 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                          <Car className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {purchase.vehicle}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {purchase.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                          <DollarSign className="w-6 h-6" />
                          {(purchase.amount / 1000000).toLocaleString('vi-VN')}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          triệu VNĐ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Chưa có lịch sử mua hàng
                  </p>
                </div>
              )}
            </InfoSection>
          )}

          {/* Test Drives Tab */}
          {activeTab === 'drives' && (
            <InfoSection title="Lịch sử lái thử" icon={<Car className="w-6 h-6" />}>
              {customer.testDrives && customer.testDrives.length > 0 ? (
                <div className="space-y-4">
                  {customer.testDrives.map((drive) => (
                    <div
                      key={drive.id}
                      className="group flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-500/10 dark:to-transparent border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                          <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {drive.vehicle}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {drive.date}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {drive.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Chưa có lịch sử lái thử
                  </p>
                </div>
              )}
            </InfoSection>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <StatusTimeline events={timelineEvents} />
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <InfoSection title="Ghi chú" icon={<FileText className="w-6 h-6" />}>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {customer.notes || (
                    <span className="italic text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Không có ghi chú
                    </span>
                  )}
                </p>
              </div>
            </InfoSection>
          )}
        </div>

        {/* Action Bar */}
        <ActionBar align="right">
          <Button
            variant="ghost"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/dealer/customers')}
          >
            Quay lại danh sách
          </Button>
          <Button
            variant="gradient"
            icon={<Edit className="w-5 h-5" />}
            onClick={() => navigate(`/dealer/customers/${customerId}/edit`)}
          >
            Chỉnh sửa thông tin
          </Button>
        </ActionBar>
      </div>
    </div>
  );
};

export default CustomerDetail;