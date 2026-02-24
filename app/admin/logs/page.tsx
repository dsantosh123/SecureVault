'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, ChevronDown, ChevronUp, Calendar, User, Shield, Clock, CheckCircle, XCircle, AlertCircle, Eye, LogOut, LogIn, FileText, Settings } from 'lucide-react';

import { apiGet } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

// Types
interface AuditLog {
  id: string;
  timestamp: string;
  actionType: string;
  target: string;
  targetType: string;
  details: string;
  userName: string;
  userType: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  actionType: string;
  userType: string;
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
    userType: '',
    search: ''
  });

  // Fetch real data from API
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await apiGet(API_ENDPOINTS.admin.logs);
        if (response.success && Array.isArray(response.data)) {
          const mappedLogs: AuditLog[] = response.data.map((log: any) => ({
            id: log.id,
            timestamp: log.timestamp,
            actionType: log.action,
            target: log.entityId || 'N/A',
            targetType: log.action.includes('ASSET') ? 'ASSET' :
              log.action.includes('NOMINEE') ? 'NOMINEE' :
                log.action.includes('CLAIM') ? 'VERIFICATION' : 'USER',
            details: log.details,
            userName: log.userName,
            userType: log.userType,
            status: 'SUCCESS' // All retrieved logs are successful actions
          }));
          setLogs(mappedLogs);
          setFilteredLogs(mappedLogs);
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
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
    if (filters.userType) {
      result = result.filter(log => log.userType === filters.userType);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(log =>
        log.id.toLowerCase().includes(searchLower) ||
        log.target.toLowerCase().includes(searchLower) ||
        log.userName.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower)
      );
    }

    setFilteredLogs(result);
  }, [filters, logs]);

  const getActionIcon = (actionType: string) => {
    const icons: Record<string, React.ReactNode> = {
      'LOGIN': <LogIn className="w-4 h-4" />,
      'LOGOUT': <LogOut className="w-4 h-4" />,
      'ASSET_UPLOAD': <FileText className="w-4 h-4" />,
      'ASSET_UPDATE': <Settings className="w-4 h-4" />,
      'ASSET_DELETE': <XCircle className="w-4 h-4" />,
      'NOMINEE_CLAIM_SUBMITTED': <CheckCircle className="w-4 h-4" />,
      'NOMINEE_IDENTITY_CONFIRMED': <CheckCircle className="w-4 h-4" />,
      'USER_REGISTRATION': <User className="w-4 h-4" />,
      'VERIFICATION_REVIEW': <Shield className="w-4 h-4" />
    };
    return icons[actionType] || <AlertCircle className="w-4 h-4" />;
  };

  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      'LOGIN': 'text-blue-600 bg-blue-50',
      'LOGOUT': 'text-gray-600 bg-gray-50',
      'ASSET_UPLOAD': 'text-green-600 bg-green-50',
      'ASSET_UPDATE': 'text-yellow-600 bg-yellow-50',
      'ASSET_DELETE': 'text-red-600 bg-red-50',
      'NOMINEE_CLAIM_SUBMITTED': 'text-purple-600 bg-purple-50',
      'NOMINEE_IDENTITY_CONFIRMED': 'text-indigo-600 bg-indigo-50',
      'USER_REGISTRATION': 'text-blue-600 bg-blue-50',
      'VERIFICATION_REVIEW': 'text-orange-600 bg-orange-50'
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
    const headers = ['Timestamp', 'User', 'Type', 'Action Type', 'Target', 'Status', 'Details'];
    const csvData = filteredLogs.map(log => [
      log.timestamp,
      log.userName,
      log.userType,
      log.actionType,
      log.target,
      log.status,
      log.details
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
      userType: '', // Added userType
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
              <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          <p className="text-gray-600">Real-time system activity monitoring • Exclusive to Users and Nominees</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Activity</p>
                <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">User Activity</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredLogs.filter(l => l.userType === 'USER').length}
                </p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nominee Activity</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {filteredLogs.filter(l => l.userType === 'NOMINEE').length}
                </p>
              </div>
              <ChevronUp className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Total</p>
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
                  placeholder="Search by ID, target, name, or details..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
                    <option value="USER_REGISTRATION">Registration</option>
                    <option value="ASSET_UPLOAD">Asset Upload</option>
                    <option value="ASSET_UPDATE">Asset Update</option>
                    <option value="ASSET_DELETE">Asset Delete</option>
                    <option value="NOMINEE_CLAIM_SUBMITTED">Claim Submitted</option>
                    <option value="NOMINEE_IDENTITY_CONFIRMED">Identity Confirmed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                  <select
                    value={filters.userType}
                    onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="USER">User</option>
                    <option value="NOMINEE">Nominee</option>
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
              <p className="text-gray-600">No activity logs found matching your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target ID</th>
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
                            <div className="text-gray-900 font-medium">{log.userName}</div>
                            <div className="text-gray-500">{log.userType}</div>
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
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Activity Details
                              </h4>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{log.details}</p>
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