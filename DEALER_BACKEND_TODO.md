# 📋 TODO LIST - NỐI DEALER MODULE TỚI BACKEND

## 🎯 TỔNG QUAN

Tài liệu này chi tiết các bước cần thực hiện để nối hoàn chỉnh Frontend Dealer module với Backend, tập trung vào 3 module chính:
1. **Sales Module** (Quotations, Orders, Payments)
2. **Inventory Module** (Kho xe, Phân phối)
3. **Purchase Module** (Yêu cầu mua hàng)

---

## 📦 MODULE 1: INVENTORY MANAGEMENT

### Phase 1.1: Database & Models ⏳
- [ ] **Tạo StockRequest Model**
  ```csharp
  // File: backend/EVDealer.BE.DAL/Models/StockRequest.cs
  public class StockRequest {
      public int Id { get; set; }
      public int VehicleId { get; set; }
      public int? ConfigId { get; set; }
      public int Quantity { get; set; }
      public int DealerId { get; set; }
      public int RequestedByUserId { get; set; }
      public DateTime RequestDate { get; set; }
      public string Priority { get; set; } // Khẩn cấp, Cao, Bình thường, Thấp
      public string Status { get; set; } // Pending, Approved, Rejected
      public string Reason { get; set; }
      public string? Notes { get; set; }
      public string? RejectionReason { get; set; }
      public DateTime? ProcessedDate { get; set; }
      public int? ProcessedByUserId { get; set; }
      
      // Navigation properties
      public Vehicle Vehicle { get; set; }
      public Dealer Dealer { get; set; }
      public User RequestedBy { get; set; }
      public User? ProcessedBy { get; set; }
  }
  ```

- [ ] **Tạo DealerInventory Model (nếu chưa có)**
  ```csharp
  // File: backend/EVDealer.BE.DAL/Models/DealerInventory.cs
  public class DealerInventory {
      public int InventoryId { get; set; }
      public int VehicleId { get; set; }
      public int DealerId { get; set; }
      public string Color { get; set; }
      public int Quantity { get; set; }
      public string Status { get; set; } // Available, Reserved, Sold
      public DateTime? LastRestockDate { get; set; }
      public DateTime? LastUpdated { get; set; }
      
      // Navigation properties
      public Vehicle Vehicle { get; set; }
      public Dealer Dealer { get; set; }
  }
  ```

- [ ] **Cập nhật DbContext**
  ```csharp
  // File: backend/EVDealer.BE.DAL/Data/ApplicationDbContext.cs
  public DbSet<StockRequest> StockRequests { get; set; }
  public DbSet<DealerInventory> DealerInventories { get; set; }
  
  protected override void OnModelCreating(ModelBuilder modelBuilder) {
      // Configure relationships
      modelBuilder.Entity<StockRequest>()
          .HasOne(sr => sr.Vehicle)
          .WithMany()
          .HasForeignKey(sr => sr.VehicleId);
          
      modelBuilder.Entity<StockRequest>()
          .HasOne(sr => sr.Dealer)
          .WithMany()
          .HasForeignKey(sr => sr.DealerId);
      
      // ... other configurations
  }
  ```

- [ ] **Tạo Migration**
  ```bash
  cd backend/EVDealer.BE.DAL
  dotnet ef migrations add AddStockRequestAndDealerInventory
  dotnet ef database update
  ```

### Phase 1.2: Repository Layer ⏳
- [ ] **Cập nhật IInventoryRepository**
  ```csharp
  // File: backend/EVDealer.BE.DAL/Repositories/IInventoryRepository.cs
  public interface IInventoryRepository {
      // Dealer Inventory
      Task<IEnumerable<DealerInventory>> GetDealerInventoryAsync(int dealerId, string? search);
      Task<DealerInventory?> GetInventoryItemByIdAsync(int inventoryId);
      Task<DealerInventory> UpdateInventoryItemAsync(DealerInventory item);
      
      // Stock Requests
      Task<IEnumerable<StockRequest>> GetStockRequestsAsync(int dealerId, string? status, string? search);
      Task<StockRequest?> GetStockRequestByIdAsync(int requestId);
      Task<StockRequest> CreateStockRequestAsync(StockRequest request);
      Task<StockRequest> UpdateStockRequestAsync(StockRequest request);
      
      // Utility
      Task<bool> SaveChangesAsync();
  }
  ```

