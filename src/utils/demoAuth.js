// Demo authentication utility for quick testing
import { demoUsers } from '../data/demoData'

export const createDemoSession = (userType = 'basic') => {
  let user;
  
  switch (userType) {
    case 'basic':
      user = demoUsers.basicInstructors[0];
      break;
    case 'professional':
      user = demoUsers.professionalInstructors[0];
      break;
    case 'organization':
      user = demoUsers.organizationAdmins[0];
      break;
    default:
      user = demoUsers.basicInstructors[0];
  }

  if (user) {
    // Set localStorage items that AuthContext expects
    localStorage.setItem('teachgage_token', 'demo-token-' + Date.now());
    localStorage.setItem('teachgage_refresh_token', 'demo-refresh-token-' + Date.now());
    localStorage.setItem('teachgage_user_id', user.id);
    
    // Reload the page to trigger AuthContext initialization
    window.location.reload();
  }
};

export const clearDemoSession = () => {
  localStorage.removeItem('teachgage_token');
  localStorage.removeItem('teachgage_refresh_token');
  localStorage.removeItem('teachgage_user_id');
  window.location.reload();
};

// Add demo login buttons to any page for quick testing
export const addDemoLoginButtons = () => {
  if (typeof window === 'undefined') return;
  
  const existingPanel = document.getElementById('demo-login-panel');
  if (existingPanel) return;
  
  const panel = document.createElement('div');
  panel.id = 'demo-login-panel';
  panel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: white;
    border: 2px solid #3B82F6;
    border-radius: 8px;
    padding: 16px;
    z-index: 9999;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  panel.innerHTML = `
    <div style="margin-bottom: 12px; font-weight: bold; color: #1E40AF;">Demo Login</div>
    <button onclick="window.createDemoSession('basic')" style="display: block; width: 100%; margin-bottom: 8px; padding: 8px; background: #3B82F6; color: white; border: none; border-radius: 4px; cursor: pointer;">Basic User</button>
    <button onclick="window.createDemoSession('professional')" style="display: block; width: 100%; margin-bottom: 8px; padding: 8px; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer;">Professional User</button>
    <button onclick="window.createDemoSession('organization')" style="display: block; width: 100%; margin-bottom: 8px; padding: 8px; background: #7C3AED; color: white; border: none; border-radius: 4px; cursor: pointer;">Organization Admin</button>
    <button onclick="window.clearDemoSession()" style="display: block; width: 100%; padding: 8px; background: #DC2626; color: white; border: none; border-radius: 4px; cursor: pointer;">Logout</button>
  `;
  
  document.body.appendChild(panel);
  
  // Make functions globally available
  window.createDemoSession = createDemoSession;
  window.clearDemoSession = clearDemoSession;
};
