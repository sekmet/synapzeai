import React, { useCallback, useState } from "react";
import { Upload } from "lucide-react";
export function FileUploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const jsonFiles = files.filter(file => file.name.endsWith(".json"));
      if (jsonFiles.length > 0) {
        console.log("Dropped JSON files:", jsonFiles);
        // Handle the file upload here
      }
    }
  }, []);
  return <div onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-16 flex flex-col items-center justify-center text-center transition-colors
        ${isDragging ? "border-yellow-600 bg-yellow-600/5 dark:border-yellow-500 dark:bg-yellow-500/5" : "border-yellow-400/30 dark:border-yellow-400/30 hover:border-yellow-400/50 dark:hover:border-yellow-400/50"}`}>
      <Upload className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Drag & drop your .json characterfile here
      </p>
      <label className="cursor-pointer text-yellow-400 hover:underline">
        Browse to upload
        <input type="file" className="hidden" accept=".json" onChange={e => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
          console.log("Selected files:", files);
          // Handle the file upload here
        }
      }} />
      </label>
    </div>;
}