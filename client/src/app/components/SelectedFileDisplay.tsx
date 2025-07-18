import React from "react";

interface SelectedFileDisplayProps {
  file: File | null;
  onDelete: () => void;
  isSample?: boolean;
}

const SelectedFileDisplay: React.FC<SelectedFileDisplayProps> = ({ file, onDelete, isSample }) => {
  const handlePreview = () => {
    window.open("/Study-Notes.pdf", "_blank");
  };

  return (
    <div className="flex items-center bg-[#f6faff] rounded-lg px-3 py-2 mt-2 border border-blue-100 min-h-[40px]">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-blue-500 mr-2"><path fill="currentColor" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83a2 2 0 0 0-.59-1.41l-4.83-4.83A2 2 0 0 0 14.17 2H6Zm6 7V3.5L18.5 10H14a2 2 0 0 1-2-2Z"/></svg>
      <span className="flex-1 text-gray-600 text-sm flex items-center gap-2">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px] sm:max-w-[300px]" title={file ? file.name : ""}>
          {file ? file.name : "No selected File"}
        </span>
        {isSample && (
          <button
            className="ml-2 text-blue-600 underline hover:text-blue-800 text-[0.8rem] cursor-pointer font-medium"
            type="button"
            onClick={handlePreview}
          >
            Preview
          </button>
        )}
      </span>
      {file && (
        <button
          className="ml-2 text-gray-400 cursor-pointer hover:text-red-500 transition"
          onClick={onDelete}
          aria-label="Remove file"
          type="button"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M7 7a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm5 1a1 1 0 0 0-2 0v8a1 1 0 1 0 2 0V8Zm4-1a1 1 0 0 0-1 1v8a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Z"/><path fill="currentColor" d="M5 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1H5V4Zm2 16a2 2 0 0 1-2-2V6h14v12a2 2 0 0 1-2 2H7Z"/></svg>
        </button>
      )}
    </div>
  );
};

export default SelectedFileDisplay; 