- [ ] **Implement InventoryRepository methods**
  ```csharp
  // File: backend/EVDealer.BE.DAL/Repositories/InventoryRepository.cs
  
  public async Task<IEnumerable<DealerInventory>> GetDealerInventoryAsync(int dealerId, string? search) {
      var query = _context.DealerInventories
          .Include(di => di.Vehicle)
          .Include(di => di.Dealer)
          .Where(di => di.DealerId == dealerId);
      
      if (!string.IsNullOrEmpty(search)) {
          query = query.Where(di => 
              di.Vehicle.Model.Contains(search) || 
              di.Vehicle.Brand.Contains(search));
      }
      
      return await query.ToListAsync();
  }
  
  public async Task<StockRequest?> GetStockRequestByIdAsync(int requestId) {
      return await _context.StockRequests
          .Include(sr => sr.Vehicle)
          .Include(sr => sr.Dealer)
          .Include(sr => sr.RequestedBy)
          .Include(sr => sr.ProcessedBy)
          .FirstOrDefaultAsync(sr => sr.Id == requestId);
  }
  
  // ... implement other methods
  ```

### Phase 1.3: Service Layer ⏳
- [ ] **Implement GetDealerInventoryAsync**
  ```csharp
  // File: backend/EVDealer.BE.Services/IInventory/InventoryService.cs
  
  public async Task<IEnumerable<DealerInventoryDto>> GetDealerInventoryAsync(int dealerId, string? search) {
      var inventories = await _inventoryRepo.GetDealerInventoryAsync(dealerId, search);
      
      return inventories.Select(inv => new DealerInventoryDto {
          InventoryId = inv.InventoryId,
          VehicleId = inv.VehicleId,
          VehicleName = $"{inv.Vehicle.Brand} {inv.Vehicle.Model}",
          Model = inv.Vehicle.Model,
          Brand = inv.Vehicle.Brand,
          Color = inv.Color,
          Quantity = inv.Quantity,
          BasePrice = inv.Vehicle.BasePrice,
          Status = inv.Status,
          DealerId = inv.DealerId,
          DealerName = inv.Dealer.Name,
          LastUpdated = inv.LastUpdated
      });
  }
  ```

- [ ] **Implement GetInventoryItemDetailAsync**
  ```csharp
  public async Task<DealerInventoryDetailDto?> GetInventoryItemDetailAsync(int dealerId, int inventoryId) {
      var item = await _inventoryRepo.GetInventoryItemByIdAsync(inventoryId);
      
      if (item == null || item.DealerId != dealerId) {
          return null;
      }
      
      // Calculate available, reserved, sold quantities from orders/reservations
      var availableQty = item.Quantity; // TODO: minus reserved
      var reservedQty = 0; // TODO: count from orders with status Reserved
      var soldQty = 0; // TODO: count from completed orders
      
      return new DealerInventoryDetailDto {
          InventoryId = item.InventoryId,
          VehicleId = item.VehicleId,
          VehicleName = $"{item.Vehicle.Brand} {item.Vehicle.Model}",
          Model = item.Vehicle.Model,
          Brand = item.Vehicle.Brand,
          Color = item.Color,
          TotalQuantity = item.Quantity,
          AvailableQuantity = availableQty,
          ReservedQuantity = reservedQty,
          SoldQuantity = soldQty,
          BasePrice = item.Vehicle.BasePrice,
          DealerId = item.DealerId,
          DealerName = item.Dealer.Name,
          VehicleImages = item.Vehicle.Images?.Split(',').ToList() ?? new List<string>(),
          Specifications = item.Vehicle.Specifications,
          LastRestockDate = item.LastRestockDate
      };
  }
  ```

