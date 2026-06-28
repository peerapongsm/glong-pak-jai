'use client';
import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/glong-pak-jai/sw.js').catch(() => {});
    }
  }, []);
  return null;
}
