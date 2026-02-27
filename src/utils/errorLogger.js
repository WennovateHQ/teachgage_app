/**
 * Frontend Error Logger
 * Provides detailed error logging for debugging
 */

export const logError = (context, error, additionalInfo = {}) => {
  console.error('\n========== FRONTEND ERROR ==========');
  console.error('Context:', context);
  console.error('Timestamp:', new Date().toISOString());
  console.error('Error Message:', error.message);
  console.error('Error Name:', error.name);
  
  if (error.response) {
    console.error('Response Status:', error.response.status);
    console.error('Response Data:', error.response.data);
    console.error('Response Headers:', error.response.headers);
  }
  
  if (error.request) {
    console.error('Request URL:', error.config?.url);
    console.error('Request Method:', error.config?.method);
    console.error('Request Data:', error.config?.data);
  }
  
  if (additionalInfo && Object.keys(additionalInfo).length > 0) {
    console.error('Additional Info:', additionalInfo);
  }
  
  console.error('Stack Trace:', error.stack);
  console.error('====================================\n');
};

export const logApiCall = (method, url, data = null) => {
  console.log('\n========== API CALL ==========');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', method);
  console.log('URL:', url);
  if (data) {
    console.log('Request Data:', JSON.stringify(data, null, 2));
  }
  console.log('==============================\n');
};

export const logApiResponse = (url, status, data) => {
  console.log('\n========== API RESPONSE ==========');
  console.log('Timestamp:', new Date().toISOString());
  console.log('URL:', url);
  console.log('Status:', status);
  console.log('Response Data:', JSON.stringify(data, null, 2));
  console.log('==================================\n');
};
