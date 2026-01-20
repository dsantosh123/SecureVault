import React from 'react';
import { X, FileText, Download, ZoomIn, ZoomOut, Eye, Shield } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName: string;
  documentType: 'pdf' | 'image';
  metadata?: {
    uploadedBy: string;
    uploadedAt: string;
    fileSize: string;
    verificationId: string;
  };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  documentType,
  metadata,
}) => {
  const [zoom, setZoom] = React.useState(100);

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {documentName}
                </h3>
                {metadata && (
                  <p className="text-sm text-gray-600">
                    Verification ID: {metadata.verificationId}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Security Badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  View-Only Mode
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Admin Review Mode
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700 min-w-[60px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Download Disabled */}
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                disabled
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                title="Download disabled for security"
              >
                <Download className="w-4 h-4" />
                Download Disabled
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Watermark Overlay */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="transform -rotate-45 opacity-10">
                    <p className="text-6xl font-bold text-gray-900">
                      ADMIN REVIEW ONLY
                    </p>
                  </div>
                </div>

                {/* Document Display */}
                <div
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                >
                  {documentType === 'pdf' ? (
                    <iframe
                      src={documentUrl}
                      className="w-full h-[800px]"
                      title="Document Viewer"
                    />
                  ) : (
                    <img
                      src={documentUrl}
                      alt="Document"
                      className="w-full"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Footer */}
          {metadata && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Uploaded By</p>
                  <p className="font-medium text-gray-900">{metadata.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-gray-600">Upload Date</p>
                  <p className="font-medium text-gray-900">{formatDate(metadata.uploadedAt)}</p>
                </div>
                <div>
                  <p className="text-gray-600">File Size</p>
                  <p className="font-medium text-gray-900">{metadata.fileSize}</p>
                </div>
                <div>
                  <p className="text-gray-600">Format</p>
                  <p className="font-medium text-gray-900">{documentType.toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo Component
const Demo = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Viewer Component
          </h1>
          <p className="text-gray-600">
            Secure, view-only document viewer for death certificates
          </p>
        </div>

        {/* Security Features Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔒 Security Features
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">View-Only Mode</p>
                <p className="text-sm text-gray-600">Download button disabled</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Watermarked Preview</p>
                <p className="text-sm text-gray-600">Admin review watermark</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Context Menu Blocked</p>
                <p className="text-sm text-gray-600">Right-click disabled</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Audit Logged</p>
                <p className="text-sm text-gray-600">All views recorded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
        >
          Open Document Viewer Demo
        </button>

        {/* Usage Example */}
        <div className="mt-6 bg-gray-900 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-100 mb-3">
            Usage Example
          </h3>
          <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
{`<DocumentViewer
  isOpen={showViewer}
  onClose={() => setShowViewer(false)}
  documentUrl="/api/documents/view/DOC-123"
  documentName="Death Certificate.pdf"
  documentType="pdf"
  metadata={{
    uploadedBy: 'nominee@example.com',
    uploadedAt: '2024-01-15T14:30:00Z',
    fileSize: '2.4 MB',
    verificationId: 'VER-789'
  }}
/>`}
          </pre>
        </div>

        {/* Document Viewer */}
        <DocumentViewer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          documentUrl="https://via.placeholder.com/800x1000/e5e7eb/374151?text=Death+Certificate+Preview"
          documentName="Death Certificate - Sample.pdf"
          documentType="image"
          metadata={{
            uploadedBy: 'raj.sharma@example.com',
            uploadedAt: '2024-01-15T14:30:00Z',
            fileSize: '2.4 MB',
            verificationId: 'VER-789',
          }}
        />
      </div>
    </div>
  );
};

export default Demo;