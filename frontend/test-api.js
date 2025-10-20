// Test API service
import { dashboardAPI } from './services/api.js';

console.log('Testing API...');

dashboardAPI.getDealerStats()
  .then(response => {
    console.log('✅ getDealerStats SUCCESS:', response);
  })
  .catch(error => {
    console.error('❌ getDealerStats ERROR:', error);
  });

dashboardAPI.getEvmStats()
  .then(response => {
    console.log('✅ getEvmStats SUCCESS:', response);
  })
  .catch(error => {
    console.error('❌ getEvmStats ERROR:', error);
  });

dashboardAPI.getReportStats()
  .then(response => {
    console.log('✅ getReportStats SUCCESS:', response);
  })
  .catch(error => {
    console.error('❌ getReportStats ERROR:', error);
  });