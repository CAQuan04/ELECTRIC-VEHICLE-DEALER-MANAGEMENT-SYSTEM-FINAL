-- Migration: AddStockRequestAndDealerInventory
-- Created: 2025-11-20

-- Create StockRequest Table
CREATE TABLE [dbo].[StockRequest] (
    [stock_request_id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [vehicle_id] INT NOT NULL,
    [config_id] INT NULL,
    [quantity] INT NOT NULL,
    [dealer_id] INT NOT NULL,
    [requested_by_user_id] INT NOT NULL,
    [request_date] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [priority] NVARCHAR(20) NOT NULL DEFAULT 'Normal',
    [status] NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    [reason] NVARCHAR(500) NOT NULL,
    [notes] NVARCHAR(MAX) NULL,
    [rejection_reason] NVARCHAR(500) NULL,
    [processed_date] DATETIME2 NULL,
    [processed_by_user_id] INT NULL,
    
    CONSTRAINT FK_StockRequest_Vehicle FOREIGN KEY ([vehicle_id]) REFERENCES [Vehicle]([vehicle_id]),
    CONSTRAINT FK_StockRequest_VehicleConfig FOREIGN KEY ([config_id]) REFERENCES [VehicleConfig]([config_id]),
    CONSTRAINT FK_StockRequest_Dealer FOREIGN KEY ([dealer_id]) REFERENCES [Dealer]([dealer_id]),
    CONSTRAINT FK_StockRequest_RequestedByUser FOREIGN KEY ([requested_by_user_id]) REFERENCES [User]([user_id]),
    CONSTRAINT FK_StockRequest_ProcessedByUser FOREIGN KEY ([processed_by_user_id]) REFERENCES [User]([user_id])
);

-- Create DealerInventory Table
CREATE TABLE [dbo].[DealerInventory] (
    [dealer_inventory_id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [vehicle_id] INT NOT NULL,
    [dealer_id] INT NOT NULL,
    [color] NVARCHAR(50) NOT NULL,
    [quantity] INT NOT NULL,
    [status] NVARCHAR(20) NOT NULL DEFAULT 'Available',
    [last_restock_date] DATETIME2 NULL,
    [last_updated] DATETIME2 NULL DEFAULT GETDATE(),
    [config_id] INT NULL,
    
    CONSTRAINT FK_DealerInventory_Vehicle FOREIGN KEY ([vehicle_id]) REFERENCES [Vehicle]([vehicle_id]),
    CONSTRAINT FK_DealerInventory_Dealer FOREIGN KEY ([dealer_id]) REFERENCES [Dealer]([dealer_id]),
    CONSTRAINT FK_DealerInventory_VehicleConfig FOREIGN KEY ([config_id]) REFERENCES [VehicleConfig]([config_id])
);

-- Add indexes for better query performance
CREATE INDEX IX_StockRequest_DealerId ON [StockRequest]([dealer_id]);
CREATE INDEX IX_StockRequest_Status ON [StockRequest]([status]);
CREATE INDEX IX_StockRequest_RequestDate ON [StockRequest]([request_date] DESC);

CREATE INDEX IX_DealerInventory_DealerId ON [DealerInventory]([dealer_id]);
CREATE INDEX IX_DealerInventory_VehicleId ON [DealerInventory]([vehicle_id]);
CREATE INDEX IX_DealerInventory_DealerId_VehicleId ON [DealerInventory]([dealer_id], [vehicle_id]);

-- Update PurchaseRequest table to add new columns
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PurchaseRequest') AND name = 'requested_by_user_id')
BEGIN
    ALTER TABLE [PurchaseRequest] ADD [requested_by_user_id] INT NULL;
    ALTER TABLE [PurchaseRequest] ADD CONSTRAINT FK_PurchaseRequest_RequestedByUser 
        FOREIGN KEY ([requested_by_user_id]) REFERENCES [User]([user_id]);
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PurchaseRequest') AND name = 'priority')
BEGIN
    ALTER TABLE [PurchaseRequest] ADD [priority] NVARCHAR(20) NULL;
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PurchaseRequest') AND name = 'notes')
BEGIN
    ALTER TABLE [PurchaseRequest] ADD [notes] NVARCHAR(MAX) NULL;
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PurchaseRequest') AND name = 'source_stock_request_id')
BEGIN
    ALTER TABLE [PurchaseRequest] ADD [source_stock_request_id] INT NULL;
    ALTER TABLE [PurchaseRequest] ADD CONSTRAINT FK_PurchaseRequest_StockRequest 
        FOREIGN KEY ([source_stock_request_id]) REFERENCES [StockRequest]([stock_request_id]);
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PurchaseRequest') AND name = 'sent_to_evm_date')
BEGIN
    ALTER TABLE [PurchaseRequest] ADD [sent_to_evm_date] DATETIME2 NULL;
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PurchaseRequest') AND name = 'evm_order_id')
BEGIN
    ALTER TABLE [PurchaseRequest] ADD [evm_order_id] NVARCHAR(100) NULL;
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PurchaseRequest') AND name = 'completed_date')
BEGIN
    ALTER TABLE [PurchaseRequest] ADD [completed_date] DATETIME2 NULL;
END;

PRINT 'Migration AddStockRequestAndDealerInventory completed successfully';
