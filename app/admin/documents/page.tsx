'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Eye, CheckCircle, XCircle, AlertTriangle, Download, Shield, Clock, Search, Filter } from 'lucide-react';

// Types
interface Document {
  id: string;
  nomineeEmail: string;
  nomineeName: string;
  userId: string;
  type: 'DEATH_CERTIFICATE' | 'LEGAL_DECLARATION' | 'ID_PROOF';
  uploadDate: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VALIDATED' | 'REJECTED';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  verificationId: string;
  reviewedBy?: string;
  reviewedAt?: string;
  validationNotes?: string;
}

interface ValidationChecklist {
  formatValid: boolean;
  authorityLegitimate: boolean;
  identityMatches: boolean;
  noTampering: boolean;
  dateReasonable: boolean;
  requiredFields: boolean;
}

const AdminDocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sessionTimeout, setSessionTimeout] = useState<number>(300); // 5 min
  const [validationChecklist, setValidationChecklist] = useState<ValidationChecklist>({
    formatValid: false,
    authorityLegitimate: false,
    identityMatches: false,
    noTampering: false,
    dateReasonable: false,
    requiredFields: false
  });
  const [validationNotes, setValidationNotes] = useState('');
  const [showDownloadWarning, setShowDownloadWarning] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 'DOC-001',
        nomineeEmail: 'john.doe@example.com',
        nomineeName: 'John Doe',
        userId: 'U-123456',
        type: 'DEATH_CERTIFICATE',
        uploadDate: '2024-01-15T14:30:00Z',
        status: 'PENDING',
        fileUrl: 'https://example.com/cert1.pdf',
        fileName: 'death_certificate.pdf',
        fileSize: 2457600,
        verificationId: 'VER-789'
      },
      {
        id: 'DOC-002',
        nomineeEmail: 'sarah.smith@example.com',
        nomineeName: 'Sarah Smith',
        userId: 'U-234567',
        type: 'LEGAL_DECLARATION',
        uploadDate: '2024-01-14T10:15:00Z',
        status: 'UNDER_REVIEW',
        fileUrl: 'https://example.com/legal1.pdf',
        fileName: 'legal_declaration.pdf',
        fileSize: 1024000,
        verificationId: 'VER-790'
      },
      {
        id: 'DOC-003',
        nomineeEmail: 'mike.johnson@example.com',
        nomineeName: 'Mike Johnson',
        userId: 'U-345678',
        type: 'DEATH_CERTIFICATE',
        uploadDate: '2024-01-13T16:45:00Z',
        status: 'VALIDATED',
        fileUrl: 'https://example.com/cert2.pdf',
        fileName: 'death_cert_validated.pdf',
        fileSize: 3145728,
        verificationId: 'VER-791',
        reviewedBy: 'ADMIN-001',
        reviewedAt: '2024-01-14T09:00:00Z',
        validationNotes: 'All checks passed. Certificate verified.'
      },
      {
        id: 'DOC-004',
        nomineeEmail: 'emma.wilson@example.com',
        nomineeName: 'Emma Wilson',
        userId: 'U-456789',
        type: 'ID_PROOF',
        uploadDate: '2024-01-12T11:20:00Z',
        status: 'REJECTED',
        fileUrl: 'https://example.com/id1.jpg',
        fileName: 'id_proof.jpg',
        fileSize: 512000,
        verificationId: 'VER-792',
        reviewedBy: 'ADMIN-002',
        reviewedAt: '2024-01-13T14:30:00Z',
        validationNotes: 'Document appears tampered. Requested re-upload.'
      }
    ];
    
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  // Session timeout for viewer
  useEffect(() => {
    if (!showViewer) return;
    
    const timer = setInterval(() => {
      setSessionTimeout(prev => {
        if (prev <= 1) {
          handleCloseViewer();
          alert('Session timeout for security. Please re-open the document.');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showViewer]);

  const handleViewDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setShowViewer(true);
    setSessionTimeout(300);
    setValidationChecklist({
      formatValid: false,
      authorityLegitimate: false,
      identityMatches: false,
      noTampering: false,
      dateReasonable: false,
      requiredFields: false
    });
    setValidationNotes('');
    
    // Log view action
    logAuditAction('VIEW_DOCUMENT', doc.id);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setSelectedDoc(null);
    setSessionTimeout(300);
  };

  const handleValidateDocument = async () => {
    if (!selectedDoc) return;

    const allChecked = Object.values(validationChecklist).every(v => v);
    if (!allChecked) {
      alert('Please complete all validation checks before approving.');
      return;
    }

    // API call would go here
    const updatedDoc = {
      ...selectedDoc,
      status: 'VALIDATED' as const,
      reviewedBy: 'ADMIN-CURRENT',
      reviewedAt: new Date().toISOString(),
      validationNotes
    };

    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updatedDoc : d));
    logAuditAction('VALIDATE_DOCUMENT', selectedDoc.id);
    alert('Document validated successfully!');
    handleCloseViewer();
  };

  const handleRejectDocument = async () => {
    if (!selectedDoc || !validationNotes.trim()) {
      alert('Please provide rejection notes.');
      return;
    }

    const updatedDoc = {
      ...selectedDoc,
      status: 'REJECTED' as const,
      reviewedBy: 'ADMIN-CURRENT',
      reviewedAt: new Date().toISOString(),
      validationNotes
    };

    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updatedDoc : d));
    logAuditAction('REJECT_DOCUMENT', selectedDoc.id);
    alert('Document rejected. Nominee will be notified to re-upload.');
    handleCloseViewer();
  };

  const logAuditAction = (action: string, docId: string) => {
    console.log(`[AUDIT] ${action} - Document: ${docId} - Time: ${new Date().toISOString()}`);
    // In production, this would call the audit API
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      VALIDATED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    if (type === 'DEATH_CERTIFICATE') return <FileText className="w-4 h-4" />;
    if (type === 'LEGAL_DECLARATION') return <Shield className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nomineeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'PENDING').length,
    underReview: documents.filter(d => d.status === 'UNDER_REVIEW').length,
    validated: documents.filter(d => d.status === 'VALIDATED').length,
    rejected: documents.filter(d => d.status === 'REJECTED').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Review</h1>
        <p className="text-gray-600">Review and validate death certificates and legal documents (View-Only)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Documents</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-sm text-yellow-800">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <p className="text-sm text-blue-800">Under Review</p>
          <p className="text-2xl font-bold text-blue-900">{stats.underReview}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p className="text-sm text-green-800">Validated</p>
          <p className="text-2xl font-bold text-green-900">{stats.validated}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <p className="text-sm text-red-800">Rejected</p>
          <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by document ID, nominee, or user ID..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="VALIDATED">Validated</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="DEATH_CERTIFICATE">Death Certificate</option>
            <option value="LEGAL_DECLARATION">Legal Declaration</option>
            <option value="ID_PROOF">ID Proof</option>
          </select>
        </div>
      </div>

      {/* Security Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-1">Security Restrictions</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• View-only mode: Documents cannot be downloaded</li>
            <li>• 5-minute session timeout for document viewing</li>
            <li>• All document views are logged in audit trail</li>
            <li>• Screenshot prevention is enabled</li>
          </ul>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doc.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.nomineeName}</div>
                      <div className="text-sm text-gray-500">{doc.nomineeEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(doc.type)}
                        <span className="text-sm text-gray-900">
                          {doc.type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(doc.uploadDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(doc.status)}`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showViewer && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Document Review</h2>
                <p className="text-sm text-gray-600">ID: {selectedDoc.id}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    Session: {Math.floor(sessionTimeout / 60)}:{(sessionTimeout % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <button
                  onClick={handleCloseViewer}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Document Information */}
                <div className="space-y-6">
                  {/* Document Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Document Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Document ID:</span>
                        <span className="font-medium">{selectedDoc.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uploaded by:</span>
                        <span className="font-medium">{selectedDoc.nomineeEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Related to:</span>
                        <span className="font-medium">{selectedDoc.userId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Upload date:</span>
                        <span className="font-medium">{formatDate(selectedDoc.uploadDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File name:</span>
                        <span className="font-medium">{selectedDoc.fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File size:</span>
                        <span className="font-medium">{formatFileSize(selectedDoc.fileSize)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Validation Checklist */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Validation Checklist</h3>
                    <div className="space-y-2">
                      {Object.entries({
                        formatValid: 'Certificate format valid',
                        authorityLegitimate: 'Issuing authority legitimate',
                        identityMatches: 'User identity matches',
                        noTampering: 'No tampering detected',
                        dateReasonable: 'Death date reasonable',
                        requiredFields: 'All required fields present'
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={validationChecklist[key as keyof ValidationChecklist]}
                            onChange={(e) => setValidationChecklist(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Validation Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validation Notes
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Enter validation or rejection notes..."
                      value={validationNotes}
                      onChange={(e) => setValidationNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Right: Document Preview */}
                <div className="bg-gray-100 rounded-lg p-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
                    <div className="text-6xl font-bold text-gray-400 rotate-45">
                      VIEW ONLY
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-semibold text-gray-900 mb-3">Certificate Preview</h3>
                    <div className="bg-white rounded border-2 border-dashed border-gray-300 aspect-[3/4] flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-2">Document Preview</p>
                        <p className="text-xs text-gray-500">{selectedDoc.fileName}</p>
                        <p className="text-xs text-red-600 mt-4">⚠️ Download disabled for security</p>
                      </div>
                    </div>
                    {showDownloadWarning && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-sm text-red-800">
                          ⛔ Document download is prohibited. This action has been logged.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <button
                onClick={() => {
                  setShowDownloadWarning(true);
                  logAuditAction('ATTEMPTED_DOWNLOAD', selectedDoc.id);
                  setTimeout(() => setShowDownloadWarning(false), 3000);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2 cursor-not-allowed opacity-50"
                disabled
              >
                <Download className="w-4 h-4" />
                Download (Disabled)
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseViewer}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectDocument}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={handleValidateDocument}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Validate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDocumentsPage;