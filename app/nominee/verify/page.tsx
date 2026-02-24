'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, CheckCircle, XCircle, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { API_ENDPOINTS } from "@/lib/api-config";
import { apiGet } from "@/lib/api-client";

// Define TypeScript interfaces
interface TokenData {
  valid: boolean;
  expiresAt: string;
  nomineeId: string;
  userId: string;
  deceasedName: string;
  nomineeNameExpected: string;
}

type Status = 'validating' | 'valid' | 'expired' | 'invalid' | 'error';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>('validating');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('invalid');
      setErrorMessage('No verification token provided');
      return;
    }

    validateToken(token);
  }, [searchParams]);

  // Countdown timer for token expiry
  useEffect(() => {
    if (tokenData?.expiresAt && status === 'valid') {
      const interval = setInterval(() => {
        const now = new Date();
        const expiry = new Date(tokenData.expiresAt);
        const diff = expiry.getTime() - now.getTime();

        if (diff <= 0) {
          clearInterval(interval);
          router.push('/nominee/expired');
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tokenData, status, router]);

  const validateToken = async (token: string) => {
    try {
      setStatus('validating');

      const response = await apiGet<TokenData>(API_ENDPOINTS.verification.verifyToken(token));

      if (!response.success) {
        setStatus('invalid');
        setErrorMessage(response.error || 'Invalid verification link');
        return;
      }

      const data = response.data;
      if (data && data.valid) {
        setStatus('valid');
        setTokenData(data);

        // Auto-redirect to identity confirmation after 2 seconds
        setTimeout(() => {
          router.push(`/nominee/identity?token=${token}`);
        }, 2000);
      } else {
        setStatus('invalid');
        setErrorMessage('Token validation failed');
      }

    } catch (error) {
      console.error('Token validation error:', error);
      setStatus('error');
      setErrorMessage('Unable to connect to server. Please try again.');
    }
  };

  // Validating State
  if (status === 'validating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Validating Your Link
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your access...
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Lock className="w-4 h-4" />
              <span>Secure verification in progress</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Valid State - Preparing to redirect
  if (status === 'valid' && tokenData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Link Valid
            </h1>
            <p className="text-gray-600">
              Your identity verification link has been confirmed
            </p>
          </div>

          {/* Deceased User Info Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-500 mb-1">Deceased Person:</div>
            <div className="text-lg font-semibold text-gray-900">
              {tokenData.deceasedName}
            </div>
          </div>

          {/* Time Remaining */}
          {timeRemaining && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-amber-800">
                <Clock className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Session Active</div>
                  <div className="text-sm">Time remaining: {timeRemaining}</div>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2 text-sm text-blue-700">
              <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold mb-1">Secure Verification Process</div>
                <ul className="text-xs space-y-1">
                  <li>• This link expires in 10 minutes</li>
                  <li>• One-time use only for security</li>
                  <li>• All actions are logged and auditable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Auto-redirect notice */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to identity confirmation...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expired State
  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Link Expired
            </h1>
            <p className="text-gray-600">
              This verification link has expired for security reasons
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-orange-800">
              <div className="font-semibold mb-2">Why did this happen?</div>
              <p>
                Verification links expire after 10 minutes to protect your security and prevent unauthorized access.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">
                What to do next:
              </div>
              <ol className="text-sm text-gray-600 space-y-2">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Check your email for a new verification link</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <span>If you don&apos;t see a new email, check your spam folder</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Contact support if you need assistance</span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => window.location.href = 'mailto:support@securevault.com'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Invalid State
  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Link
            </h1>
            <p className="text-gray-600">
              This verification link is not valid
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-red-800">
                <div className="font-semibold mb-1">Error Details:</div>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-800">
              <div className="font-semibold mb-2">Possible reasons:</div>
              <ul className="space-y-1 text-gray-600">
                <li>• Link has already been used</li>
                <li>• Link is incomplete or corrupted</li>
                <li>• Link was revoked or cancelled</li>
                <li>• Link was copied incorrectly from email</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">
                What to do next:
              </div>
              <ol className="text-sm text-gray-600 space-y-2">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Go back to your email and find the verification link</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Make sure you copied the complete link</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Try clicking the link directly from your email</span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => window.location.href = 'mailto:support@securevault.com'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Connection Error
          </h1>
          <p className="text-gray-600">
            Unable to verify your link at this time
          </p>
        </div>

        {errorMessage && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-700">
              {errorMessage}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.href = 'mailto:support@securevault.com'}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NomineeVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}