- [ ] **Implement CreateStockRequestAsync**
  ```csharp
  public async Task<StockRequestDto> CreateStockRequestAsync(CreateStockRequestDto dto, int dealerId, int userId) {
      // Validate vehicle exists
      var vehicle = await _vehicleRepo.GetByIdAsync(dto.VehicleId);
      if (vehicle == null) {
          throw new Exception("Vehicle not found");
      }
      
      var request = new StockRequest {
          VehicleId = dto.VehicleId,
          ConfigId = dto.ConfigId,
          Quantity = dto.Quantity,
          DealerId = dealerId,
          RequestedByUserId = userId,
          RequestDate = DateTime.UtcNow,
          Priority = dto.Priority,
          Status = "Pending",
          Reason = dto.Reason,
          Notes = dto.Notes
      };
      
      var created = await _inventoryRepo.CreateStockRequestAsync(request);
      await _inventoryRepo.SaveChangesAsync();
      
      return MapToStockRequestDto(created);
  }
  ```

- [ ] **Implement ApproveStockRequestAsync**
  ```csharp
  public async Task<StockRequestDto> ApproveStockRequestAsync(int requestId, int managerId) {
      var request = await _inventoryRepo.GetStockRequestByIdAsync(requestId);
      
      if (request == null) {
          throw new Exception("Request not found");
      }
      
      if (request.Status != "Pending") {
          throw new Exception("Only pending requests can be approved");
      }
      
      request.Status = "Approved";
      request.ProcessedByUserId = managerId;
      request.ProcessedDate = DateTime.UtcNow;
      
      await _inventoryRepo.UpdateStockRequestAsync(request);
      await _inventoryRepo.SaveChangesAsync();
      
      return MapToStockRequestDto(request);
  }
  ```

- [ ] **Implement RejectStockRequestAsync**
  ```csharp
  public async Task<StockRequestDto> RejectStockRequestAsync(int requestId, int managerId, string reason) {
      var request = await _inventoryRepo.GetStockRequestByIdAsync(requestId);
      
      if (request == null) {
          throw new Exception("Request not found");
      }
      
      if (request.Status != "Pending") {
          throw new Exception("Only pending requests can be rejected");
      }
      
      request.Status = "Rejected";
      request.ProcessedByUserId = managerId;
      request.ProcessedDate = DateTime.UtcNow;
      request.RejectionReason = reason;
      
      await _inventoryRepo.UpdateStockRequestAsync(request);
      await _inventoryRepo.SaveChangesAsync();
      
      return MapToStockRequestDto(request);
  }
  ```

### Phase 1.4: Testing ⏳
- [ ] Test `GET /api/Inventory/dealer/{dealerId}` với Postman
- [ ] Test `GET /api/Inventory/dealer/{dealerId}/item/{inventoryId}`
- [ ] Test `POST /api/Inventory/distributions/requests` (tạo yêu cầu)
- [ ] Test `PUT /api/Inventory/distributions/requests/{id}/approve`
- [ ] Test `PUT /api/Inventory/distributions/requests/{id}/reject`
- [ ] Verify Authorization roles
- [ ] Test với nhiều dealers khác nhau

---

## 🛒 MODULE 2: PURCHASE MANAGEMENT

### Phase 2.1: Kiểm tra & Chuẩn bị ⏳
- [ ] **Review PurchaseRequest Model hiện tại**
  ```csharp
  // File: backend/EVDealer.BE.DAL/Models/PurchaseRequest.cs
  // Kiểm tra xem đã có đầy đủ fields chưa:
  - VehicleId, ConfigId
  - DealerId
  - Quantity
  - Priority
  - Status (Pending, Approved, Rejected, Completed)
  - Notes
  - RequestedBy, ApprovedBy
  ```

- [ ] **Kiểm tra PurchaseRequestsController**
  ```csharp
  // File: backend/EVDealer.BE.API/Controllers/PurchaseRequestsController.cs
  // Endpoints cần có:
  - POST /api/procurement/requests ✅
  - GET /api/procurement/requests/mine ✅
  - GET /api/procurement/requests/pending ✅
  - PUT /api/procurement/requests/{id}/approve ✅
  - PUT /api/procurement/requests/{id}/reject ✅
  ```

