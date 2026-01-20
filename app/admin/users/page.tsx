'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Calendar, Activity, Clock, Shield, AlertCircle, CheckCircle, XCircle, TrendingUp, Users, FileText, X, ChevronDown } from 'lucide-react';

// Types
interface UserRecord {
  id: string;
  userId: string;
  registrationDate: string;
  lastLogin: string;
  inactivityPeriod: number;
  status: 'ACTIVE' | 'INACTIVE_TRIGGERED' | 'RELEASE_IN_PROGRESS' | 'CLOSED';
  assetsCount: number;
  nomineesCount: number;
  activityTimeline: ActivityEvent[];
  verificationRequests: VerificationRequest[];
}

interface ActivityEvent {
  id: string;
  date: string;
  action: string;
  details: string;
  icon: string;
}

interface VerificationRequest {
  nomineeId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_STARTED';
}

// Mock Data Generator
const generateMockUsers = (): UserRecord[] => {
  const statuses: UserRecord['status'][] = ['ACTIVE', 'INACTIVE_TRIGGERED', 'RELEASE_IN_PROGRESS', 'CLOSED'];
  const inactivityPeriods = [30, 90, 180, 365];
  const actions = [
    { action: 'LOGIN', details: 'User logged in', icon: '🔐' },
    { action: 'ASSET_ADDED', details: 'Added new cryptocurrency wallet', icon: '💰' },
    { action: 'INACTIVITY_UPDATED', details: 'Updated inactivity period to 180 days', icon: '⏰' },
    { action: 'NOMINEE_ADDED', details: 'Added new nominee', icon: '👤' },
    { action: 'DOCUMENT_UPLOADED', details: 'Uploaded will document', icon: '📄' }
  ];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `user-${i + 1}`,
    userId: `U-${String(100000 + i).slice(-6)}`,
    registrationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    inactivityPeriod: inactivityPeriods[Math.floor(Math.random() * inactivityPeriods.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    assetsCount: Math.floor(Math.random() * 15) + 1,
    nomineesCount: Math.floor(Math.random() * 5) + 1,
    activityTimeline: Array.from({ length: 5 }, (_, j) => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      return {
        id: `${i}-${j}`,
        date: new Date(Date.now() - (j + 1) * 10 * 24 * 60 * 60 * 1000).toISOString(),
        action: randomAction.action,
        details: randomAction.details,
        icon: randomAction.icon
      };
    }),
    verificationRequests: [
      { nomineeId: 'NOM-001', status: Math.random() > 0.5 ? 'APPROVED' : 'PENDING' },
      { nomineeId: 'NOM-002', status: Math.random() > 0.5 ? 'PENDING' : 'REJECTED' },
      { nomineeId: 'NOM-003', status: 'NOT_STARTED' }
    ]
  }));
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [inactivityFilter, setInactivityFilter] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    };
    loadUsers();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.userId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (inactivityFilter !== 'ALL') {
      filtered = filtered.filter(user => user.inactivityPeriod === parseInt(inactivityFilter));
    }

    setFilteredUsers(filtered);
  }, [searchQuery, statusFilter, inactivityFilter, users]);

  // Get status config
  const getStatusConfig = (status: UserRecord['status']) => {
    const configs = {
      ACTIVE: { 
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', 
        text: 'text-emerald-700 dark:text-emerald-300', 
        border: 'border-emerald-500/30',
        icon: CheckCircle, 
        label: 'Active',
        dot: 'bg-emerald-500'
      },
      INACTIVE_TRIGGERED: { 
        bg: 'bg-amber-500/10 dark:bg-amber-500/20', 
        text: 'text-amber-700 dark:text-amber-300', 
        border: 'border-amber-500/30',
        icon: Clock, 
        label: 'Inactive Triggered',
        dot: 'bg-amber-500'
      },
      RELEASE_IN_PROGRESS: { 
        bg: 'bg-rose-500/10 dark:bg-rose-500/20', 
        text: 'text-rose-700 dark:text-rose-300', 
        border: 'border-rose-500/30',
        icon: AlertCircle, 
        label: 'Release In Progress',
        dot: 'bg-rose-500'
      },
      CLOSED: { 
        bg: 'bg-slate-500/10 dark:bg-slate-500/20', 
        text: 'text-slate-700 dark:text-slate-300', 
        border: 'border-slate-500/30',
        icon: XCircle, 
        label: 'Closed',
        dot: 'bg-slate-500'
      }
    };
    return configs[status];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Time ago
  const timeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  // Get stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    inactive: users.filter(u => u.status === 'INACTIVE_TRIGGERED').length,
    inProgress: users.filter(u => u.status === 'RELEASE_IN_PROGRESS').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with animated gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Users className="w-10 h-10" />
                  User Activity Monitoring
                </h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Zero-knowledge architecture • Metadata-only access • Full audit logging
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-xs text-blue-100">Total Users</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-emerald-200 dark:border-emerald-800 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Users</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-amber-800 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Inactive</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-rose-200 dark:border-rose-800 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Filtered</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{filteredUsers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by User ID (e.g., U-100001)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Toggle Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Filter className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status Filter</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-slate-100"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">🟢 Active</option>
                    <option value="INACTIVE_TRIGGERED">🟡 Inactive Triggered</option>
                    <option value="RELEASE_IN_PROGRESS">🔴 Release In Progress</option>
                    <option value="CLOSED">⚫ Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Inactivity Period</label>
                  <select
                    value={inactivityFilter}
                    onChange={(e) => setInactivityFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-slate-100"
                  >
                    <option value="ALL">All Periods</option>
                    <option value="30">⏰ 30 days</option>
                    <option value="90">⏰ 90 days</option>
                    <option value="180">⏰ 180 days</option>
                    <option value="365">⏰ 365 days</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                      setInactivityFilter('ALL');
                    }}
                    className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-xl font-medium transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b-2 border-slate-200 dark:border-slate-600">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Registration</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Inactivity</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Assets</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading user records...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">No users found matching your filters</p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('ALL');
                            setInactivityFilter('ALL');
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Clear filters and try again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const config = getStatusConfig(user.status);
                    const Icon = config.icon;
                    return (
                      <tr 
                        key={user.id} 
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {user.userId.split('-')[1].slice(0, 2)}
                            </div>
                            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{user.userId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            {formatDate(user.registrationDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{formatDate(user.lastLogin)}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(user.lastLogin)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg border border-blue-200 dark:border-blue-800">
                            <Clock className="w-3.5 h-3.5" />
                            {user.inactivityPeriod}d
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
                            <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></span>
                            <Icon className="w-3.5 h-3.5" />
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-sm">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="font-bold text-slate-900 dark:text-slate-100">{user.assetsCount}</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <div className="flex items-center gap-1.5 text-sm">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span className="font-bold text-slate-900 dark:text-slate-100">{user.nomineesCount}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredUsers.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredUsers.length}</span> of <span className="font-bold text-slate-900 dark:text-slate-100">{users.length}</span> users
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Shield className="w-4 h-4" />
                Metadata-only • Zero-knowledge
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">🔐 Zero-Knowledge Security Enforced</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Admin Cannot Access:</strong> Asset content, Decrypted data, User credentials, Encryption keys, Video messages. 
                <strong className="ml-2">Admin Can View:</strong> User IDs, Activity metadata, Asset counts, Login timestamps. All actions are logged for compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 flex items-center justify-between border-b border-white/20 z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">User Activity Details</h2>
                  <p className="text-blue-100 font-mono text-sm mt-1">{selectedUser.userId}</p>
                </div>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all group"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                {(() => {
                  const config = getStatusConfig(selectedUser.status);
                  const Icon = config.icon;
                  return (
                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-base font-bold border-2 ${config.bg} ${config.text} ${config.border} shadow-lg`}>
                      <span className={`w-3 h-3 rounded-full ${config.dot} animate-pulse`}></span>
                      <Icon className="w-5 h-5" />
                      {config.label}
                    </div>
                  );
                })()}
              </div>

              {/* User Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User ID</p>
                  </div>
                  <p className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">{selectedUser.userId}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Registration</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{formatDate(selectedUser.registrationDate)}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Last Login</p>
                  </div>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{formatDate(selectedUser.lastLogin)}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{timeAgo(selectedUser.lastLogin)}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Inactivity Period</p>
                  </div>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{selectedUser.inactivityPeriod} days</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Total Assets</p>
                  </div>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-100">{selectedUser.assetsCount} <span className="text-sm font-normal text-amber-600 dark:text-amber-400">(count only)</span></p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Total Nominees</p>
                  </div>
                  <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{selectedUser.nomineesCount}</p>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Activity Timeline
                </h3>
                <div className="space-y-3">
                  {selectedUser.activityTimeline.map((event, idx) => (
                    <div key={event.id} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center text-2xl border border-blue-200 dark:border-blue-800 group-hover:scale-110 transition-transform">
                        {event.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{event.details}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(event.date)}
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          {timeAgo(event.date)}
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Requests */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Verification Requests
                </h3>
                <div className="space-y-3">
                  {selectedUser.verificationRequests.map((request, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center border border-slate-300 dark:border-slate-600">
                          <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <span className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100">{request.nomineeId}</span>
                      </div>
                      <span className={`px-4 py-2 rounded-lg text-xs font-bold border-2 ${
                        request.status === 'APPROVED' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' :
                        request.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700' :
                        request.status === 'REJECTED' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700' :
                        'bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}>
                        {request.status === 'APPROVED' && '✅ '}
                        {request.status === 'PENDING' && '⏳ '}
                        {request.status === 'REJECTED' && '❌ '}
                        {request.status === 'NOT_STARTED' && '⚪ '}
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Warning */}
              <div className="bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-2 border-rose-300 dark:border-rose-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-900 dark:text-rose-100 mb-2">⚠️ Admin Access Restrictions</h4>
                    <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
                      <strong>Cannot:</strong> Log in as user • Change inactivity period • Modify user settings • View asset content • Access encryption keys
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-8 py-5">
              <button
                onClick={() => setShowUserModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}