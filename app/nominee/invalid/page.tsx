'use client';

import { XCircle, Mail, AlertCircle, Copy, RefreshCw, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function NomineeInvalidPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@securevault.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Invalid Link
          </h1>
          <p className="text-gray-600">
            This verification link is not valid
          </p>
        </div>

        {/* Possible Reasons */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-900 mb-2">Possible reasons:</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-red-800 ml-9">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Link has already been used (one-time access only)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Link is incomplete or corrupted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Link was revoked or cancelled by the system</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Link was copied incorrectly from the email</span>
            </li>
          </ul>
        </div>

        {/* What to do next */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
          <div className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <span>What to do next:</span>
          </div>
          <ol className="space-y-3">
            <li className="flex gap-3 text-blue-800">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span className="pt-0.5 text-sm">
                Go back to your <span className="font-semibold">email inbox</span> and find the verification link
              </span>
            </li>
            <li className="flex gap-3 text-blue-800">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span className="pt-0.5 text-sm">
                Make sure you <span className="font-semibold">copied the complete link</span> without any missing characters
              </span>
            </li>
            <li className="flex gap-3 text-blue-800">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span className="pt-0.5 text-sm">
                Try <span className="font-semibold">clicking the link directly</span> from your email instead of copying
              </span>
            </li>
            <li className="flex gap-3 text-blue-800">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span className="pt-0.5 text-sm">
                If the problem persists, contact support for a new verification link
              </span>
            </li>
          </ol>
        </div>

        {/* Important Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2 text-sm text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
            <div>
              <div className="font-semibold mb-1">💡 Pro Tip</div>
              <p className="text-xs text-amber-700">
                Don&apos;t manually type the verification link. Always click it directly from your email or copy-paste the entire URL to avoid errors.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = 'mailto:support@securevault.com?subject=Invalid Verification Link&body=Hello, I received an invalid verification link error. Please send me a new link.%0D%0A%0D%0AThank you.'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Mail className="w-5 h-5" />
            <span>Request New Link</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>

        {/* Support Contact */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500 mb-3">
            Need immediate assistance?
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-700">Email:</span>
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>support@securevault.com</span>
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-center text-xs text-green-600 mt-2">
              ✓ Email copied to clipboard
            </p>
          )}
        </div>
      </div>
    </div>
  );
}