### Phase 2.2: Kết nối StockRequest → PurchaseRequest ⏳
- [ ] **Tạo logic chuyển đổi StockRequest → PurchaseRequest**
  ```csharp
  // File: backend/EVDealer.BE.Services/Procurement/PurchaseRequestService.cs
  
  public async Task<PurchaseRequestDto> CreateFromStockRequestAsync(int stockRequestId, int managerId) {
      // 1. Get approved stock request
      var stockRequest = await _stockRequestRepo.GetByIdAsync(stockRequestId);
      
      if (stockRequest == null || stockRequest.Status != "Approved") {
          throw new Exception("Stock request must be approved first");
      }
      
      // 2. Create purchase request
      var purchaseRequest = new PurchaseRequest {
          VehicleId = stockRequest.VehicleId,
          ConfigId = stockRequest.ConfigId,
          DealerId = stockRequest.DealerId,
          Quantity = stockRequest.Quantity,
          Priority = stockRequest.Priority,
          Status = "Pending",
          Notes = $"From Stock Request #{stockRequest.Id}: {stockRequest.Reason}",
          RequestedByUserId = managerId,
          RequestDate = DateTime.UtcNow,
          SourceStockRequestId = stockRequestId // Link back
      };
      
      var created = await _purchaseRequestRepo.CreateAsync(purchaseRequest);
      await _purchaseRequestRepo.SaveChangesAsync();
      
      return MapToPurchaseRequestDto(created);
  }
  ```

- [ ] **Thêm endpoint mới vào PurchaseRequestsController**
  ```csharp
  [HttpPost("from-stock-request/{stockRequestId}")]
  [Authorize(Roles = "DealerManager,Admin")]
  public async Task<IActionResult> CreateFromStockRequest(int stockRequestId) {
      try {
          var managerId = GetUserIdFromClaims();
          var result = await _purchaseService.CreateFromStockRequestAsync(stockRequestId, managerId);
          return Ok(result);
      }
      catch (Exception ex) {
          return BadRequest(new { message = ex.Message });
      }
  }
  ```

### Phase 2.3: Integrate với EVM (Mock) ⏳
- [ ] **Tạo service gửi request tới EVM**
  ```csharp
  // File: backend/EVDealer.BE.Services/Procurement/EVMIntegrationService.cs
  
  public interface IEVMIntegrationService {
      Task<bool> SendPurchaseRequestToEVMAsync(int purchaseRequestId);
  }
  
  public class EVMIntegrationService : IEVMIntegrationService {
      public async Task<bool> SendPurchaseRequestToEVMAsync(int purchaseRequestId) {
          // TODO: Implement actual API call to EVM
          // For now, just mock success
          await Task.Delay(100);
          return true;
      }
  }
  ```

- [ ] **Cập nhật PurchaseRequestService để gọi EVM**
  ```csharp
  public async Task<bool> SendToEVMAsync(int purchaseRequestId, string managerPassword) {
      // 1. Verify manager password
      var managerId = GetCurrentUserId();
      var isValid = await _authService.VerifyPasswordAsync(managerId, managerPassword);
      
      if (!isValid) {
          throw new UnauthorizedException("Invalid password");
      }
      
      // 2. Get purchase request
      var request = await _purchaseRequestRepo.GetByIdAsync(purchaseRequestId);
      if (request == null) {
          throw new Exception("Purchase request not found");
      }
      
      // 3. Send to EVM
      var success = await _evmService.SendPurchaseRequestToEVMAsync(purchaseRequestId);
      
      if (success) {
          request.Status = "Sent";
          request.SentToEVMDate = DateTime.UtcNow;
          await _purchaseRequestRepo.UpdateAsync(request);
          await _purchaseRequestRepo.SaveChangesAsync();
      }
      
      return success;
  }
  ```

### Phase 2.4: Testing ⏳
- [ ] Test flow: StockRequest Approved → Create PurchaseRequest
- [ ] Test `POST /api/procurement/requests/from-stock-request/{id}`
- [ ] Test password verification khi gửi tới EVM
- [ ] Test status transitions: Pending → Approved → Sent → Completed

---

## 💰 MODULE 3: SALES MANAGEMENT (Quotations & Orders)

