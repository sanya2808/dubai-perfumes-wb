import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, MapPin, Monitor, CheckCircle, XCircle } from 'lucide-react';
import { useAdminAuthSecurity, LoginAttempt } from '@/context/AdminAuthSecurityContext';
import { formatLoginTime } from '@/utils/adminAuthUtils';

const LoginActivityLog: React.FC<{ email: string }> = ({ email }) => {
  const { state } = useAdminAuthSecurity();

  // Filter login history for this email
  const userLoginHistory = state.loginHistory
    .filter(log => log.adminEmail === email)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Get last successful login
  const lastSuccessfulLogin = userLoginHistory.find(log => log.success);

  // Get recent activity (last 10 logins)
  const recentActivity = userLoginHistory.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Security Card */}
      {lastSuccessfulLogin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Security Activity</h3>
                <p className="text-sm text-gray-400">Last login details</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-xs font-semibold text-green-400">
              Secure
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-gray-400">Last Login</p>
                <p className="text-white font-semibold">{formatLoginTime(lastSuccessfulLogin.timestamp)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-gray-400">Location</p>
                <p className="text-white font-semibold">{lastSuccessfulLogin.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Monitor className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-gray-400">Device / Browser</p>
                <p className="text-white font-semibold">{lastSuccessfulLogin.device}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-gray-400">IP Address</p>
                <p className="text-white font-semibold font-mono">{lastSuccessfulLogin.ipAddress}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Login Activity History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-amber-500/20"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          Login Activity History
        </h3>

        {recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-3 text-gray-400 font-semibold">Time</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-semibold">IP Address</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-semibold">Device</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-semibold">Location</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-800 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3 px-3 text-gray-300">
                      <div className="text-xs">{formatLoginTime(log.timestamp)}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {log.success ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-semibold">Success</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 font-semibold">Failed</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-300 font-mono text-xs">{log.ipAddress}</td>
                    <td className="py-3 px-3 text-gray-300 text-xs">{log.device}</td>
                    <td className="py-3 px-3 text-gray-300 text-xs">{log.location}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No login activity recorded yet</p>
          </div>
        )}

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-gray-700">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">Successful Logins</p>
            <p className="text-xl font-bold text-green-400">
              {recentActivity.filter(log => log.success).length}
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">Failed Attempts</p>
            <p className="text-xl font-bold text-red-400">
              {recentActivity.filter(log => !log.success).length}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginActivityLog;
