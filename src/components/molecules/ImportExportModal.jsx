import React, { useState, useRef } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const ImportExportModal = ({ 
  isOpen, 
  onClose, 
  onImport, 
  onExport,
  dataType = 'data',
  allowImport = true,
  allowExport = true 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ['.csv', 'text/csv', 'application/vnd.ms-excel'];
    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    
    if (!fileName.endsWith('.csv') && !allowedTypes.includes(fileType)) {
      toast.error('Please select a CSV file');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file to import');
      return;
    }

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvData = e.target.result;
        await onImport(csvData);
        setFile(null);
        onClose();
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExport();
      onClose();
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Import/Export {dataType}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <div className="p-6">
          {allowImport && (
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Import from CSV
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-2">
                    <ApperIcon name="FileText" size={32} className="mx-auto text-green-500" />
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      onClick={clearFile}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ApperIcon name="Upload" size={32} className="mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Drag and drop a CSV file, or{' '}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-400">
                      CSV files up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          <div className="flex gap-3">
            {allowImport && (
              <Button
                onClick={handleImport}
                loading={importing}
                disabled={!file || exporting}
                variant="primary"
                icon="Upload"
                className="flex-1"
              >
                Import CSV
              </Button>
            )}
            {allowExport && (
              <Button
                onClick={handleExport}
                loading={exporting}
                disabled={importing}
                variant="secondary"
                icon="Download"
                className="flex-1"
              >
                Export CSV
              </Button>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p className="font-medium mb-1">CSV Format Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>First row must contain column headers</li>
              <li>Use commas to separate values</li>
              <li>Enclose text with commas in quotes</li>
              <li>Required fields must have values</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="ghost" onClick={onClose} disabled={importing || exporting}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;