"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster 
      position="bottom-right" 
      toastOptions={{
        style: {
          background: '#161310', // warm surface
          color: '#f7f3ec',
          border: '1px solid rgba(247,243,236,0.12)',
        },
      }} 
    />
  );
}
