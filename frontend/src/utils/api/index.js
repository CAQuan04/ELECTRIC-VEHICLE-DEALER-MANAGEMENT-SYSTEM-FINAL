/**
 * API Module Barrel Export
 * Centralized API access point
 */

// API Client
export { default as apiClient } from './client';

// Mock Database
export { CompleteMockAPI } from './database';

// Mock Data
export * from './mock/data';

// Services
export { AdminService, DealerService, CustomerService, dealerAPI } from './services';
