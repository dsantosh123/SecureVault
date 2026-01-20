import React from 'react';
import { X, User, FileText, CheckSquare, Eye, CheckCircle, XCircle, RefreshCw, Calendar, Mail, Phone, Shield } from 'lucide-react';

interface VerificationData {
  id: string;
  nomineeInfo: {
    name: string;
    email: string;
    phone?: string;
    relationship: string;
  };
  deceasedInfo: {
    userId: string;
    registrationDate: string;
    lastLogin: string;
    inactivityPeriod: number;
  };
  assetInfo: {
    assetId: string;
    assetType: string;
    fileCount: number;
  };
  documents: {
    deathCertificate: {
      url: string;
      uploadedAt: string;
      fileSize: string;
    };
    legalDeclaration: {
      url: string;
      uploadedAt: string;
    };
    idProof?: {
      url: string;
      uploadedAt: string;
    };
  };
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AWAITING_DOCUMENTS';
}

interface VerificationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: VerificationData;
  onApprove: (notes: string) => void;
  onReject: (reason: string, notes: string) => void;
  onRequestDocs: (message: string) => void;
  onViewDocument: (url: string, name: string) => void;
}

const VerificationReviewModal: React.FC<VerificationReviewModalProps> = ({
  isOpen,
  onClose,
  verification,
  onApprove,
  onReject,
  onRequestDocs,
  onViewDocument,
}) => {
  const [activeTab, setActiveTab] = React.useState<'info' | 'documents' | 'checklist'>('info');
  const [adminNotes, setAdminNotes] = React.useState('');
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [requestMessage, setRequestMessage] = React.useState('');
  const [showApproveConfirm, setShowApproveConfirm] = React.useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = React.useState(false);
  const [showRequestDocs, setShowRequestDocs] = React.useState(false);

  const [checklist, setChecklist] = React.useState({
    certificateLegit: false,
    identityMatch: false,
    nomineeVerified: false,
    legalSigned: false,
    noTampering: false,
    reasonableDate: false,
    noDuplicates: false,
  });

  const allChecked = Object.values(checklist).every(v => v);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabs = [
    { id: 'info', label: 'Information', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Verification Review
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                ID: {verification.id} • Submitted {formatDate(verification.submittedAt)}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Nominee Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Nominee Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900">{verification.nomineeInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Relationship</p>
                      <p className="font-medium text-gray-900">{verification.nomineeInfo.relationship}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{verification.nomineeInfo.email}</p>
                    </div>
                    {verification.nomineeInfo.phone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{verification.nomineeInfo.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deceased User Info */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    Deceased User Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-medium text-gray-900">{verification.deceasedInfo.userId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Registration Date</p>
                      <p className="font-medium text-gray-900">{formatDate(verification.deceasedInfo.registrationDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="font-medium text-gray-900">{formatDate(verification.deceasedInfo.lastLogin)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Inactivity Period Set</p>
                      <p className="font-medium text-gray-900">{verification.deceasedInfo.inactivityPeriod} days</p>
                    </div>
                  </div>
                </div>

                {/* Asset Info */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Asset Reference
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Asset ID</p>
                      <p className="font-medium text-gray-900">{verification.assetInfo.assetId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Asset Type</p>
                      <p className="font-medium text-gray-900">{verification.assetInfo.assetType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Number of Files</p>
                      <p className="font-medium text-gray-900">{verification.assetInfo.fileCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Death Certificate</h4>
                    <button
                      onClick={() => onViewDocument(verification.documents.deathCertificate.url, 'Death Certificate')}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                      View Document
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Uploaded: {formatDate(verification.documents.deathCertificate.uploadedAt)} • {verification.documents.deathCertificate.fileSize}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Legal Declaration</h4>
                    <button
                      onClick={() => onViewDocument(verification.documents.legalDeclaration.url, 'Legal Declaration')}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                      View Document
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Uploaded: {formatDate(verification.documents.legalDeclaration.uploadedAt)}
                  </p>
                </div>

                {verification.documents.idProof && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">ID Proof (Optional)</h4>
                      <button
                        onClick={() => onViewDocument(verification.documents.idProof!.url, 'ID Proof')}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                        View Document
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Uploaded: {formatDate(verification.documents.idProof.uploadedAt)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ All items must be checked before approval. This action will be logged.
                  </p>
                </div>

                {[
                  { key: 'certificateLegit', label: 'Death certificate is legitimate' },
                  { key: 'identityMatch', label: 'User identity matches certificate' },
                  { key: 'nomineeVerified', label: 'Nominee identity verified' },
                  { key: 'legalSigned', label: 'Legal declaration signed' },
                  { key: 'noTampering', label: 'No tampering detected' },
                  { key: 'reasonableDate', label: 'Reasonable death date' },
                  { key: 'noDuplicates', label: 'No duplicate requests' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist[item.key as keyof typeof checklist]}
                      onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </label>
                ))}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any additional notes about this verification..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => setShowRequestDocs(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100"
            >
              <RefreshCw className="w-4 h-4" />
              Request Re-upload
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => setShowApproveConfirm(true)}
                disabled={!allChecked}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo
const Demo = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const sampleVerification: VerificationData = {
    id: 'VER-789',
    nomineeInfo: {
      name: 'Raj Sharma',
      email: 'raj.sharma@example.com',
      phone: '+91-9876543210',
      relationship: 'Son',
    },
    deceasedInfo: {
      userId: 'U-123456',
      registrationDate: '2023-06-15T10:30:00Z',
      lastLogin: '2024-01-10T14:20:00Z',
      inactivityPeriod: 180,
    },
    assetInfo: {
      assetId: 'AST-999',
      assetType: 'Last Will & Testament',
      fileCount: 3,
    },
    documents: {
      deathCertificate: {
        url: '/api/docs/cert-123.pdf',
        uploadedAt: '2024-01-15T14:40:00Z',
        fileSize: '2.4 MB',
      },
      legalDeclaration: {
        url: '/api/docs/legal-123.pdf',
        uploadedAt: '2024-01-15T14:40:00Z',
      },
    },
    submittedAt: '2024-01-15T14:40:00Z',
    status: 'PENDING',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Verification Review Modal</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Open Review Modal
        </button>

        <VerificationReviewModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          verification={sampleVerification}
          onApprove={(notes) => alert(`Approved with notes: ${notes}`)}
          onReject={(reason, notes) => alert(`Rejected: ${reason}`)}
          onRequestDocs={(msg) => alert(`Requesting docs: ${msg}`)}
          onViewDocument={(url, name) => alert(`Viewing: ${name}`)}
        />
      </div>
    </div>
  );
};

export default Demo;