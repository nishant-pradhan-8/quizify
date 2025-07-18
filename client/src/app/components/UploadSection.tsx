'use client';

import React, { useRef, useState, useEffect } from "react";
import SupportedFiles from "./SupportedFiles";
import axios, { AxiosError } from 'axios';
import LoadingDialog from './LoadingDialog';
import useDialog from '../hooks/useDialog';
import { useRouter } from "next/navigation";
import { useAppContext } from "../Store/Context";
import { Quiz } from "../types/type";
import SelectedFileDisplay from "./SelectedFileDisplay";
import { sampleQnQuiz } from "../data/SampleDocQuiz";
let pdfjs: typeof import("pdfjs-dist") | null = null; // Will be set only on the client

const UploadSection = () => {
  const { setQuiz } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [isSampleFile, setIsSampleFile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { open, handleClickOpen, handleClose } = useDialog();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        const pdfjsModule = await import("pdfjs-dist");
        pdfjs = pdfjsModule;
        pdfjsModule.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"; // Place worker in public/
      })();
    }
  }, []);

  const checkImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === "string") {
          img.src = e.target.result;
          img.onload = () => {
            resolve(!(img.width > 1000 || img.height > 1000));
          };
          img.onerror = () => resolve(false);
        } else {
          resolve(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const checkPDFPageCount = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          if (!e.target?.result || !pdfjs) {
            resolve(false);
            return;
          }
          const pdf = await pdfjs.getDocument({ data: e.target.result }).promise;
          resolve(pdf.numPages <= 3);
        } catch {
          resolve(false);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const validateFile = async (file: File): Promise<boolean> => {
    const acceptedTypes: string[] = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "image/tiff",
      "image/bmp",
    ];
    const maxSizeInMB: number = 1;

    if (!acceptedTypes.includes(file.type)) {
      window.alert("Unsupported File Format!");
      return false;
    }
    const uploadedFileSizeInMB = Number((file.size / (1024 * 1024)).toFixed(2));
    if (uploadedFileSizeInMB > maxSizeInMB) {
      window.alert("File Size should be less than 1MB!");
      return false;
    }
    if (file.type.startsWith("image/")) {
      const isValid = await checkImageDimensions(file);
      if (!isValid) {
        window.alert(
          "Image dimensions must be less than 1000px in both width and height"
        );
        return false;
      }
    }
    if (file.type === "application/pdf") {
      const isValid = await checkPDFPageCount(file);
      if (!isValid) {
        window.alert("PDF must not contain more than 3 pages!");
        return false;
      }
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (await validateFile(selectedFile)) {
        setFile(selectedFile);
        setIsSampleFile(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (await validateFile(droppedFile)) {
        setFile(droppedFile);
        setIsSampleFile(false);
      }
    }
  };

  const handleDelete = (): void => {
    setFile(null);
    setIsSampleFile(false);
  };

  const handleQuizGenerate = (): void => {
    if (!file) return;

    handleClickOpen();

    if(isSampleFile){
      setTimeout(()=>{
        setQuiz(sampleQnQuiz);
        router.push('/quiz')
        handleClose();
      },10000)
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quiz`, formData)
      .then((res) => {
        const parsedRes: { questions: Quiz[] } = JSON.parse(res.data.data);
        if (parsedRes.questions.length === 0) {
          window.alert(
            "The uploaded image does not contain enough content to generate a quiz."
          );
          return;
        }
        setQuiz(parsedRes.questions);
        router.push("/quiz");
      })
      .catch((e: unknown) => {
        console.log(e);
        const errMsg =
          e instanceof AxiosError
            ? e.response?.data?.message ||
              "Unable to process the document. Please try again later or select a different document."
            : "Unable to process the document. Please try again later or select a different document.";
        window.alert(errMsg);
      })
      .finally(() => handleClose());
      
  };

  const onUseSample = async () => {
    const sampleUrl = "/Study-Notes.pdf";
    try {
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const file = new File([blob], "Study-Notes.pdf", {
        type: "application/pdf",
      });
      setFile(file);
      setIsSampleFile(true);
    } catch {
      window.alert("Failed to load sample file.");
    }
  };


  return (
    <section className="w-full max-w-md flex flex-col items-center gap-4 mt-4">
      <LoadingDialog open={open} onClose={handleClose} />
      <div
        className="w-full bg-[#f6faff] border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition hover:border-blue-500 shadow-sm"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, application/pdf, image/tiff, image/bmp"
        />
        <div className="flex flex-col items-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-blue-500 mb-2"><path fill="currentColor" d="M12 16a1 1 0 0 1-1-1V7.83l-2.59 2.58a1 1 0 1 1-1.42-1.42l4.3-4.3a1 1 0 0 1 1.42 0l4.3 4.3a1 1 0 1 1-1.42 1.42L13 7.83V15a1 1 0 0 1-1 1Z"/><path fill="currentColor" d="M20 18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v1h12v-1a1 1 0 1 1 2 0v2Z"/></svg>
          <span className="text-gray-700 font-medium text-center">Browse Files to upload</span>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
   <button
  className="text-blue-600 cursor-pointer font-medium rounded transition hover:underline hover:text-blue-800"
  onClick={onUseSample}
  type="button"
>
  Use Sample File
</button>
      </div>
   
      <div className="w-full flex flex-col gap-2">
        <SelectedFileDisplay file={file} onDelete={handleDelete} isSample={isSampleFile} />
      </div>
      <button
        className={`w-full mt-3 py-2 cursor-pointer disabled:cursor-not-allowed rounded-lg font-semibold text-white transition bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-400`}
        onClick={handleQuizGenerate}
        disabled={!file}
      >
        Generate Quiz
      </button>
   
      <SupportedFiles />
     
    </section>
  );
};

export default UploadSection;