"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster 
      position="bottom-right" 
      toastOptions={{
        style: {
          background: '#18181b', // zinc-900
          color: '#fff',
          border: '1px solid #27272a', // zinc-800
        },
      }} 
    />
  );
}
