// Utility functions for admin authentication security

export const getBrowserInfo = (): string => {
  const ua = navigator.userAgent;
  
  // Detect browser
  let browser = 'Unknown';
  let device = navigator.deviceMemory ? `${navigator.deviceMemory}GB RAM` : 'Unknown Device';

  if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (ua.indexOf('Safari') > -1) browser = 'Safari';
  else if (ua.indexOf('Edge') > -1) browser = 'Edge';
  
  // Detect OS
  let os = 'Unknown OS';
  if (ua.indexOf('Windows') > -1) os = 'Windows';
  else if (ua.indexOf('Mac') > -1) os = 'macOS';
  else if (ua.indexOf('Linux') > -1) os = 'Linux';
  else if (ua.indexOf('Android') > -1) os = 'Android';
  else if (ua.indexOf('iPhone') > -1) os = 'iOS';

  return `${browser} on ${os}`;
};

export const getIPAddress = (): string => {
  // Mock implementation - in production, use a real IP detection service
  // You could use services like:
  // - ipapi.co
  // - ipifyapi.com
  // - geoip-db.com
  
  const mockIPs = [
    '192.168.1.1',
    '192.168.1.100',
    '10.0.0.1',
    '203.0.113.42',
    '198.51.100.50',
  ];

  // For demo, return a mock IP
  // In production, fetch from geolocation API
  return mockIPs[Math.floor(Math.random() * mockIPs.length)];
};

export const getLocation = (ipAddress?: string): string => {
  // Mock implementation - in production, use a real geolocation service
  const mockLocations: { [key: string]: string } = {
    '192.168.1.1': 'Home Network, IN',
    '192.168.1.100': 'Office Network, IN',
    '10.0.0.1': 'Internal Network, IN',
    '203.0.113.42': 'Dubai, AE',
    '198.51.100.50': 'London, GB',
  };

  // Return mock location based on IP or default
  if (ipAddress && mockLocations[ipAddress]) {
    return mockLocations[ipAddress];
  }

  const defaultLocations = ['Home Network, IN', 'Office Network, IN', 'Dubai, AE'];
  return defaultLocations[Math.floor(Math.random() * defaultLocations.length)];
};

export const getDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'unknown-device';

  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('Browser Fingerprint', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('Browser Fingerprint', 4, 17);

  const fingerprint = canvas.toDataURL();
  return fingerprint.substring(0, 32); // Return hash prefix
};

export const formatLoginTime = (date: Date): string => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export const getTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const remaining = expiresAt.getTime() - now.getTime();

  if (remaining <= 0) {
    return 'Expired';
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${seconds}s`;
};

export const isOTPExpired = (expiresAt: Date | null): boolean => {
  if (!expiresAt) return true;
  return new Date() > expiresAt;
};

export const getMinutesUntilUnlock = (unlockTime: Date): number => {
  const remaining = unlockTime.getTime() - new Date().getTime();
  return Math.ceil(remaining / 60000);
};