### Phase 3.1: Quotation Management ⏳
- [ ] **Kiểm tra Quotation Model**
  ```csharp
  // File: backend/EVDealer.BE.DAL/Models/Quotation.cs
  public class Quotation {
      public int QuotationId { get; set; }
      public int CustomerId { get; set; }
      public int VehicleId { get; set; }
      public int DealerId { get; set; }
      public decimal QuotedPrice { get; set; }
      public DateTime ValidUntil { get; set; }
      public string Status { get; set; } // Draft, Sent, Accepted, Rejected, Expired
      public DateTime CreatedDate { get; set; }
      public int CreatedByUserId { get; set; }
      public string? Notes { get; set; }
      
      // Pricing breakdown
      public decimal BasePrice { get; set; }
      public decimal? DiscountAmount { get; set; }
      public int? PromotionId { get; set; }
      public decimal? TaxAmount { get; set; }
      public decimal FinalPrice { get; set; }
      
      // Navigation properties
      public Customer Customer { get; set; }
      public Vehicle Vehicle { get; set; }
      public Dealer Dealer { get; set; }
      public User CreatedBy { get; set; }
      public Promotion? Promotion { get; set; }
  }
  ```

- [ ] **Tạo QuotationController (nếu chưa có)**
  ```csharp
  // File: backend/EVDealer.BE.API/Controllers/QuotationsController.cs
  
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class QuotationsController : ControllerBase {
      private readonly IQuotationService _quotationService;
      
      // GET /api/Quotations/dealer/{dealerId}
      [HttpGet("dealer/{dealerId}")]
      [Authorize(Roles = "DealerStaff,DealerManager")]
      public async Task<IActionResult> GetDealerQuotations(int dealerId, [FromQuery] QuotationQueryDto query) {
          var quotations = await _quotationService.GetDealerQuotationsAsync(dealerId, query);
          return Ok(quotations);
      }
      
      // POST /api/Quotations
      [HttpPost]
      [Authorize(Roles = "DealerStaff,DealerManager")]
      public async Task<IActionResult> CreateQuotation([FromBody] CreateQuotationDto dto) {
          var quotation = await _quotationService.CreateQuotationAsync(dto);
          return CreatedAtAction(nameof(GetQuotationById), new { id = quotation.QuotationId }, quotation);
      }
      
      // PUT /api/Quotations/{id}
      [HttpPut("{id}")]
      [Authorize(Roles = "DealerStaff,DealerManager")]
      public async Task<IActionResult> UpdateQuotation(int id, [FromBody] UpdateQuotationDto dto) {
          var quotation = await _quotationService.UpdateQuotationAsync(id, dto);
          return Ok(quotation);
      }
      
      // POST /api/Quotations/{id}/send
      [HttpPost("{id}/send")]
      [Authorize(Roles = "DealerStaff,DealerManager")]
      public async Task<IActionResult> SendQuotation(int id) {
          await _quotationService.SendQuotationAsync(id);
          return Ok(new { message = "Quotation sent successfully" });
      }
  }
  ```

- [ ] **Implement QuotationService**
  ```csharp
  // File: backend/EVDealer.BE.Services/Quotations/QuotationService.cs
  
  public async Task<QuotationDto> CreateQuotationAsync(CreateQuotationDto dto) {
      // 1. Validate customer and vehicle
      var customer = await _customerRepo.GetByIdAsync(dto.CustomerId);
      var vehicle = await _vehicleRepo.GetByIdAsync(dto.VehicleId);
      
      if (customer == null || vehicle == null) {
          throw new Exception("Customer or Vehicle not found");
      }
      
      // 2. Calculate pricing
      var basePrice = vehicle.BasePrice;
      var discountAmount = 0m;
      
      // Apply promotion if provided
      if (dto.PromotionId.HasValue) {
          var promotion = await _promotionRepo.GetByIdAsync(dto.PromotionId.Value);
          if (promotion != null && promotion.Status == "Active") {
              discountAmount = CalculateDiscount(basePrice, promotion);
          }
      }
      
      var taxAmount = (basePrice - discountAmount) * 0.1m; // 10% VAT
      var finalPrice = basePrice - discountAmount + taxAmount;
      
      // 3. Create quotation
      var quotation = new Quotation {
          CustomerId = dto.CustomerId,
          VehicleId = dto.VehicleId,
          DealerId = dto.DealerId,
          BasePrice = basePrice,
          DiscountAmount = discountAmount,
          PromotionId = dto.PromotionId,
          TaxAmount = taxAmount,
          QuotedPrice = finalPrice,
          FinalPrice = finalPrice,
          ValidUntil = dto.ValidUntil,
          Status = "Draft",
          CreatedDate = DateTime.UtcNow,
          CreatedByUserId = dto.CreatedByUserId,
          Notes = dto.Notes
      };
      
      var created = await _quotationRepo.CreateAsync(quotation);
      await _quotationRepo.SaveChangesAsync();
      
      return MapToQuotationDto(created);
  }
  
  public async Task SendQuotationAsync(int quotationId) {
      var quotation = await _quotationRepo.GetByIdAsync(quotationId);
      
      if (quotation == null) {
          throw new Exception("Quotation not found");
      }
      
      if (quotation.Status != "Draft") {
          throw new Exception("Only draft quotations can be sent");
      }
      
      quotation.Status = "Sent";
      await _quotationRepo.UpdateAsync(quotation);
      await _quotationRepo.SaveChangesAsync();
      
      // TODO: Send email/notification to customer
  }
  ```

