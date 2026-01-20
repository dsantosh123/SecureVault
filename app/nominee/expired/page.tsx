'use client';

import { Clock, Mail, AlertTriangle, RefreshCw } from 'lucide-react';

export default function NomineeExpiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Link Expired
          </h1>
          <p className="text-gray-600">
            This verification link has expired
          </p>
        </div>

        {/* Explanation */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-orange-900 mb-2">Why did this happen?</div>
              <p className="text-sm text-orange-800">
                Verification links expire after <span className="font-bold">10 minutes</span> to protect your security and prevent unauthorized access to sensitive information.
              </p>
            </div>
          </div>
        </div>

        {/* What to do next */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <div className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <span>What to do next:</span>
          </div>
          <ol className="space-y-3">
            <li className="flex gap-3 text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span className="pt-0.5">
                Check your email inbox for a <span className="font-semibold">new verification link</span>
              </span>
            </li>
            <li className="flex gap-3 text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span className="pt-0.5">
                If you don&apos;t see a new email, check your <span className="font-semibold">spam folder</span>
              </span>
            </li>
            <li className="flex gap-3 text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span className="pt-0.5">
                Contact our support team if you need a new link or assistance
              </span>
            </li>
          </ol>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2 text-sm text-blue-700">
            <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Expected a new link?</div>
              <p className="text-xs text-blue-600">
                New verification links are typically sent automatically when the previous one expires. Please allow a few minutes for the email to arrive.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = 'mailto:support@securevault.com?subject=Expired Verification Link&body=Hello, my verification link has expired and I need assistance.'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Mail className="w-5 h-5" />
            <span>Contact Support</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh Page</span>
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            For immediate assistance, email us at{' '}
            <a 
              href="mailto:support@securevault.com" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@securevault.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}