import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'success' | 'info';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
    },
    danger: {
      icon: XCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      confirmBg: 'bg-red-600 hover:bg-red-700',
    },
    success: {
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      confirmBg: 'bg-green-600 hover:bg-green-700',
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className={`${config.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${config.confirmBg} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component
const Demo = () => {
  const [dialogs, setDialogs] = React.useState({
    approve: false,
    reject: false,
    delete: false,
    info: false,
  });
  const [loading, setLoading] = React.useState(false);

  const openDialog = (type: keyof typeof dialogs) => {
    setDialogs({ ...dialogs, [type]: true });
  };

  const closeDialog = (type: keyof typeof dialogs) => {
    setDialogs({ ...dialogs, [type]: false });
    setLoading(false);
  };

  const handleConfirm = (type: keyof typeof dialogs) => {
    setLoading(true);
    setTimeout(() => {
      alert(`${type} confirmed!`);
      closeDialog(type);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Confirm Dialog Component
          </h1>
          <p className="text-gray-600">
            Reusable confirmation dialogs for admin actions
          </p>
        </div>

        {/* Demo Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Click to test different dialog types
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => openDialog('approve')}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Approve Verification
            </button>
            <button
              onClick={() => openDialog('reject')}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Reject Verification
            </button>
            <button
              onClick={() => openDialog('delete')}
              className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
            >
              Delete User (Warning)
            </button>
            <button
              onClick={() => openDialog('info')}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              System Info
            </button>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-100 mb-3">
            Usage Examples
          </h3>
          <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
{`// Approve Verification
<ConfirmDialog
  isOpen={showApprove}
  onClose={() => setShowApprove(false)}
  onConfirm={handleApprove}
  title="Approve Verification?"
  message="This will grant the nominee access to claim assets."
  confirmText="Approve"
  type="success"
/>

// Reject Verification
<ConfirmDialog
  isOpen={showReject}
  onClose={() => setShowReject(false)}
  onConfirm={handleReject}
  title="Reject Verification?"
  message="The nominee will be notified and can resubmit."
  confirmText="Reject"
  type="danger"
/>`}
          </pre>
        </div>

        {/* Dialogs */}
        <ConfirmDialog
          isOpen={dialogs.approve}
          onClose={() => closeDialog('approve')}
          onConfirm={() => handleConfirm('approve')}
          title="Approve Verification?"
          message="This will grant the nominee access to claim the deceased user's assets. This action will be logged."
          confirmText="Approve"
          cancelText="Cancel"
          type="success"
          isLoading={loading}
        />

        <ConfirmDialog
          isOpen={dialogs.reject}
          onClose={() => closeDialog('reject')}
          onConfirm={() => handleConfirm('reject')}
          title="Reject Verification?"
          message="The nominee will be notified and can resubmit documents with corrections. This action will be logged."
          confirmText="Reject"
          cancelText="Cancel"
          type="danger"
          isLoading={loading}
        />

        <ConfirmDialog
          isOpen={dialogs.delete}
          onClose={() => closeDialog('delete')}
          onConfirm={() => handleConfirm('delete')}
          title="Delete User Account?"
          message="This action cannot be undone. All encrypted data will be permanently deleted."
          confirmText="Delete"
          cancelText="Cancel"
          type="warning"
          isLoading={loading}
        />

        <ConfirmDialog
          isOpen={dialogs.info}
          onClose={() => closeDialog('info')}
          onConfirm={() => handleConfirm('info')}
          title="System Maintenance"
          message="The system will undergo maintenance in 24 hours. All users will be notified."
          confirmText="Acknowledge"
          cancelText="Close"
          type="info"
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default Demo;