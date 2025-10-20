# Dữ liệu Hành chính Việt Nam

Dự án này cung cấp dữ liệu về đơn vị hành chính Việt Nam (tỉnh/thành phố và xã/phường/thị trấn) được chuẩn hóa từ nguồn dữ liệu chính thức của Tổng cục Thống kê.

## Cấu trúc dữ liệu

### File `provinces.json`

File này chứa thông tin về các tỉnh và thành phố của Việt Nam với cấu trúc như sau:

```json
[
  {
    "id": "01",
    "name": "Thành phố Hà Nội"
  },
  ...
]
```

Trong đó:

- `id`: Mã tỉnh/thành phố (định dạng số)
- `name`: Tên đầy đủ của tỉnh/thành phố

### File `wards.json`

File này chứa thông tin chi tiết về các xã, phường, thị trấn trên toàn quốc với cấu trúc như sau:

```json
[
  {
    "id": "00070",
    "name": "Phường Hoàn Kiếm",
    "province_id": "01",
    "province_name": "Thành phố Hà Nội"
  },
  ...
]
```

Trong đó:

- `id`: Mã đơn vị hành chính cấp xã/phường/thị trấn
- `name`: Tên đơn vị hành chính
- `province_id`: Mã tỉnh/thành phố mà đơn vị hành chính này trực thuộc
- `province_name`: Tên tỉnh/thành phố mà đơn vị hành chính này trực thuộc

## Nguồn dữ liệu

Dữ liệu được tổng hợp và chuẩn hóa từ nguồn chính thức của Tổng cục Thống kê Việt Nam, đảm bảo tính chính xác và cập nhật.

## Mục đích sử dụng

Dữ liệu này có thể được sử dụng cho nhiều mục đích khác nhau như:

- Phát triển phần mềm cần dữ liệu địa chính Việt Nam
- Phân tích dữ liệu theo vùng miền
- Xây dựng hệ thống thông tin địa lý
- Nghiên cứu và thống kê

---

## Thông tin cập nhật

Dữ liệu cập nhật: Tháng 6/2025