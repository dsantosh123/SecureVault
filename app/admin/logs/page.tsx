'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, ChevronDown, ChevronUp, Calendar, User, Shield, Clock, CheckCircle, XCircle, AlertCircle, Eye, LogOut, LogIn, FileText, Settings } from 'lucide-react';

// Types
interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminEmail: string;
  actionType: string;
  target: string;
  targetType: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  actionType: string;
  adminId: string;
  status: string;
  search: string;
}

const AuditLogsPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    actionType: '',
    adminId: '',
    status: '',
    search: ''
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLogs: AuditLog[] = [
      {
        id: 'LOG-001',
        timestamp: '2024-01-15T14:32:18Z',
        adminId: 'ADMIN-001',
        adminEmail: 'john@securevault-admin.com',
        actionType: 'APPROVE_VERIFICATION',
        target: 'VER-789',
        targetType: 'VERIFICATION',
        details: {
          nomineeEmail: 'nominee@example.com',
          userId: 'U-123456',
          assetId: 'AST-999',
          adminNotes: 'Certificate verified, identity confirmed'
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120 / Windows',
        status: 'SUCCESS'
      },
      {
        id: 'LOG-002',
        timestamp: '2024-01-15T13:15:42Z',
        adminId: 'ADMIN-002',
        adminEmail: 'sarah@securevault-admin.com',
        actionType: 'REJECT_VERIFICATION',
        target: 'VER-788',
        targetType: 'VERIFICATION',
        details: {
          nomineeEmail: 'another@example.com',
          userId: 'U-123455',
          assetId: 'AST-998',
          reason: 'Invalid death certificate',
          adminNotes: 'Certificate appears to be tampered'
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Firefox 121 / MacOS',
        status: 'SUCCESS'
      },
      {
        id: 'LOG-003',
        timestamp: '2024-01-15T12:08:22Z',
        adminId: 'ADMIN-001',
        adminEmail: 'john@securevault-admin.com',
        actionType: 'VIEW_DOCUMENT',
        target: 'DOC-555',
        targetType: 'DOCUMENT',
        details: {
          documentType: 'DEATH_CERTIFICATE',
          verificationId: 'VER-789'
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120 / Windows',
        status: 'SUCCESS'
      },
      {
        id: 'LOG-004',
        timestamp: '2024-01-15T11:45:10Z',
        adminId: 'ADMIN-001',
        adminEmail: 'john@securevault-admin.com',
        actionType: 'LOGIN',
        target: 'ADMIN-001',
        targetType: 'ADMIN',
        details: {
          loginMethod: 'EMAIL_PASSWORD',
          twoFactorUsed: true
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120 / Windows',
        status: 'SUCCESS'
      },
      {
        id: 'LOG-005',
        timestamp: '2024-01-15T10:22:35Z',
        adminId: 'ADMIN-003',
        adminEmail: 'mike@securevault-admin.com',
        actionType: 'REQUEST_DOCS',
        target: 'VER-787',
        targetType: 'VERIFICATION',
        details: {
          nomineeEmail: 'test@example.com',
          documentsNeeded: ['DEATH_CERTIFICATE', 'ID_PROOF'],
          message: 'Please provide clearer images of the documents'
        },
        ipAddress: '192.168.1.102',
        userAgent: 'Safari 17 / iOS',
        status: 'SUCCESS'
      },
      {
        id: 'LOG-006',
        timestamp: '2024-01-15T09:18:47Z',
        adminId: 'ADMIN-002',
        adminEmail: 'sarah@securevault-admin.com',
        actionType: 'VIEW_USER',
        target: 'U-123456',
        targetType: 'USER',
        details: {
          section: 'ACTIVITY_TIMELINE'
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Firefox 121 / MacOS',
        status: 'SUCCESS'
      },
      {
        id: 'LOG-007',
        timestamp: '2024-01-14T16:55:12Z',
        adminId: 'ADMIN-001',
        adminEmail: 'john@securevault-admin.com',
        actionType: 'SYSTEM_CONFIG',
        target: 'CONFIG-001',
        targetType: 'SYSTEM',
        details: {
          setting: 'VERIFICATION_TIMEOUT',
          oldValue: '30 days',
          newValue: '45 days'
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120 / Windows',
        status: 'SUCCESS'
      },
      {
        id: 'LOG-008',
        timestamp: '2024-01-14T15:30:28Z',
        adminId: 'ADMIN-004',
        adminEmail: 'emma@securevault-admin.com',
        actionType: 'LOGIN',
        target: 'ADMIN-004',
        targetType: 'ADMIN',
        details: {
          loginMethod: 'EMAIL_PASSWORD',
          twoFactorUsed: false,
          failureReason: 'Invalid password'
        },
        ipAddress: '203.45.67.89',
        userAgent: 'Chrome 119 / Windows',
        status: 'FAILED'
      }
    ];

    setTimeout(() => {
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
      setLoading(false);
    }, 800);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...logs];

    if (filters.dateFrom) {
      result = result.filter(log => new Date(log.timestamp) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      result = result.filter(log => new Date(log.timestamp) <= new Date(filters.dateTo));
    }
    if (filters.actionType) {
      result = result.filter(log => log.actionType === filters.actionType);
    }
    if (filters.adminId) {
      result = result.filter(log => log.adminEmail.toLowerCase().includes(filters.adminId.toLowerCase()));
    }
    if (filters.status) {
      result = result.filter(log => log.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(log => 
        log.id.toLowerCase().includes(searchLower) ||
        log.target.toLowerCase().includes(searchLower) ||
        log.adminEmail.toLowerCase().includes(searchLower) ||
        JSON.stringify(log.details).toLowerCase().includes(searchLower)
      );
    }

    setFilteredLogs(result);
  }, [filters, logs]);

  const getActionIcon = (actionType: string) => {
    const icons: Record<string, React.ReactNode> = {
      'LOGIN': <LogIn className="w-4 h-4" />,
      'LOGOUT': <LogOut className="w-4 h-4" />,
      'APPROVE_VERIFICATION': <CheckCircle className="w-4 h-4" />,
      'REJECT_VERIFICATION': <XCircle className="w-4 h-4" />,
      'REQUEST_DOCS': <FileText className="w-4 h-4" />,
      'VIEW_DOCUMENT': <Eye className="w-4 h-4" />,
      'VIEW_USER': <User className="w-4 h-4" />,
      'SYSTEM_CONFIG': <Settings className="w-4 h-4" />
    };
    return icons[actionType] || <AlertCircle className="w-4 h-4" />;
  };

  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      'LOGIN': 'text-blue-600 bg-blue-50',
      'LOGOUT': 'text-gray-600 bg-gray-50',
      'APPROVE_VERIFICATION': 'text-green-600 bg-green-50',
      'REJECT_VERIFICATION': 'text-red-600 bg-red-50',
      'REQUEST_DOCS': 'text-yellow-600 bg-yellow-50',
      'VIEW_DOCUMENT': 'text-purple-600 bg-purple-50',
      'VIEW_USER': 'text-indigo-600 bg-indigo-50',
      'SYSTEM_CONFIG': 'text-orange-600 bg-orange-50'
    };
    return colors[actionType] || 'text-gray-600 bg-gray-50';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'SUCCESS': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'PENDING': 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Admin ID', 'Admin Email', 'Action Type', 'Target', 'Status', 'IP Address', 'Details'];
    const csvData = filteredLogs.map(log => [
      log.timestamp,
      log.adminId,
      log.adminEmail,
      log.actionType,
      log.target,
      log.status,
      log.ipAddress,
      JSON.stringify(log.details)
    ]);

    const csv = [headers, ...csvData].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      actionType: '',
      adminId: '',
      status: '',
      search: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          <p className="text-gray-600">Immutable audit trail • 7-year retention • Read-only access</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((filteredLogs.filter(l => l.status === 'SUCCESS').length / filteredLogs.length) * 100)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Actions</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredLogs.filter(l => l.status === 'FAILED').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Activity</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredLogs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            {/* Search Bar */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, target, admin email, or details..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                  <select
                    value={filters.actionType}
                    onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Actions</option>
                    <option value="LOGIN">Login</option>
                    <option value="LOGOUT">Logout</option>
                    <option value="APPROVE_VERIFICATION">Approve Verification</option>
                    <option value="REJECT_VERIFICATION">Reject Verification</option>
                    <option value="REQUEST_DOCS">Request Documents</option>
                    <option value="VIEW_DOCUMENT">View Document</option>
                    <option value="VIEW_USER">View User</option>
                    <option value="SYSTEM_CONFIG">System Config</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="SUCCESS">Success</option>
                    <option value="FAILED">Failed</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No logs found matching your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div className="text-sm">
                              <div className="text-gray-900 font-medium">{formatDate(log.timestamp)}</div>
                              <div className="text-gray-500">{log.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">{log.adminId}</div>
                            <div className="text-gray-500">{log.adminEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.actionType)}`}>
                            {getActionIcon(log.actionType)}
                            {log.actionType.replace(/_/g, ' ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">{log.target}</div>
                            <div className="text-gray-500">{log.targetType}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.ipAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                          >
                            {expandedLog === log.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {expandedLog === log.id ? 'Hide' : 'Show'}
                          </button>
                        </td>
                      </tr>
                      {expandedLog === log.id && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Details
                                </h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                                  {Object.entries(log.details).map(([key, value]) => (
                                    <div key={key} className="flex">
                                      <span className="text-sm font-medium text-gray-600 w-1/3">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                      <span className="text-sm text-gray-900 w-2/3">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Settings className="w-4 h-4" />
                                  Metadata
                                </h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                                  <div className="flex">
                                    <span className="text-sm font-medium text-gray-600 w-1/3">User Agent:</span>
                                    <span className="text-sm text-gray-900 w-2/3">{log.userAgent}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-sm font-medium text-gray-600 w-1/3">IP Address:</span>
                                    <span className="text-sm text-gray-900 w-2/3">{log.ipAddress}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-sm font-medium text-gray-600 w-1/3">Log ID:</span>
                                    <span className="text-sm text-gray-900 w-2/3">{log.id}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-sm font-medium text-gray-600 w-1/3">Status:</span>
                                    <span className={`text-sm font-semibold w-2/3 ${log.status === 'SUCCESS' ? 'text-green-600' : log.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>
                                      {log.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Security & Compliance</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ All logs are immutable and cannot be edited or deleted</li>
                <li>✓ 7-year retention period for legal compliance</li>
                <li>✓ Encrypted at rest using AES-256</li>
                <li>✓ Export available in CSV and PDF formats</li>
                <li>✓ Real-time logging with millisecond precision</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;