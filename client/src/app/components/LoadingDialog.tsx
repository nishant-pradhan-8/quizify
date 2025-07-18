import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useEffect, useState } from 'react';
import { studyQuotes, type StudyQuote } from '../data/Quotes';

interface LoadingDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoadingDialog({ open, onClose }: LoadingDialogProps) {
  const [quote, setQuote] = useState<StudyQuote | null>(null);

  useEffect(() => {
    if (!open) return;
    // Set an initial quote immediately
    setQuote(studyQuotes[Math.floor(Math.random() * studyQuotes.length)]);
    // Set up interval for changing quote
    const interval = setInterval(() => {
      setQuote(studyQuotes[Math.floor(Math.random() * studyQuotes.length)]);
    }, 10000);
    // Clean up interval on unmount or when dialog closes
    return () => clearInterval(interval);
  }, [open]);

  const handleDialogClose = (_event: object, reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="m-auto"
      PaperProps={{
        sx: {
          width: 780,
          minHeight: 280,
          maxWidth: '90vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <DialogContent className="flex flex-col gap-8 items-center justify-center w-full">
        <div className="loader"></div>
        <p className='text-gray-700 italic'>*Estimated Time: 1-2 Minutes</p>
        <div
          className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md shadow-sm w-full text-center flex flex-col justify-center"
          
        >
          <p className="italic text-wrap text-lg text-blue-900 mb-2">{quote ? `"${quote.quote}"` : ''}</p>
          <p className="text-sm text-blue-700 font-semibold">{quote ? `— ${quote.author}` : ''}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