### Phase 3.2: Order Management ⏳
- [ ] **Kiểm tra Order Model**
  ```csharp
  // File: backend/EVDealer.BE.DAL/Models/Order.cs
  public class Order {
      public int OrderId { get; set; }
      public int CustomerId { get; set; }
      public int VehicleId { get; set; }
      public int DealerId { get; set; }
      public int? QuotationId { get; set; } // Link to quotation if created from one
      public string Status { get; set; } // Pending, Confirmed, Processing, Completed, Cancelled
      public decimal TotalAmount { get; set; }
      public decimal PaidAmount { get; set; }
      public decimal RemainingAmount { get; set; }
      public DateTime OrderDate { get; set; }
      public DateTime? CompletedDate { get; set; }
      public int CreatedByUserId { get; set; }
      public string? Notes { get; set; }
      
      // Navigation properties
      public Customer Customer { get; set; }
      public Vehicle Vehicle { get; set; }
      public Dealer Dealer { get; set; }
      public Quotation? Quotation { get; set; }
      public User CreatedBy { get; set; }
      public ICollection<Payment> Payments { get; set; }
  }
  ```

- [ ] **Tạo OrdersController (nếu chưa có)**
  ```csharp
  // File: backend/EVDealer.BE.API/Controllers/OrdersController.cs
  
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class OrdersController : ControllerBase {
      private readonly IOrderService _orderService;
      
      // GET /api/Orders/dealer/{dealerId}
      [HttpGet("dealer/{dealerId}")]
      [Authorize(Roles = "DealerStaff,DealerManager")]
      public async Task<IActionResult> GetDealerOrders(int dealerId, [FromQuery] OrderQueryDto query) {
          var orders = await _orderService.GetDealerOrdersAsync(dealerId, query);
          return Ok(orders);
      }
      
      // POST /api/Orders
      [HttpPost]
      [Authorize(Roles = "DealerStaff,DealerManager")]
      public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto) {
          var order = await _orderService.CreateOrderAsync(dto);
          return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, order);
      }
      
      // PUT /api/Orders/{id}/status
      [HttpPut("{id}/status")]
      [Authorize(Roles = "DealerStaff,DealerManager")]
      public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto) {
          await _orderService.UpdateOrderStatusAsync(id, dto.Status);
          return Ok(new { message = "Order status updated" });
      }
      
      // POST /api/Orders/{id}/complete
      [HttpPost("{id}/complete")]
      [Authorize(Roles = "DealerManager")]
      public async Task<IActionResult> CompleteOrder(int id) {
          await _orderService.CompleteOrderAsync(id);
          return Ok(new { message = "Order completed and inventory updated" });
      }
  }
  ```

