/**
 * Mock Data: Danh sách Đại lý
 */
export const MOCK_DEALERS = [
  {
    dealerId: 2,
    name: "VinFast Sài Gòn",
    address: "Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh",
    phone: "0987654321",
    email: "contact@vinfastsaigon.vn",
    representativeName: "Nguyễn Văn A",
    status: "Active"
  },
  {
    dealerId: 3,
    name: "Đại lý Sài Gòn",
    address: "456 Nguyễn Huệ, TPHCM",
    phone: "0987654321",
    email: "sales@dailysaigon.com",
    representativeName: "Trần Thị B",
    status: "Active"
  },
  {
    dealerId: 4,
    name: "Đại lý A - Hà Nội",
    address: "55 Tràng Tiền, Hà Nội",
    phone: "02411112222",
    email: "info@dailyhanoi-a.vn",
    representativeName: "Lê Văn C",
    status: "Active"
  },
  {
    dealerId: 5,
    name: "Đại lý B - TPHCM",
    address: "22 Nguyễn Huệ, Quận 1, TPHCM",
    phone: "02833334444",
    email: "support@dailyhcm-b.vn",
    representativeName: "Phạm Thị D",
    status: "Inactive"
  }
];

/**
 * Helper function để lấy dealer theo ID từ Mock data
 */
export const getMockDealerById = (id) => {
  if (!id) return null;
  return MOCK_DEALERS.find(d => d.dealerId.toString() === id.toString()) || null;
};