import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import CSVUploader from './CSVUploader';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any[], headers: string[]) => void;
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  // Local state to hold the preview before officially uploading
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleFileDrop = (data: any[], headers: string[], file: File) => {
    setPreviewData(data);
    setPreviewHeaders(headers);
    setSelectedFile(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setPreviewHeaders([]);
  };

  const handleConfirmUpload = () => {
    onUpload(previewData, previewHeaders);
    handleClear();
    onClose();
  };

  const handleCancel = () => {
    handleClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Import Leads via CSV</h2>
            <p className="text-sm text-gray-500 mt-1">Upload a CSV file to bulk import leads into your system.</p>
          </div>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>
        
        <div className="px-6 pb-6">
          {!selectedFile ? (
            // STATE 1: DRAG AND DROP ZONE
            <div className="mt-2">
              <CSVUploader onUpload={handleFileDrop} />
            </div>
          ) : (
            // STATE 2: PREVIEW AND CONFIRMATION (Matches your screenshot)
            <div className="animate-in fade-in zoom-in-95 duration-300">
              
              {/* File Details Card */}
              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="bg-teal-50 text-teal-600 p-3 rounded-lg flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 truncate max-w-md">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleClear}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mini Preview Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto mb-6 shadow-inner">
                <table className="w-full text-sm text-left">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr>
                      {previewHeaders.slice(0, 6).map((header, index) => (
                        <th 
                          key={index} 
                          className="px-4 py-3 text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200"
                        >
                          {header.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {/* Only show first 5 rows in the modal preview */}
                    {previewData.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {previewHeaders.slice(0, 6).map((header, colIndex) => (
                          <td key={colIndex} className="px-4 py-3 text-gray-600 truncate max-w-[150px]">
                            {row[header] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-2">
                <button 
                  onClick={handleCancel}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmUpload}
                  className="flex-1 py-3 bg-[#FF7A45] hover:bg-[#F2642A] text-white rounded-xl font-semibold transition shadow-sm"
                >
                  Upload File
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}