- [ ] **Implement OrderService với Inventory Integration**
  ```csharp
  // File: backend/EVDealer.BE.Services/Orders/OrderService.cs
  
  public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto) {
      // 1. Validate
      var customer = await _customerRepo.GetByIdAsync(dto.CustomerId);
      var vehicle = await _vehicleRepo.GetByIdAsync(dto.VehicleId);
      
      if (customer == null || vehicle == null) {
          throw new Exception("Customer or Vehicle not found");
      }
      
      // 2. Check inventory availability (don't reserve yet, just check)
      var inventory = await _inventoryRepo.GetDealerInventoryByVehicleAsync(dto.DealerId, dto.VehicleId);
      if (inventory == null || inventory.Quantity < 1) {
          throw new Exception("Vehicle not available in inventory");
      }
      
      // 3. Calculate total amount
      var totalAmount = dto.TotalAmount ?? vehicle.BasePrice;
      
      // 4. Create order
      var order = new Order {
          CustomerId = dto.CustomerId,
          VehicleId = dto.VehicleId,
          DealerId = dto.DealerId,
          QuotationId = dto.QuotationId,
          Status = "Pending",
          TotalAmount = totalAmount,
          PaidAmount = 0,
          RemainingAmount = totalAmount,
          OrderDate = DateTime.UtcNow,
          CreatedByUserId = dto.CreatedByUserId,
          Notes = dto.Notes
      };
      
      var created = await _orderRepo.CreateAsync(order);
      await _orderRepo.SaveChangesAsync();
      
      return MapToOrderDto(created);
  }
  
  public async Task CompleteOrderAsync(int orderId) {
      var order = await _orderRepo.GetByIdAsync(orderId);
      
      if (order == null) {
          throw new Exception("Order not found");
      }
      
      if (order.Status != "Processing") {
          throw new Exception("Only processing orders can be completed");
      }
      
      // CRITICAL: Update inventory when order is completed
      var inventory = await _inventoryRepo.GetDealerInventoryByVehicleAsync(order.DealerId, order.VehicleId);
      
      if (inventory == null || inventory.Quantity < 1) {
          throw new Exception("Insufficient inventory");
      }
      
      // Atomic transaction: Update order status AND decrease inventory
      using (var transaction = await _context.Database.BeginTransactionAsync()) {
          try {
              // Decrease inventory
              inventory.Quantity -= 1;
              inventory.LastUpdated = DateTime.UtcNow;
              await _inventoryRepo.UpdateInventoryItemAsync(inventory);
              
              // Complete order
              order.Status = "Completed";
              order.CompletedDate = DateTime.UtcNow;
              await _orderRepo.UpdateAsync(order);
              
              await _orderRepo.SaveChangesAsync();
              await transaction.CommitAsync();
          }
          catch (Exception ex) {
              await transaction.RollbackAsync();
              throw new Exception($"Failed to complete order: {ex.Message}");
          }
      }
  }
  ```

### Phase 3.3: Payment Integration ⏳
- [ ] **Kiểm tra Payment Model**
- [ ] **Tạo PaymentsController**
- [ ] **Link Payment với Order**
- [ ] **Update Order.PaidAmount khi có payment**

### Phase 3.4: Testing Sales Module ⏳
- [ ] Test create quotation flow
- [ ] Test send quotation to customer
- [ ] Test create order from quotation
- [ ] Test create standalone order
- [ ] **CRITICAL:** Test inventory decrease when order completed
- [ ] Verify inventory NOT changed when quotation created
- [ ] Verify inventory NOT changed when test drive created
- [ ] Test payment recording

---

## 🔗 MODULE 4: INTEGRATION & END-TO-END FLOW

### Phase 4.1: Complete Purchase → Inventory Flow ⏳
- [ ] **Implement EVM order fulfillment callback**
  ```csharp
  // File: backend/EVDealer.BE.API/Controllers/EVMWebhookController.cs
  
  [Route("api/evm-webhook")]
  [ApiController]
  public class EVMWebhookController : ControllerBase {
      [HttpPost("order-fulfilled")]
      public async Task<IActionResult> HandleOrderFulfilled([FromBody] EVMOrderDto dto) {
          // 1. Find purchase request
          var purchaseRequest = await _purchaseService.GetByEVMOrderIdAsync(dto.OrderId);
          
          // 2. Update status
          purchaseRequest.Status = "Completed";
          await _purchaseService.UpdateAsync(purchaseRequest);
          
          // 3. Increase dealer inventory
          await _inventoryService.IncreaseInventoryAsync(
              purchaseRequest.DealerId,
              purchaseRequest.VehicleId,
              purchaseRequest.Quantity
          );
          
          return Ok();
      }
  }
  ```

