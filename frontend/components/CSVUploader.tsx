"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { UploadCloud } from "lucide-react";

interface CSVUploaderProps {
  onUpload: (data: any[], headers: string[], file: File) => void;
}

export default function CSVUploader({ onUpload }: CSVUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        onUpload(results.data, headers, file); // <-- Add 'file' here
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Failed to parse CSV file.");
      }
    });
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: 5242880, 
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors duration-200 ease-in-out
        ${isDragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400 bg-gray-50"}
      `}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900">
        {isDragActive ? "Drop the CSV here..." : "Drop your CSV file here"}
      </h3>
      <p className="text-sm text-gray-500 mt-2">or click to browse files</p>
      <p className="text-xs text-gray-400 mt-4">Supported file: .csv (max 5MB)</p>
    </div>
  );
}