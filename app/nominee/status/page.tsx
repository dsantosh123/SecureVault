'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Shield, CheckCircle, Clock, AlertCircle, Loader2, 
  Upload, FileCheck, UserCheck, Gift, Mail, Phone,
  XCircle, RefreshCw, ArrowRight
} from 'lucide-react';

// TypeScript interfaces
interface TimelineStep {
  step: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FAILED';
  completedAt?: string;
  estimatedDays?: string;
  message?: string;
}

interface StatusData {
  status: 'IDENTITY_CONFIRMED' | 'AWAITING_DOCUMENTS' | 'DOCUMENTS_SUBMITTED' | 
          'PENDING_ADMIN_REVIEW' | 'DOCUMENTS_REQUESTED' | 'APPROVED' | 'REJECTED';
  timeline: TimelineStep[];
  verificationId: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  requestedDocuments?: string[];
  deadlineDate?: string;
  daysRemaining?: number;
  nomineeInfo: {
    name: string;
    relationship: string;
    deceasedName: string;
  };
}

function StatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      router.push('/nominee/verify');
      return;
    }

    fetchStatus(token);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStatus(token, true);
    }, 30000);

    return () => clearInterval(interval);
  }, [searchParams, router]);

  const fetchStatus = async (token: string, isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await fetch(`/api/nominee/status/get?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch status');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setStatusData(data);
      setError('');
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Status fetch error:', err);
      setError('Unable to fetch status. Please try again.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    const token = searchParams.get('token');
    if (token) {
      fetchStatus(token);
    }
  };

  const handleUploadDocuments = () => {
    const token = searchParams.get('token');
    router.push(`/nominee/documents?token=${token}`);
  };

  const getStatusIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'IN_PROGRESS':
        return <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'FAILED':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 border-green-500';
      case 'IN_PROGRESS':
        return 'bg-blue-100 border-blue-500';
      case 'FAILED':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string; icon: any }> = {
      IDENTITY_CONFIRMED: { color: 'bg-blue-100 text-blue-800', text: 'Identity Confirmed', icon: UserCheck },
      AWAITING_DOCUMENTS: { color: 'bg-amber-100 text-amber-800', text: 'Documents Pending', icon: Clock },
      DOCUMENTS_SUBMITTED: { color: 'bg-purple-100 text-purple-800', text: 'Documents Submitted', icon: FileCheck },
      PENDING_ADMIN_REVIEW: { color: 'bg-yellow-100 text-yellow-800', text: 'Under Review', icon: Loader2 },
      DOCUMENTS_REQUESTED: { color: 'bg-orange-100 text-orange-800', text: 'Additional Documents Required', icon: Upload },
      APPROVED: { color: 'bg-green-100 text-green-800', text: 'Approved', icon: CheckCircle },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Rejected', icon: XCircle }
    };

    const badge = badges[status] || badges.AWAITING_DOCUMENTS;
    const Icon = badge.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${badge.color}`}>
        <Icon className="w-5 h-5" />
        <span>{badge.text}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading Status...</h2>
          <p className="text-gray-600 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !statusData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleManualRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Verification Status
              </h1>
              <p className="text-gray-600">
                Track your verification progress in real-time
              </p>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh status"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Current Status Badge */}
          <div className="mb-6">
            {getStatusBadge(statusData.status)}
          </div>

          {/* Nominee Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Your Name</div>
                <div className="font-semibold text-gray-900">{statusData.nomineeInfo.name}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Relationship</div>
                <div className="font-semibold text-gray-900">{statusData.nomineeInfo.relationship}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Deceased Person</div>
                <div className="font-semibold text-gray-900">{statusData.nomineeInfo.deceasedName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Timeline</h2>
          
          <div className="space-y-6">
            {statusData.timeline.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < statusData.timeline.length - 1 && (
                  <div className="absolute left-[23px] top-12 w-0.5 h-12 bg-gray-300"></div>
                )}

                <div className={`border-2 rounded-xl p-5 ${getStatusColor(step.status)}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900">{step.step}</h3>
                        {step.completedAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(step.completedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      {step.message && (
                        <p className="text-sm text-gray-700">{step.message}</p>
                      )}
                      {step.status === 'IN_PROGRESS' && step.estimatedDays && (
                        <div className="mt-2 text-sm text-blue-700 font-medium">
                          Estimated: {step.estimatedDays}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status-specific Cards */}
        
        {/* Awaiting Documents */}
        {statusData.status === 'AWAITING_DOCUMENTS' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-start gap-4">
              <Upload className="w-12 h-12 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Documents Pending
                </h2>
                <p className="text-gray-600 mb-4">
                  Please upload your death certificate to continue the verification process.
                </p>
                {statusData.daysRemaining !== undefined && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-amber-800">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">
                        {statusData.daysRemaining} days remaining
                      </span>
                      {statusData.deadlineDate && (
                        <span className="text-sm">
                          (Deadline: {new Date(statusData.deadlineDate).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleUploadDocuments}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Documents Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Admin Review */}
        {statusData.status === 'PENDING_ADMIN_REVIEW' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-start gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Under Admin Review
                </h2>
                <p className="text-gray-600 mb-4">
                  Your documents have been submitted successfully. Our admin team is currently reviewing your verification request.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Typical review time: 2-3 business days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>You&apos;ll receive email updates on status changes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>This page auto-refreshes every 30 seconds</span>
                    </div>
                  </div>
                </div>
                {statusData.submittedAt && (
                  <div className="mt-4 text-sm text-gray-500">
                    Submitted: {new Date(statusData.submittedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Documents Requested */}
        {statusData.status === 'DOCUMENTS_REQUESTED' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-12 h-12 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Additional Documents Required
                </h2>
                <p className="text-gray-600 mb-4">
                  The admin team needs additional documentation to complete your verification.
                </p>
                {statusData.requestedDocuments && statusData.requestedDocuments.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <div className="font-semibold text-orange-900 mb-2">Required Documents:</div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-orange-800">
                      {statusData.requestedDocuments.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={handleUploadDocuments}
                  className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Re-upload Documents</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approved */}
        {statusData.status === 'APPROVED' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verification Approved! 🎉
                </h2>
                <p className="text-gray-600 mb-4">
                  Congratulations! Your verification has been approved. You can now claim the deceased&apos;s assets.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="space-y-2 text-sm text-green-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Your identity has been verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4" />
                      <span>Documents authenticated successfully</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      <span>Assets are now available for claiming</span>
                    </div>
                  </div>
                </div>
                {statusData.reviewedAt && (
                  <div className="text-sm text-gray-500 mb-4">
                    Approved on: {new Date(statusData.reviewedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
                <button
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Gift className="w-5 h-5" />
                  <span>Claim Assets</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejected */}
        {statusData.status === 'REJECTED' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-start gap-4">
              <XCircle className="w-12 h-12 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Verification Rejected
                </h2>
                <p className="text-gray-600 mb-4">
                  Unfortunately, your verification request could not be approved at this time.
                </p>
                {statusData.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="font-semibold text-red-900 mb-2">Reason for Rejection:</div>
                    <p className="text-sm text-red-800">{statusData.rejectionReason}</p>
                  </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="font-semibold text-blue-900 mb-2">What you can do:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                    <li>Review the rejection reason above</li>
                    <li>Gather the correct documents</li>
                    <li>Submit a new verification request</li>
                    <li>Contact support if you need assistance</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleUploadDocuments}
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Resubmit with Corrections
                  </button>
                  <button
                    onClick={() => window.location.href = 'mailto:support@securevault.com'}
                    className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Contact Support</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reference ID */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Verification Reference ID</div>
              <div className="font-mono font-semibold text-gray-900">{statusData.verificationId}</div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(statusData.verificationId)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              Copy ID
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Use this reference ID when contacting support
          </p>
        </div>

        {/* Support Contact */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Need help?</p>
          <button
            onClick={() => window.location.href = 'mailto:support@securevault.com'}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NomineeStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600 mt-2">Please wait</p>
        </div>
      </div>
    }>
      <StatusContent />
    </Suspense>
  );
}