- [ ] **Implement IncreaseInventoryAsync trong InventoryService**
  ```csharp
  public async Task IncreaseInventoryAsync(int dealerId, int vehicleId, int quantity) {
      var inventory = await _inventoryRepo.GetOrCreateDealerInventoryAsync(dealerId, vehicleId);
      
      inventory.Quantity += quantity;
      inventory.LastRestockDate = DateTime.UtcNow;
      inventory.LastUpdated = DateTime.UtcNow;
      
      await _inventoryRepo.UpdateInventoryItemAsync(inventory);
      await _inventoryRepo.SaveChangesAsync();
  }
  ```

### Phase 4.2: Frontend Integration ⏳
- [ ] **DealerInventory.jsx**: Test connect với `GET /api/Inventory/dealer/{dealerId}`
- [ ] **StockDetail.jsx**: Test connect với `GET /api/Inventory/dealer/{dealerId}/item/{id}`
- [ ] **DistributionList.jsx**: Test connect với `GET /api/Inventory/distributions/requests`
- [ ] **CreatePurchaseRequest.jsx**: Test connect với `POST /api/procurement/requests`
- [ ] **QuotationList.jsx**: Test connect với `GET /api/Quotations/dealer/{dealerId}`
- [ ] **CreateQuotation.jsx**: Test connect với `POST /api/Quotations`
- [ ] **OrderList.jsx**: Test connect với `GET /api/Orders/dealer/{dealerId}`
- [ ] **CreateOrder.jsx**: Test connect với `POST /api/Orders`

### Phase 4.3: Authorization & Security ⏳
- [ ] Verify all endpoints có `[Authorize]`
- [ ] Test role-based access (DealerStaff vs DealerManager)
- [ ] Test dealerId verification từ claims
- [ ] Test cross-dealer data isolation (dealer A không thấy data của dealer B)
- [ ] Implement password verification cho critical actions

### Phase 4.4: Error Handling ⏳
- [ ] Implement global exception handler
- [ ] Consistent error response format
- [ ] Logging cho tất cả operations
- [ ] User-friendly error messages

---

## 🎯 PRIORITY CHECKLIST

### 🔴 HIGH PRIORITY (Làm trước)
- [ ] Inventory: Database models + migrations
- [ ] Inventory: Repository implementation
- [ ] Inventory: Service implementation (GetDealerInventory, StockRequests)
- [ ] Orders: CompleteOrder với inventory decrease logic
- [ ] Test inventory quantity changes

### 🟡 MEDIUM PRIORITY
- [ ] Purchase: Connect StockRequest → PurchaseRequest
- [ ] Purchase: EVM integration (mock)
- [ ] Quotation: Full CRUD operations
- [ ] Orders: Payment integration

### 🟢 LOW PRIORITY (Làm sau)
- [ ] Advanced analytics
- [ ] Reporting features
- [ ] Email notifications
- [ ] PDF generation

---

## 📊 PROGRESS TRACKING

### Module Status
- ✅ Test Drive: COMPLETE
- ⏳ Inventory: 0% - DTOs created, endpoints stubbed
- ⏳ Purchase: 0% - Controller exists, needs integration
- ⏳ Sales (Quotation): 0% - Needs full implementation
- ⏳ Sales (Order): 0% - Needs inventory integration

### Overall Progress: 20% Complete

---

## 🚀 QUICK START GUIDE

### Bắt đầu làm việc:
1. **Start with Inventory Phase 1.1** - Create database models
2. **Run migration** to create tables
3. **Implement Repository Layer** (Phase 1.2)
4. **Implement Service Layer** (Phase 1.3)
5. **Test endpoints** (Phase 1.4)
6. **Move to Purchase Module** (Phase 2)
7. **Continue with Sales Module** (Phase 3)

### Testing Strategy:
- Unit tests cho Service layer
- Integration tests cho API endpoints
- End-to-end tests cho critical flows
- Manual testing với Postman cho mỗi endpoint

---

**Last Updated:** November 20, 2025  
**Status:** 📋 Ready for Implementation
