'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, User, Heart, CheckCircle, AlertCircle, Loader2, ArrowRight, FileText } from 'lucide-react';

// TypeScript interfaces
interface TokenData {
  valid: boolean;
  nomineeId: string;
  userId: string;
  deceasedName: string;
  nomineeNameExpected: string;
}

type RelationshipType = 'Father' | 'Mother' | 'Spouse' | 'Son' | 'Daughter' | 'Sibling' | 'Friend' | 'Other';

function IdentityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState('');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType | ''>('');
  const [otherRelationship, setOtherRelationship] = useState('');
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  
  // Validation states
  const [nameMatch, setNameMatch] = useState<boolean | null>(null);
  const [nameError, setNameError] = useState('');
  const [validating, setValidating] = useState(false);

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
      const response = await fetch(`/api/nominee/verify-token?token=${token}`);
      const data = await response.json();

      if (!response.ok || !data.valid) {
        router.push('/nominee/invalid');
        return;
      }

      setTokenData(data);
      setLoading(false);
    } catch (err) {
      console.error('Token verification error:', err);
      router.push('/nominee/invalid');
    }
  };

  // Real-time name validation
  const validateName = async (name: string) => {
    if (!name.trim() || !tokenData) return;

    setValidating(true);
    setNameError('');

    try {
      const token = searchParams.get('token');
      const response = await fetch('/api/nominee/identity/validate-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, enteredName: name })
      });

      const data = await response.json();

      if (data.match) {
        setNameMatch(true);
        setNameError('');
      } else {
        setNameMatch(false);
        setNameError(`Name does not match our records. Expected: "${data.expectedName}"`);
      }
    } catch (err) {
      console.error('Name validation error:', err);
      setNameError('Unable to validate name. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  // Debounced name validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fullName.length >= 2) {
        validateName(fullName);
      } else {
        setNameMatch(null);
        setNameError('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [fullName]);

  const handleSubmit = async () => {
    // Final validations
    if (!nameMatch) {
      setError('Please enter your name exactly as it was provided by the user');
      return;
    }

    if (!relationship) {
      setError('Please select your relationship with the deceased');
      return;
    }

    if (relationship === 'Other' && !otherRelationship.trim()) {
      setError('Please specify your relationship');
      return;
    }

    if (!checkbox1 || !checkbox2) {
      setError('Please accept both legal declarations');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = searchParams.get('token');
      const response = await fetch('/api/nominee/identity/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          fullName: fullName.trim(),
          relationship: relationship === 'Other' ? otherRelationship.trim() : relationship,
          legalAcknowledged: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to confirm identity');
        setSubmitting(false);
        return;
      }

      // Success - redirect to document upload
      router.push(`/nominee/documents?token=${token}`);
    } catch (err) {
      console.error('Identity confirmation error:', err);
      setError('An error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  const isFormValid = nameMatch && relationship && checkbox1 && checkbox2 && 
                      (relationship !== 'Other' || otherRelationship.trim());

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
            <span className="text-sm font-medium text-gray-700">Step 1 of 4</span>
            <span className="text-sm text-gray-500">Identity Confirmation</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Confirm Your Identity
            </h1>
            <p className="text-gray-600">
              Please verify your information before proceeding
            </p>
          </div>

          {/* Deceased Person Info */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Deceased Person Information
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {tokenData?.deceasedName}
                </div>
                <div className="text-xs text-gray-500">
                  (This name was provided by the user)
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name as you were added"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    nameMatch === true
                      ? 'border-green-500 bg-green-50'
                      : nameMatch === false
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {validating && (
                  <div className="absolute right-3 top-3.5">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                )}
                {nameMatch === true && !validating && (
                  <div className="absolute right-3 top-3.5">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
                {nameMatch === false && !validating && (
                  <div className="absolute right-3 top-3.5">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {nameError && (
                <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{nameError}</span>
                </div>
              )}
              {nameMatch === true && (
                <div className="mt-2 flex items-start gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Name verified successfully</span>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Enter your name exactly as it appears in the user&apos;s records
              </p>
            </div>

            {/* Relationship Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Your Relationship with Deceased <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Sibling', 'Friend', 'Other'] as RelationshipType[]).map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setRelationship(rel)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      relationship === rel
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>{rel}</span>
                  </button>
                ))}
              </div>
              
              {relationship === 'Other' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={otherRelationship}
                    onChange={(e) => setOtherRelationship(e.target.value)}
                    placeholder="Please specify your relationship"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Legal Declarations */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Legal Declaration</h3>
                  <p className="text-sm text-gray-600">
                    Please read and accept the following declarations
                  </p>
                </div>
              </div>

              <div className="space-y-3 pl-9">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkbox1}
                    onChange={(e) => setCheckbox1(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I confirm that I am the same nominee added by the deceased user and that all information provided is accurate and truthful.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkbox2}
                    onChange={(e) => setCheckbox2(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I legally acknowledge this declaration and understand that providing false information is a criminal offense and may result in legal consequences.
                  </span>
                </label>
              </div>
            </div>

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

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || submitting}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                isFormValid && !submitting
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirming Identity...</span>
                </>
              ) : (
                <>
                  <span>Continue to Document Upload</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {!isFormValid && (
              <p className="text-center text-sm text-gray-500">
                Please complete all required fields to continue
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3 text-sm text-blue-700">
              <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold mb-1">Secure & Private</div>
                <p className="text-xs text-blue-600">
                  All information is encrypted and securely stored. Your identity confirmation is logged for audit purposes and cannot be changed once submitted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NomineeIdentityPage() {
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
      <IdentityContent />
    </Suspense>
  );
}