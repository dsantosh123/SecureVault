import React from 'react';
import { Search, Download, ChevronDown, CheckCircle, XCircle, Eye, LogIn, LogOut, Settings, AlertTriangle } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminEmail: string;
  actionType: string;
  targetId: string;
  targetType: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

interface AuditLogTableProps {
  logs: AuditLog[];
  onExport?: () => void;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, onExport }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [filterType, setFilterType] = React.useState<string>('all');

  const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    LOGIN: LogIn,
    LOGOUT: LogOut,
    APPROVE_VERIFICATION: CheckCircle,
    REJECT_VERIFICATION: XCircle,
    VIEW_DOCUMENT: Eye,
    SYSTEM_CONFIG: Settings,
    REQUEST_DOCS: AlertTriangle,
  };

  const actionColors: Record<string, string> = {
    LOGIN: 'text-blue-600 bg-blue-50',
    LOGOUT: 'text-gray-600 bg-gray-50',
    APPROVE_VERIFICATION: 'text-green-600 bg-green-50',
    REJECT_VERIFICATION: 'text-red-600 bg-red-50',
    VIEW_DOCUMENT: 'text-purple-600 bg-purple-50',
    SYSTEM_CONFIG: 'text-yellow-600 bg-yellow-50',
    REQUEST_DOCS: 'text-orange-600 bg-orange-50',
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || log.actionType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (actionType: string) => {
    const Icon = actionIcons[actionType] || AlertTriangle;
    return Icon;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Audit Logs</h2>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
        </div>

        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by admin, action, or target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="APPROVE_VERIFICATION">Approve</option>
            <option value="REJECT_VERIFICATION">Reject</option>
            <option value="VIEW_DOCUMENT">View Document</option>
            <option value="SYSTEM_CONFIG">System Config</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.map((log) => {
              const Icon = getActionIcon(log.actionType);
              const isExpanded = expandedRow === log.id;

              return (
                <React.Fragment key={log.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{log.adminEmail}</div>
                      <div className="text-xs text-gray-500">{log.adminId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${actionColors[log.actionType] || 'text-gray-600 bg-gray-50'}`}>
                        <Icon className="w-3 h-3" />
                        {log.actionType.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{log.targetType}</div>
                      <div className="text-xs text-gray-500">{log.targetId}</div>
                    </td>
                    <td className="px-6 py-4">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-full">
                          <XCircle className="w-3 h-3" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        View
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Details:</span> {log.details}</div>
                          <div><span className="font-medium">IP Address:</span> {log.ipAddress}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {filteredLogs.length} of {logs.length} logs
        </p>
      </div>
    </div>
  );
};

// Demo Component
const Demo = () => {
  const sampleLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-01-15T14:32:18Z',
      adminId: 'ADMIN-001',
      adminEmail: 'john@securevault-admin.com',
      actionType: 'APPROVE_VERIFICATION',
      targetId: 'VER-789',
      targetType: 'Verification',
      details: 'Approved nominee verification for User U-123. Death certificate verified.',
      ipAddress: '192.168.1.100',
      status: 'success',
    },
    {
      id: '2',
      timestamp: '2024-01-15T14:20:05Z',
      adminId: 'ADMIN-001',
      adminEmail: 'john@securevault-admin.com',
      actionType: 'VIEW_DOCUMENT',
      targetId: 'DOC-456',
      targetType: 'Death Certificate',
      details: 'Viewed death certificate for verification VER-789',
      ipAddress: '192.168.1.100',
      status: 'success',
    },
    {
      id: '3',
      timestamp: '2024-01-15T13:45:22Z',
      adminId: 'ADMIN-002',
      adminEmail: 'sarah@securevault-admin.com',
      actionType: 'REJECT_VERIFICATION',
      targetId: 'VER-788',
      targetType: 'Verification',
      details: 'Rejected verification - certificate could not be verified',
      ipAddress: '192.168.1.101',
      status: 'success',
    },
    {
      id: '4',
      timestamp: '2024-01-15T13:30:10Z',
      adminId: 'ADMIN-001',
      adminEmail: 'john@securevault-admin.com',
      actionType: 'LOGIN',
      targetId: 'ADMIN-001',
      targetType: 'Admin',
      details: 'Admin logged in successfully',
      ipAddress: '192.168.1.100',
      status: 'success',
    },
    {
      id: '5',
      timestamp: '2024-01-15T12:15:33Z',
      adminId: 'ADMIN-003',
      adminEmail: 'mike@securevault-admin.com',
      actionType: 'SYSTEM_CONFIG',
      targetId: 'CONFIG-001',
      targetType: 'System Settings',
      details: 'Updated verification timeout to 90 days',
      ipAddress: '192.168.1.102',
      status: 'success',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Audit Log Table
          </h1>
          <p className="text-gray-600">
            Immutable audit trail of all admin actions
          </p>
        </div>

        <AuditLogTable 
          logs={sampleLogs}
          onExport={() => alert('Exporting logs to CSV...')}
        />
      </div>
    </div>
  );
};

export default Demo;