import React, { useState } from 'react';
import Badge from './Badge';
import Button from './Button';
import Card from './Card';
import EmptyState from './EmptyState';
import SearchBar from './SearchBar';
import StatCard from './StatCard';
import Table from './Table';
import { FormGroup, Label, Input, Select, Textarea } from './FormComponents';
import {
  InfoRow,
  InfoSection,
  GridCard,
  DetailHeader,
  ListSection,
  ActionBar,
  StatusTimeline,
  MetricCard,
  TabPanel,
  QuickStats
} from './AdvancedComponents';

/**
 * UIShowcase - Component showcase để test tất cả UI components
 */
const UIShowcase = () => {
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const tableColumns = [
    { key: 'name', label: 'Tên' },
    { key: 'status', label: 'Trạng thái', render: (row) => <Badge variant={row.statusVariant}>{row.status}</Badge> },
    { key: 'value', label: 'Giá trị' }
  ];

  const tableData = [
    { id: 1, name: 'Item 1', status: 'Hoàn thành', statusVariant: 'success', value: '100M' },
    { id: 2, name: 'Item 2', status: 'Đang xử lý', statusVariant: 'warning', value: '200M' },
    { id: 3, name: 'Item 3', status: 'Chờ duyệt', statusVariant: 'info', value: '150M' }
  ];

  const timelineEvents = [
    { date: '10:30 - 23/10/2025', title: 'Đơn hàng đã được tạo', description: 'Khởi tạo đơn hàng mới', status: 'success' },
    { date: '14:20 - 23/10/2025', title: 'Đang xử lý', description: 'Đơn hàng đang được xử lý', status: 'warning' },
    { date: '16:45 - 23/10/2025', title: 'Chờ giao hàng', description: 'Đang chờ vận chuyển', status: 'info' }
  ];

  const tabs = [
    { id: 'all', label: 'Tất cả', icon: '📋' },
    { id: 'active', label: 'Đang hoạt động', icon: '✅' },
    { id: 'pending', label: 'Chờ xử lý', icon: '⏳' }
  ];

  const quickStats = [
    { icon: '📊', label: 'Tổng đơn', value: '156', color: 'dark:text-emerald-400 text-cyan-600' },
    { icon: '💰', label: 'Doanh thu', value: '2.5B', color: 'dark:text-blue-400 text-blue-600' },
    { icon: '👥', label: 'Khách hàng', value: '89', color: 'dark:text-purple-400 text-purple-600' },
    { icon: '🚗', label: 'Xe bán', value: '47', color: 'dark:text-pink-400 text-pink-600' }
  ];

  const selectOptions = [
    { value: 'option1', label: 'Tùy chọn 1' },
    { value: 'option2', label: 'Tùy chọn 2' },
    { value: 'option3', label: 'Tùy chọn 3' }
  ];

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-8">🎨 UI Component Showcase</h1>

      {/* Badges Section */}
      <Card>
        <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="purple">Purple</Badge>
          <Badge variant="gray">Gray</Badge>
        </div>
      </Card>

      {/* Buttons Section */}
      <Card>
        <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Buttons</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="gradient" icon="🚀">Gradient Button</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </Card>

      {/* Search Bar */}
      <Card>
        <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Search Bar</h2>
        <SearchBar 
          placeholder="Tìm kiếm sản phẩm..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Card>

      {/* Form Components */}
      <Card>
        <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Form Components</h2>
        <FormGroup>
          <Label htmlFor="input1" required>Input Field</Label>
          <Input 
            id="input1"
            placeholder="Nhập văn bản..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="select1">Select Field</Label>
          <Select 
            id="select1"
            placeholder="Chọn một tùy chọn"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            options={selectOptions}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="textarea1">Textarea</Label>
          <Textarea 
            id="textarea1"
            placeholder="Nhập mô tả..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            rows={4}
          />
        </FormGroup>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon="🚗"
          title="Xe có sẵn"
          value="47"
          change="+5 xe trong tuần"
          trend="up"
        />
        <StatCard 
          icon="📋"
          title="Đơn hàng"
          value="13"
          change="+18% so với tháng trước"
          trend="up"
        />
        <StatCard 
          icon="👥"
          title="Khách hàng"
          value="156"
          change="+12 khách mới"
          trend="up"
        />
        <StatCard 
          icon="💰"
          title="Doanh thu"
          value="11.3B"
          change="+25% so với tháng trước"
          trend="up"
        />
      </div>

      {/* Quick Stats */}
      <Card>
        <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Quick Stats</h2>
        <QuickStats stats={quickStats} />
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon="📈"
          label="Tăng trưởng"
          value="25%"
          trend="up"
          change="+5% so với tháng trước"
          color="emerald"
        />
        <MetricCard 
          icon="💵"
          label="Lợi nhuận"
          value="1.2B"
          trend="up"
          change="+15% so với tháng trước"
          color="blue"
        />
        <MetricCard 
          icon="📊"
          label="Đơn hàng"
          value="89"
          trend="neutral"
          change="Giữ nguyên"
          color="yellow"
        />
        <MetricCard 
          icon="⚠️"
          label="Cảnh báo"
          value="3"
          trend="down"
          change="-2 so với tuần trước"
          color="red"
        />
      </div>

      {/* Tab Panel */}
      <TabPanel 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Table */}
      <Table 
        columns={tableColumns}
        data={tableData}
        onRowClick={(row) => console.log('Clicked:', row)}
      />

      {/* Info Section */}
      <InfoSection title="Thông tin chi tiết" icon="📋">
        <InfoRow label="Mã đơn hàng" value="DH-2025-001" icon="🔖" />
        <InfoRow label="Ngày tạo" value="23/10/2025" icon="📅" />
        <InfoRow label="Trạng thái" value={<Badge variant="success">Hoàn thành</Badge>} icon="📊" />
        <InfoRow label="Tổng tiền" value="2,500,000,000 VND" icon="💰" />
      </InfoSection>

      {/* Grid Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Grid Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <GridCard onClick={() => console.log('Card 1')}>
            <div className="text-4xl mb-3">🚗</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white text-gray-900">Tesla Model 3</h3>
            <p className="dark:text-gray-400 text-gray-600 mb-3">Sedan điện cao cấp</p>
            <Badge variant="success">Có sẵn</Badge>
          </GridCard>

          <GridCard onClick={() => console.log('Card 2')}>
            <div className="text-4xl mb-3">🚙</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white text-gray-900">Tesla Model Y</h3>
            <p className="dark:text-gray-400 text-gray-600 mb-3">SUV điện gia đình</p>
            <Badge variant="warning">Đặt trước</Badge>
          </GridCard>

          <GridCard onClick={() => console.log('Card 3')}>
            <div className="text-4xl mb-3">🏎️</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white text-gray-900">Tesla Model S</h3>
            <p className="dark:text-gray-400 text-gray-600 mb-3">Sedan hiệu suất cao</p>
            <Badge variant="info">Liên hệ</Badge>
          </GridCard>
        </div>
      </div>

      {/* List Section */}
      <ListSection 
        title="Tính năng nổi bật"
        icon="⭐"
        items={[
          'Tăng tốc 0-100km/h trong 3.1 giây',
          'Phạm vi hoạt động lên đến 652km',
          'Hệ thống tự lái Autopilot tiên tiến',
          'Nội thất cao cấp với màn hình cảm ứng 17 inch',
          'An toàn 5 sao NHTSA'
        ]}
        itemIcon="✓"
      />

      {/* Status Timeline */}
      <Card>
        <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Status Timeline</h2>
        <StatusTimeline events={timelineEvents} />
      </Card>

      {/* Detail Header */}
      <DetailHeader 
        title="Chi tiết đơn hàng #DH-2025-001"
        subtitle="Tạo lúc 10:30 - 23/10/2025"
        onBack={() => console.log('Go back')}
        badge={<Badge variant="success">Hoàn thành</Badge>}
        actions={
          <>
            <Button variant="secondary" size="sm">Sửa</Button>
            <Button variant="danger" size="sm">Xóa</Button>
          </>
        }
      />

      {/* Action Bar */}
      <ActionBar align="right">
        <Button variant="ghost">Hủy</Button>
        <Button variant="secondary">Lưu nháp</Button>
        <Button variant="gradient">Hoàn thành</Button>
      </ActionBar>

      {/* Empty State */}
      <Card>
        <EmptyState 
          icon="📭"
          title="Không có dữ liệu"
          message="Chưa có dữ liệu để hiển thị. Hãy thêm mới để bắt đầu."
          action={{
            label: 'Thêm mới',
            onClick: () => console.log('Add new')
          }}
        />
      </Card>

      {/* Hover Card */}
      <Card hover>
        <h3 className="text-xl font-bold mb-2 dark:text-white text-gray-900">Card with Hover Effect</h3>
        <p className="dark:text-gray-400 text-gray-600">Di chuột vào để xem hiệu ứng hover</p>
      </Card>
    </div>
  );
};

export default UIShowcase;
