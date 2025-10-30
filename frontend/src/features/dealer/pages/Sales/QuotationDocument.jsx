import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Đăng ký font hỗ trợ tiếng Việt (Quan trọng!)
// Tải font Roboto về dự án của bạn (ví dụ: trong /public/fonts/)
// Link tải: https://fonts.google.com/specimen/Roboto
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Định nghĩa các style (giống như CSS)
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 30,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 2,
    borderColor: '#06b6d4', // Cyan
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#06b6d4', // Cyan
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9', // Slate-100
    padding: 8,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    gap: 20,
  },
  gridCol: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottom: 1,
    borderColor: '#e5e7eb',
  },
  rowLabel: {
    color: '#4b5563',
  },
  rowValue: {
    fontWeight: 'bold',
  },
  totalSection: {
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#06b6d4', // Cyan
  },
  finalTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#06b6d4', // Cyan
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#888',
  },
});

// Helper định dạng tiền tệ
const formatCurrency = (amount) => {
  return `${(amount / 1000000).toLocaleString('vi-VN')} triệu VNĐ`;
};

// Component Mẫu Báo Giá
const QuotationDocument = ({ formData, priceBreakdown, selectedOptions, selectedServices }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* 1. Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>BÁO GIÁ XE ĐIỆN</Text>
          <Text>Đại lý: Tesla EVM (Chi nhánh của bạn)</Text>
        </View>
        <View style={styles.headerRight}>
          <Text>Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</Text>
          <Text>Hiệu lực đến: {new Date(formData.validUntil).toLocaleDateString('vi-VN')}</Text>
        </View>
      </View>

      {/* 2. Thông tin Khách hàng & Xe */}
      <View style={styles.grid}>
        <View style={styles.gridCol}>
          <Text style={styles.sectionTitle}>1. Thông tin khách hàng</Text>
          <Text>Khách hàng: {formData.customerName}</Text>
          <Text>Điện thoại: {formData.customerPhone}</Text>
          <Text>Email: {formData.customerEmail}</Text>
        </View>
        <View style={styles.gridCol}>
          <Text style={styles.sectionTitle}>2. Thông tin xe</Text>
          <Text>Dòng xe: {formData.vehicleName || 'Chưa chọn'}</Text>
          <Text>Chính sách pin: {formData.batteryPolicy}</Text>
        </View>
      </View>

      {/* 3. Chi tiết Cấu hình (Tùy chọn & Dịch vụ) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Chi tiết cấu hình</Text>
        {selectedOptions.map(opt => (
          <View style={styles.row} key={opt.id}>
            <Text style={styles.rowLabel}>Tùy chọn: {opt.name}</Text>
            <Text style={styles.rowValue}>+ {formatCurrency(opt.price)}</Text>
          </View>
        ))}
        {Object.entries(selectedServices).map(([key, value]) => (
          <View style={styles.row} key={key}>
            <Text style={styles.rowLabel}>Dịch vụ: {value}</Text>
            <Text style={styles.rowValue}>+ {formatCurrency(priceBreakdown.servicesTotal)}</Text>
          </View>
        ))}
      </View>

      {/* 4. Chi tiết Giá */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Chi tiết thanh toán</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Giá xe cơ bản</Text>
          <Text style={styles.rowValue}>{formatCurrency(priceBreakdown.basePrice)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Tổng phí tùy chọn & dịch vụ</Text>
          <Text style={styles.rowValue}>+ {formatCurrency(priceBreakdown.optionsTotal + priceBreakdown.servicesTotal)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Tổng phụ</Text>
          <Text style={styles.rowValue}>{formatCurrency(priceBreakdown.subtotal)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: '#dc2626' }]}>Giảm giá & Voucher</Text>
          <Text style={[styles.rowValue, { color: '#dc2626' }]}>- {formatCurrency(priceBreakdown.totalDiscount)}</Text>
        </View>
        
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng trước thuế</Text>
            <Text style={styles.totalValue}>{formatCurrency(priceBreakdown.taxableAmount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Thuế VAT (10%)</Text>
            <Text style={styles.totalValue}>+ {formatCurrency(priceBreakdown.vat)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Phí trước bạ (10% tạm tính)</Text>
            <Text style={styles.totalValue}>+ {formatCurrency(priceBreakdown.registrationFee)}</Text>
          </View>
          <View style={[styles.totalRow, { borderTop: 2, borderColor: '#06b6d4', marginTop: 10, paddingTop: 10 }]}>
            <Text style={styles.finalTotal}>TỔNG CỘNG</Text>
            <Text style={styles.finalTotal}>{formatCurrency(priceBreakdown.total)}</Text>
          </View>
        </View>
      </View>

      {/* 5. Footer */}
      <Text style={styles.footer}>
        Báo giá này có hiệu lực đến ngày {new Date(formData.validUntil).toLocaleDateString('vi-VN')}.
        Cảm ơn quý khách đã quan tâm!
      </Text>
    </Page>
  </Document>
);

export default QuotationDocument;