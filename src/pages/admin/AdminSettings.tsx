import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Shield, X, Check } from 'lucide-react';
import LoginActivityLog from '@/components/LoginActivityLog';

export const AdminSettings = () => {
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@dubai.com');

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Settings</h2>
      <div className="bg-card rounded-xl p-6 border border-border shadow-luxury-card space-y-8">
        
        {/* Admin Profile Section */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-6">Admin Profile</h3>
          <div className="flex items-end gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full border-2 border-primary/30 bg-secondary flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-muted-foreground" />
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfilePicture(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <span className="text-xs font-semibold text-primary hover:text-primary/80 cursor-pointer">
                  Upload Photo
                </span>
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Admin Name</label>
                <input defaultValue="Admin" className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Admin Email</label>
                <input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
            <Shield size={16} className="text-primary" /> Security
          </h3>
          <div className="bg-secondary/30 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Two-Factor Authentication (Email OTP)</p>
              <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your admin account</p>
            </div>
            <label className="cursor-pointer flex items-center gap-3">
              <div className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${twoFactorEnabled ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform duration-300 ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={e => setTwoFactorEnabled(e.target.checked)}
                className="hidden"
              />
            </label>
          </div>
          {twoFactorEnabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg"
            >
              <p className="text-xs text-primary font-semibold">✓ 2FA Enabled</p>
              <p className="text-xs text-muted-foreground mt-1">You will receive a 6-digit OTP via email when logging in to the admin panel.</p>
            </motion.div>
          )}
        </div>

        {/* Change Password Section */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-4">Change Password</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className={`w-full px-3 py-2.5 bg-muted border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                  newPassword && confirmPassword && newPassword !== confirmPassword
                    ? 'border-destructive focus:ring-destructive/30'
                    : 'border-border focus:ring-primary/30'
                }`}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2.5 bg-muted border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                  newPassword && confirmPassword && newPassword !== confirmPassword
                    ? 'border-destructive focus:ring-destructive/30'
                    : 'border-border focus:ring-primary/30'
                }`}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Password Validation Error */}
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2"
            >
              <X size={16} className="text-destructive flex-shrink-0" />
              <p className="text-xs text-destructive font-semibold">Passwords do not match</p>
            </motion.div>
          )}

          {/* Password Match Success */}
          {newPassword && confirmPassword && newPassword === confirmPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-2"
            >
              <Check size={16} className="text-primary flex-shrink-0" />
              <p className="text-xs text-primary font-semibold">Passwords match</p>
            </motion.div>
          )}
        </div>

        {/* Save Button */}
        <button
          disabled={newPassword && confirmPassword && newPassword !== confirmPassword || false}
          className={`btn-premium px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
            newPassword && confirmPassword && newPassword !== confirmPassword
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          Save Settings
        </button>

        {/* Login Activity Log Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-6">Login Security Logs</h3>
          <LoginActivityLog email={adminEmail} />
        </div>
      </div>
    </div>
  );
};
