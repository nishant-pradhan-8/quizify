import React from "react";

const files = [
  { label: "PNG", ext: ".png" },
  { label: "JPG", ext: ".jpg" },
  { label: "JPEG", ext: ".jpeg" },
  { label: "PDF", ext: ".pdf" },
  { label: "TIF", ext: ".tif" },
  { label: "TIFF", ext: ".tiff" },
  { label: "BMP", ext: ".bmp" },
];

const SupportedFiles = () => (
    <div className="flex flex-col text-gray-600 gap-2 font-semibold text items-center">
         <h3 className=" text-[0.8rem]">Accepted File Types</h3>
  <div className="flex flex-wrap gap-2 justify-center mt-2 text-sm text-gray-600">
   
    {files.map((file) => (
      <span
        key={file.label}
        className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 bg-gray-50"
      >
        {file.label}
      </span>
    ))}
  </div>
    </div>

);

export default SupportedFiles; 