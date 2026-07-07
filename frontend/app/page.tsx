"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import UploadModal from "@/components/UploadModal";
import PreviewTable from "@/components/PreviewTable";
import { Upload, FileX2, Loader2, LayoutDashboard } from "lucide-react";


const chunkArray = (array: any[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export default function Home() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NEW: State to control the sidebar navigation
  const [activeTab, setActiveTab] = useState("Lead Sources");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [extractedData, setExtractedData] = useState<any[]>([]);

  const handleCsvUpload = (data: any[], extractedHeaders: string[]) => {
    setCsvData(data);
    setHeaders(extractedHeaders);
    setIsUploaded(true);
    // Auto-switch view to the table once file is uploaded
    setActiveTab("Manage Leads"); 
  };

  const handleReset = () => {
    setCsvData([]);
    setHeaders([]);
    setIsUploaded(false);
    setExtractedData([]);
    setProgress({ current: 0, total: 0 });
    setActiveTab("Lead Sources");
  };

  const handleConfirmImport = async () => {
    setIsProcessing(true);
    setProgress({ current: 0, total: csvData.length });
    
    const batches = chunkArray(csvData, 40);
    const allExtractedRecords: any[] = [];
    let processedCount = 0;

    for (const batch of batches) {
      let attempts = 0;
      let success = false;
      const maxRetries = 3;

      while (attempts < maxRetries && !success) {
        try {
          const response = await fetch("https://csv-convertor-crm.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows: batch }),
          });

          if (!response.ok) throw new Error(`Batch failed with status: ${response.status}`);

          const result = await response.json();
          if (result.success && result.data) {
            allExtractedRecords.push(...result.data);
            success = true;
          }
        } catch (error) {
          attempts++;
          if (attempts >= maxRetries) {
            console.error("Max retries reached.");
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
          }
        }
      }
      processedCount += batch.length;
      setProgress((prev) => ({ ...prev, current: processedCount }));
    }

    setExtractedData(allExtractedRecords);
    setIsProcessing(false);
  };

  const crmHeaders = [
    "created_at", "name", "email", "country_code", "mobile_without_country_code", 
    "company", "city", "state", "country", "lead_owner", "crm_status", 
    "crm_note", "data_source", "possession_time", "description"
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Dashboard Placeholder View */}
          {activeTab === "Dashboard" && (
            <div className="animate-in fade-in duration-500 flex flex-col h-[calc(100vh-4rem)] items-center justify-center text-center">
              <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-full mb-6">
                <LayoutDashboard className="text-gray-400 dark:text-gray-500" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                This is a placeholder for the main analytics dashboard. Head over to the Lead Sources tab to import your CSV files.
              </p>
              <button
                onClick={() => setActiveTab("Lead Sources")}
                className="mt-8 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition font-medium shadow-sm"
              >
                Go to Lead Sources
              </button>
            </div>
          )}
          {/* View Toggle Logic based on activeTab */}
          {activeTab === "Lead Sources" && (
            <div className="animate-in fade-in duration-500 flex flex-col h-[calc(100vh-4rem)]">
              <header className="mb-8">
                <h1 className="text-3xl font-bold">Lead Sources</h1>
                <p className="text-gray-500 mt-2">Connect, manage, and control all your lead channels from one dashboard.</p>
              </header>

              <div className="flex-1 flex items-center justify-center pb-20">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  // Added dark:border-slate-700 and dark:hover:bg-slate-800/80
                  className="w-full max-w-2xl mx-auto border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center space-y-4 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-800/80 transition cursor-pointer group"
                >
                  {/* Added dark:bg-teal-900/30 and dark:text-teal-400 */}
                  <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-full text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    {/* Added dark:text-white */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Import Leads via CSV</h3>
                    {/* Added dark:text-gray-400 */}
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Upload a CSV file to bulk import leads into your system.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === "Manage Leads" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <header className="border-b pb-6">
                <h1 className="text-3xl font-bold">Manage Your Leads</h1>
                <p className="text-gray-500 mt-2">Monitor lead status, assign tasks, and close deals faster.</p>
              </header>

              {/* Handle empty state if user clicks Manage Leads before uploading */}
              {/* Handle empty state if user clicks Manage Leads before uploading */}
              {!isUploaded ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-800 rounded-xl p-20 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-slate-900/50">
                  <FileX2 className="text-gray-400 dark:text-gray-600 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No leads to display</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 mb-6">Head over to Lead Sources to import your first CSV file.</p>
                  <button 
                    onClick={() => setActiveTab("Lead Sources")}
                    className="px-6 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium"
                  >
                    Go to Lead Sources
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {extractedData.length > 0 ? "Final CRM Records" : "Preview Raw Data"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {extractedData.length > 0 
                          ? `Successfully extracted ${extractedData.length} valid records.` 
                          : `Loaded ${csvData.length} raw rows ready for AI extraction.`}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isProcessing && (
                        <span className="text-sm font-medium text-orange-600 animate-pulse mr-4">
                          Processing AI Extraction: {progress.current} / {progress.total}
                        </span>
                      )}
                      
                      <button 
                        onClick={handleReset}
                        disabled={isProcessing}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
                      >
                        {extractedData.length > 0 ? "Start Over" : "Cancel"}
                      </button>
                      
                      {extractedData.length === 0 && (
                        <button 
                          onClick={handleConfirmImport}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium shadow-sm disabled:opacity-50 transition flex items-center justify-center min-w-[160px]"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Extracting...
                            </>
                          ) : (
                            "Confirm & Import"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                    {extractedData.length > 0 ? (
                      <PreviewTable data={extractedData} headers={crmHeaders} />
                    ) : (
                      <PreviewTable data={csvData} headers={headers} />
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUpload={handleCsvUpload} 
      />
    </div>
  );
}
