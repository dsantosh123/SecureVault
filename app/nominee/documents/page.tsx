'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, Clock, X, File } from 'lucide-react';
import { API_ENDPOINTS } from "@/lib/api-config";
import { apiGet, apiPost } from "@/lib/api-client";

// TypeScript interfaces
interface TokenData {
  valid: boolean;
  nomineeId: string;
  userId: string;
  deceasedName: string;
  nomineeNameExpected: string;
}

function DocumentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState('');

  // File upload states
  const [deathCertificate, setDeathCertificate] = useState<File | null>(null);
  const [idProof, setIdProof] = useState<File | null>(null);
  const [legalDeclaration, setLegalDeclaration] = useState(false);
  const [authorizationDeclaration, setAuthorizationDeclaration] = useState(false);

  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.push('/nominee/verify');
      return;
    }

    verifyToken(token);
  }, [searchParams, router]);

  const verifyToken = async (token: string) => {
    try {
      setLoading(true);
      const response = await apiGet<TokenData>(API_ENDPOINTS.verification.verifyToken(token));

      if (!response.success || !response.data?.valid) {
        router.push('/nominee/invalid');
        return;
      }

      setTokenData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Token verification error:', err);
      router.push('/nominee/invalid');
    }
  };

  const handleFileSelect = (file: File, type: 'death' | 'id') => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, JPG, or PNG files only.');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setError('');

    if (type === 'death') {
      setDeathCertificate(file);
    } else {
      setIdProof(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'death' | 'id') => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file, type);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'death' | 'id') => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, type);
    }
  };

  const removeFile = (type: 'death' | 'id') => {
    if (type === 'death') {
      setDeathCertificate(null);
    } else {
      setIdProof(null);
    }
  };

  const handleSubmit = async () => {
    // Validate
    if (!deathCertificate) {
      setError('Death certificate is required');
      return;
    }

    if (!legalDeclaration || !authorizationDeclaration) {
      setError('Please accept both declarations');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = searchParams.get('token');
      const formData = new FormData();
      formData.append('nomineeId', tokenData?.nomineeId || '');
      formData.append('file', deathCertificate);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiPost<any>(API_ENDPOINTS.verification.submitClaim, formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.success) {
        setError(response.error || 'Failed to upload documents');
        setSubmitting(false);
        setUploadProgress(0);
        return;
      }

      // Success - redirect to status page
      setTimeout(() => {
        router.push(`/nominee/status?token=${token}`);
      }, 1000);

    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred while uploading. Please try again.');
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleUploadLater = () => {
    const token = searchParams.get('token');
    router.push(`/nominee/status?token=${token}`);
  };

  const isFormValid = deathCertificate && legalDeclaration && authorizationDeclaration;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 2 of 4</span>
            <span className="text-sm text-gray-500">Upload Documents</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: '50%' }}></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upload Documents
            </h1>
            <p className="text-gray-600">
              Please submit the required documents for verification
            </p>
          </div>

          {/* Identity Confirmed Badge */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-green-900">Identity Confirmed</div>
                <div className="text-sm text-green-700 mt-1">
                  Verified for Deceased: <span className="font-medium">{tokenData?.deceasedName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Death Certificate Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                1. Death Certificate <span className="text-red-500">*</span> <span className="text-xs font-normal text-gray-500">(Required)</span>
              </label>

              {!deathCertificate ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'death')}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="file"
                    id="death-cert"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileInput(e, 'death')}
                    className="hidden"
                  />
                  <label htmlFor="death-cert" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-2">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-sm text-gray-500">
                      Accepted: PDF, JPG, PNG • Max size: 10MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">{deathCertificate.name}</div>
                        <div className="text-sm text-gray-500">
                          {(deathCertificate.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('death')}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ID Proof Upload (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                2. ID Proof <span className="text-xs font-normal text-gray-500">(Optional)</span>
              </label>

              {!idProof ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-gray-50 transition-all cursor-pointer">
                  <input
                    type="file"
                    id="id-proof"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileInput(e, 'id')}
                    className="hidden"
                  />
                  <label htmlFor="id-proof" className="cursor-pointer">
                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">Upload ID Proof</p>
                    <p className="text-xs text-gray-500">
                      Government ID, Passport, Driver&apos;s License
                    </p>
                  </label>
                </div>
              ) : (
                <div className="border-2 border-blue-500 bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{idProof.name}</div>
                        <div className="text-sm text-gray-500">
                          {(idProof.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('id')}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Legal Declarations */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Legal Declarations</h3>
                  <p className="text-sm text-gray-600">
                    Please confirm the authenticity of uploaded documents
                  </p>
                </div>
              </div>

              <div className="space-y-3 pl-9">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={legalDeclaration}
                    onChange={(e) => setLegalDeclaration(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I declare that the death certificate I am submitting is authentic, unaltered, and issued by a legitimate authority.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={authorizationDeclaration}
                    onChange={(e) => setAuthorizationDeclaration(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I am legally authorized to claim the deceased&apos;s assets and understand that submitting fraudulent documents is a criminal offense.
                  </span>
                </label>
              </div>
            </div>

            {/* Upload Deadline Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3 text-sm text-blue-700">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Upload Deadline</div>
                  <p className="text-xs text-blue-600">
                    You have <span className="font-semibold">14 days</span> to upload documents. If you need more time, you can upload later and return to this page.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {submitting && uploadProgress > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Uploading...</span>
                  <span className="text-sm text-gray-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-red-900">Error</div>
                    <div className="text-sm text-red-700 mt-1">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleUploadLater}
                disabled={submitting}
                className="flex-1 py-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Later
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || submitting}
                className={`flex-1 py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${isFormValid && !submitting
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Documents</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {!isFormValid && !submitting && (
              <p className="text-center text-sm text-gray-500">
                Please upload death certificate and accept all declarations
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3 text-sm text-blue-700">
              <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold mb-1">Secure Upload</div>
                <p className="text-xs text-blue-600">
                  All documents are encrypted during transfer and storage. Documents are only accessible to authorized admin reviewers and will be deleted after verification is complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NomineeDocumentsPage() {
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
      <DocumentsContent />
    </Suspense>
  );
}